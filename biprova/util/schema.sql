create extension if not exists "uuid-ossp";

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

create table users (
    id                uuid primary key default uuid_generate_v4(),
    email             text unique not null,
    name              text not null,
    avatar_url        text,
    bio               text,
    city              text,
    is_remote         boolean default false,
    linkedin_url      text,
    badge             text,
    role              text default 'user',
    team_id           uuid,
    active_project_id uuid,
    created_at        timestamp default now()
);

create table teams (
    id           uuid primary key default uuid_generate_v4(),
    name         text,
    leader_id    uuid references users(id) on delete set null,
    status       text default 'pending',
    formed_at    timestamp default now(),
    activated_at timestamp,
    deadline     timestamp
);

create table projects (
    id          uuid primary key default uuid_generate_v4(),
    creator_id  uuid references users(id) on delete cascade,
    team_id     uuid unique references teams(id) on delete set null,
    title       text not null,
    description text,
    city        text,
    is_remote   boolean default false,
    category_id uuid references project_categories(id) on delete set null,
    status      text default 'open',
    created_at  timestamp default now()
);

alter table users
    add constraint fk_users_team
        foreign key (team_id) references teams(id) on delete set null;

alter table users
    add constraint fk_users_active_project
        foreign key (active_project_id) references projects(id) on delete set null;

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
    status     text default 'pending',
    created_at timestamp default now()
);

create table team_members (
    id        uuid primary key default uuid_generate_v4(),
    team_id   uuid references teams(id) on delete cascade,
    user_id   uuid references users(id) on delete cascade unique,
    role_id   uuid references project_roles(id) on delete set null,
    joined_at timestamp default now()
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

alter table applications
    add constraint uq_applications_user_role unique (user_id, role_id);

create index on projects(team_id);
create index on projects(creator_id);
create index on project_roles(project_id);
create index on project_role_skills(role_id);
create index on applications(project_id);
create index on applications(user_id);
create index on team_members(team_id);
create index on messages(team_id);
create index on team_posts(team_id);
create index on notifications(user_id, is_read);
create index on news(is_published, published_at desc);

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

create or replace function is_project_creator(project_uuid uuid)
returns boolean language sql security definer as $$
    select exists (
        select 1 from projects where id = project_uuid and creator_id = auth.uid()
    );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table skills enable row level security;
alter table project_categories enable row level security;
alter table cities             enable row level security;
alter table users              enable row level security;
alter table teams              enable row level security;
alter table projects           enable row level security;
alter table user_skills        enable row level security;
alter table project_roles      enable row level security;
alter table project_role_skills enable row level security;
alter table applications       enable row level security;
alter table team_members       enable row level security;
alter table messages           enable row level security;
alter table team_posts         enable row level security;
alter table team_post_likes    enable row level security;
alter table news               enable row level security;
alter table news_likes         enable row level security;
alter table notifications      enable row level security;
alter table waitlist           enable row level security;

-- skills
create policy "skills_read"   on skills for select using (true);
create policy "skills_admin"  on skills for all    using (is_admin());

-- project_categories
create policy "categories_read"   on project_categories for select using (true);
create policy "categories_admin"  on project_categories for all    using (is_admin());

-- cities
create policy "cities_read"   on cities for select using (true);
create policy "cities_admin"  on cities for all    using (is_admin());

-- users
create policy "users_read"    on users for select using (true);
create policy "users_update"  on users for update using (id = auth.uid());

-- teams
create policy "teams_read"    on teams for select using (true);
create policy "teams_insert"  on teams for insert with check (leader_id = auth.uid());
create policy "teams_update"  on teams for update using (leader_id = auth.uid());

-- projects
create policy "projects_read"    on projects for select using (true);
create policy "projects_insert"  on projects for insert with check (creator_id = auth.uid());
create policy "projects_update"  on projects for update using (creator_id = auth.uid());
create policy "projects_delete"  on projects for delete using (creator_id = auth.uid());

-- user_skills
create policy "user_skills_read"    on user_skills for select using (true);
create policy "user_skills_manage"  on user_skills for all    using (user_id = auth.uid());

-- project_roles
create policy "project_roles_read"    on project_roles for select using (true);
create policy "project_roles_manage"  on project_roles for all
    using (is_project_creator(project_id));

-- project_role_skills
create policy "role_skills_read"    on project_role_skills for select using (true);
create policy "role_skills_manage"  on project_role_skills for all
    using (
        exists (
            select 1 from project_roles pr
            where pr.id = role_id and pr.project_id in (
                select id from projects where creator_id = auth.uid()
            )
        )
    );

-- applications
create policy "applications_own"      on applications for select using (user_id = auth.uid());
create policy "applications_incoming" on applications for select
    using (is_project_creator(project_id));
create policy "applications_insert"   on applications for insert
    with check (user_id = auth.uid());
create policy "applications_delete"   on applications for delete
    using (user_id = auth.uid() and status = 'pending');
create policy "applications_update"   on applications for update
    using (is_project_creator(project_id));

-- team_members
create policy "team_members_read"    on team_members for select
    using (is_team_member(team_id));
create policy "team_members_manage"  on team_members for all
    using (
        exists (
            select 1 from teams where id = team_id and leader_id = auth.uid()
        )
    );

-- messages
create policy "messages_read"    on messages for select using (is_team_member(team_id));
create policy "messages_insert"  on messages for insert with check (
    sender_id = auth.uid() and is_team_member(team_id)
);

-- team_posts
create policy "team_posts_read"    on team_posts for select using (is_team_member(team_id));
create policy "team_posts_insert"  on team_posts for insert with check (
    author_id = auth.uid() and is_team_member(team_id)
);
create policy "team_posts_update"  on team_posts for update using (author_id = auth.uid());
create policy "team_posts_delete"  on team_posts for delete using (author_id = auth.uid());

-- team_post_likes
create policy "post_likes_read"    on team_post_likes for select
    using (
        exists (
            select 1 from team_posts tp where tp.id = post_id and is_team_member(tp.team_id)
        )
    );
create policy "post_likes_manage"  on team_post_likes for all using (user_id = auth.uid());

-- news
create policy "news_read"    on news for select using (is_published = true);
create policy "news_admin"   on news for all    using (is_admin());

-- news_likes
create policy "news_likes_read"    on news_likes for select using (auth.uid() is not null);
create policy "news_likes_manage"  on news_likes for all    using (user_id = auth.uid());

-- notifications
create policy "notifications_read"    on notifications for select using (user_id = auth.uid());
create policy "notifications_update"  on notifications for update using (user_id = auth.uid());

-- waitlist
create policy "waitlist_insert"  on waitlist for insert with check (true);



alter table skills
    alter column slug drop not null,
    drop constraint if exists skills_slug_key;
