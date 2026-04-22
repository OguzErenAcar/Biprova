-- ============================================================
-- MIGRATION: Proje bilgileri sadece giriş yapmış kullanıcılara açık
-- Kapsam:
--   1. projects          — anonim okuma kapatıldı
--   2. project_roles     — anonim okuma kapatıldı
--   3. project_role_skills — anonim okuma kapatıldı
-- ============================================================


-- 1. projects
DROP POLICY IF EXISTS "projects_read" ON projects;
CREATE POLICY "projects_read" ON projects FOR SELECT
USING (auth.uid() IS NOT NULL);


-- 2. project_roles
DROP POLICY IF EXISTS "project_roles_read" ON project_roles;
CREATE POLICY "project_roles_read" ON project_roles FOR SELECT
USING (auth.uid() IS NOT NULL);


-- 3. project_role_skills
DROP POLICY IF EXISTS "role_skills_read" ON project_role_skills;
CREATE POLICY "role_skills_read" ON project_role_skills FOR SELECT
USING (auth.uid() IS NOT NULL);


-- ============================================================
-- ROLLBACK (gerekirse):
--
-- DROP POLICY IF EXISTS "projects_read"    ON projects;
-- CREATE POLICY "projects_read"    ON projects            FOR SELECT USING (true);
--
-- DROP POLICY IF EXISTS "project_roles_read" ON project_roles;
-- CREATE POLICY "project_roles_read" ON project_roles     FOR SELECT USING (true);
--
-- DROP POLICY IF EXISTS "role_skills_read" ON project_role_skills;
-- CREATE POLICY "role_skills_read" ON project_role_skills FOR SELECT USING (true);
-- ============================================================
