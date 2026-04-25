-- ============================================================
-- Migration 004 — Hoşgeldiniz bildirimi
--
-- app_config'e welcome template ekler.
-- public.users INSERT'inde yeni kullanıcıya bildirim gönderir.
-- ============================================================

-- Template'i mevcut notification_templates'e ekle
update app_config
set value = jsonb_set(
    value,
    '{welcome}',
    '{"title": "Biprova''ya Hoş Geldin! 🎉", "body": "Projeni paylaş, ekibini kur, harekete geç."}'::jsonb
)
where key = 'notification_templates';


-- ============================================================
-- TRIGGER: Yeni kullanıcı kaydolunca hoşgeldiniz bildirimi
-- public.users INSERT → create_notification
-- ============================================================

create or replace function notify_user_welcome()
returns trigger language plpgsql security definer as $$
begin
    perform create_notification(
        new.id,
        'welcome',
        '{}'::jsonb
    );
    return new;
end;
$$;

create or replace trigger trg_notify_user_welcome
    after insert on public.users
    for each row
    execute function notify_user_welcome();
