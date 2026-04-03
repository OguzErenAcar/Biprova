-- ============================================================
-- SEED: auth.users — Demo kullanıcıları (Supabase Auth)
-- ============================================================
-- seed.sql çalıştırıldıktan SONRA çalıştırılmalı.
-- Tüm kullanıcıların şifresi: test1234
-- UUID'ler seed.sql ile eşleşiyor.
-- ============================================================

insert into auth.users (
    id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, aud, role,
    instance_id,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, phone_change, phone_change_token, reauthentication_token
)
values
    (
        'a0000000-0000-0000-0000-000000000001',
        'ahmet.yilmaz@example.com',
        crypt('test1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Ahmet Yılmaz"}',
        'authenticated', 'authenticated'
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'ayse.kaya@example.com',
        crypt('test1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Ayşe Kaya"}',
        'authenticated', 'authenticated'
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'mehmet.demir@example.com',
        crypt('test1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Mehmet Demir"}',
        'authenticated', 'authenticated'
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'zeynep.celik@example.com',
        crypt('test1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Zeynep Çelik"}',
        'authenticated', 'authenticated'
    ),
    (
        'a0000000-0000-0000-0000-000000000005',
        'can.ozturk@example.com',
        crypt('test1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Can Öztürk"}',
        'authenticated', 'authenticated'
    ),
    (
        'a0000000-0000-0000-0000-000000000006',
        'selin.arslan@example.com',
        crypt('test1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Selin Arslan"}',
        'authenticated', 'authenticated'
    ),
    (
        'a0000000-0000-0000-0000-000000000007',
        'burak.sahin@example.com',
        crypt('test1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Burak Şahin"}',
        'authenticated', 'authenticated'
    ),
    (
        'a0000000-0000-0000-0000-000000000008',
        'nur.yildiz@example.com',
        crypt('test1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Nur Yıldız"}',
        'authenticated', 'authenticated'
    )
on conflict (id) do nothing;

insert into auth.identities (
    id, user_id, provider, provider_id, identity_data, created_at, updated_at, last_sign_in_at
) values
    ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'email', 'ahmet.yilmaz@example.com',  '{"sub":"a0000000-0000-0000-0000-000000000001","email":"ahmet.yilmaz@example.com"}', now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'email', 'ayse.kaya@example.com',     '{"sub":"a0000000-0000-0000-0000-000000000002","email":"ayse.kaya@example.com"}',     now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'email', 'mehmet.demir@example.com',  '{"sub":"a0000000-0000-0000-0000-000000000003","email":"mehmet.demir@example.com"}',  now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'email', 'zeynep.celik@example.com',  '{"sub":"a0000000-0000-0000-0000-000000000004","email":"zeynep.celik@example.com"}',  now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'email', 'can.ozturk@example.com',    '{"sub":"a0000000-0000-0000-0000-000000000005","email":"can.ozturk@example.com"}',    now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'email', 'selin.arslan@example.com',  '{"sub":"a0000000-0000-0000-0000-000000000006","email":"selin.arslan@example.com"}',  now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'email', 'burak.sahin@example.com',   '{"sub":"a0000000-0000-0000-0000-000000000007","email":"burak.sahin@example.com"}',   now(), now(), now()),
    ('a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'email', 'nur.yildiz@example.com',    '{"sub":"a0000000-0000-0000-0000-000000000008","email":"nur.yildiz@example.com"}',    now(), now(), now())
on conflict (id) do nothing;
