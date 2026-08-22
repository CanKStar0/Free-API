import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'database', 'datasets');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

console.log('📋 DATASET DERİNLİK & ALAN SAYISI ANALİZİ:\n');

files.forEach(f => {
  const p = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  const sample = data.data_json?.[0] || {};
  const keys = Object.keys(sample);
  const sizeMb = (fs.statSync(p).size / (1024 * 1024)).toFixed(2);
  console.log(`🔹 [${data.slug}]`);
  console.log(`   - Boyut: ${sizeMb} MB | Kayıt Sayısı: ${data.record_count.toLocaleString()}`);
  console.log(`   - Obje Başına Alan Sayısı: ${keys.length} özellik`);
  console.log(`   - Örnek Alanlar: ${keys.join(', ')}\n`);
});
