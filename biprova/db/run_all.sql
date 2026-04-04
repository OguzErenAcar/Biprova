create extension if not exists "uuid-ossp";

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
    bio          text,
    city         text,
    is_remote    boolean default false,
    linkedin_url text,
    badge        text,
    role         text default 'user',         -- 'user' | 'admin'
    plan         text default 'free',         -- 'free' | 'paid'
    max_teams        integer default 1,
    max_projects     integer default 1,
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
    media_urls text[],
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

-- ============================================================
-- BUSINESS LOGIC FUNCTIONS
-- Sıra: 1-proje_fesih, 2-team_fesih, 3-proje_cikis, 4-team_cikis
-- ============================================================




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
create policy "users_read"   on users for select using (true);
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
create policy "team_posts_read"   on team_posts for select using (is_team_member(team_id));
create policy "team_posts_insert" on team_posts for insert with check (
    author_id = auth.uid() and is_team_member(team_id)
);
create policy "team_posts_update" on team_posts for update using (author_id = auth.uid());
create policy "team_posts_delete" on team_posts for delete using (author_id = auth.uid());

-- team_post_likes
create policy "post_likes_read" on team_post_likes for select using (
    exists (select 1 from team_posts tp where tp.id = post_id and is_team_member(tp.team_id))
);
create policy "post_likes_manage" on team_post_likes for all using (user_id = auth.uid());

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
-- ============================================================
-- SEED: Biprova demo verisi
-- ============================================================
-- Triggerlar aktif olduğundan sıra önemli:
--   - INSERT projects  → pm_on_project_created (creator → project_members)
--   - UPDATE applications status='accepted' → pm_on_application_accepted (user → project_members)
--   - UPDATE projects status='full' → create_team_on_project_full (ekip + team_members otomatik)
--
-- Temiz çalıştırmak için önce tabloları truncate et:
--   truncate table notifications, messages, team_post_likes, team_posts,
--     team_members, teams, project_members, applications, project_role_skills,
--     project_roles, projects, user_skills, users, cities,
--     project_categories, skills restart identity cascade;
-- ============================================================

begin;

-- ============================================================
-- SKİLLS
-- ============================================================

insert into skills (id, name, slug) values
    ('10000000-0000-0000-0000-000000000001', 'React',           'react'),
    ('10000000-0000-0000-0000-000000000002', 'Node.js',         'nodejs'),
    ('10000000-0000-0000-0000-000000000003', 'Python',          'python'),
    ('10000000-0000-0000-0000-000000000004', 'UI/UX Tasarım',   'uiux'),
    ('10000000-0000-0000-0000-000000000005', 'PostgreSQL',      'postgresql'),
    ('10000000-0000-0000-0000-000000000006', 'Flutter',         'flutter'),
    ('10000000-0000-0000-0000-000000000007', 'Pazarlama',       'pazarlama'),
    ('10000000-0000-0000-0000-000000000008', 'TypeScript',      'typescript'),
    ('10000000-0000-0000-0000-000000000009', 'Figma',           'figma'),
    ('10000000-0000-0000-0000-000000000010', 'Machine Learning','ml');

-- ============================================================
-- KATEGORİLER
-- ============================================================

insert into project_categories (id, name, slug) values
    ('20000000-0000-0000-0000-000000000001', 'Teknoloji', 'teknoloji'),
    ('20000000-0000-0000-0000-000000000002', 'Sağlık',    'saglik'),
    ('20000000-0000-0000-0000-000000000003', 'Eğitim',    'egitim'),
    ('20000000-0000-0000-0000-000000000004', 'Fintech',   'fintech'),
    ('20000000-0000-0000-0000-000000000005', 'Tarım',     'tarim'),
    ('20000000-0000-0000-0000-000000000006', 'E-ticaret', 'eticaret');

-- ============================================================
-- ŞEHİRLER
-- ============================================================

insert into cities (id, name, slug) values
    ('30000000-0000-0000-0000-000000000001', 'İstanbul', 'istanbul'),
    ('30000000-0000-0000-0000-000000000002', 'Ankara',   'ankara'),
    ('30000000-0000-0000-0000-000000000003', 'İzmir',    'izmir');

