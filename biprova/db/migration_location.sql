-- ============================================================
-- LOCATION MIGRATION — Yakın Proje Arama Altyapısı
-- Çalıştır: Supabase Dashboard → SQL Editor
-- Sıra: schema.sql'den sonra
-- ============================================================

-- 1. PostGIS extension
create extension if not exists postgis;

-- 2. projects tablosuna konum sütunu ekle
alter table projects
    add column if not exists location geography(Point, 4326);

-- 3. Spatial index (ST_DWithin sorguları için zorunlu)
create index if not exists projects_location_idx
    on projects using gist(location);

-- ============================================================
-- NEARBY_PROJECTS RPC FUNCTION
-- Kullanım: supabase.rpc('nearby_projects', { lat, lng, radius_km })
-- Dönüş: id, title, city, is_remote, category_id, status,
--         leader_id, created_at, distance_km
-- ============================================================

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
