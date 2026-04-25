-- ============================================================
-- SEED: seed_posts.sql
-- Çalıştırma sırası: seed_auth.sql → seed_projects.sql → seed_posts.sql
-- Kapsam: d04 (Online Eğitim) ve d06 (Yerel Üretici) ekiplerine 3'er gönderi
-- ============================================================


-- ============================================================
-- d04 — Online Eğitim Platformu
-- Ekip: Zeynep (lider·a04), Can (a05·frontend), Ahmet (a01·backend)
-- ============================================================

insert into team_posts (id, team_id, author_id, project_id, content, image_url, image_urls, like_count, created_at) values
(
    'ab000000-0000-0000-0000-000000000001',
    (select id from teams where project_id = 'd0000000-0000-0000-0000-000000000004' limit 1),
    'a0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000004',
    'Platformumuzun ilk beta versiyonu nihayet hazır! 🎉 Gamification modülünü bu hafta tamamladık. Öğrenciler ders tamamladıkça rozet kazanıyor, sınıf arkadaşlarıyla puan rekabetine girebiliyor. İlk test grubundan gelen geri bildirimler çok olumlu — öğrenciler derslere ortalama %40 daha uzun süre bağlı kalıyor. Bir sonraki sprint hedefimiz canlı soru-cevap modülü.',
    'https://fastly.picsum.photos/id/992/200/300.jpg?hmac=TOD4LGE2HuM8Q68o5uzIoFvhlsBAiTJGRGHNMqeJTtI',
    ARRAY[
        'https://fastly.picsum.photos/id/992/200/300.jpg?hmac=TOD4LGE2HuM8Q68o5uzIoFvhlsBAiTJGRGHNMqeJTtI',
        'https://fastly.picsum.photos/id/663/600/300.jpg?hmac=7pj0TJJR2t0-aWoWYbrFdd4C86wSy0ZkZYiimiNoilM'
    ],
    14,
    now() - interval '5 days'
),
(
    'ab000000-0000-0000-0000-000000000002',
    (select id from teams where project_id = 'd0000000-0000-0000-0000-000000000004' limit 1),
    'a0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000004',
    'Yeni interaktif quiz özelliğimizi canlıya aldık. Çoktan seçmeli soruların yanı sıra drag-and-drop ve kod yazma soruları da destekleniyor. React ve Framer Motion ile animasyonları da ekledik; öğrencilerin doğru cevap verdiğinde küçük bir konfeti yağıyor. Bunu yaparken performanstan ödün vermemek için lazy-loading ve memo kullandık — Lighthouse skoru 94.',
    'https://fastly.picsum.photos/id/663/600/300.jpg?hmac=7pj0TJJR2t0-aWoWYbrFdd4C86wSy0ZkZYiimiNoilM',
    ARRAY[
        'https://fastly.picsum.photos/id/663/600/300.jpg?hmac=7pj0TJJR2t0-aWoWYbrFdd4C86wSy0ZkZYiimiNoilM'
    ],
    9,
    now() - interval '3 days'
),
(
    'ab000000-0000-0000-0000-000000000003',
    (select id from teams where project_id = 'd0000000-0000-0000-0000-000000000004' limit 1),
    'a0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000004',
    'Backend altyapımızı bu hafta Supabase üzerine tamamen taşıdık. Realtime özelliği sayesinde öğretmen soruya cevap yazdığında sınıftaki tüm öğrencilerin ekranı anında güncelleniyor — polling yok, websocket karmaşası yok. Aynı zamanda Row Level Security politikalarını da yazdık; bir öğrenci sadece kendi sınıfının içeriklerine erişebiliyor. Sonuç: %60 daha az sunucu maliyeti, çok daha temiz kod.',
    'https://fastly.picsum.photos/id/641/600/300.jpg?hmac=iov6fUiKJbAPK46EMpVYJSpklmDj3odgBVBJvh1OZTM',
    ARRAY[
        'https://fastly.picsum.photos/id/641/600/300.jpg?hmac=iov6fUiKJbAPK46EMpVYJSpklmDj3odgBVBJvh1OZTM',
        'https://fastly.picsum.photos/id/682/600/300.jpg?hmac=yrDPBo9beYQFzHUM8eIrTVv00lNDgJsohTEAu838O_4'
    ],
    21,
    now() - interval '1 day'
)
on conflict do nothing;


