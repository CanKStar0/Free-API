import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text') || searchParams.get('data') || 'https://freeapi.website';
  const format = (searchParams.get('format') || 'svg').toLowerCase();
  const rawSize = parseInt(searchParams.get('size') || '256', 10);
  const size = Math.min(Math.max(isNaN(rawSize) ? 256 : rawSize, 64), 1024);
  const colorDark = searchParams.get('color') || '#000000';
  const colorLight = searchParams.get('bgColor') || searchParams.get('bg_color') || '#ffffff';
  const errorCorrectionLevel = (searchParams.get('level') || 'M') as 'L' | 'M' | 'Q' | 'H';

  const qrOptions = {
    errorCorrectionLevel,
    width: size,
    margin: 2,
    color: {
      dark: colorDark,
      light: colorLight,
    },
  };

  try {
    if (format === 'svg') {
      const svgString = await QRCode.toString(text, { ...qrOptions, type: 'svg' });
      return new NextResponse(svgString, {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }

    if (format === 'png') {
      const pngBuffer = await QRCode.toBuffer(text, qrOptions);
      return new NextResponse(new Uint8Array(pngBuffer), {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }

    // JSON or DataURL
    const dataUrl = await QRCode.toDataURL(text, qrOptions);
    const svgString = await QRCode.toString(text, { ...qrOptions, type: 'svg' });

    return NextResponse.json(
      {
        status: 'success',
        text,
        format,
        size,
        dataUrl,
        svg: svgString,
        options: {
          colorDark,
          colorLight,
          errorCorrectionLevel,
        },
        _meta: {
          provider: 'FreeAPI Dev Gateway',
          docs: 'https://freeapi.website/tools/qr-code-generator',
        },
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'QR kod oluşturulamadı',
        error: error.message,
      },
      {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
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
