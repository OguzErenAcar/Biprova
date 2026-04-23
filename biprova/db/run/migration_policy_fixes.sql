-- ============================================================
-- MIGRATION: policy_fixes
-- Tarih: 2026-04-23
-- Kapsam:
--   1. projects_insert   — has_biprova (kaldırılmış kolon) referansı temizlendi
--   2. user_skills       — 'for all using' INSERT'i kapsamıyordu
--   2. team_post_likes   — 'for all using' INSERT'i kapsamıyordu
--   2. news_likes        — 'for all using' INSERT'i kapsamıyordu
--   4. cv_url gizliliği  — cv_public bayrağını enforce eden computed column
--   5. applications      — kullanıcı kendi projesine başvuramaz
--   6. team_posts_read   — anonim okuma kapatıldı
-- ============================================================


-- ============================================================
-- 1. FIX: projects_insert
--    has_biprova kolonu migration_drop_has_biprova.sql ile silindi,
--    ama policy hâlâ o kolona bakıyordu — sorgu daima false dönüyordu.
-- ============================================================

drop policy if exists "projects_insert" on projects;

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


-- ============================================================
-- 2. FIX: user_skills
--    'for all using(user_id = auth.uid())' INSERT'e uygulanmaz;
--    with check olmadığından başkası adına skill insert açıktı.
-- ============================================================

drop policy if exists "user_skills_manage" on user_skills;

create policy "user_skills_select" on user_skills for select using (true);
create policy "user_skills_insert" on user_skills for insert with check (user_id = auth.uid());
create policy "user_skills_update" on user_skills for update using (user_id = auth.uid());
create policy "user_skills_delete" on user_skills for delete using (user_id = auth.uid());


-- ============================================================
-- 2. FIX: team_post_likes
--    Aynı sorun — 'for all using' ile INSERT with check eksikti.
-- ============================================================

drop policy if exists "post_likes_manage" on team_post_likes;

create policy "post_likes_select" on team_post_likes for select using (true);
create policy "post_likes_insert" on team_post_likes for insert with check (user_id = auth.uid());
create policy "post_likes_delete" on team_post_likes for delete using (user_id = auth.uid());


-- ============================================================
-- 2. FIX: news_likes
--    Aynı sorun — 'for all using' ile INSERT with check eksikti.
-- ============================================================

drop policy if exists "news_likes_manage" on news_likes;

create policy "news_likes_select" on news_likes for select using (auth.uid() is not null);
create policy "news_likes_insert" on news_likes for insert with check (user_id = auth.uid());
create policy "news_likes_delete" on news_likes for delete using (user_id = auth.uid());


-- ============================================================
-- 4. FIX: cv_url gizliliği
--    RLS kolon bazlı kısıtlama yapamaz; computed column fonksiyonu
--    PostgREST üzerinden koşullu cv_url sunar.
--    Kullanım: ?select=...,cv_url_safe (uygulama tarafında güncellenmeli)
--
--    Kural:
--      - Kendi profili   → her zaman göster
--      - cv_public = true → göster
--      - cv_public = false + başkası → null dön
-- ============================================================

create or replace function public.users_cv_url_safe(u users)
returns text language sql stable security definer as $$
    select case
        when u.id = auth.uid()   then u.cv_url
        when u.cv_public = true  then u.cv_url
        else null
    end;
$$;

-- Opsiyonel (sert enforcement): aşağıdaki satırı açarsan authenticated rolü
-- cv_url kolonuna doğrudan erişemez; uygulama tamamen cv_url_safe kullanmak zorunda kalır.
-- Dikkat: Bunu çalıştırmadan önce tüm uygulama sorgularını güncelle.
--
-- revoke select (cv_url) on users from authenticated;


-- ============================================================
-- 5. FIX: applications_insert
--    Proje lideri kendi projesine başvuramaz.
-- ============================================================

drop policy if exists "applications_insert" on applications;

create policy "applications_insert" on applications for insert with check (
    user_id = auth.uid()
    and not exists (
        select 1 from projects p
        where p.id = project_id
          and p.leader_id = auth.uid()
    )
);


-- ============================================================
-- 6. FIX: team_posts_read
--    Biprova login gerektiren bir platform; anonim post okuma kapatıldı.
-- ============================================================

drop policy if exists "team_posts_read" on team_posts;

create policy "team_posts_read" on team_posts for select using (auth.uid() is not null);


-- ============================================================
-- ROLLBACK
--
-- drop policy if exists "projects_insert"    on projects;
-- drop policy if exists "user_skills_select" on user_skills;
-- drop policy if exists "user_skills_insert" on user_skills;
-- drop policy if exists "user_skills_update" on user_skills;
-- drop policy if exists "user_skills_delete" on user_skills;
-- drop policy if exists "post_likes_select"  on team_post_likes;
-- drop policy if exists "post_likes_insert"  on team_post_likes;
-- drop policy if exists "post_likes_delete"  on team_post_likes;
-- drop policy if exists "news_likes_select"  on news_likes;
-- drop policy if exists "news_likes_insert"  on news_likes;
-- drop policy if exists "news_likes_delete"  on news_likes;
-- drop function if exists public.users_cv_url_safe(users);
-- drop policy if exists "applications_insert" on applications;
-- drop policy if exists "team_posts_read"    on team_posts;
--
-- -- Orijinal policy'leri geri yükle:
-- create policy "projects_insert" on projects for insert with check (
--     leader_id = auth.uid()
--     and (team_id is null or exists (
--         select 1 from teams t where t.id = team_id and t.leader_id = auth.uid()
--           and t.status in ('active', 'no_project', 'pending'))
--         or exists (select 1 from team_members tm where tm.team_id = team_id
--           and tm.user_id = auth.uid() and tm.has_biprova = true)));
-- create policy "user_skills_manage"  on user_skills       for all using (user_id = auth.uid());
-- create policy "post_likes_manage"   on team_post_likes   for all using (user_id = auth.uid());
-- create policy "news_likes_manage"   on news_likes        for all using (user_id = auth.uid());
-- create policy "applications_insert" on applications      for insert with check (user_id = auth.uid());
-- create policy "team_posts_read"     on team_posts        for select using (true);
-- ============================================================
