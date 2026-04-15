-- ============================================================
-- FULL MIGRATION
-- Çalıştır: Supabase Dashboard → SQL Editor
-- Sıra: schema.sql'den sonra
-- ============================================================


-- ============================================================
-- 1. LOCATION — Yakın Proje Arama Altyapısı
-- ============================================================

-- PostGIS extension
create extension if not exists postgis;

-- projects tablosuna konum sütunu ekle
alter table projects
    add column if not exists location geography(Point, 4326);

-- Spatial index (ST_DWithin sorguları için zorunlu)
create index if not exists projects_location_idx
    on projects using gist(location);

-- NEARBY_PROJECTS RPC FUNCTION
-- Kullanım: supabase.rpc('nearby_projects', { lat, lng, radius_km })
create or replace function nearby_projects(
    lat       float,
    lng       float,
    radius_km int default 50
)
returns table (
    id          uuid,
    title       text,
    city        text,
    is_remote   boolean,
    category_id uuid,
    status      text,
    leader_id   uuid,
    created_at  timestamp,
    distance_km float
)
language sql
stable
security definer
as $$
    select
        p.id,
        p.title,
        p.city,
        p.is_remote,
        p.category_id,
        p.status,
        p.leader_id,
        p.created_at,
        round(
            (ST_Distance(
                p.location,
                ST_Point(lng, lat)::geography
            ) / 1000.0)::numeric,
            1
        )::float as distance_km
    from projects p
    where
        p.status = 'open'
        and p.location is not null
        and ST_DWithin(
            p.location,
            ST_Point(lng, lat)::geography,
            radius_km * 1000
        )
    order by distance_km
    limit 50;
$$;

grant execute on function nearby_projects(float, float, int) to authenticated, anon;


-- ============================================================
-- 2. IMAGE FIELDS
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

-- team_posts: birden fazla resim desteği (sıralı array)
alter table team_posts add column if not exists image_urls text[] not null default '{}';


-- ============================================================
-- 3. PROFILE VISIBILITY
-- ============================================================

-- users: profil bölümü görünürlük ayarları
alter table users add column if not exists projects_public     boolean not null default true;
alter table users add column if not exists teams_public        boolean not null default true;
alter table users add column if not exists applications_public boolean not null default false;


-- ============================================================
-- 4. REALTIME
-- ============================================================

alter table messages replica identity full;


-- ============================================================
-- 5. USER LOCATION
-- ============================================================

-- users: is_remote kaldır (remote kavramı proje seviyesinde)
alter table users drop column if exists is_remote;

-- users: konum ekle (city reverse geocoding için kullanılır)
alter table users add column if not exists location geography(Point, 4326);

create index if not exists users_location_idx
    on users using gist(location);


-- ============================================================
-- 6. BADGES
-- ============================================================

create table if not exists badges (
    id         uuid primary key default uuid_generate_v4(),
    badge_name text not null unique,
    image_url  text not null,
    created_at timestamp default now()
);
