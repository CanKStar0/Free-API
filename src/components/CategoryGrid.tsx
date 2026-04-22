'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { categories, Category } from '@/data/apis';
import { ChevronRight, Star, Loader2 } from 'lucide-react';

const ITEMS_PER_LOAD = 9;

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const categoryGradients: Record<string, string> = {
  weather: 'from-blue-500 to-cyan-400',
  crypto: 'from-yellow-500 to-orange-500',
  gaming: 'from-purple-500 to-pink-500',
  maps: 'from-green-500 to-emerald-400',
  social: 'from-blue-600 to-indigo-500',
  movies: 'from-red-500 to-rose-400',
  music: 'from-green-500 to-teal-400',
  news: 'from-gray-600 to-slate-500',
  finance: 'from-emerald-500 to-green-400',
  developer: 'from-slate-600 to-gray-500',
  education: 'from-blue-500 to-sky-400',
  health: 'from-red-400 to-pink-400',
  food: 'from-orange-500 to-amber-400',
  space: 'from-indigo-600 to-purple-500',
  sports: 'from-green-600 to-lime-500',
  random: 'from-fuchsia-500 to-pink-500',
  animals: 'from-amber-500 to-yellow-400',
  anime: 'from-pink-500 to-rose-400',
  art: 'from-violet-500 to-purple-400',
  books: 'from-amber-600 to-orange-500',
  calendar: 'from-blue-500 to-indigo-400',
  chat: 'from-indigo-500 to-blue-400',
  cloud: 'from-sky-500 to-blue-400',
  email: 'from-red-500 to-orange-400',
  environment: 'from-green-600 to-emerald-500',
  government: 'from-slate-700 to-gray-600',
  iot: 'from-teal-500 to-cyan-400',
  network: 'from-blue-600 to-cyan-500',
  jobs: 'from-indigo-600 to-purple-500',
  math: 'from-orange-500 to-red-400',
  payment: 'from-green-500 to-emerald-400',
  photos: 'from-pink-500 to-rose-400',
  fun: 'from-yellow-500 to-amber-400',
  transport: 'from-blue-500 to-indigo-400',
  url: 'from-purple-500 to-violet-400',
  video: 'from-red-500 to-pink-500',
  security: 'from-red-600 to-rose-500',
  auth: 'from-amber-500 to-yellow-400',
  nlp: 'from-teal-500 to-emerald-400',
  ml: 'from-violet-600 to-indigo-500',
  validation: 'from-emerald-500 to-teal-400',
  ecommerce: 'from-orange-500 to-amber-400',
  cicd: 'from-slate-500 to-zinc-400',
  patents: 'from-stone-500 to-amber-600',
  shipping: 'from-sky-500 to-cyan-400',
  phone: 'from-lime-500 to-green-400',
};

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const gradient = categoryGradients[category.id] || 'from-primary-500 to-accent-500';

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Link href={`/category/${category.id}`}>
        <div className="relative h-full glass rounded-3xl overflow-hidden">
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shadow-lg`}>
                {category.emoji}
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-400">{category.apis.length}</span>
                <span className="text-slate-400 dark:text-slate-500">API</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
              {category.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
              {category.description}
            </p>

            {/* Recommended badge */}
            {category.recommendedApi && (
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Önerilen: {category.recommendedApi}
                </span>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex -space-x-2">
                {category.apis.slice(0, 3).map((api, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    {api.name.charAt(0)}
                  </div>
                ))}
                {category.apis.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-primary-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                    +{category.apis.length - 3}
                  </div>
                )}
              </div>
              <motion.div
                className="flex items-center gap-1 text-primary-500 font-medium text-sm"
                whileHover={{ x: 5 }}
              >
                Keşfet
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoryGrid() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (visibleCount >= categories.length || isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + ITEMS_PER_LOAD, categories.length));
      setIsLoading(false);
    }, 500);
  }, [visibleCount, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  const visibleCategories = categories.slice(0, visibleCount);

  return (
    <section id="categories" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary-500">
              Kategoriler
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}>
              🎉 v2.0 — 10 Yeni Kategori
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            API <span className="gradient-text">Kategorileri</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            <strong>47 kategori</strong> ve <strong>500+ servis</strong> arasından ihtiyacınıza uygun
            API&apos;yi bulun. Her kategori, özenle seçilmiş ücretsiz servisler içerir.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load more trigger */}
        {visibleCount < categories.length && (
          <div ref={loadMoreRef} className="flex justify-center mt-12">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-6 py-3 glass rounded-full"
              >
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Yükleniyor...
                </span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-slate-400 dark:text-slate-500"
              >
                Daha fazla kategori için aşağı kaydırın
              </motion.div>
            )}
          </div>
        )}

        {/* All loaded message */}
        {visibleCount >= categories.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-12"
          >
            <div className="flex items-center gap-2 px-6 py-3 glass rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Tüm {categories.length} kategori yüklendi!
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
