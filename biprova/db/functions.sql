-- ============================================================
-- BUSINESS LOGIC FUNCTIONS
-- Sıra: 1-proje_fesih, 2-team_fesih, 3-proje_cikis, 4-team_cikis
-- ============================================================

-- ============================================================
-- 1. PROJE FESİH (Lider projeyi fesheder)
-- Akış: proje sil → cascade: project_roles, applications,
--       project_members silinir; bağlı team varsa no_project olur
-- ============================================================

create or replace function fn_dissolve_project(p_project_id uuid)
returns void language plpgsql security definer as $$
begin
    -- Sadece proje kurucusu feshedebilir
    if not exists (
        select 1 from projects
        where id = p_project_id and creator_id = auth.uid()
    ) then
        raise exception 'Yetkisiz: sadece proje kurucusu feshedebilir';
    end if;

    -- Bağlı team varsa no_project yap (proje silinince FK set null olur ama
    -- status otomatik güncellenmez)
    update teams
    set status = 'no_project'
    where project_id = p_project_id;

    -- Projeyi sil:
    --   cascade → project_roles, applications, project_members silinir
    --   FK on delete set null → teams.project_id null olur
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
    -- Sadece takım lideri feshedebilir
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
-- Not: creator çıkamaz, fn_dissolve_project kullanmalı
-- ============================================================

create or replace function fn_leave_project(p_project_id uuid)
returns void language plpgsql security definer as $$
declare
    v_uid uuid := auth.uid();
begin
    -- Üyelik kontrolü
    if not exists (
        select 1 from project_members
        where project_id = p_project_id and user_id = v_uid
    ) then
        raise exception 'Bu projede üye değilsiniz';
    end if;

    -- Creator çıkamaz
    if exists (
        select 1 from project_members
        where project_id = p_project_id and user_id = v_uid and role = 'creator'
    ) then
        raise exception 'Proje kurucusu çıkamaz, projeyi feshetmelisiniz';
    end if;

    -- Dolu rolü varsa serbest bırak
    update project_roles
    set filled_by = null, is_filled = false
    where project_id = p_project_id and filled_by = v_uid;

    -- Rol boşaldıysa proje status'unu open'a çek
    update projects
    set status = 'open'
    where id = p_project_id and status = 'full';

    -- project_members'dan sil
    -- → trg_delete_project_on_empty_members son kişiyse projeyi siler
    delete from project_members
    where project_id = p_project_id and user_id = v_uid;
end;
$$;

grant execute on function fn_leave_project(uuid) to authenticated;
