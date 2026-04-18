-- ============================================================
-- SEED EXTRA — 5 Proje + 5 Gönderi
-- Çalıştır: seed.sql'den SONRA
-- ============================================================

begin;

-- ============================================================
-- 1. PROJECTS (P5–P9)
-- ============================================================

insert into projects (
    id, leader_id, title, description,
    city, location, is_remote, category_id, status, created_at
) values
    -- P5: GreenRoute — Çevre, Ankara, açık
    (
        'b1000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000006',
        'GreenRoute — Sürdürülebilir Ulaşım Asistanı',
        'Şehir içi yolculuklarda karbon ayak izini hesaplayan ve en yeşil rotayı öneren mobil uygulama. '
        'Toplu taşıma, bisiklet ve yürüyüş seçeneklerini birleştirerek CO₂ tasarrufunu görselleştiriyor. '
        'Belediyelerle API entegrasyonu planlanıyor.',
        'Ankara',
        ST_Point(32.8597, 39.9334)::geography,
        true,
        'e0000000-0000-0000-0000-000000000008',
        'open',
        now() - interval '8 days'
    ),
    -- P6: GameZone — Oyun, İstanbul, açık
    (
        'b1000000-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000003',
        'GameZone — Türk Bağımsız Oyun Platformu',
        'Türk bağımsız oyun geliştiricilerinin oyunlarını yayınlayıp para kazandığı yerli platform. '
        'Steam''e alternatif olarak tasarlanan GameZone, Türkçe destek, TL ödeme ve yerel topluluk özellikleri sunuyor. '
        'İlk aşamada PC ve mobil oyunları destekleyecek.',
        'İstanbul',
        ST_Point(28.9784, 41.0082)::geography,
        true,
        'e0000000-0000-0000-0000-000000000006',
        'open',
        now() - interval '6 days'
    ),
    -- P7: MedAssist — Sağlık, İzmir, yüz yüze
    (
        'b1000000-0000-0000-0000-000000000007',
        'a0000000-0000-0000-0000-000000000004',
        'MedAssist — Hasta Takip ve Hatırlatma Sistemi',
        'Kronik hastalığı olan bireylerin ilaç saatlerini, doktor randevularını ve kan değerlerini '
        'takip etmesini sağlayan uygulama. Yakınlara otomatik durum bildirimi ve acil alarm özelliği var. '
        'Kardiyoloji ve diyabet kliniklerinden pilot destek alındı.',
        'İzmir',
        ST_Point(27.1287, 38.4192)::geography,
        false,
        'e0000000-0000-0000-0000-000000000003',
        'open',
        now() - interval '4 days'
    ),
    -- P8: CryptoTrack — Fintek, İstanbul, uzaktan
    (
        'b1000000-0000-0000-0000-000000000008',
        'a0000000-0000-0000-0000-000000000005',
        'CryptoTrack — Kripto Portföy Yöneticisi',
        'Birden fazla borsadaki kripto varlıklarını tek ekranda toplayan, '
        'anlık fiyat bildirimleri ve vergi hesaplama desteği sunan web uygulaması. '
        'Binance, Paribu ve Bitexen API entegrasyonları ilk aşamada tamamlanacak.',
        'İstanbul',
        ST_Point(28.9784, 41.0082)::geography,
        true,
        'e0000000-0000-0000-0000-000000000005',
        'open',
        now() - interval '2 days'
    ),
    -- P9: EduKids — Eğitim, Bursa, uzaktan
    (
        'b1000000-0000-0000-0000-000000000009',
        'a0000000-0000-0000-0000-000000000008',
        'EduKids — Çocuklar İçin Eğlenceli Kodlama',
        '7–14 yaş arası çocuklara görsel programlama ve algoritmik düşünceyi öğreten interaktif platform. '
        'Scratch benzeri blok tabanlı arayüze ek olarak Türkçe içerik ve ebeveyn ilerleme raporu sunuyor. '
        'Okul müfredatıyla uyumlu modüller hazırlanıyor.',
        'Bursa',
        ST_Point(29.0600, 40.1830)::geography,
        true,
        'e0000000-0000-0000-0000-000000000004',
        'open',
        now() - interval '1 day'
    )
