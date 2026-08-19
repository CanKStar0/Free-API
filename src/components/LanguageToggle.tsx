'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <nav
      className="relative flex items-center h-8 rounded-full border border-stone-200/80 dark:border-zinc-800 bg-stone-100/90 dark:bg-zinc-900/90 overflow-hidden select-none shadow-sm"
      aria-label="Language selector"
    >
      {/* Sliding red pill indicator */}
      <motion.div
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-brand-700 dark:bg-brand-600 shadow-[0_0_12px_rgba(225,29,72,0.45)]"
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{
          left: language === 'tr' ? '2px' : 'calc(50%)',
        }}
      />

      <button
        type="button"
        onClick={() => setLanguage('tr')}
        aria-label="Türkçe"
        className={`relative z-10 flex items-center justify-center w-[34px] h-full text-[11px] font-bold tracking-wider cursor-pointer transition-colors duration-200 ${
          language === 'tr'
            ? 'text-white'
            : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
        }`}
      >
        TR
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-label="English"
        className={`relative z-10 flex items-center justify-center w-[34px] h-full text-[11px] font-bold tracking-wider cursor-pointer transition-colors duration-200 ${
          language === 'en'
            ? 'text-white'
            : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
        }`}
      >
        EN
      </button>
    </nav>
  );
}
