'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '@/data/apis';
import { useLanguage } from '@/context/LanguageContext';
import { translateDescription, translateRateLimit, getDirectEndpoint } from '@/lib/api-translator';
import { ExternalLink, Star, Code2, Check, Copy, ShieldCheck, Zap, ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/slugify';
import { useStack } from '@/context/StackContext';

interface ApiCardProps {
  api: ApiService;
  categoryTitle?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (apiName: string) => void;
}

type CodeTab = 'curl' | 'js' | 'python';

export function ApiCard({ api, categoryTitle, isBookmarked = false, onToggleBookmark }: ApiCardProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const { toggleStack, isInStack } = useStack();
  const [showCode, setShowCode] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeTab>('curl');
  const [copied, setCopied] = useState(false);

  const endpoint = getDirectEndpoint(api);
  const apiSlug = slugify(api.name);
  const serviceUrl = language === 'en' ? `/en/service/${apiSlug}` : `/service/${apiSlug}`;
  const isStackSelected = isInStack(apiSlug);

  const getCodeSnippet = (tab: CodeTab): string => {
    switch (tab) {
      case 'curl':
        return `curl -X GET "${endpoint}" \\\n  -H "Accept: application/json"`;
      case 'js':
        return `// JavaScript / TypeScript (Fetch)\nconst response = await fetch("${endpoint}", {\n  headers: { "Accept": "application/json" }\n});\nconst data = await response.json();\nconsole.log(data);`;
      case 'python':
        return `# Python (requests)\nimport requests\n\nresponse = requests.get("${endpoint}", headers={"Accept": "application/json"})\ndata = response.json()\nprint(data)`;
      default:
        return '';
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const snippet = getCodeSnippet(activeTab);
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't navigate if clicking on buttons, links, inputs, or code blocks
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('pre') ||
      target.closest('code')
    ) {
      return;
    }
    router.push(serviceUrl);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      className="glass-card rounded-2xl p-5 flex flex-col justify-between relative group cursor-pointer border border-stone-200/80 dark:border-white/[0.08] hover:border-brand-700/50 dark:hover:border-brand-500/40 hover:shadow-xl transition-all duration-300"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            {categoryTitle && (
              <span className="text-[11px] font-medium tracking-wide uppercase text-stone-500 dark:text-zinc-400 mb-0.5 block">
                {categoryTitle}
              </span>
            )}
            <Link
              href={serviceUrl}
              onClick={(e) => e.stopPropagation()}
              className="hover:underline inline-block"
            >
              <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                {api.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark Toggle */}
            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(api.name);
                }}
                aria-label={isBookmarked ? t.card.removeFromBookmarks : t.card.addToBookmarks}
                className={`p-2 rounded-xl transition-colors ${
                  isBookmarked
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-stone-400 dark:text-zinc-500 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>
            )}

            {/* Direct Doc Link */}
            <a
              href={api.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl text-stone-400 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label={`${api.name} documentation`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
          {translateDescription(api, language)}
        </p>
      </div>

      {/* Badges & Meta */}
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
          {/* Recommended Badge */}
          {api.isRecommended && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
              <Zap className="w-3 h-3" />
              {t.card.recommended}
            </span>
          )}

          {/* Rate Limit */}
          <span className="px-2.5 py-1 rounded-lg font-mono bg-stone-100 dark:bg-zinc-800/80 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700/60">
            {translateRateLimit(api.rateLimit, language)}
          </span>

          {/* HTTPS Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-mono text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            {t.card.https}
          </span>
        </div>

        {/* Actions / Snippet Drawer Button */}
        <div className="pt-3 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCode(!showCode);
              }}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                showCode
                  ? 'bg-brand-700 dark:bg-brand-500 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              {showCode ? t.card.closeCode : t.card.codeSnippet}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStack(apiSlug);
              }}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                isStackSelected
                  ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
              }`}
              title={isStackSelected ? t.stack.removeFromStack : t.stack.addToStack}
            >
              <Layers className={`w-3.5 h-3.5 ${isStackSelected ? 'text-brand-600 dark:text-brand-400' : ''}`} />
              <span>{isStackSelected ? t.stack.inStack : t.stack.addToStack}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={serviceUrl}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold text-brand-700 dark:text-brand-400 hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>{language === 'tr' ? 'Detaylar' : 'Details'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Code Drawer Accordion */}
        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="overflow-hidden mt-3 pt-3 border-t border-stone-100 dark:border-zinc-800"
            >
              {/* Tab Selector */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-800/80 p-1 rounded-lg">
                  {(['curl', 'js', 'python'] as CodeTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab);
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                        activeTab === tab
                          ? 'bg-brand-700 text-white shadow-xs'
                          : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {tab === 'curl' ? 'cURL' : tab === 'js' ? 'JS' : 'Python'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-zinc-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">{t.card.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.card.copy}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl bg-zinc-950 p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto border border-zinc-800">
                <pre className="leading-relaxed whitespace-pre-wrap">{getCodeSnippet(activeTab)}</pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
