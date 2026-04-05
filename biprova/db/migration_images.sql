-- ============================================================
-- IMAGE FIELDS MIGRATION
-- Çalıştır: Supabase Dashboard → SQL Editor
-- ============================================================

-- users: cover image (profil kapak fotoğrafı)
alter table users add column if not exists cover_url text;

-- users: cv (PDF)
alter table users add column if not exists cv_url text;

-- users: cv görünürlük ayarı
alter table users add column if not exists cv_public boolean not null default false;

-- news: ikinci resim alanı
alter table news add column if not exists cover_url text;

-- team_posts: media_urls array'i yerine 2 explicit alan
alter table team_posts add column if not exists image_url text;
alter table team_posts add column if not exists cover_url text;
-- Not: media_urls kolonu silinmez, mevcut veriyi önce taşı
-- alter table team_posts drop column media_urls;
