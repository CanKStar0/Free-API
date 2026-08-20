import fs from 'fs';
import path from 'path';
import { categories, Category, ApiService } from '@/data/apis';

export interface EnrichedApiService extends ApiService {
  slug: string;
  category: Category;
  categoryId: string;
  categoryTitle: string;
  categoryTitleEn: string;
  isCustom?: boolean;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const CUSTOM_APIS_FILE = path.join(process.cwd(), 'src', 'data', 'custom-apis.json');

export function getCustomApis(): any[] {
  try {
    if (fs.existsSync(CUSTOM_APIS_FILE)) {
      const data = fs.readFileSync(CUSTOM_APIS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return [];
}

export function getAllApisWithSlugs(): EnrichedApiService[] {
  const result: EnrichedApiService[] = [];
  const slugSet = new Set<string>();

  // 1. Standard Category APIs
  for (const cat of categories) {
    for (const api of cat.apis) {
      let slug = slugify(api.name);
      if (!slug) slug = 'api-' + Math.random().toString(36).substring(2, 6);
      if (slugSet.has(slug)) {
        slug = `${slug}-${cat.id}`;
      }
      slugSet.add(slug);

      result.push({
        ...api,
        slug,
        category: cat,
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryTitleEn: cat.id,
      });
    }
  }

  // 2. Dynamic Custom Approved APIs
  const customApis = getCustomApis();
  for (const custom of customApis) {
    let slug = slugify(custom.name);
    if (!slug) slug = 'api-' + (custom.id || Math.random().toString(36).substring(2, 6));
    if (slugSet.has(slug)) {
      slug = `${slug}-custom`;
    }
    slugSet.add(slug);

    const matchingCat = categories.find((c) => c.id === custom.categoryId) || categories[0];

    result.unshift({
      name: custom.name,
      url: custom.url,
      description: custom.description,
      description_tr: custom.description_tr || custom.description,
      description_en: custom.description_en || custom.description,
      rateLimit: custom.rateLimit,
      isRecommended: true,
      isNew: true,
      isNoAuth: custom.isNoAuth,
      slug,
      category: matchingCat,
      categoryId: custom.categoryId || matchingCat.id,
      categoryTitle: matchingCat.title,
      categoryTitleEn: matchingCat.id,
      isCustom: true,
    });
  }

  return result;
}

export function getApiBySlug(slug: string): EnrichedApiService | undefined {
  const cleanSlug = slugify(slug);
  const all = getAllApisWithSlugs();
  return all.find((a) => a.slug === cleanSlug || a.slug === slug);
}
