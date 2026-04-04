-- ============================================================
-- BUSINESS LOGIC FUNCTIONS
-- Sıra: 1-proje_fesih, 2-team_fesih, 3-proje_cikis, 4-team_cikis
-- ============================================================

-- ============================================================
-- 1. PROJE FESİH (Lider projeyi fesheder)
-- Akış: proje sil → cascade: project_roles, applications,
--       project_members silinir; bağlı team varsa no_project olur
-- ============================================================

create or replace function fn_dissolve_project(p_project_id uuid)
returns void language plpgsql security definer as $$
begin
    -- Sadece proje kurucusu feshedebilir
    if not exists (
        select 1 from projects
        where id = p_project_id and creator_id = auth.uid()
    ) then
        raise exception 'Yetkisiz: sadece proje kurucusu feshedebilir';
    end if;

    -- Bağlı team varsa no_project yap (proje silinince FK set null olur ama
    -- status otomatik güncellenmez)
    update teams
    set status = 'no_project'
    where project_id = p_project_id;

    -- Projeyi sil:
    --   cascade → project_roles, applications, project_members silinir
    --   FK on delete set null → teams.project_id null olur
    delete from projects where id = p_project_id;
end;
$$;

grant execute on function fn_dissolve_project(uuid) to authenticated;
