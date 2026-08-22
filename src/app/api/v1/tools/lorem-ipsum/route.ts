import { NextRequest, NextResponse } from 'next/server';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur',
  'aut', 'odit', 'fugit', 'consequuntur', 'magni', 'dolores', 'ratione'
];

function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(minWords: number = 8, maxWords: number = 18): string {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(getRandomWord());
  }
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(minSentences: number = 4, maxSentences: number = 7): string {
  const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'paragraphs';
  const rawCount = parseInt(searchParams.get('count') || '3', 10);
  const count = Math.min(Math.max(isNaN(rawCount) ? 3 : rawCount, 1), 50);
  const asHtml = searchParams.get('asHtml') === 'true' || searchParams.get('as_html') === 'true';
  const startWithLorem = searchParams.get('startWithLorem') !== 'false';

  let result = '';
  let items: string[] = [];

  if (type === 'words') {
    for (let i = 0; i < count; i++) {
      items.push(getRandomWord());
    }
    if (startWithLorem && count >= 2) {
      items[0] = 'lorem';
      items[1] = 'ipsum';
    }
    result = items.join(' ');
  } else if (type === 'sentences') {
    for (let i = 0; i < count; i++) {
      items.push(generateSentence());
    }
    if (startWithLorem && items.length > 0) {
      items[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    }
    result = items.join(' ');
    if (asHtml) {
      result = items.map((s) => `<li>${s}</li>`).join('\n');
      result = `<ul>\n${result}\n</ul>`;
    }
  } else {
    // Paragraphs
    for (let i = 0; i < count; i++) {
      items.push(generateParagraph());
    }
    if (startWithLorem && items.length > 0) {
      items[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + items[0].slice(items[0].indexOf('.') + 2);
    }
    if (asHtml) {
      result = items.map((p) => `<p>${p}</p>`).join('\n\n');
    } else {
      result = items.join('\n\n');
    }
  }

  const words = result.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  const characters = result.length;

  return NextResponse.json(
    {
      status: 'success',
      type,
      count,
      asHtml,
      text: result,
      items,
      stats: {
        words,
        characters,
      },
      _meta: {
        provider: 'FreeAPI Dev Gateway',
        docs: 'https://freeapi.website/tools/lorem-ipsum-generator',
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
