'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, ShieldCheck, Bot, Lock } from 'lucide-react';

const NEW_CATEGORIES = [
  { icon: '🔒', name: 'Güvenlik ve Siber' },
  { icon: '🔑', name: 'Kimlik Doğrulama' },
  { icon: '🤖', name: 'Yapay Zeka ve ML' },
  { icon: '📝', name: 'Metin ve Dil Analizi' },
  { icon: '🛒', name: 'E-Ticaret' },
  { icon: '✅', name: 'Veri Doğrulama' },
  { icon: '⚙️', name: 'CI/CD' },
  { icon: '📜', name: 'Patent' },
  { icon: '📫', name: 'Kargo Takip' },
  { icon: '📞', name: 'Telefon & SMS' },
];

const STORAGE_KEY = 'update-banner-v2.1-dismissed';

export function UpdateBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState(0);
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
    
    // Allow initial render/animation to start before measuring
    const timeoutId = setTimeout(updateHeight, 50);
    window.addEventListener('resize', updateHeight);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateHeight);
    };
  }, [isVisible, currentTag]);

  // Rotate through new category tags
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentTag(prev => (prev + 1) % NEW_CATEGORIES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isVisible]);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={bannerRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="sticky top-0 z-[60] overflow-hidden shadow-md"
          style={{
            background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 30%, #0f172a 60%, #1a1a2e 100%)',
          }}
        >
          {/* Animated gradient shimmer */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 30%, rgba(14,165,233,0.4) 60%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative px-4 py-3.5 flex items-center justify-center gap-4 flex-wrap text-center">
            {/* Sparkle icon */}
            <motion.div
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
            </motion.div>

            {/* Main text */}
            <span className="text-white text-base font-semibold whitespace-nowrap">
              🎉 <span className="text-emerald-400">Güncelleme v2.0</span>
              <span className="text-slate-300 font-normal mx-2">—</span>
              <span className="text-sky-300">10 yeni kategori</span> ve{' '}
              <span className="text-violet-300">529+ API</span> eklendi!
            </span>

            {/* Rotating category pill */}
            <div className="relative h-7 w-52 hidden sm:block overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTag}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span
                    className="flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold text-white"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
                  >
                    <span>{NEW_CATEGORIES[currentTag].icon}</span>
                    <span>{NEW_CATEGORIES[currentTag].name}</span>
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA link */}
            <a
              href="#categories"
              onClick={dismiss}
              className="flex items-center gap-1.5 text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors whitespace-nowrap underline-offset-2 hover:underline"
            >
              Keşfet
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Dismiss button */}
            <button
              onClick={dismiss}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
