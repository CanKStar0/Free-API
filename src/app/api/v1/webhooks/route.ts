import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  getWebhookSubscriptions,
  saveWebhookSubscription,
  deleteWebhookSubscription,
} from '@/lib/events/event-dispatcher';
import { WebhookSubscription } from '@/types/database';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-freeapi-key',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders() });
}

/**
 * GET /api/v1/webhooks
 * List active webhook subscriptions
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || undefined;

  const subscriptions = getWebhookSubscriptions(userId);

  return NextResponse.json(
    {
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    },
    {
      status: 200,
      headers: getCorsHeaders(),
    }
  );
}

/**
 * POST /api/v1/webhooks
 * Create or update a webhook subscription
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, dataset_slug, event_type, condition, target_url, user_id } = body;

    if (!target_url || !dataset_slug) {
      return NextResponse.json(
        { success: false, error: 'target_url and dataset_slug are required fields' },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // Validate URL format
    try {
      new URL(target_url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid target_url format. Must be a valid HTTP/HTTPS URL.' },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // Generate subscription with HMAC secret
    const subscriptionId = `wh_${crypto.randomBytes(8).toString('hex')}`;
    const secret = `whsec_live_${crypto.randomBytes(16).toString('hex')}`;

    const newSub: WebhookSubscription = {
      id: subscriptionId,
      user_id: user_id || 'usr_developer',
      name: name || `${dataset_slug} Alert`,
      dataset_slug,
      event_type: event_type || 'dataset.updated',
      condition: condition || null,
      target_url,
      secret,
      is_active: true,
      total_deliveries: 0,
      failure_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveWebhookSubscription(newSub);

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook subscription created successfully',
        data: newSub,
      },
      {
        status: 201,
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

/**
 * DELETE /api/v1/webhooks
 * Delete a webhook subscription
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Webhook id is required' },
      { status: 400, headers: getCorsHeaders() }
    );
  }

  const deleted = deleteWebhookSubscription(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: 'Webhook subscription not found' },
      { status: 404, headers: getCorsHeaders() }
    );
  }

  return NextResponse.json(
    { success: true, message: 'Webhook subscription deleted successfully' },
    { status: 200, headers: getCorsHeaders() }
  );
}
