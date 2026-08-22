import { NextRequest, NextResponse } from 'next/server';

function deepSortKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepSortKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result: Record<string, any>, key: string) => {
        result[key] = deepSortKeys(obj[key]);
        return result;
      }, {});
  }
  return obj;
}

export async function POST(request: NextRequest) {
  try {
    let body: any;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const raw = await request.text();
      body = { json: raw };
    }

    const jsonInput = body.json ?? body.data ?? body;
    const indentType = body.indent !== undefined ? String(body.indent) : '2';
    const sortKeys = body.sortKeys === true || body.sort_keys === true;

    let parsed: any;
    if (typeof jsonInput === 'object' && jsonInput !== null && !body.json) {
      parsed = jsonInput;
    } else if (typeof jsonInput === 'string') {
      try {
        parsed = JSON.parse(jsonInput);
      } catch (err: any) {
        return NextResponse.json(
          {
            status: 'error',
            valid: false,
            message: 'Geçersiz JSON sözdizimi / Invalid JSON syntax',
            error: err.message,
          },
          {
            status: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
          }
        );
      }
    } else {
      parsed = jsonInput;
    }

    if (sortKeys) {
      parsed = deepSortKeys(parsed);
    }

    let indent: number | string = 2;
    if (indentType === '0' || indentType === 'minify') {
      indent = 0;
    } else if (indentType === '4') {
      indent = 4;
    } else if (indentType === 'tab') {
      indent = '\t';
    }

    const formatted = indent === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
    const minified = JSON.stringify(parsed);

    return NextResponse.json(
      {
        status: 'success',
        valid: true,
        formatted,
        minified,
        data: parsed,
        stats: {
          originalLength: typeof jsonInput === 'string' ? jsonInput.length : JSON.stringify(jsonInput).length,
          formattedLength: formatted.length,
          minifiedLength: minified.length,
          savedBytes: Math.max(0, (typeof jsonInput === 'string' ? jsonInput.length : formatted.length) - minified.length),
        },
        _meta: {
          provider: 'FreeAPI Dev Gateway',
          docs: 'https://freeapi.website/tools/json-formatter',
        },
      },
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        valid: false,
        message: 'İşlem başarısız / Operation failed',
        error: error.message,
      },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
