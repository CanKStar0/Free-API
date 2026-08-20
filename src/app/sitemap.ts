import { MetadataRoute } from 'next';
import { categories } from '@/data/apis';
import { getAllApisWithSlugs } from '@/lib/api-slugs';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://api.canpolatkaya.com';
  const lastModified = new Date();

  // 1. Home Pages (TR & EN)
  const homeRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'tr-TR': siteUrl,
          'en-US': `${siteUrl}/en`,
        },
      },
    },
    {
      url: `${siteUrl}/en`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.95,
      alternates: {
        languages: {
          'tr-TR': siteUrl,
          'en-US': `${siteUrl}/en`,
        },
      },
    },
  ];

  // 2. Category Pages (47+ pages)
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat.id}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.85,
    alternates: {
      languages: {
        'tr-TR': `${siteUrl}/category/${cat.id}`,
        'en-US': `${siteUrl}/category/${cat.id}`,
      },
    },
  }));

  // 3. Dedicated Master Landing Pages (TR: /service/[slug] & EN: /en/service/[slug])
  const allApis = getAllApisWithSlugs();
  const serviceRoutesTr: MetadataRoute.Sitemap = allApis.map((api) => ({
    url: `${siteUrl}/service/${api.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        'tr-TR': `${siteUrl}/service/${api.slug}`,
        'en-US': `${siteUrl}/en/service/${api.slug}`,
      },
    },
  }));

  const serviceRoutesEn: MetadataRoute.Sitemap = allApis.map((api) => ({
    url: `${siteUrl}/en/service/${api.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        'tr-TR': `${siteUrl}/service/${api.slug}`,
        'en-US': `${siteUrl}/en/service/${api.slug}`,
      },
    },
  }));

  return [...homeRoutes, ...categoryRoutes, ...serviceRoutesTr, ...serviceRoutesEn];
}
