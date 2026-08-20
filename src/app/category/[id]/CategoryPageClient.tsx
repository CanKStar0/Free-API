'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/data/apis';
import { useLanguage } from '@/context/LanguageContext';
import { ApiCard } from '@/components/ApiCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import { translateDescription } from '@/lib/api-translator';
import { ArrowLeft, Search, Layers, X } from 'lucide-react';

interface CategoryPageClientProps {
  category: Category;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [customApis, setCustomApis] = useState<any[]>([]);

  const catTitle = t.categoryTitles[category.id]?.title || category.title;
  const catDesc = t.categoryTitles[category.id]?.description || category.description;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('api_showcase_bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }

    fetch('/api/submissions/approved')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.apis)) {
          const matching = data.apis.filter((a: any) => a.categoryId === category.id);
          setCustomApis(matching);
        }
      })
      .catch(() => {});
  }, [category.id]);

  const handleToggleBookmark = (apiName: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(apiName)
        ? prev.filter((name) => name !== apiName)
        : [...prev, apiName];
      try {
        localStorage.setItem('api_showcase_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const allCategoryApis = useMemo(() => {
    if (customApis.length === 0) return category.apis;
    return [...customApis, ...category.apis];
  }, [category.apis, customApis]);

  const filteredApis = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allCategoryApis;

    return allCategoryApis.filter((api) => {
      const matchesName = api.name.toLowerCase().includes(q);
      const matchesDesc = api.description.toLowerCase().includes(q);
      return matchesName || matchesDesc;
    });
  }, [allCategoryApis, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
      {/* Back to Home Link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl glass text-stone-600 dark:text-zinc-400 hover:text-brand-700 dark:hover:text-brand-400 hover:border-brand-700/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.categoryPage.backToCategories}</span>
        </Link>
      </div>

      {/* Category Header Banner */}
      <div className="glass-card rounded-3xl p-8 mb-10 border border-stone-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 shadow-md relative overflow-hidden">
        {/* Subtle Crimson Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-700/10 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <CategoryIcon categoryId={category.id} size={28} className="w-16 h-16 rounded-3xl shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-700 dark:text-brand-400 font-bold">
                  {t.categoryPage.categoryNumber} #{category.number}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700">
                  {category.apis.length} API
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-zinc-50 mb-2">
                {catTitle}
              </h1>
              <p className="text-sm text-stone-600 dark:text-zinc-400 max-w-xl">
                {catDesc}
              </p>
            </div>
          </div>

          {/* Quick Search within Category */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-stone-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.categoryPage.searchInCategory}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700 font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* API Cards Grid */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-700 dark:text-brand-400" />
          <span>{t.categoryPage.availableServices} ({filteredApis.length})</span>
        </h2>
      </div>

      {filteredApis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApis.map((api) => (
            <ApiCard
              key={api.name}
              api={api}
              categoryTitle={catTitle}
              isBookmarked={bookmarks.includes(api.name)}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-3xl p-8 border border-stone-200 dark:border-zinc-800">
          <p className="text-stone-600 dark:text-zinc-400 mb-4">
            {t.categoryPage.noResults}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold"
          >
            {t.categoryPage.clearSearch}
          </button>
        </div>
      )}
    </div>
  );
}




