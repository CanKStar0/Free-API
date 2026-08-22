import { NextRequest, NextResponse } from 'next/server';

function isSafeUrl(targetUrl: string): boolean {
  try {
    const parsed = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const hostname = parsed.hostname.toLowerCase();
    
    // Block internal network / SSRF attempts
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
      { operational: false, error: 'Geçersiz veya güvenli olmayan URL.' },
      { status: 400 }
    );
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'FreeAPI-HealthChecker/1.0 (+https://freeapi.website)',
        'Accept': 'application/json, text/plain, */*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    // Any response code < 500 (even 401/403/404) means the server is UP and Operational
    const isOperational = response.status < 500;

    return NextResponse.json({
      operational: isOperational,
      status: response.status,
      latency,
      checkedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    return NextResponse.json({
      operational: false,
      error: err.name === 'AbortError' ? 'Zaman Aşımı (Timeout)' : 'Bağlantı Başarısız',
      latency,
      checkedAt: new Date().toISOString(),
    });
  }
}
