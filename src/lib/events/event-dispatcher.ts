// ============================================================================
// FreeAPI Universal Event Dispatcher & Webhook Engine
// Manages HMAC-SHA256 signed event delivery, threshold evaluation & delivery logs
// ============================================================================

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  WebhookSubscription,
  WebhookDeliveryLog,
  WebhookEventType,
  WebhookCondition,
  WebhookEventPayload,
} from '@/types/database';

const WEBHOOKS_FILE = path.join(process.cwd(), 'database', 'webhooks.json');
const LOGS_FILE = path.join(process.cwd(), 'database', 'webhook_logs.json');

// In-memory cache for ultra-fast event lookup
let subscriptionsCache: WebhookSubscription[] | null = null;
let deliveryLogsCache: WebhookDeliveryLog[] = [];

function ensureDataDir(): void {
  const dir = path.dirname(WEBHOOKS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Loads all webhook subscriptions from disk into memory
 */
export function getWebhookSubscriptions(userId?: string): WebhookSubscription[] {
  if (subscriptionsCache === null) {
    ensureDataDir();
    if (fs.existsSync(WEBHOOKS_FILE)) {
      try {
        const raw = fs.readFileSync(WEBHOOKS_FILE, 'utf-8');
        subscriptionsCache = JSON.parse(raw);
      } catch {
        subscriptionsCache = [];
      }
    } else {
      subscriptionsCache = [];
    }
  }

  if (userId) {
    return (subscriptionsCache || []).filter((s) => s.user_id === userId);
  }
  return subscriptionsCache || [];
}

/**
 * Saves a webhook subscription
 */
export function saveWebhookSubscription(sub: WebhookSubscription): void {
  ensureDataDir();
  const all = getWebhookSubscriptions();
  const index = all.findIndex((s) => s.id === sub.id);
  if (index >= 0) {
    all[index] = sub;
  } else {
    all.push(sub);
  }
  subscriptionsCache = all;
  fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

/**
 * Deletes a webhook subscription by ID
 */
export function deleteWebhookSubscription(id: string, userId?: string): boolean {
  ensureDataDir();
  const all = getWebhookSubscriptions();
  const filtered = all.filter((s) => s.id !== id && (!userId || s.user_id === userId));
  if (filtered.length !== all.length) {
    subscriptionsCache = filtered;
    fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}

/**
 * Retrieves a single subscription by ID
 */
export function getSubscriptionById(id: string): WebhookSubscription | null {
  const all = getWebhookSubscriptions();
  return all.find((s) => s.id === id) || null;
}

/**
 * Generates a standard HMAC-SHA256 signature for the webhook payload
 * Format: t=<timestamp>,v1=<signature_hex>
 */
export function signWebhookPayload(payloadString: string, secret: string, timestamp: number): string {
  const signedContent = `${timestamp}.${payloadString}`;
  const hmac = crypto.createHmac('sha256', secret).update(signedContent).digest('hex');
  return `t=${timestamp},v1=${hmac}`;
}

/**
 * Evaluates whether a dataset update satisfies the developer's threshold condition
 */
export function evaluateCondition(data: any, condition?: WebhookCondition | null): boolean {
  if (!condition || !condition.field) return true;

  let targetItem = data;

  // If data is an array (e.g. crypto prices or currencies list) and targetKey is specified
  if (Array.isArray(data)) {
    if (condition.targetKey) {
      const tk = condition.targetKey.toLowerCase();
      targetItem = data.find((item: any) => {
        return (
          item.id?.toLowerCase() === tk ||
          item.symbol?.toLowerCase() === tk ||
          item.code?.toLowerCase() === tk ||
          item.name?.toLowerCase().includes(tk) ||
          item.city?.toLowerCase() === tk
        );
      });
    } else {
      targetItem = data[0];
    }
  }

  if (!targetItem) return false;

  const actualValue = targetItem[condition.field];
  if (actualValue === undefined || actualValue === null) return false;

  const expectedValue = condition.value;

  switch (condition.operator) {
    case '>':
      return Number(actualValue) > Number(expectedValue);
    case '<':
      return Number(actualValue) < Number(expectedValue);
    case '>=':
      return Number(actualValue) >= Number(expectedValue);
    case '<=':
      return Number(actualValue) <= Number(expectedValue);
    case '==':
      return String(actualValue).toLowerCase() === String(expectedValue).toLowerCase();
    case '!=':
      return String(actualValue).toLowerCase() !== String(expectedValue).toLowerCase();
    case 'contains':
      return String(actualValue).toLowerCase().includes(String(expectedValue).toLowerCase());
    default:
      return true;
  }
}

/**
 * Dispatches a webhook to a target URL with signature and logs results
 */
export async function dispatchWebhook(
  subscription: WebhookSubscription,
  eventType: WebhookEventType,
  eventData: any
): Promise<WebhookDeliveryLog> {
  const startTime = Date.now();
  const timestamp = Math.floor(Date.now() / 1000);

  const payload: WebhookEventPayload = {
    id: `evt_${crypto.randomBytes(8).toString('hex')}`,
    event: eventType,
    dataset: subscription.dataset_slug,
    timestamp,
    data: eventData,
    meta: {
      source: 'FreeAPI Universal Event Bus v1.0',
      version: '1.0.0',
    },
  };

  const payloadString = JSON.stringify(payload);
  const signature = signWebhookPayload(payloadString, subscription.secret, timestamp);

  let statusCode: number | undefined;
  let success = false;
  let errorMsg: string | null = null;

  try {
    const res = await fetch(subscription.target_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FreeAPI-Webhook-Dispatcher/1.0',
        'X-FreeAPI-Signature': signature,
        'X-FreeAPI-Event': eventType,
        'X-FreeAPI-Delivery': payload.id,
      },
      body: payloadString,
      signal: AbortSignal.timeout(5000), // 5 seconds timeout
    });

    statusCode = res.status;
    success = res.ok;
    if (!res.ok) {
      errorMsg = `HTTP status ${res.status} ${res.statusText}`;
    }
  } catch (err: any) {
    statusCode = 0;
    success = false;
    errorMsg = err.name === 'AbortError' ? 'Connection timed out (5s)' : err.message;
  }

  const latencyMs = Date.now() - startTime;

  // Record delivery log
  const log: WebhookDeliveryLog = {
    id: `wlog_${crypto.randomBytes(8).toString('hex')}`,
    subscription_id: subscription.id,
    event_type: eventType,
    payload_json: payload,
    target_url: subscription.target_url,
    status_code: statusCode,
    latency_ms: latencyMs,
    success,
    error: errorMsg,
    delivered_at: new Date().toISOString(),
  };

  // Update subscription statistics
  subscription.total_deliveries = (subscription.total_deliveries || 0) + 1;
  subscription.last_triggered_at = new Date().toISOString();
  subscription.last_status_code = statusCode;
  if (!success) {
    subscription.failure_count = (subscription.failure_count || 0) + 1;
  } else {
    subscription.failure_count = 0;
  }
  saveWebhookSubscription(subscription);

  return log;
}

/**
 * Universal Event Emitter
 * Called whenever a dataset is updated or an item is added in the database
 */
export async function emitDatasetEvent(
  datasetSlug: string,
  eventType: WebhookEventType,
  data: any
): Promise<void> {
  const subscriptions = getWebhookSubscriptions();
  const matchingSubs = subscriptions.filter(
    (s) =>
      s.is_active &&
      (s.dataset_slug === datasetSlug || s.dataset_slug === '*') &&
      (s.event_type === eventType || s.event_type === 'dataset.updated')
  );

  if (matchingSubs.length === 0) return;

  console.log(`⚡ [EventDispatcher] Emitting [${eventType}] for [${datasetSlug}] -> ${matchingSubs.length} subscriptions matching`);

  // Asynchronously dispatch to all matching subscriptions
  for (const sub of matchingSubs) {
    const isSatisfied = evaluateCondition(data, sub.condition);
    if (isSatisfied) {
      dispatchWebhook(sub, eventType, data).catch((err) => {
        console.error(`⚠️ [EventDispatcher] Async delivery error for ${sub.target_url}:`, err.message);
      });
    }
  }
}
