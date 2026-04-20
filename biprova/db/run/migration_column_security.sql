-- ============================================================
-- MIGRATION: Kolon düzeyinde güvenlik kısıtlamaları
--
-- Sorunlar:
--   1. users tablosundan tüm authenticated kullanıcılar başkasının
--      email, role, plan, max_teams, max_projects, last_sign_in_at,
--      last_sign_out_at kolonlarını okuyabiliyor.
--   2. anon role'ün çoğu tabloya yazma yetkisi var (RLS kısıtlasa
--      da grant tanımı gereksiz yetki veriyor).
--
-- Çözüm:
--   - Başka kullanıcıların profili için public_user_profiles view'ı
--   - Hassas internal kolonlar authenticated'dan revoke
--   - anon role yazma yetkisi daraltıldı
-- ============================================================


-- ============================================================
-- 1. Herkese açık profil view'ı
--    email, role, plan, limitler ve aktivite zamanları yok
-- ============================================================

CREATE OR REPLACE VIEW public_user_profiles AS
SELECT
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
FROM public.users;

-- View sahibi postgres olmalı (security definer gibi davranır)
ALTER VIEW public_user_profiles OWNER TO postgres;

-- Authenticated kullanıcılar view'dan okuyabilir
GRANT SELECT ON public_user_profiles TO authenticated;


-- ============================================================
-- 2. Internal kolonları authenticated'dan revoke et
--    App kodu zaten bu kolonları select etmiyor; ama
--    doğrudan Supabase API çağrısıyla okunabiliyordu.
-- ============================================================

REVOKE SELECT (
    role,
    plan,
    max_teams,
    max_projects,
    last_sign_in_at,
    last_sign_out_at
) ON public.users FROM authenticated;

-- Not: email burada revoke edilmiyor çünkü getCurrentUserProfile
-- kendi satırı için email'e ihtiyaç duyuyor. Bunun yerine
-- getUserProfileById, users tablosu yerine public_user_profiles
-- view'ını kullanacak şekilde güncellendi (bkz. users/actions.ts).


-- ============================================================
-- 3. anon role yazma yetkilerini daralt
--    Şu an schema.sql'deki genel grant her şeye izin veriyor.
--    RLS politikaları gerçek kısıtlamayı yapsa da
--    least-privilege prensibi gereği yetkiler daraltılmalı.
-- ============================================================

-- anon sadece waitlist insert yapabilmeli ve lookup tablolarını okuyabilmeli

REVOKE INSERT, UPDATE, DELETE ON
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
FROM anon;

-- anon waitlist'e sadece insert yapabilsin, okuyamasın ve silemeyecek
REVOKE SELECT, UPDATE, DELETE ON public.waitlist FROM anon;

-- ============================================================
-- ROLLBACK (gerekirse):
--
-- DROP VIEW IF EXISTS public_user_profiles;
--
-- GRANT SELECT (role, plan, max_teams, max_projects, last_sign_in_at, last_sign_out_at)
--   ON public.users TO authenticated;
--
-- GRANT INSERT, UPDATE, DELETE ON public.users, public.projects, ... TO anon;
-- GRANT SELECT, UPDATE, DELETE ON public.waitlist TO anon;
-- ============================================================