on conflict (id) do nothing;

-- ============================================================
-- 2. PROJECT ROLES
-- ============================================================

insert into project_roles (id, project_id, role_name, is_filled, filled_by) values
    -- P5: GreenRoute
    ('a2000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000005', 'Backend Geliştirici',        false, null),
    ('a2000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000005', 'Mobil Geliştirici (Android)', false, null),
    ('a2000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000005', 'UI/UX Tasarımcı',            false, null),
    -- P6: GameZone
    ('a2000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000006', 'Mobil Geliştirici (iOS)',    false, null),
    ('a2000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000006', 'UI/UX Tasarımcı',           false, null),
    ('a2000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000006', 'Yapay Zeka Mühendisi',      false, null),
    -- P7: MedAssist
    ('a2000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000007', 'Backend Geliştirici',        false, null),
    ('a2000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000007', 'Mobil Geliştirici (Android)', false, null),
    ('a2000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000007', 'Veri Bilimcisi',             false, null),
    -- P8: CryptoTrack
    ('a2000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000008', 'Frontend Geliştirici',       false, null),
    ('a2000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000008', 'Blockchain Geliştirici',     false, null),
    ('a2000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000008', 'Backend Geliştirici',        false, null),
    -- P9: EduKids
    ('a2000000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000009', 'Frontend Geliştirici',       false, null),
    ('a2000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000009', 'UI/UX Tasarımcı',           false, null),
    ('a2000000-0000-0000-0000-000000000025', 'b1000000-0000-0000-0000-000000000009', 'İçerik Üreticisi',          false, null)
on conflict (id) do nothing;

-- ============================================================
-- 3. PROJECT ROLE SKILLS
-- ============================================================

insert into project_role_skills (role_id, skill_id) values
    -- P5
    ('a2000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000002'), -- Backend
    ('a2000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000004'), -- Android
    ('a2000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000005'), -- UI/UX
    -- P6
    ('a2000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000003'), -- iOS
    ('a2000000-0000-0000-0000-000000000015', 'd0000000-0000-0000-0000-000000000005'), -- UI/UX
    ('a2000000-0000-0000-0000-000000000016', 'd0000000-0000-0000-0000-000000000013'), -- AI
    -- P7
    ('a2000000-0000-0000-0000-000000000017', 'd0000000-0000-0000-0000-000000000002'), -- Backend
    ('a2000000-0000-0000-0000-000000000018', 'd0000000-0000-0000-0000-000000000004'), -- Android
    ('a2000000-0000-0000-0000-000000000019', 'd0000000-0000-0000-0000-000000000006'), -- Veri Bilimi
    ('a2000000-0000-0000-0000-000000000019', 'd0000000-0000-0000-0000-000000000013'), -- AI
    -- P8
    ('a2000000-0000-0000-0000-000000000020', 'd0000000-0000-0000-0000-000000000001'), -- Frontend
    ('a2000000-0000-0000-0000-000000000021', 'd0000000-0000-0000-0000-000000000014'), -- Blockchain
    ('a2000000-0000-0000-0000-000000000022', 'd0000000-0000-0000-0000-000000000002'), -- Backend
    -- P9
    ('a2000000-0000-0000-0000-000000000023', 'd0000000-0000-0000-0000-000000000001'), -- Frontend
    ('a2000000-0000-0000-0000-000000000023', 'd0000000-0000-0000-0000-000000000012'), -- Full Stack
    ('a2000000-0000-0000-0000-000000000024', 'd0000000-0000-0000-0000-000000000005'), -- UI/UX
    ('a2000000-0000-0000-0000-000000000025', 'd0000000-0000-0000-0000-000000000010')  -- İçerik
