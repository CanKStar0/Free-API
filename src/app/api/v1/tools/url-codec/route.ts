import { NextRequest, NextResponse } from 'next/server';

function parseUrlDetails(urlStr: string) {
  try {
    let fullUrl = urlStr;
    if (!/^https?:\/\//i.test(urlStr)) {
      fullUrl = 'https://' + urlStr;
    }
    const urlObj = new URL(fullUrl);
    const searchParams: Record<string, string> = {};
    urlObj.searchParams.forEach((val, key) => {
      searchParams[key] = val;
    });

    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port || undefined,
      pathname: urlObj.pathname,
      search: urlObj.search,
      searchParams,
      hash: urlObj.hash || undefined,
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const input = body.url ?? body.text ?? body.input ?? '';
    const action = body.action === 'decode' ? 'decode' : body.action === 'parse' ? 'parse' : 'encode';

    if (input === undefined || input === null) {
      return NextResponse.json(
        { status: 'error', message: 'URL/Metin girdisi gereklidir.' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const inputStr = String(input);
    let result = '';
    let parsed: any = null;

    if (action === 'encode') {
      result = encodeURIComponent(inputStr);
    } else if (action === 'decode') {
      result = decodeURIComponent(inputStr);
    } else {
      result = inputStr;
    }

    parsed = parseUrlDetails(action === 'decode' ? result : inputStr);

    return NextResponse.json(
      {
        status: 'success',
        action,
        input: inputStr,
        result,
        parsed,
        _meta: {
          provider: 'FreeAPI Dev Gateway',
          docs: 'https://freeapi.website/tools/url-codec',
        },
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: 'URL dönüştürme hatası', error: err.message },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get('url') || searchParams.get('text') || searchParams.get('data') || '';
  const action = searchParams.get('action') === 'decode' ? 'decode' : searchParams.get('action') === 'parse' ? 'parse' : 'encode';

  let result = '';
  try {
    if (action === 'encode') {
      result = encodeURIComponent(input);
    } else if (action === 'decode') {
      result = decodeURIComponent(input);
    } else {
      result = input;
    }

    const parsed = parseUrlDetails(action === 'decode' ? result : input);

    return NextResponse.json(
      {
        status: 'success',
        action,
        input,
        result,
        parsed,
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: 'URL dönüştürme hatası', error: err.message },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
