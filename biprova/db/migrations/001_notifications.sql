-- ============================================================
-- Migration 001 — Notification System
--
-- Çalıştırma sırası (bağımlılık nedeniyle):
--   1. Bu dosya (app_config + create_notification + trigger'lar)
--
-- Faz 1: app_config tablosu + create_notification fonksiyonu
-- Faz 2: Başvuru trigger'ları (new_application, accepted, rejected)
-- Faz 3: Ekip trigger'ları (team_formed, removed_from_team,
--                           new_leader, project_deleted)
-- ============================================================


-- ============================================================
-- FAZ 1 — app_config tablosu
-- ============================================================

create table if not exists app_config (
    key         text        primary key,
    value       jsonb       not null,
    description text,
    updated_at  timestamptz not null default now()
);

create or replace function set_app_config_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger trg_app_config_updated_at
    before update on app_config
    for each row execute function set_app_config_updated_at();

alter table app_config enable row level security;

create policy "authenticated users can read app_config"
    on app_config for select
    to authenticated
    using (true);


-- ============================================================
-- FAZ 1 — notification_templates seed
-- ============================================================

insert into app_config (key, value, description) values (
  'notification_templates',
  '{
    "new_application": {
      "title": "Yeni başvuru",
      "body": "{{applicant_name}}, {{role_name}} rolüne başvurdu."
    },
    "application_accepted": {
      "title": "Başvurun kabul edildi 🎉",
      "body": "{{project_title}} projesinde {{role_name}} rolüne kabul edildin."
    },
    "application_rejected": {
      "title": "Başvurun reddedildi",
      "body": "{{project_title}} projesindeki {{role_name}} başvurun reddedildi."
    },
    "team_formed": {
      "title": "Ekip kuruldu! 🚀",
      "body": "{{project_title}} ekibinin tüm rolleri doldu. Artık takım üyesisin!"
    },
    "new_message": {
      "title": "Yeni mesaj",
      "body": "{{sender_name}}: {{message_preview}}"
    },
    "removed_from_team": {
      "title": "Ekipten çıkarıldın",
      "body": "{{project_title}} ekibinden çıkarıldın."
    },
    "new_leader": {
      "title": "Artık lidersin 👑",
      "body": "{{project_title}} projesinin yeni lideri sensin."
    },
    "project_deleted": {
      "title": "Proje silindi",
      "body": "Üyesi olduğun {{project_title}} projesi silindi."
    },
    "project_full": {
      "title": "Proje doldu",
      "body": "{{project_title}} projesinin tüm rolleri doldu."
    },
    "new_news": {
      "title": "Yeni haber",
      "body": "{{headline}}"
    },
    "post_published": {
      "title": "Gönderin yayında 🎊",
      "body": "Biprova ile oluşturduğun \"{{post_title}}\" yayına girdi."
    },
    "team_post": {
      "title": "Yeni gönderi",
      "body": "{{team_name}} ekibi yeni bir gönderi paylaştı: {{post_title}}"
    }
  }'::jsonb,
  'Bildirim başlık ve metin şablonları. {{değişken}} formatında placeholder kullanır.'
)
on conflict (key) do update
  set value       = excluded.value,
      description = excluded.description,
      updated_at  = now();


-- ============================================================
-- FAZ 1 — create_notification fonksiyonu
-- Kullanım: select create_notification(user_id, 'new_application',
--             '{"applicant_name":"Ali","role_name":"Geliştirici"}')
-- ============================================================

