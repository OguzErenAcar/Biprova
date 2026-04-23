# Ertelenen Policy Kararları

Bu kararlar iş mantığına göre netleştirilmesi gereken sorular içeriyor.

---

## 6. `notifications` INSERT — kim ekliyor?

**Sorun:** RLS açık, INSERT policy yok. `authenticated` kullanıcı doğrudan bildirim ekleyemez.

**Karar verilmesi gereken:** Bildirimler nerede oluşturuluyor?
- `lib/supabase/admin.ts` (service role) kullanılıyorsa → RLS bypass, sorun yok
- Normal Supabase client ile Server Action'dan ekleniyorsa → hiç bildirim gitmiyor

**Yapılacak (seçenekler):**
- A) Her yerde `supabaseAdmin` kullanıldığını doğrula — policy gerekmez
- B) Trigger ile bildirim gönderiliyorsa → security definer, policy gerekmez
- C) Uygulama kodu normal client kullanıyorsa → `notifications_insert` policy ekle:
  ```sql
  create policy "notifications_insert" on notifications for insert
      with check (is_admin());
  -- Kullanıcılar kendi bildirimleri için: sadece service role veya trigger ekler
  ```

---

## 7. `team_members_insert` — başvuru akışını bypass ediyor

**Sorun:** Şu an ekip lideri, `team_members`'a istediği kullanıcıyı direkt ekleyebilir.
Başvuru akışı (apply → accept → trigger → team_member) tamamen atlanabilir.

**Karar verilmesi gereken:** Lider dışarıdan üye davet edebilmeli mi?
- **Hayır** → `team_members_insert` policy'sini kaldır; sadece `create_team_on_project_full` trigger'ı eklesin
- **Evet** → Mevcut policy doğru, ama davet akışı (bildirim, kabul vs.) da olmalı

---

## 8. `project_members` — lider üye çıkaramıyor

**Sorun:** `pm_manage` sadece admin. Lider bir proje üyesini çıkarmak isterse yolu yok.
Şu an sadece üye kendisi `fn_leave_project` ile çıkabiliyor.

**Karar verilmesi gereken:** Proje lideri üye çıkarabilmeli mi?
- **Evet** → `fn_kick_from_project(p_project_id, p_user_id)` fonksiyonu + policy gerekir
- **Hayır** → Mevcut durum korunur (üye iradesiyle çıkış)

Lider üye çıkarmak isterse örnek fonksiyon:
```sql
create or replace function fn_kick_from_project(p_project_id uuid, p_user_id uuid)
returns void language plpgsql security definer as $$
begin
    if not is_project_leader(p_project_id) then
        raise exception 'Yetkisiz';
    end if;
    -- çıkarılacak kişi lider olamaz
    if exists (
        select 1 from project_members
        where project_id = p_project_id and user_id = p_user_id and role = 'leader'
    ) then
        raise exception 'Lider çıkarılamaz';
    end if;
    update project_roles set filled_by = null, is_filled = false
        where project_id = p_project_id and filled_by = p_user_id;
    delete from project_members where project_id = p_project_id and user_id = p_user_id;
end;
$$;
```
