'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import type { EnrichedApiService } from '@/lib/api-slugs';
import { CategoryIcon } from '@/components/CategoryIcon';
import { ApiCard } from '@/components/ApiCard';
import { translateDescription, translateRateLimit } from '@/lib/api-translator';
import {
  ExternalLink,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Code2,
  HelpCircle,
  Layers,
  Sparkles,
  ChevronDown,
  KeyRound,
  FileJson,
} from 'lucide-react';

interface ServiceClientProps {
  api: EnrichedApiService;
  relatedApis: any[];
  forcedLanguage?: 'tr' | 'en';
}

type CodeTab = 'gateway' | 'curl' | 'js' | 'python' | 'node' | 'php';

export default function ServiceClient({ api, relatedApis, forcedLanguage }: ServiceClientProps) {
  const { language: contextLang, t: contextT } = useLanguage();
  const language = forcedLanguage || contextLang;
  const t = forcedLanguage === 'en' ? translations.en : (forcedLanguage === 'tr' ? translations.tr : contextT);

  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('gateway');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const localizedDesc = translateDescription(api, language);
  const localizedCatTitle = t.categoryTitles[api.categoryId]?.title || api.categoryTitle;

  const isZeroAuth =
    api.isNoAuth ||
    api.description.toLowerCase().includes('kayıt gerektirmez') ||
    api.description.toLowerCase().includes('kayıt yok') ||
    api.description.toLowerCase().includes('no key') ||
    api.description.toLowerCase().includes('zero registration');

  // Copy API URL
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(api.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Toggle bookmark
  const handleToggleBookmark = (name: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name];
      try {
        localStorage.setItem('api_showcase_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Generate Code Snippets dynamically
  const gatewayUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/v1/gateway/${api.slug}`
    : `https://freeapi.website/api/v1/gateway/${api.slug}`;

  const codeSnippets: Record<CodeTab, { label: string; code: string }> = {
    gateway: {
      label: '⚡ Smart Gateway (<2ms)',
      code: `// FreeAPI Smart Edge Gateway (<2ms RAM Cache + CORS + Zero-Stale)
curl -X GET "${gatewayUrl}" \\
  -H "x-freeapi-key: fapi_live_anon" \\
  -H "Accept: application/json"`,
    },
    curl: {
      label: 'cURL Direct',
      code: `curl -X GET "${api.url}" \\
  -H "Accept: application/json"`,
    },
    js: {
      label: 'JavaScript (Fetch)',
      code: `// Fetch data directly in Browser or Node.js 18+
async function fetch${api.name.replace(/[^\w]/g, '')}() {
  try {
    const response = await fetch("${api.url}", {
      headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("API Error:", error);
  }
}

fetch${api.name.replace(/[^\w]/g, '')}();`,
    },
    python: {
      label: 'Python (Requests)',
      code: `import requests

url = "${api.url}"
headers = {"Accept": "application/json"}

try:
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    data = response.json()
    print("API Response:", data)
except requests.exceptions.RequestException as e:
    print("Error:", e)`,
    },
    node: {
      label: 'Node.js (Axios)',
      code: `const axios = require('axios');

async function getApiData() {
  try {
    const response = await axios.get("${api.url}", {
      headers: { Accept: 'application/json' }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Axios error:', error.message);
  }
}

getApiData();`,
    },
    php: {
      label: 'PHP (cURL)',
      code: `<?php

$ch = curl_init("${api.url}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'cURL Error: ' . curl_error($ch);
} else {
    $data = json_decode($response, true);
    print_r($data);
}
curl_close($ch);`,
    },
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab].code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // FAQ Items
  const faqList = [
    {
      qTr: `${api.name} API servisi tamamen ücretsiz mi?`,
      qEn: `Is ${api.name} completely free to use?`,
      aTr: `Evet, ${api.name} FreeAPI Directory üzerinde ücretsiz olarak listelenmiştir. İstek limitleri: ${translateRateLimit(api.rateLimit, 'tr')}.`,
      aEn: `Yes, ${api.name} is listed as a free endpoint on FreeAPI Directory with an allowance of: ${translateRateLimit(api.rateLimit, 'en')}.`,
    },
    {
      qTr: `Kullanmak için API anahtarı veya hesap oluşturmak gerekiyor mu?`,
      qEn: `Do I need an API key or an account to use ${api.name}?`,
      aTr: isZeroAuth
        ? `Hayır, ${api.name} bir Zero-Auth servisidir. Hesap açmadan veya token almadan doğrudan istek atabilirsiniz.`
        : `Servis sağlayıcının dokümantasyonuna göre kayıt veya ücretsiz API anahtarı gerekebilir.`,
      aEn: isZeroAuth
        ? `No, ${api.name} is a Zero-Auth service. You can call endpoints directly without sign-up or authorization tokens.`
        : `Depending on the provider, a free registration or API key might be required.`,
    },
    {
      qTr: `Bu API'yi ticari projelerimde kullanabilir miyim?`,
      qEn: `Can I use ${api.name} in commercial projects?`,
      aTr: `Çoğu ücretsiz API servis şartlarında belirtilen kullanım politikalarına uymak kaydıyla ticari projelerde prototipleme ve üretim için kullanılabilir. Güncel lisans şartları için resmi dokümantasyonu inceleyin.`,
      aEn: `Most free endpoints permit commercial or prototyping use within fair use terms. Please inspect the provider documentation for production SLA.`,
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-stone-600 dark:text-zinc-400 mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
          FreeAPI
        </Link>
        <span>/</span>
        <Link
          href={`/category/${api.categoryId}`}
          className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors truncate"
        >
          {localizedCatTitle}
        </Link>
        <span>/</span>
        <span className="text-stone-900 dark:text-zinc-100 font-bold truncate">{api.name}</span>
      </div>

      {/* 2. Hero Section */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 mb-8 border border-stone-200 dark:border-white/[0.08] bg-white/90 dark:bg-zinc-900/80 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-700/10 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-3xl bg-brand-700/10 dark:bg-brand-500/15 border border-brand-700/20 dark:border-brand-500/25 text-brand-700 dark:text-brand-400 shrink-0">
              <CategoryIcon categoryId={api.categoryId} size={36} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-bold border border-stone-200 dark:border-zinc-700">
                  {localizedCatTitle}
                </span>
                {isZeroAuth && (
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold">
                    Zero-Auth ✅
                  </span>
                )}
                {api.isRecommended && (
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-zinc-50 font-jakarta tracking-tight">
                {api.name}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                {localizedDesc}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <a
              href={api.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs tracking-wide shadow-lg shadow-brand-700/20 transition-all flex items-center justify-center gap-2 text-center"
            >
              <span>{language === 'tr' ? 'Resmi Dokümantasyon' : 'Official Documentation'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={handleCopyUrl}
              className="px-5 py-3 rounded-2xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold border border-stone-200 dark:border-white/[0.08] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{language === 'tr' ? 'URL Kopyalandı!' : 'URL Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>{language === 'tr' ? 'Endpoint URL Kopyala' : 'Copy Endpoint URL'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Specification & Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="glass-card rounded-2xl p-5 border border-stone-200 dark:border-white/[0.06] bg-white/70 dark:bg-zinc-900/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 text-xs font-mono mb-2">
            <Zap className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span>{language === 'tr' ? 'İstek Limiti' : 'Rate Limit'}</span>
          </div>
          <div className="text-base font-bold text-stone-900 dark:text-zinc-100 truncate">
            {translateRateLimit(api.rateLimit, language)}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-stone-200 dark:border-white/[0.06] bg-white/70 dark:bg-zinc-900/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 text-xs font-mono mb-2">
            <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'tr' ? 'Kimlik Doğrulama' : 'Authentication'}</span>
          </div>
          <div className="text-base font-bold text-stone-900 dark:text-zinc-100 truncate">
            {isZeroAuth ? (language === 'tr' ? 'Kayıt Yok (Zero-Auth)' : 'Zero-Auth') : 'API Key / Token'}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-stone-200 dark:border-white/[0.06] bg-white/70 dark:bg-zinc-900/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 text-xs font-mono mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{language === 'tr' ? 'Güvenlik & CORS' : 'Security & CORS'}</span>
          </div>
          <div className="text-base font-bold text-stone-900 dark:text-zinc-100 truncate">
            HTTPS • CORS Enabled
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-stone-200 dark:border-white/[0.06] bg-white/70 dark:bg-zinc-900/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400 text-xs font-mono mb-2">
            <FileJson className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{language === 'tr' ? 'Veri Formatı' : 'Payload Format'}</span>
          </div>
          <div className="text-base font-bold text-stone-900 dark:text-zinc-100 truncate">
            JSON / REST
          </div>
        </div>
      </div>

      {/* 4. Interactive Multi-Language Code Snippets */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10 border border-stone-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/70 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-700/10 text-brand-700 dark:text-brand-400 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                {language === 'tr' ? 'Hızlı Başlangıç Kod Örnekleri' : 'Quickstart Code Snippets'}
              </h2>
              <p className="text-xs text-stone-600 dark:text-zinc-400">
                {language === 'tr' ? 'İstediğiniz programlama dilinde tek tıkla kopyalayın.' : 'Copy-paste ready boilerplate for your tech stack.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer border border-stone-200 dark:border-white/[0.06]"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'tr' ? 'Kopyalandı!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>{language === 'tr' ? 'Kodu Kopyala' : 'Copy Snippet'}</span>
              </>
            )}
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-stone-200 dark:border-zinc-800 mb-4">
          {(Object.keys(codeSnippets) as CodeTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCodeTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeCodeTab === tab
                  ? 'bg-brand-700 text-white font-bold shadow-sm'
                  : 'bg-stone-100 dark:bg-zinc-800/80 text-stone-700 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
              }`}
            >
              {codeSnippets[tab].label}
            </button>
          ))}
        </div>

        {/* Code View */}
        <div className="relative rounded-2xl bg-zinc-950 p-4 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
          <pre className="leading-relaxed whitespace-pre-wrap">{codeSnippets[activeCodeTab].code}</pre>
        </div>
      </div>

      {/* 5. FAQ Section (Google Rich Snippets SEO) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10 border border-stone-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/70 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
              {language === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions (FAQ)'}
            </h2>
            <p className="text-xs text-stone-600 dark:text-zinc-400">
              {language === 'tr' ? `${api.name} hakkında merak edilen teknik detaylar.` : `Technical and integration answers for ${api.name}.`}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqList.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-stone-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-zinc-100">
                    {language === 'tr' ? faq.qTr : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-brand-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-stone-600 dark:text-zinc-400 border-t border-stone-100 dark:border-zinc-800/50">
                    {language === 'tr' ? faq.aTr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. GitHub README Badge Generator */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10 border border-stone-200 dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/70 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-brand-700 dark:text-brand-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                {language === 'tr' ? 'GitHub README Rozeti (Badge)' : 'GitHub README Verified Badge'}
              </h2>
              <p className="text-xs text-stone-600 dark:text-zinc-400">
                {language === 'tr'
                  ? 'Projenizin README.md dosyasına ekleyerek doğrulanmış FreeAPI rozeti gösterin.'
                  : 'Embed this live verified badge in your open-source project or repository.'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Badge Preview */}
        <div className="p-4 rounded-2xl bg-stone-100 dark:bg-zinc-950/80 border border-stone-200 dark:border-white/[0.06] flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-stone-500 dark:text-zinc-400">Preview:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/badge/${api.slug}`}
              alt={`${api.name} FreeAPI Verified Badge`}
              className="h-7 rounded shadow-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const badgeMarkdown = `[![FreeAPI Verified](https://freeapi.website/api/badge/${api.slug})](https://freeapi.website/service/${api.slug})`;
              navigator.clipboard.writeText(badgeMarkdown);
              setCopiedUrl(true);
              setTimeout(() => setCopiedUrl(false), 2000);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'Markdown Rozetini Kopyala' : 'Copy Markdown Badge'}</span>
          </button>
        </div>

        {/* Markdown Snippet Display */}
        <div className="relative rounded-2xl bg-zinc-950 p-3.5 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto">
          <code>{`[![FreeAPI Verified](https://freeapi.website/api/badge/${api.slug})](https://freeapi.website/service/${api.slug})`}</code>
        </div>
      </div>

      {/* 7. Alternatives & Related APIs (Cross-Linking SEO) */}
      {relatedApis.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-700 dark:text-brand-400" />
              <span>
                {language === 'tr'
                  ? `${localizedCatTitle} Kategorisindeki Popüler Alternatifler`
                  : `Top Alternatives in ${localizedCatTitle}`}
              </span>
            </h2>
            <Link
              href={`/category/${api.categoryId}`}
              className="text-xs font-mono text-brand-700 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>{language === 'tr' ? 'Tümünü Gör' : 'View All'}</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedApis.map((rel) => (
              <ApiCard
                key={rel.name}
                api={rel}
                categoryTitle={localizedCatTitle}
                isBookmarked={bookmarks.includes(rel.name)}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
