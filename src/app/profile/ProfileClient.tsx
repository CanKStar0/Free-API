'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Layers,
  Star,
  Trash2,
  Share2,
  ExternalLink,
  Bot,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Plus,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useLanguage } from '@/context/LanguageContext';
import { useBookmarks } from '@/lib/useBookmarks';
import { getClientApiBySlug, ClientApiItem } from '@/lib/client-api-lookup';
import { ApiCard } from '@/components/ApiCard';
import { AuthModal } from '@/components/AuthModal';

interface UserStackItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  apiSlugs: string[];
  isPublic: boolean;
  createdAt: string;
}

export function ProfileClient() {
  const { data: session, isPending } = useSession();
  const { t, language } = useLanguage();
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const [activeTab, setActiveTab] = useState<'stacks' | 'bookmarks'>('stacks');
  const [stacks, setStacks] = useState<UserStackItem[]>([]);
  const [loadingStacks, setLoadingStacks] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAiPromptSlug, setCopiedAiPromptSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  // 1. Fetch user's saved stacks
  useEffect(() => {
    if (!session?.user?.id) {
      setLoadingStacks(false);
      return;
    }

    async function loadStacks() {
      try {
        setLoadingStacks(true);
        const res = await fetch('/api/stacks');
        const data = await res.json();
        if (res.ok && Array.isArray(data.stacks)) {
          setStacks(
            data.stacks.map((s: any) => ({
              ...s,
              apiSlugs: Array.isArray(s.apiSlugs) ? s.apiSlugs : JSON.parse(s.apiSlugs || '[]'),
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load user stacks:', err);
      } finally {
        setLoadingStacks(false);
      }
    }

    loadStacks();
  }, [session?.user?.id]);

  // 2. Delete stack
  const handleDeleteStack = async (slug: string) => {
    if (!confirm(t.profile.deleteConfirm)) return;

    try {
      setDeletingSlug(slug);
      const res = await fetch(`/api/stacks/${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStacks((prev) => prev.filter((s) => s.slug !== slug));
      }
    } catch (err) {
      console.error('Failed to delete stack:', err);
    } finally {
      setDeletingSlug(null);
    }
  };

  // 3. Copy AI Prompt for a stack
  const handleCopyStackAiPrompt = (stackItem: UserStackItem) => {
    const apis = stackItem.apiSlugs
      .map((slug) => getClientApiBySlug(slug))
      .filter((api): api is ClientApiItem => api !== undefined);

    const apiList = apis
      .map(
        (api, idx) =>
          `${idx + 1}. ${api.name} (${api.categoryTitle})\n   - Base URL: ${api.url}\n   - Description: ${api.description}\n   - Rate Limit: ${api.rateLimit}\n   - Auth: ${api.isNoAuth ? 'Public / Zero-Auth' : 'API Key'}`
      )
      .join('\n\n');

    const promptText = `You are an expert Full-Stack TypeScript Architect.

I am building a Next.js 15 App Router project using this custom API Stack ("${stackItem.title}") from FreeAPI Directory:

${apiList}

TASK INSTRUCTIONS:
1. Create a production-ready, strictly-typed service layer for each API under \`src/lib/services/\`.
2. Define TypeScript interfaces for requests and responses.
3. Write resilient fetch functions with error handling, status code checks, and Next.js \`revalidate\` ISR caching.
4. Provide a sample React Server Component or Route Handler that orchestrates data fetching from these endpoints.
5. Create the matching \`.env.local\` environment variable definitions.`;

    navigator.clipboard.writeText(promptText);
    setCopiedAiPromptSlug(stackItem.slug);
    setTimeout(() => setCopiedAiPromptSlug(null), 2500);
  };

  // 4. Resolve all bookmarked APIs
  const bookmarkedApiItems = React.useMemo(() => {
    return bookmarks
      .map((slugOrName) => getClientApiBySlug(slugOrName))
      .filter((api): api is ClientApiItem => api !== undefined);
  }, [bookmarks]);

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  // Not logged in fallback
  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-36 text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20 shadow-inner">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-zinc-100 font-jakarta mb-3">
          {t.profile.signInRequired}
        </h1>
        <p className="text-sm text-stone-600 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
          {t.profile.signInDesc}
        </p>
        <button
          type="button"
          onClick={() => setIsAuthOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.auth.signIn}</span>
        </button>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  const user = session.user;
  const memberDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR', {
        month: 'short',
        year: 'numeric',
      })
    : '2026';

  return (
    <div className="max-w-6xl mx-auto px-4 py-28 sm:py-32">
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden glass border border-stone-200/80 dark:border-zinc-800 shadow-2xl mb-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/10 dark:bg-brand-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {user.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover ring-2 ring-brand-500/30 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-zinc-100 font-jakarta">
                  {user.name || 'Developer'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> Verified Dev
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400 font-mono mb-2">
                {user.email}
              </p>
              <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.profile.memberSince}: {memberDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial p-3.5 px-5 rounded-2xl bg-stone-100/80 dark:bg-zinc-900/80 border border-stone-200/80 dark:border-zinc-800 text-center">
              <p className="text-lg font-extrabold text-brand-600 dark:text-brand-400">
                {stacks.length}
              </p>
              <p className="text-[10px] text-stone-500 dark:text-zinc-400 uppercase font-semibold">
                {t.profile.createdStacksCount}
              </p>
            </div>

            <div className="flex-1 md:flex-initial p-3.5 px-5 rounded-2xl bg-stone-100/80 dark:bg-zinc-900/80 border border-stone-200/80 dark:border-zinc-800 text-center">
              <p className="text-lg font-extrabold text-amber-500">
                {bookmarks.length}
              </p>
              <p className="text-[10px] text-stone-500 dark:text-zinc-400 uppercase font-semibold">
                {t.profile.savedBookmarksCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-stone-200 dark:border-zinc-800 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('stacks')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'stacks'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.profile.tabStacks} ({stacks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500" />
          <span>{t.profile.tabBookmarks} ({bookmarks.length})</span>
        </button>
      </div>

      {/* Tab 1: Saved Stacks */}
      {activeTab === 'stacks' && (
        <div>
          {loadingStacks ? (
            <div className="py-16 text-center">
              <Loader2 className="w-6 h-6 text-brand-600 animate-spin mx-auto" />
            </div>
          ) : stacks.length === 0 ? (
            <div className="text-center py-20 rounded-3xl glass border border-stone-200/80 dark:border-zinc-800 p-8">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-stone-100 dark:bg-zinc-900 flex items-center justify-center text-stone-400 mb-4 border border-stone-200 dark:border-zinc-800">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-zinc-200 mb-1">
                {t.profile.noStacksYet}
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
                {t.profile.noStacksDesc}
              </p>
              <Link
                href={language === 'en' ? '/en' : '/'}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
              >
                <span>{t.hero.ctaButton}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stacks.map((stackItem) => (
                <div
                  key={stackItem.id}
                  className="glass rounded-2xl p-6 border border-stone-200/80 dark:border-zinc-800 flex flex-col justify-between hover:border-brand-500/40 transition-all group shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <Link
                          href={language === 'en' ? `/en/stack/${stackItem.slug}` : `/stack/${stackItem.slug}`}
                          className="text-base font-bold text-stone-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {stackItem.title}
                        </Link>
                        <p className="text-[11px] text-stone-500 dark:text-zinc-400 font-mono mt-0.5">
                          /stack/{stackItem.slug}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteStack(stackItem.slug)}
                        disabled={deletingSlug === stackItem.slug}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title={t.profile.deleteStack}
                      >
                        {deletingSlug === stackItem.slug ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {stackItem.description && (
                      <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2 mb-4">
                        {stackItem.description}
                      </p>
                    )}

                    {/* Included APIs pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {stackItem.apiSlugs.map((slug) => {
                        const api = getClientApiBySlug(slug);
                        return (
                          <span
                            key={slug}
                            className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300"
                          >
                            <span>{api?.categoryEmoji || '⚡'}</span>
                            <span>{api?.name || slug}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stack Card Actions */}
                  <div className="pt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyStackAiPrompt(stackItem)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedAiPromptSlug === stackItem.slug ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{t.stack.copied}</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Prompt</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={language === 'en' ? `/en/stack/${stackItem.slug}` : `/stack/${stackItem.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-stone-800 dark:text-zinc-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      <span>{t.profile.viewStack}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bookmarked APIs */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarkedApiItems.length === 0 ? (
            <div className="text-center py-20 rounded-3xl glass border border-stone-200/80 dark:border-zinc-800 p-8">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-zinc-200 mb-1">
                {t.profile.noBookmarksYet}
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
                {t.profile.noBookmarksDesc}
              </p>
              <Link
                href={language === 'en' ? '/en' : '/'}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
              >
                <span>{t.hero.ctaButton}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedApiItems.map((api) => (
                <ApiCard
                  key={api.slug}
                  api={api}
                  categoryTitle={api.categoryTitle}
                  isBookmarked={isBookmarked(api.name)}
                  onToggleBookmark={() => toggleBookmark(api.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
