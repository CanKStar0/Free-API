'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useSession } from '@/lib/auth-client';
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Database,
  Activity,
  Code2,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Clock,
  Sparkles,
  Server,
  Globe2,
} from 'lucide-react';

interface DatasetOption {
  slug: string;
  name: string;
  category: string;
  records: string;
  isSemiStatic: boolean;
  ttl: string;
  sampleQuery: string;
}

const DATASETS: DatasetOption[] = [
  { slug: 'world-cities', name: 'World Cities (170k)', category: 'Geography', records: '170,540', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=Istanbul' },
  { slug: 'crypto-prices', name: 'Live Crypto Prices', category: 'Crypto', records: '100', isSemiStatic: true, ttl: '5m', sampleQuery: 'limit=10' },
  { slug: 'exchange-rates', name: 'Global Forex Rates', category: 'Finance', records: '166', isSemiStatic: true, ttl: '4h', sampleQuery: 'search=TRY' },
  { slug: 'prayer-times', name: 'Daily Prayer Times', category: 'Calendar', records: '12', isSemiStatic: true, ttl: '24h', sampleQuery: 'field=city&value=Istanbul' },
  { slug: 'world-airports', name: 'World Airports (29k)', category: 'Travel', records: '29,307', isSemiStatic: false, ttl: '30d', sampleQuery: 'field=country&value=Turkey' },
  { slug: 'world-universities', name: 'World Universities (10k)', category: 'Education', records: '10,257', isSemiStatic: false, ttl: '30d', sampleQuery: 'field=country&value=Turkey' },
  { slug: 'crypto-coins-list', name: 'Crypto Tokens Master (61k)', category: 'Crypto', records: '61,098', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=solana' },
  { slug: 'rest-countries', name: 'REST Countries (250)', category: 'Geography', records: '250', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=Turkey' },
  { slug: 'cocktails-recipes', name: 'Cocktails & Mixology (441)', category: 'Food', records: '441', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=mojito' },
  { slug: 'superheroes-universe', name: 'Superheroes & Powerstats (563)', category: 'Comics', records: '563', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=batman' },
  { slug: 'dnd-5e-spells', name: 'D&D 5e Spells (319)', category: 'Gaming', records: '319', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=fireball' },
  { slug: 'nobel-laureates', name: 'Nobel Laureates (1,000)', category: 'History', records: '1,000', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=Einstein' },
  { slug: 'pokemon-pokedex', name: 'Master Pokédex (898)', category: 'Gaming', records: '898', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=pikachu' },
  { slug: 'periodic-table', name: 'Periodic Table (119)', category: 'Science', records: '119', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=Gold' },
  { slug: 'programming-languages', name: 'Programming Languages (2k)', category: 'Dev Tools', records: '2,058', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=TypeScript' },
  { slug: 'quotes-library', name: 'Quotes Library (1,454)', category: 'Reference', records: '1,454', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=knowledge' },
  { slug: 'free-to-play-games', name: 'Free-to-Play Games (415)', category: 'Gaming', records: '415', isSemiStatic: false, ttl: '7d', sampleQuery: 'field=genre&value=Shooter' },
  { slug: 'mime-types', name: 'IANA MIME Types (2.6k)', category: 'Dev Tools', records: '2,601', isSemiStatic: false, ttl: '30d', sampleQuery: 'search=json' },
];

export function DashboardClient() {
  const { language } = useLanguage();
  const { data: session } = useSession();

  // API Key State
  const [apiKey, setApiKey] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Playground State
  const [selectedDataset, setSelectedDataset] = useState<DatasetOption>(DATASETS[0]);
  const [queryParams, setQueryParams] = useState<string>(DATASETS[0].sampleQuery);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [freshnessBadge, setFreshnessBadge] = useState<string>('local_dataset');

  // Initialize or load API key from localStorage
  useEffect(() => {
    const storedKey = localStorage.getItem('fapi_user_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      const newKey = `fapi_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('fapi_user_key', newKey);
      setApiKey(newKey);
    }
  }, []);

  const regenerateKey = () => {
    const newKey = `fapi_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('fapi_user_key', newKey);
    setApiKey(newKey);
  };

  const copyToClipboard = (text: string, isKey = true) => {
    navigator.clipboard.writeText(text);
    if (isKey) {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const handleDatasetChange = (slug: string) => {
    const ds = DATASETS.find(d => d.slug === slug) || DATASETS[0];
    setSelectedDataset(ds);
    setQueryParams(ds.sampleQuery);
  };

  // Run Test Query
  const executeQuery = async () => {
    setIsLoading(true);
    const start = performance.now();
    try {
      const url = `/api/v1/gateway/${selectedDataset.slug}${queryParams ? `?${queryParams}` : ''}`;
      const res = await fetch(url, {
        headers: {
          'x-freeapi-key': apiKey,
        },
      });
      const data = await res.json();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setResponseResult(data);
      setFreshnessBadge(data.source || 'local_dataset');
    } catch (err: any) {
      setResponseResult({ error: err.message });
      setLatency(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Snippets
  const getFullUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://freeapi.dev';
    return `${origin}/api/v1/gateway/${selectedDataset.slug}${queryParams ? `?${queryParams}` : ''}`;
  };

  const getCurlCode = () => `curl -X GET "${getFullUrl()}" \\
  -H "x-freeapi-key: ${apiKey}" \\
  -H "Accept: application/json"`;

  const getJsCode = () => `const res = await fetch("${getFullUrl()}", {
  headers: {
    "x-freeapi-key": "${apiKey}",
    "Accept": "application/json"
  }
});
const data = await res.json();
console.log(data);`;

  const getPythonCode = () => `import requests

url = "${getFullUrl()}"
headers = {
    "x-freeapi-key": "${apiKey}",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 mb-3">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            <span>{language === 'en' ? 'FreeAPI Smart Gateway Console' : 'FreeAPI Akıllı Gateway Konsolu'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">
            {language === 'en' ? 'Developer Dashboard & API Gateway' : 'Geliştirici Konsolu & API Gateway'}
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-zinc-400 max-w-2xl">
            {language === 'en'
              ? 'Ultra-fast (<2ms) enterprise API gateway providing 18 high-density datasets with custom TTL revalidation and automatic proxy fallback.'
              : '18 zengin veri setine, mikro-saniye hızında (<2ms) LRU bellek önbelleğine ve sıfır bayat veri garantili otomatik senkronizasyona sahip kurumsal API Gateway.'}
          </p>
        </div>

        {/* Live Metrics Pill */}
        <div className="flex items-center gap-3 bg-white/70 dark:bg-zinc-900/70 glass p-3 rounded-2xl border border-stone-200/80 dark:border-zinc-800/80">
          <div className="text-right">
            <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              {language === 'en' ? 'Edge Latency' : 'Ortalama Gecikme'}
            </p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center justify-end gap-1">
              <Zap className="w-4 h-4" /> &lt;1.5 ms
            </p>
          </div>
          <div className="w-px h-8 bg-stone-200 dark:bg-zinc-800" />
          <div className="text-right">
            <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              {language === 'en' ? 'Master Records' : 'Toplam Kayıt'}
            </p>
            <p className="text-lg font-black text-stone-900 dark:text-zinc-100 font-mono">283,212</p>
          </div>
        </div>
      </div>

      {/* Grid: Left API Key & Usage / Right Live Gateway Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: API Key & Stats (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* API Key Box */}
          <div className="glass rounded-3xl p-6 border border-stone-200/80 dark:border-zinc-800/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
              <Key className="w-32 h-32" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-zinc-100 font-jakarta">
                  {language === 'en' ? 'Your API Key' : 'Canlı API Anahtarınız'}
                </h2>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  ● {language === 'en' ? 'Active / Unlimited Free' : 'Aktif / Sınırsız Ücretsiz'}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-zinc-400 mb-3">
              {language === 'en'
                ? 'Use this key in headers or query params to authenticate your requests to FreeAPI Gateway.'
                : 'İsteklerinizde `x-freeapi-key` başlığı olarak kullanarak Gateway üzerinden 2ms hızında veri çekin.'}
            </p>

            <div className="flex items-center gap-2 bg-stone-100/90 dark:bg-zinc-950/80 p-2.5 rounded-xl border border-stone-200/60 dark:border-zinc-800/60 font-mono text-xs text-stone-800 dark:text-zinc-200 mb-3 select-all">
              <span className="truncate flex-1 font-bold tracking-tight">{apiKey}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(apiKey, true)}
                className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-400 transition-colors"
                title="Kopyala"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={regenerateKey}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-100 dark:bg-zinc-800/80 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Regenerate API Key' : 'Yeni Anahtar Üret'}</span>
            </button>
          </div>

          {/* Architecture Benefits Box */}
          <div className="glass rounded-3xl p-6 border border-stone-200/80 dark:border-zinc-800/80 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100 font-jakarta flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              {language === 'en' ? 'Gateway Performance Matrix' : 'Gateway Performans Matrisi'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 dark:text-zinc-100">
                    {language === 'en' ? '2-Tier RAM Micro-Cache' : '2 Kademeli RAM Önbellek'}
                  </p>
                  <p className="text-stone-500 dark:text-zinc-400 text-[11px]">
                    {language === 'en' ? 'Zero disk latency, instant <2ms JSON responses.' : 'Sıfır disk gecikmesi, 1-2 milisaniyede tam JSON yanıtı.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 dark:text-zinc-100">
                    {language === 'en' ? 'Zero Stale Data Guarantee' : 'Sıfır Bayat Veri Garantisi'}
                  </p>
                  <p className="text-stone-500 dark:text-zinc-400 text-[11px]">
                    {language === 'en' ? 'Expired semi-static records auto-sync live from upstream.' : 'Süresi dolan yarı-statik veriler anında dış kaynaktan yenilenir.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe2 className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 dark:text-zinc-100">
                    {language === 'en' ? 'Universal CORS & SSRF Shield' : 'Global CORS & SSRF Güvenliği'}
                  </p>
                  <p className="text-stone-500 dark:text-zinc-400 text-[11px]">
                    {language === 'en' ? 'Direct frontend fetch() enabled without proxy cors errors.' : 'Tarayıcıdan doğrudan fetch() edilebilir, CORS hatası vermez.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Gateway Playground (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800/80 shadow-md">
            {/* Playground Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-stone-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 dark:text-zinc-100 font-jakarta">
                    {language === 'en' ? 'Live Gateway API Playground' : 'Canlı Gateway API Playground'}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    {language === 'en' ? 'Test and inspect live datasets directly in real time' : '18 master veri setini anında canlı sorgulayın ve test edin'}
                  </p>
                </div>
              </div>

              {/* Dataset Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedDataset.slug}
                  onChange={(e) => handleDatasetChange(e.target.value)}
                  aria-label={language === 'en' ? 'Select Dataset' : 'Veri Seti Seçin'}
                  className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs font-bold text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {DATASETS.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name} ({d.records}) {d.isSemiStatic ? '⚡ Live Sync' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Request Bar */}
            <div className="space-y-3 mb-6">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="flex items-center gap-2 bg-stone-100/90 dark:bg-zinc-950/90 px-3 py-2.5 rounded-xl border border-stone-200/80 dark:border-zinc-800/80 flex-1 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-black text-[11px]">GET</span>
                  <span className="text-stone-400 dark:text-zinc-500">/api/v1/gateway/{selectedDataset.slug}?</span>
                  <input
                    type="text"
                    value={queryParams}
                    onChange={(e) => setQueryParams(e.target.value)}
                    placeholder="search=...&limit=20&page=1"
                    aria-label={language === 'en' ? 'Query Parameters' : 'Sorgu Parametreleri'}
                    className="flex-1 bg-transparent text-stone-900 dark:text-zinc-100 focus:outline-none placeholder-stone-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={executeQuery}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>{language === 'en' ? 'Run Query' : 'Sorgula'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dataset Metadata Badge Row */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400">
                  📁 {selectedDataset.category}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400">
                  📊 {selectedDataset.records} {language === 'en' ? 'records' : 'kayıt'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  ⏱️ TTL: {selectedDataset.ttl}
                </span>
                {selectedDataset.isSemiStatic && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold">
                    🔄 Auto Live Sync
                  </span>
                )}
              </div>
            </div>

            {/* Code Snippets Section */}
            <div className="mb-6 bg-stone-900 rounded-2xl p-4 border border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold text-zinc-300 font-jakarta">
                    {language === 'en' ? 'Integration Snippet' : 'Entegrasyon Kodu'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-zinc-800 p-0.5 rounded-lg text-[10px] font-mono font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('curl')}
                      className={`px-2 py-0.5 rounded-md transition-colors ${activeCodeTab === 'curl' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                      cURL
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('js')}
                      className={`px-2 py-0.5 rounded-md transition-colors ${activeCodeTab === 'js' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                      JS Fetch
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('python')}
                      className={`px-2 py-0.5 rounded-md transition-colors ${activeCodeTab === 'python' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                      Python
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeCodeTab === 'curl' ? getCurlCode() : activeCodeTab === 'js' ? getJsCode() : getPythonCode(), false)}
                    className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    title="Kopyala"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <pre className="text-[11px] font-mono text-emerald-400/90 overflow-x-auto whitespace-pre p-1">
                {activeCodeTab === 'curl' ? getCurlCode() : activeCodeTab === 'js' ? getJsCode() : getPythonCode()}
              </pre>
            </div>

            {/* Live Response Viewer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-bold text-stone-900 dark:text-zinc-100 font-jakarta">
                    {language === 'en' ? 'Live Response' : 'Canlı Yanıt'}
                  </span>
                </div>

                {latency !== null && (
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-stone-400">Latency:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{latency} ms</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                      {freshnessBadge}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-stone-950 rounded-2xl p-4 border border-zinc-800 max-h-96 overflow-y-auto font-mono text-xs text-zinc-200">
                {responseResult ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(responseResult, null, 2)}</pre>
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-30 animate-pulse text-amber-500" />
                    <p className="text-xs">
                      {language === 'en'
                        ? 'Click "Run Query" above to test this live endpoint.'
                        : 'Canlı veriyi çekmek için yukarıdaki "Sorgula" butonuna basın.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
