-- ============================================================
-- MIGRATION: projects.status'tan 'active' kaldır
-- 'active' olan satırları 'full' yap, constraint güncelle
-- ============================================================

-- 1. Mevcut 'active' projeleri 'full' yap
update projects
set status = 'full'
where status = 'active';

-- 2. Eski constraint'i kaldır
alter table projects
    drop constraint chk_projects_status;

-- 3. 'active' olmadan yeni constraint ekle
alter table projects
    add constraint chk_projects_status
        check (status in ('open', 'full', 'completed', 'cancelled'));
