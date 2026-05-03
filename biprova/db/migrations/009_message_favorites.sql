-- ============================================================
-- Migration 009 — message_favorites
--
-- Kişi başına favori mesaj listesi.
-- Favori kişiye özeldir; başkaları göremez.
-- ============================================================

create table message_favorites (
    id         uuid        primary key default gen_random_uuid(),
    user_id    uuid        not null references users(id) on delete cascade,
    message_id uuid        not null references messages(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (user_id, message_id)
);

create index on message_favorites(user_id);
create index on message_favorites(message_id);

alter table message_favorites enable row level security;

-- Kullanıcı sadece kendi favorilerini okuyabilir
create policy "message_favorites_select"
on message_favorites for select
using (user_id = auth.uid());

-- Kullanıcı sadece kendine favori ekleyebilir
create policy "message_favorites_insert"
on message_favorites for insert
with check (user_id = auth.uid());

-- Kullanıcı sadece kendi favorisini silebilir
create policy "message_favorites_delete"
on message_favorites for delete
using (user_id = auth.uid());

grant select, insert, delete on public.message_favorites to authenticated;
