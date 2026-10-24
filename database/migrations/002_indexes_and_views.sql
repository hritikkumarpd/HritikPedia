-- ==============================================================================
-- HRITIKPEDIA POSTGRESQL SCHEMA MIGRATION 002
-- Indexes, Constraints, and Analytical Views
-- ==============================================================================

-- Index on Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Index on Notes
CREATE INDEX IF NOT EXISTS idx_notes_slug ON notes(slug);
CREATE INDEX IF NOT EXISTS idx_notes_subject_id ON notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_is_free ON notes(is_free);
CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_featured ON notes(is_featured);

-- Index on Subjects
CREATE INDEX IF NOT EXISTS idx_subjects_slug ON subjects(slug);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);

-- Index on Orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_note_id ON notes(id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index on Entitlements (Lookup efficiency during PDF access checks)
CREATE INDEX IF NOT EXISTS idx_entitlements_user_note ON entitlements(user_id, note_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_status ON entitlements(status);

-- Index on Security & Audit Logs
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- View: Notes with Subject Details
CREATE OR REPLACE VIEW view_published_notes AS
SELECT 
    n.id,
    n.title,
    n.slug,
    n.description,
    n.page_count,
    n.is_free,
    n.price,
    n.original_price,
    n.has_preview,
    n.preview_pages,
    n.is_featured,
    n.author,
    n.rating,
    n.published_at,
    s.id AS subject_id,
    s.name AS subject_name,
    s.slug AS subject_slug,
    s.code AS subject_code
FROM notes n
JOIN subjects s ON n.subject_id = s.id
WHERE n.status = 'published';
