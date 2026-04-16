-- ============================================================
-- SEED DATA — Biprova Demo
-- Çalıştır: seed_auth.sql'den SONRA
-- ============================================================
--
-- 8 kullanıcı (seed_auth.sql ile eşleşir)
-- 4 proje  → 2 aktif (ekip kuruldu), 2 açık (başvuru aşamasında)
-- 2 ekip   → mesajlar, postlar, beğeniler
-- 4 haber  (2 yayında, 2 taslak)
-- Bildirimler, waitlist, rozetler dahil
-- ============================================================

begin;

-- ============================================================
-- 1. LOOKUP — skills
-- ============================================================

insert into skills (id, name, slug) values
    ('d000-0000-0000-0000-000000000001', 'Frontend Geliştirici',       'frontend-gelistirici'),
    ('d000-0000-0000-0000-000000000002', 'Backend Geliştirici',        'backend-gelistirici'),
    ('d000-0000-0000-0000-000000000003', 'Mobil Geliştirici (iOS)',     'mobil-ios'),
    ('d000-0000-0000-0000-000000000004', 'Mobil Geliştirici (Android)', 'mobil-android'),
    ('d000-0000-0000-0000-000000000005', 'UI/UX Tasarımcı',            'ui-ux'),
    ('d000-0000-0000-0000-000000000006', 'Veri Bilimcisi',             'veri-bilimcisi'),
    ('d000-0000-0000-0000-000000000007', 'DevOps Mühendisi',           'devops'),
    ('d000-0000-0000-0000-000000000008', 'Proje Yöneticisi',           'proje-yoneticisi'),
    ('d000-0000-0000-0000-000000000009', 'Pazarlama Uzmanı',           'pazarlama'),
    ('d000-0000-0000-0000-000000000010', 'İçerik Üreticisi',           'icerik-uretici'),
    ('d000-0000-0000-0000-000000000011', 'Grafik Tasarımcı',           'grafik-tasarimci'),
    ('d000-0000-0000-0000-000000000012', 'Full Stack Geliştirici',     'full-stack'),
    ('d000-0000-0000-0000-000000000013', 'Yapay Zeka Mühendisi',       'ai-muhendis'),
    ('d000-0000-0000-0000-000000000014', 'Blockchain Geliştirici',     'blockchain'),
    ('d000-0000-0000-0000-000000000015', 'Siber Güvenlik Uzmanı',      'siber-guvenlik')
on conflict (id) do nothing;

-- ============================================================
-- 2. LOOKUP — project_categories
-- ============================================================

insert into project_categories (id, name, slug) values
    ('e000-0000-0000-0000-000000000001', 'Teknoloji',              'teknoloji'),
    ('e000-0000-0000-0000-000000000002', 'E-ticaret',              'e-ticaret'),
    ('e000-0000-0000-0000-000000000003', 'Sağlık',                 'saglik'),
    ('e000-0000-0000-0000-000000000004', 'Eğitim',                 'egitim'),
    ('e000-0000-0000-0000-000000000005', 'Fintek',                 'fintek'),
    ('e000-0000-0000-0000-000000000006', 'Oyun',                   'oyun'),
    ('e000-0000-0000-0000-000000000007', 'Yapay Zeka',             'yapay-zeka'),
    ('e000-0000-0000-0000-000000000008', 'Çevre & Sürdürülebilir', 'cevre')
on conflict (id) do nothing;

-- ============================================================
-- 3. LOOKUP — cities
-- ============================================================

insert into cities (id, name, slug) values
    ('f000-0000-0000-0000-000000000001', 'İstanbul', 'istanbul'),
    ('f000-0000-0000-0000-000000000002', 'Ankara',   'ankara'),
    ('f000-0000-0000-0000-000000000003', 'İzmir',    'izmir'),
    ('f000-0000-0000-0000-000000000004', 'Bursa',    'bursa'),
    ('f000-0000-0000-0000-000000000005', 'Antalya',  'antalya')
on conflict (id) do nothing;

-- ============================================================
-- 4. LOOKUP — badges
-- ============================================================

insert into badges (id, badge_name, image_url) values
    ('ba00-0000-0000-0000-000000000001', 'early-adopter', '/badges/early-adopter.png'),
    ('ba00-0000-0000-0000-000000000002', 'team-builder',  '/badges/team-builder.png'),
    ('ba00-0000-0000-0000-000000000003', 'innovator',     '/badges/innovator.png'),
    ('ba00-0000-0000-0000-000000000004', 'connector',     '/badges/connector.png')
on conflict (id) do nothing;

