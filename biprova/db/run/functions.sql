-- ============================================================
-- BUSINESS LOGIC FUNCTIONS
-- Sıra: 1-proje_fesih, 2-team_fesih, 3-proje_cikis, 4-team_cikis
-- ============================================================


-- ============================================================
-- NEARBY PROJECTS (PostGIS ile yakın proje arama)
-- Kullanım: supabase.rpc('nearby_projects', { lat, lng, radius_km })
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


-- ============================================================
-- CV URL GİZLİLİĞİ (PostgREST computed column)
-- Kullanım: ?select=...,cv_url_safe
-- Kural: kendi profili veya cv_public = true → göster; aksi → null
-- ============================================================

create or replace function public.users_cv_url_safe(u users)
returns text language sql stable security definer as $$
    select case
        when u.id = auth.uid()  then u.cv_url
        when u.cv_public = true then u.cv_url
        else null
    end;
$$;


-- ============================================================
-- 1. PROJE FESİH (Lider projeyi fesheder)
-- Akış: proje sil → cascade: project_roles, applications,
--       project_members silinir; teams.project_id → null (FK set null)
-- ============================================================

create or replace function fn_dissolve_project(p_project_id uuid)
returns void language plpgsql security definer as $$
declare
    v_team_id uuid;
begin
    if not exists (
        select 1 from projects
        where id = p_project_id and leader_id = auth.uid()
    ) then
        raise exception 'Yetkisiz: sadece proje lideri feshedebilir';
    end if;

    -- Bağlı ekip varsa: project_id'yi null yap → sil
    -- project_id null olunca trg_delete_project_on_team_deleted projeyi silmez
    select id into v_team_id from teams where project_id = p_project_id limit 1;
    if v_team_id is not null then
        update teams set project_id = null where id = v_team_id;
        delete from teams where id = v_team_id;
    end if;

    -- Projeyi sil: cascade → project_roles, applications, project_members
    delete from projects where id = p_project_id;
end;
$$;

grant execute on function fn_dissolve_project(uuid) to authenticated;

-- ============================================================
-- 2. TEAM FESİH (Lider takımı fesheder)
-- Akış: team sil
--   → trg_delete_project_on_team_deleted → bağlı projeyi siler
--   → cascade: team_members, messages silinir
--   → project silinince cascade: project_roles, applications,
--     project_members silinir
-- ============================================================

create or replace function fn_dissolve_team(p_team_id uuid)
returns void language plpgsql security definer as $$
begin
    if not exists (
        select 1 from teams
        where id = p_team_id and leader_id = auth.uid()
    ) then
        raise exception 'Yetkisiz: sadece takım lideri feshedebilir';
    end if;

    delete from teams where id = p_team_id;
end;
$$;

grant execute on function fn_dissolve_team(uuid) to authenticated;

-- ============================================================
-- 3. PROJE ÇIKIŞ (Üye projeden ayrılır)
-- Akış: rolü varsa serbest bırak → project_members'dan sil
--   → trg_delete_project_on_empty_members → son üyeyse projeyi siler
-- Not: lider çıkamaz, fn_dissolve_project kullanmalı
-- ============================================================

create or replace function fn_leave_project(p_project_id uuid)
returns void language plpgsql security definer as $$
declare
    v_uid uuid := auth.uid();
begin
    if not exists (
        select 1 from project_members
        where project_id = p_project_id and user_id = v_uid
    ) then
        raise exception 'Bu projede üye değilsiniz';
    end if;

    if exists (
        select 1 from project_members
        where project_id = p_project_id and user_id = v_uid and role = 'leader'
    ) then
        raise exception 'Proje lideri çıkamaz, projeyi feshetmelisiniz';
    end if;

    -- Dolu rolü varsa serbest bırak
    update project_roles
    set filled_by = null, is_filled = false
    where project_id = p_project_id and filled_by = v_uid;

    -- project_members'dan sil
    -- → trg_delete_project_on_empty_members son kişiyse projeyi siler
    delete from project_members
    where project_id = p_project_id and user_id = v_uid;
end;
$$;

grant execute on function fn_leave_project(uuid) to authenticated;

