'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Loader2, Sparkles } from 'lucide-react';
import { signIn } from '@/lib/auth-client';
import { useLanguage } from '@/context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const [loadingProvider, setLoadingProvider] = useState<'github' | 'google' | null>(null);

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      setLoadingProvider(provider);
      await signIn.social({
        provider,
        callbackURL: window.location.href,
      });
    } catch (err) {
      console.error(`${provider} auth error:`, err);
      setLoadingProvider(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-7 shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Brand */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 mb-3.5 border border-brand-500/20 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-stone-900 dark:text-zinc-100 font-jakarta tracking-tight">
                {t.auth.modalTitle}
              </h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                {t.auth.modalSubtitle}
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              {/* GitHub Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleOAuth('github')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loadingProvider === 'github' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                ) : (
                  <Github className="w-4 h-4" />
                )}
                <span>{loadingProvider === 'github' ? t.auth.signingIn : t.auth.continueWithGithub}</span>
              </motion.button>

              {/* Google Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white hover:bg-stone-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 text-stone-800 dark:text-zinc-200 text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {loadingProvider === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{loadingProvider === 'google' ? t.auth.signingIn : t.auth.continueWithGoogle}</span>
              </motion.button>
            </div>

            {/* Newsletter & Legal Disclaimer */}
            <p className="text-[11px] text-center text-stone-400 dark:text-zinc-500 mt-5 leading-relaxed">
              {t.auth.disclaimer}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
