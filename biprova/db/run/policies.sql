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

-- skills (lookup — anonim erişime açık)
create policy "skills_read"  on skills for select using (true);
create policy "skills_admin" on skills for all    using (is_admin());

-- project_categories (lookup — anonim erişime açık)
create policy "categories_read"  on project_categories for select using (true);
create policy "categories_admin" on project_categories for all    using (is_admin());

-- cities (lookup — anonim erişime açık)
create policy "cities_read"  on cities for select using (true);
create policy "cities_admin" on cities for all    using (is_admin());

-- users
-- Profil okuma login gerektiriyor (email sızıntısını önlemek için)
create policy "users_read"   on users for select using (auth.uid() is not null);
create policy "users_update" on users for update using (id = auth.uid());

-- teams
-- INSERT yok: ekip sadece create_team_on_project_full trigger'ı tarafından oluşturulur
create policy "teams_read"   on teams for select using (auth.uid() is not null);
create policy "teams_update" on teams for update using (leader_id = auth.uid());

-- projects
create policy "projects_read"   on projects for select using (auth.uid() is not null);
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
    )
);

-- user_skills
create policy "user_skills_read"   on user_skills for select using (auth.uid() is not null);
create policy "user_skills_insert" on user_skills for insert with check (user_id = auth.uid());
create policy "user_skills_update" on user_skills for update using (user_id = auth.uid());
create policy "user_skills_delete" on user_skills for delete using (user_id = auth.uid());

-- project_roles
-- UPDATE yok: is_filled ve filled_by sadece trigger (security definer) tarafından güncellenir
-- Lider yalnızca rol ekleyip silebilir
create policy "project_roles_read"   on project_roles for select using (auth.uid() is not null);
create policy "project_roles_insert" on project_roles for insert
    with check (is_project_leader(project_id));
create policy "project_roles_delete" on project_roles for delete
    using (is_project_leader(project_id));

-- project_role_skills
create policy "role_skills_read"   on project_role_skills for select using (auth.uid() is not null);
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
create policy "applications_insert"   on applications for insert with check (
    user_id = auth.uid()
    and not exists (
        select 1 from projects p
        where p.id = project_id
          and p.leader_id = auth.uid()
    )
);
create policy "applications_delete" on applications for delete
    using (user_id = auth.uid() and status = 'pending');
create policy "applications_update" on applications for update
    using (is_project_leader(project_id));

-- project_members
create policy "pm_read"   on project_members for select using (auth.uid() is not null);
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
create policy "messages_delete" on messages for delete using (
    sender_id = auth.uid() and is_team_member(team_id)
);

-- team_posts
create policy "team_posts_read"   on team_posts for select using (auth.uid() is not null);
create policy "team_posts_insert" on team_posts for insert with check (
    author_id = auth.uid() and is_team_member(team_id)
);
create policy "team_posts_update" on team_posts for update using (author_id = auth.uid());
create policy "team_posts_delete" on team_posts for delete using (author_id = auth.uid());

-- team_post_likes
create policy "post_likes_select" on team_post_likes for select using (auth.uid() is not null);
create policy "post_likes_insert" on team_post_likes for insert with check (user_id = auth.uid());
create policy "post_likes_delete" on team_post_likes for delete using (user_id = auth.uid());

-- news
create policy "news_read"  on news for select using (auth.uid() is not null and is_published = true);
create policy "news_admin" on news for all    using (is_admin());

-- news_likes
create policy "news_likes_select" on news_likes for select using (auth.uid() is not null);
create policy "news_likes_insert" on news_likes for insert with check (user_id = auth.uid());
create policy "news_likes_delete" on news_likes for delete using (user_id = auth.uid());

-- notifications
create policy "notifications_read"   on notifications for select using (user_id = auth.uid());
create policy "notifications_update" on notifications for update using (user_id = auth.uid());
create policy "notifications_delete" on notifications for delete using (user_id = auth.uid());

-- waitlist
create policy "waitlist_insert"     on waitlist for insert with check (true);
create policy "waitlist_admin_read" on waitlist for select using (is_admin());

-- badges (lookup — anonim erişime açık)
create policy "badges_read"  on badges for select using (true);
create policy "badges_admin" on badges for all    using (is_admin());

-- ============================================================
-- COLUMN-LEVEL SECURITY
-- ============================================================

-- Internal kolonları authenticated role'dan gizle.
-- Bu kolonlar uygulama tarafından select edilmiyor; doğrudan
-- API çağrısıyla okunmasını önlemek için revoke edildi.
revoke select (
    role,
    plan,
    max_teams,
    max_projects,
    last_sign_in_at,
    last_sign_out_at
) on public.users from authenticated;

-- anon role sadece waitlist insert + lookup tabloları okuyabilir;
-- diğer tüm yazma yetkilerini daralt (least-privilege prensibi).
revoke insert, update, delete on
    public.users,
    public.projects,
    public.teams,
    public.user_skills,
    public.project_roles,
    public.project_role_skills,
    public.applications,
    public.project_members,
    public.team_members,
    public.messages,
    public.team_posts,
    public.team_post_likes,
    public.news_likes,
    public.notifications
from anon;

revoke select, update, delete on public.waitlist from anon;
