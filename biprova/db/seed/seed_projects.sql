-- ============================================================
-- SEED: seed_projects.sql
-- Çalıştırma sırası: seed_auth.sql → seed_projects.sql
-- Strateji: triggerlarla birlikte çalışır (disable etmez)
--   - Proje insert → trg_pm_project_created → lider project_members'a eklenir
--   - Application accepted → trg_pm_application_accepted → üye project_members'a eklenir
--   - project_roles is_filled=true → trg_check_project_full → dolu projede status='full'
--   - status='full' → trg_create_team_on_project_full → ekip + team_members otomatik kurulur
-- ============================================================


-- ============================================================
-- 1. LOOKUP TABLOLARI
-- Önceki yarım kalan seed verilerini temizle (projects zaten boş olmalı)
-- ============================================================

delete from user_skills;
delete from project_role_skills;
delete from skills;
delete from project_categories;
delete from cities;

insert into project_categories (id, name, slug) values
    ('c0000000-0000-0000-0000-000000000001', 'Teknoloji',  'teknoloji'),
    ('c0000000-0000-0000-0000-000000000002', 'Sağlık',     'saglik'),
    ('c0000000-0000-0000-0000-000000000003', 'Eğitim',     'egitim'),
    ('c0000000-0000-0000-0000-000000000004', 'Fintech',    'fintech'),
    ('c0000000-0000-0000-0000-000000000005', 'E-Ticaret',  'e-ticaret'),
    ('c0000000-0000-0000-0000-000000000006', 'Topluluk',   'topluluk'),
    ('c0000000-0000-0000-0000-000000000007', 'Tarım',      'tarim')
on conflict do nothing;

insert into skills (id, name, slug) values
    ('b0000000-0000-0000-0000-000000000001', 'Backend Geliştirme',    'backend-gelistirme'),
    ('b0000000-0000-0000-0000-000000000002', 'Frontend Geliştirme',   'frontend-gelistirme'),
    ('b0000000-0000-0000-0000-000000000003', 'Mobil Geliştirme',      'mobil-gelistirme'),
    ('b0000000-0000-0000-0000-000000000004', 'UI/UX Tasarım',         'ui-ux-tasarim'),
    ('b0000000-0000-0000-0000-000000000005', 'Veri Bilimi',           'veri-bilimi'),
    ('b0000000-0000-0000-0000-000000000006', 'Blockchain',            'blockchain'),
    ('b0000000-0000-0000-0000-000000000007', 'Pazarlama',             'pazarlama'),
    ('b0000000-0000-0000-0000-000000000008', 'İçerik Yazarlığı',      'icerik-yazarligi'),
    ('b0000000-0000-0000-0000-000000000009', 'Full Stack Geliştirme', 'full-stack-gelistirme'),
    ('b0000000-0000-0000-0000-000000000010', 'Yapay Zeka / ML',       'yapay-zeka-ml')
on conflict do nothing;

insert into cities (id, name, slug) values
    ('cc000000-0000-0000-0000-000000000001', 'İstanbul',  'istanbul'),
    ('cc000000-0000-0000-0000-000000000002', 'Ankara',    'ankara'),
    ('cc000000-0000-0000-0000-000000000003', 'İzmir',     'izmir'),
    ('cc000000-0000-0000-0000-000000000004', 'Bursa',     'bursa'),
    ('cc000000-0000-0000-0000-000000000005', 'Antalya',   'antalya'),
    ('cc000000-0000-0000-0000-000000000006', 'Konya',     'konya'),
    ('cc000000-0000-0000-0000-000000000007', 'Gaziantep', 'gaziantep'),
    ('cc000000-0000-0000-0000-000000000008', 'Kayseri',   'kayseri')
on conflict do nothing;


-- ============================================================
-- 2. KULLANICI PROFİLLERİ
-- Kayıtlar auth seed'den trg_auth_user_created ile oluştu,
-- burada sadece profil bilgileri güncelleniyor.
-- ============================================================

update public.users set
    bio          = 'Yazılım mühendisi ve açık kaynak meraklısı. Tarım teknolojilerine ilgi duyuyorum.',
    city         = 'İstanbul',
    linkedin_url = 'https://linkedin.com/in/ahmetyilmaz'
where id = 'a0000000-0000-0000-0000-000000000001';

update public.users set
    bio          = 'Moda sektöründe dijital dönüşümü hedefliyorum. E-ticaret ve UX tutkunu.',
    city         = 'İstanbul',
    linkedin_url = 'https://linkedin.com/in/aysekaya'
where id = 'a0000000-0000-0000-0000-000000000002';

