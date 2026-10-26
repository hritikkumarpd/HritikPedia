# Hritikpedia — Production Deployment & DevOps Runbook

> **Dual Deployment Target:** `https://hritikpedia.com` (Learners) & `https://admin.hritikpedia.com` (Staff Console)

---

## 1. Architecture Overview for Deployment

Hritikpedia is organized as an npm workspaces monorepo. When deploying to production:
1. **Public Web Portal (`apps/web`)** is deployed as Project 1 on Vercel.
2. **Staff Admin Console (`apps/admin`)** is deployed as Project 2 on Vercel.
3. Both connect to a shared, high-availability PostgreSQL database (e.g., Neon or AWS RDS).

---

## 2. Step-by-Step Production Setup

### Step 1: Provision Serverless PostgreSQL (Neon)
1. Navigate to [Neon.tech](https://neon.tech) and create a free PostgreSQL project (e.g., `hritikpedia-prod`).
2. Copy the Connection String URI with pooling enabled (`postgresql://user:password@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`).
3. Set `DATABASE_URL` in your deployment environment variables.

### Step 2: Execute Database Migrations & Seeds
From your local terminal or CI/CD deployment pipeline, run:
```bash
# Apply initial normalized schema & analytical views
DATABASE_URL="your-neon-connection-string" npm run db:migrate

# Seed subjects, educational notes, articles, and provision Super Admin
DATABASE_URL="your-neon-connection-string" npm run db:seed
```
*Note: The Super Admin is provisioned from the `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` values in your environment. Change that password immediately after the first login.*

---

### Step 3: Deploy `apps/web` on Vercel
1. In Vercel, click **Add New Project** and import the `HritikPedia` repository.
2. Under **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
3. Add Environment Variables:
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@ep-.../neondb?sslmode=require
   JWT_SECRET=generate-a-strong-64-char-random-secret
   RAZORPAY_KEY_ID=rzp_live_your_actual_key
   RAZORPAY_KEY_SECRET=your_live_razorpay_secret
   RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
   NEXT_PUBLIC_APP_URL=https://hritikpedia.com
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_actual_key
   ```
4. Click **Deploy**. Assign your custom domain: `hritikpedia.com`.

---

### Step 4: Deploy `apps/admin` on Vercel
1. Click **Add New Project** and import the same repository again.
2. Under **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/admin`
3. Add Environment Variables:
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@ep-.../neondb?sslmode=require
   JWT_SECRET=same-strong-64-char-secret-as-web-app
   NEXT_PUBLIC_APP_URL=https://hritikpedia.com
   NEXT_PUBLIC_ADMIN_URL=https://admin.hritikpedia.com
   COOKIE_SECURE=true
   ```
   `NEXT_PUBLIC_APP_URL` must stay pointed at the **public web app**, even inside
   the admin project — it powers "View store" links, preview links, and
   newsletter unsubscribe URLs.
4. Click **Deploy**. Assign your subdomain: `admin.hritikpedia.com`.

---

### Step 5: Configure Razorpay Live Webhooks
1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Navigate to **Settings > Webhooks > Add New Webhook**.
3. **Webhook URL:** `https://hritikpedia.com/api/webhooks/razorpay`
4. **Secret:** Match the `RAZORPAY_WEBHOOK_SECRET` defined in Step 3.
5. **Active Events:** Check `payment.captured` and `order.paid`.

---

### Step 6: Self-Hosted / VPS Deployment

The repository launchers load configuration from the repository root:

1. Copy `.env.example` to `.env.production` and fill in real values.
   `.env.local` is deliberately **ignored** in production so development URLs and
   secrets cannot leak into a live deployment.
2. Build and start both apps:
   ```bash
   npm ci
   npm run build    # validates production config and bakes NEXT_PUBLIC_* values
   npm start        # serves web on :3000 and admin on :3001
   ```
3. `npm start` fails fast when `DATABASE_URL`, `JWT_SECRET`, or
   `NEXT_PUBLIC_APP_URL` is missing/unsafe. It also refuses to fall back to
   embedded PGlite in production.
4. `NEXT_PUBLIC_*` values are embedded at build time. Re-run `npm run build`
   after changing the public URL or Razorpay key.

For a local production preview without PostgreSQL, set
`ALLOW_EMBEDDED_DB=true` and `ALLOW_LOCAL_PRODUCTION_BUILD=true`, use
`NEXT_PUBLIC_APP_URL=http://localhost:3000`, and run only one app at a time
(PGlite is single-process).

---

## 3. Production Environment Variables Checklist

| Variable Name | Required | Application | Description |
| :--- | :---: | :---: | :--- |
| `DATABASE_URL` | **YES** | Web & Admin | Full PostgreSQL connection string with SSL |
| `JWT_SECRET` | **YES** | Web & Admin | 64+ char high-entropy secret for HMAC JWT signing |
| `RAZORPAY_KEY_ID` | **YES** | Web | Live Razorpay merchant key identifier |
| `RAZORPAY_KEY_SECRET` | **YES** | Web | Live Razorpay merchant key secret |
| `RAZORPAY_WEBHOOK_SECRET` | **YES** | Web | Cryptographic secret for Razorpay webhook verification |
| `NEXT_PUBLIC_APP_URL` | **YES** | Web & Admin | Public web base URL (`https://hritikpedia.com`) |
| `NEXT_PUBLIC_ADMIN_URL` | **YES** | Admin | Admin console URL (`https://admin.hritikpedia.com`) |
| `COOKIE_SECURE` | **YES** | Web & Admin | `true` for HTTPS deployments (leave unset in production to default to secure) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | **YES** | Web | Public checkout key; must match `RAZORPAY_KEY_ID` |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | Seed only | Shared | Initial admin credentials; change after first login |
| `RESEND_API_KEY` / `EMAIL_FROM` | Newsletter | Web & Admin | Required to send campaigns; production broadcasts are blocked without them |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | Optional | Shared | Set to `false` only if your database provider cannot present a trusted certificate |
| `ENABLE_SMS` | Optional | Shared | Set to `false` for zero-budget dev; `true` for live Fast2SMS |
| `ENABLE_WHATSAPP` | Optional | Shared | Set to `false` for zero-budget dev; `true` for Meta Cloud API |
