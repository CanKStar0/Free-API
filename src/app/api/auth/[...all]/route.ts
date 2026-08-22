import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest, NextResponse } from 'next/server';

const handlers = toNextJsHandler(auth.handler);

export async function GET(req: NextRequest) {
  try {
    return await handlers.GET(req);
  } catch (error: any) {
    console.error('🔥 [Auth API GET Error]:', error);
    return NextResponse.json({ error: error?.message || 'Auth internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handlers.POST(req);
  } catch (error: any) {
    console.error('🔥 [Auth API POST Error]:', error);
    return NextResponse.json({ error: error?.message || 'Auth internal error' }, { status: 500 });
  }
}
