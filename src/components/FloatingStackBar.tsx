'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Download, ChevronRight } from 'lucide-react';
import { useStack } from '@/context/StackContext';
import { useLanguage } from '@/context/LanguageContext';

export function FloatingStackBar() {
  const { selectedSlugs, selectedApis, setIsDrawerOpen, openExport } = useStack();
  const { t } = useLanguage();

  if (selectedSlugs.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="fixed bottom-6 right-6 z-40 max-w-sm sm:max-w-md pointer-events-auto"
      >
        <div className="flex items-center gap-3 p-2.5 pl-4 rounded-2xl glass shadow-2xl border border-brand-500/30 dark:border-brand-500/40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
          {/* Badge & Avatar Stack */}
          <div
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white ring-2 ring-white dark:ring-zinc-950">
                {selectedSlugs.length}
              </span>
            </div>

            <div className="text-left hidden xs:block sm:block">
              <p className="text-xs font-extrabold text-stone-900 dark:text-zinc-100 font-jakarta flex items-center gap-1">
                <span>{selectedSlugs.length} {t.stack.floatingBarText}</span>
              </p>
              <p className="text-[10px] text-stone-500 dark:text-zinc-400 truncate max-w-[140px]">
                {selectedApis.map((a) => a.name).join(', ') || 'Custom Stack'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 ml-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>{t.stack.viewStack}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={openExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.stack.exportCode}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
