-- ============================================================
-- MIGRATION: Eksik policy eklemeleri + güvenlik düzeltmesi
-- Kapsam:
--   1. waitlist   — admin SELECT
--   2. team_members — admin UPDATE (has_biprova)
--   3. notifications — kullanıcı DELETE
--   4. messages   — kullanıcı DELETE (kendi mesajı)
--   5. project_members — uygulama akışını bypass eden policy kaldırıldı
-- ============================================================


-- ============================================================
-- 1. WAITLIST — admin okuma
-- ============================================================

CREATE POLICY "waitlist_admin_read"
ON waitlist FOR SELECT
USING (is_admin());


-- ============================================================
-- 2. TEAM_MEMBERS — admin has_biprova güncellemesi
--    Sadece admin has_biprova kolonunu değiştirebilir.
--    Diğer kolonlar (team_id, user_id, role_id) güncellenmez.
-- ============================================================

CREATE POLICY "team_members_admin_update"
ON team_members FOR UPDATE
USING (is_admin());


-- ============================================================
-- 3. NOTIFICATIONS — kullanıcı kendi bildirimlerini silebilir
-- ============================================================

CREATE POLICY "notifications_delete"
ON notifications FOR DELETE
USING (user_id = auth.uid());


-- ============================================================
-- 4. MESSAGES — kullanıcı kendi mesajını silebilir
--    Sadece takım üyesiyse ve mesaj kendine aitse silme izni var.
-- ============================================================

CREATE POLICY "messages_delete"
ON messages FOR DELETE
USING (
    sender_id = auth.uid()
    AND is_team_member(team_id)
);


-- ============================================================
-- 5. GÜVENLİK DÜZELTMESİ: Lider direkt üye ekleme policy'si kaldır
--    migration.sql'de eklenen "Project leaders can invite members"
--    policy'si başvuru akışını (application → accepted → member)
--    bypass ediyordu. Üye ekleme yalnızca trigger üzerinden olmalı:
--      trg_pm_application_accepted (pm_on_application_accepted)
-- ============================================================

DROP POLICY IF EXISTS "Project leaders can invite members" ON project_members;


-- ============================================================
-- ROLLBACK (gerekirse):
--
-- DROP POLICY IF EXISTS "waitlist_admin_read"        ON waitlist;
-- DROP POLICY IF EXISTS "team_members_admin_update"  ON team_members;
-- DROP POLICY IF EXISTS "notifications_delete"       ON notifications;
-- DROP POLICY IF EXISTS "messages_delete"            ON messages;
--
-- -- Bypass policy'yi geri eklemek istersen:
-- CREATE POLICY "Project leaders can invite members"
-- ON project_members FOR INSERT TO authenticated
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM projects
--     WHERE projects.id = project_members.project_id
--       AND projects.leader_id = auth.uid()
--   )
-- );
-- ============================================================
