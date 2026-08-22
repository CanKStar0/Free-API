// ============================================================================
// FreeAPI Official Drop-in TypeScript / JavaScript SDK
// Zero external dependencies, single file drop-in client & webhook signature verifier
// ============================================================================

import crypto from 'crypto';

export interface WebhookVerifyOptions {
  payload: string | Buffer;
  signature: string | null | undefined;
  secret: string;
  toleranceSeconds?: number;
}

/**
 * Cryptographically verifies that an incoming HTTP request originated from FreeAPI Webhook Dispatcher
 * Uses HMAC-SHA256 and constant-time comparison to prevent timing and replay attacks
 *
 * @example
 * ```typescript
 * import { verifyWebhookSignature } from '@/lib/sdk';
 *
 * export async function POST(req: Request) {
 *   const rawBody = await req.text();
 *   const signature = req.headers.get('x-freeapi-signature');
 *   const isValid = verifyWebhookSignature({
 *     payload: rawBody,
 *     signature,
 *     secret: process.env.FREEAPI_WEBHOOK_SECRET!
 *   });
 *   if (!isValid) return new Response('Invalid Signature', { status: 401 });
 *   // Process verified event payload safely
 * }
 * ```
 */
export function verifyWebhookSignature({
  payload,
  signature,
  secret,
  toleranceSeconds = 300, // 5 minutes tolerance window
}: WebhookVerifyOptions): boolean {
  if (!signature || !secret || !payload) {
    return false;
  }

  try {
    const rawPayload = typeof payload === 'string' ? payload : payload.toString('utf-8');

    // Parse header format: "t=1787410000,v1=a1b2c3d4e5..."
    const elements = signature.split(',');
    let timestampStr: string | null = null;
    let signatureHex: string | null = null;

    for (const element of elements) {
      const [key, value] = element.trim().split('=');
      if (key === 't') timestampStr = value;
      if (key === 'v1') signatureHex = value;
    }

    if (!timestampStr || !signatureHex) {
      return false;
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Math.floor(Date.now() / 1000);

    // Replay attack prevention: check if timestamp is within tolerance window
    if (Math.abs(now - timestamp) > toleranceSeconds) {
      return false;
    }

    // Compute expected HMAC-SHA256 signature
    const signedContent = `${timestamp}.${rawPayload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedContent)
      .digest('hex');

    // Constant-time buffer comparison to prevent timing attacks
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const actualBuffer = Buffer.from(signatureHex, 'hex');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

export interface FreeApiClientOptions {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface QueryOptions {
  search?: string;
  fields?: string[] | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  field?: string;
  value?: string;
}

/**
 * Lightweight, unified FreeAPI Client for browser, Node.js and Next.js environments
 */
export class FreeApiClient {
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;

  constructor(options: FreeApiClientOptions = {}) {
    this.apiKey = options.apiKey || (typeof process !== 'undefined' ? process.env.FREEAPI_API_KEY || '' : '');
    this.baseUrl = (options.baseUrl || 'https://freeapi.website').replace(/\/$/, '');
    this.timeoutMs = options.timeoutMs || 5000;
  }

  /**
   * Targets a specific dataset on FreeAPI Smart Edge Gateway
   */
  dataset(slug: string) {
    const self = this;
    return {
      async query<T = any>(options: QueryOptions = {}): Promise<{
        success: boolean;
        source: string;
        latency_ms: number;
        data: T[];
        pagination?: { total: number; page: number; limit: number; totalPages: number };
      }> {
        const params = new URLSearchParams();
        if (options.search) params.set('search', options.search);
        if (options.fields) {
          params.set('fields', Array.isArray(options.fields) ? options.fields.join(',') : options.fields);
        }
        if (options.page) params.set('page', String(options.page));
        if (options.limit) params.set('limit', String(options.limit));
        if (options.sortBy) params.set('sortBy', options.sortBy);
        if (options.order) params.set('order', options.order);
        if (options.field && options.value) {
          params.set('field', options.field);
          params.set('value', options.value);
        }

        const queryStr = params.toString();
        const url = `${self.baseUrl}/api/v1/gateway/${slug}${queryStr ? `?${queryStr}` : ''}`;

        const headers: Record<string, string> = {
          Accept: 'application/json',
          'User-Agent': 'FreeAPI-SDK/1.0',
        };
        if (self.apiKey) {
          headers['x-freeapi-key'] = self.apiKey;
        }

        const response = await fetch(url, {
          headers,
          signal: AbortSignal.timeout(self.timeoutMs),
        });

        if (!response.ok) {
          throw new Error(`FreeAPI Gateway Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      },
    };
  }

  /**
   * Webhook utilities helper
   */
  get webhooks() {
    return {
      verifySignature: verifyWebhookSignature,
    };
  }
}

/**
 * Factory helper for quick instantiating FreeApiClient
 */
export function createFreeApiClient(options?: FreeApiClientOptions): FreeApiClient {
  return new FreeApiClient(options);
}
