import { NextRequest, NextResponse } from 'next/server';
import { banIp } from '@/lib/security';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown-crawler';
  
  // Ban the crawler IP
  banIp(ip);
  console.warn(`🚨 HONEYPOT TRAP TRIGGERED: Scraper IP ${ip} has been banned.`);

  return NextResponse.json(
    {
      error: 'Security alert: Automated web scraper detected. Your IP has been blacklisted.',
      status: 403,
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  );
}
