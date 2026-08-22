// ============================================================================
// Automated Test Suite for FreeAPI Universal Webhooks & SDK Verification
// ============================================================================

import {
  signWebhookPayload,
  evaluateCondition,
  saveWebhookSubscription,
  getWebhookSubscriptions,
  deleteWebhookSubscription,
  emitDatasetEvent,
} from '../src/lib/events/event-dispatcher';
import { verifyWebhookSignature, FreeApiClient } from '../src/lib/sdk';
import { WebhookSubscription } from '../src/types/database';

async function runTests() {
  console.log('🧪 Starting Universal Webhook & SDK Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Test HMAC Signature & SDK Verification
  console.log('1️⃣ Testing HMAC-SHA256 Signature & SDK Verifier...');
  const secret = 'whsec_test_secret_123456789';
  const payload = JSON.stringify({ event: 'dataset.updated', dataset: 'crypto-prices', data: [{ symbol: 'BTC', price: 85000 }] });
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = signWebhookPayload(payload, secret, timestamp);
  assert(signature.startsWith('t=') && signature.includes(',v1='), 'Signature header matches format t=...,v1=...');

  const isValid = verifyWebhookSignature({
    payload,
    signature,
    secret,
  });
  assert(isValid === true, 'Valid signature verified successfully by SDK');

  const isTampered = verifyWebhookSignature({
    payload: payload + 'tampered',
    signature,
    secret,
  });
  assert(isTampered === false, 'Tampered payload rejected by SDK');

  const isWrongSecret = verifyWebhookSignature({
    payload,
    signature,
    secret: 'whsec_wrong_secret',
  });
  assert(isWrongSecret === false, 'Wrong secret rejected by SDK');

  const isExpired = verifyWebhookSignature({
    payload,
    signature: `t=${timestamp - 1000},v1=1234`,
    secret,
    toleranceSeconds: 300,
  });
  assert(isExpired === false, 'Expired replay attack rejected by SDK tolerance');

  // 2. Test Threshold Condition Evaluator
  console.log('\n2️⃣ Testing Threshold Condition Evaluator...');
  const mockCryptoData = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', currentPriceUsd: 86500 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', currentPriceUsd: 3100 },
  ];

  const conditionPass = evaluateCondition(mockCryptoData, {
    field: 'currentPriceUsd',
    operator: '>',
    value: 80000,
    targetKey: 'bitcoin',
  });
  assert(conditionPass === true, 'Condition BTC > 80000 evaluated to TRUE');

  const conditionFail = evaluateCondition(mockCryptoData, {
    field: 'currentPriceUsd',
    operator: '>',
    value: 90000,
    targetKey: 'bitcoin',
  });
  assert(conditionFail === false, 'Condition BTC > 90000 evaluated to FALSE');

  const conditionEth = evaluateCondition(mockCryptoData, {
    field: 'currentPriceUsd',
    operator: '<',
    value: 4000,
    targetKey: 'ETH',
  });
  assert(conditionEth === true, 'Condition ETH < 4000 evaluated to TRUE');

  // 3. Test Subscription CRUD
  console.log('\n3️⃣ Testing Webhook Subscription Management...');
  const testSub: WebhookSubscription = {
    id: 'wh_unit_test_1',
    user_id: 'usr_unit_test',
    name: 'Unit Test Webhook',
    dataset_slug: 'crypto-prices',
    event_type: 'threshold.alert',
    condition: { field: 'currentPriceUsd', operator: '>', value: 80000, targetKey: 'bitcoin' },
    target_url: 'https://httpbin.org/post',
    secret: 'whsec_unit_test_secret',
    is_active: true,
    total_deliveries: 0,
    failure_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveWebhookSubscription(testSub);
  const loadedSubs = getWebhookSubscriptions('usr_unit_test');
  assert(loadedSubs.some((s) => s.id === 'wh_unit_test_1'), 'Webhook subscription saved and loaded from disk');

  deleteWebhookSubscription('wh_unit_test_1', 'usr_unit_test');
  const afterDelete = getWebhookSubscriptions('usr_unit_test');
  assert(!afterDelete.some((s) => s.id === 'wh_unit_test_1'), 'Webhook subscription deleted successfully');

  // 4. Test SDK Client Factory
  console.log('\n4️⃣ Testing FreeAPI SDK Client...');
  const client = new FreeApiClient({ apiKey: 'fapi_test_key' });
  assert(typeof client.dataset === 'function', 'client.dataset() method exists');
  assert(typeof client.webhooks.verifySignature === 'function', 'client.webhooks.verifySignature() method exists');

  console.log(`\n========================================`);
  console.log(`🎉 Webhook Test Suite Complete: ${passed} PASS, ${failed} FAIL`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error in tests:', err);
  process.exit(1);
});