-- ============================================================
-- d06 — Yerel Üretici Pazarı
-- Ekip: Selin (lider·a06), Mehmet (a03·full stack), Nur (a08·pazarlama)
-- ============================================================

insert into team_posts (id, team_id, author_id, project_id, content, image_url, image_urls, like_count, created_at) values
(
    'ab000000-0000-0000-0000-000000000004',
    (select id from teams where project_id = 'd0000000-0000-0000-0000-000000000006' limit 1),
    'a0000000-0000-0000-0000-000000000006',
    'd0000000-0000-0000-0000-000000000006',
    'Platformumuz ilk 20 üreticisini kabul etmeye başladı! Bursa ve Konya''dan organik sebze, zeytinyağı ve el yapımı peynir üreticileri aramıza katıldı. Onboarding sürecini mümkün olduğunca basit tuttuk: üretici fotoğraf yükleyip fiyat giriyor, biz lojistik koordinasyonunu üstleniyoruz. Bu hafta ilk 50 sipariş tamamlandı, ortalama teslimat süresi 28 saat.',
    'https://fastly.picsum.photos/id/378/200/300.jpg?hmac=j3b_pCH-0kwk0RstB5_LzJ2hw4H53kPLf6v5M-D3FaI',
    ARRAY[
        'https://fastly.picsum.photos/id/378/200/300.jpg?hmac=j3b_pCH-0kwk0RstB5_LzJ2hw4H53kPLf6v5M-D3FaI',
        'https://fastly.picsum.photos/id/992/200/300.jpg?hmac=TOD4LGE2HuM8Q68o5uzIoFvhlsBAiTJGRGHNMqeJTtI'
    ],
    33,
    now() - interval '6 days'
),
(
    'p0000000-0000-0000-0000-000000000005',
    (select id from teams where project_id = 'd0000000-0000-0000-0000-000000000006' limit 1),
    'a0000000-0000-0000-0000-000000000008',
    'd0000000-0000-0000-0000-000000000006',
    'Sosyal medya kampanyamız #YerelÜret hashtag''iyle 48 saatte 10K erişime ulaştı! Instagram reels formatında hazırladığımız "üreticinin tarlasından masanıza" serisi beklenmedik bir ilgi gördü. Şu an 3 gıda bloguyla iş birliği görüşmesi yapıyoruz. Pazarlama bütçemizin %0 harcamasıyla bu sonuca ulaşmak, içerik odaklı büyüme stratejisinin ne kadar etkili olduğunu bir kez daha kanıtladı.',
    'https://fastly.picsum.photos/id/682/600/300.jpg?hmac=yrDPBo9beYQFzHUM8eIrTVv00lNDgJsohTEAu838O_4',
    ARRAY[
        'https://fastly.picsum.photos/id/682/600/300.jpg?hmac=yrDPBo9beYQFzHUM8eIrTVv00lNDgJsohTEAu838O_4'
    ],
    27,
    now() - interval '4 days'
),
(
    'p0000000-0000-0000-0000-000000000006',
    (select id from teams where project_id = 'd0000000-0000-0000-0000-000000000006' limit 1),
    'a0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000006',
    'Lojistik entegrasyonunu bu hafta tamamladık. Üretici sipariş onayladığında sistem otomatik olarak en yakın kurye ortağına yönlendirme yapıyor; üretici ve alıcı anlık takip linkini SMS ile alıyor. Ayrıca çoklu sipariş konsolidasyonu eklendi: aynı bölgedeki birden fazla üreticiye ait siparişler tek kurye turu ile toplanabiliyor. Bu özellik sayesinde ortalama lojistik maliyetini %35 düşürdük.',
    'https://fastly.picsum.photos/id/641/600/300.jpg?hmac=iov6fUiKJbAPK46EMpVYJSpklmDj3odgBVBJvh1OZTM',
    ARRAY[
        'https://fastly.picsum.photos/id/641/600/300.jpg?hmac=iov6fUiKJbAPK46EMpVYJSpklmDj3odgBVBJvh1OZTM',
        'https://fastly.picsum.photos/id/663/600/300.jpg?hmac=7pj0TJJR2t0-aWoWYbrFdd4C86wSy0ZkZYiimiNoilM'
    ],
    18,
    now() - interval '2 days'
)
on conflict do nothing;
