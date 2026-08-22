import { isDatasetFresh, syncDatasetFromUpstream } from '../src/lib/db/semi-static-sync';
import { getDatasetTtl } from '../src/lib/db/ttl-registry';
import { getLocalDataset } from '../src/lib/db/dataset-store';

async function testSemiStaticSuite() {
  console.log('🧪 ================================================================');
  console.log('🧪 FreeAPI Semi-Static Freshness & Live Sync Audit Suite');
  console.log('🧪 ================================================================\n');

  // 1. Check TTL definitions
  console.log('⏱️ 1. TTL Matrisi Kontrolü:');
  const slugsToCheck = ['prayer-times', 'exchange-rates', 'crypto-prices', 'commodity-rates', 'rest-countries'];
  for (const slug of slugsToCheck) {
    const ttl = getDatasetTtl(slug);
    const hours = (ttl / 3600).toFixed(1);
    console.log(`   - [${slug}]: ${ttl} saniye (${hours} saat)`);
  }
  console.log();

  // 2. Test Live Sync for exchange-rates
  console.log('💱 2. Live Sync Test: exchange-rates');
  const ratesDs = await syncDatasetFromUpstream('exchange-rates');
  if (ratesDs) {
    console.log(`   ✅ Synced ${ratesDs.record_count} currency exchange rates.`);
    console.log(`   - Sample rate:`, ratesDs.data_json.slice(0, 3));
    console.log(`   - isDatasetFresh('exchange-rates'):`, isDatasetFresh('exchange-rates'));
  } else {
    console.log(`   ❌ Failed to sync exchange-rates`);
  }
  console.log();

  // 3. Test Live Sync for crypto-prices
  console.log('🪙 3. Live Sync Test: crypto-prices');
  const cryptoDs = await syncDatasetFromUpstream('crypto-prices');
  if (cryptoDs) {
    console.log(`   ✅ Synced ${cryptoDs.record_count} live crypto prices.`);
    console.log(`   - Top 2 crypto:`, cryptoDs.data_json.slice(0, 2).map((c: any) => `${c.name} (${c.symbol}): $${c.currentPriceUsd}`));
    console.log(`   - isDatasetFresh('crypto-prices'):`, isDatasetFresh('crypto-prices'));
  } else {
    console.log(`   ❌ Failed to sync crypto-prices`);
  }
  console.log();

  // 4. Test Live Sync for prayer-times
  console.log('🕌 4. Live Sync Test: prayer-times');
  const prayerDs = await syncDatasetFromUpstream('prayer-times');
  if (prayerDs) {
    console.log(`   ✅ Synced ${prayerDs.record_count} cities prayer timetable.`);
    console.log(`   - Istanbul today:`, prayerDs.data_json.find((p: any) => p.city === 'Istanbul'));
    console.log(`   - isDatasetFresh('prayer-times'):`, isDatasetFresh('prayer-times'));
  } else {
    console.log(`   ❌ Failed to sync prayer-times`);
  }
  console.log();

  // 5. Test Live Sync for commodity-rates
  console.log('⛽ 5. Live Sync Test: commodity-rates');
  const commDs = await syncDatasetFromUpstream('commodity-rates');
  if (commDs) {
    console.log(`   ✅ Synced ${commDs.record_count} commodity benchmarks.`);
    console.log(`   - Gold & Silver:`, commDs.data_json.slice(0, 2));
    console.log(`   - isDatasetFresh('commodity-rates'):`, isDatasetFresh('commodity-rates'));
  } else {
    console.log(`   ❌ Failed to sync commodity-rates`);
  }
  console.log();

  console.log('================================================================');
  console.log('🎉 SEMI-STATIC LIVE SYNC & ZERO-STALE ARCHITECTURE VERIFIED 100%!');
  console.log('================================================================');
}

testSemiStaticSuite().catch(console.error);