update public.users set
    bio          = 'Fintech ve blockchain alanında çalışıyorum. DeFi protokolleri geliştiriyorum.',
    city         = 'Ankara',
    linkedin_url = 'https://linkedin.com/in/mehmetdemir'
where id = 'a0000000-0000-0000-0000-000000000003';

update public.users set
    bio          = 'Eğitimde teknolojiyi yaygınlaştırmak istiyorum. EdTech girişimcisi.',
    city         = 'Ankara',
    linkedin_url = 'https://linkedin.com/in/zeynepcelik'
where id = 'a0000000-0000-0000-0000-000000000004';

update public.users set
    bio          = 'Sağlık teknolojileri ve mobil uygulama geliştirme üzerine çalışıyorum.',
    city         = 'İzmir',
    linkedin_url = 'https://linkedin.com/in/canozturk'
where id = 'a0000000-0000-0000-0000-000000000005';

update public.users set
    bio          = 'Full stack developer. Yerel üreticilere dijital çözümler üretmek istiyorum.',
    city         = 'İstanbul',
    linkedin_url = 'https://linkedin.com/in/selinarslan'
where id = 'a0000000-0000-0000-0000-000000000006';

update public.users set
    bio          = 'Spor ve teknoloji tutkunu. AI destekli fitness uygulamaları geliştiriyorum.',
    city         = 'İstanbul',
    linkedin_url = 'https://linkedin.com/in/buraksahin'
where id = 'a0000000-0000-0000-0000-000000000007';

update public.users set
    bio          = 'Kadın girişimciliğini desteklemeye adanmış içerik üreticisi ve topluluk kurucusu.',
    city         = 'Ankara',
    linkedin_url = 'https://linkedin.com/in/nuryildiz',
    badge        = 'top100'
where id = 'a0000000-0000-0000-0000-000000000008';


-- ============================================================
-- 3. KULLANICI BECERİLERİ
-- ============================================================

insert into user_skills (user_id, skill_id) values
    -- Ahmet: Backend, Mobil
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003'),
    -- Ayşe: Frontend, Mobil
    ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002'),
    ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003'),
    -- Mehmet: Backend, Blockchain
    ('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001'),
    ('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000006'),
    -- Zeynep: Frontend, İçerik
    ('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002'),
    ('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000008'),
    -- Can: Mobil, Veri Bilimi
    ('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003'),
    ('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005'),
    -- Selin: Full Stack, Pazarlama
    ('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009'),
    ('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000007'),
    -- Burak: Mobil, Yapay Zeka
    ('a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003'),
    ('a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000010'),
    -- Nur: İçerik, Pazarlama
    ('a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008'),
    ('a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000007')
on conflict do nothing;


-- ============================================================
-- 4. PROJELER
-- Trigger: trg_pm_project_created → lider project_members'a eklenir
--
-- Durum özeti:
--   d01 Ahmet   → Tarım Takip         — boş   (0/2 rol)
--   d02 Ayşe    → Moda E-Ticaret       — kısmı (1/3 rol)
--   d03 Mehmet  → Kripto Portföy       — kısmı (1/2 rol)
--   d04 Zeynep  → Online Eğitim        — DOLU  (2/2 rol) → ekip kurulacak
--   d05 Can     → Sağlık Takip         — boş   (0/3 rol)
--   d06 Selin   → Yerel Üretici        — DOLU  (2/2 rol) → ekip kurulacak
--   d07 Burak   → Spor Antrenman       — kısmı (1/2 rol)
--   d08 Nur     → Kadın Girişimcilik   — boş   (0/3 rol)
-- ============================================================

