'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Download,
  Share2,
  Save,
  Check,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
  Loader2,
} from 'lucide-react';
import { useStack } from '@/context/StackContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';

interface StackDrawerProps {
  onOpenAuthModal?: () => void;
}

export function StackDrawer({ onOpenAuthModal }: StackDrawerProps) {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    selectedSlugs,
    selectedApis,
    removeFromStack,
    clearStack,
    openExport,
  } = useStack();

  const { t, language } = useLanguage();
  const { data: session } = useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessSlug, setSaveSuccessSlug] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSaveStack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (!title.trim() || selectedSlugs.length === 0) return;

    try {
      setIsSaving(true);
      const res = await fetch('/api/stacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          apiSlugs: selectedSlugs,
          isPublic: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.stack?.slug) {
        setSaveSuccessSlug(data.stack.slug);
      }
    } catch (err) {
      console.error('Failed to save stack:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareQuickLink = () => {
    const url = `${window.location.origin}${language === 'en' ? '/en' : ''}/?apis=${selectedSlugs.join(',')}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsDrawerOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-screen max-w-md bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-l border-stone-200/80 dark:border-zinc-800 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/20 shadow-inner">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-zinc-100 font-jakarta">
                    {t.stack.drawerTitle}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    {selectedSlugs.length} {t.stack.floatingBarText}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {selectedSlugs.length > 0 && (
                  <button
                    type="button"
                    onClick={clearStack}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title={t.stack.clearAll}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedSlugs.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-14 h-14 mx-auto rounded-3xl bg-stone-100 dark:bg-zinc-900 flex items-center justify-center text-stone-400 mb-4 border border-stone-200/60 dark:border-zinc-800">
                    <Layers className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-800 dark:text-zinc-200 mb-1">
                    {t.stack.emptyStack}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                    {t.stack.emptyStackDesc}
                  </p>
                </div>
              ) : (
                <>
                  {/* Selected APIs List */}
                  <div className="space-y-2.5">
                    {selectedApis.map((api) => (
                      <div
                        key={api.slug}
                        className="flex items-center justify-between p-3.5 rounded-2xl glass border border-stone-200/70 dark:border-zinc-800/80 hover:border-brand-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg">{api.categoryEmoji || '⚡'}</span>
                          <div className="min-w-0">
                            <Link
                              href={language === 'en' ? `/en/service/${api.slug}` : `/service/${api.slug}`}
                              className="text-xs font-bold text-stone-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 truncate block"
                            >
                              {api.name}
                            </Link>
                            <p className="text-[10px] text-stone-500 dark:text-zinc-400 truncate">
                              {api.categoryTitle} • {api.rateLimit}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromStack(api.slug)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title={t.stack.removeFromStack}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Save to Cloud Form */}
                  <div className="rounded-2xl p-4 bg-stone-50/80 dark:bg-zinc-900/50 border border-stone-200/80 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        <span>{t.stack.saveStack}</span>
                      </span>
                    </div>

                    {saveSuccessSlug ? (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                        <p className="font-bold mb-1">{t.stack.saveSuccess}</p>
                        <p className="text-[11px] break-all">
                          {window.location.origin}/stack/{saveSuccessSlug}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveStack} className="space-y-2.5">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder={t.stack.stackTitlePlaceholder}
                          required
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder={t.stack.stackDescPlaceholder}
                          rows={2}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                        />

                        {session?.user ? (
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={isSaving || !title.trim()}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isSaving ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            <span>{isSaving ? t.stack.saving : t.stack.saveStack}</span>
                          </motion.button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsDrawerOpen(false);
                              if (onOpenAuthModal) onOpenAuthModal();
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t.stack.mustLoginToSave}</span>
                          </button>
                        )}
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer Buttons */}
            {selectedSlugs.length > 0 && (
              <div className="p-5 border-t border-stone-200/80 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/40 flex flex-col gap-2.5">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={openExport}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.stack.exportCode}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleShareQuickLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white hover:bg-stone-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-stone-800 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  <span>{copiedLink ? t.stack.linkCopied : t.stack.shareLink}</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
