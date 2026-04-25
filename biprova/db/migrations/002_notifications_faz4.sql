-- ============================================================
-- Migration 002 — Notification System Faz 4
--
-- Mesaj bildirimleri: yeni mesaj gelince tüm ekip üyelerine
-- (gönderen hariç) bildirim gider.
-- ============================================================


-- ============================================================
-- FAZ 4 — Mesaj: yeni mesaj gelince ekip üyelerine bildirim
-- ============================================================

create or replace function notify_new_message()
returns trigger language plpgsql security definer as $$
declare
    v_sender_name text;
    v_preview     text;
    v_uid         uuid;
begin
    select name into v_sender_name from users where id = new.sender_id;

    v_preview := left(new.content, 60);
    if length(new.content) > 60 then
        v_preview := v_preview || '...';
    end if;

    for v_uid in
        select user_id
        from team_members
        where team_id = new.team_id
          and user_id <> new.sender_id
    loop
        perform create_notification(
            v_uid,
            'new_message',
            jsonb_build_object(
                'sender_name',     v_sender_name,
                'message_preview', v_preview
            )
        );
    end loop;

    return new;
end;
$$;

create or replace trigger trg_notify_new_message
    after insert on messages
    for each row
    execute function notify_new_message();
