'use client';

import { useState, useEffect, useTransition, useRef, DragEvent } from 'react';
import { UserProfile, updateProfile, saveCvUrl, saveCvPublic, removeCv } from '@/features/users/actions';
import { getCities } from '@/features/auth/actions';
import { createClient } from '@/lib/supabase/client';

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
  const [isRemote, setIsRemote] = useState(user.is_remote ?? false);
  const [bio, setBio] = useState(user.bio ?? '');
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvRemoving, setCvRemoving] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [cvSuccess, setCvSuccess] = useState(false);
  const [hasCv, setHasCv] = useState(!!user.cv_url);
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
    setIsRemote(user.is_remote ?? false);
    setBio(user.bio ?? '');
    setFormError(null);
    setCvError(null);
    setCvSuccess(false);
    setHasCv(!!user.cv_url);
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
        is_remote: isRemote,
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
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[0.75rem] font-bold px-2.5 py-1 rounded-[8px] transition-colors"
      >
        ✏️ Düzenle
      </button>

      {open && (
        <div
          id="profile-edit-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div id="profile-edit-modal" className="bg-white rounded-[20px] w-full max-w-md shadow-xl p-6">
            <div className="font-nunito font-black text-[1.1rem] text-slate-900 mb-5">
              Profili Düzenle
            </div>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="text-[0.78rem] font-bold text-slate-500 mb-1 block">İsim</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-[10px] px-3.5 py-2.5 text-[0.9rem] text-slate-900 outline-none focus:border-blue-500 transition-colors"
                  placeholder="Adınız Soyadınız"
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="text-[0.78rem] font-bold text-slate-500 mb-1 block">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full border border-slate-200 rounded-[10px] px-3.5 py-2.5 text-[0.9rem] text-slate-900 outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://linkedin.com/in/kullanici"
                />
              </div>

              {/* City dropdown */}
              <div>
                <label className="text-[0.78rem] font-bold text-slate-500 mb-1 block">Şehir</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => {
                      setCityQuery(e.target.value);
                      setCity(e.target.value);
                      setCityOpen(true);
                    }}
                    onFocus={() => setCityOpen(true)}
                    onBlur={() => setTimeout(() => setCityOpen(false), 150)}
                    className="w-full border border-slate-200 rounded-[10px] px-3.5 py-2.5 text-[0.9rem] text-slate-900 outline-none focus:border-blue-500 transition-colors"
                    placeholder="Şehir seç veya yazın..."
                    autoComplete="off"
                  />
                  {cityOpen && filteredCities.length > 0 && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-[10px] shadow-lg overflow-hidden">
                      <div className="overflow-y-auto max-h-[190px]">
                        {filteredCities.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onMouseDown={() => handleCitySelect(c.name)}
                            className={`w-full text-left px-3.5 py-2.5 text-[0.88rem] transition-colors ${
                              city === c.name
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'text-slate-800 hover:bg-slate-50'
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

              {/* Remote toggle */}
              <div className="flex items-center justify-between bg-slate-50 rounded-[10px] px-3.5 py-2.5">
                <span className="text-[0.88rem] font-semibold text-slate-700">🌐 Remote uyumlu</span>
                <button
                  type="button"
                  onClick={() => setIsRemote(!isRemote)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isRemote ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isRemote ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {/* Bio */}
              <div>
                <label className="text-[0.78rem] font-bold text-slate-500 mb-1 block">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full border border-slate-200 rounded-[10px] px-3.5 py-2.5 text-[0.9rem] text-slate-900 outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Kendinizden kısaca bahsedin..."
                />
                <div className="text-[0.72rem] text-slate-400 text-right mt-0.5">
                  {bio.length}/500
                </div>
              </div>

              {/* CV Upload */}
              <div>
                <label className="text-[0.78rem] font-bold text-slate-500 mb-1 block">CV (PDF)</label>
                {hasCv && !cvSuccess ? (
                  <div className="flex items-center justify-between bg-slate-50 rounded-[10px] px-3.5 py-3 border border-slate-200">
                    <span className="text-[0.82rem] text-slate-700 font-medium">📄 CV yüklü</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={cvUploading || cvRemoving}
                        className="text-[0.75rem] text-blue-600 font-semibold hover:underline disabled:opacity-50"
                      >
                        Değiştir
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={handleRemoveCv}
                        disabled={cvUploading || cvRemoving}
                        className="text-[0.75rem] text-red-500 font-semibold hover:underline disabled:opacity-50"
                      >
                        {cvRemoving ? 'Kaldırılıyor...' : 'Kaldır'}
                      </button>
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
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    {cvUploading ? (
                      <span className="text-[0.82rem] text-slate-500">Yükleniyor...</span>
                    ) : cvSuccess ? (
                      <span className="text-[0.82rem] text-green-600 font-semibold">✓ CV başarıyla yüklendi</span>
                    ) : (
                      <>
                        <span className="text-[1.4rem]">📄</span>
                        <span className="text-[0.82rem] text-slate-500 text-center">
                          PDF sürükleyin veya tıklayın
                        </span>
                        <span className="text-[0.72rem] text-slate-400">Maks. 5 MB</span>
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
                  <div className="text-[0.78rem] text-red-600 mt-1">{cvError}</div>
                )}
              </div>

              {/* Error */}
              {formError && (
                <div className="text-[0.82rem] text-red-600 bg-red-50 rounded-[8px] px-3.5 py-2">
                  {formError}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[0.88rem] py-2.5 rounded-[10px] transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || !name.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[0.88rem] py-2.5 rounded-[10px] transition-colors disabled:opacity-50"
              >
                {isPending ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
