"use client";

import { useRef, useState, useTransition } from 'react';
import { FileText, Link2, Trash2, Upload, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { ProjectFile } from '@/features/projects/actions';
import { recordTeamFile, addTeamLink, deleteTeamFile } from '@/features/projects/actions';

function formatDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min} dk önce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} saat önce`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} gün önce`;
  return `${Math.floor(day / 7)} hafta önce`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  teamId: string;
  files: ProjectFile[];
  viewerId: string;
  isLeader: boolean;
}

export function PanelDosyalar({ teamId, files: initialFiles, viewerId, isLeader }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (picked.length === 0) return;

    setUploading(true);
    setError(null);
    const supabase = createClient();

    for (const file of picked) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Dosya boyutu en fazla 20 MB olabilir.');
        continue;
      }
      const ext = file.name.split('.').pop() ?? 'bin';
      const path = `${teamId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('team-files')
        .upload(path, file, { upsert: false });
      if (uploadError) {
        setError('Dosya yüklenemedi.');
        continue;
      }
      const { data } = supabase.storage.from('team-files').getPublicUrl(path);
      const result = await recordTeamFile(teamId, file.name, data.publicUrl, file.size, file.type);
      if (result.error) {
        setError(result.error);
      } else if (result.file) {
        setFiles((prev) => [result.file!, ...prev]);
      }
    }
    setUploading(false);
  }

  function handleAddLink() {
    const name = linkName.trim();
    const url = linkUrl.trim();
    if (!name || !url) return;
    setError(null);
    startTransition(async () => {
      const result = await addTeamLink(teamId, name, url);
      if (result.error) {
        setError(result.error);
      } else if (result.file) {
        setFiles((prev) => [result.file!, ...prev]);
        setLinkName('');
        setLinkUrl('');
        setShowLinkForm(false);
      }
    });
  }

  function handleDelete(fileId: string) {
    startTransition(async () => {
      const result = await deleteTeamFile(fileId);
      if (result.error) {
        setError(result.error);
      } else {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    });
  }

  return (
    <div id="panel-dosyalar">
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
          <span className="font-nunito text-[0.9rem] font-black">📁 Dosyalar & Linkler</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowLinkForm((v) => !v); setError(null); }}
              className="text-[0.75rem] font-bold text-slate-500 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
            >
              <Link2 size={13} strokeWidth={2.5} />
              Link Ekle
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-[0.75rem] font-bold text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 disabled:opacity-50"
            >
              <Upload size={13} strokeWidth={2.5} />
              Dosya Yükle
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Link form */}
        {showLinkForm && (
          <div className="px-[1.2rem] py-[0.9rem] border-b border-slate-100 bg-slate-50 flex flex-col gap-2">
            <input
              className="w-full border-[1.5px] border-slate-200 rounded-[8px] px-3 py-[0.5rem] text-[0.84rem] outline-none focus:border-blue-500 bg-white"
              placeholder="Link adı (örn: Figma Tasarımı)"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
            />
            <input
              className="w-full border-[1.5px] border-slate-200 rounded-[8px] px-3 py-[0.5rem] text-[0.84rem] outline-none focus:border-blue-500 bg-white"
              placeholder="URL (https://...)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddLink(); }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowLinkForm(false); setLinkName(''); setLinkUrl(''); }}
                className="text-[0.8rem] text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleAddLink}
                disabled={isPending || !linkName.trim() || !linkUrl.trim()}
                className="bg-blue-600 text-white border-none rounded-[7px] text-[0.8rem] font-bold px-4 py-[0.4rem] cursor-pointer disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-[1.2rem] py-[0.6rem] bg-red-50 border-b border-red-100">
            <p className="text-[0.8rem] text-red-500">{error}</p>
          </div>
        )}

        {/* File list */}
        <div className="divide-y divide-slate-100">
          {uploading && (
            <div className="px-[1.2rem] py-[0.8rem] text-[0.82rem] text-slate-400 flex items-center gap-2">
              <span className="animate-spin inline-block">⏳</span> Yükleniyor...
            </div>
          )}

          {files.length === 0 && !uploading && (
            <div className="px-[1.2rem] py-[2.5rem] text-center text-[0.82rem] text-slate-400">
              Henüz dosya veya link yok.
            </div>
          )}

          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 px-[1.2rem] py-[0.8rem]">
              <div className="shrink-0 w-8 h-8 rounded-[8px] bg-slate-100 flex items-center justify-center">
                {file.type === 'link'
                  ? <Link2 size={15} strokeWidth={2} className="text-blue-500" />
                  : <FileText size={15} strokeWidth={2} className="text-slate-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.86rem] font-semibold text-slate-800 hover:text-blue-600 transition-colors flex items-center gap-1 truncate"
                >
                  {file.name}
                  <ExternalLink size={11} strokeWidth={2} className="shrink-0 opacity-40" />
                </a>
                <p className="text-[0.73rem] text-slate-400">
                  {file.uploader_name}
                  {file.size !== null && ` • ${formatSize(file.size)}`}
                  {` • ${formatDate(file.created_at)}`}
                </p>
              </div>
              {(file.uploader_id === viewerId || isLeader) && (
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={isPending}
                  className="shrink-0 text-slate-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40"
                >
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
