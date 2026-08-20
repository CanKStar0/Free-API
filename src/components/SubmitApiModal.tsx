'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/data/apis';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Send,
  Link as LinkIcon,
  Layers,
  Bold,
  Italic,
  Code as CodeIcon,
  ExternalLink,
  Eye,
  Edit3,
  Infinity as InfinityIcon,
  SlidersHorizontal,
  Zap,
  ShieldCheck,
  Globe,
  ChevronDown,
  Search,
  Check,
} from 'lucide-react';
import { getCategoryIconComponent } from '@/components/CategoryIcon';

interface SubmitApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RateLimitMode = 'unlimited' | 'custom' | 'variable';
type RateLimitUnit = 'sec' | 'min' | 'hour' | 'day' | 'month';

// Lightweight and safe Markdown renderer for preview
function renderMiniMarkdown(text: string) {
  if (!text) return null;

  // Split by inline code, bold, italic, and links
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return (
            <strong key={index} className="font-bold text-stone-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <em key={index} className="italic text-stone-800 dark:text-zinc-200">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code
              key={index}
              className="px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-zinc-800 font-mono text-[11px] text-brand-700 dark:text-brand-300 font-semibold"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <span
              key={index}
              className="text-brand-700 dark:text-brand-400 font-medium underline underline-offset-2"
            >
              {linkMatch[1]}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function SubmitApiModal({ isOpen, onClose }: SubmitApiModalProps) {
  const { t, language } = useLanguage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [rateLimitMode, setRateLimitMode] = useState<RateLimitMode>('unlimited');
  const [rateLimitCount, setRateLimitCount] = useState<string>('1000');
  const [rateLimitUnit, setRateLimitUnit] = useState<RateLimitUnit>('day');

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    categoryId: 'weather',
    description: '',
    isNoAuth: false,
    email: '',
    hp: '', // Honeypot trap
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredCategories = categories.filter((c) => {
    const title = t.categoryTitles[c.id]?.title || c.title;
    return title.toLowerCase().includes(categorySearch.toLowerCase());
  });

  // Markdown helper to insert syntax around selection
  const insertMarkdown = (prefix: string, suffix: string = prefix, placeholder: string = 'metin') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formData.description;
    const selected = currentText.substring(start, end) || placeholder;

    const newText = currentText.substring(0, start) + prefix + selected + suffix + currentText.substring(end);
    setFormData({ ...formData, description: newText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  // Helper to format rate limit for display
  const getDisplayRateLimit = () => {
    if (rateLimitMode === 'unlimited') {
      return language === 'tr' ? 'Sınırsız' : 'Unlimited';
    }
    if (rateLimitMode === 'variable') {
      return language === 'tr' ? 'Değişken' : 'Variable';
    }
    const unitMapTr: Record<RateLimitUnit, string> = {
      sec: 'istek/sn',
      min: 'istek/dk',
      hour: 'istek/saat',
      day: 'istek/gün',
      month: 'istek/ay',
    };
    const unitMapEn: Record<RateLimitUnit, string> = {
      sec: 'req/sec',
      min: 'req/min',
      hour: 'req/hour',
      day: 'req/day',
      month: 'req/month',
    };
    const count = rateLimitCount || '1000';
    return `${count} ${language === 'tr' ? unitMapTr[rateLimitUnit] : unitMapEn[rateLimitUnit]}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        rateLimitMode,
        rateLimitCount: rateLimitMode === 'custom' ? rateLimitCount : undefined,
        rateLimitUnit: rateLimitMode === 'custom' ? rateLimitUnit : undefined,
        rateLimit: getDisplayRateLimit(),
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      isNoAuth: false,
      email: '',
      hp: '',
    });
    setRateLimitMode('unlimited');
    setRateLimitCount('1000');
    setRateLimitUnit('day');
    setActiveTab('write');
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

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
            className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl p-5 sm:p-7 bg-white dark:bg-[#121215] border border-stone-200 dark:border-white/[0.08] shadow-2xl z-10 overflow-y-auto text-left"
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
                <div className="mb-5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FreeAPI Directory Community</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-zinc-50 font-jakarta">
                    {t.submitModal.modalTitle}
                  </h2>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {t.submitModal.modalSubtitle}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                  {/* Custom Lucide Category Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                      {t.submitModal.categoryLabel} <span className="text-rose-500">*</span>
                    </label>

                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-brand-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-6 h-6 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-brand-700 dark:text-brand-400 flex items-center justify-center shrink-0">
                          {(() => {
                            const ActiveIcon = getCategoryIconComponent(formData.categoryId);
                            return <ActiveIcon className="w-3.5 h-3.5" />;
                          })()}
                        </div>
                        <span className="font-medium truncate">
                          {t.categoryTitles[formData.categoryId]?.title || selectedCategory?.title || 'Kategori Seçin'}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                          isCategoryDropdownOpen ? 'rotate-180 text-brand-700' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isCategoryDropdownOpen && (
                        <>
                          {/* Click outside overlay */}
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setIsCategoryDropdownOpen(false)}
                          />

                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-60 overflow-hidden rounded-2xl bg-white dark:bg-[#18181b] border border-stone-200 dark:border-white/[0.1] shadow-2xl flex flex-col"
                          >
                            {/* Search Filter Inside Dropdown */}
                            <div className="p-2 border-b border-stone-100 dark:border-zinc-800 bg-stone-50/70 dark:bg-zinc-900/60 sticky top-0 z-10">
                              <div className="relative">
                                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={categorySearch}
                                  onChange={(e) => setCategorySearch(e.target.value)}
                                  placeholder="Kategori ara..."
                                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700/60 text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-brand-700"
                                />
                              </div>
                            </div>

                            {/* Options List */}
                            <div className="overflow-y-auto p-1.5 space-y-0.5 max-h-48 custom-scrollbar">
                              {filteredCategories.length > 0 ? (
                                filteredCategories.map((c) => {
                                  const IconComponent = getCategoryIconComponent(c.id);
                                  const isSelected = formData.categoryId === c.id;
                                  const categoryName = t.categoryTitles[c.id]?.title || c.title;

                                  return (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, categoryId: c.id });
                                        setIsCategoryDropdownOpen(false);
                                        setCategorySearch('');
                                      }}
                                      className={`w-full px-2.5 py-2 rounded-xl text-left text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-brand-700 text-white font-semibold shadow-sm'
                                          : 'hover:bg-stone-100 dark:hover:bg-zinc-800/80 text-stone-800 dark:text-zinc-200'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <div
                                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                            isSelected
                                              ? 'bg-white/20 text-white'
                                              : 'bg-rose-500/10 dark:bg-rose-500/15 text-brand-700 dark:text-brand-400'
                                          }`}
                                        >
                                          <IconComponent className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="truncate">{categoryName}</span>
                                      </div>

                                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                                    </button>
                                  );
                                })
                              ) : (
                                <div className="py-4 text-center text-xs text-stone-400 dark:text-zinc-500">
                                  Kategori bulunamadı.
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Description Section with Markdown Toolbar & Preview Tabs */}
                  <div className="rounded-2xl border border-stone-200 dark:border-white/[0.08] bg-stone-50/50 dark:bg-zinc-900/40 p-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <span>{t.submitModal.descriptionLabel}</span>
                        <span className="text-rose-500">*</span>
                      </label>

                      {/* Write / Preview Tab Switcher */}
                      <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-zinc-800 p-0.5 rounded-lg text-[11px] font-medium">
                        <button
                          type="button"
                          onClick={() => setActiveTab('write')}
                          className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                            activeTab === 'write'
                              ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 shadow-sm'
                              : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                          }`}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{t.submitModal.tabWrite}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('preview')}
                          className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                            activeTab === 'preview'
                              ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 shadow-sm'
                              : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>{t.submitModal.tabPreview}</span>
                        </button>
                      </div>
                    </div>

                    {activeTab === 'write' ? (
                      <div>
                        {/* Markdown Mini Toolbar */}
                        <div className="flex items-center gap-1 mb-1.5 p-1 rounded-lg bg-stone-100 dark:bg-zinc-800/80 border border-stone-200/80 dark:border-white/[0.04] text-xs">
                          <button
                            type="button"
                            title="Kalın / Bold (**text**)"
                            onClick={() => insertMarkdown('**', '**', 'kalın metin')}
                            className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors"
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="İtalik / Italic (*text*)"
                            onClick={() => insertMarkdown('*', '*', 'italik metin')}
                            className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors"
                          >
                            <Italic className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Kod / Code (`endpoint`)"
                            onClick={() => insertMarkdown('`', '`', '/v1/data')}
                            className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors"
                          >
                            <CodeIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Bağlantı / Link [başlık](url)"
                            onClick={() => insertMarkdown('[', '](https://...)', 'Dokümantasyon')}
                            className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                          </button>

                          <div className="ml-auto text-[10px] text-stone-400 dark:text-zinc-500 font-mono pr-1">
                            {formData.description.length} / 400 {t.submitModal.charCount}
                          </div>
                        </div>

                        <textarea
                          ref={textareaRef}
                          required
                          maxLength={400}
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder={t.submitModal.descriptionPlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none font-sans"
                        />
                      </div>
                    ) : (
                      /* Live Card Preview */
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151518] border border-stone-200 dark:border-white/[0.08] shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                            {t.submitModal.previewBadge}
                          </span>
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-medium flex items-center gap-1.5 border border-stone-200 dark:border-zinc-700/60">
                            {(() => {
                              const CategoryLucide = getCategoryIconComponent(formData.categoryId);
                              return <CategoryLucide className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />;
                            })()}
                            <span>{t.categoryTitles[formData.categoryId]?.title || selectedCategory?.title}</span>
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-stone-900 dark:text-zinc-100 mb-1 flex items-center gap-2">
                          <span>{formData.name || 'Örnek API Adı'}</span>
                          {formData.isNoAuth && (
                            <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Zero-Auth
                            </span>
                          )}
                        </h4>

                        <div className="text-xs text-stone-600 dark:text-zinc-400 mb-3 leading-relaxed">
                          {formData.description ? (
                            renderMiniMarkdown(formData.description)
                          ) : (
                            <span className="italic text-stone-400 dark:text-zinc-500">
                              Açıklama yazdığınızda Markdown formatlı hali burada canlı görünecektir...
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md font-mono bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700/60 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" />
                            {getDisplayRateLimit()}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            HTTPS
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Structured Rate Limit Section (No free-text typos, clean language agnostic data) */}
                  <div className="rounded-2xl border border-stone-200 dark:border-white/[0.08] bg-stone-50/50 dark:bg-zinc-900/40 p-3">
                    <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-2">
                      {t.submitModal.rateLimitTypeLabel}
                    </label>

                    {/* 3 Rate Limit Mode Buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setRateLimitMode('unlimited')}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          rateLimitMode === 'unlimited'
                            ? 'bg-brand-700 text-white border-brand-700 shadow-sm font-bold'
                            : 'bg-white dark:bg-zinc-900/90 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-white/[0.08] hover:border-brand-700/40'
                        }`}
                      >
                        <InfinityIcon className="w-3.5 h-3.5" />
                        <span>{t.submitModal.rateLimitUnlimited}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRateLimitMode('custom')}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          rateLimitMode === 'custom'
                            ? 'bg-brand-700 text-white border-brand-700 shadow-sm font-bold'
                            : 'bg-white dark:bg-zinc-900/90 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-white/[0.08] hover:border-brand-700/40'
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>{t.submitModal.rateLimitCustom}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRateLimitMode('variable')}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          rateLimitMode === 'variable'
                            ? 'bg-brand-700 text-white border-brand-700 shadow-sm font-bold'
                            : 'bg-white dark:bg-zinc-900/90 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-white/[0.08] hover:border-brand-700/40'
                        }`}
                      >
                        <span>{t.submitModal.rateLimitVariable}</span>
                      </button>
                    </div>

                    {/* If Custom Limit Selected: Number Input + Time Unit Dropdown */}
                    {rateLimitMode === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1"
                      >
                        <div>
                          <label className="block text-[11px] font-medium text-stone-600 dark:text-zinc-400 mb-1">
                            {t.submitModal.rateLimitValueLabel}
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={100000000}
                            required={rateLimitMode === 'custom'}
                            value={rateLimitCount}
                            onChange={(e) => setRateLimitCount(e.target.value)}
                            placeholder="1000"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-stone-600 dark:text-zinc-400 mb-1">
                            {t.submitModal.rateLimitUnitLabel}
                          </label>
                          <select
                            value={rateLimitUnit}
                            onChange={(e) => setRateLimitUnit(e.target.value as RateLimitUnit)}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700 cursor-pointer"
                          >
                            <option value="sec">{t.submitModal.unitSec}</option>
                            <option value="min">{t.submitModal.unitMin}</option>
                            <option value="hour">{t.submitModal.unitHour}</option>
                            <option value="day">{t.submitModal.unitDay}</option>
                            <option value="month">{t.submitModal.unitMonth}</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Email Field & Zero-Auth Checkbox Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
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

                    <div className="flex items-center gap-2.5 sm:pt-4">
                      <input
                        type="checkbox"
                        id="isNoAuth"
                        checked={formData.isNoAuth}
                        onChange={(e) => setFormData({ ...formData, isNoAuth: e.target.checked })}
                        className="w-4 h-4 rounded border-stone-300 text-brand-700 focus:ring-brand-700 cursor-pointer"
                      />
                      <label
                        htmlFor="isNoAuth"
                        className="text-xs text-stone-700 dark:text-zinc-300 select-none cursor-pointer"
                      >
                        {t.submitModal.noAuthCheckbox}
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
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
