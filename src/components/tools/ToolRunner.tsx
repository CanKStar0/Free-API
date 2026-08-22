'use client';

import React, { useState, useEffect } from 'react';
import { DeveloperTool } from '@/data/tools';
import {
  Copy,
  Check,
  RefreshCw,
  Download,
  Sparkles,
  Shield,
  Clock,
  ArrowRightLeft,
  AlertCircle,
  FileCode,
  Eye,
  Hash,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface ToolRunnerProps {
  tool: DeveloperTool;
  lang: 'tr' | 'en';
}

export default function ToolRunner({ tool, lang }: ToolRunnerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string = 'default') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- 1. UUID GENERATOR STATE ---
  const [uuidVersion, setUuidVersion] = useState<'v4' | 'v7'>('v4');
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidUpper, setUuidUpper] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      let id = '';
      if (uuidVersion === 'v7') {
        const value = new Uint8Array(16);
        crypto.getRandomValues(value);
        const timestamp = Date.now();
        value[0] = (timestamp / 0x10000000000) & 0xff;
        value[1] = (timestamp / 0x100000000) & 0xff;
        value[2] = (timestamp / 0x1000000) & 0xff;
        value[3] = (timestamp / 0x10000) & 0xff;
        value[4] = (timestamp / 0x100) & 0xff;
        value[5] = timestamp & 0xff;
        value[6] = (value[6] & 0x0f) | 0x70;
        value[8] = (value[8] & 0x3f) | 0x80;
        const hex = Array.from(value, (b) => b.toString(16).padStart(2, '0')).join('');
        id = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
      } else {
        id = crypto.randomUUID();
      }
      if (uuidUpper) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  };

  // --- 2. JSON FORMATTER STATE ---
  const [jsonInput, setJsonInput] = useState<string>(tool.defaultInput || '{\n  "name": "FreeAPI",\n  "status": "online"\n}');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const formatJson = (indent: number = 2, sortKeys: boolean = false) => {
    try {
      let parsed = JSON.parse(jsonInput);
      if (sortKeys) {
        const sortObj = (obj: any): any => {
          if (Array.isArray(obj)) return obj.map(sortObj);
          if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj)
              .sort()
              .reduce((res: any, k) => {
                res[k] = sortObj(obj[k]);
                return res;
              }, {});
          }
          return obj;
        };
        parsed = sortObj(parsed);
      }
      const formatted = indent === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
      setJsonOutput(formatted);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  // --- 3. BASE64 STATE ---
  const [b64Input, setB64Input] = useState<string>('FreeAPI Universal Developer Gateway 🚀');
  const [b64Action, setB64Action] = useState<'encode' | 'decode'>('encode');
  const [b64UrlSafe, setB64UrlSafe] = useState<boolean>(false);
  const [b64Output, setB64Output] = useState<string>('');

  useEffect(() => {
    if (tool.id === 'base64-codec') {
      try {
        if (b64Action === 'encode') {
          let encoded = btoa(unescape(encodeURIComponent(b64Input)));
          if (b64UrlSafe) {
            encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          }
          setB64Output(encoded);
        } else {
          let standard = b64Input;
          if (b64UrlSafe || standard.includes('-') || standard.includes('_')) {
            standard = standard.replace(/-/g, '+').replace(/_/g, '/');
            while (standard.length % 4) standard += '=';
          }
          setB64Output(decodeURIComponent(escape(atob(standard))));
        }
      } catch (err) {
        setB64Output(lang === 'tr' ? 'Geçersiz Base64 verisi' : 'Invalid Base64 string');
      }
    }
  }, [b64Input, b64Action, b64UrlSafe, tool.id, lang]);

  // --- 4. PASSWORD STATE ---
  const [passLength, setPassLength] = useState<number>(18);
  const [passNumbers, setPassNumbers] = useState<boolean>(true);
  const [passSymbols, setPassSymbols] = useState<boolean>(true);
  const [passExcludeSimilar, setPassExcludeSimilar] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [passEntropy, setPassEntropy] = useState<{ score: number; strength: string }>({ score: 0, strength: 'Strong' });

  const generatePass = () => {
    let pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (passNumbers) pool += '0123456789';
    if (passSymbols) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (passExcludeSimilar) pool = pool.replace(/[il1Lo0O]/g, '');
    if (!pool) pool = 'abcdefghijklmnopqrstuvwxyz';

    const array = new Uint32Array(passLength);
    crypto.getRandomValues(array);
    let pass = '';
    for (let i = 0; i < passLength; i++) {
      pass += pool[array[i] % pool.length];
    }
    setGeneratedPassword(pass);

    const entropyBits = Math.round(passLength * Math.log2(pool.length) * 10) / 10;
    let strength = 'Weak';
    if (entropyBits >= 110) strength = 'Very Strong';
    else if (entropyBits >= 75) strength = 'Strong';
    else if (entropyBits >= 45) strength = 'Moderate';
    setPassEntropy({ score: entropyBits, strength });
  };

  // --- 5. QR CODE STATE ---
  const [qrText, setQrText] = useState<string>('https://freeapi.website');
  const [qrColor, setQrColor] = useState<string>('#000000');
  const [qrBg, setQrBg] = useState<string>('#ffffff');
  const [qrSize, setQrSize] = useState<number>(256);
  const [qrSvg, setQrSvg] = useState<string>('');

  const updateQr = async () => {
    try {
      const res = await fetch(
        `/api/v1/tools/qr-code?text=${encodeURIComponent(qrText)}&color=${encodeURIComponent(qrColor)}&bgColor=${encodeURIComponent(qrBg)}&size=${qrSize}&format=json`
      );
      const json = await res.json();
      if (json.svg) setQrSvg(json.svg);
    } catch (e) {
      console.error(e);
    }
  };

  // --- 6. MARKDOWN STATE ---
  const [mdInput, setMdInput] = useState<string>(
    tool.defaultInput || '# FreeAPI Playground\n\n- Zero latency\n- Edge computing\n\n```js\nconsole.log("ready");\n```'
  );
  const [mdHtml, setMdHtml] = useState<string>('');
  const [mdActiveTab, setMdActiveTab] = useState<'preview' | 'html'>('preview');

  const updateMd = async () => {
    try {
      const res = await fetch('/api/v1/tools/markdown-to-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: mdInput }),
      });
      const data = await res.json();
      if (data.html) setMdHtml(data.html);
    } catch (e) {
      console.error(e);
    }
  };

  // --- 7. HASH STATE ---
  const [hashInput, setHashInput] = useState<string>('FreeAPI Universal Gateway');
  const [hashSecret, setHashSecret] = useState<string>('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const updateHashes = async () => {
    try {
      const res = await fetch('/api/v1/tools/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: hashInput, secretKey: hashSecret || undefined }),
      });
      const data = await res.json();
      if (data.hashes) setHashes(data.hashes);
    } catch (e) {
      console.error(e);
    }
  };

  // --- 8. LOREM IPSUM STATE ---
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [loremCount, setLoremCount] = useState<number>(3);
  const [loremHtml, setLoremHtml] = useState<boolean>(false);
  const [loremResult, setLoremResult] = useState<string>('');

  const generateLorem = async () => {
    try {
      const res = await fetch(`/api/v1/tools/lorem-ipsum?type=${loremType}&count=${loremCount}&asHtml=${loremHtml}`);
      const data = await res.json();
      if (data.text) setLoremResult(data.text);
    } catch (e) {
      console.error(e);
    }
  };

  // --- 9. TIMESTAMP STATE ---
  const [liveEpoch, setLiveEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState<string>('');
  const [tsDetails, setTsDetails] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setLiveEpoch(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTimestamp = async () => {
    try {
      const res = await fetch(`/api/v1/tools/timestamp?value=${encodeURIComponent(tsInput || String(liveEpoch))}`);
      const data = await res.json();
      setTsDetails(data);
    } catch (e) {
      console.error(e);
    }
  };

  // --- 10. URL CODEC STATE ---
  const [urlInput, setUrlInput] = useState<string>('https://freeapi.website/search?q=developer tools&category=tools');
  const [urlAction, setUrlAction] = useState<'encode' | 'decode' | 'parse'>('parse');
  const [urlResult, setUrlResult] = useState<any>(null);

  const processUrl = async () => {
    try {
      const res = await fetch('/api/v1/tools/url-codec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput, action: urlAction }),
      });
      const data = await res.json();
      setUrlResult(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Initial runs
  useEffect(() => {
    if (tool.id === 'uuid-generator') generateUuids();
    if (tool.id === 'json-formatter') formatJson(2);
    if (tool.id === 'password-generator') generatePass();
    if (tool.id === 'qr-code-generator') updateQr();
    if (tool.id === 'markdown-to-html') updateMd();
    if (tool.id === 'hash-generator') updateHashes();
    if (tool.id === 'lorem-ipsum-generator') generateLorem();
    if (tool.id === 'timestamp-converter') convertTimestamp();
    if (tool.id === 'url-codec') processUrl();
  }, [tool.id]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      {/* 1. UUID GENERATOR */}
      {tool.id === 'uuid-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {lang === 'tr' ? 'Versiyon' : 'Version'}
              </label>
              <select
                value={uuidVersion}
                onChange={(e) => setUuidVersion(e.target.value as any)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="v4">UUID v4 ({lang === 'tr' ? 'Rastgele' : 'Random'})</option>
                <option value="v7">UUID v7 ({lang === 'tr' ? 'Zaman Sıralı' : 'Time-ordered'})</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {lang === 'tr' ? 'Adet' : 'Quantity'}: {uuidCount}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={uuidCount}
                onChange={(e) => setUuidCount(parseInt(e.target.value, 10))}
                className="mt-3.5 w-full accent-emerald-500"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="relative flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={uuidUpper}
                  onChange={(e) => setUuidUpper(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                {lang === 'tr' ? 'Büyük Harf (UPPERCASE)' : 'Uppercase Format'}
              </label>
            </div>
          </div>

          <button
            onClick={generateUuids}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <RefreshCw className="h-4 w-4" />
            {lang === 'tr' ? 'Yeni UUID\'ler Üret' : 'Generate New UUIDs'}
          </button>

          <div className="space-y-2">
            {uuids.map((id, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 font-mono text-sm text-emerald-400"
              >
                <span className="truncate">{id}</span>
                <button
                  onClick={() => copyToClipboard(id, `uuid-${index}`)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {copiedKey === `uuid-${index}` ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. JSON FORMATTER */}
      {tool.id === 'json-formatter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between pb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {lang === 'tr' ? 'Girdi (JSON)' : 'Input (JSON)'}
                </label>
                <button
                  onClick={() => setJsonInput('{"site":"freeapi.website","tools":10,"fast":true}')}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  {lang === 'tr' ? 'Örnek Yükle' : 'Load Sample'}
                </button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={12}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder='{"key": "value"}'
              />
            </div>
            <div>
              <div className="flex items-center justify-between pb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {lang === 'tr' ? 'Formatlanmış Çıktı' : 'Formatted Output'}
                </label>
                {jsonOutput && (
                  <button
                    onClick={() => copyToClipboard(jsonOutput, 'json-out')}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                  >
                    {copiedKey === 'json-out' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {lang === 'tr' ? 'Kopyala' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={jsonError ? `HATA: ${jsonError}` : jsonOutput}
                rows={12}
                className={`w-full rounded-2xl border ${
                  jsonError ? 'border-rose-500/50 bg-rose-950/20 text-rose-300' : 'border-slate-800 bg-slate-950/90 text-emerald-300'
                } p-4 font-mono text-xs focus:outline-none`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => formatJson(2)}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
            >
              Prettify (2 {lang === 'tr' ? 'Boşluk' : 'Spaces'})
            </button>
            <button
              onClick={() => formatJson(4)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700"
            >
              Prettify (4 {lang === 'tr' ? 'Boşluk' : 'Spaces'})
            </button>
            <button
              onClick={() => formatJson(0)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700"
            >
              Minify ({lang === 'tr' ? 'Sıkıştır' : 'Compact'})
            </button>
            <button
              onClick={() => formatJson(2, true)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700"
            >
              {lang === 'tr' ? 'Anahtarları Sırala (Sort)' : 'Sort Keys'}
            </button>
          </div>
        </div>
      )}

      {/* 3. BASE64 CODEC */}
      {tool.id === 'base64-codec' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <button
              onClick={() => setB64Action('encode')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                b64Action === 'encode' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Encode (Metin ➔ Base64)
            </button>
            <button
              onClick={() => setB64Action('decode')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                b64Action === 'decode' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Decode (Base64 ➔ Metin)
            </button>
            <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={b64UrlSafe}
                onChange={(e) => setB64UrlSafe(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500"
              />
              URL-Safe
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {b64Action === 'encode' ? (lang === 'tr' ? 'Düz Metin' : 'Plain Text') : 'Base64 String'}
              </label>
              <textarea
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                rows={8}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between pb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {lang === 'tr' ? 'Sonuç' : 'Result'}
                </label>
                <button
                  onClick={() => copyToClipboard(b64Output, 'b64-res')}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                >
                  {copiedKey === 'b64-res' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {lang === 'tr' ? 'Kopyala' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                value={b64Output}
                rows={8}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs text-emerald-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. PASSWORD GENERATOR */}
      {tool.id === 'password-generator' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-xl md:text-2xl font-bold tracking-wider text-emerald-400 break-all select-all">
                {generatedPassword || 'Generating...'}
              </span>
              <button
                onClick={() => copyToClipboard(generatedPassword, 'pass-out')}
                className="rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-md"
              >
                {copiedKey === 'pass-out' ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-slate-400">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                {lang === 'tr' ? 'Güç' : 'Strength'}:{' '}
                <strong className="text-emerald-400">{passEntropy.strength}</strong>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                Entropy: <strong className="text-slate-200">{passEntropy.score} bits</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {lang === 'tr' ? 'Uzunluk' : 'Length'}: {passLength}
              </label>
              <input
                type="range"
                min="8"
                max="48"
                value={passLength}
                onChange={(e) => setPassLength(parseInt(e.target.value, 10))}
                className="mt-3 w-full accent-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={passNumbers}
                  onChange={(e) => setPassNumbers(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500"
                />
                {lang === 'tr' ? 'Rakamlar (0-9)' : 'Numbers (0-9)'}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={passSymbols}
                  onChange={(e) => setPassSymbols(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500"
                />
                {lang === 'tr' ? 'Semboller (!@#$)' : 'Symbols (!@#$)'}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={passExcludeSimilar}
                  onChange={(e) => setPassExcludeSimilar(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500"
                />
                {lang === 'tr' ? 'Benzerleri Filtrele (0/O/1/l)' : 'Exclude Similar (0/O/1/l)'}
              </label>
            </div>
          </div>

          <button
            onClick={generatePass}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
          >
            <RefreshCw className="h-4 w-4" />
            {lang === 'tr' ? 'Yeni Şifre Üret' : 'Generate New Password'}
          </button>
        </div>
      )}

      {/* 5. QR CODE GENERATOR */}
      {tool.id === 'qr-code-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {lang === 'tr' ? 'QR İçeriği (URL veya Metin)' : 'QR Content (URL or Text)'}
                </label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {lang === 'tr' ? 'Ön Plan Rengi' : 'Foreground Color'}
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {lang === 'tr' ? 'Arka Plan Rengi' : 'Background Color'}
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      type="color"
                      value={qrBg}
                      onChange={(e) => setQrBg(e.target.value)}
                      className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={qrBg}
                      onChange={(e) => setQrBg(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {lang === 'tr' ? 'Boyut' : 'Size'}: {qrSize}px
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={qrSize}
                    onChange={(e) => setQrSize(parseInt(e.target.value, 10))}
                    className="mt-3.5 w-full accent-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={updateQr}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
              >
                <RefreshCw className="h-4 w-4" />
                {lang === 'tr' ? 'QR Kodu Yenile' : 'Update QR Code'}
              </button>
            </div>

            {/* QR Preview Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center">
              {qrSvg ? (
                <div
                  className="rounded-xl p-3 shadow-inner bg-white"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-slate-900 text-slate-500">
                  Loading...
                </div>
              )}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={`/api/v1/tools/qr-code?text=${encodeURIComponent(qrText)}&color=${encodeURIComponent(qrColor)}&bgColor=${encodeURIComponent(qrBg)}&size=${qrSize}&format=svg`}
                  download="qrcode.svg"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  <Download className="h-3.5 w-3.5" /> SVG {lang === 'tr' ? 'İndir' : 'Download'}
                </a>
                <a
                  href={`/api/v1/tools/qr-code?text=${encodeURIComponent(qrText)}&color=${encodeURIComponent(qrColor)}&bgColor=${encodeURIComponent(qrBg)}&size=${qrSize}&format=png`}
                  download="qrcode.png"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  <Download className="h-3.5 w-3.5" /> PNG {lang === 'tr' ? 'İndir' : 'Download'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MARKDOWN TO HTML */}
      {tool.id === 'markdown-to-html' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between pb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Markdown (GFM)
                </label>
                <button onClick={updateMd} className="flex items-center gap-1 text-xs text-emerald-400 hover:underline">
                  <RefreshCw className="h-3 w-3" /> {lang === 'tr' ? 'Derle' : 'Compile'}
                </button>
              </div>
              <textarea
                value={mdInput}
                onChange={(e) => setMdInput(e.target.value)}
                onBlur={updateMd}
                rows={12}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMdActiveTab('preview')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      mdActiveTab === 'preview' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Eye className="inline h-3 w-3 mr-1" /> {lang === 'tr' ? 'Canlı Önizleme' : 'Preview'}
                  </button>
                  <button
                    onClick={() => setMdActiveTab('html')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      mdActiveTab === 'html' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <FileCode className="inline h-3 w-3 mr-1" /> HTML {lang === 'tr' ? 'Kodu' : 'Code'}
                  </button>
                </div>
                <button
                  onClick={() => copyToClipboard(mdHtml, 'md-html')}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                >
                  {copiedKey === 'md-html' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {lang === 'tr' ? 'HTML Kopyala' : 'Copy HTML'}
                </button>
              </div>

              {mdActiveTab === 'preview' ? (
                <div
                  className="prose prose-invert max-w-none rounded-2xl border border-slate-800 bg-slate-950/90 p-5 text-slate-200 text-xs overflow-y-auto max-h-[300px]"
                  dangerouslySetInnerHTML={{ __html: mdHtml }}
                />
              ) : (
                <textarea
                  readOnly
                  value={mdHtml}
                  rows={12}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs text-emerald-300 focus:outline-none"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. HASH GENERATOR */}
      {tool.id === 'hash-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {lang === 'tr' ? 'Hesaplanacak Metin' : 'Input Text to Hash'}
              </label>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                onBlur={updateHashes}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                HMAC Secret Key ({lang === 'tr' ? 'Opsiyonel' : 'Optional'})
              </label>
              <input
                type="text"
                value={hashSecret}
                onChange={(e) => setHashSecret(e.target.value)}
                onBlur={updateHashes}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                placeholder="secret-key"
              />
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(hashes).map(([alg, val]) => (
              <div key={alg} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between pb-1 text-xs">
                  <span className="font-mono font-bold uppercase text-emerald-400">{alg}</span>
                  <button
                    onClick={() => copyToClipboard(val, `hash-${alg}`)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === `hash-${alg}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-300 break-all select-all">{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. LOREM IPSUM */}
      {tool.id === 'lorem-ipsum-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {lang === 'tr' ? 'Tip' : 'Type'}
              </label>
              <select
                value={loremType}
                onChange={(e) => setLoremType(e.target.value as any)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="paragraphs">{lang === 'tr' ? 'Paragraf' : 'Paragraphs'}</option>
                <option value="sentences">{lang === 'tr' ? 'Cümle' : 'Sentences'}</option>
                <option value="words">{lang === 'tr' ? 'Kelime' : 'Words'}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {lang === 'tr' ? 'Adet' : 'Count'}: {loremCount}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={loremCount}
                onChange={(e) => setLoremCount(parseInt(e.target.value, 10))}
                className="mt-3.5 w-full accent-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={loremHtml}
                  onChange={(e) => setLoremHtml(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500"
                />
                HTML Tags (&lt;p&gt;, &lt;li&gt;)
              </label>
            </div>
            <div className="pt-5">
              <button
                onClick={generateLorem}
                className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600"
              >
                {lang === 'tr' ? 'Metin Üret' : 'Generate Text'}
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => copyToClipboard(loremResult, 'lorem-res')}
              className="absolute right-4 top-4 flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
            >
              {copiedKey === 'lorem-res' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {lang === 'tr' ? 'Kopyala' : 'Copy'}
            </button>
            <textarea
              readOnly
              value={loremResult}
              rows={8}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 p-5 font-mono text-xs leading-relaxed text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 9. TIMESTAMP CONVERTER */}
      {tool.id === 'timestamp-converter' && (
        <div className="space-y-6">
          {/* Live Clock Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-emerald-400 animate-pulse" />
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  {lang === 'tr' ? 'Canlı Unix Epoch Saati' : 'Live Unix Epoch Clock'}
                </span>
                <div className="font-mono text-2xl font-black text-white">{liveEpoch}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(String(liveEpoch), 'live-epoch')}
              className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
            >
              {copiedKey === 'live-epoch' ? (
                <Check className="h-4 w-4 inline mr-1" />
              ) : (
                <Copy className="h-4 w-4 inline mr-1" />
              )}
              {lang === 'tr' ? 'Şu Anı Kopyala' : 'Copy Current Timestamp'}
            </button>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              placeholder={lang === 'tr' ? 'Unix Epoch (örn: 1771771200) veya ISO Tarih (2026-02-22)' : 'Unix Epoch or ISO string'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={convertTimestamp}
              className="rounded-xl bg-emerald-500 px-6 py-2.5 font-semibold text-white hover:bg-emerald-600"
            >
              {lang === 'tr' ? 'Dönüştür' : 'Convert'}
            </button>
          </div>

          {tsDetails && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-xs text-slate-400 uppercase">ISO 8601</span>
                <div className="mt-1 font-mono text-sm text-emerald-400 select-all">{tsDetails.iso8601}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-xs text-slate-400 uppercase">GMT / UTC</span>
                <div className="mt-1 font-mono text-sm text-slate-200 select-all">{tsDetails.utcString}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-xs text-slate-400 uppercase">{lang === 'tr' ? 'Yerel Saat (TR)' : 'Local Time'}</span>
                <div className="mt-1 font-mono text-sm text-slate-200 select-all">{tsDetails.localString}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-xs text-slate-400 uppercase">{lang === 'tr' ? 'Göreli Zaman' : 'Relative Time'}</span>
                <div className="mt-1 font-mono text-sm text-emerald-300">{tsDetails.relativeTime}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-xs text-slate-400 uppercase">{lang === 'tr' ? 'Haftanın Günü' : 'Day of Week'}</span>
                <div className="mt-1 font-mono text-sm text-slate-200">{tsDetails.dayOfWeek}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-xs text-slate-400 uppercase">Milliseconds</span>
                <div className="mt-1 font-mono text-sm text-slate-200">{tsDetails.timestampMilliseconds}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. URL CODEC */}
      {tool.id === 'url-codec' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <button
              onClick={() => setUrlAction('parse')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                urlAction === 'parse' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Parse (Ayrıştır)
            </button>
            <button
              onClick={() => setUrlAction('encode')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                urlAction === 'encode' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Encode (Kodla)
            </button>
            <button
              onClick={() => setUrlAction('decode')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                urlAction === 'decode' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Decode (Çöz)
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {lang === 'tr' ? 'URL / Metin Girdisi' : 'URL / Text Input'}
              </label>
              <textarea
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={processUrl}
              className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-emerald-600"
            >
              {lang === 'tr' ? 'İşlemi Çalıştır' : 'Run Action'}
            </button>

            {urlResult && (
              <div className="space-y-4 pt-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between pb-1 text-xs">
                    <span className="font-semibold text-slate-400">{lang === 'tr' ? 'Dönüştürülmüş Sonuç' : 'Result'}</span>
                    <button
                      onClick={() => copyToClipboard(urlResult.result, 'url-res')}
                      className="text-emerald-400 hover:underline"
                    >
                      {copiedKey === 'url-res' ? 'Kopyalandı' : 'Kopyala'}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-emerald-300 break-all">{urlResult.result}</div>
                </div>

                {urlResult.parsed && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                    <span className="font-bold text-slate-300 uppercase">{lang === 'tr' ? 'URL Bileşenleri' : 'URL Breakdown'}:</span>
                    <div className="mt-2 space-y-1 text-slate-400">
                      <div><strong className="text-slate-300">Protocol:</strong> {urlResult.parsed.protocol}</div>
                      <div><strong className="text-slate-300">Host:</strong> {urlResult.parsed.host}</div>
                      <div><strong className="text-slate-300">Pathname:</strong> {urlResult.parsed.pathname}</div>
                      {urlResult.parsed.searchParams && (
                        <div className="pt-2">
                          <strong className="text-emerald-400">Query Parameters:</strong>
                          <pre className="mt-1 rounded bg-slate-900 p-2 text-slate-200">
                            {JSON.stringify(urlResult.parsed.searchParams, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
