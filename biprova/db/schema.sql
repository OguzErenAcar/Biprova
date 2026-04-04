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
    creator_id  uuid references users(id) on delete cascade,
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
    role       text not null default 'member', -- 'creator' | 'member'
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

create index on projects(creator_id);
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
-- MIGRATIONS (mevcut veritabanı için)
-- ============================================================

alter table public.users
    add column if not exists last_sign_in_at  timestamp,
    add column if not exists last_sign_out_at timestamp;

alter table public.teams
    drop column if exists disbanded_at;
