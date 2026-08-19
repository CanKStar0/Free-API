'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="text-8xl font-black font-mono text-brand-700 dark:text-brand-500 mb-4 tracking-tighter">
          404
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-zinc-50 mb-3 font-jakarta">
          {t.notFound.title}
        </h1>
        
        <p className="text-sm text-stone-600 dark:text-zinc-400 mb-8 leading-relaxed">
          {t.notFound.desc}
        </p>
        
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>{t.notFound.backHome}</span>
          </Link>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.notFound.goBack}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
