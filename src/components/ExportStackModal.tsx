'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, FileCode, Terminal, Code2, Layers, Bot } from 'lucide-react';
import { useStack } from '@/context/StackContext';
import { useLanguage } from '@/context/LanguageContext';

export function ExportStackModal() {
  const { isExportOpen, setIsExportOpen, selectedApis } = useStack();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'env' | 'nextjs' | 'curl' | 'json' | 'ai'>('env');
  const [copied, setCopied] = useState(false);

  // 1. Generate .env.example
  const generateEnv = () => {
    const lines = [
      '# =========================================================================',
      '# FreeAPI Stack - Environment Configuration',
      '# Generated on https://freeapi.website',
      '# =========================================================================',
      '',
    ];

    selectedApis.forEach((api) => {
      const cleanKey = api.name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      lines.push(`# ${api.name} (${api.categoryTitle})`);
      lines.push(`${cleanKey}_API_BASE_URL="${api.url}"`);
      if (!api.isNoAuth) {
        lines.push(`${cleanKey}_API_KEY="your_${cleanKey.toLowerCase()}_api_key_here"`);
      }
      lines.push('');
    });

    return lines.join('\n');
  };

  // 2. Generate Next.js 15 TypeScript api-client.ts
  const generateNextjsClient = () => {
    const lines = [
      '/**',
      ' * FreeAPI Stack Client Boilerplate (TypeScript / Next.js 15)',
      ' * Generated for your selected API combination.',
      ' */',
      '',
    ];

    selectedApis.forEach((api) => {
      const funcName = 'fetch' + api.name.replace(/[^a-zA-Z0-9]/g, '');
      const envKey = api.name.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_API_BASE_URL';

      lines.push(`// ${api.name} - ${api.description}`);
      lines.push(`export async function ${funcName}(endpoint = '', params: Record<string, string> = {}) {`);
      lines.push(`  const baseUrl = process.env.${envKey} || '${api.url}';`);
      lines.push(`  const query = new URLSearchParams(params).toString();`);
      lines.push(`  const url = \`\${baseUrl}\${endpoint}\${query ? '?' + query : ''}\`;`);
      lines.push('');
      lines.push(`  const res = await fetch(url, {`);
      lines.push(`    headers: {`);
      lines.push(`      'Accept': 'application/json',`);
      lines.push(`    },`);
      lines.push(`    next: { revalidate: 3600 }, // ISR caching`);
      lines.push(`  });`);
      lines.push('');
      lines.push(`  if (!res.ok) {`);
      lines.push(`    throw new Error(\`Failed to fetch from ${api.name}: \${res.statusText}\`);`);
      lines.push(`  }`);
      lines.push(`  return res.json();`);
      lines.push(`}`);
      lines.push('');
    });

    return lines.join('\n');
  };

  // 3. Generate cURL chain
  const generateCurl = () => {
    const lines = [
      '#!/usr/bin/env bash',
      '# FreeAPI Stack - cURL Health & Response Tester',
      'echo "🚀 Testing your API Stack..."',
      '',
    ];

    selectedApis.forEach((api) => {
      lines.push(`echo "👉 Testing ${api.name}..."`);
      lines.push(`curl -i -X GET "${api.url}" \\`);
      lines.push(`  -H "Accept: application/json"`);
      lines.push(`echo "\n----------------------------------------\n"`);
      lines.push('');
    });

    return lines.join('\n');
  };

  // 4. Generate JSON Collection
  const generateJson = () => {
    const data = {
      stackName: 'My Developer API Stack',
      generatedAt: new Date().toISOString(),
      apis: selectedApis.map((api) => ({
        name: api.name,
        slug: api.slug,
        category: api.categoryTitle,
        baseUrl: api.url,
        rateLimit: api.rateLimit,
        isNoAuth: Boolean(api.isNoAuth),
      })),
    };
    return JSON.stringify(data, null, 2);
  };

  // 5. Generate Cursor / Claude / ChatGPT AI Prompt
  const generateAiPrompt = () => {
    const apiList = selectedApis
      .map(
        (api, idx) =>
          `${idx + 1}. ${api.name} (${api.categoryTitle})\n   - Base URL: ${api.url}\n   - Description: ${api.description}\n   - Rate Limit: ${api.rateLimit}\n   - Auth: ${api.isNoAuth ? 'Public / No Key' : 'API Key Required'}`
      )
      .join('\n\n');

    return `You are an expert Full-Stack TypeScript Architect.

I am building a modern Next.js 15 (App Router) application that integrates the following verified public APIs from FreeAPI Directory (https://freeapi.website):

${apiList}

TASK INSTRUCTIONS:
1. Create a production-ready, strictly-typed service layer for each API under \`src/lib/services/\`.
2. Define TypeScript interfaces for requests and responses.
3. Write resilient fetch functions with error handling, status code checks, and Next.js \`revalidate\` ISR caching.
4. Provide a sample React Server Component or Route Handler that orchestrates data fetching from these endpoints.
5. Create the matching \`.env.local\` environment variable definitions.`;
  };

  const getCodeContent = () => {
    switch (activeTab) {
      case 'env':
        return generateEnv();
      case 'nextjs':
        return generateNextjsClient();
      case 'curl':
        return generateCurl();
      case 'json':
        return generateJson();
      case 'ai':
        return generateAiPrompt();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadEnv = () => {
    const element = document.createElement('a');
    const file = new Blob([generateEnv()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '.env.example';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isExportOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExportOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-stone-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl z-10 flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200/80 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100 font-jakarta">
                  {t.stack.exportModalTitle}
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  {selectedApis.length} {t.stack.floatingBarText} • {t.stack.exportModalDesc}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExportOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 pt-3 flex items-center gap-2 border-b border-stone-200/60 dark:border-zinc-800/60 bg-stone-50/50 dark:bg-zinc-900/30">
            <button
              type="button"
              onClick={() => setActiveTab('env')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'env'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>{t.stack.tabEnv}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('nextjs')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'nextjs'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{t.stack.tabNextjs}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curl')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'curl'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>{t.stack.tabCurl}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'json'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>{t.stack.tabJson}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'ai'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>{t.stack.tabAiPrompt}</span>
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="relative rounded-2xl bg-stone-900 dark:bg-zinc-950 p-4 border border-stone-800 dark:border-zinc-800 shadow-inner">
              <pre className="text-xs font-mono text-stone-200 dark:text-zinc-300 overflow-x-auto leading-relaxed">
                <code>{getCodeContent()}</code>
              </pre>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-stone-200/80 dark:border-zinc-800 bg-stone-50/70 dark:bg-zinc-900/50 flex items-center justify-between">
            {activeTab === 'env' ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleDownloadEnv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.stack.downloadEnv}</span>
              </motion.button>
            ) : <div />}

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.stack.copied : t.stack.copyCode}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
