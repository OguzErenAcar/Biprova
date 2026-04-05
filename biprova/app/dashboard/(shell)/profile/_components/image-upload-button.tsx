'use client';

import { useState, useRef, DragEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { saveAvatarUrl, saveCoverUrl } from '@/features/users/actions';

interface ImageUploadButtonProps {
  type: 'avatar' | 'cover';
  userId: string;
  children: React.ReactNode;
}

export function ImageUploadButton({ type, userId, children }: ImageUploadButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const label = type === 'avatar' ? 'Profil Fotoğrafı' : 'Kapak Fotoğrafı';
  const bucket = type === 'avatar' ? 'avatars' : 'covers';
  const filePath = `${userId}/${type}.jpg`;

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Sadece resim dosyası yüklenebilir.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5 MB\'ı geçemez.');
      return;
    }

    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);

      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

      const result = type === 'avatar'
        ? await saveAvatarUrl(cacheBustedUrl)
        : await saveCoverUrl(cacheBustedUrl);

      if (!result.success) throw new Error(result.error);

      setSuccess(true);
      setTimeout(() => setOpen(false), 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Yüklenemedi');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(null); setSuccess(false); setOpen(true); }}
        className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 bg-black/30 transition-opacity flex items-center justify-center cursor-pointer"
        aria-label={`${label} değiştir`}
      >
        <span className="text-white text-[0.75rem] font-bold drop-shadow">✏️ Düzenle</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-sm shadow-xl p-6">
            <div className="font-nunito font-black text-[1rem] text-slate-900 mb-5">
              {label} Yükle
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-[12px] px-4 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              {uploading ? (
                <span className="text-[0.85rem] text-slate-500">Yükleniyor...</span>
              ) : success ? (
                <span className="text-[0.85rem] text-green-600 font-semibold">✓ Yüklendi</span>
              ) : (
                <>
                  <span className="text-[2rem]">{type === 'avatar' ? '🧑' : '🖼️'}</span>
                  <span className="text-[0.82rem] text-slate-500 text-center">
                    Resim sürükleyin veya tıklayın
                  </span>
                  <span className="text-[0.72rem] text-slate-400">JPG, PNG, WebP · Maks. 5 MB</span>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />

            {error && (
              <div className="text-[0.78rem] text-red-600 mt-3">{error}</div>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[0.88rem] py-2.5 rounded-[10px] transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
