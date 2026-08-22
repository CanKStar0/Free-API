import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategoryById } from '@/data/apis';
import CategoryPageClient from './CategoryPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryById(id);
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı | API Showcase',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeapi.website';

  return {
    title: `${category.title} API'leri | FreeAPI Directory`,
    description: category.description,
    alternates: {
      canonical: `${siteUrl}/category/${id}`,
    },
    openGraph: {
      title: `${category.title} API'leri | FreeAPI Directory`,
      description: category.description,
      url: `${siteUrl}/category/${id}`,
      siteName: 'FreeAPI Directory',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = getCategoryById(id);
  
  if (!category) {
    notFound();
    return null;
  }

  return <CategoryPageClient category={category} />;
}
