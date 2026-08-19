'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Check,
  Copy,
  Play,
  ArrowRight,
  Code2,
  Lock,
  Globe,
} from 'lucide-react';

interface MockApiSample {
  id: string;
  name: string;
  category: string;
  url: string;
  method: string;
  response: string;
}

const MOCK_SAMPLES: MockApiSample[] = [
  {
    id: 'weather',
    name: 'Open-Meteo Weather',
    category: 'Hava Durumu',
    url: 'https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true',
    method: 'GET',
    response: '{\n  "latitude": 41.01,\n  "longitude": 28.97,\n  "temperature": 24.5,\n  "windspeed": 12.8,\n  "weathercode": 0,\n  "status": "200 OK (14ms)"\n}',
  },
  {
    id: 'crypto',
    name: 'CoinGecko Live BTC',
    category: 'Kripto Para',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
    method: 'GET',
    response: '{\n  "bitcoin": { "usd": 94820 },\n  "ethereum": { "usd": 3410 },\n  "change_24h": "+3.42%",\n  "status": "200 OK (22ms)"\n}',
  },
  {
    id: 'ai',
    name: 'HuggingFace Inference',
    category: 'Yapay Zeka',
    url: 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1',
    method: 'POST',
    response: '{\n  "model": "DeepSeek-R1",\n  "status": "ready",\n  "latency_p95": "85ms",\n  "context_window": 128000\n}',
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

  const handleRunSample = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 600);
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

    // Check if query directly matches any known category
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
      {/* Dynamic Background Mesh & Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Massive Crimson Ambient Glow Center */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-brand-700/15 dark:bg-brand-500/20 rounded-full blur-[140px] transition-opacity" />
        
        {/* Top Left & Right Secondary Orbs */}
        <div className="absolute top-10 -left-20 w-96 h-96 bg-rose-900/10 dark:bg-rose-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-brand-800/10 dark:bg-brand-500/15 rounded-full blur-[120px]" />
        
        {/* Subtle Ambient Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_60%,transparent_100%)] opacity-15 dark:opacity-10" />
      </div>

      {/* Screen 1: Vertically Centered Hero Viewport */}
      <div className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 max-w-6xl mx-auto">
        {/* Main Hero Headline (Engineered for Exact 2-Line Optical Balance) */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight text-stone-900 dark:text-zinc-50 leading-[1.18] mb-6 max-w-5xl font-jakarta text-balance"
        >
          <span className="block">{t.hero.titlePrefix}</span>
          <span className="text-brand-700 dark:text-brand-500 block mt-1">
            {t.hero.titleHighlight}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Live Search Interactive Box in Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl mb-4"
        >
          <form
            onSubmit={handleHeroSearchSubmit}
            className="relative flex items-center p-2 rounded-2xl glass-card border border-stone-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-xl shadow-rose-950/5 dark:shadow-black/60 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all"
          >
            <Search className="w-5 h-5 text-stone-400 dark:text-zinc-500 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.explorer.searchPlaceholder}
              className="w-full px-3.5 py-2.5 bg-transparent text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 text-sm font-sans focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all shrink-0 flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{language === 'tr' ? 'Ara' : 'Search'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Clean Category Quick Jump Pills (Zero # Hashtags, Direct Routing) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-stone-500 dark:text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">{language === 'tr' ? 'Hızlı Keşif:' : 'Quick Jump:'}</span>
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
            <div className="px-4 py-3 bg-stone-950/80 dark:bg-black/60 border-b border-stone-800 flex items-center justify-between">
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
              <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-[11px] font-mono">
                {MOCK_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setActiveSample(sample)}
                    className={`px-3 py-1 rounded-lg transition-all ${
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
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
                  {activeSample.method}
                </span>
                <span className="text-stone-300 truncate">{activeSample.url}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'cURL'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRunSample}
                  disabled={isRunning}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Running...' : 'Execute'}</span>
                </button>
              </div>
            </div>

            {/* JSON Response Window */}
            <div className="p-5 font-mono text-xs overflow-x-auto text-emerald-400 bg-black/50 leading-relaxed min-h-[140px] flex flex-col justify-center">
              <pre className="text-stone-300">
                <code>
                  {activeSample.response.split('\n').map((line, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="text-stone-600 select-none w-4 text-right">{idx + 1}</span>
                      <span className={line.includes('200 OK') ? 'text-emerald-400 font-bold' : line.includes('":') ? 'text-rose-300' : 'text-stone-300'}>
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bento Metric Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mt-10 text-left"
        >
          <div className="glass-card rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm">
            <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 text-xs font-mono mb-1">
              <Database className="w-3.5 h-3.5 text-brand-700 dark:text-brand-500" />
              <span>TOTAL APIS</span>
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">500+</div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">{language === 'tr' ? 'Doğrulanmış REST Servis' : 'Verified REST Endpoints'}</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm">
            <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 text-xs font-mono mb-1">
              <Layers className="w-3.5 h-3.5 text-brand-700 dark:text-brand-500" />
              <span>CATEGORIES</span>
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">28+</div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">{language === 'tr' ? 'Farklı Alan & Sektör' : 'Domains & Tech Verticals'}</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm">
            <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 text-xs font-mono mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>NO-KEY APIS</span>
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">140+</div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">{language === 'tr' ? 'Kayıtsız Anında Erişim' : 'Instant Zero-Auth Access'}</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm">
            <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 text-xs font-mono mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>INTEGRATION</span>
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">cURL & JS</div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">{language === 'tr' ? 'Tek Tıkla Kod Kopyalama' : 'One-Click Code Snippets'}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
