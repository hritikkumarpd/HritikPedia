# Hritikpedia — SOC Threat Monitoring & Security Operations Guide

> **Security Posture:** Defense-in-depth, zero-trust token verification, and real-time SOC intrusion telemetry.

---

## 1. 6-Tier Role-Based Access Control (RBAC)

Hritikpedia enforces strict principle-of-least-privilege access across 6 distinct roles:

| Role | Domain Scope | Capabilities | Access to Admin Portal |
| :--- | :--- | :--- | :---: |
| `super_admin` | Platform Owner | Full system control: Manage staff roles, configure global policies, issue refunds, view raw SOC logs | **YES** |
| `content_admin`| Academic Content | Create, edit, publish, and delete notes, topics, subjects, and study articles | **YES** |
| `marketing_admin`| Growth & Revenue | Configure ad placements, sponsor banners, manage coupons, review order analytics | **YES** |
| `support_admin` | Learner Assistance | Look up user accounts, verify access entitlements, view order history | **YES** |
| `security_analyst`| Security Operations | Read-only access to live SOC threat feed, telemetry, intrusion logs, and audit trails | **YES** |
| `student` | Public Consumer | Browse catalog, read free notes, view previews, purchase notes, access personal dashboard | **NO (401 Rejection)** |

---

## 2. Security Events Catalog & SOC Threat Codes

Every security-sensitive anomaly is recorded to the PostgreSQL `security_events` table with client IP, User-Agent, and forensic telemetry:

| Event Code | Severity | Trigger Condition | Automated Action |
| :--- | :---: | :--- | :--- |
| `auth:login_failed` | **HIGH** | Bad password submitted on student or staff login | Log attempt, increment IP failure bucket |
| `auth:rate_limit_exceeded` | **MEDIUM** | > 10 requests / 15 min from a single IP address | Return HTTP 429 Too Many Requests |
| `access:denied_pdf` | **HIGH** | Direct attempt to fetch `/api/reader/[slug]` without entitlement | Access blocked; IP logged for piracy forensics |
| `payment:signature_failed` | **CRITICAL**| Razorpay HMAC signature mismatch during payment callback | Transaction aborted; access denied; alert logged |
| `payment:webhook_replay` | **HIGH** | Duplicate Razorpay `event_id` received | Gracefully ignored; prevent double-grant |
| `policy:unauthorized_edit` | **CRITICAL**| Non-admin attempting to invoke `/api/admin/*` | Session rejected; IP logged |

---

## 3. Administrative Mutation Audit Trail

All staff state changes are logged to `audit_logs` with actor email, action code, entity ID, and previous/new mutation state:
- `note:created`: New educational note authored and published
- `note:updated`: Price, description, or topic metadata adjusted
- `user:role_assigned`: Staff member role elevated or lowered
- `user:status_toggled`: Account activated or deactivated
- `order:refunded`: Order refunded and entitlement revoked in single transaction
- `policy:updated`: Watermark opacity, download permission, or device limit modified
- `advertising:updated`: Direct sponsor campaign or AdSense slot toggled

---

## 4. OWASP Web Application Penetration Testing (WAPT) Verification

1. **SQL Injection (SQLi)**: 100% of queries use parameterized placeholders (`$1, $2, ...`) via `query(sql, params)`. Raw string concatenation in SQL is strictly prohibited.
2. **Cross-Site Scripting (XSS)**: React 19 inherently escapes dynamic text expressions. Note content is sanitized via `sanitizeHtml` in `@hritikpedia/shared/validation`.
3. **Cross-Site Request Forgery (CSRF)**: Cookies are issued with `SameSite=Lax`, `HttpOnly=true`, and `Secure=true` in production. State-mutating endpoints require JSON payloads.
4. **Insecure Direct Object Reference (IDOR)**: Reader access does not trust query parameters. The backend verifies ownership via `SELECT id FROM entitlements WHERE user_id = $1 AND note_id = $2 AND status = 'active'`.
5. **Timing Attacks**: Payment signatures and password verifications use constant-time comparisons (`crypto.timingSafeEqual`) to prevent timing side-channel leakage.