-- ============================================================
-- KULLANICILAR
-- ============================================================

insert into users (id, email, name, bio, city, is_remote, linkedin_url, badge, role, plan, max_teams, max_projects) values
    (
        'a0000000-0000-0000-0000-000000000001',
        'ahmet.yilmaz@example.com',
        'Ahmet Yılmaz',
        'Full-stack developer, startup meraklısı. React ve Node.js ile 5 yıldır çalışıyorum.',
        'İstanbul', true,
        'https://linkedin.com/in/ahmetyilmaz',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'ayse.kaya@example.com',
        'Ayşe Kaya',
        'Product Manager. Kullanıcı odaklı ürünler geliştirmeyi seviyorum.',
        'Ankara', true,
        'https://linkedin.com/in/aysekaya',
        null, 'user', 'paid', 3, 3
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'mehmet.demir@example.com',
        'Mehmet Demir',
        'Flutter geliştirici. Mobil uygulamalar benim tutkum.',
        'İstanbul', false,
        'https://linkedin.com/in/mehmetdemir',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'zeynep.celik@example.com',
        'Zeynep Çelik',
        'Veri bilimci ve ML mühendisi. Tarım teknolojilerine odaklanıyorum.',
        'İzmir', true,
        'https://linkedin.com/in/zeynepcelik',
        null, 'user', 'paid', 3, 3
    ),
    (
        'a0000000-0000-0000-0000-000000000005',
        'can.ozturk@example.com',
        'Can Öztürk',
        'Backend developer. Node.js ve PostgreSQL uzmanı.',
        'İstanbul', false,
        'https://linkedin.com/in/canozturk',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000006',
        'selin.arslan@example.com',
        'Selin Arslan',
        'UI/UX tasarımcı. Figma ve kullanıcı araştırması konusunda deneyimliyim.',
        'İstanbul', true,
        'https://linkedin.com/in/selinarslan',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000007',
        'burak.sahin@example.com',
        'Burak Şahin',
        'Flutter geliştirici. Cross-platform mobil uygulamalar yapıyorum.',
        'Ankara', false,
        'https://linkedin.com/in/buraksahin',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000008',
        'nur.yildiz@example.com',
        'Nur Yıldız',
        'Dijital pazarlama uzmanı. Growth hacking ve içerik stratejisi konularında çalışıyorum.',
        'Ankara', true,
        'https://linkedin.com/in/nuryildiz',
        null, 'user', 'free', 1, 1
    );

-- ============================================================
-- KULLANICI BECERİLERİ
-- ============================================================

