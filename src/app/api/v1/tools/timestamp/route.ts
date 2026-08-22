import { NextRequest, NextResponse } from 'next/server';

function formatRelativeTime(targetDate: Date, now: Date = new Date()): string {
  const diffSec = Math.round((targetDate.getTime() - now.getTime()) / 1000);
  const absDiff = Math.abs(diffSec);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (absDiff < 60) return rtf.format(diffSec, 'second');
  if (absDiff < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (absDiff < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (absDiff < 2592000) return rtf.format(Math.round(diffSec / 86400), 'day');
  if (absDiff < 31536000) return rtf.format(Math.round(diffSec / 2592000), 'month');
  return rtf.format(Math.round(diffSec / 31536000), 'year');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawValue = searchParams.get('value') || searchParams.get('t') || '';

  let date: Date;

  if (!rawValue) {
    date = new Date();
  } else if (/^\d+$/.test(rawValue)) {
    const num = parseInt(rawValue, 10);
    // If 10 digits -> seconds, if 13 digits -> milliseconds
    if (rawValue.length <= 11) {
      date = new Date(num * 1000);
    } else {
      date = new Date(num);
    }
  } else {
    date = new Date(rawValue);
  }

  if (isNaN(date.getTime())) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Geçersiz tarih veya timestamp formatı.',
      },
      {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }

  const now = new Date();
  const timestampMs = date.getTime();
  const timestampSeconds = Math.floor(timestampMs / 1000);

  return NextResponse.json(
    {
      status: 'success',
      timestampSeconds,
      timestampMilliseconds: timestampMs,
      iso8601: date.toISOString(),
      utcString: date.toUTCString(),
      localString: date.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }) + ' (TR/GMT+3)',
      dateOnly: date.toISOString().split('T')[0],
      timeOnly: date.toISOString().split('T')[1].replace('Z', ''),
      relativeTime: formatRelativeTime(date, now),
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
      isLeapYear: (date.getUTCFullYear() % 4 === 0 && date.getUTCFullYear() % 100 !== 0) || date.getUTCFullYear() % 400 === 0,
      _meta: {
        provider: 'FreeAPI Dev Gateway',
        docs: 'https://freeapi.website/tools/timestamp-converter',
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
