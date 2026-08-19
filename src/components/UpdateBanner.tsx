'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const STORAGE_KEY = 'free-api-banner-dismissed-v1';

export function UpdateBanner() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      document.documentElement.style.setProperty('--banner-height', '0px');
      return;
    }
    const updateHeight = () => {
      if (bannerRef.current) {
        const height = bannerRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--banner-height', `${height}px`);
      }
    };

    const timeoutId = setTimeout(updateHeight, 50);
    window.addEventListener('resize', updateHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateHeight);
    };
  }, [isVisible]);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const scrollToExplorer = () => {
    const el = document.getElementById('explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    dismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={bannerRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="sticky top-0 z-[60] overflow-hidden bg-stone-900 dark:bg-black border-b border-rose-900/30 text-xs text-stone-200"
        >
          <div className="relative max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-3 text-center">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-bold text-rose-400">{t.banner.liveGuide}</span>
              <span className="text-stone-300">{t.banner.text}</span>
            </div>

            <button
              type="button"
              onClick={scrollToExplorer}
              className="hidden sm:inline-flex items-center gap-1 font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-2 ml-2 cursor-pointer"
            >
              <span>{language === 'tr' ? 'Hemen İncele' : 'Explore Now'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={dismiss}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors ml-auto sm:ml-4 cursor-pointer"
              aria-label={language === 'tr' ? 'Kapat' : 'Dismiss'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
