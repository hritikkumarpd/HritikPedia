-- ==============================================================================
-- HRITIKPEDIA POSTGRESQL SCHEMA MIGRATION 001
-- Clean Normalized Relational Architecture
-- ZERO-BUDGET-FIRST: Full standard PostgreSQL (Foreign Keys, Constraints, Defaults)
-- PURE EDUCATIONAL PLATFORM: NOTES, ARTICLES, TOPICS, AND LEARNING BLUEPRINTS ONLY
-- ==============================================================================

-- 1. Tracking Migrations Table
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student', -- super_admin, content_admin, marketing_admin, support_admin, security_analyst, student
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'BookOpen',
    color VARCHAR(20) DEFAULT '#087BFF',
    note_count INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, slug)
);

-- 5. Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    topic_id INTEGER REFERENCES topics(id) ON DELETE SET NULL,
    topic_label VARCHAR(150),
    exam_category VARCHAR(150) DEFAULT 'Engineering & STET',
    description TEXT NOT NULL,
    page_count INTEGER NOT NULL DEFAULT 1,
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    original_price NUMERIC(10, 2) DEFAULT 0.00,
    has_preview BOOLEAN NOT NULL DEFAULT TRUE,
    preview_pages INTEGER NOT NULL DEFAULT 5,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    file_key VARCHAR(500) NOT NULL, -- Private storage identifier
    status VARCHAR(50) NOT NULL DEFAULT 'published', -- draft, review, published, archived
    download_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    print_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    watermark_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    author VARCHAR(150) NOT NULL DEFAULT 'Hritik Kumar',
    rating NUMERIC(3, 2) DEFAULT 4.90,
    topics_covered JSONB DEFAULT '[]'::jsonb,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Note Versions (Audit Trail of PDF revisions)
CREATE TABLE IF NOT EXISTS note_versions (
    id SERIAL PRIMARY KEY,
    note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_key VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    changelog TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(note_id, version_number)
);

-- 7. Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(150) NOT NULL DEFAULT 'Hritik Kumar',
    reading_time VARCHAR(50) DEFAULT '5 min read',
    status VARCHAR(50) NOT NULL DEFAULT 'published', -- draft, review, published, archived
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Access Policies
CREATE TABLE IF NOT EXISTS access_policies (
    id SERIAL PRIMARY KEY,
    note_id INTEGER NOT NULL UNIQUE REFERENCES notes(id) ON DELETE CASCADE,
    allow_download BOOLEAN NOT NULL DEFAULT FALSE,
    allow_print BOOLEAN NOT NULL DEFAULT FALSE,
    watermark_required BOOLEAN NOT NULL DEFAULT TRUE,
    max_devices INTEGER DEFAULT 3,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Orders & Purchases
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL UNIQUE, -- Internal or Razorpay Order ID (order_...)
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'created', -- created, paid, failed, refunded
    payment_id VARCHAR(100), -- Razorpay Payment ID (pay_...)
    payment_signature VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Entitlements (Granted Access to Paid Notes)
CREATE TABLE IF NOT EXISTS entitlements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE RESTRICT,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, revoked, expired
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime access
    UNIQUE(user_id, note_id)
);

-- 11. Payment Events & Webhook Deduplication
CREATE TABLE IF NOT EXISTS payment_events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(150) NOT NULL UNIQUE,
    provider VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    max_uses INTEGER DEFAULT 100,
    current_uses INTEGER DEFAULT 0,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(100) DEFAULT 'website',
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, unsubscribed, bounced
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Consent Records (GDPR/Compliance audit trail)
CREATE TABLE IF NOT EXISTS consent_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255),
    consent_type VARCHAR(100) NOT NULL, -- newsletter, terms, marketing_opt_in
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Advertising Placements (Configurable Slots)
CREATE TABLE IF NOT EXISTS advertising_placements (
    id SERIAL PRIMARY KEY,
    slot_id VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    format VARCHAR(100) DEFAULT 'responsive',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    ad_type VARCHAR(50) NOT NULL DEFAULT 'sponsor', -- adsense, sponsor, affiliate
    title VARCHAR(200),
    sponsor_name VARCHAR(150),
    link VARCHAR(500),
    banner_text TEXT,
    impression_count BIGINT DEFAULT 0,
    click_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Audit Logs (Admin Actions)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- note:created, note:updated, role:changed, refund:issued
    entity_type VARCHAR(100) NOT NULL, -- note, user, order, policy
    entity_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Security Events (SOC & Threat Monitoring)
CREATE TABLE IF NOT EXISTS security_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- auth:login_failed, access:denied_pdf, rate_limit:exceeded, payment:signature_failed
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(50) NOT NULL,
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
