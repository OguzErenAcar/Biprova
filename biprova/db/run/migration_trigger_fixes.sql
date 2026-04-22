-- ============================================================
-- MIGRATION: Trigger düzeltmeleri
-- 1. fn_dissolve_project  — orphan team bırakma sorunu
-- 2. create_team_on_project_full — sıfır rollü proje koruması
-- 3. handle_auth_user_login — profil yoksa fallback upsert
-- 4. delete_project_on_empty_members — N+1 optimizasyonu
-- ============================================================


-- ============================================================
-- 1. fn_dissolve_project: orphan team düzeltmesi
--    Önce bağlı ekibin project_id'sini null yap → sil
--    (project_id null olunca trg_delete_project_on_team_deleted projeyi silmez)
--    Sonra projeyi sil
-- ============================================================

CREATE OR REPLACE FUNCTION fn_dissolve_project(p_project_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_team_id uuid;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM projects
        WHERE id = p_project_id AND leader_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Yetkisiz: sadece proje lideri feshedebilir';
    END IF;

    SELECT id INTO v_team_id FROM teams WHERE project_id = p_project_id LIMIT 1;
    IF v_team_id IS NOT NULL THEN
        UPDATE teams SET project_id = NULL WHERE id = v_team_id;
        DELETE FROM teams WHERE id = v_team_id;
    END IF;

    DELETE FROM projects WHERE id = p_project_id;
END;
$$;


-- ============================================================
-- 2. create_team_on_project_full: sıfır rollü proje koruması
--    Hiç rolü olmayan proje full olursa ekip kurulmasın
-- ============================================================

CREATE OR REPLACE FUNCTION create_team_on_project_full()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    new_team_id uuid;
BEGIN
    IF NEW.status = 'full' AND (OLD.status IS NULL OR OLD.status <> 'full') THEN
        IF NOT EXISTS (SELECT 1 FROM project_roles WHERE project_id = NEW.id) THEN
            RETURN NEW;
        END IF;

        INSERT INTO teams (name, leader_id, status, project_id, formed_at, deadline)
        VALUES (NEW.title || ' ekibi', NEW.leader_id, 'pending', NEW.id, now(), now() + INTERVAL '24 hours')
        RETURNING id INTO new_team_id;

        INSERT INTO team_members (team_id, user_id, role_id)
        SELECT new_team_id, pr.filled_by, pr.id
        FROM project_roles pr
        WHERE pr.project_id = NEW.id
          AND pr.filled_by IS NOT NULL
        ON CONFLICT (team_id, user_id) DO NOTHING;

        INSERT INTO team_members (team_id, user_id, role_id)
        VALUES (new_team_id, NEW.leader_id, NULL)
        ON CONFLICT (team_id, user_id) DO NOTHING;

        UPDATE projects SET team_id = new_team_id WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$;


-- ============================================================
-- 3. handle_auth_user_login: fallback upsert
--    trg_auth_user_created başarısız olduysa login anında profil oluşturur
-- ============================================================

CREATE OR REPLACE FUNCTION handle_auth_user_login()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
        INSERT INTO public.users (id, email, name, last_sign_in_at)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
            NEW.last_sign_in_at
        )
        ON CONFLICT (id) DO UPDATE SET last_sign_in_at = EXCLUDED.last_sign_in_at;
    END IF;
    RETURN NEW;
END;
$$;


-- ============================================================
-- 4. delete_project_on_empty_members: N+1 optimizasyonu
--    Ayrı EXISTS kontrolü kaldırıldı; tek DELETE yeterli
--    Proje yoksa 0 satır etkilenir — cascade loop riski yok
-- ============================================================

CREATE OR REPLACE FUNCTION delete_project_on_empty_members()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM projects
    WHERE id = OLD.project_id
      AND NOT EXISTS (
          SELECT 1 FROM project_members WHERE project_id = OLD.project_id
      );
    RETURN OLD;
END;
$$;


-- ============================================================
-- ROLLBACK (gerekirse):
--
-- fn_dissolve_project eski haline döndür:
-- CREATE OR REPLACE FUNCTION fn_dissolve_project(p_project_id uuid)
-- RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM projects WHERE id = p_project_id AND leader_id = auth.uid()) THEN
--         RAISE EXCEPTION 'Yetkisiz: sadece proje lideri feshedebilir';
--     END IF;
--     DELETE FROM projects WHERE id = p_project_id;
-- END;
-- $$;
--
-- handle_auth_user_login eski haline döndür:
-- CREATE OR REPLACE FUNCTION handle_auth_user_login()
-- RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
-- BEGIN
--     IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
--         UPDATE public.users SET last_sign_in_at = NEW.last_sign_in_at WHERE id = NEW.id;
--     END IF;
--     RETURN NEW;
-- END;
-- $$;
-- ============================================================
