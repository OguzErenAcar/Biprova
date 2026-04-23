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
    name         text not null
                     constraint chk_users_name check (length(trim(name)) between 2 and 100),
    avatar_url   text,
    cover_url    text,
    cv_url       text,
    cv_public    boolean not null default false,
    bio          text
                     constraint chk_users_bio check (length(bio) <= 500),
    city         text,
    location     geography(Point, 4326),
    linkedin_url text,
    badge        text,
    role         text default 'user'
                     constraint chk_users_role check (role in ('user', 'admin')),
    plan         text default 'free'
                     constraint chk_users_plan check (plan in ('free', 'paid')),
    max_teams        integer default 1
                         constraint chk_users_max_teams check (max_teams >= 1),
    max_projects     integer default 1
                         constraint chk_users_max_projects check (max_projects >= 1),
    projects_public     boolean not null default true,
    teams_public        boolean not null default true,
    applications_public boolean not null default false,
    last_sign_in_at  timestamp,
    last_sign_out_at timestamp,
    created_at       timestamp default now()
);

create table teams (
    id           uuid primary key default uuid_generate_v4(),
    name         text
                     constraint chk_teams_name check (length(trim(name)) <= 150),
    leader_id    uuid references users(id) on delete set null,
    status       text default 'pending'
                     constraint chk_teams_status check (status in ('pending', 'active', 'no_project')),
    project_id   uuid,                        -- fk eklenir aşağıda
    formed_at    timestamp default now(),
    activated_at timestamp,
    deadline     timestamp
);

create table projects (
    id          uuid primary key default uuid_generate_v4(),
    leader_id   uuid references users(id) on delete cascade,
    team_id     uuid references teams(id) on delete set null,
    title       text not null
                    constraint chk_projects_title check (length(trim(title)) between 3 and 150),
    description text
                    constraint chk_projects_description check (length(description) <= 3000),
    city        text,
    location    geography(Point, 4326),
    is_remote   boolean default false,
    category_id uuid references project_categories(id) on delete set null,
    status      text default 'open'
                    constraint chk_projects_status check (status in ('open', 'full', 'completed', 'cancelled')),
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
    role_name  text not null
                   constraint chk_project_roles_role_name check (length(trim(role_name)) between 2 and 100),
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
    note       text
                   constraint chk_applications_note check (length(note) <= 1000),
    status     text default 'pending'
                   constraint chk_applications_status check (status in ('pending', 'accepted', 'rejected')),
    created_at timestamp default now(),
    constraint uq_applications_user_role unique (user_id, role_id)
);

-- M2M: bir kullanıcının birden çok projesi, bir projenin birden çok üyesi
create table project_members (
    project_id uuid references projects(id) on delete cascade,
    user_id    uuid references users(id) on delete cascade,
    role       text not null default 'member'
                   constraint chk_project_members_role check (role in ('leader', 'member')),
    joined_at  timestamp default now(),
    primary key (project_id, user_id)
);

create table team_members (
    id          uuid primary key default uuid_generate_v4(),
    team_id     uuid references teams(id) on delete cascade,
    user_id     uuid references users(id) on delete cascade,
    role_id     uuid references project_roles(id) on delete set null,
    joined_at   timestamp default now(),
    constraint uq_team_members_team_user unique (team_id, user_id)
);

create table messages (
    id         uuid primary key default uuid_generate_v4(),
    team_id    uuid references teams(id) on delete cascade,
    sender_id  uuid references users(id) on delete cascade,
    content    text not null
                   constraint chk_messages_content check (length(trim(content)) between 1 and 2000),
    created_at timestamp default now()
);

create table team_posts (
    id         uuid primary key default uuid_generate_v4(),
    team_id    uuid references teams(id) on delete cascade,
    author_id  uuid references users(id) on delete cascade,
    project_id uuid references projects(id) on delete set null,
    content    text not null
                   constraint chk_team_posts_content check (length(trim(content)) between 1 and 5000),
    image_url  text,
    cover_url  text,
    image_urls text[] not null default '{}'
                   constraint chk_team_posts_image_urls_size check (cardinality(image_urls) <= 10),
    like_count integer default 0
                   constraint chk_team_posts_like_count check (like_count >= 0),
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
    title        text not null
                     constraint chk_news_title check (length(trim(title)) between 5 and 200),
    content      text not null,
    image_url    text,
    cover_url    text,
    tags         text[]
                     constraint chk_news_tags_size check (tags is null or cardinality(tags) <= 20),
    view_count   integer default 0
                     constraint chk_news_view_count check (view_count >= 0),
    like_count   integer default 0
                     constraint chk_news_like_count check (like_count >= 0),
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
-- VIEWS
-- ============================================================

-- Hassas kolonları (email, role, plan, limitler) dışarıda bırakan profil view'ı.
-- Başka kullanıcıların profili bu view üzerinden okunmalı.
create or replace view public_user_profiles as
select
    id,
    name,
    avatar_url,
    cover_url,
    bio,
    city,
    linkedin_url,
    badge,
    cv_url,
    cv_public,
    projects_public,
    teams_public,
    applications_public,
    created_at
from public.users;

alter view public_user_profiles owner to postgres;
grant select on public_user_profiles to authenticated;

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
