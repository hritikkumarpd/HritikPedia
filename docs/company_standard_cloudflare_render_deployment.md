# 🚀 Hritikpedia — Company Standard Production Architecture (Cloudflare + Render)

> **Enterprise Architecture Spec:** Cloudflare Global Edge Network (Frontend CDN & Ingress) + Render Dedicated Micro-Services (Backend & Compute) + Neon Serverless PostgreSQL (Data Layer).

---

## 🏛️ System Architecture Diagram

```
                                    [ Users / Students / Googlebot ]
                                                   │
                                                   ▼ (HTTPS - TLS 1.3)
                         ┌────────────────────────────────────────────────────────┐
                         │       CLOUDFLARE ENTERPRISE EDGE NETWORK (FRONTEND)    │
                         │   • 330+ Global Data Centers Edge Caching              │
                         │   • Universal SSL / Full (Strict) Encryption           │
                         │   • DDoS Mitigation & Cloudflare Bot Fight Mode        │
                         │   • Next.js Static Asset Acceleration (/_next/static/) │
                         │   • Intelligent WAF & Cloudflare Turnstile CAPTCHA     │
                         └───────────────────────────┬────────────────────────────┘
                                                     │
                                                     ▼ (Orange Cloud Proxy / Rewrites)
                         ┌────────────────────────────────────────────────────────┐
                         │          RENDER PRODUCTION COMPUTE (BACKEND)           │
                         │                                                        │
                         │   [ hritikpedia-web ]          [ hritikpedia-admin ]   │
                         │   • Public Web & APIs          • Admin SOC Console     │
                         │   • Next.js App Router (SSR)   • RBAC & Audit Engine   │
                         │   • Port 3000                  • Port 3001             │
                         │   • Health: /api/health        • Health: /api/admin/...│
                         └───────────────────────────┬────────────────────────────┘
                                                     │
                                                     ▼ (Encrypted Connection Pooler)
                         ┌────────────────────────────────────────────────────────┐
                         │       NEON SERVERLESS POSTGRESQL (DATABASE LAYER)      │
                         │   • High-Availability Managed PostgreSQL 17            │
                         │   • Strict ACID Transactions & Row-Level Auditing      │
                         │   • Auto-scaling & Instant Point-in-Time Recovery      │
                         └────────────────────────────────────────────────────────┘
```

---

## 🎯 Why This Architecture is the Company Standard

1. **Zero Cookie / CORS Friction:** Since Cloudflare proxies the domain (`hritikpedia.com`) directly to the Render backend, the browser sees a single unified origin. HttpOnly session cookies (`hritikpedia_session` and `hritikpedia_admin_session`) remain 100% first-party without cross-domain blockades.
2. **Global Speed (<20ms TTFB for static assets):** All images, logos, CSS, and Next.js bundles are cached across Cloudflare's edge network.
3. **Database Security:** Direct database ports are never exposed to the public internet; only the Render backend connects over pooled SSL.
4. **Complete SEO / Bot Readiness:** Server-side rendered pages and JSON-LD schemas reach Googlebot and AI crawlers instantly.

---

## 📋 Step-by-Step Implementation Guide

