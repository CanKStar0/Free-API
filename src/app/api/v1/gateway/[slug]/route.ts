import { NextRequest, NextResponse } from 'next/server';
import { getApiBySlug } from '@/lib/api-slugs';
import { hasLocalDataset, queryLocalDataset } from '@/lib/db/dataset-store';
import { isDatasetFresh, syncDatasetFromUpstream } from '@/lib/db/semi-static-sync';
import { getDatasetTtl } from '@/lib/db/ttl-registry';
import { GatewayResponse } from '@/types/database';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-freeapi-key',
    'X-Powered-By': 'FreeAPI-Smart-Gateway-v1',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

function isSafeUrl(targetUrl: string): boolean {
  try {
    const parsed = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const hostname = parsed.hostname.toLowerCase();

    // SSRF Prevention
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('169.254.')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();
  const { slug } = await context.params;
  const { searchParams } = new URL(req.url);

  // Optional API Key check (for telemetry and rate limiting)
  const apiKey = req.headers.get('x-freeapi-key') || searchParams.get('apiKey') || 'fapi_live_anonymous';
  const forceFresh = searchParams.get('fresh') === 'true';

  // 1. FRESHNESS VALIDATION & LOCAL DATASET ENGINE (0-2ms Latency)
  // If the dataset exists AND its custom TTL is not expired:
  if (hasLocalDataset(slug) && isDatasetFresh(slug) && !forceFresh) {
    const search = searchParams.get('search') || searchParams.get('q') || undefined;
    const field = searchParams.get('field') || undefined;
    const value = searchParams.get('value') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = searchParams.get('sortBy') || undefined;
    const order = (searchParams.get('order') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';

    const result = queryLocalDataset(slug, {
      search,
      field,
      value,
      page,
      limit,
      sortBy,
      order,
    });

    if (result) {
      const ttl = getDatasetTtl(slug);
      const responsePayload: GatewayResponse = {
        success: true,
        gateway: 'FreeAPI Edge Gateway v1.0',
        source: 'local_dataset',
        service: slug,
        latency_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
        data: result.data,
      };

      return NextResponse.json(responsePayload, {
        status: 200,
        headers: {
          ...getCorsHeaders(),
          'Cache-Control': `public, s-maxage=${Math.min(ttl, 300)}, stale-while-revalidate=${ttl}`,
          'X-Dataset-Source': 'local_database_jsonb',
          'X-Dataset-Freshness': 'fresh',
        },
      });
    }
  }

  // 2. LIVE SYNC ENGINE (Never serve stale data: Sync directly from upstream and update DB)
  try {
    const syncedDataset = await syncDatasetFromUpstream(slug);
    if (syncedDataset) {
      const search = searchParams.get('search') || searchParams.get('q') || undefined;
      const field = searchParams.get('field') || undefined;
      const value = searchParams.get('value') || undefined;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const sortBy = searchParams.get('sortBy') || undefined;
      const order = (searchParams.get('order') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';

      const result = queryLocalDataset(slug, {
        search,
        field,
        value,
        page,
        limit,
        sortBy,
        order,
      });

      if (result) {
        const responsePayload: GatewayResponse = {
          success: true,
          gateway: 'FreeAPI Edge Gateway v1.0',
          source: 'upstream_synced',
          service: slug,
          latency_ms: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
          data: result.data,
        };

        return NextResponse.json(responsePayload, {
          status: 200,
          headers: {
            ...getCorsHeaders(),
            'Cache-Control': `public, s-maxage=${Math.min(getDatasetTtl(slug), 300)}`,
            'X-Dataset-Source': 'upstream_live_sync',
            'X-Dataset-Freshness': 'live_refreshed',
          },
        });
      }
    }
  } catch (syncErr: any) {
    console.error(`⚠️ [Gateway] Live sync attempt failed for ${slug}:`, syncErr.message);
  }

  // 3. FALLBACK TO GENERIC UPSTREAM SERVICE PROXY
  const api = getApiBySlug(slug);

  if (!api) {
    const errorPayload: GatewayResponse = {
      success: false,
      gateway: 'FreeAPI Edge Gateway v1.0',
      source: 'upstream_proxy',
      service: slug,
      latency_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      error: `API service "${slug}" not found in catalogue or dataset registry.`,
    };

    return NextResponse.json(errorPayload, {
      status: 404,
      headers: getCorsHeaders(),
    });
  }

  // Forwarding to external API
  const targetBaseUrl = api.url;
  if (!isSafeUrl(targetBaseUrl)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Target URL failed security and SSRF validation.',
      },
      { status: 400, headers: getCorsHeaders() }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const forwardUrl = new URL(targetBaseUrl);
    searchParams.forEach((val, key) => {
      if (key !== 'apiKey' && key !== 'fresh') {
        forwardUrl.searchParams.set(key, val);
      }
    });

    const upstreamResponse = await fetch(forwardUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'FreeAPI-Gateway/1.0 (+https://freeapi.website)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = upstreamResponse.headers.get('content-type') || '';
    let upstreamData: any;

    if (contentType.includes('application/json')) {
      upstreamData = await upstreamResponse.json();
    } else {
      const text = await upstreamResponse.text();
      try {
        upstreamData = JSON.parse(text);
      } catch {
        upstreamData = { raw: text.slice(0, 5000) };
      }
    }

    const gatewayResponse: GatewayResponse = {
      success: upstreamResponse.ok,
      gateway: 'FreeAPI Edge Gateway v1.0',
      source: 'upstream_proxy',
      service: slug,
      latency_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      data: upstreamData,
    };

    return NextResponse.json(gatewayResponse, {
      status: upstreamResponse.status,
      headers: {
        ...getCorsHeaders(),
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    const errorPayload: GatewayResponse = {
      success: false,
      gateway: 'FreeAPI Edge Gateway v1.0',
      source: 'upstream_proxy',
      service: slug,
      latency_ms: latency,
      timestamp: new Date().toISOString(),
      error: err.name === 'AbortError' ? 'Upstream request timed out (8s)' : (err.message || 'Connection error to upstream API'),
    };

    return NextResponse.json(errorPayload, {
      status: 504,
      headers: getCorsHeaders(),
    });
  }
}
