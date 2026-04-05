-- ============================================================
-- SUPABASE STORAGE BUCKETS & POLICIES
-- Çalıştır: Supabase Dashboard → SQL Editor
-- ============================================================

-- BUCKETS (public = URL'ler herkese açık, auth gerekmez okuma için)
insert into storage.buckets (id, name, public)
values
    ('avatars',      'avatars',      true),
    ('covers',       'covers',       true),
    ('news-images',  'news-images',  true),
    ('post-images',  'post-images',  true)
on conflict (id) do nothing;

-- ============================================================
-- AVATAR POLICIES
-- Path: avatars/{user_id}/{filename}
-- ============================================================
create policy "avatars_public_read"
on storage.objects for select
using ( bucket_id = 'avatars' );

create policy "avatars_owner_upload"
on storage.objects for insert
with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "avatars_owner_update"
on storage.objects for update
using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "avatars_owner_delete"
on storage.objects for delete
using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================
-- COVER (kullanıcı kapak) POLICIES
-- Path: covers/{user_id}/{filename}
-- ============================================================
create policy "covers_public_read"
on storage.objects for select
using ( bucket_id = 'covers' );

create policy "covers_owner_upload"
on storage.objects for insert
with check (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "covers_owner_update"
on storage.objects for update
using (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "covers_owner_delete"
on storage.objects for delete
using (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================
-- NEWS IMAGE POLICIES (sadece admin yükler)
-- Path: news-images/{news_id}/{filename}
-- ============================================================
create policy "news_images_public_read"
on storage.objects for select
using ( bucket_id = 'news-images' );

create policy "news_images_admin_manage"
on storage.objects for all
using (
    bucket_id = 'news-images'
    and exists (select 1 from users where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- POST IMAGE POLICIES (team member yükler)
-- Path: post-images/{team_id}/{post_id}/{filename}
-- ============================================================
create policy "post_images_public_read"
on storage.objects for select
using ( bucket_id = 'post-images' );

create policy "post_images_member_upload"
on storage.objects for insert
with check (
    bucket_id = 'post-images'
    and exists (
        select 1 from team_members
        where team_id = (storage.foldername(name))[1]::uuid
          and user_id = auth.uid()
    )
);

create policy "post_images_member_delete"
on storage.objects for delete
using (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[2]
);
