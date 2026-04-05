-- ============================================================
-- PROFILE VISIBILITY MIGRATION
-- Çalıştır: Supabase Dashboard → SQL Editor
-- ============================================================

-- users: projeler bölümü görünürlük ayarı
alter table users add column if not exists projects_public boolean not null default true;

-- users: başvurular bölümü görünürlük ayarı
alter table users add column if not exists applications_public boolean not null default true;
alter table users add column if not exists projects_public boolean not null default true;
alter table users add column if not exists applications_public boolean not null default true;
