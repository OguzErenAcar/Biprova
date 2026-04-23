-- ============================================================
-- MIGRATION: Projeden ayrılınca rol serbest bırakılmaz, silinir
--
-- Eski davranış: fn_leave_project → project_roles.filled_by = null, is_filled = false
-- Yeni davranış: o rol tamamen silinir (tekrar aranmaz)
-- ============================================================

-- 1. fn_leave_project: update yerine delete
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

    -- Dolu rolü serbest bırakmak yerine sil
    delete from project_roles
    where project_id = p_project_id and filled_by = v_uid;

    delete from project_members
    where project_id = p_project_id and user_id = v_uid;
end;
$$;

-- 2. fn_leave_team: aynı şekilde update yerine delete
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

    select project_id into v_project_id from teams where id = p_team_id;

    if v_project_id is not null and exists (
        select 1 from project_members
        where project_id = v_project_id and user_id = v_uid
    ) then
        raise exception 'Önce takımın projesinden ayrılmalısınız';
    end if;

    select role_id into v_role_id
    from team_members where team_id = p_team_id and user_id = v_uid;

    -- Rolü serbest bırakmak yerine sil
    if v_role_id is not null then
        delete from project_roles where id = v_role_id;
    end if;

    delete from team_members
    where team_id = p_team_id and user_id = v_uid;
end;
$$;
