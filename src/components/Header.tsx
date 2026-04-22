'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(true); // Navbar is hidden initially
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show navbar when scrolled more than 100px down
    if (latest > 100) {
      setHidden(false);
    } else {
      setHidden(true);
      if (isMenuOpen) setIsMenuOpen(false); // Close menu when hidden
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 }
      }}
      initial="hidden"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 right-0 z-50 px-4 py-4 transition-all duration-300"
      style={{ top: 'var(--banner-height, 0px)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text">API Showcase</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">500+ Ücretsiz API</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              href="#categories"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Kategoriler
            </Link>
            <a
              href="https://github.com/CanKStar0/API-SHOWCASE-APP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              GitHub
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full glass flex items-center justify-center"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass rounded-2xl mt-2 p-4"
          >
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href="#categories"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Kategoriler
              </Link>
              <a
                href="https://github.com/CanKStar0/API-SHOWCASE-APP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors py-2"
              >
                GitHub
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
