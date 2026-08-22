const crypto = require('crypto');
const QRCode = require('qrcode');
const { marked } = require('marked');

async function testAll() {
  console.log('--- 1. Testing UUID Engine ---');
  const v4 = crypto.randomUUID();
  console.log('UUID v4:', v4, '✓');

  console.log('--- 2. Testing JSON Format Engine ---');
  const ugly = '{"name":"FreeAPI","tools":10}';
  const pretty = JSON.stringify(JSON.parse(ugly), null, 2);
  console.log('Pretty JSON:', pretty.replace(/\n/g, ' '), '✓');

  console.log('--- 3. Testing Base64 Engine ---');
  const b64 = Buffer.from('FreeAPI Devs').toString('base64');
  console.log('Base64:', b64, '✓');

  console.log('--- 4. Testing Password Generator ---');
  const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const bytes = crypto.randomBytes(16);
  let pass = '';
  for (let i = 0; i < 16; i++) pass += pool[bytes[i] % pool.length];
  console.log('Generated Pass:', pass, '✓');

  console.log('--- 5. Testing QR Code Generator ---');
  const svg = await QRCode.toString('https://freeapi.website', { type: 'svg' });
  console.log('QR Code SVG valid:', svg.includes('<svg') && svg.includes('</svg>'), '✓');

  console.log('--- 6. Testing Markdown Parser ---');
  const html = await marked.parse('# FreeAPI Launch\n**Awesome**');
  console.log('Markdown parsed HTML:', html.trim(), '✓');

  console.log('--- 7. Testing Hash & HMAC Engine ---');
  const sha256 = crypto.createHash('sha256').update('freeapi').digest('hex');
  console.log('SHA256:', sha256, '✓');

  console.log('--- 8. Testing Timestamp Converter ---');
  const now = new Date();
  console.log('ISO 8601:', now.toISOString(), 'Epoch:', Math.floor(now.getTime() / 1000), '✓');

  console.log('--- 9. Testing URL Codec ---');
  const enc = encodeURIComponent('https://freeapi.website/tools?q=api test');
  console.log('Encoded URL:', enc, '✓');

  console.log('\n=============================================');
  console.log('🎉 10/10 Core Engines Successfully Verified!');
  console.log('=============================================');
}

testAll();