-- ============================================================
-- 5. USERS — public.users (auth.users ile UUID eşleşiyor)
-- ============================================================
-- Not: trg_auth_user_created zaten temel kaydı oluşturdu;
--      bu satırlar profil alanlarını günceller.

insert into users (
    id, email, name, bio, city,
    location, linkedin_url, badge, role, plan
) values
    (
        'a0000000-0000-0000-0000-000000000001',
        'ahmet.yilmaz@example.com', 'Ahmet Yılmaz',
        'İstanbul''da yaşayan full-stack geliştirici. 5 yıldır startup ekosisteminde yer alıyorum.',
        'İstanbul',
        ST_Point(28.9784, 41.0082)::geography,
        'https://linkedin.com/in/ahmetyilmaz',
        'early-adopter', 'admin', 'paid'
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'ayse.kaya@example.com', 'Ayşe Kaya',
        'UI/UX tasarımcısı. Kullanıcı odaklı tasarım ve ürün düşüncesi konusunda tutkulu.',
        'İstanbul',
        ST_Point(28.9500, 41.0150)::geography,
        'https://linkedin.com/in/aysekaya',
        'team-builder', 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'mehmet.demir@example.com', 'Mehmet Demir',
        'React ve TypeScript uzmanı. Performanslı arayüzler geliştirmekten keyif alıyorum.',
        'İstanbul',
        ST_Point(29.0100, 41.0200)::geography,
        'https://linkedin.com/in/mehmetdemir',
        'connector', 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'zeynep.celik@example.com', 'Zeynep Çelik',
        'iOS ve Android uygulama geliştirici. Sağlık teknolojileri alanında 3 yıl deneyimim var.',
        'İzmir',
        ST_Point(27.1287, 38.4192)::geography,
        'https://linkedin.com/in/zeynepcelik',
        null, 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000005',
        'can.ozturk@example.com', 'Can Öztürk',
        'Veri bilimcisi ve girişimci. Fintech ve yapay zeka kesişiminde ürünler üretiyorum.',
        'Ankara',
        ST_Point(32.8597, 39.9334)::geography,
        'https://linkedin.com/in/canozturk',
        'innovator', 'user', 'paid'
    ),
    (
        'a0000000-0000-0000-0000-000000000006',
        'selin.arslan@example.com', 'Selin Arslan',
        'Eğitim teknolojileri alanında proje yöneticisi. EdTech startup''larına mentorluk yapıyorum.',
        'Ankara',
        ST_Point(32.8800, 39.9200)::geography,
        'https://linkedin.com/in/selinarslan',
        null, 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000007',
        'burak.sahin@example.com', 'Burak Şahin',
        'DevOps mühendisi. Cloud infrastructure, Kubernetes ve CI/CD pipeline konularında uzmanım.',
        'İstanbul',
        ST_Point(28.9600, 41.0300)::geography,
        'https://linkedin.com/in/buraksahin',
        null, 'user', 'free'
    ),
    (
        'a0000000-0000-0000-0000-000000000008',
        'nur.yildiz@example.com', 'Nur Yıldız',
        'İçerik üreticisi ve dijital pazarlama uzmanı. Marka hikayeleri anlatmayı seviyorum.',
        'Bursa',
        ST_Point(29.0600, 40.1830)::geography,
        'https://linkedin.com/in/nuryildiz',
        null, 'user', 'free'
    )
on conflict (id) do update set
    bio          = excluded.bio,
    city         = excluded.city,
    location     = excluded.location,
    linkedin_url = excluded.linkedin_url,
    badge        = excluded.badge,
    role         = excluded.role,
    plan         = excluded.plan;

-- ============================================================
-- 6. USER SKILLS
-- ============================================================

