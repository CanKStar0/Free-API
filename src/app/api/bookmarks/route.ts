import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { query } from '@/lib/db';
import crypto from 'crypto';

// GET /api/bookmarks - Get current user's bookmarks
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ bookmarks: [] });
    }

    const rows = await query<{ apiSlug: string; createdAt: Date }>(
      `SELECT "apiSlug", "createdAt" FROM "user_bookmarks" WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
      [session.user.id]
    );

    return NextResponse.json({
      bookmarks: rows.map((r) => r.apiSlug),
    });
  } catch (error) {
    console.error('Failed to fetch bookmarks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/bookmarks - Add or sync bookmarks
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const userId = session.user.id;

    // Support single slug or batch array
    if (Array.isArray(body.slugs)) {
      for (const slug of body.slugs) {
        if (typeof slug === 'string' && slug.trim()) {
          const id = crypto.randomUUID();
          await query(
            `INSERT INTO "user_bookmarks" (id, "userId", "apiSlug", "createdAt")
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT ("userId", "apiSlug") DO NOTHING`,
            [id, userId, slug.trim()]
          );
        }
      }
    } else if (body.apiSlug) {
      const id = crypto.randomUUID();
      await query(
        `INSERT INTO "user_bookmarks" (id, "userId", "apiSlug", "createdAt")
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT ("userId", "apiSlug") DO NOTHING`,
        [id, userId, body.apiSlug.trim()]
      );
    }

    const rows = await query<{ apiSlug: string }>(
      `SELECT "apiSlug" FROM "user_bookmarks" WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      bookmarks: rows.map((r) => r.apiSlug),
    });
  } catch (error) {
    console.error('Failed to save bookmark:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/bookmarks - Remove bookmark
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { apiSlug } = body;

    if (!apiSlug) {
      return NextResponse.json({ error: 'apiSlug is required' }, { status: 400 });
    }

    await query(
      `DELETE FROM "user_bookmarks" WHERE "userId" = $1 AND "apiSlug" = $2`,
      [session.user.id, apiSlug]
    );

    const rows = await query<{ apiSlug: string }>(
      `SELECT "apiSlug" FROM "user_bookmarks" WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
      [session.user.id]
    );

    return NextResponse.json({
      success: true,
      bookmarks: rows.map((r) => r.apiSlug),
    });
  } catch (error) {
    console.error('Failed to delete bookmark:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
