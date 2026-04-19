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

-- ============================================================
-- MIGRATION: Auth e-posta değişince public.users'ı güncelle
-- ============================================================

create or replace function handle_auth_user_email_updated()
returns trigger language plpgsql security definer as $$
begin
    if new.email is distinct from old.email then
        update public.users
        set email = new.email
        where id = new.id;
    end if;
    return new;
end;
$$;

create or replace trigger trg_auth_user_email_updated
    after update on auth.users
    for each row execute function handle_auth_user_email_updated();

-- ============================================================
-- MIGRATION: Kayıt sırasında waitlist'teki e-posta ise
--            kullanıcıya top100 badge'i ver
-- ============================================================

create or replace function handle_auth_user_created()
returns trigger language plpgsql security definer as $$
declare
    v_badge text := null;
begin
    -- Waitlist'te kayıtlı e-posta ise top100 badge'i ver
    if exists (select 1 from public.waitlist where email = new.email) then
        v_badge := 'top100';
    end if;

    insert into public.users (id, email, name, badge)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        v_badge
    )
    on conflict (id) do nothing;
    return new;
end;
$$;
