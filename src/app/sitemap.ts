import { MetadataRoute } from 'next';
import { categories } from '@/data/apis';
import { getAllApisWithSlugs } from '@/lib/api-slugs';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://api.canpolatkaya.com';
  const lastModified = new Date();

  // 1. Home Page
  const homeRoute = {
    url: siteUrl,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 1.0,
    alternates: {
      languages: {
        'tr-TR': siteUrl,
        'en-US': siteUrl,
      },
    },
  };

  // 2. Category Pages (47+ pages)
  const categoryRoutes = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat.id}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.8,
    alternates: {
      languages: {
        'tr-TR': `${siteUrl}/category/${cat.id}`,
        'en-US': `${siteUrl}/category/${cat.id}`,
      },
    },
  }));

  // 3. Dedicated Master Landing Pages for 500+ APIs (including dynamically approved ones!)
  const allApis = getAllApisWithSlugs();
  const serviceRoutes = allApis.map((api) => ({
    url: `${siteUrl}/service/${api.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        'tr-TR': `${siteUrl}/service/${api.slug}`,
        'en-US': `${siteUrl}/service/${api.slug}`,
      },
    },
  }));

  return [homeRoute, ...categoryRoutes, ...serviceRoutes];
}