### STEP 1: Provision Cloud Database (Neon.tech)
1. Sign in at **[Neon.tech](https://neon.tech)**.
2. Create project `hritikpedia-production`.
3. Under **Dashboard > Connection Details**, check **Connection pooling**.
4. Copy the Pooled Connection String:
   ```text
   postgresql://user:password@ep-xyz-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```

### STEP 2: Run Database Migrations & Seed Production Data
Open your local PowerShell terminal and execute:
```powershell
$env:DATABASE_URL="your-neon-pooled-connection-string"
npm run db:migrate
npm run db:seed
```
*Verification:* The console will display: `Super Admin provisioned successfully: admin@hritikpedia.com`.

---

### STEP 3: Deploy Backend on Render (1-Click Blueprint)
1. Log in to **[Render.com](https://render.com)**.
2. Click **New + > Blueprint** and select `hritikkumarpd/HritikPedia`.
3. Render will automatically parse [`render.yaml`](file:///c:/Users/hriti/OneDrive/Desktop/HritikPedia/render.yaml) and create both services:
   - **`hritikpedia-web`** (Port 3000)
   - **`hritikpedia-admin`** (Port 3001)
4. Fill in the required environment variables:
   - `DATABASE_URL`: Your Neon Pooled Connection String.
   - `JWT_SECRET`: High-entropy 64-character secret.
   - `NEXT_PUBLIC_APP_URL`: `https://hritikpedia.com`
   - `NEXT_PUBLIC_ADMIN_URL`: `https://admin.hritikpedia.com`
   - `RAZORPAY_KEY_ID`: Your Razorpay live/test key.
   - `RAZORPAY_KEY_SECRET`: Your Razorpay secret key.
   - `RAZORPAY_WEBHOOK_SECRET`: Your webhook secret.
5. Click **Apply**.
6. Render builds and starts both services:
   - `https://hritikpedia-web.onrender.com`
   - `https://hritikpedia-admin.onrender.com`

---

### STEP 4: Configure Cloudflare (Frontend Ingress, DNS & CDN)
1. Log into **[Cloudflare Dashboard](https://dash.cloudflare.com)**.
2. Select your domain (`hritikpedia.com`). If not added yet, click **Add Site** (Free Plan) and update your domain registrar's nameservers to Cloudflare.
3. In **DNS > Records**, configure:

| Type | Name | Content / Target | Proxy Status | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `@` (root) | `hritikpedia-web.onrender.com` | **Proxied (Orange Cloud 🟠)** | Auto |
| **CNAME** | `www` | `hritikpedia.com` | **Proxied (Orange Cloud 🟠)** | Auto |
| **CNAME** | `admin` | `hritikpedia-admin.onrender.com` | **Proxied (Orange Cloud 🟠)** | Auto |

4. In **SSL/TLS > Overview**:
   - Set Encryption Mode to: **Full (Strict)**.
5. In **SSL/TLS > Edge Certificates**:
   - Turn **Always Use HTTPS** to **ON**.
   - Turn **Automatic HTTPS Rewrites** to **ON**.
   - Minimum TLS Version: **TLS 1.2**.
6. In **Caching > Cache Rules** (Create Rule: "Cache Next.js Static"):
   - Match: `URI Path starts with /_next/static/`
   - Cache Eligibility: **Eligible for cache**
   - Edge Cache TTL: **1 year (31536000s)**
7. In **Security > Bots**:
   - Turn **Bot Fight Mode** to **ON**.

---

### STEP 5: 24/7 Keep-Alive Automation (Zero Spin-Down on Free Tier)
Because Render free web services spin down after 15 minutes of inactivity, keep them 100% warm 24/7:
1. Go to **[Cron-job.org](https://cron-job.org)** (100% Free).
2. Create 2 Cron Jobs:
   - **Job 1:** `https://hritikpedia.com/api/health` — Runs **every 10 minutes**.
   - **Job 2:** `https://admin.hritikpedia.com/api/admin/health` — Runs **every 10 minutes**.
3. Response code is `200 OK`. Your servers will NEVER sleep and response times will remain instant!

---

### STEP 6: Razorpay Webhook Configuration
1. In your **[Razorpay Dashboard](https://dashboard.razorpay.com)**, navigate to **Settings > Webhooks > Add New Webhook**.
2. **Webhook URL:** `https://hritikpedia.com/api/webhooks/razorpay`
3. **Secret:** Match the `RAZORPAY_WEBHOOK_SECRET` provided in Render.
4. **Active Events:**
   - `order.paid`
   - `payment.captured`
   - `payment.failed`

---

## 🩺 Production Health Verification Checklist

Run these commands in terminal or browse directly:

```bash
# 1. Verify Public Web & Database Health
curl -I https://hritikpedia.com/api/health

# 2. Verify Admin Console Health
curl -I https://admin.hritikpedia.com/api/admin/health

# 3. Verify Cloudflare Edge Proxy & Caching
curl -I https://hritikpedia.com/_next/static/chunks/main.js
# Look for header: cf-cache-status: HIT
```
