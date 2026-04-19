'use client';

import { useState, useEffect, useTransition, useRef, DragEvent } from 'react';
import { UserProfile, updateProfile, saveCvUrl, saveCvPublic, removeCv } from '@/features/users/actions';
import { getCities } from '@/features/auth/actions';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ProfileEditModalProps {
  user: UserProfile;
}

export function ProfileEditModal({ user }: ProfileEditModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedin_url ?? '');
  const [city, setCity] = useState(user.city ?? '');
  const [cityQuery, setCityQuery] = useState(user.city ?? '');
  const [cityOpen, setCityOpen] = useState(false);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [bio, setBio] = useState(user.bio ?? '');
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvRemoving, setCvRemoving] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [cvSuccess, setCvSuccess] = useState(false);
  const [hasCv, setHasCv] = useState(!!user.cv_url);
  const [cvPublic, setCvPublic] = useState(user.cv_public);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCities().then(setCities);
  }, []);

  const filteredCities = cityQuery.trim()
    ? cities.filter((c) => c.name.toLowerCase().includes(cityQuery.toLowerCase()))
    : cities;

  function handleOpen() {
    setName(user.name);
    setLinkedinUrl(user.linkedin_url ?? '');
    setCity(user.city ?? '');
    setCityQuery(user.city ?? '');
    setBio(user.bio ?? '');
    setFormError(null);
    setCvError(null);
    setCvSuccess(false);
    setHasCv(!!user.cv_url);
    setCvPublic(user.cv_public);
    setOpen(true);
  }

  async function handleCvFile(file: File) {
    if (file.type !== 'application/pdf') {
      setCvError('Sadece PDF dosyası yüklenebilir.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError('Dosya boyutu 5 MB\'ı geçemez.');
      return;
    }

    setCvError(null);
    setCvSuccess(false);
    setCvUploading(true);

    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Oturum açmanız gerekiyor');

      const path = `${authUser.id}/cv.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(path, file, { upsert: true, contentType: 'application/pdf' });

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(path);

      const result = await saveCvUrl(publicUrl);
      if (!result.success) throw new Error(result.error);

      setCvSuccess(true);
      setHasCv(true);
    } catch (err: unknown) {
      setCvError(err instanceof Error ? err.message : 'CV yüklenemedi');
    } finally {
      setCvUploading(false);
    }
  }

  async function handleRemoveCv() {
    setCvError(null);
    setCvRemoving(true);
    try {
      const result = await removeCv();
      if (!result.success) throw new Error(result.error);
      setHasCv(false);
      setCvSuccess(false);
    } catch (err: unknown) {
      setCvError(err instanceof Error ? err.message : 'CV kaldırılamadı');
    } finally {
      setCvRemoving(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleCvFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleCitySelect(name: string) {
    setCity(name);
    setCityQuery(name);
    setCityOpen(false);
  }

  function handleSubmit() {
    setFormError(null);
    startTransition(async () => {
      const result = await updateProfile({
        name,
        linkedin_url: linkedinUrl.trim() || null,
        city: city.trim() || null,
        bio: bio.trim() || null,
      });

      if (result.success) {
        setOpen(false);
      } else {
        setFormError(result.error ?? 'Bir hata oluştu');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleOpen}
          className="text-meta font-bold"
        >
          ✏️ Düzenle
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-[20px] p-6 max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="font-nunito font-black text-title text-ink">
            Profili Düzenle
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="edit-name" className="text-caption font-bold text-ink-muted">
              İsim
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız Soyadınız"
              className="rounded-[10px]"
            />
          </div>

          {/* LinkedIn URL */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="edit-linkedin" className="text-caption font-bold text-ink-muted">
              LinkedIn URL
            </Label>
            <Input
              id="edit-linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/kullanici"
              className="rounded-[10px]"
            />
          </div>

          {/* City dropdown */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="edit-city" className="text-caption font-bold text-ink-muted">
              Şehir
            </Label>
            <div className="relative">
              <Input
                id="edit-city"
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setCity(e.target.value);
                  setCityOpen(true);
                }}
                onFocus={() => setCityOpen(true)}
                onBlur={() => setTimeout(() => setCityOpen(false), 150)}
                placeholder="Şehir seç veya yazın..."
                autoComplete="off"
                className="rounded-[10px]"
              />
              {cityOpen && filteredCities.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-canvas border border-edge rounded-[10px] shadow-lg overflow-hidden">
                  <div className="overflow-y-auto max-h-[190px]">
                    {filteredCities.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onMouseDown={() => handleCitySelect(c.name)}
                        className={`w-full text-left px-3.5 py-2.5 text-body transition-colors ${
                          city === c.name
                            ? 'bg-brand-surface text-brand font-semibold'
                            : 'text-ink hover:bg-canvas'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="edit-bio" className="text-caption font-bold text-ink-muted">
              Bio
            </Label>
            <Textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Kendinizden kısaca bahsedin..."
              className="rounded-[10px] resize-none"
            />
            <div className="text-meta text-ink-subtle text-right">{bio.length}/500</div>
          </div>

          {/* CV Upload */}
          <div className="flex flex-col gap-1">
            <Label className="text-caption font-bold text-ink-muted">CV (PDF)</Label>
            {hasCv && !cvSuccess ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-canvas rounded-[10px] px-3.5 py-3 border border-edge">
                  <span className="text-caption text-ink-muted font-medium">📄 CV yüklü</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={cvUploading || cvRemoving}
                      className="text-meta text-brand font-semibold h-auto p-0"
                    >
                      Değiştir
                    </Button>
                    <span className="text-ink-subtle">|</span>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={handleRemoveCv}
                      disabled={cvUploading || cvRemoving}
                      className="text-meta text-danger font-semibold h-auto p-0"
                    >
                      {cvRemoving ? 'Kaldırılıyor...' : 'Kaldır'}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-canvas rounded-[10px] px-3.5 py-2.5 border border-edge">
                  <Label htmlFor="cv-public" className="text-caption text-ink-muted cursor-pointer">
                    🌐 Herkes görebilsin
                  </Label>
                  <Switch
                    id="cv-public"
                    checked={cvPublic}
                    onCheckedChange={async (next) => {
                      setCvPublic(next);
                      await saveCvPublic(next);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-[10px] px-4 py-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-brand bg-brand-surface'
                    : 'border-edge hover:border-edge bg-canvas'
                }`}
              >
                {cvUploading ? (
                  <span className="text-caption text-ink-muted">Yükleniyor...</span>
                ) : cvSuccess ? (
                  <span className="text-caption text-success font-semibold">✓ CV başarıyla yüklendi</span>
                ) : (
                  <>
                    <span className="text-h2">📄</span>
                    <span className="text-caption text-ink-muted text-center">
                      PDF sürükleyin veya tıklayın
                    </span>
                    <span className="text-meta text-ink-subtle">Maks. 5 MB</span>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCvFile(file);
                e.target.value = '';
              }}
            />
            {cvError && (
              <div className="text-caption text-danger mt-1">{cvError}</div>
            )}
          </div>

          {/* Form Error */}
          {formError && (
            <div className="text-caption text-danger bg-danger-surface rounded-[8px] px-3.5 py-2">
              {formError}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 gap-2.5 sm:gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="flex-1 font-bold text-body rounded-[10px]"
          >
            İptal
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="flex-1 font-bold text-white rounded-[10px]"
          >
            {isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