insert into user_skills (user_id, skill_id) values
    -- Ahmet: React, TypeScript, Node.js
    ('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
    ('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008'),
    ('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
    -- Ayşe: UI/UX, Figma
    ('a0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004'),
    ('a0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009'),
    -- Mehmet: Flutter, React
    ('a0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006'),
    ('a0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
    -- Zeynep: Python, ML, PostgreSQL
    ('a0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003'),
    ('a0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000010'),
    ('a0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000005'),
    -- Can: Node.js, PostgreSQL
    ('a0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002'),
    ('a0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005'),
    -- Selin: UI/UX, Figma
    ('a0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004'),
    ('a0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000009'),
    -- Burak: Flutter
    ('a0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000006'),
    -- Nur: Pazarlama
    ('a0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007');

-- ============================================================
-- PROJE 1: Açık — "Freelancer Proje Yönetim Uygulaması"
-- Kurucu: Ahmet (u1) | Durum: open | 2 rol, 0 dolu
-- ============================================================

insert into projects (id, leader_id, title, description, city, is_remote, category_id, status)
values (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Freelancer Proje Yönetim Uygulaması',
    'Freelancer''ların müşteri projelerini, faturalarını ve zaman takibini tek yerden yönetebileceği bir SaaS uygulaması. MVP''yi 3 ayda tamamlamayı hedefliyoruz.',
    'İstanbul', true,
    '20000000-0000-0000-0000-000000000001',
    'open'
);
-- Trigger (pm_on_project_created): Ahmet → project_members (creator)

insert into project_roles (id, project_id, role_name) values
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Frontend Developer (React)'),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'UI/UX Tasarımcı');

insert into project_role_skills (role_id, skill_id) values
    ('c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008'),
    ('c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004'),
    ('c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009');

-- Selin (u6) UI/UX rolüne, Can (u5) Frontend rolüne başvuruyor — ikisi de pending
insert into applications (id, project_id, user_id, role_id, note, status) values
    (
        'd0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000006',
        'c0000000-0000-0000-0000-000000000002',
        '3 yıldır UI/UX tasarımcıyım, Figma''da ürün tasarımı deneyimim var. Bu projeye katkı sağlamak isterim.',
        'pending'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-000000000001',
        'React ve TypeScript konusunda 4 yıllık deneyimim var. Freelancer araçları ilgi alanım.',
        'pending'
    );

-- ============================================================
-- PROJE 2: Kısmen dolu — "Sağlık Takip ve Analiz Platformu"
-- Kurucu: Ayşe (u2) | Durum: open | 3 rol, 1 dolu
-- ============================================================

insert into projects (id, leader_id, title, description, city, is_remote, category_id, status)
values (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'Sağlık Takip ve Analiz Platformu',
    'Kullanıcıların günlük sağlık metriklerini (uyku, beslenme, egzersiz) takip edip kişiselleştirilmiş öneriler alabileceği bir mobil platform. Yapay zeka destekli analizler içerecek.',
    'Ankara', true,
    '20000000-0000-0000-0000-000000000002',
    'open'
);
-- Trigger (pm_on_project_created): Ayşe → project_members (creator)

insert into project_roles (id, project_id, role_name) values
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Backend Developer'),
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Mobil Geliştirici (Flutter)'),
    ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Veri Bilimci');

insert into project_role_skills (role_id, skill_id) values
    ('c0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005'),
    ('c0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006'),
    ('c0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003'),
    ('c0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000010');

-- Can (u5) Backend rolüne başvuruyor, kabul ediliyor
insert into applications (id, project_id, user_id, role_id, note, status) values
    (
        'd0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-000000000003',
        'Node.js ve PostgreSQL konusunda 4 yıldır çalışıyorum. Sağlık teknolojilerine ilgim var.',
        'pending'
    );

-- Trigger (pm_on_application_accepted): Can → project_members
update applications set status = 'accepted'
where id = 'd0000000-0000-0000-0000-000000000003';

update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000005'
where id = 'c0000000-0000-0000-0000-000000000003';

-- Burak (u7) ve Zeynep (u4) diğer rollere beklemede
insert into applications (id, project_id, user_id, role_id, note, status) values
    (
        'd0000000-0000-0000-0000-000000000004',
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000007',
        'c0000000-0000-0000-0000-000000000004',
        '2 yıldır Flutter ile uygulama geliştiriyorum. Sağlık uygulamalarında deneyimim var.',
        'pending'
    ),
    (
        'd0000000-0000-0000-0000-000000000005',
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000005',
        'ML modelleri ve sağlık verisi analizi üzerine çalışıyorum. Bu proje tam alanım.',
        'pending'
    );

-- ============================================================
-- PROJE 3: Dolu → Ekip otomatik oluşuyor
-- "Eğitim Oyunlaştırma Sistemi"
-- Kurucu: Mehmet (u3) | 2 rol, ikisi de dolu
-- ============================================================

insert into projects (id, leader_id, title, description, city, is_remote, category_id, status)
values (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'Eğitim Oyunlaştırma Sistemi',
    'K-12 öğrencileri için ders müfredatını oyunlaştıran bir mobil uygulama. Rozetler, liderlik tabloları ve seviye sistemi içerecek. Matematik ve fen dersleriyle başlıyoruz.',
    'İstanbul', false,
    '20000000-0000-0000-0000-000000000003',
    'open'
);
-- Trigger (pm_on_project_created): Mehmet → project_members (creator)

insert into project_roles (id, project_id, role_name) values
    ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'Flutter Geliştirici'),
    ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003', 'Backend Geliştirici');

insert into project_role_skills (role_id, skill_id) values
    ('c0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006'),
    ('c0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000005');

-- Burak (u7) Flutter rolüne, Can (u5) Backend rolüne başvuruyor
insert into applications (id, project_id, user_id, role_id, note, status) values
    (
        'd0000000-0000-0000-0000-000000000006',
        'b0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000007',
        'c0000000-0000-0000-0000-000000000006',
        'Flutter ile oyun mekaniği içeren uygulamalar geliştirdim. Eğitim teknolojisi tutkum.',
        'pending'
    ),
    (
        'd0000000-0000-0000-0000-000000000007',
        'b0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-000000000007',
        'Ölçeklenebilir backend sistemleri kurma konusunda deneyimliyim.',
        'pending'
    );

-- Her iki başvuruyu kabul et
-- Trigger (pm_on_application_accepted): Burak + Can → project_members
update applications set status = 'accepted' where id = 'd0000000-0000-0000-0000-000000000006';
update applications set status = 'accepted' where id = 'd0000000-0000-0000-0000-000000000007';

-- Rolleri dolu olarak işaretle
update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000007'
where id = 'c0000000-0000-0000-0000-000000000006';

update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000005'
where id = 'c0000000-0000-0000-0000-000000000007';

-- TÜM ROLLER DOLDU → status='full' yap
-- Trigger (create_team_on_project_full): ekip + team_members otomatik oluşur,
-- projects.team_id güncellenir.
update projects set status = 'full' where id = 'b0000000-0000-0000-0000-000000000003';

-- ============================================================
-- PROJE 4: Aktif ekip — "Çiftçi Pazar Yeri"
-- Kurucu: Zeynep (u4) | Manuel kurulum (ekip zaten aktif)
-- ============================================================

insert into projects (id, leader_id, title, description, city, is_remote, category_id, status)
values (
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000004',
    'Çiftçi Pazar Yeri',
    'Küçük ölçekli çiftçilerin ürünlerini doğrudan tüketicilere satabileceği, teslimat entegrasyonlu bir e-ticaret platformu. Tarımda dijital dönüşümü hızlandırmayı hedefliyoruz.',
    'İzmir', true,
    '20000000-0000-0000-0000-000000000005',
    'active'
);
-- Trigger (pm_on_project_created): Zeynep → project_members (creator)

insert into project_roles (id, project_id, role_name, is_filled, filled_by) values
    ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', 'UI/UX Tasarımcı',  true, 'a0000000-0000-0000-0000-000000000006'),
    ('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000004', 'Pazarlama Uzmanı', true, 'a0000000-0000-0000-0000-000000000008');

insert into project_role_skills (role_id, skill_id) values
    ('c0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004'),
    ('c0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000009'),
    ('c0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000007');

-- Ekibi manuel kur (aktif durum, 15 gün önce kuruldu)
insert into teams (id, name, leader_id, status, project_id, formed_at, activated_at) values
    (
        'e0000000-0000-0000-0000-000000000001',
        'Çiftçi Pazar Yeri ekibi',
        'a0000000-0000-0000-0000-000000000004',
        'active',
        'b0000000-0000-0000-0000-000000000004',
        now() - interval '15 days',
        now() - interval '14 days'
    );

update projects set team_id = 'e0000000-0000-0000-0000-000000000001'
where id = 'b0000000-0000-0000-0000-000000000004';

-- project_members: Zeynep trigger ile eklendi; Selin ve Nur manuel
insert into project_members (project_id, user_id, role) values
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000006', 'member'),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000008', 'member');

insert into team_members (team_id, user_id, role_id, has_biprova) values
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', null,                                       true),
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000008', false),
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000009', false);

-- Ekip mesajları
insert into messages (id, team_id, sender_id, content, created_at) values
    (
        'f0000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'Herkese hoş geldiniz! İlk sprint planımızı bu hafta belirleyelim. Öncelikle kullanıcı akışlarına odaklanacağız.',
        now() - interval '13 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000006',
        'Harika! Figma''da ilk wireframe taslakları hazırlamaya başladım. Yarın paylaşırım.',
        now() - interval '13 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000003',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000008',
        'Pazarlama stratejisi için hedef kitlemizi netleştirelim mi? Küçük aile çiftçileri mi, büyük üreticiler mi?',
        now() - interval '12 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000004',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'Küçük aile çiftçileri ile başlayalım. İzmir ve çevresinde 50+ çiftçiyle görüşme ayarladım.',
        now() - interval '12 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000005',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000006',
        'Wireframe''leri paylaştım, yorumlarınızı bekliyorum!',
        now() - interval '10 days'
    );

-- Ekip gönderileri
insert into team_posts (id, team_id, author_id, project_id, content, like_count, created_at) values
    (
        'f1000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'b0000000-0000-0000-0000-000000000004',
        'Çiftçi Pazar Yeri projemizi resmen başlattık! İzmir''deki çiftçilerle ilk görüşmelerimizi yaptık, geri bildirimler çok olumlu. Yakında beta sürümünü paylaşacağız.',
        12,
        now() - interval '10 days'
    ),
    (
        'f1000000-0000-0000-0000-000000000002',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000006',
        'b0000000-0000-0000-0000-000000000004',
        'İlk UI tasarımlarımız hazır! Sade ve çiftçi dostu bir arayüz tasarladık. Figma prototipi üzerinde kullanıcı testleri yapıyoruz.',
        8,
        now() - interval '5 days'
    );

-- ============================================================
-- HABERLER
-- ============================================================

insert into news (id, author_id, title, content, tags, view_count, like_count, is_published, published_at) values
    (
        'f2000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        'Türkiye''de Girişimcilik Ekosistemi 2025 Raporu Yayınlandı',
        'TÜSİAD ve Startup Turkey iş birliğiyle hazırlanan yıllık rapor, Türkiye''de teknoloji girişimciliğinin son 5 yılda %340 büyüdüğünü ortaya koydu. İstanbul, girişim merkezi olma özelliğini korurken Ankara ve İzmir de hızla yükseliyor.',
        ARRAY['girişimcilik', 'teknoloji', 'türkiye'],
        234, 18, true,
        now() - interval '7 days'
    ),
    (
        'f2000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000002',
        'Tarım Teknolojileri Yatırımları Rekora Koşuyor',
        'Agritech alanındaki küresel yatırımlar 2024''te 15 milyar doları aştı. Türkiye bu alanda önemli bir potansiyel taşıyor: tarım arazilerinin verimliliğini artıracak akıllı sulama, drone ve sensör teknolojileri giderek yaygınlaşıyor.',
        ARRAY['tarım', 'teknoloji', 'yatırım', 'agritech'],
        187, 24, true,
        now() - interval '3 days'
    );

-- ============================================================
-- BİLDİRİMLER
-- ============================================================

insert into notifications (id, user_id, type, payload, is_read, created_at) values
    -- Ahmet: projesine 2 başvuru geldi
    (
        'f3000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'new_application',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000001',
            'project_title', 'Freelancer Proje Yönetim Uygulaması',
            'applicant_name','Selin Arslan',
            'role_name',     'UI/UX Tasarımcı'
        ),
        false, now() - interval '2 days'
    ),
    (
        'f3000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'new_application',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000001',
            'project_title', 'Freelancer Proje Yönetim Uygulaması',
            'applicant_name','Can Öztürk',
            'role_name',     'Frontend Developer (React)'
        ),
        false, now() - interval '1 day'
    ),
    -- Can: başvurusu kabul edildi (p2)
    (
        'f3000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000005',
        'application_accepted',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000002',
            'project_title', 'Sağlık Takip ve Analiz Platformu',
            'role_name',     'Backend Developer'
        ),
        true, now() - interval '4 days'
    ),
    -- Burak: başvurusu kabul edildi (p3)
    (
        'f3000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000007',
        'application_accepted',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000003',
            'project_title', 'Eğitim Oyunlaştırma Sistemi',
            'role_name',     'Flutter Geliştirici'
        ),
        false, now() - interval '3 days'
    ),
    -- Mehmet: ekibi oluştu (p3)
    (
        'f3000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000003',
        'team_formed',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000003',
            'project_title', 'Eğitim Oyunlaştırma Sistemi'
        ),
        false, now() - interval '3 days'
    );

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



grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
