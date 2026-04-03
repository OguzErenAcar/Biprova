-- ============================================================
-- SEED: Biprova demo verisi
-- ============================================================
-- Triggerlar aktif olduğundan sıra önemli:
--   - INSERT projects  → pm_on_project_created (creator → project_members)
--   - UPDATE applications status='accepted' → pm_on_application_accepted (user → project_members)
--   - UPDATE projects status='full' → create_team_on_project_full (ekip + team_members otomatik)
--
-- Temiz çalıştırmak için önce tabloları truncate et:
--   truncate table notifications, messages, team_post_likes, team_posts,
--     team_members, teams, project_members, applications, project_role_skills,
--     project_roles, projects, user_skills, users, cities,
--     project_categories, skills restart identity cascade;
-- ============================================================

begin;

-- ============================================================
-- SKİLLS
-- ============================================================

insert into skills (id, name, slug) values
    ('10000000-0000-0000-0000-000000000001', 'React',           'react'),
    ('10000000-0000-0000-0000-000000000002', 'Node.js',         'nodejs'),
    ('10000000-0000-0000-0000-000000000003', 'Python',          'python'),
    ('10000000-0000-0000-0000-000000000004', 'UI/UX Tasarım',   'uiux'),
    ('10000000-0000-0000-0000-000000000005', 'PostgreSQL',      'postgresql'),
    ('10000000-0000-0000-0000-000000000006', 'Flutter',         'flutter'),
    ('10000000-0000-0000-0000-000000000007', 'Pazarlama',       'pazarlama'),
    ('10000000-0000-0000-0000-000000000008', 'TypeScript',      'typescript'),
    ('10000000-0000-0000-0000-000000000009', 'Figma',           'figma'),
    ('10000000-0000-0000-0000-000000000010', 'Machine Learning','ml');

-- ============================================================
-- KATEGORİLER
-- ============================================================

insert into project_categories (id, name, slug) values
    ('20000000-0000-0000-0000-000000000001', 'Teknoloji', 'teknoloji'),
    ('20000000-0000-0000-0000-000000000002', 'Sağlık',    'saglik'),
    ('20000000-0000-0000-0000-000000000003', 'Eğitim',    'egitim'),
    ('20000000-0000-0000-0000-000000000004', 'Fintech',   'fintech'),
    ('20000000-0000-0000-0000-000000000005', 'Tarım',     'tarim'),
    ('20000000-0000-0000-0000-000000000006', 'E-ticaret', 'eticaret');

-- ============================================================
-- ŞEHİRLER
-- ============================================================

insert into cities (id, name, slug) values
    ('30000000-0000-0000-0000-000000000001', 'İstanbul', 'istanbul'),
    ('30000000-0000-0000-0000-000000000002', 'Ankara',   'ankara'),
    ('30000000-0000-0000-0000-000000000003', 'İzmir',    'izmir');

-- ============================================================
-- KULLANICILAR
-- ============================================================

