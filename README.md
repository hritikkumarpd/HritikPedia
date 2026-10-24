<div align="center">

# 🎓 Hritikpedia

### *Stop Searching. Start Learning.*

An enterprise-grade, full-stack educational notes platform engineered from scratch. Features an in-browser secure PDF reader with dynamic anti-piracy watermarking, Razorpay commerce integration, zero-budget WASM PostgreSQL fallback, and a dedicated role-isolated administrative console.

[![Tests](https://img.shields.io/badge/tests-68%20live%20%7C%2044%20unit%20passing-brightgreen)](scripts/security-functional-test.js)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3%20Turbopack-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Embedded%20PGlite%20%7C%20External-336791)](https://github.com/electric-sql/pglite)
[![License](https://img.shields.io/badge/license-UNLICENSED-red)](#)

</div>

---

## 🌟 Key Features

### 📖 Learner Portal (`apps/web` — Port 3000)
- **Comprehensive Notes Directory:** Filterable by Subject, Tag, and Free/Paid status with real-time fuzzy search.
- **In-Browser Secure Reader:** Prevents direct PDF downloading/printing for protected premium notes while providing a crisp, responsive viewing experience.
- **Dynamic Anti-Piracy Watermarking:** User-specific, diagonal semi-transparent watermarks embedded with masked email (`hr*******ar@gmail.com`), unique learner UID, and timestamp.
- **Sample Preview Engine:** Allows learners to preview the first 5–6 pages of premium study notes before purchasing.
- **Razorpay Payment Integration:** Seamless checkout flow with cryptographic HMAC-SHA256 signature verification and coupon code support.
- **Student Dashboard:** Lifetime access library, transaction purchase history, and preference controls.
- **Enterprise SEO:** Complete JSON-LD Schema.org structured data (`Product`, `BreadcrumbList`), OpenGraph metadata, dynamic `sitemap.xml`, and search-engine optimized `robots.txt`.

### 🛡️ Administrative Console (`apps/admin` — Port 3001)
- **Strict Role-Based Access Control (RBAC):** 6-tier capability matrix (`super_admin`, `content_admin`, `billing_admin`, `support_admin`, `security_analyst`, `marketing_admin`).
- **CMS Study Notes Management:** Create, publish, archive, and adjust pricing/preview limits for curriculum notes.
- **Order & Revenue Ledger:** Real-time visibility into all transactions, Razorpay IDs, and financial analytics.
- **SOC Threat Telemetry Feed:** Real-time logging of authentication attempts, brute-force probes, unauthorized privilege escalation, and rate-limit triggers.
- **Administrative Audit Trail:** Immutable actor log tracking administrative actions across the platform.
- **Digital Advertising Engine:** Manage sponsorship placements, top banners, sidebar creatives, and AdSense slots.
- **Newsletter Engine:** Double opt-in compliant subscriber management with CSV export capability.

---

## 🧱 Architecture & Monorepo Structure

```
HritikPedia/
├── apps/
│   ├── web/                    # Public Learner Platform (Port 3000)
│   │   ├── src/app/            # Next.js App Router (35 routes)
│   │   └── src/components/     # UI Components, Reader, and Layouts
│   └── admin/                  # Administrative Console (Port 3001)
│       ├── src/app/            # Admin App Router (22 routes)
│       └── src/components/     # Admin Shell, SOC Telemetry, & CMS
├── packages/
│   └── shared/                 # Shared Monorepo Package (@hritikpedia/shared)
│       └── src/
│           ├── auth.js         # Bcrypt (12 rounds) & JWT sessions
│           ├── db.js           # PostgreSQL Pool + Embedded WASM PGlite
│           ├── watermark.js    # Dynamic user-specific watermark engine
│           ├── permissions.js  # 6-Tier RBAC permission matrix
│           ├── payment.js      # Razorpay HMAC verification & currency
│           ├── messaging.js    # Multi-channel notification dispatch
│           └── validation.js   # Input sanitization & slug generator
├── database/
│   ├── migrations/             # Idempotent SQL schema migrations
│   ├── seeds/                  # Seed curriculum notes and subjects
│   └── migrate.js              # Database migration runner
├── scripts/
│   ├── dev.js                  # Concurrent development launcher
│   ├── start.js                # Production server launcher
│   ├── test-runner.js          # Automated unit & cryptographic test suite
│   └── security-functional-test.js # Live HTTP 68-test security verification
├── Dockerfile                  # Multi-stage production container build
└── docker-compose.yml          # Containerized app + PostgreSQL deployment
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 or higher (v22/v25 recommended)
- **npm**: v10 or higher
- **PostgreSQL**: Optional! An embedded WASM PostgreSQL instance (`PGlite`) runs out-of-the-box in development mode without needing any external database.

### 1. Installation
```bash
git clone https://github.com/hritikkumarpd/HritikPedia.git
cd HritikPedia
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Database Migration & Seeding
```bash
# Run schema migrations and seed initial computer science curriculum
npm run db:seed
```

### 4. Development Servers
```bash
npm run dev
```
- **Web Platform:** [http://localhost:3000](http://localhost:3000)
- **Admin Console:** [http://localhost:3001](http://localhost:3001)

### 5. Running Tests
```bash
# Offline unit, cryptographic & invariant tests (44 tests)
npm test

# Live HTTP security & functional verification suite (68 tests)
node scripts/security-functional-test.js
```

---

## 🔒 Security Hardening

- **SQL Injection Defense:** All queries use parameterized bind variables (`$1, $2`).
- **Strict Role Isolation:** Student sessions attempting to access `/api/admin/*` are immediately rejected with HTTP 401/403.
- **Anti-Account Enumeration:** Password recovery and registration return uniform responses.
- **Path Traversal Protection:** Reader note slugs strictly validated against alphanumeric-hyphen whitelist.
- **Content Security Headers:** Configured with `nosniff`, `strict-origin-when-cross-origin`, `Strict-Transport-Security`, and restrictive `Permissions-Policy`.
- **Absolute Scope Discipline:** Built strictly for educational notes. **Zero test series, quizzes, or mock exams** exist in the codebase or schema.

---

## 🚢 Production Deployment

### Option 1: Vercel (Recommended)
1. Import repository into Vercel as **Project 1** (`apps/web` root directory).
2. Import repository into Vercel as **Project 2** (`apps/admin` root directory).
3. Connect both to a managed serverless PostgreSQL database (e.g., [Neon.tech](https://neon.tech)).

### Option 2: Docker Compose
```bash
docker compose up -d --build
```

---

<div align="center">
  <sub>Engineered with precision for <strong>Hritikpedia</strong>. Built with Pure Modern JavaScript.</sub>
</div>
