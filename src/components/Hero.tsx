'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSearch } from '@/context/SearchContext';
import { categories } from '@/data/apis';
import {
  Terminal,
  Search,
  Zap,
  ShieldCheck,
  Database,
  Layers,
  Check,
  Copy,
  Play,
  ArrowRight,
  Sparkles,
  Cpu,
} from 'lucide-react';

interface MockApiSample {
  id: string;
  name: string;
  category: string;
  url: string;
  method: 'GET' | 'POST';
  status: string;
  latency: string;
  responseLines: { key?: string; val?: string | number; raw?: string; type: 'obj-start' | 'obj-end' | 'kv-num' | 'kv-str' | 'kv-status' | 'raw' }[];
}

const MOCK_SAMPLES: MockApiSample[] = [
  {
    id: 'weather',
    name: 'Open-Meteo Weather',
    category: 'Hava Durumu',
    url: 'https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true',
    method: 'GET',
    status: '200 OK',
    latency: '14ms',
    responseLines: [
      { raw: '{', type: 'obj-start' },
      { key: 'latitude', val: 41.01, type: 'kv-num' },
      { key: 'longitude', val: 28.97, type: 'kv-num' },
      { key: 'temperature', val: '24.5 °C', type: 'kv-str' },
      { key: 'windspeed', val: '12.8 km/h', type: 'kv-str' },
      { key: 'status', val: '200 OK (14ms)', type: 'kv-status' },
      { raw: '}', type: 'obj-end' },
    ],
  },
  {
    id: 'crypto',
    name: 'CoinGecko Live BTC',
    category: 'Kripto Para',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
    method: 'GET',
    status: '200 OK',
    latency: '22ms',
    responseLines: [
      { raw: '{', type: 'obj-start' },
      { key: 'bitcoin_usd', val: '$94,820', type: 'kv-str' },
      { key: 'ethereum_usd', val: '$3,410', type: 'kv-str' },
      { key: 'change_24h', val: '+3.42%', type: 'kv-str' },
      { key: 'status', val: '200 OK (22ms)', type: 'kv-status' },
      { raw: '}', type: 'obj-end' },
    ],
  },
  {
    id: 'ai',
    name: 'DeepSeek Inference',
    category: 'Yapay Zeka',
    url: 'https://api.deepseek.com/v1/chat/completions',
    method: 'POST',
    status: '200 OK',
    latency: '85ms',
    responseLines: [
      { raw: '{', type: 'obj-start' },
      { key: 'model', val: 'DeepSeek-R1', type: 'kv-str' },
      { key: 'context_window', val: 128000, type: 'kv-num' },
      { key: 'tokens_per_sec', val: 142.5, type: 'kv-num' },
      { key: 'status', val: 'ready (85ms)', type: 'kv-status' },
      { raw: '}', type: 'obj-end' },
    ],
  },
];

const TRENDING_TAGS: Record<'tr' | 'en', { id: string; label: string }[]> = {
  tr: [
    { id: 'weather', label: 'Hava Durumu' },
    { id: 'crypto', label: 'Kripto Para' },
    { id: 'gaming', label: 'Oyun' },
    { id: 'finance', label: 'Finans' },
    { id: 'developer', label: 'Geliştirici' },
    { id: 'space', label: 'Uzay & NASA' },
  ],
  en: [
    { id: 'weather', label: 'Weather' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'finance', label: 'Finance' },
    { id: 'developer', label: 'Dev Tools' },
    { id: 'space', label: 'Space & NASA' },
  ],
};

