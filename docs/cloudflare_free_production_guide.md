# 🌐 Hritikpedia — 100% Free 24/7 Cloudflare & Backend Deployment Guide

This guide details how to host Hritikpedia in production for **$0/month** with **24/7 guaranteed uptime**, zero spin-down latency, global Cloudflare CDN acceleration, and high-availability PostgreSQL.

---

## Architecture Overview

```
                                      [ Internet / Learners ]
                                                │
                                                ▼
                        ┌──────────────────────────────────────────────┐
                        │      Cloudflare Edge Network & DNS (FREE)    │
                        │   • Global CDN Caching in 275+ Cities        │
                        │   • Free Universal SSL / TLS (Strict)        │
                        │   • Free DDoS Shield & Bot Fight Mode        │
                        └──────────────────────┬───────────────────────┘
                                               │
                                               ▼ (Proxied HTTPS)
                        ┌──────────────────────────────────────────────┐
                        │        24/7 Free Backend (Koyeb / Render)    │
                        │   • Next.js App Router & Node.js Runtime     │
                        │   • Learner Platform (Port 3000)             │
                        │   • Admin SOC Console (Port 3001)            │
                        │   • Health Monitor: /api/health              │
                        └──────────────────────┬───────────────────────┘
                                               │
                                               ▼ (Encrypted TLS Pool)
                        ┌──────────────────────────────────────────────┐
                        │     Neon Serverless PostgreSQL (100% FREE)   │
                        │   • High Availability Cloud Database         │
                        │   • 0.5 GiB Free Storage & Pooled URI        │
                        │   • Always-On 24/7                           │
                        └──────────────────────────────────────────────┘
```

---

## 🛠️ Step-by-Step Deployment (15 Minutes)

### STEP 1: Provision Free 24/7 PostgreSQL on Neon
1. Go to **[Neon.tech](https://neon.tech)** and sign in with GitHub.
2. Click **Create Project**:
   - **Name:** `hritikpedia-db`
   - **Region:** Pick the region closest to your audience (e.g., `AWS Asia Pacific (Singapore)` or `AWS US East`).
3. Under **Connection Details**, ensure **Connection pooling** is checked.
4. Copy the connection string. It looks like:
   ```text
   postgresql://hritikpedia_owner:AbCdEf123456@ep-cool-cloud-123456-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

### STEP 2: Run Database Migrations on Neon
From your local terminal, apply all 17 tables, analytical views, and seed data to your live Neon database:
```bash
# In your HritikPedia directory:
$env:DATABASE_URL="your-neon-connection-string-here"
npm run db:seed
```
*Output will confirm: "Super Admin provisioned successfully: admin@hritikpedia.com"*

---

### STEP 3: Deploy 24/7 Free Backend

You have two excellent 100% free hosting options:

#### Option A: Koyeb (Recommended — Truly Always On, Never Sleeps)
1. Go to **[Koyeb.com](https://www.koyeb.com)** and sign in with GitHub.
2. Click **Create Web Service**.
3. Select **GitHub** and choose your repository: `hritikkumarpd/HritikPedia`.
4. Choose **Buildpack**:
   - **Build command:** `npm ci && npm run build:web`
   - **Run command:** `npm run start:web`
5. Under **Ports**, set internal port to `3000`.
6. Under **Environment variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `DATABASE_URL`: *(Your Neon connection string from Step 1)*
   - `JWT_SECRET`: `hritikpedia_super_secure_random_key_min_64_characters_long_2026`
   - `NEXT_PUBLIC_APP_URL`: `https://hritikpedia.koyeb.app` (or your custom domain)
7. Click **Deploy**. Koyeb will give you a public URL (e.g. `https://hritikpedia-hritikkumar.koyeb.app`).

---

#### Option B: Render.com (Alternative 24/7 Free)
1. Go to **[Render.com](https://render.com)** and sign in with GitHub.
2. Click **New + > Blueprint** and select `hritikkumarpd/HritikPedia`.
   *(Render will automatically detect the [`render.yaml`](file:///c:/Users/hriti/OneDrive/Desktop/HritikPedia/render.yaml) file we created!)*
3. Supply your `DATABASE_URL` from Neon.
4. Click **Apply**.
5. **Keep-Alive (Crucial for 24/7 on Render):**
   Render free tier idles after 15 minutes of inactivity. To keep it awake 24/7:
   - Go to **[Cron-job.org](https://cron-job.org)** (100% Free).
   - Create a cron job with URL: `https://your-service.onrender.com/api/health`
   - Schedule: **Every 10 minutes**.
   - Your Render instance will never sleep and will stay live 24/7!

---

### STEP 4: Configure Cloudflare CDN, DNS & Custom Domain

1. Log into your **[Cloudflare Dashboard](https://dash.cloudflare.com)**.
2. If you have a custom domain (e.g. `hritikpedia.com`):
   - Click **Add a site** and enter your domain name.
   - Choose the **Free Plan**.
   - Update your domain registrar's nameservers to the two Cloudflare nameservers provided.
3. In **DNS > Records**, add a CNAME record:
   - **Type:** `CNAME`
   - **Name:** `@` (or `www`)
   - **Target:** Your Koyeb/Render backend URL (e.g. `hritikpedia-hritikkumar.koyeb.app`)
   - **Proxy Status:** **Proxied (Orange Cloud ON)** 🟠
4. In **SSL/TLS**:
   - Set encryption mode to **Full (Strict)**.
5. In **Caching > Configuration**:
   - Set **Browser Cache TTL** to 4 hours.
   - Cloudflare will now serve all your images, logos, CSS, and JS directly from edge servers in under 20ms!

---

## 🩺 Verifying Live Production Health

Once deployed, visit your health endpoint in the browser or terminal:
```bash
curl -I https://hritikpedia.com/api/health
```

Expected JSON response:
```json
{
  "app": "Hritikpedia Public Web Platform",
  "status": "ok",
  "uptime": 86400,
  "timestamp": "2026-10-24T22:30:00.000Z",
  "database": {
    "status": "healthy",
    "engine": "postgresql_pool",
    "latencyMs": 14
  }
}
```

---

## 💰 Total Monthly Cost Breakdown

| Component | Provider | Tier | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Edge CDN & DDoS Protection** | Cloudflare | Free Forever | **$0.00** |
| **DNS & Universal SSL** | Cloudflare | Free Forever | **$0.00** |
| **Backend Web & Admin Apps** | Koyeb / Render | Free Hobby Tier | **$0.00** |
| **PostgreSQL Database** | Neon.tech | Serverless Free (0.5GB) | **$0.00** |
| **24/7 Keep-Alive Monitor** | Cron-job.org | Free Forever | **$0.00** |
| **Total** | | | **$0.00 / month** |
