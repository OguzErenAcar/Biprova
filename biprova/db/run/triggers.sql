-- ============================================================
-- TRIGGER: Proje silinince bağlı ekibi de sil
-- ============================================================

create or replace function delete_team_on_project_deleted()
returns trigger language plpgsql security definer as $$
begin
    delete from teams where project_id = old.id;
    return old;
end;
$$;

create or replace trigger trg_delete_team_on_project_deleted
    before delete on projects
    for each row
    execute function delete_team_on_project_deleted();

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
-- TRIGGER: Tüm roller dolunca projects.status = 'full' yap
-- ============================================================

create or replace function check_project_full()
returns trigger language plpgsql security definer as $$
begin
    if not exists (
        select 1 from project_roles
        where project_id = new.project_id
          and is_filled = false
    ) then
        update projects
        set status = 'full'
        where id = new.project_id
          and status = 'open';
    end if;

    return new;
end;
$$;

create or replace trigger trg_check_project_full
    after update of is_filled on project_roles
    for each row
    when (new.is_filled = true and old.is_filled = false)
    execute function check_project_full();

-- ============================================================
-- TRIGGER: Proje status 'full' olunca otomatik ekip kurar
-- ============================================================

create or replace function create_team_on_project_full()
returns trigger language plpgsql security definer as $$
declare
    new_team_id uuid;
begin
    if new.status = 'full' and (old.status is null or old.status <> 'full') then
        -- Sıfır rollü projeye ekip kurma
        if not exists (select 1 from project_roles where project_id = new.id) then
            return new;
        end if;

        insert into teams (name, leader_id, status, project_id, formed_at, deadline)
        values (new.title || ' ekibi', new.leader_id, 'pending', new.id, now(), now() + interval '24 hours')
        returning id into new_team_id;

        -- Dolu rollerdeki kullanıcıları ekle
        insert into team_members (team_id, user_id, role_id)
        select new_team_id, pr.filled_by, pr.id
        from project_roles pr
        where pr.project_id = new.id
          and pr.filled_by is not null
        on conflict (team_id, user_id) do nothing;

        -- Lider hiçbir rol doldurmadıysa yine de ekip üyesi olsun
        insert into team_members (team_id, user_id, role_id)
        values (new_team_id, new.leader_id, null)
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
-- TRIGGER: Proje kurulunca lideri project_members'a ekle
-- ============================================================

create or replace function pm_on_project_created()
returns trigger language plpgsql security definer as $$
begin
    insert into project_members(project_id, user_id, role)
    values (new.id, new.leader_id, 'leader')
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
-- TRIGGER: Başvuru kabul edilince aynı projedeki diğer
--          bekleyen başvuruları otomatik reddet
-- ============================================================

create or replace function reject_other_applications_on_accepted()
returns trigger language plpgsql security definer as $$
begin
    if new.status = 'accepted' and (old.status is null or old.status <> 'accepted') then
        update applications
        set status = 'rejected'
        where user_id    = new.user_id
          and project_id = new.project_id
          and id         <> new.id
          and status     = 'pending';
    end if;
    return new;
end;
$$;

create or replace trigger trg_reject_other_applications_on_accepted
    after update on applications
    for each row
    execute function reject_other_applications_on_accepted();

-- ============================================================
-- TRIGGER: project_members boşalınca projeyi sil
-- ============================================================

create or replace function delete_project_on_empty_members()
returns trigger language plpgsql security definer as $$
begin
    -- Tek DELETE: proje yoksa 0 satır etkilenir, cascade loop riski yok
    delete from projects
    where id = old.project_id
      and not exists (
          select 1 from project_members where project_id = old.project_id
      );
    return old;
end;
$$;

create or replace trigger trg_delete_project_on_empty_members
    after delete on project_members
    for each row
    execute function delete_project_on_empty_members();

-- ============================================================
-- TRIGGER: Auth user oluşunca public.users'a ekle
-- ============================================================

create or replace function handle_auth_user_created()
returns trigger language plpgsql security definer as $$
declare
    v_badge text := null;
begin
    -- Waitlist'te kayıtlı e-posta ise top100 badge'i ver
    if exists (select 1 from public.waitlist where email = new.email) then
        v_badge := 'top100';
    end if;

    insert into public.users (id, email, name, badge)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        v_badge
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

