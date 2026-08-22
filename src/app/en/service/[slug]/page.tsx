import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getApiBySlug, getAllApisWithSlugs, EnrichedApiService } from '@/lib/api-slugs';
import ServiceClient from '@/app/service/[slug]/ServiceClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true; // Enables automatic dynamic generation for new APIs!
export const revalidate = 3600; // ISR revalidation every hour

// 1. Static site generation for all 500+ APIs in English
export async function generateStaticParams() {
  const allApis = getAllApisWithSlugs();
  return allApis.map((api) => ({
    slug: api.slug,
  }));
}

// 2. Dynamic SEO Metadata for Global English Indexing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const api = getApiBySlug(resolvedParams.slug);

  if (!api) {
    return {
      title: 'API Not Found - FreeAPI Directory',
      description: 'The requested free API service could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeapi.website';
  const descEn = api.description_en || api.description;

  const pageTitle = `${api.name} Free API - Documentation, Rate Limits & Code Examples`;
  const pageDescription = `${api.name} (${api.categoryTitle}) free public REST API service. ${descEn} Rate limit: ${api.rateLimit}. Get ready-to-use cURL, Python & JavaScript snippets.`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      api.name,
      `${api.name} API`,
      `${api.name} free public API`,
      `${api.name} documentation`,
      `${api.name} python example`,
      `${api.name} curl request`,
      `${api.categoryTitle} API`,
      'free REST API',
      'zero auth API',
      'public API catalog',
    ],
    alternates: {
      canonical: `${siteUrl}/en/service/${api.slug}`,
      languages: {
        'tr-TR': `${siteUrl}/service/${api.slug}`,
        'en-US': `${siteUrl}/en/service/${api.slug}`,
      },
    },
    openGraph: {
      title: `${api.name} - Free Public API Service | FreeAPI Directory`,
      description: pageDescription,
      url: `${siteUrl}/en/service/${api.slug}`,
      siteName: 'FreeAPI Directory',
      type: 'article',
      locale: 'en_US',
      publishedTime: new Date().toISOString(),
      authors: ['FreeAPI Community'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${api.name} - Free Public API Service`,
      description: pageDescription,
    },
  };
}

// 3. Page Component & JSON-LD Structured Data Schema
export default async function EnglishServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const api = getApiBySlug(resolvedParams.slug);

  if (!api) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeapi.website';

  // Get up to 4 related APIs from same category
  const allApis = getAllApisWithSlugs();
  const relatedApis = allApis
    .filter((a) => a.categoryId === api.categoryId && a.slug !== api.slug)
    .slice(0, 4);

  // Rich JSON-LD Schemas in English (SoftwareApplication, FAQPage, BreadcrumbList)
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: api.name,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        inLanguage: 'en-US',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        url: api.url,
        description: api.description_en || api.description,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}/en`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: api.categoryTitle,
            item: `${siteUrl}/category/${api.categoryId}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: api.name,
            item: `${siteUrl}/en/service/${api.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Is ${api.name} API free to use?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, ${api.name} is listed as a free endpoint with an allowance of: ${api.rateLimit}.`,
            },
          },
          {
            '@type': 'Question',
            name: `Do I need an API key for ${api.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: api.isNoAuth
                ? `No, ${api.name} is a Zero-Auth service. You can call endpoints directly without sign-up.`
                : `A free API key or account may be required depending on the provider docs.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <ServiceClient api={api} relatedApis={relatedApis} forcedLanguage="en" />
    </>
  );
}
