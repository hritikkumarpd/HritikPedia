-- ==============================================================================
-- HRITIKPEDIA MIGRATION 004
-- Production hardening: coupon attribution on orders + password reset tokens
-- ==============================================================================

-- Track which coupon (if any) discounted an order so successful payments can
-- consume exactly one coupon use.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);

-- Single-use, hashed, expiring password reset tokens.
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
