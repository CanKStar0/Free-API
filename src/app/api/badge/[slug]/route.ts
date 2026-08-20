import { NextRequest, NextResponse } from 'next/server';
import { getApiBySlug } from '@/lib/api-slugs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const api = getApiBySlug(slug);

  const label = 'FreeAPI';
  const status = api ? `${api.name} • Verified Free` : 'Verified Free API';

  // Calculate width based on text length
  const labelWidth = label.length * 7 + 20;
  const statusWidth = status.length * 7 + 22;
  const totalWidth = labelWidth + statusWidth;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="28" viewBox="0 0 ${totalWidth} 28" fill="none" role="img" aria-label="${label}: ${status}">
    <linearGradient id="g" x2="0" y2="100%">
      <stop offset="0" stop-color="#fff" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <clipPath id="r">
      <rect width="${totalWidth}" height="28" rx="6" fill="#fff"/>
    </clipPath>
    <g clip-path="url(#r)">
      <rect width="${labelWidth}" height="28" fill="#e11d48"/>
      <rect x="${labelWidth}" width="${statusWidth}" height="28" fill="#18181b"/>
      <rect width="${totalWidth}" height="28" fill="url(#g)"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-rendering="geometricPrecision" font-size="11" font-weight="700">
      <text x="${labelWidth / 2}" y="18" fill="#000" opacity=".2">${label}</text>
      <text x="${labelWidth / 2}" y="17" fill="#ffffff">${label}</text>
      <text x="${labelWidth + statusWidth / 2}" y="18" fill="#000" opacity=".4" font-weight="500">${status}</text>
      <text x="${labelWidth + statusWidth / 2}" y="17" fill="#34d399" font-weight="600">${status}</text>
    </g>
  </svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
