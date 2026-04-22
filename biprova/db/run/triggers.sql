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

CREATE OR REPLACE FUNCTION check_project_full()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM project_roles
        WHERE project_id = NEW.project_id
          AND is_filled = false
    ) THEN
        UPDATE projects
        SET status = 'full'
        WHERE id = NEW.project_id
          AND status = 'open';
    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_check_project_full
    AFTER UPDATE OF is_filled ON project_roles
    FOR EACH ROW
    WHEN (NEW.is_filled = true AND OLD.is_filled = false)
    EXECUTE FUNCTION check_project_full();

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
-- TRIGGER: project_members boşalınca projeyi sil
-- ============================================================

create or replace function delete_project_on_empty_members()
returns trigger language plpgsql security definer as $$
begin
    -- Proje zaten siliniyorsa (cascade sonucu bu trigger tetiklendi) tekrar silme
    if not exists (select 1 from projects where id = old.project_id) then
        return old;
    end if;

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
        update public.users
        set last_sign_in_at = new.last_sign_in_at
        where id = new.id;
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
