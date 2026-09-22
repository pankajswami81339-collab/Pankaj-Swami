import crypto from 'crypto';
import { createExpressApp } from './server/app.js';
import { encryptToken, decryptToken, maskSecret } from './server/crypto.js';
import { WhatsAppMetaService } from './server/whatsapp-service.js';
import { db } from './server/db.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`, detail || '');
    throw new Error(`Test failed: ${testName}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING PHASE 2 META WHATSAPP CLOUD API TEST SUITE');
  console.log('======================================================\n');

  const app = createExpressApp();
  const server = app.listen(0);
  const address = server.address() as any;
  const port = address.port;
  const baseUrl = `http://localhost:${port}`;

  try {
    // -----------------------------------------------------------------
    // TEST 1: Token Encryption & Decryption (AES-256-GCM Vault)
    // -----------------------------------------------------------------
    console.log('📦 TEST 1: AES-256-GCM Token Encryption & Decryption');
    const sampleToken = 'EAAGm0PX_secret_access_token_nexus_enterprise_9921';
    const encrypted = encryptToken(sampleToken);
    
    assert(encrypted.split(':').length === 3, 'Encrypted token format is iv:tag:ciphertext');
    assert(encrypted !== sampleToken, 'Ciphertext is distinct from plaintext');
    assert(!encrypted.includes('nexus_enterprise'), 'Plaintext substrings are completely masked in ciphertext');

    const decrypted = decryptToken(encrypted);
    assert(decrypted === sampleToken, 'Decrypted token matches original secret exactly');

    const masked = maskSecret(sampleToken);
    assert(masked.startsWith('EAAG') && masked.endsWith('9921'), 'Masked token preserves prefix and suffix for audit');
    assert(masked.includes('••••'), 'Sensitive middle characters are securely masked');

    // -----------------------------------------------------------------
    // TEST 2: GET Webhook Challenge Verification (hub.challenge)
    // -----------------------------------------------------------------
    console.log('\n📡 TEST 2: Meta Webhook GET Challenge Verification');
    const challengeVal = '1158201207';
    const verifyToken = 'relayflow_verify_nexus_live';

    // 2a. Valid verification
    const challengeRes = await fetch(
      `${baseUrl}/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=${challengeVal}`
    );
    const challengeText = await challengeRes.text();
    assert(challengeRes.status === 200, 'Valid challenge returns HTTP 200 OK');
    assert(challengeText === challengeVal, 'Webhook GET endpoint echoes back the hub.challenge');

    // 2b. Invalid token rejection
    const invalidRes = await fetch(
      `${baseUrl}/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong_token_xyz&hub.challenge=${challengeVal}`
    );
    assert(invalidRes.status === 403, 'Invalid verify_token rejected with HTTP 403 Forbidden');

    // -----------------------------------------------------------------
    // TEST 3: POST Incoming Customer Message (HMAC Signature Verified)
    // -----------------------------------------------------------------
    console.log('\n💬 TEST 3: POST Incoming Customer Message (HMAC Signed)');
    const testWamid = `wamid.HBgL${Date.now()}_test_01`;
    const incomingPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'waba_392019485710294',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '+1 (555) 382-9901',
                  phone_number_id: '109283746192837',
                },
                contacts: [{ profile: { name: 'Sarah Connor' }, wa_id: '14155552671' }],
                messages: [
                  {
                    from: '14155552671',
                    id: testWamid,
                    timestamp: `${Math.floor(Date.now() / 1000)}`,
                    text: { body: 'Hello! I need assistance with our bulk WhatsApp delivery.' },
                    type: 'text',
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const rawBody = JSON.stringify(incomingPayload);
    const appSecret = process.env.META_APP_SECRET || 'dev_meta_app_secret';
    const validSignature = `sha256=${crypto.createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex')}`;

    const msgRes = await fetch(`${baseUrl}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': validSignature,
        'x-organization-id': 'org_nexus_ecommerce',
      },
      body: rawBody,
    });
    const msgData = await msgRes.json();
    assert(msgRes.status === 200, 'Valid HMAC signature accepted with HTTP 200 OK');
    assert(msgData.eventsProcessed === 1, 'Incoming customer message processed and recorded in database');

    // Verify contact upserted in CRM
    const savedContact = db.contacts.find((c) => c.phone === '+14155552671');
    assert(!!savedContact, 'Customer contact automatically upserted into tenant CRM');

    // -----------------------------------------------------------------
    // TEST 4: Idempotency Protection (Duplicate Event Skip)
    // -----------------------------------------------------------------
    console.log('\n⚡ TEST 4: Event Idempotency & Deduplication Guard');
    const duplicateRes = await fetch(`${baseUrl}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': validSignature,
        'x-organization-id': 'org_nexus_ecommerce',
      },
      body: rawBody,
    });
    const duplicateData = await duplicateRes.json();
    assert(duplicateRes.status === 200, 'Duplicate webhook returns HTTP 200 to acknowledge Meta');
    assert(duplicateData.eventsProcessed === 0, 'Duplicate event was safely skipped (idempotent deduplication)');

    // -----------------------------------------------------------------
    // TEST 5: POST Message Status Updates (Delivered, Read, Failed)
    // -----------------------------------------------------------------
    console.log('\n📊 TEST 5: Message Delivery Status Updates');
    const statusPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'waba_392019485710294',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                statuses: [
                  {
                    id: `wamid.status_${Date.now()}`,
                    status: 'delivered',
                    timestamp: `${Math.floor(Date.now() / 1000)}`,
                    recipient_id: '14155552671',
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const statusBody = JSON.stringify(statusPayload);
    const statusSig = `sha256=${crypto.createHmac('sha256', appSecret).update(statusBody, 'utf8').digest('hex')}`;

    const statusRes = await fetch(`${baseUrl}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': statusSig,
        'x-organization-id': 'org_nexus_ecommerce',
      },
      body: statusBody,
    });
    const statusData = await statusRes.json();
    assert(statusRes.status === 200, 'Message status webhook accepted with HTTP 200');
    assert(statusData.eventsProcessed === 1, 'Delivery receipt processed and saved');

    // -----------------------------------------------------------------
    // TEST 6: Invalid HMAC Signature Rejection (Security Validation)
    // -----------------------------------------------------------------
    console.log('\n🛡️ TEST 6: Invalid HMAC Signature Rejection');
    const forgedSignature = 'sha256=0000000000000000000000000000000000000000000000000000000000000000';
    const forgedRes = await fetch(`${baseUrl}/api/webhooks/whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': forgedSignature,
      },
      body: JSON.stringify({ object: 'whatsapp_business_account', entry: [] }),
    });
    assert(forgedRes.status === 401, 'Tampered/forged signature rejected with HTTP 401 Unauthorized');

    // -----------------------------------------------------------------
    // TEST 7: Phone Number Synchronization Architecture
    // -----------------------------------------------------------------
    console.log('\n📱 TEST 7: Phone Number Synchronization via Meta Service');
    const syncResult = await WhatsAppMetaService.syncPhoneNumbers('org_nexus_ecommerce');
    assert(syncResult.success === true, 'Phone number synchronization completed successfully');
    assert(syncResult.phoneNumbers.length > 0, 'Synchronized phone numbers list contains verified senders');
    assert(syncResult.phoneNumbers[0].status === 'CONNECTED', 'Primary sender status is CONNECTED');
    assert(syncResult.phoneNumbers[0].qualityRating === 'GREEN', 'Phone number quality rating is GREEN');

    // -----------------------------------------------------------------
    // TEST 8: Meta OAuth Authorization URL Generation
    // -----------------------------------------------------------------
    console.log('\n🔑 TEST 8: Meta OAuth URL Generation');
    const oauthUrl = WhatsAppMetaService.generateOAuthAuthorizationUrl('org_nexus_ecommerce', 'http://localhost:3000/api/v1/whatsapp/oauth/callback');
    assert(oauthUrl.url.includes('facebook.com/v20.0/dialog/oauth'), 'OAuth URL targets official Meta Graph API dialog');
    assert(oauthUrl.url.includes('whatsapp_business_messaging'), 'Requested scopes include whatsapp_business_messaging');
    assert(oauthUrl.url.includes('whatsapp_business_management'), 'Requested scopes include whatsapp_business_management');
    assert(!!oauthUrl.state, 'CSRF state token generated with tenant binding');

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED CLEANLY!`);
    console.log('======================================================\n');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
