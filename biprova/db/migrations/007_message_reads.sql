-- ============================================================
-- Migration 007 — message_reads (okundu bilgisi)
--
-- Her ekip üyesinin bir takımdaki son okuduğu mesajı tutar.
-- "Bu mesajı kimler gördü?" = last_read_at >= messages.created_at
-- olan üyeler (gönderen hariç).
-- ============================================================

create table message_reads (
    team_id              uuid        not null references teams(id) on delete cascade,
    user_id              uuid        not null references users(id) on delete cascade,
    last_read_message_id uuid        references messages(id) on delete set null,
    last_read_at         timestamptz not null default now(),
    primary key (team_id, user_id)
);

create index on message_reads(team_id);
create index on message_reads(user_id);

alter table message_reads enable row level security;

-- Sadece aynı ekibin üyeleri görebilir
create policy "message_reads_select"
on message_reads for select
using (
    exists (
        select 1 from team_members
        where team_id = message_reads.team_id
          and user_id = auth.uid()
    )
);

-- Sadece kendi kaydını upsert edebilir
create policy "message_reads_upsert"
on message_reads for insert
with check (user_id = auth.uid());

create policy "message_reads_update"
on message_reads for update
using (user_id = auth.uid());

grant select, insert, update on public.message_reads to authenticated;
