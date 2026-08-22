const fs = require('fs');

const BASE_URL = 'http://localhost:3005';

const tests = [
  {
    id: 1,
    name: 'UUID & GUID Generator',
    endpoint: '/api/v1/tools/uuid?version=v4&count=3&uppercase=false',
    method: 'GET',
    validate: (json) => json.status === 'success' && Array.isArray(json.items) && json.items.length === 3 && json.version === 'v4',
  },
  {
    id: 2,
    name: 'UUID v7 (Time-ordered)',
    endpoint: '/api/v1/tools/uuid?version=v7&count=2&uppercase=true',
    method: 'GET',
    validate: (json) => json.status === 'success' && json.version === 'v7' && json.items.length === 2 && json.items[0] === json.items[0].toUpperCase(),
  },
  {
    id: 3,
    name: 'JSON Formatter & Validator',
    endpoint: '/api/v1/tools/json-format',
    method: 'POST',
    body: { json: '{"service":"FreeAPI","tools":10,"active":true}', indent: 2, sortKeys: true },
    validate: (json) => json.status === 'success' && json.valid === true && json.formatted.includes('\n  "active": true'),
  },
  {
    id: 4,
    name: 'Base64 Codec (Encode)',
    endpoint: '/api/v1/tools/base64',
    method: 'POST',
    body: { text: 'FreeAPI Edge Engine 🚀', action: 'encode', urlSafe: false },
    validate: (json) => json.status === 'success' && json.action === 'encode' && json.result.length > 0,
  },
  {
    id: 5,
    name: 'Base64 Codec (Decode)',
    endpoint: '/api/v1/tools/base64',
    method: 'POST',
    body: { text: 'RnJlZUFQSSBFZGdlIEVuZ2luZSDwn5mp', action: 'decode', urlSafe: false },
    validate: (json) => json.status === 'success' && json.result.includes('FreeAPI Edge Engine'),
  },
  {
    id: 6,
    name: 'Secure Password Generator',
    endpoint: '/api/v1/tools/password?length=24&symbols=true&numbers=true&count=2',
    method: 'GET',
    validate: (json) => json.status === 'success' && json.passwords.length === 2 && json.passwords[0].length === 24 && json.security.entropyBits > 100,
  },
  {
    id: 7,
    name: 'QR Code Generator (SVG)',
    endpoint: '/api/v1/tools/qr-code?text=https://freeapi.website&format=svg&size=200',
    method: 'GET',
    isRawText: true,
    validate: (text) => text.includes('<svg') && text.includes('</svg>'),
  },
  {
    id: 8,
    name: 'QR Code Generator (JSON)',
    endpoint: '/api/v1/tools/qr-code?text=https://freeapi.website&format=json&size=200',
    method: 'GET',
    validate: (json) => json.status === 'success' && json.dataUrl.startsWith('data:image/png;base64,'),
  },
  {
    id: 9,
    name: 'Markdown to HTML Parser',
    endpoint: '/api/v1/tools/markdown-to-html',
    method: 'POST',
    body: { markdown: '# FreeAPI Launch\n- High performance\n- Zero latency\n\n```json\n{"ok":true}\n```' },
    validate: (json) => json.status === 'success' && json.html.includes('<h1>FreeAPI Launch</h1>') && json.stats.words > 0,
  },
  {
    id: 10,
    name: 'Hash & HMAC Generator',
    endpoint: '/api/v1/tools/hash',
    method: 'POST',
    body: { text: 'freeapi_security_check', secretKey: 'secret_123' },
    validate: (json) => json.status === 'success' && json.hashes.sha256.length === 64 && json.hmacs && json.hmacs.sha256.length === 64,
  },
  {
    id: 11,
    name: 'Lorem Ipsum Dummy Text',
    endpoint: '/api/v1/tools/lorem-ipsum?type=paragraphs&count=2&asHtml=true',
    method: 'GET',
    validate: (json) => json.status === 'success' && json.text.includes('<p>') && json.count === 2 && json.stats.words > 0,
  },
  {
    id: 12,
    name: 'Timestamp & Date Converter',
    endpoint: '/api/v1/tools/timestamp?value=1771771200',
    method: 'GET',
    validate: (json) => json.status === 'success' && json.timestampSeconds === 1771771200 && json.iso8601 === '2026-02-22T14:40:00.000Z',
  },
  {
    id: 13,
    name: 'URL Codec & Query Parser',
    endpoint: '/api/v1/tools/url-codec',
    method: 'POST',
    body: { url: 'https://freeapi.website/search?category=tools&sort=desc', action: 'parse' },
    validate: (json) => json.status === 'success' && json.parsed.host === 'freeapi.website' && json.parsed.searchParams.category === 'tools',
  },
];

async function runTests() {
  console.log('🚀 Başlatılıyor: 10/10 Geliştirici Aracı Canlı HTTP Test Paketi...\n');
  const results = [];

  for (const t of tests) {
    const start = Date.now();
    const url = BASE_URL + t.endpoint;
    try {
      const response = await fetch(url, {
        method: t.method,
        headers: t.body ? { 'Content-Type': 'application/json' } : {},
        body: t.body ? JSON.stringify(t.body) : undefined,
      });

      const latencyMs = Date.now() - start;
      const statusCode = response.status;
      let data = null;
      let isValid = false;

      if (t.isRawText) {
        data = await response.text();
        isValid = statusCode === 200 && t.validate(data);
      } else {
        data = await response.json();
        isValid = statusCode === 200 && t.validate(data);
      }

      results.push({
        id: t.id,
        name: t.name,
        endpoint: t.endpoint,
        method: t.method,
        statusCode,
        latencyMs,
        passed: isValid,
        sampleOutput: t.isRawText ? data.slice(0, 80) + '...' : data,
      });

      console.log(`[${isValid ? '✅ PASS' : '❌ FAIL'}] #${t.id} ${t.name} (${t.method} ${t.endpoint.split('?')[0]}) - ${statusCode} OK in ${latencyMs}ms`);
    } catch (err) {
      results.push({
        id: t.id,
        name: t.name,
        endpoint: t.endpoint,
        method: t.method,
        statusCode: 0,
        latencyMs: Date.now() - start,
        passed: false,
        error: err.message,
      });
      console.log(`[❌ ERROR] #${t.id} ${t.name}: ${err.message}`);
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  console.log(`\n======================================================`);
  console.log(`📊 TEST RAPORU: ${passedCount}/${results.length} BAŞARILI (%${Math.round((passedCount / results.length) * 100)})`);
  console.log(`======================================================\n`);

  fs.writeFileSync('./test_results.json', JSON.stringify(results, null, 2), 'utf8');
}

runTests();
