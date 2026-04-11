-- ============================================================
-- PATCH: team_posts'a image_urls ekle + ek post ver
-- seed.sql çalıştırıldıktan SONRA çalıştır.
--
-- Mevcut 2 postu günceller + resimli/resimsiz 3 yeni post ekler.
-- Görsel test URL'leri: picsum.photos (sabit seed, her zaman aynı resim)
-- ============================================================

begin;

-- ────────────────────────────────────────────────────────────
-- Mevcut postlara image_urls ekle
-- ────────────────────────────────────────────────────────────

-- Post 1 → 2 resimli
update team_posts
set image_urls = ARRAY[
    'https://picsum.photos/seed/biprova1/800/500',
    'https://picsum.photos/seed/biprova2/800/500'
]
where id = 'f1000000-0000-0000-0000-000000000001';

-- Post 2 → 1 resimli
update team_posts
set image_urls = ARRAY[
    'https://picsum.photos/seed/biprova3/800/500'
]
where id = 'f1000000-0000-0000-0000-000000000002';

-- ────────────────────────────────────────────────────────────
-- Ek post: sadece metin (resim yok)
-- ────────────────────────────────────────────────────────────

insert into team_posts (id, team_id, author_id, project_id, content, image_urls, like_count, created_at)
values (
    'f1000000-0000-0000-0000-000000000003',
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000006',
    'b0000000-0000-0000-0000-000000000004',
    'Kullanıcı araştırması tamamlandı. İzmir''deki 12 çiftçiyle yüz yüze görüştük. En büyük sorun nakliye koordinasyonu çıktı — bunu MVP kapsamına alıyoruz.',
    '{}',
    5,
    now() - interval '2 days'
);

-- ────────────────────────────────────────────────────────────
-- Ek post: uzun body (devamını oku testi) + 3 resim
-- ────────────────────────────────────────────────────────────

insert into team_posts (id, team_id, author_id, project_id, content, image_urls, like_count, created_at)
values (
    'f1000000-0000-0000-0000-000000000004',
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000008',
    'b0000000-0000-0000-0000-000000000004',
    E'Sprint 1 Özeti\nBu hafta çok yoğun geçti. Ödeme entegrasyonu için üç farklı sağlayıcıyı değerlendirdik: İyzico, Stripe ve PayTR. Türkiye odaklı ilerlediğimizden İyzico öne çıktı. Backend altyapısı için Supabase Edge Functions kullanmayı planlıyoruz — ekstra sunucu maliyeti çıkmayacak. Tasarım tarafında ise ürün listeleme akışı Figma''da tamamlandı. Önümüzdeki hafta kullanıcı testlerini başlatıyoruz.',
    ARRAY[
        'https://picsum.photos/seed/biprova4/800/500',
        'https://picsum.photos/seed/biprova5/800/500',
        'https://picsum.photos/seed/biprova6/800/500'
    ],
    21,
    now() - interval '1 day'
);

-- ────────────────────────────────────────────────────────────
-- Beğeniler (mevcut kullanıcılardan)
-- ────────────────────────────────────────────────────────────

insert into team_post_likes (post_id, user_id, created_at) values
    ('f1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', now()),
    ('f1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', now()),
    ('f1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', now()),
    ('f1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', now()),
    ('f1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', now())
on conflict do nothing;

commit;
