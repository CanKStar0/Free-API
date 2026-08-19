'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { categories, Category, ApiService } from '@/data/apis';
import { useLanguage } from '@/context/LanguageContext';
import { useSearch } from '@/context/SearchContext';
import { ApiCard } from './ApiCard';
import { CategoryIcon } from './CategoryIcon';
import { translateDescription } from '@/lib/api-translator';


import {
  Search,
  Star,
  Zap,
  Folder,
  ArrowRight,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

export function CategoryGrid() {
  const { t } = useLanguage();
  const { searchQuery, setSearchQuery, activeTab, setActiveTab, selectedCategory, setSelectedCategory } = useSearch();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);


  // Load bookmarks on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('api_showcase_bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Toggle Bookmark handler
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

  // Helper to get translated category info
  const getCatTitle = (cat: Category) => t.categoryTitles[cat.id]?.title || cat.title;
  const getCatDesc = (cat: Category) => t.categoryTitles[cat.id]?.description || cat.description;

  // Flatten all APIs with category info
  const allApisWithCategory = useMemo(() => {
    const list: { api: ApiService; category: Category }[] = [];
    categories.forEach((cat) => {
      cat.apis.forEach((api) => {
        list.push({ api, category: cat });
      });
    });
    return list;
  }, []);

  // Filtered APIs based on search & tabs
  const filteredApis = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allApisWithCategory.filter(({ api, category }) => {
      // Category filter
      if (selectedCategory !== 'all' && category.id !== selectedCategory) {
        return false;
      }

      // Tab filter
      if (activeTab === 'bookmarks' && !bookmarks.includes(api.name)) {
        return false;
      }
      if (activeTab === 'recommended' && !api.isRecommended) {
        return false;
      }
      if (activeTab === 'no-auth') {
        const desc = api.description.toLowerCase();
        if (!desc.includes('kayıt gerektirmez') && !desc.includes('kayıt yok') && !desc.includes('no key') && !desc.includes('free') && !desc.includes('sınırsız')) {
          return false;
        }
      }

      // Search Query
      if (q) {
        const catTitle = (t.categoryTitles[category.id]?.title || category.title).toLowerCase();
        const matchesName = api.name.toLowerCase().includes(q);
        const matchesDesc = api.description.toLowerCase().includes(q);
        const matchesDescEn = translateDescription(api, 'en').toLowerCase().includes(q);
        const matchesCat = catTitle.includes(q);
        return matchesName || matchesDesc || matchesDescEn || matchesCat;
      }


      return true;
    });
  }, [allApisWithCategory, searchQuery, activeTab, selectedCategory, bookmarks, t]);

  // Total counts
  const totalApisCount = allApisWithCategory.length;

  // Decide if we should show category cards or direct API cards
  const isDirectApiView = searchQuery.trim().length > 0 || activeTab !== 'categories' || selectedCategory !== 'all';

  return (
    <section id="explorer" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Explorer Controls Bar */}
      <div className="glass-card rounded-3xl p-6 mb-10 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-md">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.explorer.searchPlaceholder}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700 dark:focus:ring-brand-500 transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700 dark:focus:ring-brand-500 cursor-pointer"
            >
              <option value="all">{t.explorer.allCategories} ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getCatTitle(cat)} ({cat.apis.length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-100 dark:border-zinc-800/80 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('categories'); setSelectedCategory('all'); setSearchQuery(''); }}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'categories' && !searchQuery && selectedCategory === 'all'
                ? 'bg-brand-700 dark:bg-brand-600 text-white font-bold shadow-sm'
                : 'bg-stone-100 dark:bg-zinc-800/80 text-stone-600 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>{t.explorer.tabCategories} ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all-apis')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'all-apis'
                ? 'bg-brand-700 dark:bg-brand-600 text-white font-bold shadow-sm'
                : 'bg-stone-100 dark:bg-zinc-800/80 text-stone-600 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.explorer.tabAllApis} ({totalApisCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recommended')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'recommended'
                ? 'bg-brand-700 dark:bg-brand-600 text-white font-bold shadow-sm'
                : 'bg-stone-100 dark:bg-zinc-800/80 text-stone-600 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.explorer.tabRecommended}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('no-auth')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'no-auth'
                ? 'bg-brand-700 dark:bg-brand-600 text-white font-bold shadow-sm'
                : 'bg-stone-100 dark:bg-zinc-800/80 text-stone-600 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.explorer.tabNoAuth}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ml-auto ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-100 dark:bg-zinc-800/80 text-stone-600 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isClient && bookmarks.length > 0 ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{t.explorer.tabBookmarks} ({isClient ? bookmarks.length : 0})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isDirectApiView ? (
        /* Direct API Cards Grid */
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-100">
              {searchQuery ? `${t.explorer.resultsPrefix} "${searchQuery}"` : activeTab === 'bookmarks' ? t.explorer.resultsBookmarks : activeTab === 'recommended' ? t.explorer.resultsRecommended : t.explorer.resultsAll}
            </h2>
            <span className="text-xs font-mono text-stone-500 dark:text-zinc-400">
              {filteredApis.length} {t.explorer.apisListed}
            </span>
          </div>

          {filteredApis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredApis.map(({ api, category }) => (
                <ApiCard
                  key={`${category.id}-${api.name}`}
                  api={api}
                  categoryTitle={getCatTitle(category)}
                  isBookmarked={bookmarks.includes(api.name)}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card rounded-3xl p-8 border border-stone-200 dark:border-zinc-800">
              <p className="text-stone-600 dark:text-zinc-400 mb-4">
                {t.explorer.noResultsText}
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveTab('categories'); setSelectedCategory('all'); }}
                className="px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold"
              >
                {t.explorer.clearFilters}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Category Cards Grid */
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-100">
              {t.explorer.categoryTitle}
            </h2>
            <span className="text-xs font-mono text-stone-500 dark:text-zinc-400">
              {categories.length} {t.explorer.categorySubtitle}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-stone-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/60 group hover:border-brand-700/50 dark:hover:border-brand-500/50 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <CategoryIcon categoryId={category.id} size={22} />
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-bold border border-stone-200 dark:border-zinc-700">
                      {category.apis.length} API
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors mb-2">
                    {getCatTitle(category)}
                  </h3>


                  <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {getCatDesc(category)}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  {category.recommendedApi ? (
                    <span className="text-[11px] font-mono text-stone-500 dark:text-zinc-400">
                      {t.explorer.recommendedLabel} <strong className="text-brand-700 dark:text-brand-400 font-semibold">{category.recommendedApi}</strong>
                    </span>
                  ) : (
                    <span />
                  )}

                  <span className="font-semibold text-brand-700 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {t.explorer.exploreCategory}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
