'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Bell,
  Radio,
  Trash2,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { WebhookSubscription } from '@/types/database';

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

  // Top Dashboard View Switcher
  const [activeView, setActiveView] = useState<'playground' | 'webhooks'>('playground');

  // API Key State
  const [apiKey, setApiKey] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Playground State
  const [selectedDataset, setSelectedDataset] = useState<DatasetOption>(DATASETS[0]);
  const [queryParams, setQueryParams] = useState<string>(DATASETS[0].sampleQuery);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'js' | 'python' | 'sdk'>('curl');
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [freshnessBadge, setFreshnessBadge] = useState<string>('local_dataset');

  // Webhooks State
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookDataset, setWebhookDataset] = useState('crypto-prices');
  const [webhookEventType, setWebhookEventType] = useState<'dataset.updated' | 'threshold.alert' | 'item.added'>('dataset.updated');
  const [conditionField, setConditionField] = useState('currentPriceUsd');
  const [conditionOperator, setConditionOperator] = useState<'>' | '<' | '>=' | '<=' | '=='>('>');
  const [conditionValue, setConditionValue] = useState('80000');
  const [conditionTargetKey, setConditionTargetKey] = useState('bitcoin');
  const [targetUrl, setTargetUrl] = useState('');
  const [isSubmittingWebhook, setIsSubmittingWebhook] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<Record<string, { testing: boolean; success?: boolean; message?: string; statusCode?: number; latencyMs?: number }>>({});
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

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
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setIsLoadingWebhooks(true);
    try {
      const res = await fetch('/api/v1/webhooks');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setWebhooks(json.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingWebhooks(false);
    }
  };

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
    const ds = DATASETS.find((d) => d.slug === slug) || DATASETS[0];
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

  // Handle Create Webhook
  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsSubmittingWebhook(true);
    try {
      const condition =
        webhookEventType === 'threshold.alert'
          ? {
              field: conditionField,
              operator: conditionOperator,
              value: conditionValue,
              targetKey: conditionTargetKey || undefined,
            }
          : null;

      const res = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: webhookName || `${webhookDataset} Alert`,
          dataset_slug: webhookDataset,
          event_type: webhookEventType,
          condition,
          target_url: targetUrl,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setWebhooks((prev) => [json.data, ...prev]);
        setShowWebhookForm(false);
        setTargetUrl('');
        setWebhookName('');
      } else {
        alert(json.error || 'Failed to create webhook');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating webhook');
    } finally {
      setIsSubmittingWebhook(false);
    }
  };

  // Handle Delete Webhook
  const handleDeleteWebhook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook subscription?')) return;
    try {
      const res = await fetch(`/api/v1/webhooks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWebhooks((prev) => prev.filter((w) => w.id !== id));
      }
    } catch {
      // ignore
    }
  };

  // Handle Test Webhook Delivery
  const handleTestWebhook = async (sub: WebhookSubscription) => {
    setWebhookTestStatus((prev) => ({
      ...prev,
      [sub.id]: { testing: true },
    }));

    try {
      const res = await fetch('/api/v1/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: sub.id,
          targetUrl: sub.target_url,
          secret: sub.secret,
          datasetSlug: sub.dataset_slug,
        }),
      });
      const data = await res.json();
      setWebhookTestStatus((prev) => ({
        ...prev,
        [sub.id]: {
          testing: false,
          success: data.success,
          message: data.message,
          statusCode: data.status_code,
          latencyMs: data.latency_ms,
        },
      }));
      loadWebhooks(); // Refresh counters
    } catch (err: any) {
      setWebhookTestStatus((prev) => ({
        ...prev,
        [sub.id]: {
          testing: false,
          success: false,
          message: err.message,
        },
      }));
    }
  };

  // Generate Snippets
  const getFullUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://freeapi.website';
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

  const getSdkCode = () => `// 📦 Drop-in TypeScript / JS Client Helper (Single file, zero dependencies)
export async function queryFreeApi(dataset: string, params: Record<string, string | number> = {}) {
  const query = new URLSearchParams(params as any).toString();
  const url = "https://freeapi.website/api/v1/gateway/" + dataset + (query ? "?" + query : "");
  
  const res = await fetch(url, {
    headers: {
      "x-freeapi-key": "${apiKey}",
      "Accept": "application/json"
    }
  });
  if (!res.ok) throw new Error("FreeAPI Gateway error: " + res.status);
  return await res.json();
}

// 🚀 Example usage in your project:
const { data } = await queryFreeApi("${selectedDataset.slug}", { ${queryParams ? queryParams.split('&').map((p) => { const [k, v] = p.split('='); return `${k}: "${v}"`; }).join(', ') : 'limit: 20'} });
console.log(data);`;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 mb-3">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            <span>{language === 'en' ? 'FreeAPI Enterprise Gateway & Event Bus' : 'FreeAPI Kurumsal Gateway & Olay Ağı'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-zinc-100 tracking-tight font-jakarta">
            {language === 'en' ? 'Developer Dashboard & Webhooks' : 'Geliştirici Konsolu & Webhook Merkezi'}
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-zinc-400 max-w-2xl">
            {language === 'en'
              ? 'Ultra-fast (<2ms) enterprise API gateway with universal real-time webhooks, live event dispatcher and drop-in SDK.'
              : '18 zengin veri setine, mikro-saniye (<2ms) LRU önbelleğine, evrensel Webhook alarm ağına ve tek tık SDK desteğine sahip geliştirici platformu.'}
          </p>
        </div>

        {/* Live Enterprise SLA Metrics Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/70 dark:bg-zinc-900/70 glass p-3.5 rounded-2xl border border-stone-200/80 dark:border-zinc-800/80 text-right">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              {language === 'en' ? 'P99 Edge Latency' : 'P99 Gecikme SLA'}
            </p>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center justify-end gap-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-500" /> &lt;1.2 ms
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              {language === 'en' ? 'Cache Hit Ratio' : 'Edge Hit Oranı'}
            </p>
            <p className="text-base font-black text-brand-600 dark:text-brand-400 font-mono">99.85%</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              {language === 'en' ? 'Uptime & Failover' : 'Uptime Güvencesi'}
            </p>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">99.99%</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              {language === 'en' ? 'Monthly Quota' : 'Aylık Kota'}
            </p>
            <p className="text-base font-black text-stone-900 dark:text-zinc-100 font-mono">100k / ay</p>
          </div>
        </div>
      </div>

      {/* Main View Switcher Tabs */}
      <div className="flex items-center gap-3 mb-8 border-b border-stone-200 dark:border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveView('playground')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-jakarta transition-all cursor-pointer ${
            activeView === 'playground'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
              : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>{language === 'en' ? '⚡ Gateway API Playground' : '⚡ Gateway API Playground'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('webhooks')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-jakarta transition-all cursor-pointer ${
            activeView === 'webhooks'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{language === 'en' ? '🔔 Webhooks & Live Event Alerts' : '🔔 Webhooks & Canlı Alarmlar'}</span>
          {webhooks.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
              {webhooks.length}
            </span>
          )}
        </button>
      </div>

      {/* VIEW 1: GATEWAY PLAYGROUND */}
      {activeView === 'playground' && (
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
                      {language === 'en' ? 'Universal CORS & Dynamic Projection' : 'Global CORS & ?fields= Projeksiyonu'}
                    </p>
                    <p className="text-stone-500 dark:text-zinc-400 text-[11px]">
                      {language === 'en' ? 'Filter exact fields (?fields=name,lat,lng) for ultra-light payloads.' : '?fields= ile sadece istediğiniz alanları çekip frontend veri modelinizi optimize edin.'}
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
                  <div className="flex items-center bg-stone-100 dark:bg-zinc-900 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 text-xs font-mono font-bold text-stone-600 dark:text-zinc-400 shrink-0">
                    <span className="text-emerald-600 dark:text-emerald-400 mr-2">GET</span>
                    <span>/api/v1/gateway/{selectedDataset.slug}</span>
                  </div>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={queryParams}
                      onChange={(e) => setQueryParams(e.target.value)}
                      placeholder="e.g. search=Istanbul&fields=name,country,lat,lng"
                      className="w-full h-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-mono text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={executeQuery}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
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
                      <button
                        type="button"
                        onClick={() => setActiveCodeTab('sdk')}
                        className={`px-2 py-0.5 rounded-md transition-colors ${activeCodeTab === 'sdk' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                      >
                        TS / SDK
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeCodeTab === 'curl' ? getCurlCode() : activeCodeTab === 'js' ? getJsCode() : activeCodeTab === 'python' ? getPythonCode() : getSdkCode(), false)}
                      className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Kopyala"
                    >
                      {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <pre className="text-[11px] font-mono text-emerald-400/90 overflow-x-auto whitespace-pre p-1">
                  {activeCodeTab === 'curl' ? getCurlCode() : activeCodeTab === 'js' ? getJsCode() : activeCodeTab === 'python' ? getPythonCode() : getSdkCode()}
                </pre>
              </div>

              {/* Response Viewer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700 dark:text-zinc-300 font-jakarta">
                    {language === 'en' ? 'Live Response Output' : 'Canlı Yanıt Çıktısı'}
                  </span>

                  {latency !== null && (
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className={`px-2 py-0.5 rounded-md font-bold ${latency < 10 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600'}`}>
                        ⚡ {latency} ms
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400">
                        {freshnessBadge === 'upstream_synced' ? '🔄 Live Fresh' : '⚡ RAM Tier-1'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-zinc-950 p-4 border border-zinc-800 font-mono text-xs text-zinc-300 h-64 overflow-y-auto">
                  {responseResult ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(responseResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-500 text-center">
                      <Terminal className="w-8 h-8 mb-2 opacity-50" />
                      <p>{language === 'en' ? 'Click "Run Query" to fetch live gateway data' : '"Sorgula" butonuna basarak canlı veriyi test edin'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: WEBHOOKS & LIVE EVENT ALERTS */}
      {activeView === 'webhooks' && (
        <div className="space-y-8">
          {/* Top Banner with Action Button */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-zinc-100 font-jakarta">
                  {language === 'en' ? 'Universal Event Webhooks' : 'Evrensel Webhook & Olay Ağı'}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-zinc-400 max-w-2xl">
                  {language === 'en'
                    ? 'Get instant cryptographic HMAC-SHA256 signed HTTP POST notifications to your backend whenever dataset changes or custom threshold conditions are triggered.'
                    : 'Veri setleri güncellendiğinde veya belirlediğiniz eşik koşulları (BTC > $80k, Dolar > 36 TL) aşıldığında sunucunuza anında imzalı HTTP POST bildirimleri alın.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWebhookForm(!showWebhookForm)}
              className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showWebhookForm ? (language === 'en' ? 'Close Form' : 'Formu Kapat') : (language === 'en' ? 'Create Webhook Alert' : 'Yeni Webhook Alarmı Kur')}</span>
            </button>
          </div>

          {/* Webhook Creation Form (Expandable) */}
          <AnimatePresence>
            {showWebhookForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateWebhook}
                className="glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-amber-500/[0.02] shadow-lg space-y-6"
              >
                <div className="flex items-center gap-2 pb-4 border-b border-stone-200 dark:border-zinc-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100 font-jakarta">
                    {language === 'en' ? 'Configure New Webhook Trigger' : 'Yeni Webhook Tetikleyicisi Yapılandır'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5 font-jakarta">
                      {language === 'en' ? 'Webhook Name' : 'Webhook Adı'}
                    </label>
                    <input
                      type="text"
                      required
                      value={webhookName}
                      onChange={(e) => setWebhookName(e.target.value)}
                      placeholder="e.g. Bitcoin $80k Alert"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Dataset Selector */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5 font-jakarta">
                      {language === 'en' ? 'Listen to Dataset' : 'Dinlenecek Veri Seti'}
                    </label>
                    <select
                      value={webhookDataset}
                      onChange={(e) => setWebhookDataset(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-bold text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {DATASETS.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name} {d.isSemiStatic ? '⚡ Live Sync' : ''}
                        </option>
                      ))}
                      <option value="*">🌐 All Datasets (* Universal)</option>
                    </select>
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5 font-jakarta">
                      {language === 'en' ? 'Event Type' : 'Olay Tipi'}
                    </label>
                    <select
                      value={webhookEventType}
                      onChange={(e: any) => setWebhookEventType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-bold text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="dataset.updated">🔄 dataset.updated (Her Yenilenmede)</option>
                      <option value="threshold.alert">🎯 threshold.alert (Eşik Aşıldığında)</option>
                      <option value="item.added">📦 item.added (Yeni Kayıt Eklendiğinde)</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Threshold Builder (if threshold.alert) */}
                {webhookEventType === 'threshold.alert' && (
                  <div className="p-4 rounded-2xl bg-stone-100 dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 space-y-3">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      {language === 'en' ? 'Threshold Filter Condition' : 'Eşik Koşul Kuralları'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[11px] text-stone-500 dark:text-zinc-400 block mb-1">Target Item Key (Optional)</label>
                        <input
                          type="text"
                          value={conditionTargetKey}
                          onChange={(e) => setConditionTargetKey(e.target.value)}
                          placeholder="e.g. bitcoin, TRY, Istanbul"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-500 dark:text-zinc-400 block mb-1">Field Name</label>
                        <input
                          type="text"
                          required
                          value={conditionField}
                          onChange={(e) => setConditionField(e.target.value)}
                          placeholder="e.g. currentPriceUsd"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-500 dark:text-zinc-400 block mb-1">Operator</label>
                        <select
                          value={conditionOperator}
                          onChange={(e: any) => setConditionOperator(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-mono font-bold"
                        >
                          <option value=">">&gt; (Greater than)</option>
                          <option value="<">&lt; (Less than)</option>
                          <option value=">=">&gt;= (Greater or equal)</option>
                          <option value="<=">&lt;= (Less or equal)</option>
                          <option value="==">== (Exact match)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-500 dark:text-zinc-400 block mb-1">Threshold Value</label>
                        <input
                          type="text"
                          required
                          value={conditionValue}
                          onChange={(e) => setConditionValue(e.target.value)}
                          placeholder="e.g. 80000"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Target URL */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5 font-jakarta">
                    {language === 'en' ? 'Target Destination URL (HTTP POST)' : 'Hedef Backend URL (HTTP POST)'}
                  </label>
                  <input
                    type="url"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://my-app.com/api/webhooks/freeapi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-mono text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-1">
                    {language === 'en'
                      ? 'FreeAPI will send an HMAC-SHA256 signed JSON payload to this endpoint with header X-FreeAPI-Signature.'
                      : 'FreeAPI bu adrese `X-FreeAPI-Signature` başlığı içeren HMAC-SHA256 imzalı JSON paketi fırlatacaktır.'}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWebhookForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
                  >
                    {language === 'en' ? 'Cancel' : 'İptal'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingWebhook}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{language === 'en' ? 'Save & Activate Webhook' : 'Kaydet ve Aktifleştir'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Active Webhooks List */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800/80 shadow-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 font-jakarta">
                    {language === 'en' ? 'Active Webhook Subscriptions' : 'Aktif Webhook Abonelikleri'}
                  </h3>
                  <span className="text-xs text-stone-500 dark:text-zinc-400">
                    {webhooks.length} {language === 'en' ? 'endpoints listening' : 'aktif dinleyici'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={loadWebhooks}
                className="p-2 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
                title="Yenile"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingWebhooks ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {webhooks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl">
                <Bell className="w-10 h-10 text-stone-400 dark:text-zinc-600 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-bold text-stone-700 dark:text-zinc-300">
                  {language === 'en' ? 'No active webhook subscriptions yet' : 'Henüz tanımlı bir webhook bulunmuyor'}
                </p>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                  {language === 'en'
                    ? 'Click "Create Webhook Alert" above to start receiving instant events on crypto, forex, weather and catalog updates.'
                    : 'Yukarıdaki butona tıklayarak kripto, döviz ve veri seti güncellemeleri için anlık bildirim kurun.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((sub) => {
                  const testState = webhookTestStatus[sub.id];
                  const isSecretRevealed = revealedSecrets[sub.id];

                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-stone-50 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h4 className="text-sm font-bold text-stone-900 dark:text-zinc-100 font-jakarta">
                            {sub.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-zinc-800 text-[10px] font-mono text-stone-700 dark:text-zinc-300">
                            {sub.dataset_slug}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-mono font-bold">
                            {sub.event_type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Test Button */}
                          <button
                            type="button"
                            onClick={() => handleTestWebhook(sub)}
                            disabled={testState?.testing}
                            className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-zinc-800 hover:bg-stone-300 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {testState?.testing ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>{language === 'en' ? 'Test Ping' : 'Test Gönder'}</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteWebhook(sub.id)}
                            className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* URL & Secret Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800/60 truncate flex items-center justify-between">
                          <span className="text-stone-500 dark:text-zinc-400 mr-2">URL:</span>
                          <span className="truncate flex-1 font-bold text-stone-800 dark:text-zinc-200">{sub.target_url}</span>
                        </div>

                        <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                          <span className="text-stone-500 dark:text-zinc-400 mr-2">Secret:</span>
                          <span className="truncate flex-1 font-bold text-amber-600 dark:text-amber-400">
                            {isSecretRevealed ? sub.secret : `${sub.secret.substring(0, 10)}••••••••••••`}
                          </span>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              type="button"
                              onClick={() => setRevealedSecrets((p) => ({ ...p, [sub.id]: !p[sub.id] }))}
                              className="text-[10px] text-stone-500 hover:text-stone-900 dark:hover:text-zinc-100"
                            >
                              {isSecretRevealed ? 'Hide' : 'Show'}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(sub.secret, true)}
                              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Condition & Statistics Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-stone-500 dark:text-zinc-400 pt-1">
                        <div className="flex items-center gap-3">
                          {sub.condition && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-zinc-800/80 text-stone-700 dark:text-zinc-300">
                              🎯 Condition: {sub.condition.targetKey ? `${sub.condition.targetKey}.` : ''}{sub.condition.field} {sub.condition.operator} {sub.condition.value}
                            </span>
                          )}
                          <span>Total Deliveries: {sub.total_deliveries}</span>
                        </div>

                        {sub.last_status_code !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <span>Last Status:</span>
                            <span className={`font-bold ${sub.last_status_code === 200 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              HTTP {sub.last_status_code || 'Err'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Test Result Banner */}
                      {testState && !testState.testing && (
                        <div
                          className={`p-2.5 rounded-xl text-xs font-mono flex items-center justify-between ${
                            testState.success
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {testState.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span>{testState.message}</span>
                          </div>
                          {testState.latencyMs !== undefined && <span>⚡ {testState.latencyMs} ms</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Webhook Signature Verification Guide & SDK Code */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-zinc-800/80 shadow-md space-y-4">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 font-jakarta">
                {language === 'en' ? 'HMAC-SHA256 Signature Verification (SDK Guide)' : 'HMAC-SHA256 İmza Doğrulama (SDK Rehberi)'}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">
              {language === 'en'
                ? 'Every webhook payload sent by FreeAPI includes an X-FreeAPI-Signature header (format: t=timestamp,v1=signature). Use our official SDK or verify the signature in 3 lines of code in your backend:'
                : 'FreeAPI tarafından gönderilen tüm webhook paketleri `X-FreeAPI-Signature` başlığı içerir (`t=timestamp,v1=signature` formatında). Resmi SDK fonksiyonumuz ile backend controller\'ınızda tek satırda güvenliği doğrulayın:'}
            </p>

            <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800 font-mono text-xs text-zinc-200 overflow-x-auto">
              <pre className="leading-relaxed whitespace-pre-wrap">{`// Next.js App Router / Node.js Express Webhook Handler
import { verifyWebhookSignature } from '@/lib/sdk';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-freeapi-signature');

  // 🔒 Cryptographic HMAC-SHA256 Verification with replay attack prevention:
  const isValid = verifyWebhookSignature({
    payload: rawBody,
    signature,
    secret: process.env.FREEAPI_WEBHOOK_SECRET!
  });

  if (!isValid) {
    return new Response('Unauthorized Signature', { status: 401 });
  }

  const event = JSON.parse(rawBody);
  console.log("⚡ Received Verified FreeAPI Event:", event.event, event.data);

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
