create extension if not exists "uuid-ossp";
create extension if not exists postgis;

-- ============================================================
-- LOOKUP TABLES
-- ============================================================

create table skills (
    id   uuid primary key default uuid_generate_v4(),
    name text unique not null,
    slug text
);

create table project_categories (
    id   uuid primary key default uuid_generate_v4(),
    name text unique not null,
    slug text unique not null
);

create table cities (
    id   uuid primary key default uuid_generate_v4(),
    name text unique not null,
    slug text unique not null
);

-- ============================================================
-- CORE TABLES
-- ============================================================

create table users (
    id           uuid primary key default uuid_generate_v4(),
    email        text unique not null,
    name         text not null,
    avatar_url   text,
    cover_url    text,
    cv_url       text,
    cv_public    boolean not null default false,
    bio          text,
    city         text,
    location     geography(Point, 4326),
    linkedin_url text,
    badge        text,
    role         text default 'user',         -- 'user' | 'admin'
    plan         text default 'free',         -- 'free' | 'paid'
    max_teams        integer default 1,
    max_projects     integer default 1,
    projects_public     boolean not null default true,
    teams_public        boolean not null default true,
    applications_public boolean not null default false,
    last_sign_in_at  timestamp,
    last_sign_out_at timestamp,
    created_at       timestamp default now()
);

create table teams (
    id           uuid primary key default uuid_generate_v4(),
    name         text,
    leader_id    uuid references users(id) on delete set null,
    status       text default 'pending',      -- 'pending' | 'active' | 'no_project'
    project_id   uuid,                        -- fk eklenir aşağıda
    formed_at    timestamp default now(),
    activated_at timestamp,
    deadline     timestamp
);

create table projects (
    id          uuid primary key default uuid_generate_v4(),
    leader_id   uuid references users(id) on delete cascade,
    team_id     uuid references teams(id) on delete set null,
    title       text not null,
    description text,
    city        text,
    location    geography(Point, 4326),
    is_remote   boolean default false,
    category_id uuid references project_categories(id) on delete set null,
    status      text default 'open',          -- 'open' | 'full' | 'active' | 'completed' | 'cancelled'
    created_at  timestamp default now()
);

alter table teams
    add constraint fk_teams_project foreign key (project_id) references projects(id) on delete set null;

create table user_skills (
    user_id  uuid references users(id) on delete cascade,
    skill_id uuid references skills(id) on delete cascade,
    primary key (user_id, skill_id)
);

create table project_roles (
    id         uuid primary key default uuid_generate_v4(),
    project_id uuid references projects(id) on delete cascade,
    role_name  text not null,
    is_filled  boolean default false,
    filled_by  uuid references users(id) on delete set null
);

create table project_role_skills (
    role_id  uuid references project_roles(id) on delete cascade,
    skill_id uuid references skills(id) on delete cascade,
    primary key (role_id, skill_id)
);

create table applications (
    id         uuid primary key default uuid_generate_v4(),
    project_id uuid references projects(id) on delete cascade,
    user_id    uuid references users(id) on delete cascade,
    role_id    uuid references project_roles(id) on delete cascade,
    note       text,
    status     text default 'pending',        -- 'pending' | 'accepted' | 'rejected'
    created_at timestamp default now(),
    constraint uq_applications_user_role unique (user_id, role_id)
);

-- M2M: bir kullanıcının birden çok projesi, bir projenin birden çok üyesi
create table project_members (
    project_id uuid references projects(id) on delete cascade,
    user_id    uuid references users(id) on delete cascade,
    role       text not null default 'member', -- 'leader' | 'member'
    joined_at  timestamp default now(),
    primary key (project_id, user_id)
);

create table team_members (
    id          uuid primary key default uuid_generate_v4(),
    team_id     uuid references teams(id) on delete cascade,
    user_id     uuid references users(id) on delete cascade,
    role_id     uuid references project_roles(id) on delete set null,
    has_biprova boolean default false,
    joined_at   timestamp default now(),
    constraint uq_team_members_team_user unique (team_id, user_id)
);

create table messages (
    id         uuid primary key default uuid_generate_v4(),
    team_id    uuid references teams(id) on delete cascade,
    sender_id  uuid references users(id) on delete cascade,
    content    text not null,
    created_at timestamp default now()
);

create table team_posts (
    id         uuid primary key default uuid_generate_v4(),
    team_id    uuid references teams(id) on delete cascade,
    author_id  uuid references users(id) on delete cascade,
    project_id uuid references projects(id) on delete set null,
    content    text not null,
    image_url  text,
    cover_url  text,
    image_urls text[] not null default '{}',
    like_count integer default 0,
    created_at timestamp default now()
);

create table team_post_likes (
    post_id    uuid references team_posts(id) on delete cascade,
    user_id    uuid references users(id) on delete cascade,
    created_at timestamp default now(),
    primary key (post_id, user_id)
);

create table news (
    id           uuid primary key default uuid_generate_v4(),
    author_id    uuid references users(id) on delete set null,
    title        text not null,
    content      text not null,
    image_url    text,
    cover_url    text,
    tags         text[],
    view_count   integer default 0,
    like_count   integer default 0,
    is_published boolean default false,
    published_at timestamp,
    created_at   timestamp default now()
);

create table news_likes (
    news_id    uuid references news(id) on delete cascade,
    user_id    uuid references users(id) on delete cascade,
    created_at timestamp default now(),
    primary key (news_id, user_id)
);

create table notifications (
    id         uuid primary key default uuid_generate_v4(),
    user_id    uuid references users(id) on delete cascade,
    type       text not null,
    payload    jsonb,
    is_read    boolean default false,
    created_at timestamp default now()
);

create table waitlist (
    id         uuid primary key default uuid_generate_v4(),
    email      text unique not null,
    created_at timestamp default now()
);

create table badges (
    id         uuid primary key default uuid_generate_v4(),
    badge_name text not null unique,
    image_url  text not null,
    created_at timestamp default now()
);

-- ============================================================
-- REALTIME
-- ============================================================

alter table messages replica identity full;

-- ============================================================
-- INDEXES
-- ============================================================

