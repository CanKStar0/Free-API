import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// UUID v7 Generator (RFC 9562)
function generateUuidV7(): string {
  const value = new Uint8Array(16);
  crypto.getRandomValues(value);

  const timestamp = Date.now();

  // Timestamp in big-endian 48-bit
  value[0] = (timestamp / 0x10000000000) & 0xff;
  value[1] = (timestamp / 0x100000000) & 0xff;
  value[2] = (timestamp / 0x1000000) & 0xff;
  value[3] = (timestamp / 0x10000) & 0xff;
  value[4] = (timestamp / 0x100) & 0xff;
  value[5] = timestamp & 0xff;

  // Version 7: 0111 in bits 4-7 of octet 6
  value[6] = (value[6] & 0x0f) | 0x70;
  // Variant: 10 in bits 6-7 of octet 8
  value[8] = (value[8] & 0x3f) | 0x80;

  const hex = Array.from(value, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const version = searchParams.get('version') === 'v7' ? 'v7' : 'v4';
  const rawCount = parseInt(searchParams.get('count') || '1', 10);
  const count = Math.min(Math.max(isNaN(rawCount) ? 1 : rawCount, 1), 100);
  const uppercase = searchParams.get('uppercase') === 'true';
  const format = searchParams.get('format') || 'json';

  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    let id = version === 'v7' ? generateUuidV7() : crypto.randomUUID();
    if (uppercase) id = id.toUpperCase();
    uuids.push(id);
  }

  if (format === 'plain' || format === 'text') {
    return new NextResponse(uuids.join('\n'), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return NextResponse.json(
    {
      status: 'success',
      version,
      count,
      data: uuids.length === 1 ? uuids[0] : uuids,
      items: uuids,
      timestamp: Date.now(),
      _meta: {
        provider: 'FreeAPI Dev Gateway',
        docs: 'https://freeapi.website/tools/uuid-generator',
      },
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