export function Hero() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { searchQuery, setSearchQuery, triggerSearch } = useSearch();
  const [activeSample, setActiveSample] = useState<MockApiSample>(MOCK_SAMPLES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard shortcut listener for Ctrl+K / Cmd+K / Slash
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRunSample = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(activeSample.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      triggerSearch('');
      return;
    }

    const matchedCategory = categories.find((c) => {
      const catId = c.id.toLowerCase();
      const trTitle = (t.categoryTitles[c.id]?.title || c.title).toLowerCase();
      const enTitle = c.title.toLowerCase();
      return (
        catId === query ||
        trTitle === query ||
        enTitle === query ||
        (query.length >= 3 && (trTitle.includes(query) || enTitle.includes(query) || catId.includes(query)))
      );
    });

    if (matchedCategory) {
      router.push(`/category/${matchedCategory.id}`);
      return;
    }

    triggerSearch(searchQuery);
  };

  const activeTags = TRENDING_TAGS[language] || TRENDING_TAGS.tr;

  return (
    <section className="relative w-full select-none">
      {/* Clean Subtle Ambient Cyber Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_60%,transparent_100%)] opacity-10 dark:opacity-5" />
      </div>


      {/* Screen 1: Vertically Centered Hero Viewport */}
      <div className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 max-w-6xl mx-auto">
        {/* High-End Symmetrical 2-Line Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-stone-900 dark:text-stone-50 tracking-tight leading-[1.08] max-w-5xl mx-auto font-jakarta"
        >
          <span className="block text-balance">{t.hero.titlePrefix}</span>
          <span className="block text-balance text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-rose-600 to-rose-400 dark:from-brand-500 dark:via-rose-400 dark:to-rose-200">
            {t.hero.titleHighlight}
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-stone-600 dark:text-zinc-400 max-w-2xl mx-auto mt-6 leading-relaxed text-balance"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Live Search Bar with Instant Category Routing & Keyboard Shortcut Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl mt-8"
        >
          <form
            onSubmit={handleHeroSearchSubmit}
            className="relative flex items-center p-2 rounded-2xl glass-card border border-stone-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-xl shadow-rose-950/5 dark:shadow-black/60 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15 transition-all"
          >
            <Search className="w-5 h-5 text-stone-400 dark:text-zinc-500 ml-3 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.explorer.searchPlaceholder}
              className="w-full px-3 py-2 bg-transparent text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 text-sm font-sans focus:outline-none"
            />
            
            {/* Keyboard shortcut hint */}
            <div className="hidden sm:flex items-center gap-1 mr-2 shrink-0">
              <kbd className="px-2 py-1 text-[10px] font-mono font-bold text-stone-400 dark:text-zinc-500 bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg shadow-sm">
                Ctrl K
              </kbd>
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'tr' ? 'Ara' : 'Search'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </form>

          {/* Clean Category Quick Jump Pills (Zero # Hashtags, Direct Routing) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-stone-500 dark:text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">{language === 'tr' ? 'Hızlı Keşif:' : 'Quick Jump:'}</span>
            {activeTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/category/${tag.id}`}
                className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-zinc-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-700 dark:text-zinc-300 hover:text-brand-700 dark:hover:text-brand-400 border border-stone-200 dark:border-zinc-700/60 transition-all font-medium text-xs shadow-sm hover:scale-105"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Screen 2: Interactive Terminal Playground & Bento Stats */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center px-4 pb-24">
        {/* Visual Interactive Terminal Playground Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-4xl rounded-3xl p-1 bg-gradient-to-b from-stone-200 via-stone-300 to-transparent dark:from-zinc-700 dark:via-zinc-800/60 dark:to-transparent shadow-2xl shadow-rose-950/10 dark:shadow-black/80"
        >
          <div className="rounded-[22px] bg-stone-900 dark:bg-zinc-950 border border-stone-800 text-left overflow-hidden">
            {/* Terminal Top Window Bar */}
            <div className="px-4 py-3 bg-stone-950/90 dark:bg-black/80 border-b border-stone-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-[0_0_6px_#f43f5e]" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                <span className="ml-3 text-xs font-mono text-stone-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-400" />
                  <span>api-playground.sh</span>
                </span>
              </div>

              {/* Endpoint Preset Tabs */}
              <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-[11px] font-mono">
                {MOCK_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setActiveSample(sample)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeSample.id === sample.id
                        ? 'bg-brand-700 text-white font-bold shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {sample.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Request URL Bar */}
            <div className="p-4 bg-stone-900/60 border-b border-stone-800/80 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <span className={`px-2 py-0.5 rounded font-bold text-[11px] border ${
                  activeSample.method === 'GET'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {activeSample.method}
                </span>
                <span className="text-stone-300 truncate font-mono">{activeSample.url}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'cURL'}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={handleRunSample}
                  disabled={isRunning}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Running...' : 'Execute'}</span>
                </motion.button>
              </div>
            </div>

            {/* IDE Syntax-Highlighted JSON Response Window */}
            <div className="p-5 font-mono text-xs overflow-x-auto bg-black/70 leading-relaxed min-h-[150px] flex flex-col justify-center">
              <pre className="text-stone-300">
                <code>
                  {activeSample.responseLines.map((line, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="text-stone-600 select-none w-4 text-right">{idx + 1}</span>
                      {line.type === 'obj-start' || line.type === 'obj-end' ? (
                        <span className="text-stone-400 font-bold">{line.raw}</span>
                      ) : line.type === 'kv-status' ? (
                        <span>
                          &nbsp;&nbsp;<span className="text-sky-300">&quot;{line.key}&quot;</span>: <span className="text-emerald-400 font-bold">&quot;{line.val}&quot;</span>
                        </span>
                      ) : line.type === 'kv-num' ? (
                        <span>
                          &nbsp;&nbsp;<span className="text-sky-300">&quot;{line.key}&quot;</span>: <span className="text-amber-300 font-semibold">{line.val}</span>
                        </span>
                      ) : (
                        <span>
                          &nbsp;&nbsp;<span className="text-sky-300">&quot;{line.key}&quot;</span>: <span className="text-rose-300">&quot;{line.val}&quot;</span>
                        </span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bento Metric Grid with Live Pulse Dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mt-10 text-left"
        >
          <div className="glass-card rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm hover:border-brand-700/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 text-xs font-mono mb-1">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-brand-700 dark:text-brand-500" />
                <span>TOTAL APIS</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">500+</div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">{language === 'tr' ? 'Doğrulanmış REST Servis' : 'Verified REST Endpoints'}</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm hover:border-brand-700/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 text-xs font-mono mb-1">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-700 dark:text-brand-500" />
                <span>CATEGORIES</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">28+</div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">{language === 'tr' ? 'Farklı Alan & Sektör' : 'Domains & Tech Verticals'}</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm hover:border-brand-700/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 text-xs font-mono mb-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>NO-KEY APIS</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">140+</div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">{language === 'tr' ? 'Kayıtsız Anında Erişim' : 'Instant Zero-Auth Access'}</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm hover:border-brand-700/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 text-xs font-mono mb-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>INTEGRATION</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">cURL & JS</div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">{language === 'tr' ? 'Tek Tıkla Kod Kopyalama' : 'One-Click Code Snippets'}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