create index on projects(leader_id);
create index on projects(team_id);
create index on projects(status);
create index on project_roles(project_id);
create index on project_role_skills(role_id);
create index on applications(project_id);
create index on applications(user_id);
create index on project_members(user_id);
create index on project_members(project_id);
create index on team_members(team_id);
create index on team_members(user_id);
create index on team_members(has_biprova) where has_biprova = true;
create index on teams(project_id);
create index on teams(status);
create index on messages(team_id);
create index on team_posts(team_id);
create index on notifications(user_id, is_read);
create index on news(is_published, published_at desc);
create index on users(plan);
create index on projects using gist(location);
create index on users    using gist(location);

-- ============================================================
-- GRANTS
-- ============================================================

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
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
-- 1. PROJE FESİH (Lider projeyi fesheder)
-- Akış: proje sil → cascade: project_roles, applications,
--       project_members silinir; teams.project_id → null (FK set null)
-- ============================================================

create or replace function fn_dissolve_project(p_project_id uuid)
returns void language plpgsql security definer as $$
begin
    -- Sadece proje lideri feshedebilir
    if not exists (
        select 1 from projects
        where id = p_project_id and leader_id = auth.uid()
    ) then
        raise exception 'Yetkisiz: sadece proje lideri feshedebilir';
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
-- Not: lider çıkamaz, fn_dissolve_project kullanmalı
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

    -- Lider çıkamaz
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
    -- Üyelik kontrolü
    if not exists (
        select 1 from team_members
        where team_id = p_team_id and user_id = v_uid
    ) then
        raise exception 'Bu takımda üye değilsiniz';
    end if;

    -- Lider çıkamaz
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
    -- Sadece mevcut lider transfer edebilir
    if not exists (
        select 1 from projects
        where id = p_project_id and leader_id = v_uid
    ) then
        raise exception 'Yetkisiz: sadece proje lideri transfer edebilir';
    end if;

    -- Yeni lider projede üye olmalı
    if not exists (
        select 1 from project_members
        where project_id = p_project_id and user_id = p_new_leader_id
    ) then
        raise exception 'Seçilen kişi bu projenin üyesi değil';
    end if;

    -- projects.leader_id güncelle
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
    -- Sadece mevcut lider transfer edebilir
    if not exists (
        select 1 from teams
        where id = p_team_id and leader_id = v_uid
    ) then
        raise exception 'Yetkisiz: sadece takım lideri transfer edebilir';
    end if;

    -- Yeni lider takımda üye olmalı
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
begin
    insert into public.users (id, email, name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

create or replace trigger trg_auth_user_created
    after insert on auth.users
    for each row execute function handle_auth_user_created();

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
-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

create or replace function is_admin()
returns boolean language sql security definer as $$
    select exists (
        select 1 from users where id = auth.uid() and role = 'admin'
    );
$$;

create or replace function is_team_member(team_uuid uuid)
returns boolean language sql security definer as $$
    select exists (
        select 1 from team_members where team_id = team_uuid and user_id = auth.uid()
    );
$$;

create or replace function is_project_leader(project_uuid uuid)
returns boolean language sql security definer as $$
    select exists (
        select 1 from projects where id = project_uuid and leader_id = auth.uid()
    );
$$;

-- ============================================================
-- ENABLE RLS
-- ============================================================

alter table skills              enable row level security;
alter table project_categories  enable row level security;
alter table cities              enable row level security;
alter table users               enable row level security;
alter table teams               enable row level security;
alter table projects            enable row level security;
alter table user_skills         enable row level security;
alter table project_roles       enable row level security;
alter table project_role_skills enable row level security;
alter table applications        enable row level security;
alter table project_members     enable row level security;
alter table team_members        enable row level security;
alter table messages            enable row level security;
alter table team_posts          enable row level security;
alter table team_post_likes     enable row level security;
alter table news                enable row level security;
alter table news_likes          enable row level security;
alter table notifications       enable row level security;
alter table waitlist            enable row level security;
alter table badges              enable row level security;

-- ============================================================
-- POLICIES
-- ============================================================

-- skills
create policy "skills_read"  on skills for select using (true);
create policy "skills_admin" on skills for all    using (is_admin());

-- project_categories
create policy "categories_read"  on project_categories for select using (true);
create policy "categories_admin" on project_categories for all    using (is_admin());

-- cities
create policy "cities_read"  on cities for select using (true);
create policy "cities_admin" on cities for all    using (is_admin());

-- users
-- Profil okuma login gerektiriyor (email sızıntısını önlemek için)
create policy "users_read"   on users for select using (auth.uid() is not null);
create policy "users_update" on users for update using (id = auth.uid());

-- teams
create policy "teams_read"   on teams for select using (true);
create policy "teams_insert" on teams for insert with check (leader_id = auth.uid());
create policy "teams_update" on teams for update using (leader_id = auth.uid());

-- projects
create policy "projects_read"   on projects for select using (true);
create policy "projects_update" on projects for update using (leader_id = auth.uid());
create policy "projects_delete" on projects for delete using (leader_id = auth.uid());
create policy "projects_insert" on projects for insert with check (
    leader_id = auth.uid()
    and (
        team_id is null
        or exists (
            select 1 from teams t
            where t.id = team_id
              and t.leader_id = auth.uid()
              and t.status in ('active', 'no_project', 'pending')
        )
        or exists (
            select 1 from team_members tm
            where tm.team_id = team_id
              and tm.user_id = auth.uid()
              and tm.has_biprova = true
        )
    )
);

-- user_skills
create policy "user_skills_read"   on user_skills for select using (true);
create policy "user_skills_manage" on user_skills for all    using (user_id = auth.uid());

-- project_roles
create policy "project_roles_read"   on project_roles for select using (true);
create policy "project_roles_manage" on project_roles for all
    using (is_project_leader(project_id));

-- project_role_skills
create policy "role_skills_read"   on project_role_skills for select using (true);
create policy "role_skills_manage" on project_role_skills for all
    using (
        exists (
            select 1 from project_roles pr
            where pr.id = role_id
              and pr.project_id in (select id from projects where leader_id = auth.uid())
        )
    );

-- applications
create policy "applications_own"      on applications for select using (user_id = auth.uid());
create policy "applications_incoming" on applications for select using (is_project_leader(project_id));
create policy "applications_insert"   on applications for insert with check (user_id = auth.uid());
create policy "applications_delete"   on applications for delete using (user_id = auth.uid() and status = 'pending');
create policy "applications_update"   on applications for update using (is_project_leader(project_id));

-- project_members
create policy "pm_read"   on project_members for select using (true);
create policy "pm_manage" on project_members for all    using (is_admin());
create policy "pm_leave"  on project_members for delete using (user_id = auth.uid() and role <> 'leader');

-- team_members
create policy "team_members_read"   on team_members for select using (auth.uid() is not null);
create policy "team_members_insert" on team_members for insert with check (
    exists (select 1 from teams where id = team_id and leader_id = auth.uid())
);
create policy "team_members_delete" on team_members for delete using (
    user_id = auth.uid()
    or exists (select 1 from teams where id = team_id and leader_id = auth.uid())
);

-- messages
create policy "messages_read"   on messages for select using (is_team_member(team_id));
create policy "messages_insert" on messages for insert with check (
    sender_id = auth.uid() and is_team_member(team_id)
);

-- team_posts
-- Gönderiler herkese açık; sadece yazma/silme üyelikle kısıtlı
create policy "team_posts_read"   on team_posts for select using (true);
create policy "team_posts_insert" on team_posts for insert with check (
    author_id = auth.uid() and is_team_member(team_id)
);
create policy "team_posts_update" on team_posts for update using (author_id = auth.uid());
create policy "team_posts_delete" on team_posts for delete using (author_id = auth.uid());

-- team_post_likes
-- Postlar herkese açık olduğundan beğeni sayısı da herkese açık
create policy "post_likes_read"   on team_post_likes for select using (true);
create policy "post_likes_manage" on team_post_likes for all    using (user_id = auth.uid());

-- news
create policy "news_read"  on news for select using (is_published = true);
create policy "news_admin" on news for all    using (is_admin());

-- news_likes
create policy "news_likes_read"   on news_likes for select using (auth.uid() is not null);
create policy "news_likes_manage" on news_likes for all    using (user_id = auth.uid());

-- notifications
create policy "notifications_read"   on notifications for select using (user_id = auth.uid());
create policy "notifications_update" on notifications for update using (user_id = auth.uid());

-- waitlist
create policy "waitlist_insert" on waitlist for insert with check (true);

-- badges
create policy "badges_read"  on badges for select using (true);
create policy "badges_admin" on badges for all    using (is_admin());
-- ============================================================
-- SEED DATA — Biprova Demo
-- Çalıştır: seed_auth.sql'den SONRA
-- ============================================================
--
-- 8 kullanıcı (seed_auth.sql ile eşleşir)
-- 4 proje  → 2 aktif (ekip kuruldu), 2 açık (başvuru aşamasında)
-- 2 ekip   → mesajlar, postlar, beğeniler
-- 4 haber  (2 yayında, 2 taslak)
-- Bildirimler, waitlist, rozetler dahil
-- ============================================================

begin;

-- ============================================================
-- 1. LOOKUP — skills
-- ============================================================

insert into skills (id, name, slug) values
    ('d0000000-0000-0000-0000-000000000001', 'Frontend Geliştirici',       'frontend-gelistirici'),
    ('d0000000-0000-0000-0000-000000000002', 'Backend Geliştirici',        'backend-gelistirici'),
    ('d0000000-0000-0000-0000-000000000003', 'Mobil Geliştirici (iOS)',     'mobil-ios'),
    ('d0000000-0000-0000-0000-000000000004', 'Mobil Geliştirici (Android)', 'mobil-android'),
    ('d0000000-0000-0000-0000-000000000005', 'UI/UX Tasarımcı',            'ui-ux'),
    ('d0000000-0000-0000-0000-000000000006', 'Veri Bilimcisi',             'veri-bilimcisi'),
    ('d0000000-0000-0000-0000-000000000007', 'DevOps Mühendisi',           'devops'),
    ('d0000000-0000-0000-0000-000000000008', 'Proje Yöneticisi',           'proje-yoneticisi'),
    ('d0000000-0000-0000-0000-000000000009', 'Pazarlama Uzmanı',           'pazarlama'),
    ('d0000000-0000-0000-0000-000000000010', 'İçerik Üreticisi',           'icerik-uretici'),
    ('d0000000-0000-0000-0000-000000000011', 'Grafik Tasarımcı',           'grafik-tasarimci'),
    ('d0000000-0000-0000-0000-000000000012', 'Full Stack Geliştirici',     'full-stack'),
    ('d0000000-0000-0000-0000-000000000013', 'Yapay Zeka Mühendisi',       'ai-muhendis'),
    ('d0000000-0000-0000-0000-000000000014', 'Blockchain Geliştirici',     'blockchain'),
    ('d0000000-0000-0000-0000-000000000015', 'Siber Güvenlik Uzmanı',      'siber-guvenlik')
on conflict (id) do nothing;

-- ============================================================
-- 2. LOOKUP — project_categories
-- ============================================================

insert into project_categories (id, name, slug) values
    ('e0000000-0000-0000-0000-000000000001', 'Teknoloji',              'teknoloji'),
    ('e0000000-0000-0000-0000-000000000002', 'E-ticaret',              'e-ticaret'),
    ('e0000000-0000-0000-0000-000000000003', 'Sağlık',                 'saglik'),
    ('e0000000-0000-0000-0000-000000000004', 'Eğitim',                 'egitim'),
    ('e0000000-0000-0000-0000-000000000005', 'Fintek',                 'fintek'),
    ('e0000000-0000-0000-0000-000000000006', 'Oyun',                   'oyun'),
    ('e0000000-0000-0000-0000-000000000007', 'Yapay Zeka',             'yapay-zeka'),
    ('e0000000-0000-0000-0000-000000000008', 'Çevre & Sürdürülebilir', 'cevre')
on conflict (id) do nothing;

-- ============================================================
-- 3. LOOKUP — cities
-- ============================================================

insert into cities (id, name, slug) values
    ('f0000000-0000-0000-0000-000000000001', 'İstanbul', 'istanbul'),
    ('f0000000-0000-0000-0000-000000000002', 'Ankara',   'ankara'),
    ('f0000000-0000-0000-0000-000000000003', 'İzmir',    'izmir'),
    ('f0000000-0000-0000-0000-000000000004', 'Bursa',    'bursa'),
    ('f0000000-0000-0000-0000-000000000005', 'Antalya',  'antalya')
on conflict (id) do nothing;

-- ============================================================
-- 4. LOOKUP — badges
-- ============================================================

insert into badges (id, badge_name, image_url) values
    ('ba000000-0000-0000-0000-000000000001', 'early-adopter', '/badges/early-adopter.png'),
    ('ba000000-0000-0000-0000-000000000002', 'team-builder',  '/badges/team-builder.png'),
    ('ba000000-0000-0000-0000-000000000003', 'innovator',     '/badges/innovator.png'),
    ('ba000000-0000-0000-0000-000000000004', 'connector',     '/badges/connector.png')
on conflict (id) do nothing;

-- ============================================================
-- 5. USERS — public.users (auth.users ile UUID eşleşiyor)
-- ============================================================
-- Not: trg_auth_user_created zaten temel kaydı oluşturdu;
--      bu satırlar profil alanlarını günceller.

insert into users (
    id, email, name, bio, city,
    location, linkedin_url, badge, role, plan
) values
    (
        'a0000000-0000-0000-0000-000000000001',
        'ahmet.yilmaz@example.com', 'Ahmet Yılmaz',
        'İstanbul''da yaşayan full-stack geliştirici. 5 yıldır startup ekosisteminde yer alıyorum.',
        'İstanbul',
        ST_Point(28.9784, 41.0082)::geography,
        'https://linkedin.com/in/ahmetyilmaz',
        'early-adopter', 'admin', 'paid'
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'ayse.kaya@example.com', 'Ayşe Kaya',
        'UI/UX tasarımcısı. Kullanıcı odaklı tasarım ve ürün düşüncesi konusunda tutkulu.',
        'İstanbul',
        ST_Point(28.9500, 41.0150)::geography,
        'https://linkedin.com/in/aysekaya',
        'team-builder', 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'mehmet.demir@example.com', 'Mehmet Demir',
        'React ve TypeScript uzmanı. Performanslı arayüzler geliştirmekten keyif alıyorum.',
        'İstanbul',
        ST_Point(29.0100, 41.0200)::geography,
        'https://linkedin.com/in/mehmetdemir',
        'connector', 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'zeynep.celik@example.com', 'Zeynep Çelik',
        'iOS ve Android uygulama geliştirici. Sağlık teknolojileri alanında 3 yıl deneyimim var.',
        'İzmir',
        ST_Point(27.1287, 38.4192)::geography,
        'https://linkedin.com/in/zeynepcelik',
        null, 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000005',
        'can.ozturk@example.com', 'Can Öztürk',
        'Veri bilimcisi ve girişimci. Fintech ve yapay zeka kesişiminde ürünler üretiyorum.',
        'Ankara',
        ST_Point(32.8597, 39.9334)::geography,
        'https://linkedin.com/in/canozturk',
        'innovator', 'user', 'paid'
    ),
    (
        'a0000000-0000-0000-0000-000000000006',
        'selin.arslan@example.com', 'Selin Arslan',
        'Eğitim teknolojileri alanında proje yöneticisi. EdTech startup''larına mentorluk yapıyorum.',
        'Ankara',
        ST_Point(32.8800, 39.9200)::geography,
        'https://linkedin.com/in/selinarslan',
        null, 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000007',
        'burak.sahin@example.com', 'Burak Şahin',
        'DevOps mühendisi. Cloud infrastructure, Kubernetes ve CI/CD pipeline konularında uzmanım.',
        'İstanbul',
        ST_Point(28.9600, 41.0300)::geography,
        'https://linkedin.com/in/buraksahin',
        null, 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000008',
        'nur.yildiz@example.com', 'Nur Yıldız',
        'İçerik üreticisi ve dijital pazarlama uzmanı. Marka hikayeleri anlatmayı seviyorum.',
        'Bursa',
        ST_Point(29.0600, 40.1830)::geography,
        'https://linkedin.com/in/nuryildiz',
        null, 'user', 'free'
    )
on conflict (id) do update set
    bio          = excluded.bio,
    city         = excluded.city,
    location     = excluded.location,
    linkedin_url = excluded.linkedin_url,
    badge        = excluded.badge,
    role         = excluded.role,
    plan         = excluded.plan;

-- ============================================================
-- 6. USER SKILLS
-- ============================================================

insert into user_skills (user_id, skill_id) values
    -- Ahmet: Backend + Full Stack
    ('a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002'),
    ('a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000012'),
    -- Ayşe: UI/UX + Grafik
    ('a0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000005'),
    ('a0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000011'),
    -- Mehmet: Frontend
    ('a0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001'),
    ('a0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000012'),
    -- Zeynep: iOS + Android
    ('a0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000003'),
    ('a0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004'),
    -- Can: Veri Bilimi + AI
    ('a0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000006'),
    ('a0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000013'),
    -- Selin: Proje Yönetimi + Pazarlama
    ('a0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000008'),
    ('a0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000009'),
    -- Burak: DevOps + Siber Güvenlik
    ('a0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000007'),
    ('a0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000015'),
    -- Nur: İçerik + Pazarlama
    ('a0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000010'),
    ('a0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000009')
on conflict do nothing;

-- ============================================================
-- 7. PROJECTS
-- Not: trg_pm_project_created her projeye lideri otomatik ekler.
-- Aktif projeler 'active' statüsünde ekleniyor (full → team
-- triggerını tetiklememek için).
-- ============================================================

insert into projects (
    id, leader_id, title, description,
    city, location, is_remote, category_id, status, created_at
) values
    -- P1: Yerel Üretici Platformu — ekip kuruldu, aktif
    (
        'b1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Yerel Üretici Platformu',
        'Türkiye''deki küçük üreticileri son tüketiciyle buluşturan bir e-ticaret platformu. '
        'Çiftçiler, el sanatçıları ve küçük esnaf için dijital vitrin.',
        'İstanbul',
        ST_Point(28.9784, 41.0082)::geography,
        false,
        'e0000000-0000-0000-0000-000000000002',
        'active',
        now() - interval '45 days'
    ),
    -- P2: FinFlow — ekip kuruldu, aktif
    (
        'b1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000005',
        'FinFlow — Akıllı Bütçe Yönetimi',
        'Gelir ve gider takibini otomatikleştiren, harcama alışkanlıklarını analiz eden '
        'kişisel finans asistanı. AI destekli tavsiye motoru ile birlikte.',
        'Ankara',
        ST_Point(32.8597, 39.9334)::geography,
        true,
        'e0000000-0000-0000-0000-000000000005',
        'active',
        now() - interval '30 days'
    ),
    -- P3: FitTrack — açık, başvuru alınıyor
    (
        'b1000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000004',
        'FitTrack — Kişisel Sağlık Takip Uygulaması',
        'Günlük hareket, uyku ve beslenme verilerini tek platformda birleştiren mobil uygulama. '
        'Wearable cihazlarla entegrasyon ve doktor paylaşım özelliği planlanıyor.',
        'İzmir',
        ST_Point(27.1287, 38.4192)::geography,
        false,
        'e0000000-0000-0000-0000-000000000003',
        'open',
        now() - interval '10 days'
    ),
    -- P4: EduMentor — açık, başvuru alınıyor
    (
        'b1000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000006',
        'EduMentor — Öğrenciden Uzmana Mentorluk',
        'Üniversite öğrencilerini sektör profesyonelleriyle eşleştiren mentorluk platformu. '
        'Kariyer rehberliği, proje değerlendirme ve networking.',
        'Ankara',
        ST_Point(32.8800, 39.9200)::geography,
        true,
        'e0000000-0000-0000-0000-000000000004',
        'open',
        now() - interval '5 days'
    )
on conflict (id) do nothing;

-- ============================================================
-- 8. PROJECT ROLES
-- ============================================================

insert into project_roles (id, project_id, role_name, is_filled, filled_by) values
    -- P1 rolleri (dolu)
    ('a2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Frontend Geliştirici', true,  'a0000000-0000-0000-0000-000000000003'),
    ('a2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'UI/UX Tasarımcı',      true,  'a0000000-0000-0000-0000-000000000002'),
    -- P2 rolleri (dolu)
    ('a2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Frontend Geliştirici', true,  'a0000000-0000-0000-0000-000000000008'),
    ('a2000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'DevOps Mühendisi',     true,  'a0000000-0000-0000-0000-000000000007'),
    -- P3 rolleri (boş)
    ('a2000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'Mobil Geliştirici (iOS)',     false, null),
    ('a2000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000003', 'Mobil Geliştirici (Android)', false, null),
    ('a2000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003', 'UI/UX Tasarımcı',            false, null),
    -- P4 rolleri (boş)
    ('a2000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000004', 'Backend Geliştirici', false, null),
    ('a2000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000004', 'Veri Bilimcisi',      false, null),
    ('a2000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000004', 'Proje Yöneticisi',    false, null)
on conflict (id) do nothing;

-- ============================================================
-- 9. PROJECT ROLE SKILLS
-- ============================================================

insert into project_role_skills (role_id, skill_id) values
    -- P1-Frontend: Frontend + Full Stack
    ('a2000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001'),
    ('a2000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000012'),
    -- P1-UI/UX: UI/UX + Grafik
    ('a2000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000005'),
    ('a2000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000011'),
    -- P2-Frontend: Frontend
    ('a2000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001'),
    -- P2-DevOps: DevOps
    ('a2000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000007'),
    -- P3-iOS: iOS
    ('a2000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000003'),
    -- P3-Android: Android
    ('a2000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000004'),
    -- P3-UI/UX: UI/UX
    ('a2000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000005'),
    -- P4-Backend: Backend
    ('a2000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000002'),
    -- P4-Veri: Veri Bilimi + AI
    ('a2000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000006'),
    ('a2000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000013'),
    -- P4-PM: Proje Yönetimi
    ('a2000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000008')
on conflict do nothing;

-- ============================================================
-- 10. APPLICATIONS
-- ============================================================

insert into applications (id, project_id, user_id, role_id, note, status, created_at) values
    -- P1: Kabul edilmiş başvurular (geçmiş)
    (
        'a3000000-0000-0000-0000-000000000001',
        'b1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000003',
        'a2000000-0000-0000-0000-000000000001',
        'React ve TypeScript ile 3 yıl deneyimim var, e-ticaret projelerinde çalıştım.',
        'accepted',
        now() - interval '40 days'
    ),
    (
        'a3000000-0000-0000-0000-000000000002',
        'b1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        'a2000000-0000-0000-0000-000000000002',
        'Figma ve kullanıcı araştırması konusunda güçlüyüm, marketplace UX''i ilgimi çekiyor.',
        'accepted',
        now() - interval '38 days'
    ),
    -- P1: Reddedilmiş başvuru
    (
        'a3000000-0000-0000-0000-000000000003',
        'b1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000008',
        'a2000000-0000-0000-0000-000000000001',
        'Full stack geliştirme yapabiliyorum, ekibinize katkı sunmak isterim.',
        'rejected',
        now() - interval '39 days'
    ),
    -- P2: Kabul edilmiş başvurular (geçmiş)
    (
        'a3000000-0000-0000-0000-000000000004',
        'b1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000008',
        'a2000000-0000-0000-0000-000000000003',
        'React ile fintech arayüzleri geliştirdim, dashboard ve grafik konularında deneyimliyim.',
        'accepted',
        now() - interval '25 days'
    ),
    (
        'a3000000-0000-0000-0000-000000000005',
        'b1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000007',
        'a2000000-0000-0000-0000-000000000004',
        'AWS ve GCP''de production ortamları yönettim. Fintech güvenlik gereksinimlerine hakimim.',
        'accepted',
        now() - interval '24 days'
    ),
    -- P3: Bekleyen başvurular
    (
        'a3000000-0000-0000-0000-000000000006',
        'b1000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000002',
        'a2000000-0000-0000-0000-000000000007',
        'Sağlık uygulamaları için kullanıcı araştırması yaptım, mobil UX konusunda deneyimliyim.',
        'pending',
        now() - interval '7 days'
    ),
    (
        'a3000000-0000-0000-0000-000000000007',
        'b1000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000003',
        'a2000000-0000-0000-0000-000000000005',
        'Swift ile 2 yıl iOS uygulama geliştirdim, HealthKit entegrasyonu tecrübem var.',
        'pending',
        now() - interval '5 days'
    ),
    -- P4: Bekleyen başvurular
    (
        'a3000000-0000-0000-0000-000000000008',
        'b1000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000001',
        'a2000000-0000-0000-0000-000000000008',
        'Node.js ve PostgreSQL ile API''ler yazdım, eğitim platformu mimarisine katkı sunabilirim.',
        'pending',
        now() - interval '3 days'
    ),
    (
        'a3000000-0000-0000-0000-000000000009',
        'b1000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000007',
        'a2000000-0000-0000-0000-000000000010',
        'Birden fazla startup projesini sıfırdan yönettim, EdTech alanına geçmek istiyorum.',
        'pending',
        now() - interval '2 days'
    )
on conflict (user_id, role_id) do nothing;

-- ============================================================
-- 11. PROJECT MEMBERS — lider zaten trigger tarafından eklendi;
--     kabul edilen üyeler buraya ekleniyor
-- ============================================================

insert into project_members (project_id, user_id, role, joined_at) values
    -- P1 üyeleri
    ('b1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'member', now() - interval '40 days'),
    ('b1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'member', now() - interval '38 days'),
    -- P2 üyeleri
    ('b1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008', 'member', now() - interval '25 days'),
    ('b1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007', 'member', now() - interval '24 days')
on conflict (project_id, user_id) do nothing;

-- ============================================================
-- 12. TEAMS
-- ============================================================

insert into teams (id, name, leader_id, status, project_id, formed_at, activated_at, deadline) values
    (
        'c1000000-0000-0000-0000-000000000001',
        'Yerel Üretici Platformu Ekibi',
        'a0000000-0000-0000-0000-000000000001',
        'active',
        'b1000000-0000-0000-0000-000000000001',
        now() - interval '35 days',
        now() - interval '34 days',
        null
    ),
    (
        'c1000000-0000-0000-0000-000000000002',
        'FinFlow Ekibi',
        'a0000000-0000-0000-0000-000000000005',
        'active',
        'b1000000-0000-0000-0000-000000000002',
        now() - interval '20 days',
        now() - interval '19 days',
        null
    )
on conflict (id) do nothing;

-- Projeleri ekiplerine bağla
update projects set team_id = 'c1000000-0000-0000-0000-000000000001'
where id = 'b1000000-0000-0000-0000-000000000001';

update projects set team_id = 'c1000000-0000-0000-0000-000000000002'
where id = 'b1000000-0000-0000-0000-000000000002';

-- ============================================================
-- 13. TEAM MEMBERS
-- ============================================================

insert into team_members (id, team_id, user_id, role_id, has_biprova, joined_at) values
    -- T1: Yerel Üretici
    ('a4000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', null,                                  true,  now() - interval '35 days'),
    ('a4000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000001', false, now() - interval '35 days'),
    ('a4000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', false, now() - interval '35 days'),
    -- T2: FinFlow
    ('a4000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', null,                                  true,  now() - interval '20 days'),
    ('a4000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008', 'a2000000-0000-0000-0000-000000000003', false, now() - interval '20 days'),
    ('a4000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007', 'a2000000-0000-0000-0000-000000000004', false, now() - interval '20 days')
on conflict (team_id, user_id) do nothing;

-- ============================================================
-- 14. MESSAGES
-- ============================================================

insert into messages (id, team_id, sender_id, content, created_at) values
    -- T1 sohbeti
    ('a5000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Merhaba ekip! Resmi olarak başlıyoruz. Bu haftaki hedefimiz MVP''nin ana ekranını bitirmek.',
     now() - interval '33 days'),
    ('a5000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003',
     'Harika! Ben ürün listeleme ve filtreleme bileşenlerine başlayacağım. Figma dosyası hazır mı?',
     now() - interval '33 days' + interval '2 hours'),
    ('a5000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
     'Evet, Figma''ya ekledim. Ana sayfayı bitirdim, ürün detay sayfası yarın hazır olur.',
     now() - interval '33 days' + interval '3 hours'),
    ('a5000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Süper. Backend''de kategori ve filtreleme API''lerini bugün açıyorum.',
     now() - interval '32 days'),
    ('a5000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003',
     'Ürün listeleme bitti! PR açtım, review edebilir misin Ahmet?',
     now() - interval '28 days'),
    ('a5000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'İnceledim, çok temiz kod. Merge ettim. Bu haftaki demo için hazırız.',
     now() - interval '27 days'),
    ('a5000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
     'İlk kullanıcı testleri çok olumlu geçti! Birkaç küçük UX düzeltmesi var, bugün paylaşıyorum.',
     now() - interval '14 days'),
    ('a5000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003',
     'Harika haber! Ödeme entegrasyonunu da bitirdim, test ortamında çalışıyor.',
     now() - interval '13 days'),

    -- T2 sohbeti
    ('a5000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005',
     'Ekibimiz tamamlandı! İlk sprint''i planlayalım. Nur, dashboard taslaklarına başlayabilir misin?',
     now() - interval '18 days'),
    ('a5000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008',
     'Tabii! Hangi metrikleri önce göstermek istiyoruz? Aylık harcama, kategori dağılımı ve tasarruf hedefi öneriyorum.',
     now() - interval '18 days' + interval '1 hour'),
    ('a5000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007',
     'CI/CD pipeline''ı kurdum. Her PR otomatik test ve deploy ediliyor. Repo''ya baktınız mı?',
     now() - interval '17 days'),
    ('a5000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005',
     'Mükemmel Burak! Nur, senin önerilerin harika — bu 3 metrik ilk sürümde olacak.',
     now() - interval '17 days' + interval '2 hours'),
    ('a5000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008',
     'Dashboard ilk versiyonu hazır! Grafikleri Recharts ile yaptım, çok pürüzsüz.',
     now() - interval '10 days'),
    ('a5000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005',
     'AI tavsiye modeli ilk testlerde %78 doğruluk aldı. Daha fazla veri ile %90''a çıkarabiliriz.',
     now() - interval '5 days')
on conflict (id) do nothing;

-- ============================================================
-- 15. TEAM POSTS
-- ============================================================

insert into team_posts (
    id, team_id, author_id, project_id,
    content, image_urls, like_count, created_at
) values
    (
        'a6000000-0000-0000-0000-000000000001',
        'c1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'b1000000-0000-0000-0000-000000000001',
        'Yerel Üretici Platformu olarak ilk beta kullanıcılarımızı aldık! '
        '3 hafta içinde 47 üretici kaydoldu ve ilk siparişler gelmeye başladı. '
        'Küçük adımlar, büyük değişimler. Ekibimizle gurur duyuyorum. 🌱',
        '{}',
        12,
        now() - interval '20 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        'b1000000-0000-0000-0000-000000000001',
        'Kullanıcı testlerinden çıkan en önemli bulgu: üreticiler fotoğraf yüklemeyi çok zor buluyordu. '
        'Sürükle-bırak arayüzüne geçtik, terk oranı %40 düştü. Tasarım gerçekten fark yaratıyor.',
        '{}',
        8,
        now() - interval '12 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000003',
        'c1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000005',
        'b1000000-0000-0000-0000-000000000002',
        'FinFlow''un ilk kamuya açık demosu bu Cuma! '
        'AI tavsiye motorumuz 2 haftalık harcama verisinden anlamlı örüntüler çıkarıyor. '
        'Beta kayıtları açık, bağlantıyı profilimden bulabilirsiniz.',
        '{}',
        19,
        now() - interval '7 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000004',
        'c1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000007',
        'b1000000-0000-0000-0000-000000000002',
        'Altyapı güncellemesi: %99.9 uptime hedefiyle yeni yük dengeleme mimarisine geçtik. '
        'Kubernetes cluster''ı tamamen sıfırdan kurdum, artık sıfır downtime deploy yapabiliyoruz.',
        '{}',
        6,
        now() - interval '3 days'
    )
on conflict (id) do nothing;

-- ============================================================
-- 16. TEAM POST LIKES (like_count trigger otomatik güncelliyor
--     ama seed''de direkt sayıyı yazdık; tutarlılık için
--     like satırlarını da ekliyoruz)
-- ============================================================

-- Önce like_count'u sıfırla (trigger tekrar sayar)
update team_posts set like_count = 0;

insert into team_post_likes (post_id, user_id, created_at) values
    -- Post 1 beğenileri
    ('a6000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', now() - interval '19 days'),
    ('a6000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', now() - interval '19 days'),
    ('a6000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', now() - interval '18 days'),
    ('a6000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', now() - interval '18 days'),
    -- Post 2 beğenileri
    ('a6000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', now() - interval '11 days'),
    ('a6000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', now() - interval '11 days'),
    ('a6000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', now() - interval '10 days'),
    -- Post 3 beğenileri
    ('a6000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', now() - interval '6 days'),
    ('a6000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', now() - interval '6 days'),
    ('a6000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', now() - interval '6 days'),
    ('a6000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', now() - interval '5 days'),
    ('a6000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000006', now() - interval '5 days'),
    -- Post 4 beğenileri
    ('a6000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', now() - interval '2 days'),
    ('a6000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000008', now() - interval '2 days')
on conflict do nothing;

-- ============================================================
-- 17. NEWS
-- ============================================================

insert into news (
    id, author_id, title, content, tags,
    view_count, like_count, is_published, published_at, created_at
) values
    (
        'a7000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Biprova''da İlk Ekipler Kuruldu: Türkiye''nin Proje Ekosistemi Büyüyor',
        'Biprova platformu üzerinden kurulan ilk ekipler haberdar edildi. '
        'Yerel Üretici Platformu ve FinFlow gibi projeler, ihtiyaç odaklı eşleşme modelinin '
        'başarısını kanıtlıyor. Platforma kaydolan 200''den fazla kullanıcı arasından 12 ekip '
        'kuruldu, bu ekipler aktif olarak geliştirme süreçlerine başladı.',
        array['ekip', 'startup', 'biprova', 'girişim'],
        234, 0, true, now() - interval '15 days', now() - interval '15 days'
    ),
    (
        'a7000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'Proje Ekiplerini Güçlendiren 5 İhtiyaç Tanımlama Yöntemi',
        'Başarılı projelerin ortak noktası güçlü bir ihtiyaç tanımlamasıdır. '
        'Biprova''daki en aktif liderlerle yaptığımız görüşmelerden çıkan 5 yöntemi derledik: '
        '1) Rol öncesi kullanıcı araştırması, 2) Minimum özellik listesi, 3) Hız-değer matrisi, '
        '4) Yeterlilik haritası, 5) Açık uçlu başvuru notu analizi.',
        array['ipucu', 'liderlik', 'proje-yonetimi'],
        187, 0, true, now() - interval '8 days', now() - interval '8 days'
    ),
    (
        'a7000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'Biprova Mobil Uygulaması Geliyor',
        'iOS ve Android uygulamalarımız beta aşamasına girdi. '
        'Bildirimler, anlık mesajlaşma ve proje keşfetme özellikleri mobilde de tam kapasiteyle çalışacak. '
        'Beta kaydı için bekleme listesine katılabilirsiniz.',
        array['mobil', 'beta', 'duyuru'],
        0, 0, false, null, now() - interval '1 day'
    ),
    (
        'a7000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000001',
        'Fintek ve Sağlık Teknolojilerinde Ekip Kurmanın Zorlukları',
        'Regülasyon yoğun sektörlerde ekip kurmanın bambaşka dinamikleri var. '
        'KVKK, BDDK lisanslama ve sağlık verisi güvenliği gibi konular ekip kompozisyonunu doğrudan etkiliyor. '
        'Bu taslak makale henüz tamamlanmadı.',
        array['fintek', 'saglik', 'regülasyon'],
        0, 0, false, null, now() - interval '2 hours'
    )
on conflict (id) do nothing;

-- ============================================================
-- 18. NEWS LIKES
-- ============================================================

update news set like_count = 0;

insert into news_likes (news_id, user_id, created_at) values
    ('a7000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', now() - interval '14 days'),
    ('a7000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', now() - interval '14 days'),
    ('a7000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', now() - interval '13 days'),
    ('a7000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', now() - interval '7 days'),
    ('a7000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', now() - interval '7 days')
on conflict do nothing;

-- ============================================================
-- 19. NOTIFICATIONS
-- ============================================================

insert into notifications (id, user_id, type, payload, is_read, created_at) values
    -- Zeynep: P3'e yeni başvuru geldi
    (
        'a8000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'new_application',
        '{"project_id":"b100-0000-0000-0000-000000000003","project_title":"FitTrack","applicant_name":"Ayşe Kaya","role_name":"UI/UX Tasarımcı"}',
        false,
        now() - interval '7 days'
    ),
    (
        'a8000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000004',
        'new_application',
        '{"project_id":"b100-0000-0000-0000-000000000003","project_title":"FitTrack","applicant_name":"Mehmet Demir","role_name":"Mobil Geliştirici (iOS)"}',
        false,
        now() - interval '5 days'
    ),
    -- Selin: P4'e yeni başvuru geldi
    (
        'a8000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000006',
        'new_application',
        '{"project_id":"b100-0000-0000-0000-000000000004","project_title":"EduMentor","applicant_name":"Ahmet Yılmaz","role_name":"Backend Geliştirici"}',
        false,
        now() - interval '3 days'
    ),
    (
        'a8000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000006',
        'new_application',
        '{"project_id":"b100-0000-0000-0000-000000000004","project_title":"EduMentor","applicant_name":"Burak Şahin","role_name":"Proje Yöneticisi"}',
        true,
        now() - interval '2 days'
    ),
    -- Mehmet: P1'e başvurusu kabul edildi
    (
        'a8000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000003',
        'application_accepted',
        '{"project_id":"b100-0000-0000-0000-000000000001","project_title":"Yerel Üretici Platformu","role_name":"Frontend Geliştirici"}',
        true,
        now() - interval '40 days'
    ),
    -- Ayşe: P1'e başvurusu kabul edildi
    (
        'a8000000-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000002',
        'application_accepted',
        '{"project_id":"b100-0000-0000-0000-000000000001","project_title":"Yerel Üretici Platformu","role_name":"UI/UX Tasarımcı"}',
        true,
        now() - interval '38 days'
    ),
    -- Nur ve Burak: P2'ye kabul bildirimleri
    (
        'a8000000-0000-0000-0000-000000000007',
        'a0000000-0000-0000-0000-000000000008',
        'application_accepted',
        '{"project_id":"b100-0000-0000-0000-000000000002","project_title":"FinFlow","role_name":"Frontend Geliştirici"}',
        true,
        now() - interval '25 days'
    ),
    (
        'a8000000-0000-0000-0000-000000000008',
        'a0000000-0000-0000-0000-000000000007',
        'application_accepted',
        '{"project_id":"b100-0000-0000-0000-000000000002","project_title":"FinFlow","role_name":"DevOps Mühendisi"}',
        true,
        now() - interval '24 days'
    ),
    -- Nur: P3'e başvurusu reddedildi (P1 için)
    (
        'a8000000-0000-0000-0000-000000000009',
        'a0000000-0000-0000-0000-000000000008',
        'application_rejected',
        '{"project_id":"b100-0000-0000-0000-000000000001","project_title":"Yerel Üretici Platformu","role_name":"Frontend Geliştirici"}',
        true,
        now() - interval '39 days'
    ),
    -- Ahmet: post'una beğeni geldi
    (
        'a8000000-0000-0000-0000-000000000010',
        'a0000000-0000-0000-0000-000000000001',
        'post_liked',
        '{"post_id":"tp00-0000-0000-0000-000000000001","liker_name":"Zeynep Çelik"}',
        false,
        now() - interval '18 days'
    )
on conflict (id) do nothing;

-- ============================================================
-- 20. WAITLIST
-- ============================================================

insert into waitlist (email, created_at) values
    ('emre.yurt@gmail.com',      now() - interval '60 days'),
    ('fatma.ozdemir@hotmail.com', now() - interval '52 days'),
    ('kaan.bulut@outlook.com',   now() - interval '44 days'),
    ('dilan.aksoy@gmail.com',    now() - interval '30 days'),
    ('oguz.kurt@gmail.com',      now() - interval '20 days')
on conflict (email) do nothing;

commit;
-- ============================================================
-- SEED: auth.users — Demo kullanıcıları (Supabase Auth)
-- ============================================================
-- seed.sql çalıştırıldıktan SONRA çalıştırılmalı.
-- Tüm kullanıcıların şifresi: test1234
-- UUID'ler seed.sql ile eşleşiyor.
-- ============================================================

insert into auth.users (
    id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, aud, role,
    instance_id,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, phone_change, phone_change_token, reauthentication_token
)
values
    ('a0000000-0000-0000-0000-000000000001', 'ahmet.yilmaz@example.com', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Ahmet Yılmaz"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '', '', '', '', '', '', ''),
    ('a0000000-0000-0000-0000-000000000002', 'ayse.kaya@example.com',    crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Ayşe Kaya"}',    'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '', '', '', '', '', '', ''),
    ('a0000000-0000-0000-0000-000000000003', 'mehmet.demir@example.com', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Mehmet Demir"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '', '', '', '', '', '', ''),
    ('a0000000-0000-0000-0000-000000000004', 'zeynep.celik@example.com', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Zeynep Çelik"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '', '', '', '', '', '', ''),
    ('a0000000-0000-0000-0000-000000000005', 'can.ozturk@example.com',   crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Can Öztürk"}',   'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '', '', '', '', '', '', ''),
    ('a0000000-0000-0000-0000-000000000006', 'selin.arslan@example.com', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Selin Arslan"}', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '', '', '', '', '', '', ''),
    ('a0000000-0000-0000-0000-000000000007', 'burak.sahin@example.com',  crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Burak Şahin"}',  'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '', '', '', '', '', '', ''),
    ('a0000000-0000-0000-0000-000000000008', 'nur.yildiz@example.com',   crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Nur Yıldız"}',   'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '', '', '', '', '', '', '')
on conflict (id) do nothing;

insert into auth.identities (
    id, user_id, provider, provider_id, identity_data, created_at, updated_at, last_sign_in_at
) values
    ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'email', 'ahmet.yilmaz@example.com',  '{"sub":"a0000000-0000-0000-0000-000000000001","email":"ahmet.yilmaz@example.com"}', now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'email', 'ayse.kaya@example.com',     '{"sub":"a0000000-0000-0000-0000-000000000002","email":"ayse.kaya@example.com"}',     now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'email', 'mehmet.demir@example.com',  '{"sub":"a0000000-0000-0000-0000-000000000003","email":"mehmet.demir@example.com"}',  now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'email', 'zeynep.celik@example.com',  '{"sub":"a0000000-0000-0000-0000-000000000004","email":"zeynep.celik@example.com"}',  now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'email', 'can.ozturk@example.com',    '{"sub":"a0000000-0000-0000-0000-000000000005","email":"can.ozturk@example.com"}',    now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'email', 'selin.arslan@example.com',  '{"sub":"a0000000-0000-0000-0000-000000000006","email":"selin.arslan@example.com"}',  now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'email', 'burak.sahin@example.com',   '{"sub":"a0000000-0000-0000-0000-000000000007","email":"burak.sahin@example.com"}',   now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'email', 'nur.yildiz@example.com',    '{"sub":"a0000000-0000-0000-0000-000000000008","email":"nur.yildiz@example.com"}',    now(), now(), now())
on conflict (id) do nothing;
