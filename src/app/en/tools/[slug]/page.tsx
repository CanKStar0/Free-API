import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEVELOPER_TOOLS } from '@/data/tools';
import ToolDetailClient from '@/components/tools/ToolDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DEVELOPER_TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = DEVELOPER_TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | FreeAPI',
    };
  }

  const title = `${tool.name.en} (Online & Free REST API) | FreeAPI Tools`;
  const description = tool.fullDescription.en;

  return {
    title,
    description,
    keywords: tool.seoKeywords.en,
    alternates: {
      canonical: `https://freeapi.website/en/tools/${tool.slug}`,
      languages: {
        'tr-TR': `https://freeapi.website/tools/${tool.slug}`,
        'en-US': `https://freeapi.website/en/tools/${tool.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://freeapi.website/en/tools/${tool.slug}`,
      siteName: 'FreeAPI',
      type: 'website',
    },
  };
}

export default async function EnToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = DEVELOPER_TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return <ToolDetailClient tool={tool} lang="en" />;
}
