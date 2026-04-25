-- ============================================================
-- APP CONFIG  (Option C: JSONB key-value store for admin settings)
-- ============================================================
-- Tek tablo, genişletilebilir yapı.
-- notification_templates yanı sıra feature flags, site config
-- gibi her türlü admin ayarı buraya girer.
-- Yazma: sadece service role (RLS ile kilitli)
-- Okuma: authenticated kullanıcılar (bildirim üretirken server action okur)

create table if not exists app_config (
    key         text        primary key,
    value       jsonb       not null,
    description text,
    updated_at  timestamptz not null default now()
);

-- updated_at otomatik güncellensin
create or replace function set_app_config_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger trg_app_config_updated_at
    before update on app_config
    for each row execute function set_app_config_updated_at();

-- RLS
alter table app_config enable row level security;

-- Authenticated kullanıcılar okuyabilir (server action'lar için)
create policy "authenticated users can read app_config"
    on app_config for select
    to authenticated
    using (true);

-- Yazma yok — sadece service role key'i ile (admin panel veya seed)
-- (service role RLS'i bypass eder, ayrıca policy gerekmez)


-- ============================================================
-- SEED — notification_templates
-- ============================================================
-- Her tip: { "title": "...", "body": "..." }
-- Şablon değişkenleri {{değişken_adı}} formatında
-- Server action render ederken basit string replace yapar

insert into app_config (key, value, description) values (
  'notification_templates',
  '{
    "yeni_basvuru": {
      "title": "Yeni başvuru",
      "body": "{{applicant_name}}, {{role_name}} rolüne başvurdu."
    },
    "basvuru_kabul": {
      "title": "Başvurun kabul edildi 🎉",
      "body": "{{project_title}} projesinde {{role_name}} rolüne kabul edildin."
    },
    "basvuru_red": {
      "title": "Başvurun reddedildi",
      "body": "{{project_title}} projesindeki {{role_name}} başvurun reddedildi."
    },
    "takim_kuruldu": {
      "title": "Ekip kuruldu! 🚀",
      "body": "{{project_title}} ekibinin tüm rolleri doldu. Artık takım üyesisin!"
    },
    "yeni_mesaj": {
      "title": "Yeni mesaj",
      "body": "{{sender_name}}: {{message_preview}}"
    },
    "ekipten_atildin": {
      "title": "Ekipten çıkarıldın",
      "body": "{{project_title}} ekibinden çıkarıldın."
    },
    "artik_lider_sensin": {
      "title": "Artık lidersin 👑",
      "body": "{{project_title}} projesinin yeni lideri sensin."
    },
    "proje_silindi": {
      "title": "Proje silindi",
      "body": "Üyesi olduğun {{project_title}} projesi silindi."
    },
    "proje_doldu": {
      "title": "Proje doldu",
      "body": "{{project_title}} projesinin tüm rolleri doldu."
    },
    "yeni_haber": {
      "title": "Yeni haber",
      "body": "{{headline}}"
    },
    "gonderi_yayinda": {
      "title": "Gönderin yayında 🎊",
      "body": "Biprova ile oluşturduğun \"{{post_title}}\" yayına girdi."
    },
    "takim_gonderi": {
      "title": "Yeni gönderi",
      "body": "{{team_name}} ekibi yeni bir gönderi paylaştı: {{post_title}}"
    }
  }'::jsonb,
  'Bildirim başlık ve metin şablonları. {{değişken}} formatında placeholder kullanır.'
)
on conflict (key) do update
  set value       = excluded.value,
      description = excluded.description,
      updated_at  = now();
