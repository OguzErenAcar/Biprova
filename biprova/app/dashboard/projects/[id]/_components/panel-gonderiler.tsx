"use client";

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ProjectPost } from '@/features/projects/actions';
import { createProjectPost, deleteProjectPost } from '@/features/projects/actions';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatRelTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Az önce';
  if (min < 60) return `${min}dk önce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}sa önce`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}g önce`;
  return new Date(dateStr).toLocaleDateString('tr-TR');
}

interface ImagePreview {
  file: File;
  previewUrl: string;
}

interface Props {
  teamId: string;
  teamName: string | null;
  posts: ProjectPost[];
  viewerId: string;
  viewerName: string;
  isLeader: boolean;
}

export function PanelGonderiler({ teamId, teamName, posts, viewerId, viewerName, isLeader }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const next = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...next].slice(0, 5));
    e.target.value = '';
  }

  function removeImage(index: number) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function uploadImages(): Promise<string[]> {
    if (previews.length === 0) return [];
    const supabase = createClient();
    const uploaded: string[] = [];
    const batchId = crypto.randomUUID();

    for (const { file } of previews) {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${teamId}/${batchId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from('post-images')
        .upload(path, file, { upsert: false });
      if (error) continue;
      const { data } = supabase.storage.from('post-images').getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    return uploaded;
  }

  function handlePost() {
    if ((!text.trim() && previews.length === 0) || isPending) return;
    const content = text.trim();
    setText('');
    const currentPreviews = previews;
    setPreviews([]);
    startTransition(async () => {
      const imageUrls = await uploadImages();
      currentPreviews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      await createProjectPost(teamId, content || '📸', imageUrls);
      router.refresh();
    });
  }

  return (
    <div id="panel-gonderiler">
      {/* New post area — sadece lider */}
      {isLeader && <div className="bg-white border-[1.5px] border-slate-200 rounded-[14px] p-4 mb-4 w-1/2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-nunito font-black text-[0.75rem] text-white shrink-0">
            {getInitials(viewerName)}
          </div>
          <span className="text-[0.84rem] font-semibold text-slate-400">Ekip adına paylaş...</span>
        </div>
        <textarea
          className="w-full border-none outline-none font-[inherit] text-[0.88rem] resize-none text-slate-900 min-h-[70px] placeholder:text-slate-400 bg-transparent"
          placeholder="Projenizden bir güncelleme paylaşın. Bu gönderi timeline'da görünecek 📢"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Image previews */}
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2 mb-3">
            {previews.map((p, i) => (
              <div key={i} className="relative w-20 h-20 rounded-[8px] overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.previewUrl} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full text-white text-[0.65rem] flex items-center justify-center leading-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 border-t border-slate-200 pt-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending || previews.length >= 5}
            className="text-slate-400 hover:text-blue-600 transition-colors text-[0.82rem] font-semibold flex items-center gap-1 disabled:opacity-40 bg-transparent border-none cursor-pointer"
          >
            📷 Fotoğraf {previews.length > 0 && <span className="text-[0.72rem]">({previews.length}/5)</span>}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={handlePost}
            disabled={isPending || (!text.trim() && previews.length === 0)}
            className="bg-blue-600 text-white border-none rounded-[8px] font-nunito font-extrabold text-[0.84rem] px-5 py-[0.5rem] cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Paylaşılıyor…' : 'Paylaş →'}
          </button>
        </div>
      </div>}

      {/* Posts list */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border-[1.5px] border-slate-200 rounded-[14px] p-[1.2rem] mb-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-[34px] h-[34px] rounded-full bg-indigo-500 flex items-center justify-center font-nunito font-black text-[0.72rem] text-white shrink-0">
              {teamName ? teamName.slice(0, 2).toUpperCase() : '??'}
            </div>
            <div>
              <div className="font-nunito font-black text-[0.9rem]">{teamName ?? 'Ekip'}</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[0.72rem] text-slate-400">{formatRelTime(post.created_at)}</span>
              {post.author_id === viewerId && (
                <button
                  onClick={() => startTransition(async () => { await deleteProjectPost(post.id); router.refresh(); })}
                  disabled={isPending}
                  className="text-slate-400 hover:text-red-500 transition-colors text-[0.75rem] font-semibold bg-transparent border-none cursor-pointer disabled:opacity-40"
                  title="Gönderiyi sil"
                >
                  Sil
                </button>
              )}
            </div>
          </div>
          <div className="text-[0.88rem] leading-relaxed text-slate-900 mb-3">{post.content}</div>

          {post.image_urls.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.image_urls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-1/3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-full h-auto rounded-[8px]"
                  />
                </a>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <span className="text-[0.78rem] font-bold text-slate-400 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1">
              👏 {post.like_count} beğeni
            </span>
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <div className="text-center text-[0.82rem] text-slate-400 py-8">
          Henüz gönderi yok.
        </div>
      )}
    </div>
  );
}
