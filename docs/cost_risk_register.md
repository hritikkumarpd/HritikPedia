# Hritikpedia — Cost Model, Budget Architecture & Risk Register

> **Core Commitment:** Zero-Budget-First Development (₹0/month baseline). Scale on revenue, not speculation.

---

## 1. Zero-Budget Free Tier Service Matrix

| Component | Provider | Free Tier Allocation | Production Strategy | Cost at Launch |
| :--- | :--- | :--- | :--- | :--- |
| **Public Frontend** | Vercel (Hobby) | 100 GB Bandwidth, Fast CDN | Static site generation with ISR for note pages | **₹0 / mo** |
| **Admin Console** | Vercel (Hobby) | Separate project on `admin.hritikpedia.com` | IP restriction + JWT sessions | **₹0 / mo** |
| **Database** | Neon Serverless PG | 0.5 GB Storage, 1 Shared vCPU | Auto-suspending pooled serverless Postgres | **₹0 / mo** |
| **Local Dev DB** | Embedded WASM PGlite | Unlimited local disk (`.pgdata`) | Zero Docker/PostgreSQL setup required | **₹0 / mo** |
| **Document Storage**| Cloudflare R2 | 10 GB Storage, **Zero Egress Fees** | S3-compatible private storage for raw PDF files | **₹0 / mo** |
| **Authentication** | Custom Engine | Unlimited users | Self-contained Bcrypt (12 rounds) + JWT (HS256) | **₹0 / mo** |
| **Transactional Mail**| Resend | 3,000 emails/month | Email verification and purchase receipts | **₹0 / mo** |
| **Payment Gateway**| Razorpay | No monthly minimum | 2% + GST per successful student transaction | **₹0 / mo** |
| **DNS & Anti-DDoS** | Cloudflare Free | Unlimited DNS, DDoS mitigation | Free SSL certificates + Edge caching rules | **₹0 / mo** |
| **TOTAL FIXED MONTHLY EXPENSE** | | | | **₹0.00 / mo** |

---

## 2. Scaling Triggers & Upgrade Thresholds

As learner volume expands, upgrade only when self-funded by platform note sales:

### Phase 1: 0 to 5,000 Monthly Active Learners
- **Monthly Revenue:** ₹0 – ₹25,000
- **Infrastructure Cost:** **₹0 / month**
- **Action Items:** Utilize Neon free tier (0.5 GB handles ~500,000 table rows), Cloudflare R2 free tier (10 GB handles ~500 high-resolution PDF notes), and Vercel hobby tier.

### Phase 2: 5,000 to 25,000 Monthly Active Learners
- **Monthly Revenue:** ₹25,000 – ₹1,50,000
- **Upgrade Trigger:** Database storage exceeds 400 MB or Vercel bandwidth nears 90 GB.
- **Upgrades:**
  - Upgrade Vercel to Pro: ~$20 / month (~₹1,700).
  - Upgrade Neon to Launch Plan: ~$19 / month (~₹1,600).
  - Total infrastructure cost: ~₹3,300/mo (funded by < 2% of platform net profit).

### Phase 3: 25,000+ Enterprise Learners
- **Upgrade Trigger:** Concurrency peaks during exam preparation seasons (e.g., STET or GATE weeks).
- **Upgrades:** Enable Cloudflare Enterprise caching, provision read-replicas for PostgreSQL, and activate official WhatsApp Business API for automated instant notifications.

---

## 3. Platform Risk Register & Mitigation Strategy

| Risk ID | Threat Description | Likelihood | Impact | Built-in Countermeasure |
| :--- | :--- | :---: | :---: | :--- |
| **RSK-01** | **Note Piracy & Redistribution** | High | High | Dynamic canvas watermark stamped with learner email and UID across every page. Zero direct download links for paid material. Print and right-click suppression. |
| **RSK-02** | **Payment Signature Tampering** | Medium | Critical | Server-side constant-time HMAC-SHA256 signature verification. Database entitlement is only granted after cryptographic signature matches. Replay deduplication in `payment_events`. |
| **RSK-03** | **Credential Stuffing / Brute Force** | High | High | In-memory sliding-window IP rate limiting on `/api/auth/login` and `/api/admin/auth/login`. Failed attempts logged directly to SOC `security_events` table. |
| **RSK-04** | **Uncontrolled SMS / WhatsApp Costs** | High | Medium | Hardcoded feature toggles (`ENABLE_SMS=false`, `ENABLE_WHATSAPP=false`) by default. Strict compliance gate requiring verified student opt-in before dispatch. |
| **RSK-05** | **Scope Creep / Test Series Overhead** | Medium | High | **Strict Architectural Ban**: No quiz engines, test series, or exam timers anywhere in code or database. Prevents massive database bloat and operational distraction. |
