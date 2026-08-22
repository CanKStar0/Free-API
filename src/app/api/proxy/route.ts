import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl || !isSafeUrl(targetUrl)) {
    return NextResponse.json(
      { error: 'Geçersiz veya engellenmiş URL adresi.' },
      { status: 400 }
    );
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FreeAPI-Sandbox-Proxy/1.0 (+https://freeapi.website)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || '';

    let data: any;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { raw: text.substring(0, 1000) };
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      latency: `${latency}ms`,
      data,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    return NextResponse.json(
      {
        success: false,
        error: err.name === 'AbortError' ? 'İstek zaman aşımına uğradı (Timeout)' : (err.message || 'Bağlantı hatası'),
        latency: `${latency}ms`,
      },
      { status: 504 }
    );
  }
}
