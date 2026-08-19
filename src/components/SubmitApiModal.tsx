'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/data/apis';
import { X, Plus, CheckCircle2, AlertCircle, Loader2, Sparkles, Send, Link as LinkIcon, Layers } from 'lucide-react';

interface SubmitApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitApiModal({ isOpen, onClose }: SubmitApiModalProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    categoryId: 'weather',
    description: '',
    rateLimit: '',
    isNoAuth: false,
    email: '',
    hp: '', // Honeypot trap
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gönderim sırasında bir hata oluştu.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      url: '',
      categoryId: 'weather',
      description: '',
      rateLimit: '',
      isNoAuth: false,
      email: '',
      hp: '',
    });
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121215] border border-stone-200 dark:border-white/[0.08] shadow-2xl z-10 overflow-hidden text-left"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleReset}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-zinc-50 mb-2 font-jakarta">
                  {t.submitModal.successTitle}
                </h3>
                <p className="text-sm text-stone-600 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
                  {t.submitModal.successDesc}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-all cursor-pointer hover:opacity-90"
                >
                  {t.submitModal.closeBtn}
                </button>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FreeAPI.dev Community</span>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-zinc-50 font-jakarta">
                    {t.submitModal.modalTitle}
                  </h2>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {t.submitModal.modalSubtitle}
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot hidden input */}
                  <input
                    type="text"
                    name="website_hp"
                    value={formData.hp}
                    onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* API Name & URL Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                        {t.submitModal.nameLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.submitModal.namePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                        {t.submitModal.urlLabel} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <LinkIcon className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          required
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          placeholder={t.submitModal.urlPlaceholder}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                      {t.submitModal.categoryLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Layers className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700 cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id} className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100">
                            {t.categoryTitles[c.id]?.title || c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                      {t.submitModal.descriptionLabel} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t.submitModal.descriptionPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none"
                    />
                  </div>

                  {/* Rate Limit & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                        {t.submitModal.rateLimitLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.rateLimit}
                        onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                        placeholder={t.submitModal.rateLimitPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                        {t.submitModal.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.submitModal.emailPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>
                  </div>

                  {/* Zero-Auth Checkbox */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="isNoAuth"
                      checked={formData.isNoAuth}
                      onChange={(e) => setFormData({ ...formData, isNoAuth: e.target.checked })}
                      className="w-4 h-4 rounded border-stone-300 text-brand-700 focus:ring-brand-700 cursor-pointer"
                    />
                    <label htmlFor="isNoAuth" className="text-xs text-stone-700 dark:text-zinc-300 select-none cursor-pointer">
                      {t.submitModal.noAuthCheckbox}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t.submitModal.submitting}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{t.submitModal.submitBtn}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
