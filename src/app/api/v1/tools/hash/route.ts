import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function computeHashes(text: string, secretKey?: string) {
  const algorithms = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];
  const hashes: Record<string, string> = {};
  const hmacs: Record<string, string> = {};

  for (const alg of algorithms) {
    hashes[alg] = crypto.createHash(alg).update(text, 'utf-8').digest('hex');
    if (secretKey) {
      hmacs[alg] = crypto.createHmac(alg, secretKey).update(text, 'utf-8').digest('hex');
    }
  }

  return { hashes, hmacs: secretKey ? hmacs : undefined };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const text = body.text ?? body.data ?? body.input ?? '';
    const algorithm = (body.algorithm || 'all').toLowerCase();
    const secretKey = body.secretKey || body.secret_key || body.key;

    if (text === undefined || text === null) {
      return NextResponse.json(
        { status: 'error', message: 'Metin (text) parametresi gereklidir.' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const inputStr = String(text);
    const { hashes, hmacs } = computeHashes(inputStr, secretKey);

    let result: any = hashes;
    if (algorithm !== 'all' && hashes[algorithm]) {
      result = { [algorithm]: hashes[algorithm] };
    }

    return NextResponse.json(
      {
        status: 'success',
        input: inputStr,
        algorithm,
        hashes: result,
        hmacs,
        stats: {
          inputBytes: Buffer.byteLength(inputStr, 'utf8'),
        },
        _meta: {
          provider: 'FreeAPI Dev Gateway',
          docs: 'https://freeapi.website/tools/hash-generator',
        },
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: 'Hash hesaplama hatası', error: err.message },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text') || searchParams.get('data') || '';
  const algorithm = (searchParams.get('algorithm') || 'all').toLowerCase();
  const secretKey = searchParams.get('secretKey') || searchParams.get('key') || undefined;

  const { hashes, hmacs } = computeHashes(text, secretKey);

  let result: any = hashes;
  if (algorithm !== 'all' && hashes[algorithm]) {
    result = { [algorithm]: hashes[algorithm] };
  }

  return NextResponse.json(
    {
      status: 'success',
      input: text,
      algorithm,
      hashes: result,
      hmacs,
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );
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
