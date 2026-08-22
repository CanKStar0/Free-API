'use client';

import React from 'react';
import Link from 'next/link';
import { DeveloperTool, DEVELOPER_TOOLS } from '@/data/tools';
import ToolRunner from './ToolRunner';
import ToolApiSnippets from './ToolApiSnippets';
import {
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Wrench,
  Layers,
  ExternalLink,
  Zap,
  Shield,
  ArrowLeft,
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
} from 'lucide-react';

interface ToolDetailClientProps {
  tool: DeveloperTool;
  lang: 'tr' | 'en';
}

const iconMap: Record<string, React.ReactNode> = {
  Fingerprint: <Fingerprint className="h-8 w-8" />,
  Braces: <Braces className="h-8 w-8" />,
  Binary: <Binary className="h-8 w-8" />,
  KeyRound: <KeyRound className="h-8 w-8" />,
  QrCode: <QrCode className="h-8 w-8" />,
  FileCode2: <FileCode2 className="h-8 w-8" />,
  ShieldCheck: <ShieldCheck className="h-8 w-8" />,
  Type: <Type className="h-8 w-8" />,
  Clock: <Clock className="h-8 w-8" />,
  Link2: <Link2 className="h-8 w-8" />,
};

export default function ToolDetailClient({ tool, lang }: ToolDetailClientProps) {
  const baseToolsHref = lang === 'en' ? '/en/tools' : '/tools';
  const homeHref = lang === 'en' ? '/en' : '/';

  const otherTools = DEVELOPER_TOOLS.filter((t) => t.id !== tool.id).slice(0, 4);

  // Schema.org SoftwareApplication JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name[lang],
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    description: tool.fullDescription[lang],
    url: `https://freeapi.website${baseToolsHref}/${tool.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[600px] rounded-full bg-teal-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href={homeHref} className="hover:text-slate-200 transition-colors">
            {lang === 'tr' ? 'Ana Sayfa' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={baseToolsHref} className="hover:text-slate-200 transition-colors">
            {lang === 'tr' ? 'Geliştirici Araçları' : 'Dev Tools'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-emerald-400 font-medium">{tool.name[lang]}</span>
        </nav>

        {/* Tool Header */}
        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              {iconMap[tool.icon] || <Wrench className="h-8 w-8" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {tool.name[lang]}
                </h1>
                {tool.badge && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
                {tool.fullDescription[lang]}
              </p>
            </div>
          </div>

          <Link
            href={baseToolsHref}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur hover:bg-slate-800 hover:text-white transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {lang === 'tr' ? 'Tüm Araçlar' : 'All Tools'}
          </Link>
        </div>

        {/* Interactive Tool Runner Component */}
        <div className="mt-8">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              {lang === 'tr' ? 'Canlı Araç Konsolu' : 'Interactive Tool Console'}
            </h2>
            <span className="text-xs text-slate-400">
              {lang === 'tr' ? 'Tarayıcıda anında çalışır' : 'Runs instantly in browser'}
            </span>
          </div>
          <ToolRunner tool={tool} lang={lang} />
        </div>

        {/* API Integration Snippets Box */}
        <ToolApiSnippets tool={tool} lang={lang} />

        {/* Features & RFC Highlights */}
        <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            {lang === 'tr' ? 'Öne Çıkan Standartlar & Özellikler' : 'Key Standards & Highlights'}
          </h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.features[lang].map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                <span className="text-xs text-slate-300 leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other Tools Recommendations */}
        <div className="mt-16 border-t border-slate-800 pt-10">
          <h3 className="text-lg font-bold text-white">
            {lang === 'tr' ? 'Diğer Geliştirici Araçları' : 'Explore Other Tools'}
          </h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherTools.map((ot) => (
              <Link
                key={ot.id}
                href={`${baseToolsHref}/${ot.slug}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-900/90"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    {iconMap[ot.icon] || <Wrench className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 truncate">
                      {ot.name[lang]}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {ot.shortDescription[lang]}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