-- ============================================================
-- 4. TEAM ÇIKIŞ (Üye takımdan ayrılır)
-- Akış:
--   Son kişi → team sil
--     → trg_delete_project_on_team_deleted → bağlı projeyi siler
--   Değil → lider kontrolü → projede üyeyse hata (önce fn_leave_project)
--        → rolü serbest bırak → team_members'dan sil
-- Not: lider son kişi değilse çıkamaz, fn_dissolve_team kullanmalı
-- ============================================================

create or replace function fn_leave_team(p_team_id uuid)
returns void language plpgsql security definer as $$
declare
    v_uid        uuid := auth.uid();
    v_role_id    uuid;
    v_project_id uuid;
begin
    if not exists (
        select 1 from team_members
        where team_id = p_team_id and user_id = v_uid
    ) then
        raise exception 'Bu takımda üye değilsiniz';
    end if;

    if exists (
        select 1 from teams
        where id = p_team_id and leader_id = v_uid
    ) then
        raise exception 'Takım lideri çıkamaz, takımı feshetmelisiniz';
    end if;

    -- Takımın projesine üyeyse çıkamasın, önce projeden ayrılmalı
    select project_id into v_project_id from teams where id = p_team_id;

    if v_project_id is not null and exists (
        select 1 from project_members
        where project_id = v_project_id and user_id = v_uid
    ) then
        raise exception 'Önce takımın projesinden ayrılmalısınız';
    end if;

    -- Rolü varsa project_roles'da serbest bırak
    select role_id into v_role_id
    from team_members where team_id = p_team_id and user_id = v_uid;

    if v_role_id is not null then
        update project_roles
        set filled_by = null, is_filled = false
        where id = v_role_id;
    end if;

    delete from team_members
    where team_id = p_team_id and user_id = v_uid;
end;
$$;

grant execute on function fn_leave_team(uuid) to authenticated;

-- ============================================================
-- 5. PROJE LİDER TRANSFER
-- Akış: leader_id güncelle → project_members rolleri değiştir
-- Sonrasında fn_leave_project çağrılır
-- ============================================================

create or replace function fn_transfer_project_leader(
    p_project_id    uuid,
    p_new_leader_id uuid
)
returns void language plpgsql security definer as $$
declare
    v_uid uuid := auth.uid();
begin
    if not exists (
        select 1 from projects
        where id = p_project_id and leader_id = v_uid
    ) then
        raise exception 'Yetkisiz: sadece proje lideri transfer edebilir';
    end if;

    if not exists (
        select 1 from project_members
        where project_id = p_project_id and user_id = p_new_leader_id
    ) then
        raise exception 'Seçilen kişi bu projenin üyesi değil';
    end if;

    update projects
    set leader_id = p_new_leader_id
    where id = p_project_id;

    -- Bağlı ekip varsa teams.leader_id de güncelle
    update teams
    set leader_id = p_new_leader_id
    where project_id = p_project_id;

    -- Eski lider → member, yeni lider → leader
    update project_members
    set role = 'member'
    where project_id = p_project_id and user_id = v_uid;

    update project_members
    set role = 'leader'
    where project_id = p_project_id and user_id = p_new_leader_id;
end;
$$;

grant execute on function fn_transfer_project_leader(uuid, uuid) to authenticated;

-- ============================================================
-- 6. TEAM LİDER TRANSFER
-- Akış: leader_id güncelle
-- Sonrasında fn_leave_team çağrılır
-- ============================================================

create or replace function fn_transfer_team_leader(
    p_team_id      uuid,
    p_new_leader_id uuid
)
returns void language plpgsql security definer as $$
declare
    v_uid uuid := auth.uid();
begin
    if not exists (
        select 1 from teams
        where id = p_team_id and leader_id = v_uid
    ) then
        raise exception 'Yetkisiz: sadece takım lideri transfer edebilir';
    end if;

    if not exists (
        select 1 from team_members
        where team_id = p_team_id and user_id = p_new_leader_id
    ) then
        raise exception 'Seçilen kişi bu takımın üyesi değil';
    end if;

    update teams
    set leader_id = p_new_leader_id
    where id = p_team_id;
end;
$$;

grant execute on function fn_transfer_team_leader(uuid, uuid) to authenticated;
