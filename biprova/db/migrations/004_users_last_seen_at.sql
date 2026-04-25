-- ============================================================
-- Migration 004 — users.last_seen_at
--
-- Dashboard ziyaretini takip eder.
-- İlk giriş (null) veya 3+ gün sonraki girişte
-- "Biprova nedir?" diyaloğu gösterilir.
-- ============================================================

alter table users
    add column if not exists last_seen_at timestamptz;
