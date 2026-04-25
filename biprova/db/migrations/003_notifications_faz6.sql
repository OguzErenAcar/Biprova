-- ============================================================
-- Migration 003 — Notification System Faz 6
--
-- İçerik bildirimleri:
--   new_news       — haber yayınlanınca tüm kullanıcılara
--   post_published — gönderi oluşturulunca yazara
--   team_post      — gönderi oluşturulunca diğer ekip üyelerine
-- ============================================================


-- ============================================================
-- FAZ 6 — Haber: yayınlanınca tüm kullanıcılara bildirim
-- Tetikleyici: is_published → true (insert veya update)
-- ============================================================

create or replace function notify_new_news()
returns trigger language plpgsql security definer as $$
declare
    v_uid uuid;
begin
    -- Sadece is_published true olan yeni durumda çalış
    if new.is_published is not true then
        return new;
    end if;

    -- UPDATE ise zaten yayındaydıysa tekrar gönderme
    if TG_OP = 'UPDATE' and old.is_published is true then
        return new;
    end if;

    for v_uid in
        select id from users
    loop
        -- Haberin yazarına gönderme
        if v_uid = new.author_id then
            continue;
        end if;

        perform create_notification(
            v_uid,
            'new_news',
            jsonb_build_object('headline', new.title)
        );
    end loop;

    return new;
end;
$$;

create or replace trigger trg_notify_new_news
    after insert or update of is_published on news
    for each row
    execute function notify_new_news();


-- ============================================================
-- FAZ 6 — Gönderi: oluşturulunca yazara + ekip üyelerine bildirim
-- post_published → yazar
-- team_post      → diğer ekip üyeleri
-- ============================================================

create or replace function notify_team_post_created()
returns trigger language plpgsql security definer as $$
declare
    v_team_name text;
    v_preview   text;
    v_uid       uuid;
begin
    select name into v_team_name from teams where id = new.team_id;

    v_preview := left(new.content, 50);
    if length(new.content) > 50 then
        v_preview := v_preview || '...';
    end if;

    -- Yazara: "Gönderin yayında"
    perform create_notification(
        new.author_id,
        'post_published',
        jsonb_build_object('post_title', v_preview)
    );

    -- Diğer ekip üyelerine: "Yeni gönderi"
    for v_uid in
        select user_id
        from team_members
        where team_id = new.team_id
          and user_id <> new.author_id
    loop
        perform create_notification(
            v_uid,
            'team_post',
            jsonb_build_object(
                'team_name',  coalesce(v_team_name, 'Ekip'),
                'post_title', v_preview
            )
        );
    end loop;

    return new;
end;
$$;

create or replace trigger trg_notify_team_post_created
    after insert on team_posts
    for each row
    execute function notify_team_post_created();
