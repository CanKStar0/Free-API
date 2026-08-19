'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '@/data/apis';
import { useLanguage } from '@/context/LanguageContext';
import { translateDescription, translateRateLimit, getDirectEndpoint } from '@/lib/api-translator';
import { ExternalLink, Star, Code2, Check, Copy, ShieldCheck, Zap } from 'lucide-react';

interface ApiCardProps {
  api: ApiService;
  categoryTitle?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (apiName: string) => void;
}

type CodeTab = 'curl' | 'js' | 'python';

export function ApiCard({ api, categoryTitle, isBookmarked = false, onToggleBookmark }: ApiCardProps) {
  const { t, language } = useLanguage();

  const [showCode, setShowCode] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeTab>('curl');
  const [copied, setCopied] = useState(false);

  const endpoint = getDirectEndpoint(api);

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="glass-card rounded-2xl p-5 flex flex-col justify-between relative group border border-stone-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/60 shadow-sm"
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
            <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100 group-hover:text-brand-700 dark:group-hover:text-brand-500 transition-colors">
              {api.name}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark Toggle */}
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(api.name)}
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
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              showCode
                ? 'bg-brand-700 dark:bg-brand-500 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            {showCode ? t.card.closeCode : t.card.codeSnippet}
          </button>

          <a
            href={api.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand-700 dark:text-brand-500 hover:underline flex items-center gap-1"
          >
            {t.card.details}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Code Drawer Accordion */}
        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-3 pt-3 border-t border-stone-100 dark:border-zinc-800"
            >
              {/* Tab Selector */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-950 p-0.5 rounded-lg border border-stone-200 dark:border-zinc-800 text-[11px] font-mono">
                  {(['curl', 'js', 'python'] as CodeTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        activeTab === tab
                          ? 'bg-brand-700 dark:bg-brand-500 text-white font-bold'
                          : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {tab === 'curl' ? 'cURL' : tab === 'js' ? 'Fetch' : 'Python'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">{t.card.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t.card.copy}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Snippet Box */}
              <pre className="p-2.5 rounded-xl bg-stone-900 dark:bg-black text-stone-100 font-mono text-[11px] overflow-x-auto border border-stone-800 leading-relaxed scrollbar-none">
                <code>{getCodeSnippet(activeTab)}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