create or replace function create_notification(
    p_user_id uuid,
    p_type    text,
    p_vars    jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
as $$
declare
    v_template jsonb;
    v_title    text;
    v_body     text;
    v_key      text;
    v_val      text;
begin
    select value -> p_type
    into v_template
    from app_config
    where key = 'notification_templates';

    if v_template is null then
        return;
    end if;

    v_title := v_template ->> 'title';
    v_body  := v_template ->> 'body';

    for v_key, v_val in
        select * from jsonb_each_text(p_vars)
    loop
        v_title := replace(v_title, '{{' || v_key || '}}', v_val);
        v_body  := replace(v_body,  '{{' || v_key || '}}', v_val);
    end loop;

    insert into notifications (user_id, type, payload)
    values (
        p_user_id,
        p_type,
        jsonb_build_object('title', v_title, 'body', v_body)
    );
end;
$$;


-- ============================================================
-- FAZ 2 — Başvuru: yeni başvuru gelince proje liderine bildirim
-- ============================================================

create or replace function notify_new_application()
returns trigger language plpgsql security definer as $$
declare
    v_leader_id uuid;
    v_role_name text;
    v_applicant text;
begin
    select p.leader_id, pr.role_name
    into v_leader_id, v_role_name
    from projects p
    join project_roles pr on pr.id = new.role_id
    where p.id = new.project_id;

    select name into v_applicant from users where id = new.user_id;

    if v_leader_id = new.user_id then
        return new;
    end if;

    perform create_notification(
        v_leader_id,
        'new_application',
        jsonb_build_object(
            'applicant_name', v_applicant,
            'role_name',      v_role_name
        )
    );
    return new;
end;
$$;

create or replace trigger trg_notify_new_application
    after insert on applications
    for each row
    execute function notify_new_application();


-- ============================================================
-- FAZ 2 — Başvuru: kabul/red edilince başvurana bildirim
-- auto-reject (reject_other_applications_on_accepted) de kapsar
-- ============================================================

create or replace function notify_application_status_changed()
returns trigger language plpgsql security definer as $$
declare
    v_project_title text;
    v_role_name     text;
begin
    if new.status = old.status then
        return new;
    end if;

    if new.status not in ('accepted', 'rejected') then
        return new;
    end if;

    select p.title, pr.role_name
    into v_project_title, v_role_name
    from projects p
    join project_roles pr on pr.id = new.role_id
    where p.id = new.project_id;

    perform create_notification(
        new.user_id,
        case new.status
            when 'accepted' then 'application_accepted'
            when 'rejected' then 'application_rejected'
        end,
        jsonb_build_object(
            'project_title', v_project_title,
            'role_name',     v_role_name
        )
    );
    return new;
end;
$$;

create or replace trigger trg_notify_application_status_changed
    after update of status on applications
    for each row
    execute function notify_application_status_changed();


-- ============================================================
-- FAZ 3 — Ekip: kurulunca tüm üyelere bildirim
-- teams INSERT anında team_members henüz yok →
-- project_roles.filled_by + leader_id'den okuyoruz
-- ============================================================

create or replace function notify_team_formed()
returns trigger language plpgsql security definer as $$
declare
    v_project_title text;
    v_uid           uuid;
begin
    if new.project_id is null then
        return new;
    end if;

    select title into v_project_title from projects where id = new.project_id;

    for v_uid in
        select filled_by
        from project_roles
        where project_id = new.project_id
          and filled_by is not null
        union
        select new.leader_id
    loop
        perform create_notification(
            v_uid,
            'team_formed',
            jsonb_build_object('project_title', v_project_title)
        );
    end loop;

    return new;
end;
$$;

create or replace trigger trg_notify_team_formed
    after insert on teams
    for each row
    execute function notify_team_formed();


-- ============================================================
-- FAZ 3 — Ekip: üye çıkarılınca bildirim
-- Fesih cascade'inde team artık yok → bildirim gönderme
-- ============================================================

create or replace function notify_removed_from_team()
returns trigger language plpgsql security definer as $$
declare
    v_project_title text;
    v_leader_id     uuid;
begin
    if not exists (select 1 from teams where id = old.team_id) then
        return old;
    end if;

    select p.title, t.leader_id
    into v_project_title, v_leader_id
    from teams t
    left join projects p on p.id = t.project_id
    where t.id = old.team_id;

    if old.user_id = v_leader_id then
        return old;
    end if;

    perform create_notification(
        old.user_id,
        'removed_from_team',
        jsonb_build_object('project_title', coalesce(v_project_title, 'Ekip'))
    );
    return old;
end;
$$;

create or replace trigger trg_notify_removed_from_team
    after delete on team_members
    for each row
    execute function notify_removed_from_team();


-- ============================================================
-- FAZ 3 — Ekip: liderlik devredilince yeni lidere bildirim
-- ============================================================

create or replace function notify_new_leader()
returns trigger language plpgsql security definer as $$
begin
    if new.leader_id is distinct from old.leader_id then
        perform create_notification(
            new.leader_id,
            'new_leader',
            jsonb_build_object('project_title', new.title)
        );
    end if;
    return new;
end;
$$;

create or replace trigger trg_notify_new_leader
    after update of leader_id on projects
    for each row
    execute function notify_new_leader();


-- ============================================================
-- FAZ 3 — Proje: silinince üyelere bildirim
-- BEFORE DELETE: cascade başlamadan project_members'ı yakala
-- ============================================================

create or replace function notify_project_deleted()
returns trigger language plpgsql security definer as $$
declare
    v_uid uuid;
begin
    for v_uid in
        select user_id
        from project_members
        where project_id = old.id
          and user_id <> old.leader_id
    loop
        perform create_notification(
            v_uid,
            'project_deleted',
            jsonb_build_object('project_title', old.title)
        );
    end loop;

    return old;
end;
$$;

create or replace trigger trg_notify_project_deleted
    before delete on projects
    for each row
    execute function notify_project_deleted();
