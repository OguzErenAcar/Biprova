"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectPost } from '@/features/projects/actions';
import { createProjectPost } from '@/features/projects/actions';

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

interface Props {
  teamId: string;
  teamName: string | null;
  posts: ProjectPost[];
  viewerId: string;
  viewerName: string;
}

export function PanelGonderiler({ teamId, teamName, posts, viewerId, viewerName }: Props) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();

  function handlePost() {
    if (!text.trim() || isPending) return;
    const content = text.trim();
    setText('');
    startTransition(async () => {
      await createProjectPost(teamId, content);
      router.refresh();
    });
  }

  return (
    <div id="panel-gonderiler">
      {/* New post area */}
      <div className="bg-white border-[1.5px] border-slate-200 rounded-[14px] p-4 mb-4">
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
        <div className="flex justify-end mt-2 border-t border-slate-200 pt-2">
          <button
            onClick={handlePost}
            disabled={isPending || !text.trim()}
            className="bg-blue-600 text-white border-none rounded-[8px] font-nunito font-extrabold text-[0.84rem] px-5 py-[0.5rem] cursor-pointer disabled:opacity-50"
          >
            Paylaş →
          </button>
        </div>
      </div>

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
            <span className="ml-auto text-[0.72rem] text-slate-400">
              {formatRelTime(post.created_at)}
            </span>
          </div>
          <div className="text-[0.88rem] leading-relaxed text-slate-900 mb-3">{post.content}</div>
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
