-- ============================================================
-- SEED EXTRA — 5 Proje + 5 Gönderi
-- Çalıştır: seed.sql'den SONRA
-- Projeler: yazılım dışı gerçek hayat senaryoları
-- ============================================================

begin;

-- ============================================================
-- 1. PROJECTS (P5–P9)
-- ============================================================

insert into projects (
    id, leader_id, title, description,
    city, location, is_remote, category_id, status, created_at
) values
    -- P5: Mahalle Gönüllüleri — sosyal yardım, İstanbul
    (
        'b1000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000006',
        'Mahalle Gönüllüleri — Komşuluk Destek Ağı',
        'Yaşlı, hasta ve engelli komşulara alışveriş, fatura ödeme ve evde bakım desteği '
        'sağlayan gönüllü koordinasyon ağı. İstanbul Kadıköy''den başlayıp diğer ilçelere '
        'yayılmayı hedefliyoruz. Gönüllü takibini ve talep eşleştirmeyi kolaylaştıracak basit '
        'bir sistem kurmak istiyoruz.',
        'İstanbul',
        ST_Point(29.0280, 40.9892)::geography,
        false,
        'e0000000-0000-0000-0000-000000000001',
        'open',
        now() - interval '8 days'
    ),
    -- P6: Sahne Heyecanı — üniversite tiyatrosu, İzmir
    (
        'b1000000-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000004',
        'Sahne Heyecanı — Üniversite Tiyatro Topluluğu',
        'Dokuz Eylül Üniversitesi öğrencileri olarak bu yıl Çehov''un "Vanya Amca" eserini '
        'sahneliyoruz. Işık tasarımı, kostüm dikimi ve sahne dekorasyonu için ekip üyeleri '
        'arıyoruz. Tiyatroyu seviyor, eline iğne iplik alabiliyor ya da sahneyi renklendirmeyi '
        'istiyorsan bize katıl.',
        'İzmir',
        ST_Point(27.1420, 38.4630)::geography,
        false,
        'e0000000-0000-0000-0000-000000000001',
        'open',
        now() - interval '6 days'
    ),
    -- P7: Mahallenin Sesi — podcast, İstanbul
    (
        'b1000000-0000-0000-0000-000000000007',
        'a0000000-0000-0000-0000-000000000008',
        'Mahallenin Sesi — Sıradan İnsanların Olağandışı Hikayeleri',
        'Her bölümde İstanbul''un farklı bir mahallesinden sıradan bir insanın ilgi çekici '
        'hikayesini anlatan haftalık podcast. Kayıt, kurgu ve yayın sürecini birlikte yürütecek '
        'ekip arıyoruz. Ekipman bizde var, ihtiyacımız olan şey tutku ve düzenlilik.',
        'İstanbul',
        ST_Point(28.9500, 41.0100)::geography,
        true,
        'e0000000-0000-0000-0000-000000000001',
        'open',
        now() - interval '4 days'
    ),
    -- P8: Şehrin Rengi — mural/duvar boyama, Bursa
    (
        'b1000000-0000-0000-0000-000000000008',
        'a0000000-0000-0000-0000-000000000003',
        'Şehrin Rengi — Bursa Mural Projesi',
        'Bursa''nın tarihi sokaklarındaki boş ve hasar görmüş duvarlara yerel sanatçılarla '
        'birlikte mural yapıyoruz. Belediyeden izinleri aldık, ilk duvar Osmangazi''de. '
        'Boyama ekibine ek olarak fotoğraf-video belgelemesi yapacak birine ve '
        'sosyal medyayı yönetecek birine ihtiyacımız var.',
        'Bursa',
        ST_Point(29.0600, 40.1830)::geography,
        false,
        'e0000000-0000-0000-0000-000000000001',
        'open',
        now() - interval '2 days'
    ),
    -- P9: Güneş Arabası — üniversite bitirme projesi, Ankara
    (
        'b1000000-0000-0000-0000-000000000009',
        'a0000000-0000-0000-0000-000000000005',
        'Güneş Arabası — ODTÜ Bitirme Proje Ekibi',
        'ODTÜ Makine Mühendisliği öğrencileri olarak Teknofest Güneş Arabası Yarışması''na '
        'katılmak istiyoruz. Şasi tasarımı, güneş paneli entegrasyonu ve gömülü sistem '
        'yazılımı için ekip kuruyoruz. Mezuniyet projenizi gerçek bir yarışmaya dönüştürmek '
        'isteyenler buyursun.',
        'Ankara',
        ST_Point(32.7760, 39.8901)::geography,
        false,
        'e0000000-0000-0000-0000-000000000004',
        'open',
        now() - interval '1 day'
    )
