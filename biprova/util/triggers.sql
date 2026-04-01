-- ============================================================
-- TRIGGER: Ekip silinince bağlı projeyi de sil
-- ============================================================

create or replace function delete_project_on_team_deleted()
returns trigger language plpgsql security definer as $$
begin
    if old.project_id is not null then
        delete from projects where id = old.project_id;
    end if;
    return old;
end;
$$;

create or replace trigger trg_delete_project_on_team_deleted
    before delete on teams
    for each row
    execute function delete_project_on_team_deleted();

-- ============================================================
-- TRIGGER: Proje status 'full' olunca otomatik ekip kurar
-- ============================================================

create or replace function create_team_on_project_full()
returns trigger language plpgsql security definer as $$
declare
    new_team_id uuid;
begin
    if new.status = 'full' and (old.status is null or old.status <> 'full') then
        insert into teams (name, leader_id, status, project_id)
        values (new.title || ' ekibi', new.creator_id, 'pending', new.id)
        returning id into new_team_id;

        -- Dolu rollerdeki kullanıcıları ekle
        insert into team_members (team_id, user_id, role_id)
        select new_team_id, pr.filled_by, pr.id
        from project_roles pr
        where pr.project_id = new.id
          and pr.filled_by is not null
        on conflict (team_id, user_id) do nothing;

        -- Creator hiçbir rol doldurmadıysa yine de ekip üyesi olsun
        insert into team_members (team_id, user_id, role_id)
        values (new_team_id, new.creator_id, null)
        on conflict (team_id, user_id) do nothing;

        -- Projeyi yeni ekibe bağla
        update projects
        set team_id = new_team_id
        where id = new.id;
    end if;

    return new;
end;
$$;

create or replace trigger trg_create_team_on_project_full
    after update on projects
    for each row
    execute function create_team_on_project_full();

-- ============================================================
-- TRIGGER: Proje kurulunca creator'ı project_members'a ekle
-- ============================================================

create or replace function pm_on_project_created()
returns trigger language plpgsql security definer as $$
begin
    insert into project_members(project_id, user_id, role)
    values (new.id, new.creator_id, 'creator')
    on conflict do nothing;
    return new;
end;
$$;

create or replace trigger trg_pm_project_created
    after insert on projects
    for each row
    execute function pm_on_project_created();

-- ============================================================
-- TRIGGER: Başvuru kabul edilince üyeyi project_members'a ekle
-- ============================================================

create or replace function pm_on_application_accepted()
returns trigger language plpgsql security definer as $$
begin
    if new.status = 'accepted' and (old.status is null or old.status <> 'accepted') then
        insert into project_members(project_id, user_id, role)
        values (new.project_id, new.user_id, 'member')
        on conflict do nothing;
    end if;
    return new;
end;
$$;

create or replace trigger trg_pm_application_accepted
    after update on applications
    for each row
    execute function pm_on_application_accepted();

-- ============================================================
-- TRIGGER: Ekipten ayrılınca project_roles'u sıfırla
-- ============================================================

create or replace function reset_role_on_team_member_removed()
returns trigger language plpgsql security definer as $$
declare
    v_project_id uuid;
begin
    -- Bu ekibin bağlı olduğu projeyi bul
    select project_id into v_project_id
    from teams
    where id = old.team_id;

    if v_project_id is null then
        return old;
    end if;

    -- Kullanıcının doldurduğu rolü sıfırla
    update project_roles
    set is_filled = false,
        filled_by = null
    where project_id = v_project_id
      and filled_by = old.user_id;

    -- project_members'dan çıkar (creator dahil herkesi)
    delete from project_members
    where project_id = v_project_id
      and user_id = old.user_id;

    return old;
end;
$$;

create or replace trigger trg_reset_role_on_team_member_removed
    after delete on team_members
    for each row
    execute function reset_role_on_team_member_removed();

-- ============================================================
-- TRIGGER: project_members boşalınca projeyi sil
-- ============================================================

create or replace function delete_project_on_empty_members()
returns trigger language plpgsql security definer as $$
begin
    if not exists (
        select 1 from project_members where project_id = old.project_id
    ) then
        delete from projects where id = old.project_id;
    end if;
    return old;
end;
$$;

create or replace trigger trg_delete_project_on_empty_members
    after delete on project_members
    for each row
    execute function delete_project_on_empty_members();


