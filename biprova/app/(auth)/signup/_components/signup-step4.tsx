'use client';

import { useState, useTransition, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { z } from 'zod';
import { signup } from '@/features/auth/actions';
import { createClient } from '@/lib/supabase/client';

const MAX_BIO = 300;

const schema = z.object({
  bio: z
    .string()
    .max(MAX_BIO, `En fazla ${MAX_BIO} karakter girebilirsin`)
    .optional(),
});

type Errors = Partial<Record<'bio', string>>;

interface AllData {
  name:         string;
  email:        string;
  password:     string;
  city:         string;
  is_remote:    boolean;
  skill_ids:    string[];
  linkedin_url: string;
}

interface Props {
  allData: AllData;
  onBack:    () => void;
  onSuccess: () => void;
}

async function getCroppedBlob(imageSrc: string, croppedAreaPixels: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width  = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0, 0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      0.92,
    );
  });
}

export function SignupStep4({ allData, onBack, onSuccess }: Props) {
  const [bio, setBio]           = useState('');
  const [errors, setErrors]     = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const [isPending, startTransition]  = useTransition();

  // Photo states
  const [imageSrc, setImageSrc]       = useState<string | null>(null);
  const [crop, setCrop]               = useState({ x: 0, y: 0 });
  const [zoom, setZoom]               = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isDragging, setIsDragging]   = useState(false);
  const [photoError, setPhotoError]   = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function handleFileSelected(file: File) {
    if (!file.type.startsWith('image/')) {
      setPhotoError('Sadece resim dosyası yüklenebilir.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Dosya boyutu 5 MB'ı geçemez.");
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') setImageSrc(reader.result);
    });
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setPhotoError(null);
  }

  function handleSubmit() {
    const result = schema.safeParse({ bio: bio || undefined });
    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof Errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError('');

    startTransition(async () => {
      const res = await signup({ ...allData, bio: bio || undefined });

      if ('error' in res) {
        setServerError(res.error);
        return;
      }

      const { userId } = res;

      // Avatar varsa yükle
      if (imageSrc && croppedAreaPixels) {
        try {
          const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
          const supabase = createClient();
          const filePath = `${userId}/avatar.jpg`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, { upsert: true, contentType: 'image/jpeg' });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);

            await supabase
              .from('users')
              .update({ avatar_url: `${publicUrl}?t=${Date.now()}` })
              .eq('id', userId);
          }
        } catch {
          // Avatar yüklenemedi ama kayıt başarılı; devam et
        }
      }

      onSuccess();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-1">
        <p className="font-nunito font-black text-[1.1rem] text-slate-900">Profil Fotoğrafı & Bio</p>
        <p className="text-[0.8rem] text-slate-500 mt-0.5">İstersen atla, daha sonra ekleyebilirsin.</p>
      </div>

      {/* Avatar upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.82rem] font-bold text-slate-900">Profil Fotoğrafı</label>

        {!imageSrc ? (
          <div
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelected(file);
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-[12px] px-4 py-7 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-[#f8faff]'
            }`}
          >
            <span className="text-[2rem]">🧑</span>
            <span className="text-[0.82rem] text-slate-500 text-center">
              Resim sürükleyin veya tıklayın
            </span>
            <span className="text-[0.75rem] text-slate-400">JPG, PNG, WebP · Maks. 5 MB</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Crop area */}
            <div className="relative w-full rounded-[12px] overflow-hidden bg-black" style={{ height: 260 }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom slider */}
            <div className="flex items-center gap-3">
              <span className="text-[0.75rem] text-slate-400 shrink-0">Yakınlaştır</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-[0.78rem] text-slate-400 hover:text-red-500 transition-colors text-left"
            >
              🗑️ Fotoğrafı kaldır
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
            e.target.value = '';
          }}
        />

        {photoError && <p className="text-[0.75rem] text-red-500">{photoError}</p>}
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.82rem] font-bold text-slate-900">
          Hakkında <span className="text-slate-400 font-normal">(isteğe bağlı)</span>
        </label>
        <textarea
          placeholder="Kendinizi kısaca tanıtın..."
          value={bio}
          maxLength={MAX_BIO}
          rows={3}
          onChange={(e) => setBio(e.target.value)}
          className={`
            w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
            px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
            placeholder:text-slate-400 outline-none focus:bg-white transition-colors resize-none
            ${errors.bio ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}
          `}
        />
        <div className="flex justify-between">
          {errors.bio
            ? <p className="text-[0.75rem] text-red-500">{errors.bio}</p>
            : <span />
          }
          <span className={`text-[0.72rem] ${bio.length >= MAX_BIO ? 'text-red-400' : 'text-slate-400'}`}>
            {bio.length}/{MAX_BIO}
          </span>
        </div>
      </div>

      {serverError && (
        <p className="text-[0.8rem] text-red-500 text-center">{serverError}</p>
      )}

      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="flex-none px-5 py-4 rounded-[14px] border-[1.5px] border-slate-200 text-slate-600 font-nunito font-bold text-base hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer bg-transparent disabled:opacity-50 touch-manipulation"
        >
          ← Geri
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 py-4 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-nunito font-extrabold text-base transition-colors cursor-pointer border-none touch-manipulation"
        >
          {isPending ? 'Kaydediliyor...' : 'Kayıt Ol →'}
        </button>
      </div>
    </div>
  );
}
