import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { query } from '@/lib/db';
import crypto from 'crypto';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/stacks - Get user's created stacks
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ stacks: [] });
    }

    const rows = await query(
      `SELECT id, title, slug, description, "apiSlugs", "isPublic", "createdAt", "updatedAt"
       FROM "user_stacks"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [session.user.id]
    );

    return NextResponse.json({ stacks: rows });
  } catch (error) {
    console.error('Failed to fetch user stacks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/stacks - Create a new stack
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, apiSlugs, isPublic = true } = body;

    if (!title || !Array.isArray(apiSlugs) || apiSlugs.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one API are required' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const baseSlug = slugify(title) || 'stack';
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    const slug = `${baseSlug}-${randomSuffix}`;

    await query(
      `INSERT INTO "user_stacks" (id, "userId", title, slug, description, "apiSlugs", "isPublic", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, NOW(), NOW())`,
      [
        id,
        session.user.id,
        title.trim(),
        slug,
        description?.trim() || null,
        JSON.stringify(apiSlugs),
        Boolean(isPublic),
      ]
    );

    const [created] = await query(
      `SELECT id, title, slug, description, "apiSlugs", "isPublic", "createdAt"
       FROM "user_stacks" WHERE id = $1`,
      [id]
    );

    return NextResponse.json({
      success: true,
      stack: created,
    });
  } catch (error) {
    console.error('Failed to create stack:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
