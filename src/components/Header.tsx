'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { SubmitApiModal } from './SubmitApiModal';
import { AuthModal } from './AuthModal';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, ArrowLeft, Github, Plus, LogOut, Bookmark, Layers, Loader2, ChevronDown, User, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from '@/lib/auth-client';

export function Header() {
  const { t, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = useSession();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

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
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-stone-600 dark:text-zinc-400 hover:text-brand-700 dark:hover:text-brand-400 hover:bg-stone-100 dark:hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-zinc-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.nav.backToMain}</span>
              </a>

              <div className="hidden sm:block w-px h-4 bg-stone-300 dark:bg-zinc-800" />

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <Logo className="w-8 h-8 group-hover:scale-110 transition-transform duration-200 drop-shadow-[0_0_8px_rgba(225,29,72,0.35)]" />
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
              <Link
                href={language === 'en' ? '/en/tools' : '/tools'}
                className="text-xs font-semibold text-stone-600 dark:text-zinc-300 hover:text-brand-700 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5"
              >
                <span>{t.nav.tools}</span>
                <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  0ms
                </span>
              </Link>
              <Link
                href={language === 'en' ? '/en/dashboard' : '/dashboard'}
                className="text-xs font-semibold text-stone-600 dark:text-zinc-300 hover:text-brand-700 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5"
              >
                <span>{t.nav.dashboard}</span>
                <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  ⚡ &lt;2ms
                </span>
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

              {/* User Authentication Menu / Button */}
              {isPending ? (
                <div className="w-8 h-8 rounded-xl bg-stone-200/50 dark:bg-zinc-800/50 animate-pulse flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-stone-400 dark:text-zinc-600" />
                </div>
              ) : session?.user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl glass hover:border-brand-500/40 transition-all cursor-pointer group"
                    aria-label="Kullanıcı Menüsü"
                  >
                    {session.user.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User Avatar'}
                        className="w-6 h-6 rounded-lg object-cover ring-1 ring-brand-500/30"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                        {session.user.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="hidden sm:inline-block text-xs font-semibold text-stone-800 dark:text-zinc-200 max-w-[100px] truncate">
                      {session.user.name?.split(' ')[0] || 'Dev'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-zinc-200 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl p-2 glass shadow-xl border border-stone-200/80 dark:border-zinc-800/80 z-50"
                      >
                        <div className="px-3 py-2 border-b border-stone-200/60 dark:border-zinc-800/60 mb-1">
                          <p className="text-xs font-bold text-stone-900 dark:text-zinc-100 truncate">
                            {session.user.name}
                          </p>
                          <p className="text-[11px] font-mono text-stone-500 dark:text-zinc-400 truncate">
                            {session.user.email}
                          </p>
                        </div>

                        <Link
                          href={language === 'en' ? '/en/profile' : '/profile'}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-stone-100/70 dark:hover:bg-zinc-800/70 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                          <span>{t.auth.profile}</span>
                        </Link>

                        <Link
                          href={language === 'en' ? '/en/profile' : '/profile'}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-stone-100/70 dark:hover:bg-zinc-800/70 transition-colors"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                          <span>{t.auth.myBookmarks}</span>
                        </Link>

                        <Link
                          href={language === 'en' ? '/en/dashboard' : '/dashboard'}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-stone-100/70 dark:hover:bg-zinc-800/70 transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>{t.nav.dashboard}</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t.auth.signOut}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200/80 dark:border-zinc-800/80 bg-stone-100/70 dark:bg-zinc-900/70 hover:bg-stone-200/80 dark:hover:bg-zinc-800 text-stone-800 dark:text-zinc-200 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
                  title={t.auth.signIn}
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">
                    {t.auth.signIn}
                  </span>
                </motion.button>
              )}

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

                {session?.user ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-stone-100/60 dark:bg-zinc-900/60 mb-2">
                    <div className="flex items-center gap-2">
                      {session.user.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={session.user.image}
                          alt="Avatar"
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                          {session.user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-xs font-bold text-stone-900 dark:text-zinc-100 truncate">
                          {session.user.name}
                        </p>
                        <p className="text-[10px] font-mono text-stone-500 dark:text-zinc-400 truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                      title={t.auth.signOut}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-900 dark:bg-zinc-800 text-white font-semibold text-xs shadow-sm mb-2"
                  >
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    <span>{t.auth.signIn}</span>
                  </button>
                )}

                <a
                  href="https://canpolatkaya.com"
                  target="_blank"
                  rel="noopener noreferrer"
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
                <Link
                  href={language === 'en' ? '/en/tools' : '/tools'}
                  className="text-sm font-medium text-stone-800 dark:text-zinc-200 hover:text-brand-700 dark:hover:text-brand-400 py-2 px-3 rounded-lg flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{t.nav.tools}</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    0ms Edge
                  </span>
                </Link>
                <Link
                  href={language === 'en' ? '/en/dashboard' : '/dashboard'}
                  className="text-sm font-medium text-stone-800 dark:text-zinc-200 hover:text-brand-700 dark:hover:text-brand-400 py-2 px-3 rounded-lg flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{t.nav.dashboard}</span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    ⚡ &lt;2ms
                  </span>
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

      {/* Developer OAuth Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