insert into user_skills (user_id, skill_id) values
    -- Ahmet: Backend + Full Stack
    ('a0000000-0000-0000-0000-000000000001', 'd000-0000-0000-0000-000000000002'),
    ('a0000000-0000-0000-0000-000000000001', 'd000-0000-0000-0000-000000000012'),
    -- Ayşe: UI/UX + Grafik
    ('a0000000-0000-0000-0000-000000000002', 'd000-0000-0000-0000-000000000005'),
    ('a0000000-0000-0000-0000-000000000002', 'd000-0000-0000-0000-000000000011'),
    -- Mehmet: Frontend
    ('a0000000-0000-0000-0000-000000000003', 'd000-0000-0000-0000-000000000001'),
    ('a0000000-0000-0000-0000-000000000003', 'd000-0000-0000-0000-000000000012'),
    -- Zeynep: iOS + Android
    ('a0000000-0000-0000-0000-000000000004', 'd000-0000-0000-0000-000000000003'),
    ('a0000000-0000-0000-0000-000000000004', 'd000-0000-0000-0000-000000000004'),
    -- Can: Veri Bilimi + AI
    ('a0000000-0000-0000-0000-000000000005', 'd000-0000-0000-0000-000000000006'),
    ('a0000000-0000-0000-0000-000000000005', 'd000-0000-0000-0000-000000000013'),
    -- Selin: Proje Yönetimi + Pazarlama
    ('a0000000-0000-0000-0000-000000000006', 'd000-0000-0000-0000-000000000008'),
    ('a0000000-0000-0000-0000-000000000006', 'd000-0000-0000-0000-000000000009'),
    -- Burak: DevOps + Siber Güvenlik
    ('a0000000-0000-0000-0000-000000000007', 'd000-0000-0000-0000-000000000007'),
    ('a0000000-0000-0000-0000-000000000007', 'd000-0000-0000-0000-000000000015'),
    -- Nur: İçerik + Pazarlama
    ('a0000000-0000-0000-0000-000000000008', 'd000-0000-0000-0000-000000000010'),
    ('a0000000-0000-0000-0000-000000000008', 'd000-0000-0000-0000-000000000009')
on conflict do nothing;

-- ============================================================
-- 7. PROJECTS
-- Not: trg_pm_project_created her projeye lideri otomatik ekler.
-- Aktif projeler 'active' statüsünde ekleniyor (full → team
-- triggerını tetiklememek için).
-- ============================================================

insert into projects (
    id, leader_id, title, description,
    city, location, is_remote, category_id, status, created_at
) values
    -- P1: Yerel Üretici Platformu — ekip kuruldu, aktif
    (
        'b100-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Yerel Üretici Platformu',
        'Türkiye''deki küçük üreticileri son tüketiciyle buluşturan bir e-ticaret platformu. '
        'Çiftçiler, el sanatçıları ve küçük esnaf için dijital vitrin.',
        'İstanbul',
        ST_Point(28.9784, 41.0082)::geography,
        false,
        'e000-0000-0000-0000-000000000002',
        'active',
        now() - interval '45 days'
    ),
    -- P2: FinFlow — ekip kuruldu, aktif
    (
        'b100-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000005',
        'FinFlow — Akıllı Bütçe Yönetimi',
        'Gelir ve gider takibini otomatikleştiren, harcama alışkanlıklarını analiz eden '
        'kişisel finans asistanı. AI destekli tavsiye motoru ile birlikte.',
        'Ankara',
        ST_Point(32.8597, 39.9334)::geography,
        true,
        'e000-0000-0000-0000-000000000005',
        'active',
        now() - interval '30 days'
    ),
    -- P3: FitTrack — açık, başvuru alınıyor
    (
        'b100-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000004',
        'FitTrack — Kişisel Sağlık Takip Uygulaması',
        'Günlük hareket, uyku ve beslenme verilerini tek platformda birleştiren mobil uygulama. '
        'Wearable cihazlarla entegrasyon ve doktor paylaşım özelliği planlanıyor.',
        'İzmir',
        ST_Point(27.1287, 38.4192)::geography,
        false,
        'e000-0000-0000-0000-000000000003',
        'open',
        now() - interval '10 days'
    ),
    -- P4: EduMentor — açık, başvuru alınıyor
    (
        'b100-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000006',
        'EduMentor — Öğrenciden Uzmana Mentorluk',
        'Üniversite öğrencilerini sektör profesyonelleriyle eşleştiren mentorluk platformu. '
        'Kariyer rehberliği, proje değerlendirme ve networking.',
        'Ankara',
        ST_Point(32.8800, 39.9200)::geography,
        true,
        'e000-0000-0000-0000-000000000004',
        'open',
        now() - interval '5 days'
    )
on conflict (id) do nothing;

-- ============================================================
-- 8. PROJECT ROLES
-- ============================================================

