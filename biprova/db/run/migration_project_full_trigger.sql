-- ============================================================
-- MIGRATION: Tüm roller dolunca projects.status = 'full' yap
-- Akış:
--   project_roles.is_filled → true olunca tetiklenir
--   Projedeki hiç dolu olmayan rol kalmadıysa status = 'full'
--   Bu da trg_create_team_on_project_full'ı tetikler → ekip kurulur
-- ============================================================

CREATE OR REPLACE FUNCTION check_project_full()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- Projede hâlâ dolu olmayan rol var mı?
    IF NOT EXISTS (
        SELECT 1 FROM project_roles
        WHERE project_id = NEW.project_id
          AND is_filled = false
    ) THEN
        UPDATE projects
        SET status = 'full'
        WHERE id = NEW.project_id
          AND status = 'open';
    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_check_project_full
    AFTER UPDATE OF is_filled ON project_roles
    FOR EACH ROW
    WHEN (NEW.is_filled = true AND OLD.is_filled = false)
    EXECUTE FUNCTION check_project_full();


-- ============================================================
-- ROLLBACK (gerekirse):
--
-- DROP TRIGGER IF EXISTS trg_check_project_full ON project_roles;
-- DROP FUNCTION IF EXISTS check_project_full();
-- ============================================================