on conflict (id) do nothing;

-- ============================================================
-- 2. PROJECT ROLES
-- ============================================================

insert into project_roles (id, project_id, role_name, is_filled, filled_by) values
    -- P5: Mahalle Gönüllüleri
    ('a2000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000005', 'Saha Koordinatörü',       false, null),
    ('a2000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000005', 'Sosyal Medya Yöneticisi', false, null),
    ('a2000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000005', 'Grafik Tasarımcı',        false, null),
    -- P6: Sahne Heyecanı
    ('a2000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000006', 'Işık & Sahne Tasarımcısı', false, null),
    ('a2000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000006', 'Kostüm Dikici',            false, null),
    ('a2000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000006', 'Fotoğrafçı / Kameraman',  false, null),
    -- P7: Mahallenin Sesi
    ('a2000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000007', 'Ses Editörü',             false, null),
    ('a2000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000007', 'İçerik Yazarı',           false, null),
    -- P8: Şehrin Rengi
    ('a2000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000008', 'Duvar Ressamı',           false, null),
    ('a2000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000008', 'Fotoğraf & Video',        false, null),
    ('a2000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000008', 'Sosyal Medya Yöneticisi', false, null),
    -- P9: Güneş Arabası
    ('a2000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000009', 'Şasi & Mekanik Tasarım',    false, null),
    ('a2000000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000009', 'Elektrik & Elektronik',     false, null),
    ('a2000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000009', 'Gömülü Sistem Yazılımcısı', false, null)
on conflict (id) do nothing;

-- ============================================================
-- 3. PROJECT ROLE SKILLS (en yakın eşleşmeler)
-- ============================================================

insert into project_role_skills (role_id, skill_id) values
    -- P5: Mahalle Gönüllüleri
    ('a2000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000008'), -- PM → Saha Koord.
    ('a2000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000009'), -- Pazarlama → Sosyal Medya
    ('a2000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000011'), -- Grafik Tasarım
    -- P6: Sahne Heyecanı
    ('a2000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000005'), -- UI/UX → Sahne Tasarım
    ('a2000000-0000-0000-0000-000000000016', 'd0000000-0000-0000-0000-000000000011'), -- Grafik → Fotoğraf
    -- P7: Mahallenin Sesi
    ('a2000000-0000-0000-0000-000000000017', 'd0000000-0000-0000-0000-000000000010'), -- İçerik → Ses Editörü
    ('a2000000-0000-0000-0000-000000000018', 'd0000000-0000-0000-0000-000000000010'), -- İçerik Yazarı
    -- P8: Şehrin Rengi
    ('a2000000-0000-0000-0000-000000000020', 'd0000000-0000-0000-0000-000000000011'), -- Grafik → Foto/Video
    ('a2000000-0000-0000-0000-000000000021', 'd0000000-0000-0000-0000-000000000009'), -- Pazarlama → Sosyal Medya
    -- P9: Güneş Arabası
    ('a2000000-0000-0000-0000-000000000024', 'd0000000-0000-0000-0000-000000000002')  -- Backend → Gömülü Sistem
on conflict do nothing;

-- ============================================================
-- 4. TEAM POSTS (Post 5–9) — mevcut T1 ve T2 ekiplerinden
--    İnsan odaklı, teknik olmayan içerikler
-- ============================================================

