import { NextRequest, NextResponse } from 'next/server';
import { marked } from 'marked';

interface HeadingItem {
  level: number;
  text: string;
  slug: string;
}

function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim().replace(/[*_`~[\]]/g, '');
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.push({ level, text, slug });
    }
  }

  return headings;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const markdown = body.markdown ?? body.text ?? body.content ?? '';
    const gfm = body.gfm !== false;
    const breaks = body.breaks === true;

    if (typeof markdown !== 'string') {
      return NextResponse.json(
        { status: 'error', message: 'Markdown metni geçersizdir.' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    marked.setOptions({
      gfm,
      breaks,
    });

    const html = await marked.parse(markdown);
    const headings = extractHeadings(markdown);

    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const characters = markdown.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return NextResponse.json(
      {
        status: 'success',
        html,
        headings,
        stats: {
          words,
          characters,
          readingTimeMinutes,
          headingsCount: headings.length,
        },
        _meta: {
          provider: 'FreeAPI Dev Gateway',
          docs: 'https://freeapi.website/tools/markdown-to-html',
        },
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Markdown derleme hatası',
        error: error.message,
      },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
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
