import { NextRequest, NextResponse } from 'next/server';
import { dispatchWebhook, getSubscriptionById } from '@/lib/events/event-dispatcher';
import { WebhookSubscription } from '@/types/database';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-freeapi-key',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders() });
}

/**
 * POST /api/v1/webhooks/test
 * Sends a real-time sample webhook test event to developer's target URL and returns HTTP status and latency
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriptionId, targetUrl, secret, datasetSlug } = body;

    let sub: WebhookSubscription | null = null;

    if (subscriptionId) {
      sub = getSubscriptionById(subscriptionId);
    }

    if (!sub) {
      if (!targetUrl || !secret) {
        return NextResponse.json(
          { success: false, error: 'Either subscriptionId or targetUrl + secret is required' },
          { status: 400, headers: getCorsHeaders() }
        );
      }

      sub = {
        id: `wh_test_${Date.now()}`,
        user_id: 'usr_test',
        name: 'Test Webhook Runner',
        dataset_slug: datasetSlug || 'crypto-prices',
        event_type: 'test.ping',
        target_url: targetUrl,
        secret,
        is_active: true,
        total_deliveries: 0,
        failure_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const testData = {
      message: 'Hello from FreeAPI Universal Event Bus! This is a test webhook payload.',
      test_timestamp: new Date().toISOString(),
      sample_record: {
        symbol: 'BTC',
        name: 'Bitcoin',
        currentPriceUsd: 84250.00,
        priceChange24h: '+3.45%',
      },
    };

    const deliveryLog = await dispatchWebhook(sub, 'test.ping', testData);

    return NextResponse.json(
      {
        success: deliveryLog.success,
        delivery: deliveryLog,
        status_code: deliveryLog.status_code,
        latency_ms: deliveryLog.latency_ms,
        message: deliveryLog.success
          ? `Webhook delivered successfully with status HTTP ${deliveryLog.status_code} in ${deliveryLog.latency_ms}ms`
          : `Webhook delivery failed: ${deliveryLog.error || `HTTP ${deliveryLog.status_code}`}`,
      },
      {
        status: 200,
        headers: getCorsHeaders(),
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}
