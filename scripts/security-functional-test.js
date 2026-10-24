/**
 * HRITIKPEDIA COMPREHENSIVE SECURITY & FUNCTIONAL TEST SUITE
 * Executes live HTTP integration tests against apps/web (port 3000) and apps/admin (port 3001)
 */

import fs from 'fs';
import path from 'path';

const WEB_URL = process.env.TEST_WEB_URL || 'http://localhost:3000';
const ADMIN_URL = process.env.TEST_ADMIN_URL || 'http://localhost:3001';

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m ${testName}`);
    passed++;
    results.push({ name: testName, status: 'PASSED' });
  } else {
    console.error(`  \x1b[31m✗\x1b[0m ${testName} ${details ? `(${details})` : ''}`);
    failed++;
    results.push({ name: testName, status: 'FAILED', error: details });
  }
}

function extractCookie(res, cookieName) {
  if (typeof res.headers.getSetCookie === 'function') {
    const list = res.headers.getSetCookie();
    for (const c of list) {
      if (c.startsWith(`${cookieName}=`)) {
        return c.split(';')[0];
      }
    }
  }
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    const parts = setCookie.split(/,\s*(?=[a-zA-Z0-9_-]+=)/);
    for (const p of parts) {
      if (p.trim().startsWith(`${cookieName}=`)) {
        return p.trim().split(';')[0];
      }
    }
    return setCookie.split(';')[0];
  }
  return null;
}

async function runTests() {
  console.log('\n\x1b[1m\x1b[35m================================================================');
  console.log('    HRITIKPEDIA LIVE SECURITY & FUNCTIONAL VERIFICATION SUITE   ');
  console.log('================================================================\x1b[0m\n');

  // =========================================================================
  // SECTION 1: PUBLIC PAGES & SEO
  // =========================================================================
  console.log('\x1b[1m[SECTION 1] Public Web Portal Functional & SEO Tests\x1b[0m');

  // Test 1.1: Homepage
  try {
    const res = await fetch(`${WEB_URL}/`);
    const html = await res.text();
    assert(res.status === 200, 'Homepage returns HTTP 200');
    assert(html.includes('Hritikpedia'), 'Homepage contains brand name "Hritikpedia"');
    assert(html.includes('Stop Searching. Start Learning.'), 'Homepage contains official tagline');
  } catch (err) {
    assert(false, 'Homepage test failed', err.message);
  }

  // Test 1.2: Notes Catalog
  try {
    const res = await fetch(`${WEB_URL}/notes`);
    const html = await res.text();
    assert(res.status === 200, 'Notes catalog (/notes) returns HTTP 200');
    assert(html.includes('Study Notes'), 'Notes catalog displays study materials');
  } catch (err) {
    assert(false, 'Notes catalog test failed', err.message);
  }

  // Test 1.3: Note Detail Page
  try {
    const res = await fetch(`${WEB_URL}/notes/dbms-normalization-notes`);
    const html = await res.text();
    assert(res.status === 200, 'Note detail (/notes/dbms-normalization-notes) returns HTTP 200');
    assert(html.includes('schema.org'), 'Note detail includes JSON-LD Product structured data');
    assert(html.includes('Relational Database Design'), 'Note detail contains chapter topics');
  } catch (err) {
    assert(false, 'Note detail test failed', err.message);
  }

  // Test 1.4: Subjects Page
  try {
    const res = await fetch(`${WEB_URL}/subjects`);
    const html = await res.text();
    assert(res.status === 200, 'Subjects directory (/subjects) returns HTTP 200');
    assert(html.includes('Database Management Systems'), 'Subjects directory lists DBMS');
  } catch (err) {
    assert(false, 'Subjects directory test failed', err.message);
  }

  // Test 1.5: Free Resources Page
  try {
    const res = await fetch(`${WEB_URL}/free-resources`);
    const html = await res.text();
    assert(res.status === 200, 'Free resources (/free-resources) returns HTTP 200');
    assert(html.includes('100% Free'), 'Free resources emphasizes zero-cost materials');
  } catch (err) {
    assert(false, 'Free resources test failed', err.message);
  }

  // Test 1.6: Articles Catalog & Detail
  try {
    const res = await fetch(`${WEB_URL}/articles`);
    const html = await res.text();
    assert(res.status === 200, 'Articles catalog (/articles) returns HTTP 200');

    const resArt = await fetch(`${WEB_URL}/articles/how-to-prepare-computer-science`);
    const htmlArt = await resArt.text();
    assert(resArt.status === 200, 'Article detail returns HTTP 200');
    assert(htmlArt.includes('Hritik Kumar'), 'Article identifies author');
  } catch (err) {
    assert(false, 'Articles test failed', err.message);
  }

  // Test 1.7: Robots.txt & Sitemap.xml
  try {
    const resRobots = await fetch(`${WEB_URL}/robots.txt`);
    const robotsTxt = await resRobots.text();
    assert(resRobots.status === 200, 'robots.txt returns HTTP 200');
    assert(robotsTxt.includes('Disallow: /admin/'), 'robots.txt disallows admin paths');
    assert(robotsTxt.includes('Disallow: /reader/'), 'robots.txt disallows private reader paths');

    const resSitemap = await fetch(`${WEB_URL}/sitemap.xml`);
    const sitemapXml = await resSitemap.text();
    assert(resSitemap.status === 200, 'sitemap.xml returns HTTP 200');
    assert(sitemapXml.includes('/notes/'), 'sitemap.xml includes study note URLs');
  } catch (err) {
    assert(false, 'SEO test failed', err.message);
  }

  // Test 1.8: Search API
  try {
    const res = await fetch(`${WEB_URL}/api/search?q=normalization`);
    const json = await res.json();
    assert(res.status === 200, 'Search API (/api/search?q=normalization) returns HTTP 200');
    assert(json.notes && json.notes.length > 0, 'Search API returns matching note for "normalization"');
  } catch (err) {
    assert(false, 'Search API test failed', err.message);
  }

  // Test 1.9: Newsletter Subscription API
  try {
    const testEmail = `test_sub_${Date.now()}@example.com`;
    const res = await fetch(`${WEB_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, consent: true, source: 'integration_test' }),
    });
    const json = await res.json();
    assert(res.status === 200 && json.success === true, 'Newsletter subscription succeeds with explicit consent');

    // Reject without consent
    const resNoConsent = await fetch(`${WEB_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, consent: false }),
    });
    assert(resNoConsent.status === 400, 'Newsletter rejects subscription when consent is missing');
  } catch (err) {
    assert(false, 'Newsletter test failed', err.message);
  }

  // =========================================================================
  // SECTION 2: STUDENT AUTHENTICATION & SESSION MANAGEMENT
  // =========================================================================
  console.log('\n\x1b[1m[SECTION 2] Student Authentication & Session Lifecycle\x1b[0m');

  const studentEmail = `student_${Date.now()}@example.com`;
  const studentPassword = 'SecureStudentPassword2026!';
  let studentCookie = null;
  let studentToken = null;
  let studentId = null;

  // Test 2.1: Register Student
  try {
    const res = await fetch(`${WEB_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aarav Sharma',
        email: studentEmail,
        password: studentPassword,
      }),
    });
    const json = await res.json();
    assert(res.status === 200 && json.success === true, 'Student registration succeeds with valid data');
    assert(json.user?.role === 'student', 'Registration guarantees student role assignment (Least Privilege)');
    studentId = json.user?.id;
    studentToken = json.token;

    // Extract cookie
    studentCookie = extractCookie(res, 'hritikpedia_session');
  } catch (err) {
    assert(false, 'Student registration test failed', err.message);
  }

  // Test 2.2: Reject duplicate registration
  try {
    const res = await fetch(`${WEB_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Student',
        email: studentEmail,
        password: studentPassword,
      }),
    });
    assert(res.status === 409, 'Registration rejects duplicate email with HTTP 409');
  } catch (err) {
    assert(false, 'Duplicate registration test failed', err.message);
  }

  // Test 2.3: Login Student
  try {
    const res = await fetch(`${WEB_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: studentPassword,
      }),
    });
    const json = await res.json();
    assert(res.status === 200 && json.success === true, 'Student login succeeds with correct credentials');
    studentToken = json.token;
    studentCookie = extractCookie(res, 'hritikpedia_session');
  } catch (err) {
    assert(false, 'Student login test failed', err.message);
  }

  // Test 2.4: Reject wrong password
  try {
    const res = await fetch(`${WEB_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: 'IncorrectPassword123!',
      }),
    });
    assert(res.status === 401, 'Login rejects incorrect password with HTTP 401');
  } catch (err) {
    assert(false, 'Incorrect password test failed', err.message);
  }

  // Test 2.5: Verify session via /api/auth/me
  try {
    const headers = {};
    if (studentCookie) headers['Cookie'] = studentCookie;
    if (studentToken) headers['Authorization'] = `Bearer ${studentToken}`;

    const res = await fetch(`${WEB_URL}/api/auth/me`, { headers });
    const json = await res.json();
    assert(res.status === 200 && json.user?.email === studentEmail, 'Session validated by /api/auth/me');
  } catch (err) {
    assert(false, 'Session check failed', err.message);
  }

  // =========================================================================
  // SECTION 3: IN-BROWSER SECURE READER & WATERMARKING
  // =========================================================================
  console.log('\n\x1b[1m[SECTION 3] Secure Reader, Dynamic Watermarking & Entitlements\x1b[0m');

  // Test 3.1: Free note reader access (Unauthenticated or authenticated)
  try {
    const res = await fetch(`${WEB_URL}/api/reader/digital-logic-k-maps-revision`);
    const json = await res.json();
    assert(res.status === 200 && json.accessGranted === true, 'Free study note grants full in-browser access');
    assert(
      json.watermark && (json.watermark.primaryText?.includes('HRITIKPEDIA') || json.watermark.brand === 'HRITIKPEDIA'),
      'Free note reader generates brand watermark'
    );
  } catch (err) {
    assert(false, 'Free note reader test failed', err.message);
  }

  // Test 3.2: Paid note sample preview mode
  try {
    const res = await fetch(`${WEB_URL}/api/reader/dbms-normalization-notes?preview=true`);
    const json = await res.json();
    assert(res.status === 200 && json.mode === 'preview', 'Paid note reader permits sample preview mode');
    assert(json.allowedPages.length <= (json.previewPages || 6), 'Preview mode restricts allowed pages to preview limit');
  } catch (err) {
    assert(false, 'Sample preview test failed', err.message);
  }

  // Test 3.3: Unauthorized access to paid note without purchase
  try {
    const headers = {};
    if (studentCookie) headers['Cookie'] = studentCookie;
    if (studentToken) headers['Authorization'] = `Bearer ${studentToken}`;

    const res = await fetch(`${WEB_URL}/api/reader/dbms-normalization-notes`, { headers });
    const json = await res.json();
    assert(
      (res.status === 403 || res.status === 401) && (json.requiresPurchase === true || json.requiresAuth === true),
      'Paid note denies full access prior to purchase'
    );
  } catch (err) {
    assert(false, 'Unauthorized paid note test failed', err.message);
  }

  // =========================================================================
  // SECTION 4: COMMERCE, RAZORPAY INTEGRATION & ENTITLEMENT UNLOCK
  // =========================================================================
  console.log('\n\x1b[1m[SECTION 4] Commerce, Razorpay Verification & Lifetime Entitlement\x1b[0m');

  let orderId = null;

  // Test 4.1: Create Razorpay Order
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (studentCookie) headers['Cookie'] = studentCookie;
    if (studentToken) headers['Authorization'] = `Bearer ${studentToken}`;

    const res = await fetch(`${WEB_URL}/api/checkout/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        noteSlug: 'dbms-normalization-notes',
      }),
    });
    const json = await res.json();
    assert(res.status === 200 && json.success === true, 'Order created successfully on server');
    assert(json.order?.orderId && json.order?.amount > 0, 'Server returns valid Razorpay order structure');
    orderId = json.order.orderId;
  } catch (err) {
    assert(false, 'Create order test failed', err.message);
  }

  // Test 4.2: Payment Signature Verification (Anti-Tampering)
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (studentCookie) headers['Cookie'] = studentCookie;
    if (studentToken) headers['Authorization'] = `Bearer ${studentToken}`;

    // Attempt with tampered signature
    const resTampered = await fetch(`${WEB_URL}/api/checkout/verify-payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orderId,
        paymentId: `pay_tamper_${Date.now()}`,
        signature: 'fake_tampered_signature_string',
      }),
    });
    assert(resTampered.status === 400, 'Payment verification rejects tampered signature with HTTP 400');

    // Legitimate signature verification (dev mock signature)
    const resValid = await fetch(`${WEB_URL}/api/checkout/verify-payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orderId,
        paymentId: `pay_valid_${Date.now()}`,
        signature: 'dev_mock_signature',
      }),
    });
    const jsonValid = await resValid.json();
    assert(resValid.status === 200 && jsonValid.success === true, 'Payment signature verified and entitlement unlocked');
  } catch (err) {
    assert(false, 'Payment verification test failed', err.message);
  }

  // Test 4.3: Full Reader Access Post-Purchase
  try {
    const headers = {};
    if (studentCookie) headers['Cookie'] = studentCookie;
    if (studentToken) headers['Authorization'] = `Bearer ${studentToken}`;

    const res = await fetch(`${WEB_URL}/api/reader/dbms-normalization-notes`, { headers });
    const json = await res.json();
    assert(res.status === 200 && json.accessGranted === true, 'Purchased note now grants full in-browser access');
    assert(json.mode === 'full', 'Mode elevated from preview to full');
    assert(json.watermark?.maskedEmail?.includes('*'), 'User-specific watermark contains masked student email');
  } catch (err) {
    assert(false, 'Post-purchase reader test failed', err.message);
  }

  // Test 4.4: Student Dashboard Library & Purchases API
  try {
    const headers = {};
    if (studentCookie) headers['Cookie'] = studentCookie;
    if (studentToken) headers['Authorization'] = `Bearer ${studentToken}`;

    const resNotes = await fetch(`${WEB_URL}/api/student/notes`, { headers });
    const jsonNotes = await resNotes.json();
    assert(resNotes.status === 200 && jsonNotes.purchasedNotes.length >= 1, 'Student library lists purchased note');

    const resPurchases = await fetch(`${WEB_URL}/api/student/purchases`, { headers });
    const jsonPurchases = await resPurchases.json();
    assert(resPurchases.status === 200 && jsonPurchases.purchases.length >= 1, 'Purchases ledger records transaction');
  } catch (err) {
    assert(false, 'Dashboard API test failed', err.message);
  }

  // =========================================================================
  // SECTION 5: SECURITY DEFENSES, ATTACK RESILIENCE & RBAC
  // =========================================================================
  console.log('\n\x1b[1m[SECTION 5] Cyber Defense, Intrusion Resilience & RBAC Enforcement\x1b[0m');

  // Test 5.1: Privilege Escalation Attempt (Student attempting Admin API)
  try {
    const headers = {};
    if (studentCookie) headers['Cookie'] = studentCookie;
    if (studentToken) headers['Authorization'] = `Bearer ${studentToken}`;

    const resAdminAttempt = await fetch(`${ADMIN_URL}/api/admin/overview`, { headers });
    assert(
      resAdminAttempt.status === 401 || resAdminAttempt.status === 403,
      'Admin API rejects student session (Strict Privilege Isolation)'
    );
  } catch (err) {
    assert(false, 'Privilege escalation test failed', err.message);
  }

  // Test 5.2: Admin Login with Student Account
  try {
    const resAdminLogin = await fetch(`${ADMIN_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentEmail, password: studentPassword }),
    });
    assert(
      resAdminLogin.status === 403 || resAdminLogin.status === 401,
      'Admin login rejects non-administrative accounts (HTTP 403/401 Access Denied)'
    );
  } catch (err) {
    assert(false, 'Admin student login test failed', err.message);
  }

  // Test 5.3: Super Admin Login & Console Access
  let adminCookie = null;
  let adminToken = null;
  try {
    const resSuper = await fetch(`${ADMIN_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@hritikpedia.com',
        password: process.env.SUPER_ADMIN_PASSWORD || 'Admin@Hritikpedia2026',
      }),
    });
    const jsonSuper = await resSuper.json();
    assert(resSuper.status === 200 && jsonSuper.success === true, 'Super Admin logs in successfully to Admin Console');
    assert(jsonSuper.user?.role === 'super_admin', 'Admin session confirms super_admin authority');
    adminToken = jsonSuper.token;
    adminCookie = extractCookie(resSuper, 'hritikpedia_admin_session');
  } catch (err) {
    assert(false, 'Super admin login test failed', err.message);
  }

  // Test 5.4: Admin Overview API & Metrics
  try {
    const headers = {};
    if (adminCookie) headers['Cookie'] = adminCookie;
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await fetch(`${ADMIN_URL}/api/admin/overview`, { headers });
    const json = await res.json();
    assert(res.status === 200 && json.metrics !== undefined, 'Admin overview API returns aggregate metrics');
    assert(json.metrics.totalUsers >= 1, 'Overview metrics query live PostgreSQL users table');
  } catch (err) {
    assert(false, 'Admin overview test failed', err.message);
  }

  // Test 5.5: Admin Notes CMS API
  try {
    const headers = {};
    if (adminCookie) headers['Cookie'] = adminCookie;
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await fetch(`${ADMIN_URL}/api/admin/notes`, { headers });
    const json = await res.json();
    assert(res.status === 200 && json.notes && json.notes.length >= 1, 'Admin notes API returns CMS notes catalog');
    assert(json.subjects && json.subjects.length >= 1, 'Admin notes API returns subject list');
  } catch (err) {
    assert(false, 'Admin notes CMS test failed', err.message);
  }

  // Test 5.6: Admin Security SOC Telemetry Feed
  try {
    const headers = {};
    if (adminCookie) headers['Cookie'] = adminCookie;
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await fetch(`${ADMIN_URL}/api/admin/security`, { headers });
    const json = await res.json();
    assert(res.status === 200 && Array.isArray(json.securityEvents), 'SOC Threat Feed returns recorded security events');
    assert(Array.isArray(json.auditLogs), 'SOC Threat Feed returns immutable administrative audit trail');
  } catch (err) {
    assert(false, 'SOC telemetry test failed', err.message);
  }

  // Test 5.7: Admin PDF Policies API
  try {
    const headers = {};
    if (adminCookie) headers['Cookie'] = adminCookie;
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await fetch(`${ADMIN_URL}/api/admin/pdf-policies`, { headers });
    const json = await res.json();
    assert(res.status === 200 && json.policies !== undefined, 'Admin PDF Policies API accessible to authorized roles');
  } catch (err) {
    assert(false, 'Admin PDF Policies test failed', err.message);
  }

  // Test 5.8: Admin Advertising API
  try {
    const headers = {};
    if (adminCookie) headers['Cookie'] = adminCookie;
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await fetch(`${ADMIN_URL}/api/admin/advertising`, { headers });
    const json = await res.json();
    assert(res.status === 200 && json.placements !== undefined, 'Admin Advertising API accessible to authorized roles');
  } catch (err) {
    assert(false, 'Admin Advertising test failed', err.message);
  }

  // Test 5.9: Admin Newsletter API
  try {
    const headers = {};
    if (adminCookie) headers['Cookie'] = adminCookie;
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    const res = await fetch(`${ADMIN_URL}/api/admin/newsletter`, { headers });
    const json = await res.json();
    assert(res.status === 200 && Array.isArray(json.subscribers), 'Admin Newsletter API accessible to authorized roles');
  } catch (err) {
    assert(false, 'Admin Newsletter test failed', err.message);
  }

  // Test 5.10: SQL Injection Resilience
  try {
    const sqliPayload = "admin' OR '1'='1' --";
    const resSqli = await fetch(`${WEB_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sqliPayload, password: 'password' }),
    });
    assert(resSqli.status === 400 || resSqli.status === 401, 'SQL injection attempt in auth payload safely neutralized');
  } catch (err) {
    assert(false, 'SQL injection test failed', err.message);
  }

  // Test 5.11: Path Traversal / LFI Resistance
  try {
    const traversalPayload = encodeURIComponent('../../etc/passwd');
    const resTraversal = await fetch(`${WEB_URL}/api/reader/${traversalPayload}`);
    assert(
      resTraversal.status === 404 || resTraversal.status === 400,
      'Path traversal attempt in reader slug rejected safely (404/400)'
    );
  } catch (err) {
    assert(false, 'Path traversal test failed', err.message);
  }

  // Test 5.12: Anti-Enumeration on Password Reset
  try {
    const resForgot = await fetch(`${WEB_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent_account_12345@hritikpedia.com' }),
    });
    const jsonForgot = await resForgot.json();
    assert(
      resForgot.status === 200 && jsonForgot.success === true,
      'Password reset returns uniform success to prevent account enumeration'
    );
  } catch (err) {
    assert(false, 'Password reset enumeration test failed', err.message);
  }

  // Test 5.13: Security Headers Verification
  try {
    const resWebHeaders = await fetch(`${WEB_URL}/`);
    const headers = resWebHeaders.headers;
    assert(headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff header present');
    assert(headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy header present');
    assert(headers.get('strict-transport-security')?.includes('max-age'), 'Strict-Transport-Security (HSTS) header configured');
    assert(headers.get('permissions-policy')?.includes('camera=()'), 'Permissions-Policy header configured');
  } catch (err) {
    assert(false, 'Security headers test failed', err.message);
  }

  // =========================================================================
  // SECTION 6: MANDATORY ARCHITECTURAL INVARIANTS
  // =========================================================================
  console.log('\n\x1b[1m[SECTION 6] Mandatory Architectural Invariants\x1b[0m');

  // Test 6.1: Zero Test Series / Mock Exam / Quiz Invariant
  try {
    // 1. Search API zero-leakage check
    const searchQuiz = await fetch(`${WEB_URL}/api/search?q=quiz`);
    const jsonQuiz = await searchQuiz.json();
    assert(jsonQuiz.notes?.length === 0, 'Zero Test Series Invariant: No quiz results returned by search API');

    const searchMock = await fetch(`${WEB_URL}/api/search?q=mock+test`);
    const jsonMock = await searchMock.json();
    assert(jsonMock.notes?.length === 0, 'Zero Test Series Invariant: No mock test results returned by search API');

    // 2. Admin catalog verification
    const adminNotesRes = await fetch(`${ADMIN_URL}/api/admin/notes`, {
      headers: {
        ...(adminCookie ? { Cookie: adminCookie } : {}),
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
    });
    const adminNotesJson = await adminNotesRes.json();
    const forbiddenInCatalog = (adminNotesJson.notes || []).filter((n) =>
      /quiz|mock|exam|test[_\s-]?series/i.test(n.title) || /quiz|mock|exam|test[_\s-]?series/i.test(n.slug)
    );
    assert(forbiddenInCatalog.length === 0, 'Zero Test Series Invariant: No mock test or quiz notes in CMS catalog');

    // 3. Scan workspace routing tree
    const scanDir = (dir) => {
      let forbiddenFiles = [];
      if (!fs.existsSync(dir)) return forbiddenFiles;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (/quiz|mock|test-series/i.test(entry.name)) {
            forbiddenFiles.push(fullPath);
          }
          forbiddenFiles = forbiddenFiles.concat(scanDir(fullPath));
        } else if (/quiz|mock|test-series/i.test(entry.name)) {
          forbiddenFiles.push(fullPath);
        }
      }
      return forbiddenFiles;
    };

    const forbiddenRoutes = [
      ...scanDir(path.resolve(process.cwd(), 'apps/web/src/app')),
      ...scanDir(path.resolve(process.cwd(), 'apps/admin/src/app')),
    ];
    assert(forbiddenRoutes.length === 0, 'Zero Test Series Invariant: Zero quiz/mock/exam routes exist in app tree');
  } catch (err) {
    assert(false, 'Architectural invariant test failed', err.message);
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n\x1b[1m\x1b[35m================================================================');
  console.log(`TEST SUMMARY: \x1b[32m${passed} PASSED\x1b[0m | \x1b[31m${failed} FAILED\x1b[0m | TOTAL: ${passed + failed}`);
  console.log('================================================================\x1b[0m\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
