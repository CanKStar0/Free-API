'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, Zap, Globe } from 'lucide-react';

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            500+ Ücretsiz API Servisi
          </span>
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </motion.div>

        {/* Update announcement badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(14,165,233,0.15) 100%)',
            border: '1px solid rgba(16,185,129,0.4)',
            color: 'inherit'
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.6, delay: 1, repeat: Infinity, repeatDelay: 4 }}
          >
            🎉
          </motion.span>
          <span className="text-emerald-600 dark:text-emerald-400">
            Güncelleme v2.0 — 10 yeni kategori eklendi!
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            YENİ
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
          <span className="block text-slate-900 dark:text-white">Ücretsiz</span>
          <span className="gradient-text">API</span>
          <span className="block text-slate-900 dark:text-white">Koleksiyonu</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Hava durumundan kripto paraya, siber güvenlikten yapay zekaya kadar <strong>47 kategoride</strong>{' '}
          500+ ücretsiz API&apos;yi keşfedin. Projelerinizi güçlendirin!
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto mb-12"
        >
          <div className="glass rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-primary-500" />
              <span className="text-2xl md:text-3xl font-bold gradient-text">500+</span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">API Servisi</p>
          </div>
          <div className="glass rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl md:text-3xl font-bold gradient-text">47</span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Kategori</p>
          </div>
          <div className="glass rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-accent-500" />
              <span className="text-2xl md:text-3xl font-bold gradient-text">%100</span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Ücretsiz</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#categories"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 glow"
          >
            Keşfet
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-slate-400 dark:border-slate-600 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full bg-primary-500"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