insert into users (id, email, name, bio, city, is_remote, linkedin_url, badge, role, plan, max_teams, max_projects) values
    (
        'a0000000-0000-0000-0000-000000000001',
        'ahmet.yilmaz@example.com',
        'Ahmet Yılmaz',
        'Full-stack developer, startup meraklısı. React ve Node.js ile 5 yıldır çalışıyorum.',
        'İstanbul', true,
        'https://linkedin.com/in/ahmetyilmaz',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'ayse.kaya@example.com',
        'Ayşe Kaya',
        'Product Manager. Kullanıcı odaklı ürünler geliştirmeyi seviyorum.',
        'Ankara', true,
        'https://linkedin.com/in/aysekaya',
        null, 'user', 'paid', 3, 3
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'mehmet.demir@example.com',
        'Mehmet Demir',
        'Flutter geliştirici. Mobil uygulamalar benim tutkum.',
        'İstanbul', false,
        'https://linkedin.com/in/mehmetdemir',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'zeynep.celik@example.com',
        'Zeynep Çelik',
        'Veri bilimci ve ML mühendisi. Tarım teknolojilerine odaklanıyorum.',
        'İzmir', true,
        'https://linkedin.com/in/zeynepcelik',
        null, 'user', 'paid', 3, 3
    ),
    (
        'a0000000-0000-0000-0000-000000000005',
        'can.ozturk@example.com',
        'Can Öztürk',
        'Backend developer. Node.js ve PostgreSQL uzmanı.',
        'İstanbul', false,
        'https://linkedin.com/in/canozturk',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000006',
        'selin.arslan@example.com',
        'Selin Arslan',
        'UI/UX tasarımcı. Figma ve kullanıcı araştırması konusunda deneyimliyim.',
        'İstanbul', true,
        'https://linkedin.com/in/selinarslan',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000007',
        'burak.sahin@example.com',
        'Burak Şahin',
        'Flutter geliştirici. Cross-platform mobil uygulamalar yapıyorum.',
        'Ankara', false,
        'https://linkedin.com/in/buraksahin',
        null, 'user', 'free', 1, 1
    ),
    (
        'a0000000-0000-0000-0000-000000000008',
        'nur.yildiz@example.com',
        'Nur Yıldız',
        'Dijital pazarlama uzmanı. Growth hacking ve içerik stratejisi konularında çalışıyorum.',
        'Ankara', true,
        'https://linkedin.com/in/nuryildiz',
        null, 'user', 'free', 1, 1
    );

-- ============================================================
-- KULLANICI BECERİLERİ
-- ============================================================

