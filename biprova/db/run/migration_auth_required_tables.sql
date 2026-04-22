-- ============================================================
-- MIGRATION: Giriş gerektiren tablo policy'leri
-- Anonim kullanıcılar aşağıdaki tablolara erişemez.
-- Lookup tabloları (skills, categories, cities, badges) açık kalır —
-- signup formlarında oturum açılmadan önce okunmaları gerekiyor.
-- ============================================================


-- 1. teams
DROP POLICY IF EXISTS "teams_read" ON teams;
CREATE POLICY "teams_read" ON teams FOR SELECT
USING (auth.uid() IS NOT NULL);


-- 2. user_skills
DROP POLICY IF EXISTS "user_skills_read" ON user_skills;
CREATE POLICY "user_skills_read" ON user_skills FOR SELECT
USING (auth.uid() IS NOT NULL);


-- 3. project_members
DROP POLICY IF EXISTS "pm_read" ON project_members;
CREATE POLICY "pm_read" ON project_members FOR SELECT
USING (auth.uid() IS NOT NULL);


-- 4. team_posts
DROP POLICY IF EXISTS "team_posts_read" ON team_posts;
CREATE POLICY "team_posts_read" ON team_posts FOR SELECT
USING (auth.uid() IS NOT NULL);


-- 5. team_post_likes
DROP POLICY IF EXISTS "post_likes_read" ON team_post_likes;
CREATE POLICY "post_likes_read" ON team_post_likes FOR SELECT
USING (auth.uid() IS NOT NULL);


-- 6. news (yayınlanmış haberler de artık giriş gerektiriyor)
DROP POLICY IF EXISTS "news_read" ON news;
CREATE POLICY "news_read" ON news FOR SELECT
USING (auth.uid() IS NOT NULL AND is_published = true);


-- ============================================================
-- ROLLBACK (gerekirse):
--
-- DROP POLICY IF EXISTS "teams_read"      ON teams;
-- CREATE POLICY "teams_read"      ON teams            FOR SELECT USING (true);
--
-- DROP POLICY IF EXISTS "user_skills_read" ON user_skills;
-- CREATE POLICY "user_skills_read" ON user_skills      FOR SELECT USING (true);
--
-- DROP POLICY IF EXISTS "pm_read"         ON project_members;
-- CREATE POLICY "pm_read"         ON project_members  FOR SELECT USING (true);
--
-- DROP POLICY IF EXISTS "team_posts_read" ON team_posts;
-- CREATE POLICY "team_posts_read" ON team_posts        FOR SELECT USING (true);
--
-- DROP POLICY IF EXISTS "post_likes_read" ON team_post_likes;
-- CREATE POLICY "post_likes_read" ON team_post_likes   FOR SELECT USING (true);
--
-- DROP POLICY IF EXISTS "news_read"       ON news;
-- CREATE POLICY "news_read"       ON news              FOR SELECT USING (is_published = true);
-- ============================================================