insert into project_roles (id, project_id, role_name, is_filled, filled_by) values
    -- P1 rolleri (dolu)
    ('r000-0000-0000-0000-000000000001', 'b100-0000-0000-0000-000000000001', 'Frontend Geliştirici', true,  'a0000000-0000-0000-0000-000000000003'),
    ('r000-0000-0000-0000-000000000002', 'b100-0000-0000-0000-000000000001', 'UI/UX Tasarımcı',      true,  'a0000000-0000-0000-0000-000000000002'),
    -- P2 rolleri (dolu)
    ('r000-0000-0000-0000-000000000003', 'b100-0000-0000-0000-000000000002', 'Frontend Geliştirici', true,  'a0000000-0000-0000-0000-000000000008'),
    ('r000-0000-0000-0000-000000000004', 'b100-0000-0000-0000-000000000002', 'DevOps Mühendisi',     true,  'a0000000-0000-0000-0000-000000000007'),
    -- P3 rolleri (boş)
    ('r000-0000-0000-0000-000000000005', 'b100-0000-0000-0000-000000000003', 'Mobil Geliştirici (iOS)',     false, null),
    ('r000-0000-0000-0000-000000000006', 'b100-0000-0000-0000-000000000003', 'Mobil Geliştirici (Android)', false, null),
    ('r000-0000-0000-0000-000000000007', 'b100-0000-0000-0000-000000000003', 'UI/UX Tasarımcı',            false, null),
    -- P4 rolleri (boş)
    ('r000-0000-0000-0000-000000000008', 'b100-0000-0000-0000-000000000004', 'Backend Geliştirici', false, null),
    ('r000-0000-0000-0000-000000000009', 'b100-0000-0000-0000-000000000004', 'Veri Bilimcisi',      false, null),
    ('r000-0000-0000-0000-000000000010', 'b100-0000-0000-0000-000000000004', 'Proje Yöneticisi',    false, null)
on conflict (id) do nothing;

-- ============================================================
-- 9. PROJECT ROLE SKILLS
-- ============================================================

insert into project_role_skills (role_id, skill_id) values
    -- P1-Frontend: Frontend + Full Stack
    ('r000-0000-0000-0000-000000000001', 'd000-0000-0000-0000-000000000001'),
    ('r000-0000-0000-0000-000000000001', 'd000-0000-0000-0000-000000000012'),
    -- P1-UI/UX: UI/UX + Grafik
    ('r000-0000-0000-0000-000000000002', 'd000-0000-0000-0000-000000000005'),
    ('r000-0000-0000-0000-000000000002', 'd000-0000-0000-0000-000000000011'),
    -- P2-Frontend: Frontend
    ('r000-0000-0000-0000-000000000003', 'd000-0000-0000-0000-000000000001'),
    -- P2-DevOps: DevOps
    ('r000-0000-0000-0000-000000000004', 'd000-0000-0000-0000-000000000007'),
    -- P3-iOS: iOS
    ('r000-0000-0000-0000-000000000005', 'd000-0000-0000-0000-000000000003'),
    -- P3-Android: Android
    ('r000-0000-0000-0000-000000000006', 'd000-0000-0000-0000-000000000004'),
    -- P3-UI/UX: UI/UX
    ('r000-0000-0000-0000-000000000007', 'd000-0000-0000-0000-000000000005'),
    -- P4-Backend: Backend
    ('r000-0000-0000-0000-000000000008', 'd000-0000-0000-0000-000000000002'),
    -- P4-Veri: Veri Bilimi + AI
    ('r000-0000-0000-0000-000000000009', 'd000-0000-0000-0000-000000000006'),
    ('r000-0000-0000-0000-000000000009', 'd000-0000-0000-0000-000000000013'),
    -- P4-PM: Proje Yönetimi
    ('r000-0000-0000-0000-000000000010', 'd000-0000-0000-0000-000000000008')
on conflict do nothing;

-- ============================================================
-- 10. APPLICATIONS
-- ============================================================