insert into team_posts (
    id, team_id, author_id, project_id,
    content, image_urls, like_count, created_at
) values
    (
        'a6000000-0000-0000-0000-000000000005',
        'c1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',  -- Ayşe
        'b1000000-0000-0000-0000-000000000001',
        'Bugün ilk kez üreticileri ziyaret ettik. Trabzon''dan gelen Kadriye Hanım, '
        '30 yıldır el örgüsü yapıyor ama hiç internette satış yapamamış. '
        'Platforma kaydolurken gözleri doldu. Neden bu işi yaptığımızı tekrar hatırladım.',
        '{}',
        0,
        now() - interval '9 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000006',
        'c1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000003',  -- Mehmet
        'b1000000-0000-0000-0000-000000000001',
        'Sprint review''dan küçük bir not: bu haftaki en büyük kazanım '
        'teknik bir özellik değil, bir üreticinin bize yazdığı mesaj. '
        '"Artık kızıma bakabileceğim kadar sipariş geliyor." dedi. '
        'Motivasyon için başka bir şeye gerek yok.',
        '{}',
        0,
        now() - interval '5 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000007',
        'c1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000008',  -- Nur
        'b1000000-0000-0000-0000-000000000002',
        'FinFlow kullanıcı görüşmeleri yaptık. '
        'En çok şikayeti olan konu: bankalar harcamaları yanlış kategorize ediyor. '
        '"Market" yerine "Eğlence" yazıyor, ay sonunda kafası karışıyor. '
        'Bunu düzeltmek bile insanların hayatını gerçekten değiştirebilir.',
        '{}',
        0,
        now() - interval '4 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000008',
        'c1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000005',  -- Can
        'b1000000-0000-0000-0000-000000000002',
        'Biprova sayesinde kurduğumuz ekiple bugün 6. ayımızda. '
        'Can (lider olarak ben), Nur ve Burak — farklı şehirlerden, hiç tanışmadan başladık. '
        'Geçen hafta ilk kez İstanbul''da buluştuk. '
        'Ekranların arkasındaki insanları görmek her şeyi değiştiriyor.',
        '{}',
        0,
        now() - interval '2 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000009',
        'c1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',  -- Ahmet
        'b1000000-0000-0000-0000-000000000001',
        '3 ay önce "ihtiyacım var: frontend geliştirici, UI/UX tasarımcısı" diye bir proje açtım. '
        'Bugün o proje 120 üreticinin geçim kaynağı. '
        'Sadece kod yazmadık — bir geçim köprüsü kurduk. '
        'Bu yüzden Biprova''ya inanıyorum.',
        '{}',
        0,
        now() - interval '1 day'
    )
on conflict (id) do nothing;

-- ============================================================
-- 5. LIKES
-- ============================================================

insert into team_post_likes (post_id, user_id, created_at) values
    -- Post 5
    ('a6000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', now() - interval '8 days'),
    ('a6000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', now() - interval '8 days'),
    ('a6000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', now() - interval '7 days'),
    ('a6000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000007', now() - interval '7 days'),
    -- Post 6
    ('a6000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', now() - interval '4 days'),
    ('a6000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004', now() - interval '4 days'),
    ('a6000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', now() - interval '4 days'),
    -- Post 7
    ('a6000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', now() - interval '3 days'),
    ('a6000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', now() - interval '3 days'),
    ('a6000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', now() - interval '3 days'),
    -- Post 8
    ('a6000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', now() - interval '1 day'),
    ('a6000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', now() - interval '1 day'),
    ('a6000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000004', now() - interval '1 day'),
    ('a6000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000006', now() - interval '1 day'),
    -- Post 9
    ('a6000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000002', now() - interval '20 hours'),
    ('a6000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000004', now() - interval '18 hours'),
    ('a6000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000005', now() - interval '16 hours'),
    ('a6000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000007', now() - interval '14 hours'),
    ('a6000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000008', now() - interval '12 hours')
on conflict do nothing;

commit;