create or replace trigger trg_auth_user_created
    after insert on auth.users
    for each row execute function handle_auth_user_created();

-- ============================================================
-- TRIGGER: Auth e-posta değişince public.users'ı güncelle
-- ============================================================

create or replace function handle_auth_user_email_updated()
returns trigger language plpgsql security definer as $$
begin
    if new.email is distinct from old.email then
        update public.users
        set email = new.email
        where id = new.id;
    end if;
    return new;
end;
$$;

create or replace trigger trg_auth_user_email_updated
    after update on auth.users
    for each row execute function handle_auth_user_email_updated();

-- ============================================================
-- TRIGGER: Auth user giriş yapınca last_sign_in_at güncelle
-- ============================================================

create or replace function handle_auth_user_login()
returns trigger language plpgsql security definer as $$
begin
    if new.last_sign_in_at is distinct from old.last_sign_in_at then
        -- Profil yoksa oluştur (trg_auth_user_created başarısız olmuşsa fallback)
        insert into public.users (id, email, name, last_sign_in_at)
        values (
            new.id,
            new.email,
            coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
            new.last_sign_in_at
        )
        on conflict (id) do update set last_sign_in_at = excluded.last_sign_in_at;
    end if;
    return new;
end;
$$;

create or replace trigger trg_auth_user_login
    after update on auth.users
    for each row execute function handle_auth_user_login();

-- ============================================================
-- TRIGGER: team_post_likes insert/delete → like_count güncelle
-- ============================================================

create or replace function sync_team_post_like_count()
returns trigger language plpgsql security definer as $$
begin
    if TG_OP = 'INSERT' then
        update team_posts set like_count = like_count + 1 where id = new.post_id;
    elsif TG_OP = 'DELETE' then
        update team_posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    end if;
    return null;
end;
$$;

create or replace trigger trg_sync_team_post_like_count
    after insert or delete on team_post_likes
    for each row execute function sync_team_post_like_count();

-- ============================================================
-- TRIGGER: news_likes insert/delete → like_count güncelle
-- ============================================================

create or replace function sync_news_like_count()
returns trigger language plpgsql security definer as $$
begin
    if TG_OP = 'INSERT' then
        update news set like_count = like_count + 1 where id = new.news_id;
    elsif TG_OP = 'DELETE' then
        update news set like_count = greatest(like_count - 1, 0) where id = old.news_id;
    end if;
    return null;
end;
$$;

create or replace trigger trg_sync_news_like_count
    after insert or delete on news_likes
    for each row execute function sync_news_like_count();

-- ============================================================
-- TRIGGER: Auth user silinince public.users'ı da sil
-- ============================================================

create or replace function handle_auth_user_deleted()
returns trigger language plpgsql security definer as $$
begin
    delete from public.users where id = old.id;
    return old;
end;
$$;

create or replace trigger trg_auth_user_deleted
    before delete on auth.users
    for each row execute function handle_auth_user_deleted();


-- ============================================================
-- TRIGGER: Yeni başvuru gelince proje liderine bildirim
-- ============================================================

create or replace function notify_new_application()
returns trigger language plpgsql security definer as $$
declare
    v_leader_id     uuid;
    v_project_title text;
    v_role_name     text;
    v_applicant     text;
begin
    select p.leader_id, p.title, pr.role_name
    into v_leader_id, v_project_title, v_role_name
    from projects p
    join project_roles pr on pr.id = new.role_id
    where p.id = new.project_id;

    select name into v_applicant from users where id = new.user_id;

    -- Lidere kendi başvurusunu bildirme
    if v_leader_id = new.user_id then
        return new;
    end if;

    perform create_notification(
        v_leader_id,
        'new_application',
        jsonb_build_object(
            'applicant_name', v_applicant,
            'role_name',      v_role_name
        )
    );
    return new;
end;
$$;

create or replace trigger trg_notify_new_application
    after insert on applications
    for each row
    execute function notify_new_application();