insert into applications (id, project_id, user_id, role_id, note, status, created_at) values
    -- P1: Kabul edilmiş başvurular (geçmiş)
    (
        'ap00-0000-0000-0000-000000000001',
        'b100-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000003',
        'r000-0000-0000-0000-000000000001',
        'React ve TypeScript ile 3 yıl deneyimim var, e-ticaret projelerinde çalıştım.',
        'accepted',
        now() - interval '40 days'
    ),
    (
        'ap00-0000-0000-0000-000000000002',
        'b100-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        'r000-0000-0000-0000-000000000002',
        'Figma ve kullanıcı araştırması konusunda güçlüyüm, marketplace UX''i ilgimi çekiyor.',
        'accepted',
        now() - interval '38 days'
    ),
    -- P1: Reddedilmiş başvuru
    (
        'ap00-0000-0000-0000-000000000003',
        'b100-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000008',
        'r000-0000-0000-0000-000000000001',
        'Full stack geliştirme yapabiliyorum, ekibinize katkı sunmak isterim.',
        'rejected',
        now() - interval '39 days'
    ),
    -- P2: Kabul edilmiş başvurular (geçmiş)
    (
        'ap00-0000-0000-0000-000000000004',
        'b100-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000008',
        'r000-0000-0000-0000-000000000003',
        'React ile fintech arayüzleri geliştirdim, dashboard ve grafik konularında deneyimliyim.',
        'accepted',
        now() - interval '25 days'
    ),
    (
        'ap00-0000-0000-0000-000000000005',
        'b100-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000007',
        'r000-0000-0000-0000-000000000004',
        'AWS ve GCP''de production ortamları yönettim. Fintech güvenlik gereksinimlerine hakimim.',
        'accepted',
        now() - interval '24 days'
    ),
    -- P3: Bekleyen başvurular
    (
        'ap00-0000-0000-0000-000000000006',
        'b100-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000002',
        'r000-0000-0000-0000-000000000007',
        'Sağlık uygulamaları için kullanıcı araştırması yaptım, mobil UX konusunda deneyimliyim.',
        'pending',
        now() - interval '7 days'
    ),
    (
        'ap00-0000-0000-0000-000000000007',
        'b100-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000003',
        'r000-0000-0000-0000-000000000005',
        'Swift ile 2 yıl iOS uygulama geliştirdim, HealthKit entegrasyonu tecrübem var.',
        'pending',
        now() - interval '5 days'
    ),
    -- P4: Bekleyen başvurular
    (
        'ap00-0000-0000-0000-000000000008',
        'b100-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000001',
        'r000-0000-0000-0000-000000000008',
        'Node.js ve PostgreSQL ile API''ler yazdım, eğitim platformu mimarisine katkı sunabilirim.',
        'pending',
        now() - interval '3 days'
    ),
    (
        'ap00-0000-0000-0000-000000000009',
        'b100-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000007',
        'r000-0000-0000-0000-000000000010',
        'Birden fazla startup projesini sıfırdan yönettim, EdTech alanına geçmek istiyorum.',
        'pending',
        now() - interval '2 days'
    )
on conflict (user_id, role_id) do nothing;

-- ============================================================
-- 11. PROJECT MEMBERS — lider zaten trigger tarafından eklendi;
--     kabul edilen üyeler buraya ekleniyor
-- ============================================================

