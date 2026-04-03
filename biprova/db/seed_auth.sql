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
    raw_app_meta_data, raw_user_meta_data, aud, role
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
    );