-- ============================================================
-- TRIGGER: Başvuru kabul/red edilince başvurana bildirim
-- (reject_other_applications_on_accepted auto-reject'i de kapsar)
-- ============================================================

create or replace function notify_application_status_changed()
returns trigger language plpgsql security definer as $$
declare
    v_project_title text;
    v_role_name     text;
begin
    if new.status = old.status then
        return new;
    end if;

    if new.status not in ('accepted', 'rejected') then
        return new;
    end if;

    select p.title, pr.role_name
    into v_project_title, v_role_name
    from projects p
    join project_roles pr on pr.id = new.role_id
    where p.id = new.project_id;

    perform create_notification(
        new.user_id,
        case new.status
            when 'accepted' then 'application_accepted'
            when 'rejected' then 'application_rejected'
        end,
        jsonb_build_object(
            'project_title', v_project_title,
            'role_name',     v_role_name
        )
    );
    return new;
end;
$$;

create or replace trigger trg_notify_application_status_changed
    after update of status on applications
    for each row
    execute function notify_application_status_changed();


-- ============================================================
-- TRIGGER: Ekip kurulunca tüm üyelere bildirim
-- teams INSERT anında team_members henüz yok →
-- project_roles.filled_by + leader_id'den okuyoruz
-- ============================================================

create or replace function notify_team_formed()
returns trigger language plpgsql security definer as $$
declare
    v_project_title text;
    v_uid           uuid;
begin
    if new.project_id is null then
        return new;
    end if;

    select title into v_project_title from projects where id = new.project_id;

    for v_uid in
        select filled_by
        from project_roles
        where project_id = new.project_id
          and filled_by is not null
        union
        select new.leader_id
    loop
        perform create_notification(
            v_uid,
            'team_formed',
            jsonb_build_object('project_title', v_project_title)
        );
    end loop;

    return new;
end;
$$;

create or replace trigger trg_notify_team_formed
    after insert on teams
    for each row
    execute function notify_team_formed();


-- ============================================================
-- TRIGGER: Üye ekipten çıkarılınca bildirim
-- Ekip feshedilince cascade delete olur → team yoksa bildirim gönderme
-- ============================================================

create or replace function notify_removed_from_team()
returns trigger language plpgsql security definer as $$
declare
    v_project_title text;
    v_leader_id     uuid;
begin
    -- Ekip hâlâ var mı? Fesih cascade'inde yok → bildirim gönderme
    if not exists (select 1 from teams where id = old.team_id) then
        return old;
    end if;

    select p.title, t.leader_id
    into v_project_title, v_leader_id
    from teams t
    left join projects p on p.id = t.project_id
    where t.id = old.team_id;

    -- Lider kendi kendine çıkıyorsa (fn_leave_team leader guard'ı var ama yine de)
    if old.user_id = v_leader_id then
        return old;
    end if;

    perform create_notification(
        old.user_id,
        'removed_from_team',
        jsonb_build_object('project_title', coalesce(v_project_title, 'Ekip'))
    );
    return old;
end;
$$;

create or replace trigger trg_notify_removed_from_team
    after delete on team_members
    for each row
    execute function notify_removed_from_team();


-- ============================================================
-- TRIGGER: Proje liderliği devredilince yeni lidere bildirim
-- fn_transfer_project_leader projects.leader_id'yi günceller
-- ============================================================

create or replace function notify_new_leader()
returns trigger language plpgsql security definer as $$
begin
    if new.leader_id is distinct from old.leader_id then
        perform create_notification(
            new.leader_id,
            'new_leader',
            jsonb_build_object('project_title', new.title)
        );
    end if;
    return new;
end;
$$;

create or replace trigger trg_notify_new_leader
    after update of leader_id on projects
    for each row
    execute function notify_new_leader();


-- ============================================================
-- TRIGGER: Proje silinince üyelere bildirim
-- BEFORE DELETE: cascade başlamadan üyeleri yakala
-- ============================================================

create or replace function notify_project_deleted()
returns trigger language plpgsql security definer as $$
declare
    v_uid uuid;
begin
    for v_uid in
        select user_id
        from project_members
        where project_id = old.id
          and user_id <> old.leader_id  -- lidere gönderme, o sildi
    loop
        perform create_notification(
            v_uid,
            'project_deleted',
            jsonb_build_object('project_title', old.title)
        );
    end loop;

    return old;
end;
$$;

create or replace trigger trg_notify_project_deleted
    before delete on projects
    for each row
    execute function notify_project_deleted();
