'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DEVELOPER_TOOLS, DeveloperTool } from '@/data/tools';
import {
  Wrench,
  Search,
  Fingerprint,
  Braces,
  Binary,
  KeyRound,
  QrCode,
  FileCode2,
  ShieldCheck,
  Type,
  Clock,
  Link2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Layers,
  Code2,
  Terminal,
} from 'lucide-react';

interface ToolsHubClientProps {
  lang: 'tr' | 'en';
}

const iconMap: Record<string, React.ReactNode> = {
  Fingerprint: <Fingerprint className="h-6 w-6" />,
  Braces: <Braces className="h-6 w-6" />,
  Binary: <Binary className="h-6 w-6" />,
  KeyRound: <KeyRound className="h-6 w-6" />,
  QrCode: <QrCode className="h-6 w-6" />,
  FileCode2: <FileCode2 className="h-6 w-6" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
  Type: <Type className="h-6 w-6" />,
  Clock: <Clock className="h-6 w-6" />,
  Link2: <Link2 className="h-6 w-6" />,
};

export default function ToolsHubClient({ lang }: ToolsHubClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: lang === 'tr' ? 'Tüm Araçlar' : 'All Tools' },
    { id: 'generator', label: lang === 'tr' ? 'Üreticiler' : 'Generators' },
    { id: 'converter', label: lang === 'tr' ? 'Dönüştürücüler' : 'Converters' },
    { id: 'formatter', label: lang === 'tr' ? 'Formatlayıcılar' : 'Formatters' },
    { id: 'security', label: lang === 'tr' ? 'Güvenlik' : 'Security' },
    { id: 'text', label: lang === 'tr' ? 'Metin & Tasarım' : 'Text & Design' },
  ];

  const filteredTools = DEVELOPER_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const name = tool.name[lang].toLowerCase();
    const desc = tool.shortDescription[lang].toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch = name.includes(q) || desc.includes(q) || tool.slug.includes(q);
    return matchesCategory && matchesSearch;
  });

  const baseHref = lang === 'en' ? '/en/tools' : '/tools';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[600px] rounded-full bg-teal-500/10 blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[600px] rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{lang === 'tr' ? '0ms Yerel Çekirdek & Utiliome Modeli' : '0ms Local Edge & Utiliome Model'}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {lang === 'tr' ? (
              <>
                Geliştirici Araçları & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Yerel API Motoru</span>
              </>
            ) : (
              <>
                Developer Tools & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Local API Engine</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {lang === 'tr'
              ? 'Sıfır dış bağımlılık, 0ms gecikme ve %100 açık algoritmalar. Tarayıcınızda canlı kullanın veya doğrudan REST API endpointlerimiz ile projelerinize bağlayın.'
              : 'Zero external dependencies, 0ms latency and 100% open algorithms. Run interactively in your browser or integrate directly into your codebase via REST API.'}
          </p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 backdrop-blur">
              <div className="font-mono text-xl font-bold text-emerald-400">0ms</div>
              <div className="text-xs text-slate-400">{lang === 'tr' ? 'Yerel Gecikme' : 'Local Latency'}</div>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 backdrop-blur">
              <div className="font-mono text-xl font-bold text-teal-400">10/10</div>
              <div className="text-xs text-slate-400">{lang === 'tr' ? 'Çekirdek Araç' : 'Core Tools'}</div>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 backdrop-blur">
              <div className="font-mono text-xl font-bold text-cyan-400">REST API</div>
              <div className="text-xs text-slate-400">{lang === 'tr' ? 'Çift Kullanım' : 'Dual Mode'}</div>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 backdrop-blur">
              <div className="font-mono text-xl font-bold text-indigo-400">100% Free</div>
              <div className="text-xs text-slate-400">{lang === 'tr' ? 'Sınırsız Açık' : 'Unlimited Open'}</div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-12 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'tr' ? 'Araç veya anahtar kelime ara (UUID, JSON, Base64, QR...)' : 'Search tools or keywords (UUID, JSON, Base64, QR...)'}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 py-3.5 pl-12 pr-4 text-sm text-slate-100 placeholder-slate-400 shadow-xl backdrop-blur-xl focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`${baseHref}/${tool.slug}`}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                    {iconMap[tool.icon] || <Wrench className="h-6 w-6" />}
                  </div>
                  {tool.badge && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title & Desc */}
                <h3 className="mt-5 text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {tool.name[lang]}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
                  {tool.shortDescription[lang]}
                </p>
              </div>

              {/* Bottom Endpoint & Action */}
              <div className="mt-6 space-y-3 border-t border-slate-800/80 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                    <span className="font-bold text-emerald-400">{tool.httpMethod}</span>
                    <span className="truncate max-w-[170px]">{tool.endpoint}</span>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
                    {lang === 'tr' ? 'Kullan' : 'Open'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="mt-16 text-center text-slate-400 py-12 border border-dashed border-slate-800 rounded-3xl">
            <Wrench className="h-10 w-10 mx-auto text-slate-500 mb-3" />
            <p className="text-sm font-semibold">{lang === 'tr' ? 'Aradığınız kriterlere uygun araç bulunamadı.' : 'No developer tools found matching your search.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
