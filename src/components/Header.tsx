'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { SubmitApiModal } from './SubmitApiModal';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, ArrowLeft, Github, Plus } from 'lucide-react';
import { Logo } from './Logo';
import { useState } from 'react';

export function Header() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 ${
              scrolled
                ? 'glass shadow-lg shadow-black/5 dark:shadow-black/40 border border-stone-200/80 dark:border-zinc-800/80'
                : 'bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border border-stone-200/40 dark:border-zinc-800/40'
            }`}
          >
            {/* Left: Ecosystem Bridge & Brand Logo */}
            <div className="flex items-center gap-4">
              {/* Ecosystem Bridge */}
              <a
                href="https://canpolatkaya.com"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-stone-600 dark:text-zinc-400 hover:text-brand-700 dark:hover:text-brand-400 hover:bg-stone-100 dark:hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-zinc-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.nav.backToMain}</span>
              </a>

              <div className="hidden sm:block w-px h-4 bg-stone-300 dark:bg-zinc-800" />

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <Logo className="w-8 h-8 rounded-xl shadow-[0_0_14px_rgba(225,29,72,0.35)] group-hover:scale-105 transition-all" />
                <div className="flex items-baseline gap-1 font-jakarta">
                  <span className="text-base font-extrabold tracking-tight text-stone-900 dark:text-zinc-100">
                    Free<span className="text-brand-700 dark:text-brand-500">API</span>
                  </span>
                  <span className="text-[11px] font-mono text-stone-400 dark:text-zinc-500 font-normal">.dev</span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav (Precisely Centered via Absolute Translation) */}
            <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 pointer-events-auto">
              <Link
                href="/"
                className="text-xs font-semibold text-stone-600 dark:text-zinc-300 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
              >
                {t.nav.home}
              </Link>
              <Link
                href="#explorer"
                className="text-xs font-semibold text-stone-600 dark:text-zinc-300 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
              >
                {t.nav.explorer}
              </Link>
              <a
                href="https://github.com/CanKStar0/Free-API"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-stone-600 dark:text-zinc-300 hover:text-brand-700 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{t.nav.github}</span>
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Submit API Button */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => setIsSubmitOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.submitModal.triggerBtn}</span>
              </motion.button>

              <LanguageToggle />
              <ThemeToggle />

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                aria-label="Menüyü aç/kapat"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav Drawer */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden glass rounded-2xl mt-2 p-4 border border-stone-200 dark:border-zinc-800 shadow-xl"
            >
              <nav className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSubmitOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-brand-700 text-white font-bold text-xs shadow-sm mb-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.submitModal.triggerBtn}</span>
                </button>

                <a
                  href="https://canpolatkaya.com"
                  className="text-xs font-mono text-stone-600 dark:text-zinc-400 hover:text-brand-700 dark:hover:text-brand-400 flex items-center gap-1.5 py-2 px-3 rounded-lg bg-stone-100/60 dark:bg-zinc-900/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t.nav.backToMain}
                </a>
                <Link
                  href="/"
                  className="text-sm font-medium text-stone-800 dark:text-zinc-200 hover:text-brand-700 dark:hover:text-brand-400 py-2 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.home}
                </Link>
                <Link
                  href="#explorer"
                  className="text-sm font-medium text-stone-800 dark:text-zinc-200 hover:text-brand-700 dark:hover:text-brand-400 py-2 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.explorer}
                </Link>
                <a
                  href="https://github.com/CanKStar0/Free-API"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-stone-800 dark:text-zinc-200 hover:text-brand-700 dark:hover:text-brand-400 py-2 px-3 rounded-lg flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  {t.nav.github}
                </a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Community API Submission Modal */}
      <SubmitApiModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} />
    </>
  );
}
