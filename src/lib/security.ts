// Shared in-memory IP blacklist and rate limit store
const BANNED_IPS = new Set<string>();
const RATE_LIMIT_STORE = new Map<string, { count: number; resetTime: number }>();

export function isIpBanned(ip: string): boolean {
  return BANNED_IPS.has(ip);
}

export function banIp(ip: string): void {
  BANNED_IPS.add(ip);
  // Auto-unban after 24 hours (86,400,000 ms)
  setTimeout(() => {
    BANNED_IPS.delete(ip);
  }, 24 * 60 * 60 * 1000);
}

export function checkRateLimit(ip: string, maxRequests = 100, windowMs = 2000): boolean {
  const now = Date.now();
  const record = RATE_LIMIT_STORE.get(ip);

  if (!record || now > record.resetTime) {
    RATE_LIMIT_STORE.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  record.count += 1;
  return true;
}

// Known bot and scraper User-Agent signatures
export const BLOCKED_USER_AGENTS = [
  'python-requests',
  'aiohttp',
  'scrapy',
  'wget',
  'go-http-client',
  'node-fetch',
  'axios',
  'http.client',
  'headlesschrome',
  'phantomjs',
  'puppeteer',
  'selenium',
  'gptbot',
  'ccbot',
  'bytespider',
  'claudebot',
  'perplexitybot',
  'anthropic-ai',
  'amazonbot',
];

// Lightweight URL Obfuscator / Deobfuscator
export function obfuscateUrl(url: string): string {
  try {
    return Buffer.from(url).toString('base64');
  } catch {
    return url;
  }
}

export function deobfuscateUrl(obfuscated: string): string {
  try {
    return Buffer.from(obfuscated, 'base64').toString('utf8');
  } catch {
    return obfuscated;
  }
}