insert into projects (id, leader_id, title, description, city, is_remote, category_id, status) values
    (
        'd0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Tarım Takip Uygulaması',
        'Çiftçilerin ekim, sulama ve hasat süreçlerini dijital ortamda takip etmesini sağlayan mobil uygulama. Sensör entegrasyonu ve hava durumu verisiyle destekleniyor.',
        'İstanbul', false,
        'c0000000-0000-0000-0000-000000000007',
        'open'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000002',
        'Moda E-Ticaret Platformu',
        'Türk tasarımcıların ürünlerini doğrudan tüketiciye ulaştırdığı özel moda platformu. Yerli markaları ön plana çıkarmayı hedefliyoruz.',
        'İstanbul', false,
        'c0000000-0000-0000-0000-000000000005',
        'open'
    ),
    (
        'd0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000003',
        'Kripto Portföy Yöneticisi',
        'Birden fazla borsa ve cüzdandaki kripto varlıkları tek ekranda gösteren analiz aracı. Gerçek zamanlı fiyat alarmları ve vergi raporu üretiyor.',
        null, true,
        'c0000000-0000-0000-0000-000000000004',
        'open'
    ),
    (
        'd0000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000004',
        'Online Eğitim Platformu',
        'K-12 öğrencileri için interaktif ders içerikleri ve canlı soru-cevap oturumları sunan platform. Gamification ile öğrencileri motive ediyoruz.',
        'Ankara', false,
        'c0000000-0000-0000-0000-000000000003',
        'open'
    ),
    (
        'd0000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000005',
        'Sağlık Takip Uygulaması',
        'Kronik hastalığı olan bireylerin ilaç, egzersiz ve beslenme rutinlerini takip ettiği mobil uygulama. Doktor ile paylaşılabilir raporlar üretiyor.',
        'İzmir', false,
        'c0000000-0000-0000-0000-000000000002',
        'open'
    ),
    (
        'd0000000-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000006',
        'Yerel Üretici Pazarı',
        'Köylerde üretilen organik ürünlerin şehirli tüketiciye direkt ulaştığı iki taraflı pazar platformu. Lojistik koordinasyonu ve fiyat şeffaflığı odaklı.',
        null, true,
        'c0000000-0000-0000-0000-000000000001',
        'open'
    ),
    (
        'd0000000-0000-0000-0000-000000000007',
        'a0000000-0000-0000-0000-000000000007',
        'Spor Antrenman Asistanı',
        'AI destekli kişisel antrenman planları oluşturan ve performansı gerçek zamanlı analiz eden mobil uygulama. Wearable cihazlarla entegre çalışıyor.',
        'İstanbul', false,
        'c0000000-0000-0000-0000-000000000002',
        'open'
    ),
    (
        'd0000000-0000-0000-0000-000000000008',
        'a0000000-0000-0000-0000-000000000008',
        'Kadın Girişimcilik Platformu',
        'Kadın girişimcilerin iş fikirlerini paylaştığı, mentor bulduğu ve yatırımcıyla buluştuğu topluluk platformu. Mentorluk eşleştirme algoritması geliştiriyoruz.',
        null, true,
        'c0000000-0000-0000-0000-000000000006',
        'open'
    )
on conflict do nothing;


-- ============================================================
-- 5. PROJE ROLLERİ (hepsi başlangıçta is_filled=false)
-- is_filled daha sonra UPDATE ile true yapılacak → trigger tetiklenecek
-- ============================================================

