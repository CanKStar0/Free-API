import { categories, ApiService } from '@/data/apis';

export interface ClientApiItem extends ApiService {
  slug: string;
  categoryId: string;
  categoryTitle: string;
  categoryEmoji: string;
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

export function getAllClientApis(): ClientApiItem[] {
  const result: ClientApiItem[] = [];
  const slugSet = new Set<string>();

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
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryEmoji: cat.emoji,
      });
    }
  }

  return result;
}

export function getClientApiBySlug(slug: string): ClientApiItem | undefined {
  const all = getAllClientApis();
  return all.find((item) => item.slug === slug || slugify(item.name) === slug);
}
