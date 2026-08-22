import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = /[il1Lo0O]/g;

function calculateEntropy(password: string, poolSize: number): { score: number; strength: string } {
  const entropyBits = Math.round(password.length * (Math.log2(poolSize || 1)) * 10) / 10;
  let strength = 'Weak';
  if (entropyBits >= 120) strength = 'Very Strong';
  else if (entropyBits >= 80) strength = 'Strong';
  else if (entropyBits >= 50) strength = 'Moderate';
  else strength = 'Weak';

  return { score: entropyBits, strength };
}

function generateSecurePassword(length: number, pool: string): string {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += pool[bytes[i] % pool.length];
  }
  return result;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawLength = parseInt(searchParams.get('length') || '16', 10);
  const length = Math.min(Math.max(isNaN(rawLength) ? 16 : rawLength, 6), 128);

  const uppercase = searchParams.get('uppercase') !== 'false';
  const lowercase = searchParams.get('lowercase') !== 'false';
  const numbers = searchParams.get('numbers') !== 'false';
  const symbols = searchParams.get('symbols') === 'true' || searchParams.get('symbols') === '1';
  const excludeSimilar = searchParams.get('excludeSimilar') === 'true' || searchParams.get('exclude_similar') === 'true';
  const rawCount = parseInt(searchParams.get('count') || '1', 10);
  const count = Math.min(Math.max(isNaN(rawCount) ? 1 : rawCount, 1), 50);

  let charPool = '';
  if (uppercase) charPool += UPPERCASE;
  if (lowercase) charPool += LOWERCASE;
  if (numbers) charPool += NUMBERS;
  if (symbols) charPool += SYMBOLS;

  if (excludeSimilar) {
    charPool = charPool.replace(SIMILAR_CHARS, '');
  }

  if (charPool.length === 0) {
    charPool = LOWERCASE + NUMBERS;
  }

  const passwords: string[] = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generateSecurePassword(length, charPool));
  }

  const entropy = calculateEntropy(passwords[0], charPool.length);

  return NextResponse.json(
    {
      status: 'success',
      count,
      length,
      passwords,
      password: passwords[0],
      security: {
        entropyBits: entropy.score,
        strength: entropy.strength,
        charPoolSize: charPool.length,
      },
      options: {
        uppercase,
        lowercase,
        numbers,
        symbols,
        excludeSimilar,
      },
      _meta: {
        provider: 'FreeAPI Dev Gateway',
        docs: 'https://freeapi.website/tools/password-generator',
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