insert into project_roles (id, project_id, role_name, is_filled, filled_by) values
    -- d01 Ahmet - Tarım (2 rol, boş)
    ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Backend Geliştirici', false, null),
    ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Mobil Geliştirici',   false, null),

    -- d02 Ayşe - Moda (3 rol, 1 dolu)
    ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'Frontend Geliştirici', false, null),
    ('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000002', 'UI/UX Tasarımcı',      false, null),
    ('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'İçerik Yazarı',        false, null),

    -- d03 Mehmet - Kripto (2 rol, 1 dolu)
    ('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000003', 'Backend Geliştirici',   false, null),
    ('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000003', 'Blockchain Geliştirici', false, null),

    -- d04 Zeynep - Eğitim (2 rol, DOLU → ekip kurulacak)
    ('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000004', 'Frontend Geliştirici', false, null),
    ('e0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000004', 'Backend Geliştirici',  false, null),

    -- d05 Can - Sağlık (3 rol, boş)
    ('e0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000005', 'Mobil Geliştirici', false, null),
    ('e0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000005', 'Veri Bilimci',      false, null),
    ('e0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000005', 'UX Tasarımcı',      false, null),

    -- d06 Selin - Üretici (2 rol, DOLU → ekip kurulacak)
    ('e0000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000006', 'Full Stack Geliştirici', false, null),
    ('e0000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000006', 'Pazarlama Uzmanı',      false, null),

    -- d07 Burak - Spor (2 rol, 1 dolu)
    ('e0000000-0000-0000-0000-000000000015', 'd0000000-0000-0000-0000-000000000007', 'Mobil Geliştirici', false, null),
    ('e0000000-0000-0000-0000-000000000016', 'd0000000-0000-0000-0000-000000000007', 'AI/ML Geliştirici', false, null),

    -- d08 Nur - Kadın Girişimcilik (3 rol, boş)
    ('e0000000-0000-0000-0000-000000000017', 'd0000000-0000-0000-0000-000000000008', 'Frontend Geliştirici',  false, null),
    ('e0000000-0000-0000-0000-000000000018', 'd0000000-0000-0000-0000-000000000008', 'İçerik Stratejisti',    false, null),
    ('e0000000-0000-0000-0000-000000000019', 'd0000000-0000-0000-0000-000000000008', 'Sosyal Medya Uzmanı',   false, null)
on conflict do nothing;


-- ============================================================
-- 6. BAŞVURULAR (başlangıçta hepsi pending)
-- ============================================================

insert into applications (id, project_id, user_id, role_id, note, status) values
    -- d04 Zeynep - Eğitim (dolu olacak)
    ('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000008', 'React ve Next.js ile 3 yıldır çalışıyorum, eğitim sektörüne ilgim var.', 'pending'),
    ('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000009', 'Node.js ve PostgreSQL konusunda deneyimliyim, eğitim platformlarında çalıştım.', 'pending'),

    -- d06 Selin - Üretici (dolu olacak)
    ('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000013', 'Full stack projeler yürüttüm, marketplace mimarisine hakimim.', 'pending'),
    ('f0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000014', 'Dijital pazarlama ve topluluk yönetimi konusunda deneyimliyim.', 'pending'),

    -- d02 Ayşe - Moda (kısmı dolacak: e03 dolu, e04 pending)
    ('f0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000003', 'React ile 4 yıllık deneyimim var, e-ticaret arayüzleri geliştirdim.', 'pending'),
    ('f0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Figma ve kullanıcı araştırması konusunda çalışıyorum.', 'pending'),

    -- d03 Mehmet - Kripto (kısmı dolacak: e06 dolu, e07 pending)
    ('f0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000006', 'Backend ve REST API tasarımında 5 yıl deneyimim var.', 'pending'),
    ('f0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000007', 'Ethereum akıllı sözleşmeleri ve Solidity ile çalışıyorum.', 'pending'),

    -- d07 Burak - Spor (kısmı dolacak: e15 dolu, e16 pending)
    ('f0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000015', 'Flutter ile 10+ uygulama geliştirdim, spor uygulamalarına ilgim var.', 'pending'),
    ('f0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000016', 'TensorFlow ile hareket analizi modelleri geliştirdim.', 'pending')
on conflict do nothing;


-- ============================================================
-- 7. BAŞVURULARI KABUL ET
-- Trigger: trg_pm_application_accepted → üye project_members'a eklenir
-- Trigger: trg_reject_other_applications_on_accepted → aynı kullanıcının
--          aynı projedeki diğer pending başvuruları reddedilir
-- ============================================================

update applications set status = 'accepted'
where id in (
    'f0000000-0000-0000-0000-000000000001', -- Can     → d04 frontend
    'f0000000-0000-0000-0000-000000000002', -- Ahmet   → d04 backend
    'f0000000-0000-0000-0000-000000000003', -- Mehmet  → d06 full stack
    'f0000000-0000-0000-0000-000000000004', -- Nur     → d06 pazarlama
    'f0000000-0000-0000-0000-000000000005', -- Burak   → d02 frontend
    'f0000000-0000-0000-0000-000000000007', -- Selin   → d03 backend
    'f0000000-0000-0000-0000-000000000009'  -- Ayşe   → d07 mobil
);


-- ============================================================
-- 8. ROLLERİ DOLDUR
-- Trigger: trg_check_project_full → tüm roller dolunca status='full'
-- Trigger: trg_create_team_on_project_full → ekip + team_members kurulur
-- ============================================================

-- d04 Zeynep - Online Eğitim (2/2 dolu → ekip kurulacak)
update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000005'
where id = 'e0000000-0000-0000-0000-000000000008'; -- Can → frontend

update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000001'
where id = 'e0000000-0000-0000-0000-000000000009'; -- Ahmet → backend (bu update'ten sonra ekip kurulur)

-- d06 Selin - Yerel Üretici (2/2 dolu → ekip kurulacak)
update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000003'
where id = 'e0000000-0000-0000-0000-000000000013'; -- Mehmet → full stack

update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000008'
where id = 'e0000000-0000-0000-0000-000000000014'; -- Nur → pazarlama (bu update'ten sonra ekip kurulur)

-- d02 Ayşe - Moda (1/3 dolu, kısmı)
update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000007'
where id = 'e0000000-0000-0000-0000-000000000003'; -- Burak → frontend

-- d03 Mehmet - Kripto (1/2 dolu, kısmı)
update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000006'
where id = 'e0000000-0000-0000-0000-000000000006'; -- Selin → backend

-- d07 Burak - Spor (1/2 dolu, kısmı)
update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000002'
where id = 'e0000000-0000-0000-0000-000000000015'; -- Ayşe → mobil


-- ============================================================
-- 9. EKİP DEADLINE'LARINI GÜNCELLE
-- Trigger now() + 24h koyar; demo için 7 güne çektik.
-- ============================================================

update teams set deadline = now() + interval '7 days'
where project_id in (
    'd0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000006'
);
