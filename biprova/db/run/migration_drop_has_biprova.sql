-- ============================================================
-- MIGRATION: has_biprova kaldırma
-- Etkilenen yerler:
--   1. team_members(has_biprova) partial index
--   2. projects_insert policy (has_biprova koşulu)
--   3. team_members.has_biprova kolonu
-- ============================================================


-- 1. Index'i kaldır
DROP INDEX IF EXISTS team_members_has_biprova_idx;


-- 2. projects_insert policy'sini güncelle (has_biprova koşulu çıkarıldı)
DROP POLICY IF EXISTS "projects_insert" ON projects;

CREATE POLICY "projects_insert" ON projects FOR INSERT
WITH CHECK (
    leader_id = auth.uid()
    AND (
        team_id IS NULL
        OR EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_id
              AND t.leader_id = auth.uid()
              AND t.status IN ('active', 'no_project', 'pending')
        )
    )
);


-- 3. Kolonu kaldır
ALTER TABLE team_members DROP COLUMN IF EXISTS has_biprova;


-- ============================================================
-- ROLLBACK (gerekirse):
--
-- ALTER TABLE team_members ADD COLUMN has_biprova boolean default false;
--
-- CREATE INDEX team_members_has_biprova_idx
--     ON team_members(has_biprova) WHERE has_biprova = true;
--
-- DROP POLICY IF EXISTS "projects_insert" ON projects;
--
-- CREATE POLICY "projects_insert" ON projects FOR INSERT
-- WITH CHECK (
--     leader_id = auth.uid()
--     AND (
--         team_id IS NULL
--         OR EXISTS (
--             SELECT 1 FROM teams t
--             WHERE t.id = team_id
--               AND t.leader_id = auth.uid()
--               AND t.status IN ('active', 'no_project', 'pending')
--         )
--         OR EXISTS (
--             SELECT 1 FROM team_members tm
--             WHERE tm.team_id = team_id
--               AND tm.user_id = auth.uid()
--               AND tm.has_biprova = true
--         )
--     )
-- );
-- ============================================================
