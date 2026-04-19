-- ============================================================
-- MIGRATION: Başvuru kabul edilince aynı projedeki diğer
--            bekleyen başvuruları otomatik reddet
-- ============================================================

create or replace function reject_other_applications_on_accepted()
returns trigger language plpgsql security definer as $$
begin
    if new.status = 'accepted' and (old.status is null or old.status <> 'accepted') then
        update applications
        set status = 'rejected'
        where user_id    = new.user_id
          and project_id = new.project_id
          and id         <> new.id
          and status     = 'pending';
    end if;
    return new;
end;
$$;

create or replace trigger trg_reject_other_applications_on_accepted
    after update on applications
    for each row execute function reject_other_applications_on_accepted();
