import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { StackViewClient } from '@/app/stack/[slug]/StackViewClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const rows = await query<{ title: string; description: string | null }>(
      `SELECT title, description FROM "user_stacks" WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      return {
        title: 'API Stack Not Found - FreeAPI Directory',
      };
    }

    const stack = rows[0];
    return {
      title: `${stack.title} | FreeAPI Developer Stack`,
      description: stack.description || `Explore this curated public developer API stack on FreeAPI Directory.`,
      openGraph: {
        title: `${stack.title} | FreeAPI Stack`,
        description: stack.description || 'Public API Stack for developers.',
        url: `https://freeapi.website/en/stack/${slug}`,
        siteName: 'FreeAPI Directory',
      },
    };
  } catch {
    return {
      title: 'FreeAPI Developer Stack',
    };
  }
}

export default async function EnStackPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const rows = await query<{
      id: string;
      title: string;
      slug: string;
      description: string | null;
      apiSlugs: any;
      isPublic: boolean;
      createdAt: Date;
      authorName: string | null;
      authorImage: string | null;
    }>(
      `SELECT s.id, s.title, s.slug, s.description, s."apiSlugs", s."isPublic", s."createdAt",
              u.name as "authorName", u.image as "authorImage"
       FROM "user_stacks" s
       LEFT JOIN "user" u ON s."userId" = u.id
       WHERE s.slug = $1
       LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      notFound();
    }

    const row = rows[0];
    const stack = {
      ...row,
      apiSlugs: Array.isArray(row.apiSlugs) ? row.apiSlugs : JSON.parse(row.apiSlugs || '[]'),
      createdAt: row.createdAt.toISOString(),
    };

    return <StackViewClient stack={stack} />;
  } catch (err) {
    console.error('Failed to load EN stack page:', err);
    notFound();
  }
}