insert into project_members (project_id, user_id, role, joined_at) values
    -- P1 üyeleri
    ('b100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'member', now() - interval '40 days'),
    ('b100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'member', now() - interval '38 days'),
    -- P2 üyeleri
    ('b100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008', 'member', now() - interval '25 days'),
    ('b100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007', 'member', now() - interval '24 days')
on conflict (project_id, user_id) do nothing;

-- ============================================================
-- 12. TEAMS
-- ============================================================

insert into teams (id, name, leader_id, status, project_id, formed_at, activated_at, deadline) values
    (
        'c100-0000-0000-0000-000000000001',
        'Yerel Üretici Platformu Ekibi',
        'a0000000-0000-0000-0000-000000000001',
        'active',
        'b100-0000-0000-0000-000000000001',
        now() - interval '35 days',
        now() - interval '34 days',
        null
    ),
    (
        'c100-0000-0000-0000-000000000002',
        'FinFlow Ekibi',
        'a0000000-0000-0000-0000-000000000005',
        'active',
        'b100-0000-0000-0000-000000000002',
        now() - interval '20 days',
        now() - interval '19 days',
        null
    )
on conflict (id) do nothing;

-- Projeleri ekiplerine bağla
update projects set team_id = 'c100-0000-0000-0000-000000000001'
where id = 'b100-0000-0000-0000-000000000001';

update projects set team_id = 'c100-0000-0000-0000-000000000002'
where id = 'b100-0000-0000-0000-000000000002';

-- ============================================================
-- 13. TEAM MEMBERS
-- ============================================================

insert into team_members (id, team_id, user_id, role_id, has_biprova, joined_at) values
    -- T1: Yerel Üretici
    ('tm00-0000-0000-0000-000000000001', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', null,                                  true,  now() - interval '35 days'),
    ('tm00-0000-0000-0000-000000000002', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'r000-0000-0000-0000-000000000001', false, now() - interval '35 days'),
    ('tm00-0000-0000-0000-000000000003', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'r000-0000-0000-0000-000000000002', false, now() - interval '35 days'),
    -- T2: FinFlow
    ('tm00-0000-0000-0000-000000000004', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', null,                                  true,  now() - interval '20 days'),
    ('tm00-0000-0000-0000-000000000005', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008', 'r000-0000-0000-0000-000000000003', false, now() - interval '20 days'),
    ('tm00-0000-0000-0000-000000000006', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007', 'r000-0000-0000-0000-000000000004', false, now() - interval '20 days')
on conflict (team_id, user_id) do nothing;

-- ============================================================
-- 14. MESSAGES
-- ============================================================

insert into messages (id, team_id, sender_id, content, created_at) values
    -- T1 sohbeti
    ('msg0-0000-0000-0000-000000000001', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Merhaba ekip! Resmi olarak başlıyoruz. Bu haftaki hedefimiz MVP''nin ana ekranını bitirmek.',
     now() - interval '33 days'),
    ('msg0-0000-0000-0000-000000000002', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003',
     'Harika! Ben ürün listeleme ve filtreleme bileşenlerine başlayacağım. Figma dosyası hazır mı?',
     now() - interval '33 days' + interval '2 hours'),
    ('msg0-0000-0000-0000-000000000003', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
     'Evet, Figma''ya ekledim. Ana sayfayı bitirdim, ürün detay sayfası yarın hazır olur.',
     now() - interval '33 days' + interval '3 hours'),
    ('msg0-0000-0000-0000-000000000004', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Süper. Backend''de kategori ve filtreleme API''lerini bugün açıyorum.',
     now() - interval '32 days'),
    ('msg0-0000-0000-0000-000000000005', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003',
     'Ürün listeleme bitti! PR açtım, review edebilir misin Ahmet?',
     now() - interval '28 days'),
    ('msg0-0000-0000-0000-000000000006', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'İnceledim, çok temiz kod. Merge ettim. Bu haftaki demo için hazırız.',
     now() - interval '27 days'),
    ('msg0-0000-0000-0000-000000000007', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
     'İlk kullanıcı testleri çok olumlu geçti! Birkaç küçük UX düzeltmesi var, bugün paylaşıyorum.',
     now() - interval '14 days'),
    ('msg0-0000-0000-0000-000000000008', 'c100-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003',
     'Harika haber! Ödeme entegrasyonunu da bitirdim, test ortamında çalışıyor.',
     now() - interval '13 days'),

    -- T2 sohbeti
    ('msg0-0000-0000-0000-000000000009', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005',
     'Ekibimiz tamamlandı! İlk sprint''i planlayalım. Nur, dashboard taslaklarına başlayabilir misin?',
     now() - interval '18 days'),
    ('msg0-0000-0000-0000-000000000010', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008',
     'Tabii! Hangi metrikleri önce göstermek istiyoruz? Aylık harcama, kategori dağılımı ve tasarruf hedefi öneriyorum.',
     now() - interval '18 days' + interval '1 hour'),
    ('msg0-0000-0000-0000-000000000011', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007',
     'CI/CD pipeline''ı kurdum. Her PR otomatik test ve deploy ediliyor. Repo''ya baktınız mı?',
     now() - interval '17 days'),
    ('msg0-0000-0000-0000-000000000012', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005',
     'Mükemmel Burak! Nur, senin önerilerin harika — bu 3 metrik ilk sürümde olacak.',
     now() - interval '17 days' + interval '2 hours'),
    ('msg0-0000-0000-0000-000000000013', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008',
     'Dashboard ilk versiyonu hazır! Grafikleri Recharts ile yaptım, çok pürüzsüz.',
     now() - interval '10 days'),
    ('msg0-0000-0000-0000-000000000014', 'c100-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005',
     'AI tavsiye modeli ilk testlerde %78 doğruluk aldı. Daha fazla veri ile %90''a çıkarabiliriz.',
     now() - interval '5 days')
on conflict (id) do nothing;

-- ============================================================
-- 15. TEAM POSTS
-- ============================================================

insert into team_posts (
    id, team_id, author_id, project_id,
    content, image_urls, like_count, created_at
) values
    (
        'tp00-0000-0000-0000-000000000001',
        'c100-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'b100-0000-0000-0000-000000000001',
        'Yerel Üretici Platformu olarak ilk beta kullanıcılarımızı aldık! '
        '3 hafta içinde 47 üretici kaydoldu ve ilk siparişler gelmeye başladı. '
        'Küçük adımlar, büyük değişimler. Ekibimizle gurur duyuyorum. 🌱',
        '{}',
        12,
        now() - interval '20 days'
    ),
    (
        'tp00-0000-0000-0000-000000000002',
        'c100-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        'b100-0000-0000-0000-000000000001',
        'Kullanıcı testlerinden çıkan en önemli bulgu: üreticiler fotoğraf yüklemeyi çok zor buluyordu. '
        'Sürükle-bırak arayüzüne geçtik, terk oranı %40 düştü. Tasarım gerçekten fark yaratıyor.',
        '{}',
        8,
        now() - interval '12 days'
    ),
    (
        'tp00-0000-0000-0000-000000000003',
        'c100-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000005',
        'b100-0000-0000-0000-000000000002',
        'FinFlow''un ilk kamuya açık demosu bu Cuma! '
        'AI tavsiye motorumuz 2 haftalık harcama verisinden anlamlı örüntüler çıkarıyor. '
        'Beta kayıtları açık, bağlantıyı profilimden bulabilirsiniz.',
        '{}',
        19,
        now() - interval '7 days'
    ),
    (
        'tp00-0000-0000-0000-000000000004',
        'c100-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000007',
        'b100-0000-0000-0000-000000000002',
        'Altyapı güncellemesi: %99.9 uptime hedefiyle yeni yük dengeleme mimarisine geçtik. '
        'Kubernetes cluster''ı tamamen sıfırdan kurdum, artık sıfır downtime deploy yapabiliyoruz.',
        '{}',
        6,
        now() - interval '3 days'
    )
on conflict (id) do nothing;

-- ============================================================
-- 16. TEAM POST LIKES (like_count trigger otomatik güncelliyor
--     ama seed''de direkt sayıyı yazdık; tutarlılık için
--     like satırlarını da ekliyoruz)
-- ============================================================

-- Önce like_count'u sıfırla (trigger tekrar sayar)
update team_posts set like_count = 0;

insert into team_post_likes (post_id, user_id, created_at) values
    -- Post 1 beğenileri
    ('tp00-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', now() - interval '19 days'),
    ('tp00-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', now() - interval '19 days'),
    ('tp00-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', now() - interval '18 days'),
    ('tp00-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', now() - interval '18 days'),
    -- Post 2 beğenileri
    ('tp00-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', now() - interval '11 days'),
    ('tp00-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', now() - interval '11 days'),
    ('tp00-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', now() - interval '10 days'),
    -- Post 3 beğenileri
    ('tp00-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', now() - interval '6 days'),
    ('tp00-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', now() - interval '6 days'),
    ('tp00-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', now() - interval '6 days'),
    ('tp00-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', now() - interval '5 days'),
    ('tp00-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000006', now() - interval '5 days'),
    -- Post 4 beğenileri
    ('tp00-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', now() - interval '2 days'),
    ('tp00-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000008', now() - interval '2 days')
on conflict do nothing;

-- ============================================================
-- 17. NEWS
-- ============================================================

insert into news (
    id, author_id, title, content, tags,
    view_count, like_count, is_published, published_at, created_at
) values
    (
        'nw00-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Biprova''da İlk Ekipler Kuruldu: Türkiye''nin Proje Ekosistemi Büyüyor',
        'Biprova platformu üzerinden kurulan ilk ekipler haberdar edildi. '
        'Yerel Üretici Platformu ve FinFlow gibi projeler, ihtiyaç odaklı eşleşme modelinin '
        'başarısını kanıtlıyor. Platforma kaydolan 200''den fazla kullanıcı arasından 12 ekip '
        'kuruldu, bu ekipler aktif olarak geliştirme süreçlerine başladı.',
        array['ekip', 'startup', 'biprova', 'girişim'],
        234, 0, true, now() - interval '15 days', now() - interval '15 days'
    ),
    (
        'nw00-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'Proje Ekiplerini Güçlendiren 5 İhtiyaç Tanımlama Yöntemi',
        'Başarılı projelerin ortak noktası güçlü bir ihtiyaç tanımlamasıdır. '
        'Biprova''daki en aktif liderlerle yaptığımız görüşmelerden çıkan 5 yöntemi derledik: '
        '1) Rol öncesi kullanıcı araştırması, 2) Minimum özellik listesi, 3) Hız-değer matrisi, '
        '4) Yeterlilik haritası, 5) Açık uçlu başvuru notu analizi.',
        array['ipucu', 'liderlik', 'proje-yonetimi'],
        187, 0, true, now() - interval '8 days', now() - interval '8 days'
    ),
    (
        'nw00-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'Biprova Mobil Uygulaması Geliyor',
        'iOS ve Android uygulamalarımız beta aşamasına girdi. '
        'Bildirimler, anlık mesajlaşma ve proje keşfetme özellikleri mobilde de tam kapasiteyle çalışacak. '
        'Beta kaydı için bekleme listesine katılabilirsiniz.',
        array['mobil', 'beta', 'duyuru'],
        0, 0, false, null, now() - interval '1 day'
    ),
    (
        'nw00-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000001',
        'Fintek ve Sağlık Teknolojilerinde Ekip Kurmanın Zorlukları',
        'Regülasyon yoğun sektörlerde ekip kurmanın bambaşka dinamikleri var. '
        'KVKK, BDDK lisanslama ve sağlık verisi güvenliği gibi konular ekip kompozisyonunu doğrudan etkiliyor. '
        'Bu taslak makale henüz tamamlanmadı.',
        array['fintek', 'saglik', 'regülasyon'],
        0, 0, false, null, now() - interval '2 hours'
    )
on conflict (id) do nothing;

-- ============================================================
-- 18. NEWS LIKES
-- ============================================================

update news set like_count = 0;

insert into news_likes (news_id, user_id, created_at) values
    ('nw00-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', now() - interval '14 days'),
    ('nw00-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', now() - interval '14 days'),
    ('nw00-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', now() - interval '13 days'),
    ('nw00-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', now() - interval '7 days'),
    ('nw00-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', now() - interval '7 days')
on conflict do nothing;

-- ============================================================
-- 19. NOTIFICATIONS
-- ============================================================

insert into notifications (id, user_id, type, payload, is_read, created_at) values
    -- Zeynep: P3'e yeni başvuru geldi
    (
        'nt00-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'new_application',
        '{"project_id":"b100-0000-0000-0000-000000000003","project_title":"FitTrack","applicant_name":"Ayşe Kaya","role_name":"UI/UX Tasarımcı"}',
        false,
        now() - interval '7 days'
    ),
    (
        'nt00-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000004',
        'new_application',
        '{"project_id":"b100-0000-0000-0000-000000000003","project_title":"FitTrack","applicant_name":"Mehmet Demir","role_name":"Mobil Geliştirici (iOS)"}',
        false,
        now() - interval '5 days'
    ),
    -- Selin: P4'e yeni başvuru geldi
    (
        'nt00-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000006',
        'new_application',
        '{"project_id":"b100-0000-0000-0000-000000000004","project_title":"EduMentor","applicant_name":"Ahmet Yılmaz","role_name":"Backend Geliştirici"}',
        false,
        now() - interval '3 days'
    ),
    (
        'nt00-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000006',
        'new_application',
        '{"project_id":"b100-0000-0000-0000-000000000004","project_title":"EduMentor","applicant_name":"Burak Şahin","role_name":"Proje Yöneticisi"}',
        true,
        now() - interval '2 days'
    ),
    -- Mehmet: P1'e başvurusu kabul edildi
    (
        'nt00-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000003',
        'application_accepted',
        '{"project_id":"b100-0000-0000-0000-000000000001","project_title":"Yerel Üretici Platformu","role_name":"Frontend Geliştirici"}',
        true,
        now() - interval '40 days'
    ),
    -- Ayşe: P1'e başvurusu kabul edildi
    (
        'nt00-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000002',
        'application_accepted',
        '{"project_id":"b100-0000-0000-0000-000000000001","project_title":"Yerel Üretici Platformu","role_name":"UI/UX Tasarımcı"}',
        true,
        now() - interval '38 days'
    ),
    -- Nur ve Burak: P2'ye kabul bildirimleri
    (
        'nt00-0000-0000-0000-000000000007',
        'a0000000-0000-0000-0000-000000000008',
        'application_accepted',
        '{"project_id":"b100-0000-0000-0000-000000000002","project_title":"FinFlow","role_name":"Frontend Geliştirici"}',
        true,
        now() - interval '25 days'
    ),
    (
        'nt00-0000-0000-0000-000000000008',
        'a0000000-0000-0000-0000-000000000007',
        'application_accepted',
        '{"project_id":"b100-0000-0000-0000-000000000002","project_title":"FinFlow","role_name":"DevOps Mühendisi"}',
        true,
        now() - interval '24 days'
    ),
    -- Nur: P3'e başvurusu reddedildi (P1 için)
    (
        'nt00-0000-0000-0000-000000000009',
        'a0000000-0000-0000-0000-000000000008',
        'application_rejected',
        '{"project_id":"b100-0000-0000-0000-000000000001","project_title":"Yerel Üretici Platformu","role_name":"Frontend Geliştirici"}',
        true,
        now() - interval '39 days'
    ),
    -- Ahmet: post'una beğeni geldi
    (
        'nt00-0000-0000-0000-000000000010',
        'a0000000-0000-0000-0000-000000000001',
        'post_liked',
        '{"post_id":"tp00-0000-0000-0000-000000000001","liker_name":"Zeynep Çelik"}',
        false,
        now() - interval '18 days'
    )
on conflict (id) do nothing;

-- ============================================================
-- 20. WAITLIST
-- ============================================================

insert into waitlist (email, created_at) values
    ('emre.yurt@gmail.com',      now() - interval '60 days'),
    ('fatma.ozdemir@hotmail.com', now() - interval '52 days'),
    ('kaan.bulut@outlook.com',   now() - interval '44 days'),
    ('dilan.aksoy@gmail.com',    now() - interval '30 days'),
    ('oguz.kurt@gmail.com',      now() - interval '20 days')
on conflict (email) do nothing;

commit;
