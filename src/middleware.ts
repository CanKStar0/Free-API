import { NextRequest, NextResponse } from 'next/server';
import { isIpBanned, checkRateLimit, BLOCKED_USER_AGENTS } from '@/lib/security';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets, Next.js internal files, favicon, icons, and auth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') || // images, fonts, favicon
    req.nextUrl.searchParams.has('_rsc') // Next.js RSC prefetch requests
  ) {
    return NextResponse.next();
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const userAgent = (req.headers.get('user-agent') || '').toLowerCase();

  // 1. Check if IP is in blacklist
  if (isIpBanned(ip)) {
    return new NextResponse('Access Denied: Your IP has been temporarily blacklisted due to suspicious activity.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // 2. Check for Automated Scraper / AI Harvester User-Agents
  const isBlockedAgent = BLOCKED_USER_AGENTS.some((agent) => userAgent.includes(agent));
  if (isBlockedAgent) {
    return new NextResponse('Automated scraping is prohibited on FreeAPI.dev.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noai, noimageai',
      },
    });
  }

  // 3. Sliding Window Rate Limiting (40 requests per 2 seconds per IP)
  const isAllowed = checkRateLimit(ip, 40, 2000);
  if (!isAllowed) {
    return new NextResponse('Rate limit exceeded: Too many requests. Please slow down.', {
      status: 429,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '60',
      },
    });
  }

  const response = NextResponse.next();

  // 4. Inject Anti-AI and Anti-Scraper Security Headers
  response.headers.set('X-Robots-Tag', 'noai, noimageai');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
