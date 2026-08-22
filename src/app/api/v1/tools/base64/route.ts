import { NextRequest, NextResponse } from 'next/server';

function encodeBase64(text: string, urlSafe: boolean = false): string {
  let b64 = Buffer.from(text, 'utf-8').toString('base64');
  if (urlSafe) {
    b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return b64;
}

function decodeBase64(b64: string, urlSafe: boolean = false): string {
  let standardB64 = b64;
  if (urlSafe || standardB64.includes('-') || standardB64.includes('_')) {
    standardB64 = standardB64.replace(/-/g, '+').replace(/_/g, '/');
    while (standardB64.length % 4) {
      standardB64 += '=';
    }
  }
  return Buffer.from(standardB64, 'base64').toString('utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const text = body.text ?? body.data ?? body.input ?? '';
    const action = body.action === 'decode' ? 'decode' : 'encode';
    const urlSafe = body.urlSafe === true || body.url_safe === true;

    if (!text && text !== '') {
      return NextResponse.json(
        { status: 'error', message: 'Metin (text) parametresi gereklidir.' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    let result = '';
    if (action === 'encode') {
      result = encodeBase64(String(text), urlSafe);
    } else {
      result = decodeBase64(String(text), urlSafe);
    }

    return NextResponse.json(
      {
        status: 'success',
        action,
        urlSafe,
        result,
        dataUrl: action === 'encode' ? `data:text/plain;charset=utf-8;base64,${result}` : undefined,
        stats: {
          inputLength: String(text).length,
          outputLength: result.length,
        },
        _meta: {
          provider: 'FreeAPI Dev Gateway',
          docs: 'https://freeapi.website/tools/base64-codec',
        },
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: 'Base64 dönüştürme hatası', error: err.message },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text') || searchParams.get('data') || '';
  const action = searchParams.get('action') === 'decode' ? 'decode' : 'encode';
  const urlSafe = searchParams.get('urlSafe') === 'true' || searchParams.get('url_safe') === 'true';

  try {
    const result = action === 'encode' ? encodeBase64(text, urlSafe) : decodeBase64(text, urlSafe);
    return NextResponse.json(
      {
        status: 'success',
        action,
        urlSafe,
        result,
        stats: { inputLength: text.length, outputLength: result.length },
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: 'Base64 hatası', error: err.message },
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
