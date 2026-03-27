# Roles & Permissions

## Mevcut Durum

`users.role text default 'user'` — tek kolon, iki değer:

- `user` → normal kullanıcı
- `admin` → her şeye erişim

RLS policy'leri `schema.sql` içinde tanımlı. Helper fonksiyonlar:
- `is_admin()` — users tablosundan role kontrolü yapar
- `is_team_member(team_uuid)` — team_members üzerinden kontrol
- `is_project_creator(project_uuid)` — projects üzerinden kontrol

---

## Büyüyünce: Basit Genişletme (Yol 1)

Role kolonu genişletilir, policy'lere `in ('editor', 'admin')` eklenir:

```sql
-- Yeni roller: 'user' | 'editor' | 'moderator' | 'admin'

-- Örnek: editör news ekleyebilir ama silemez
create policy "news_editor_insert" on news for insert
    using (
        exists (select 1 from users where id = auth.uid() and role in ('editor', 'admin'))
    );

create policy "news_delete" on news for delete
    using (is_admin());
```

Ne zaman gerekir: 1-2 yeni rol, izinler basit.

---

## Büyüyünce: Doğru Yapı (Yol 2)

Birden fazla rol, dinamik izin yönetimi gerekince:

```sql
create table roles (
    id   uuid primary key default uuid_generate_v4(),
    name text unique not null
);

create table user_roles (
    user_id uuid references users(id) on delete cascade,
    role_id uuid references roles(id) on delete cascade,
    primary key (user_id, role_id)
);
```

Helper fonksiyon güncellenir:

```sql
create or replace function has_role(role_name text)
returns boolean language sql security definer as $$
    select exists (
        select 1 from user_roles ur
        join roles r on r.id = ur.role_id
        where ur.user_id = auth.uid() and r.name = role_name
    );
$$;
```

Policy'lerde:
```sql
using (has_role('editor') or has_role('admin'))
```

Ne zaman gerekir: Kullanıcıya birden fazla rol atanacaksa, roller sık değişiyorsa.

---

## Kural

```
kim  +  ne yapabilir  +  hangi satırlara  =  1 policy
```

Her tablo, her operasyon (select / insert / update / delete) ayrı ayrı kısıtlanır.
