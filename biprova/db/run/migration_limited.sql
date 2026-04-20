-- ============================================================
-- MIGRATION: Kolon kısıtlamaları (CHECK constraints)
-- Kapsam:
--   1. Enum benzeri text kolonlara CHECK
--   2. Sayısal kolonlara minimum değer
--   3. Text kolonlara uzunluk sınırı
--   4. Dizi kolonlarına eleman sayısı sınırı
-- ============================================================


-- ============================================================
-- 1. ENUM CHECK CONSTRAINTS
-- ============================================================

ALTER TABLE users
    ADD CONSTRAINT chk_users_role CHECK (role IN ('user', 'admin')),
    ADD CONSTRAINT chk_users_plan CHECK (plan IN ('free', 'paid'));

ALTER TABLE teams
    ADD CONSTRAINT chk_teams_status CHECK (status IN ('pending', 'active', 'no_project'));

ALTER TABLE projects
    ADD CONSTRAINT chk_projects_status CHECK (status IN ('open', 'full', 'active', 'completed', 'cancelled'));

ALTER TABLE applications
    ADD CONSTRAINT chk_applications_status CHECK (status IN ('pending', 'accepted', 'rejected'));

ALTER TABLE project_members
    ADD CONSTRAINT chk_project_members_role CHECK (role IN ('leader', 'member'));


-- ============================================================
-- 2. SAYISAL MİNİMUM CONSTRAINTS
-- ============================================================

ALTER TABLE team_posts
    ADD CONSTRAINT chk_team_posts_like_count CHECK (like_count >= 0);

ALTER TABLE news
    ADD CONSTRAINT chk_news_like_count  CHECK (like_count >= 0),
    ADD CONSTRAINT chk_news_view_count  CHECK (view_count >= 0);

ALTER TABLE users
    ADD CONSTRAINT chk_users_max_teams    CHECK (max_teams >= 1),
    ADD CONSTRAINT chk_users_max_projects CHECK (max_projects >= 1);


-- ============================================================
-- 3. TEXT UZUNLUK CONSTRAINTS
-- ============================================================

ALTER TABLE users
    ADD CONSTRAINT chk_users_name   CHECK (length(trim(name))  BETWEEN 2 AND 100),
    ADD CONSTRAINT chk_users_bio    CHECK (length(bio)         <= 500);

ALTER TABLE teams
    ADD CONSTRAINT chk_teams_name   CHECK (length(trim(name))  <= 150);

ALTER TABLE projects
    ADD CONSTRAINT chk_projects_title       CHECK (length(trim(title))       BETWEEN 3 AND 150),
    ADD CONSTRAINT chk_projects_description CHECK (length(description)       <= 3000);

ALTER TABLE project_roles
    ADD CONSTRAINT chk_project_roles_role_name CHECK (length(trim(role_name)) BETWEEN 2 AND 100);

ALTER TABLE applications
    ADD CONSTRAINT chk_applications_note CHECK (length(note) <= 1000);

ALTER TABLE messages
    ADD CONSTRAINT chk_messages_content CHECK (length(trim(content)) BETWEEN 1 AND 2000);

ALTER TABLE team_posts
    ADD CONSTRAINT chk_team_posts_content CHECK (length(trim(content)) BETWEEN 1 AND 5000);

ALTER TABLE news
    ADD CONSTRAINT chk_news_title   CHECK (length(trim(title))   BETWEEN 5 AND 200);


-- ============================================================
-- 4. DİZİ BOYUTU CONSTRAINTS
-- ============================================================

ALTER TABLE team_posts
    ADD CONSTRAINT chk_team_posts_image_urls_size
        CHECK (cardinality(image_urls) <= 10);

ALTER TABLE news
    ADD CONSTRAINT chk_news_tags_size
        CHECK (tags IS NULL OR cardinality(tags) <= 20);


-- ============================================================
-- ROLLBACK (gerekirse):
--
-- ALTER TABLE users
--     DROP CONSTRAINT IF EXISTS chk_users_role,
--     DROP CONSTRAINT IF EXISTS chk_users_plan,
--     DROP CONSTRAINT IF EXISTS chk_users_name,
--     DROP CONSTRAINT IF EXISTS chk_users_bio,
--     DROP CONSTRAINT IF EXISTS chk_users_max_teams,
--     DROP CONSTRAINT IF EXISTS chk_users_max_projects;
--
-- ALTER TABLE teams
--     DROP CONSTRAINT IF EXISTS chk_teams_status,
--     DROP CONSTRAINT IF EXISTS chk_teams_name;
--
-- ALTER TABLE projects
--     DROP CONSTRAINT IF EXISTS chk_projects_status,
--     DROP CONSTRAINT IF EXISTS chk_projects_title,
--     DROP CONSTRAINT IF EXISTS chk_projects_description;
--
-- ALTER TABLE applications
--     DROP CONSTRAINT IF EXISTS chk_applications_status,
--     DROP CONSTRAINT IF EXISTS chk_applications_note;
--
-- ALTER TABLE project_members
--     DROP CONSTRAINT IF EXISTS chk_project_members_role;
--
-- ALTER TABLE project_roles
--     DROP CONSTRAINT IF EXISTS chk_project_roles_role_name;
--
-- ALTER TABLE messages
--     DROP CONSTRAINT IF EXISTS chk_messages_content;
--
-- ALTER TABLE team_posts
--     DROP CONSTRAINT IF EXISTS chk_team_posts_like_count,
--     DROP CONSTRAINT IF EXISTS chk_team_posts_content,
--     DROP CONSTRAINT IF EXISTS chk_team_posts_image_urls_size;
--
-- ALTER TABLE news
--     DROP CONSTRAINT IF EXISTS chk_news_like_count,
--     DROP CONSTRAINT IF EXISTS chk_news_view_count,
--     DROP CONSTRAINT IF EXISTS chk_news_title,
--     DROP CONSTRAINT IF EXISTS chk_news_tags_size;
-- ============================================================