on conflict do nothing;

-- ============================================================
-- 4. PROJECT MEMBERS — liderler otomatik eklenir (trigger),
--    burada ek bir şey gerekmez
-- ============================================================

-- ============================================================
-- 5. TEAM POSTS (Post 5–9)
--    Mevcut T1 (Yerel Üretici) ve T2 (FinFlow) ekiplerinden
-- ============================================================

insert into team_posts (
    id, team_id, author_id, project_id,
    content, image_urls, like_count, created_at
) values
    (
        'a6000000-0000-0000-0000-000000000005',
        'c1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000003',  -- Mehmet
        'b1000000-0000-0000-0000-000000000001',
        'Platformda satıcı kayıt akışını tamamen yeniden yazdık. '
        'Ortalama tamamlanma süresi 8 dakikadan 2,5 dakikaya indi. '
        'Küçük UX kararları büyük dönüşüm farkları yaratıyor.',
        '{}',
        0,
        now() - interval '9 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000006',
        'c1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',  -- Ayşe
        'b1000000-0000-0000-0000-000000000001',
        'Tasarım sistemimizi Figma''dan koda otomatik senkronize eden bir pipeline kurduk. '
        'Token değişiklikleri artık tek tıkla tüm bileşenlere yansıyor. '
        'Tasarım–geliştirme döngüsü yarıya indi.',
        '{}',
        0,
        now() - interval '5 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000007',
        'c1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000008',  -- Nur
        'b1000000-0000-0000-0000-000000000002',
        'FinFlow''un harcama kategorisi tahmin motoru 500 işlemlik test setinde %91 doğruluk aldı. '
        'Model bir sonraki sprintte production''a alınıyor. '
        'Veri temizleme sürecine verdiğimiz emek karşılığını verdi.',
        '{}',
        0,
        now() - interval '4 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000008',
        'c1000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000005',  -- Can
        'b1000000-0000-0000-0000-000000000002',
        '500 beta kullanıcısını geçtik! '
        'İlk hafta elde tutma oranımız %68 — sektör ortalamasının oldukça üzerinde. '
        'En çok beğenilen özellik: haftalık tasarruf özeti bildirimi. '
        'Biprova sayesinde kurduğumuz ekip bu başarının temelinde.',
        '{}',
        0,
        now() - interval '2 days'
    ),
    (
        'a6000000-0000-0000-0000-000000000009',
        'c1000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',  -- Ahmet
        'b1000000-0000-0000-0000-000000000001',
        '3. ayımızı tamamladık. Platformda 120 aktif üretici, 340 tamamlanmış sipariş. '
        'Bu haftaki hedefimiz arama ve filtreleme motorunu Elasticsearch''e taşımak. '
        'Büyümek için doğru altyapıyı şimdiden kurmak gerekiyor.',
        '{}',
        0,
        now() - interval '1 day'
    )
on conflict (id) do nothing;

-- ============================================================
-- 6. LIKES — trigger like_count'u güncelliyor
-- ============================================================

insert into team_post_likes (post_id, user_id, created_at) values
    -- Post 5
    ('a6000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', now() - interval '8 days'),
    ('a6000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000004', now() - interval '8 days'),
    ('a6000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', now() - interval '7 days'),
    -- Post 6
    ('a6000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000005', now() - interval '4 days'),
    ('a6000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000007', now() - interval '4 days'),
    -- Post 7
    ('a6000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000005', now() - interval '3 days'),
    ('a6000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', now() - interval '3 days'),
    ('a6000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', now() - interval '3 days'),
    -- Post 8
    ('a6000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', now() - interval '1 day'),
    ('a6000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', now() - interval '1 day'),
    ('a6000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000004', now() - interval '1 day'),
    ('a6000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000006', now() - interval '1 day'),
    -- Post 9
    ('a6000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000002', now() - interval '20 hours'),
    ('a6000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000005', now() - interval '18 hours')
on conflict do nothing;

commit;
