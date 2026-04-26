-- ============================================================
-- 006 — team_files
-- Çalıştır: Supabase Dashboard → SQL Editor
-- ============================================================

create table team_files (
    id           uuid primary key default uuid_generate_v4(),
    team_id      uuid references teams(id) on delete cascade not null,
    uploader_id  uuid references users(id) on delete cascade not null,
    name         text not null
                     constraint chk_team_files_name check (length(trim(name)) between 1 and 200),
    type         text not null
                     constraint chk_team_files_type check (type in ('file', 'link')),
    url          text not null,
    size         integer
                     constraint chk_team_files_size check (size is null or size > 0),
    mime_type    text,
    created_at   timestamp default now()
);

create index on team_files(team_id);
create index on team_files(uploader_id);

alter table team_files enable row level security;

create policy "team_files_member_read"
on team_files for select
using (
    exists (
        select 1 from team_members
        where team_id = team_files.team_id
          and user_id = auth.uid()
    )
);

create policy "team_files_member_insert"
on team_files for insert
with check (
    auth.uid() = uploader_id
    and exists (
        select 1 from team_members
        where team_id = team_files.team_id
          and user_id = auth.uid()
    )
);

create policy "team_files_delete"
on team_files for delete
using (
    auth.uid() = uploader_id
    or exists (
        select 1 from teams
        where id = team_files.team_id
          and leader_id = auth.uid()
    )
);

-- ============================================================
-- STORAGE BUCKET
-- Path: team-files/{team_id}/{uuid}.{ext}
-- ============================================================

insert into storage.buckets (id, name, public)
values ('team-files', 'team-files', true)
on conflict (id) do nothing;

create policy "team_files_bucket_member_read"
on storage.objects for select
using ( bucket_id = 'team-files' );

create policy "team_files_bucket_member_upload"
on storage.objects for insert
with check (
    bucket_id = 'team-files'
    and exists (
        select 1 from team_members
        where team_id = (storage.foldername(name))[1]::uuid
          and user_id = auth.uid()
    )
);

create policy "team_files_bucket_member_delete"
on storage.objects for delete
using (
    bucket_id = 'team-files'
    and exists (
        select 1 from team_members
        where team_id = (storage.foldername(name))[1]::uuid
          and user_id = auth.uid()
    )
);