insert into user_skills (user_id, skill_id) values
    -- Ahmet: React, TypeScript, Node.js
    ('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
    ('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008'),
    ('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
    -- Ayşe: UI/UX, Figma
    ('a0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004'),
    ('a0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009'),
    -- Mehmet: Flutter, React
    ('a0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006'),
    ('a0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
    -- Zeynep: Python, ML, PostgreSQL
    ('a0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003'),
    ('a0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000010'),
    ('a0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000005'),
    -- Can: Node.js, PostgreSQL
    ('a0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002'),
    ('a0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005'),
    -- Selin: UI/UX, Figma
    ('a0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004'),
    ('a0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000009'),
    -- Burak: Flutter
    ('a0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000006'),
    -- Nur: Pazarlama
    ('a0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007');

-- ============================================================
-- PROJE 1: Açık — "Freelancer Proje Yönetim Uygulaması"
-- Kurucu: Ahmet (u1) | Durum: open | 2 rol, 0 dolu
-- ============================================================

insert into projects (id, creator_id, title, description, city, is_remote, category_id, status)
values (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Freelancer Proje Yönetim Uygulaması',
    'Freelancer''ların müşteri projelerini, faturalarını ve zaman takibini tek yerden yönetebileceği bir SaaS uygulaması. MVP''yi 3 ayda tamamlamayı hedefliyoruz.',
    'İstanbul', true,
    '20000000-0000-0000-0000-000000000001',
    'open'
);
-- Trigger (pm_on_project_created): Ahmet → project_members (creator)

insert into project_roles (id, project_id, role_name) values
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Frontend Developer (React)'),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'UI/UX Tasarımcı');

insert into project_role_skills (role_id, skill_id) values
    ('c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008'),
    ('c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004'),
    ('c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009');

-- Selin (u6) UI/UX rolüne, Can (u5) Frontend rolüne başvuruyor — ikisi de pending
insert into applications (id, project_id, user_id, role_id, note, status) values
    (
        'd0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000006',
        'c0000000-0000-0000-0000-000000000002',
        '3 yıldır UI/UX tasarımcıyım, Figma''da ürün tasarımı deneyimim var. Bu projeye katkı sağlamak isterim.',
        'pending'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-000000000001',
        'React ve TypeScript konusunda 4 yıllık deneyimim var. Freelancer araçları ilgi alanım.',
        'pending'
    );

-- ============================================================
-- PROJE 2: Kısmen dolu — "Sağlık Takip ve Analiz Platformu"
-- Kurucu: Ayşe (u2) | Durum: open | 3 rol, 1 dolu
-- ============================================================

insert into projects (id, creator_id, title, description, city, is_remote, category_id, status)
values (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'Sağlık Takip ve Analiz Platformu',
    'Kullanıcıların günlük sağlık metriklerini (uyku, beslenme, egzersiz) takip edip kişiselleştirilmiş öneriler alabileceği bir mobil platform. Yapay zeka destekli analizler içerecek.',
    'Ankara', true,
    '20000000-0000-0000-0000-000000000002',
    'open'
);
-- Trigger (pm_on_project_created): Ayşe → project_members (creator)

insert into project_roles (id, project_id, role_name) values
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Backend Developer'),
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Mobil Geliştirici (Flutter)'),
    ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Veri Bilimci');

insert into project_role_skills (role_id, skill_id) values
    ('c0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005'),
    ('c0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006'),
    ('c0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003'),
    ('c0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000010');

-- Can (u5) Backend rolüne başvuruyor, kabul ediliyor
insert into applications (id, project_id, user_id, role_id, note, status) values
    (
        'd0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-000000000003',
        'Node.js ve PostgreSQL konusunda 4 yıldır çalışıyorum. Sağlık teknolojilerine ilgim var.',
        'pending'
    );

-- Trigger (pm_on_application_accepted): Can → project_members
update applications set status = 'accepted'
where id = 'd0000000-0000-0000-0000-000000000003';

update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000005'
where id = 'c0000000-0000-0000-0000-000000000003';

-- Burak (u7) ve Zeynep (u4) diğer rollere beklemede
insert into applications (id, project_id, user_id, role_id, note, status) values
    (
        'd0000000-0000-0000-0000-000000000004',
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000007',
        'c0000000-0000-0000-0000-000000000004',
        '2 yıldır Flutter ile uygulama geliştiriyorum. Sağlık uygulamalarında deneyimim var.',
        'pending'
    ),
    (
        'd0000000-0000-0000-0000-000000000005',
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000005',
        'ML modelleri ve sağlık verisi analizi üzerine çalışıyorum. Bu proje tam alanım.',
        'pending'
    );

-- ============================================================
-- PROJE 3: Dolu → Ekip otomatik oluşuyor
-- "Eğitim Oyunlaştırma Sistemi"
-- Kurucu: Mehmet (u3) | 2 rol, ikisi de dolu
-- ============================================================

insert into projects (id, creator_id, title, description, city, is_remote, category_id, status)
values (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'Eğitim Oyunlaştırma Sistemi',
    'K-12 öğrencileri için ders müfredatını oyunlaştıran bir mobil uygulama. Rozetler, liderlik tabloları ve seviye sistemi içerecek. Matematik ve fen dersleriyle başlıyoruz.',
    'İstanbul', false,
    '20000000-0000-0000-0000-000000000003',
    'open'
);
-- Trigger (pm_on_project_created): Mehmet → project_members (creator)

insert into project_roles (id, project_id, role_name) values
    ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'Flutter Geliştirici'),
    ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003', 'Backend Geliştirici');

insert into project_role_skills (role_id, skill_id) values
    ('c0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006'),
    ('c0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000005');

-- Burak (u7) Flutter rolüne, Can (u5) Backend rolüne başvuruyor
insert into applications (id, project_id, user_id, role_id, note, status) values
    (
        'd0000000-0000-0000-0000-000000000006',
        'b0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000007',
        'c0000000-0000-0000-0000-000000000006',
        'Flutter ile oyun mekaniği içeren uygulamalar geliştirdim. Eğitim teknolojisi tutkum.',
        'pending'
    ),
    (
        'd0000000-0000-0000-0000-000000000007',
        'b0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-000000000007',
        'Ölçeklenebilir backend sistemleri kurma konusunda deneyimliyim.',
        'pending'
    );

-- Her iki başvuruyu kabul et
-- Trigger (pm_on_application_accepted): Burak + Can → project_members
update applications set status = 'accepted' where id = 'd0000000-0000-0000-0000-000000000006';
update applications set status = 'accepted' where id = 'd0000000-0000-0000-0000-000000000007';

-- Rolleri dolu olarak işaretle
update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000007'
where id = 'c0000000-0000-0000-0000-000000000006';

update project_roles set is_filled = true, filled_by = 'a0000000-0000-0000-0000-000000000005'
where id = 'c0000000-0000-0000-0000-000000000007';

-- TÜM ROLLER DOLDU → status='full' yap
-- Trigger (create_team_on_project_full): ekip + team_members otomatik oluşur,
-- projects.team_id güncellenir.
update projects set status = 'full' where id = 'b0000000-0000-0000-0000-000000000003';

-- ============================================================
-- PROJE 4: Aktif ekip — "Çiftçi Pazar Yeri"
-- Kurucu: Zeynep (u4) | Manuel kurulum (ekip zaten aktif)
-- ============================================================

insert into projects (id, creator_id, title, description, city, is_remote, category_id, status)
values (
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000004',
    'Çiftçi Pazar Yeri',
    'Küçük ölçekli çiftçilerin ürünlerini doğrudan tüketicilere satabileceği, teslimat entegrasyonlu bir e-ticaret platformu. Tarımda dijital dönüşümü hızlandırmayı hedefliyoruz.',
    'İzmir', true,
    '20000000-0000-0000-0000-000000000005',
    'active'
);
-- Trigger (pm_on_project_created): Zeynep → project_members (creator)

insert into project_roles (id, project_id, role_name, is_filled, filled_by) values
    ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', 'UI/UX Tasarımcı',  true, 'a0000000-0000-0000-0000-000000000006'),
    ('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000004', 'Pazarlama Uzmanı', true, 'a0000000-0000-0000-0000-000000000008');

insert into project_role_skills (role_id, skill_id) values
    ('c0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004'),
    ('c0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000009'),
    ('c0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000007');

-- Ekibi manuel kur (aktif durum, 15 gün önce kuruldu)
insert into teams (id, name, leader_id, status, project_id, formed_at, activated_at) values
    (
        'e0000000-0000-0000-0000-000000000001',
        'Çiftçi Pazar Yeri ekibi',
        'a0000000-0000-0000-0000-000000000004',
        'active',
        'b0000000-0000-0000-0000-000000000004',
        now() - interval '15 days',
        now() - interval '14 days'
    );

update projects set team_id = 'e0000000-0000-0000-0000-000000000001'
where id = 'b0000000-0000-0000-0000-000000000004';

-- project_members: Zeynep trigger ile eklendi; Selin ve Nur manuel
insert into project_members (project_id, user_id, role) values
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000006', 'member'),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000008', 'member');

insert into team_members (team_id, user_id, role_id, has_biprova) values
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', null,                                       true),
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000008', false),
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000009', false);

-- Ekip mesajları
insert into messages (id, team_id, sender_id, content, created_at) values
    (
        'f0000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'Herkese hoş geldiniz! İlk sprint planımızı bu hafta belirleyelim. Öncelikle kullanıcı akışlarına odaklanacağız.',
        now() - interval '13 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000006',
        'Harika! Figma''da ilk wireframe taslakları hazırlamaya başladım. Yarın paylaşırım.',
        now() - interval '13 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000003',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000008',
        'Pazarlama stratejisi için hedef kitlemizi netleştirelim mi? Küçük aile çiftçileri mi, büyük üreticiler mi?',
        now() - interval '12 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000004',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'Küçük aile çiftçileri ile başlayalım. İzmir ve çevresinde 50+ çiftçiyle görüşme ayarladım.',
        now() - interval '12 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000005',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000006',
        'Wireframe''leri paylaştım, yorumlarınızı bekliyorum!',
        now() - interval '10 days'
    );

-- Ekip gönderileri
insert into team_posts (id, team_id, author_id, project_id, content, like_count, created_at) values
    (
        'f1000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'b0000000-0000-0000-0000-000000000004',
        'Çiftçi Pazar Yeri projemizi resmen başlattık! İzmir''deki çiftçilerle ilk görüşmelerimizi yaptık, geri bildirimler çok olumlu. Yakında beta sürümünü paylaşacağız.',
        12,
        now() - interval '10 days'
    ),
    (
        'g0000000-0000-0000-0000-000000000002',
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000006',
        'b0000000-0000-0000-0000-000000000004',
        'İlk UI tasarımlarımız hazır! Sade ve çiftçi dostu bir arayüz tasarladık. Figma prototipi üzerinde kullanıcı testleri yapıyoruz.',
        8,
        now() - interval '5 days'
    );

-- ============================================================
-- HABERLER
-- ============================================================

insert into news (id, author_id, title, content, tags, view_count, like_count, is_published, published_at) values
    (
        'h0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        'Türkiye''de Girişimcilik Ekosistemi 2025 Raporu Yayınlandı',
        'TÜSİAD ve Startup Turkey iş birliğiyle hazırlanan yıllık rapor, Türkiye''de teknoloji girişimciliğinin son 5 yılda %340 büyüdüğünü ortaya koydu. İstanbul, girişim merkezi olma özelliğini korurken Ankara ve İzmir de hızla yükseliyor.',
        ARRAY['girişimcilik', 'teknoloji', 'türkiye'],
        234, 18, true,
        now() - interval '7 days'
    ),
    (
        'h0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000002',
        'Tarım Teknolojileri Yatırımları Rekora Koşuyor',
        'Agritech alanındaki küresel yatırımlar 2024''te 15 milyar doları aştı. Türkiye bu alanda önemli bir potansiyel taşıyor: tarım arazilerinin verimliliğini artıracak akıllı sulama, drone ve sensör teknolojileri giderek yaygınlaşıyor.',
        ARRAY['tarım', 'teknoloji', 'yatırım', 'agritech'],
        187, 24, true,
        now() - interval '3 days'
    );

-- ============================================================
-- BİLDİRİMLER
-- ============================================================

insert into notifications (id, user_id, type, payload, is_read, created_at) values
    -- Ahmet: projesine 2 başvuru geldi
    (
        'i0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'new_application',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000001',
            'project_title', 'Freelancer Proje Yönetim Uygulaması',
            'applicant_name','Selin Arslan',
            'role_name',     'UI/UX Tasarımcı'
        ),
        false, now() - interval '2 days'
    ),
    (
        'i0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'new_application',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000001',
            'project_title', 'Freelancer Proje Yönetim Uygulaması',
            'applicant_name','Can Öztürk',
            'role_name',     'Frontend Developer (React)'
        ),
        false, now() - interval '1 day'
    ),
    -- Can: başvurusu kabul edildi (p2)
    (
        'i0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000005',
        'application_accepted',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000002',
            'project_title', 'Sağlık Takip ve Analiz Platformu',
            'role_name',     'Backend Developer'
        ),
        true, now() - interval '4 days'
    ),
    -- Burak: başvurusu kabul edildi (p3)
    (
        'i0000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000007',
        'application_accepted',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000003',
            'project_title', 'Eğitim Oyunlaştırma Sistemi',
            'role_name',     'Flutter Geliştirici'
        ),
        false, now() - interval '3 days'
    ),
    -- Mehmet: ekibi oluştu (p3)
    (
        'i0000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000003',
        'team_formed',
        jsonb_build_object(
            'project_id',    'b0000000-0000-0000-0000-000000000003',
            'project_title', 'Eğitim Oyunlaştırma Sistemi'
        ),
        false, now() - interval '3 days'
    );

commit;
