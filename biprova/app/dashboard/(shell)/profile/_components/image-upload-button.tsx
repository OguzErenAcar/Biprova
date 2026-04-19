'use client';

import { useState, useRef, DragEvent, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { createClient } from '@/lib/supabase/client';
import { saveAvatarUrl, saveCoverUrl, removeAvatarUrl, removeCoverUrl } from '@/features/users/actions';

interface ImageUploadButtonProps {
  type: 'avatar' | 'cover';
  userId: string;
  currentUrl?: string | null;
  children: React.ReactNode;
}

async function getCroppedBlob(imageSrc: string, croppedAreaPixels: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
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

export function ImageUploadButton({ type, userId, currentUrl, children }: ImageUploadButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // crop step
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const label = type === 'avatar' ? 'Profil Fotoğrafı' : 'Kapak Fotoğrafı';
  const bucket = type === 'avatar' ? 'avatars' : 'covers';
  const filePath = `${userId}/${type}.jpg`;
  const aspect = type === 'avatar' ? 1 : 16 / 5;

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function handleClose() {
    setOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
    setSuccess(false);
  }

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  function handleFileSelected(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Sadece JPG, PNG veya WebP dosyası yüklenebilir.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5 MB\'ı geçemez.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') setImageSrc(reader.result);
    });
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    if (!imageSrc || !croppedAreaPixels) return;

    setError(null);
    setUploading(true);

    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, blob, { upsert: true, contentType: 'image/jpeg' });

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

      const result = type === 'avatar'
        ? await saveAvatarUrl(cacheBustedUrl)
        : await saveCoverUrl(cacheBustedUrl);

      if (!result.success) throw new Error(result.error);

      setSuccess(true);
      setTimeout(() => handleClose(), 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Yüklenemedi');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setUploading(true);
    try {
      const result = type === 'avatar' ? await removeAvatarUrl() : await removeCoverUrl();
      if (!result.success) throw new Error(result.error);
      setSuccess(true);
      setTimeout(() => handleClose(), 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kaldırılamadı');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelected(file);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(null); setSuccess(false); setOpen(true); }}
        className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 bg-black/30 transition-opacity flex items-center justify-center cursor-pointer"
        aria-label={`${label} değiştir`}
      >
        <span className="text-white text-meta font-bold drop-shadow">✏️ Düzenle</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-canvas rounded-[20px] w-full max-w-sm shadow-xl p-6">
            <div className="font-nunito font-black text-base text-ink mb-5">
              {label} Yükle
            </div>

            {!imageSrc ? (
              <>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-[12px] px-4 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isDragging ? 'border-brand bg-brand-surface' : 'border-edge hover:border-edge bg-canvas'
                  }`}
                >
                  <span className="text-[2rem]">{type === 'avatar' ? '🧑' : '🖼️'}</span>
                  <span className="text-caption text-ink-muted text-center">
                    Resim sürükleyin veya tıklayın
                  </span>
                  <span className="text-meta text-ink-subtle">JPG, PNG, WebP · Maks. 5 MB</span>
                </div>

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

                {currentUrl && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={uploading}
                    className="mt-3 w-full border border-danger-surface hover:bg-danger-surface disabled:opacity-60 text-danger font-bold text-body py-2.5 rounded-[10px] transition-colors"
                  >
                    {uploading ? 'Kaldırılıyor...' : `🗑️ ${label} Kaldır`}
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Crop area */}
                <div className="relative w-full rounded-[12px] overflow-hidden bg-black" style={{ height: type === 'avatar' ? 280 : 175 }}>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    cropShape={type === 'avatar' ? 'round' : 'rect'}
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                {/* Zoom slider */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-meta text-ink-subtle shrink-0">Yakınlaştır</span>
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

                {success ? (
                  <div className="mt-4 text-center text-body text-success font-semibold">✓ Yüklendi</div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-4 w-full bg-brand hover:bg-brand-hover disabled:opacity-60 text-white font-bold text-body py-2.5 rounded-[10px] transition-colors"
                  >
                    {uploading ? 'Yükleniyor...' : 'Kaydet'}
                  </button>
                )}
              </>
            )}

            {error && (
              <div className="text-caption text-danger mt-3">{error}</div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full bg-slate-100 hover:bg-slate-200 text-ink-muted font-bold text-body py-2.5 rounded-[10px] transition-colors"
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
