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
--   Değil → rolü serbest bırak → team_members'dan sil
--     → team'in projesi varsa project_members'dan da sil (Triangle/A)
--       → trg_delete_project_on_empty_members son üyeyse projeyi siler
-- Not: lider çıkamaz, fn_dissolve_team kullanmalı
-- ============================================================

create or replace function fn_leave_team(p_team_id uuid)
returns void language plpgsql security definer as $$
declare
    v_uid          uuid := auth.uid();
    v_role_id      uuid;
    v_project_id   uuid;
    v_member_count integer;
begin
    -- Üyelik kontrolü
    if not exists (
        select 1 from team_members
        where team_id = p_team_id and user_id = v_uid
    ) then
        raise exception 'Bu takımda üye değilsiniz';
    end if;

    -- Kalan üye sayısı
    select count(*) into v_member_count
    from team_members where team_id = p_team_id;

    if v_member_count = 1 then
        -- Son kişi (lider dahil): direkt takımı sil
        -- → trg_delete_project_on_team_deleted bağlı projeyi siler
        delete from teams where id = p_team_id;
    else
        -- Lider çıkamaz
        if exists (
            select 1 from teams
            where id = p_team_id and leader_id = v_uid
        ) then
            raise exception 'Takım lideri çıkamaz, takımı feshetmelisiniz';
        end if;

        -- Team'in projesine üyeyse çıkamasın, önce projeden ayrılmalı
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
    end if;
end;
$$;

grant execute on function fn_leave_team(uuid) to authenticated;
