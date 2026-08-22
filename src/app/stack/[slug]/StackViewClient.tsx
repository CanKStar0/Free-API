'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  Download,
  Share2,
  Check,
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  Plus,
  Bot,
} from 'lucide-react';
import { ApiCard } from '@/components/ApiCard';
import { useStack } from '@/context/StackContext';
import { useLanguage } from '@/context/LanguageContext';
import { getClientApiBySlug, ClientApiItem } from '@/lib/client-api-lookup';
import { useBookmarks } from '@/lib/useBookmarks';

interface StackData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  apiSlugs: string[];
  isPublic: boolean;
  createdAt: string;
  authorName: string | null;
  authorImage: string | null;
}

interface StackViewClientProps {
  stack: StackData;
}

export function StackViewClient({ stack }: StackViewClientProps) {
  const { t, language } = useLanguage();
  const { addToStack, openExport } = useStack();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [copied, setCopied] = React.useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = React.useState(false);

  const resolvedApis: ClientApiItem[] = React.useMemo(() => {
    return stack.apiSlugs
      .map((slug) => getClientApiBySlug(slug))
      .filter((api): api is ClientApiItem => api !== undefined);
  }, [stack.apiSlugs]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAiPrompt = () => {
    const apiList = resolvedApis
      .map(
        (api, idx) =>
          `${idx + 1}. ${api.name} (${api.categoryTitle})\n   - Base URL: ${api.url}\n   - Description: ${api.description}\n   - Rate Limit: ${api.rateLimit}\n   - Auth: ${api.isNoAuth ? 'Public' : 'API Key Required'}`
      )
      .join('\n\n');

    const promptText = `You are an expert Full-Stack TypeScript Architect.

I am building a Next.js 15 App Router project using this curated API Stack ("${stack.title}") from FreeAPI Directory:

${apiList}

TASK INSTRUCTIONS:
1. Create a production-ready, strictly-typed service layer for each API under \`src/lib/services/\`.
2. Define TypeScript interfaces for requests and responses.
3. Write resilient fetch functions with error handling, status code checks, and Next.js \`revalidate\` ISR caching.
4. Provide a sample React Server Component or Route Handler that orchestrates data fetching from these endpoints.
5. Create the matching \`.env.local\` environment variable definitions.`;

    navigator.clipboard.writeText(promptText);
    setCopiedAiPrompt(true);
    setTimeout(() => setCopiedAiPrompt(false), 2500);
  };

  const handleImportAll = () => {
    stack.apiSlugs.forEach((slug) => addToStack(slug));
  };

  const formattedDate = new Date(stack.createdAt).toLocaleDateString(
    language === 'en' ? 'en-US' : 'tr-TR',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-28 sm:py-32">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href={language === 'en' ? '/en' : '/'}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.nav.home}</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden glass border border-stone-200/80 dark:border-zinc-800 shadow-2xl mb-12">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Layers className="w-3.5 h-3.5" />
              <span>DEVELOPER API STACK</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-zinc-100 font-jakarta tracking-tight">
              {stack.title}
            </h1>

            {stack.description && (
              <p className="text-sm sm:text-base text-stone-600 dark:text-zinc-400 leading-relaxed">
                {stack.description}
              </p>
            )}

            {/* Author and Date Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-zinc-400 pt-2 border-t border-stone-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                {stack.authorImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={stack.authorImage}
                    alt={stack.authorName || 'Author'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-stone-400" />
                )}
                <span className="font-semibold text-stone-800 dark:text-zinc-200">
                  {stack.authorName || 'FreeAPI Curator'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>

              <div className="font-mono text-[11px] bg-stone-100 dark:bg-zinc-800/70 px-2.5 py-0.5 rounded-lg border border-stone-200 dark:border-zinc-700">
                {resolvedApis.length} APIs Included
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleCopyAiPrompt}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all cursor-pointer"
            >
              {copiedAiPrompt ? <Check className="w-4 h-4 text-emerald-300" /> : <Bot className="w-4 h-4" />}
              <span>{copiedAiPrompt ? t.stack.aiPromptCopied : t.stack.copyAiPrompt}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleImportAll}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.stack.addToStack}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white hover:bg-stone-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-stone-800 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? t.stack.linkCopied : t.stack.shareStack}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Grid of Included APIs */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-100 font-jakarta mb-2">
          Pakete Dahil Olan API Servisleri
        </h2>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          Bu mimaride birlikte çalışan doğrulanmış uç noktalar ve limit bilgileri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resolvedApis.map((api) => (
          <ApiCard
            key={api.slug}
            api={api}
            categoryTitle={api.categoryTitle}
            isBookmarked={isBookmarked(api.name)}
            onToggleBookmark={() => toggleBookmark(api.name)}
          />
        ))}
      </div>
    </div>
  );
}
