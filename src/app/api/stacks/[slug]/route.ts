import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { query } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const rows = await query(
      `SELECT s.id, s.title, s.slug, s.description, s."apiSlugs", s."isPublic", s."createdAt",
              u.name as "authorName", u.image as "authorImage"
       FROM "user_stacks" s
       LEFT JOIN "user" u ON s."userId" = u.id
       WHERE s.slug = $1
       LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Stack not found' }, { status: 404 });
    }

    return NextResponse.json({ stack: rows[0] });
  } catch (error) {
    console.error('Failed to fetch stack by slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    const res = await query(
      `DELETE FROM "user_stacks" WHERE slug = $1 AND "userId" = $2 RETURNING id`,
      [slug, session.user.id]
    );

    if (res.length === 0) {
      return NextResponse.json(
        { error: 'Stack not found or not owned by user' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete stack:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
