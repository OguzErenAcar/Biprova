"use client";

import Link from 'next/link';
import { useState, useTransition, useRef, useEffect } from 'react';
import { Paperclip, FileText, Send, Trash2, Check, CheckCheck, MoreHorizontal, Copy, Info, X, Star } from 'lucide-react';
import type { ProjectMessage } from '@/features/projects/actions';
import { sendProjectMessage, recordTeamFile } from '@/features/projects/actions';
import { createClient } from '@/lib/supabase/client';

type LocalMessage = ProjectMessage & {
  status: 'uploading' | 'sending' | 'sent';
  pendingFileNames?: string[];
};

const NAME_COLORS = [
  '#60A5FA', // blue-400
  '#34D399', // emerald-400
  '#F472B6', // pink-400
  '#A78BFA', // violet-400
  '#FB923C', // orange-400
  '#38BDF8', // sky-400
  '#4ADE80', // green-400
  '#F87171', // red-400
  '#E879F9', // fuchsia-400
  '#2DD4BF', // teal-400
  '#818CF8', // indigo-400
  '#C084FC', // purple-400
  '#F43F5E', // rose-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
];

function getSenderColor(senderId: string): string {
  let hash = 0;
  for (let i = 0; i < senderId.length; i++) {
    hash = (hash * 31 + senderId.charCodeAt(i)) >>> 0;
  }
  return NAME_COLORS[hash % NAME_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const MAX_INPUT_CHARS = 2000;
const MAX_DISPLAY_LINES = 8;
const MAX_DISPLAY_CHARS = 500;

function needsTruncation(content: string): boolean {
  const lines = content.split('\n');
  if (lines.length > MAX_DISPLAY_LINES) return true;
  const visibleLen = lines.reduce((acc, line) => {
    if (line.startsWith('📎 ')) {
      const sep = line.indexOf('|||');
      return acc + (sep > 0 ? sep : line.length);
    }
    return acc + line.length;
  }, 0);
  return visibleLen > MAX_DISPLAY_CHARS;
}

function truncateContent(content: string): string {
  const lines = content.split('\n');
  let acc = 0;
  for (let i = 0; i < lines.length; i++) {
    if (i >= MAX_DISPLAY_LINES) return lines.slice(0, i).join('\n');
    const line = lines[i];
    const len = line.startsWith('📎 ')
      ? Math.max(0, line.indexOf('|||'))
      : line.length;
    acc += len;
    if (acc > MAX_DISPLAY_CHARS) return lines.slice(0, Math.max(1, i)).join('\n');
  }
  return content;
}

function renderContent(content: string, isMine: boolean) {
  const lines = content.split('\n');
  const parts = lines.map((line, i) => {
    if (line.startsWith('📎 ')) {
      const sep = line.indexOf('|||');
      if (sep > 0) {
        const name = line.slice(3, sep);
        const url = line.slice(sep + 3);
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 underline underline-offset-2 text-[0.85rem] min-w-0 max-w-full ${isMine ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <FileText size={13} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{name}</span>
          </a>
        );
      }
    }
    return <span key={i} className="block">{line || ' '}</span>;
  });
  return <>{parts}</>;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface TopMenuButton {
  id: string;
  icon: React.ReactNode;
  className: string;
  // MSI modunda hangi seçim sayısında gösterilsin (false → buton filtreden düşer)
  showWhen: (selectedCount: number) => boolean;
  // seçim tamamlandığında çalışacak işlem
  onApply: (selectedIds: Set<string>) => void;
}

interface Props {
  teamId: string;
  messages: ProjectMessage[];
  viewerId: string;
  viewerName: string;
  viewerAvatar?: string | null;
  isLeader?: boolean;
}

export function PanelChat({ teamId, messages: initialMessages, viewerId, viewerName, viewerAvatar }: Props) {
  const [messages, setMessages] = useState<LocalMessage[]>(
    initialMessages.map((m) => ({ ...m, status: 'sent' as const }))
  );
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [msiActive, setMsiActive] = useState(false);
  const [detailsMsgId, setDetailsMsgId] = useState<string | null>(null);
  const [selectedMsgIds, setSelectedMsgIds] = useState<Set<string>>(new Set());
  const [favMsgIds, setFavMsgIds] = useState<Set<string>>(new Set());
  const [expandedMsgIds, setExpandedMsgIds] = useState<Set<string>>(new Set());
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const sentMessageIds = useRef<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const longPressStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const scrollH = ta.scrollHeight;
    ta.style.height = `${Math.min(scrollH, 104)}px`;
    ta.style.overflowY = scrollH > 104 ? 'auto' : 'hidden';
  }, [text]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();

    interface ChatBroadcastPayload {
      id: string;
      sender_id: string;
      sender_name: string;
      sender_avatar: string | null;
      content: string;
      created_at: string;
    }

    const channel = supabase
      .channel(`team-chat-${teamId}`)
      .on(
        'broadcast',
        { event: 'new_message' },
        ({ payload }: { payload: ChatBroadcastPayload }) => {
          const row = payload;

          if (row.sender_id === viewerId) {
            // Text messages: server claimed the id → skip broadcast entirely
            if (sentMessageIds.current.has(row.id)) {
              sentMessageIds.current.delete(row.id);
              return;
            }
            setMessages((prev) => {
              // Same id already in state (file message in 'sending') → upgrade to 'sent'
              const sameIdx = prev.findIndex((m) => m.id === row.id);
              if (sameIdx >= 0) {
                if (prev[sameIdx].status === 'sent') return prev;
                const next = [...prev];
                next[sameIdx] = { ...next[sameIdx], content: row.content, status: 'sent' as const };
                return next;
              }
              // Realtime arrived before server response → replace 'sending' optimistic by id
              const sendingIdx = prev.findIndex((m) => m.status === 'sending');
              if (sendingIdx >= 0) {
                const next = [...prev];
                next[sendingIdx] = {
                  ...next[sendingIdx],
                  id: row.id,
                  content: row.content,
                  created_at: row.created_at,
                  status: 'sent' as const,
                  pendingFileNames: undefined,
                };
                return next;
              }
              // Realtime arrived while still 'uploading' → add as new, server will remove tempId
              return [...prev, {
                id: row.id,
                sender_id: row.sender_id,
                sender_name: row.sender_name,
                sender_avatar: row.sender_avatar,
                content: row.content,
                created_at: row.created_at,
                status: 'sent' as const,
              }];
            });
            return;
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, {
              id: row.id,
              sender_id: row.sender_id,
              sender_name: row.sender_name,
              sender_avatar: row.sender_avatar,
              content: row.content,
              created_at: row.created_at,
              status: 'sent' as const,
            }];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, viewerId]);

  useEffect(() => {
    if (!showAttachMenu) return;
    function handleOutside(e: MouseEvent) {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showAttachMenu]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (picked.length === 0) return;
    const valid = picked.filter((f) => {
      if (f.size > 20 * 1024 * 1024) { setError('Dosya boyutu en fazla 20 MB olabilir.'); return false; }
      return true;
    });
    setPendingFiles((prev) => [...prev, ...valid]);
  }

  function removePendingFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSend() {
    const content = text.trim();
    if ((!content && pendingFiles.length === 0) || isPending || uploading) return;
    setText('');
    setError(null);
    const filesToSend = pendingFiles;
    setPendingFiles([]);

    const tempId = `temp-${crypto.randomUUID()}`;
    const isFileMessage = filesToSend.length > 0;

    if (isFileMessage) {
      // File message: add optimistic with uploading state immediately
      const optimistic: LocalMessage = {
        id: tempId,
        sender_id: viewerId,
        sender_name: viewerName,
        sender_avatar: viewerAvatar ?? null,
        content,
        created_at: new Date().toISOString(),
        status: 'uploading',
        pendingFileNames: filesToSend.map((f) => f.name),
      };
      setMessages((prev) => [...prev, optimistic]);
    } else if (content) {
      // Text-only: add optimistic with sending state
      const optimistic: LocalMessage = {
        id: tempId,
        sender_id: viewerId,
        sender_name: viewerName,
        sender_avatar: viewerAvatar ?? null,
        content,
        created_at: new Date().toISOString(),
        status: 'sending',
      };
      setMessages((prev) => [...prev, optimistic]);
    }

    startTransition(async () => {
      const parts: string[] = [];

      if (isFileMessage) {
        setUploading(true);
        const supabase = createClient();
        for (const file of filesToSend) {
          const ext = file.name.split('.').pop() ?? 'bin';
          const path = `${teamId}/${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('team-files')
            .upload(path, file, { upsert: false });
          if (uploadError) { setError(`Yükleme hatası: ${uploadError.message}`); continue; }
          const { data } = supabase.storage.from('team-files').getPublicUrl(path);
          const recorded = await recordTeamFile(teamId, file.name, data.publicUrl, file.size, file.type);
          if (recorded.error) { setError(recorded.error); continue; }
          parts.push(`📎 ${file.name}|||${data.publicUrl}`);
        }
        setUploading(false);
      }

      if (content) parts.push(content);

      if (parts.length > 0) {
        const result = await sendProjectMessage(teamId, parts.join('\n'), viewerName, viewerAvatar);
        if (result.error) {
          setError(result.error);
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
        } else if (result.id) {
          if (isFileMessage) {
            // File: transition to 'sending' (1 tick); Realtime will upgrade to 'sent' (2 ticks)
            setMessages((prev) => {
              if (prev.some((m) => m.id === result.id)) {
                // Realtime arrived first → remove tempId
                return prev.filter((m) => m.id !== tempId);
              }
              return prev.map((m) =>
                m.id === tempId
                  ? { ...m, id: result.id!, content: parts.join('\n'), status: 'sending' as const, pendingFileNames: undefined }
                  : m
              );
            });
          } else {
            // Text: claim id so Realtime is skipped → go directly to 'sent' (2 ticks)
            sentMessageIds.current.add(result.id);
            setMessages((prev) => {
              if (prev.some((m) => m.id === result.id)) {
                return prev.filter((m) => m.id !== tempId);
              }
              return prev.map((m) =>
                m.id === tempId ? { ...m, id: result.id!, status: 'sent' as const } : m
              );
            });
          }
        }
      }
    });
  }

  function cancelMsi() {
    setMsiActive(false);
    setSelectedMsgIds(new Set());
    setShowTopMenu(false);
  }

  function toggleMessage(msgId: string) {
    if (!msiActive) return;
    setSelectedMsgIds((prev) => {
      const next = new Set(prev);
      if (next.has(msgId)) next.delete(msgId);
      else next.add(msgId);
      return next;
    });
  }

  function handleMsiDelete(selectedIds: Set<string>) {
    // TODO: silme action'ı eklenecek
    setMessages((prev) => prev.filter((m) => !selectedIds.has(m.id)));
    cancelMsi();
  }

  const allSelectedFaved = selectedMsgIds.size > 0 && [...selectedMsgIds].every((id) => favMsgIds.has(id));

  const topMenuButtons: TopMenuButton[] = [
    {
      id: 'fav',
      icon: <Star size={15} strokeWidth={2} fill={allSelectedFaved ? 'currentColor' : 'none'} />,
      className: allSelectedFaved
        ? 'text-amber-400 bg-slate-100'
        : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100',
      showWhen: () => true,
      onApply: (selectedIds) => {
        setFavMsgIds((prev) => {
          const next = new Set(prev);
          const allFaved = [...selectedIds].every((id) => prev.has(id));
          if (allFaved) selectedIds.forEach((id) => next.delete(id));
          else selectedIds.forEach((id) => next.add(id));
          return next;
        });
        cancelMsi();
      },
    },
    {
      id: 'delete',
      icon: <Trash2 size={15} strokeWidth={2} />,
      className: 'text-slate-400 hover:text-red-500 hover:bg-slate-100',
      showWhen: () => true,
      onApply: handleMsiDelete,
    },
    {
      id: 'details',
      icon: <Info size={15} strokeWidth={2} />,
      className: 'text-slate-400 hover:text-slate-700 hover:bg-slate-100',
      showWhen: (count) => count === 1,
      onApply: (selectedIds) => {
        setDetailsMsgId([...selectedIds][0]);
        cancelMsi();
      },
    },
    {
      id: 'copy',
      icon: <Copy size={15} strokeWidth={2} />,
      className: 'text-slate-400 hover:text-slate-700 hover:bg-slate-100',
      showWhen: (count) => count === 1,
      onApply: (selectedIds) => {
        const msgId = [...selectedIds][0];
        const msg = messages.find((m) => m.id === msgId);
        if (!msg) return;
        const text = msg.content
          .split('\n')
          .filter((line) => !line.startsWith('📎 '))
          .join('\n')
          .trim();
        navigator.clipboard.writeText(text);
        cancelMsi();
      },
    },
  ];

  function startLongPress(msgId: string, clientX: number, clientY: number) {
    longPressTriggeredRef.current = false;
    longPressStartPos.current = { x: clientX, y: clientY };
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      setMsiActive(true);
      setSelectedMsgIds(new Set([msgId]));
      setShowTopMenu(true);
    }, 1000);
  }

  function cancelLongPress() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressStartPos.current = null;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!longPressStartPos.current) return;
    const dx = e.clientX - longPressStartPos.current.x;
    const dy = e.clientY - longPressStartPos.current.y;
    if (dx * dx + dy * dy > 100) cancelLongPress();
  }

  return (
    <div id="panel-chat">
      <div
        className="bg-gray-200 border-[1.5px] border-slate-200 flex flex-col relative"
        style={{ height: 'calc(100vh - 100px)', minHeight: '430px' }}
      >
        {/* Details panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[75%] bg-white z-20 flex flex-col shadow-xl transition-transform duration-300 ${detailsMsgId ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-4 h-[35px] border-b border-slate-100 shrink-0">
            <span className="text-[0.8rem] font-semibold text-slate-600">Mesaj Ayrıntıları</span>
            <button
              onClick={() => setDetailsMsgId(null)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={15} strokeWidth={2} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {/* içerik buraya gelecek */}
          </div>
        </div>

        {/* Top bar */}
        <div id="chat-topbar" className="absolute top-0 left-0 right-0 h-[35px] bg-white z-10 flex items-center justify-between px-3">
          <div className={`flex items-center gap-1 ${msiActive ? 'w-full justify-between' : 'ml-auto'}`}>
            {msiActive && (
              <button
                onClick={cancelMsi}
                className="text-[0.75rem] text-slate-400 hover:text-slate-600 transition-colors"
              >
                İptal
              </button>
            )}
            <div className="flex items-center gap-1">
              {showTopMenu && topMenuButtons
                .filter((btn) => !msiActive || btn.showWhen(selectedMsgIds.size))
                .map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      if (msiActive) {
                        if (selectedMsgIds.size > 0) btn.onApply(selectedMsgIds);
                      } else {
                        setMsiActive(true);
                      }
                    }}
                    disabled={msiActive && selectedMsgIds.size === 0}
                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 ${btn.className}`}
                  >
                    {btn.icon}
                  </button>
                ))
              }
              {!msiActive && (
                <button
                  onClick={() => setShowTopMenu((v) => !v)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${showTopMenu ? 'text-slate-700 bg-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  <MoreHorizontal size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          id="chat-messages"
          className="flex-1 overflow-y-scroll p-4 pt-[46px] flex flex-col gap-3"
        >
          {messages.length === 0 && (
            <div className="text-center text-[0.82rem] text-slate-400 mt-8">
              Henüz mesaj yok. İlk mesajı sen gönder!
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender_id === viewerId;
            const isSelected = selectedMsgIds.has(msg.id);
            return (
              <div
                key={msg.id}
                className={`flex gap-2 items-end rounded-xl px-2 py-1 transition-colors ${isMine ? 'flex-row-reverse' : ''} ${msiActive ? 'cursor-pointer' : ''} ${isSelected ? 'bg-red-100' : ''}`}
                onClick={() => {
                  if (longPressTriggeredRef.current) {
                    longPressTriggeredRef.current = false;
                    return;
                  }
                  toggleMessage(msg.id);
                }}
                onPointerDown={(e) => startLongPress(msg.id, e.clientX, e.clientY)}
                onPointerUp={cancelLongPress}
                onPointerCancel={cancelLongPress}
                onPointerMove={handlePointerMove}
                onContextMenu={(e) => e.preventDefault()}
              >
                <Link
                  href={`/dashboard/profile/${msg.sender_id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-[30px] h-[30px] rounded-full shrink-0 hover:opacity-80 transition-opacity overflow-hidden"
                >
                  {msg.sender_avatar ? (
                    <img
                      src={msg.sender_avatar}
                      alt={msg.sender_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center font-nunito font-black text-[0.68rem] text-white">
                      {getInitials(msg.sender_name)}
                    </span>
                  )}
                </Link>
                <div className="max-w-[70%] min-w-0">
                  <div
                    className={`rounded-[12px] px-[0.9rem] py-[0.65rem] text-[0.85rem] leading-relaxed border overflow-hidden break-words min-w-0 ${
                      isMine
                        ? 'bg-gray-600 text-white border-gray-600'
                        : 'bg-slate-100 text-slate-900 border-slate-300'
                    }`}
                  >
                    <Link
                      href={`/dashboard/profile/${msg.sender_id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: getSenderColor(msg.sender_id) }}
                      className={`text-[0.7rem] font-semibold mb-1 hover:opacity-75 transition-opacity block ${isMine ? 'text-right' : ''}`}
                    >
                      {msg.sender_name}
                    </Link>
                    {msg.status === 'uploading' ? (
                      <div className="flex flex-col gap-1.5 min-w-[140px]">
                        {msg.pendingFileNames?.map((name, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <FileText size={13} strokeWidth={2} className="shrink-0 opacity-70" />
                            <span className="text-[0.82rem] truncate max-w-[160px]">{name}</span>
                          </div>
                        ))}
                        {msg.content && <span className="block text-[0.85rem]">{msg.content}</span>}
                        <div className="h-1 rounded-full overflow-hidden bg-white/20 mt-0.5">
                          <div className="h-full w-full rounded-full bg-white/60 animate-pulse" />
                        </div>
                      </div>
                    ) : (() => {
                      const isExpanded = expandedMsgIds.has(msg.id);
                      const truncate = !isExpanded && needsTruncation(msg.content);
                      return (
                        <>
                          {renderContent(truncate ? truncateContent(msg.content) : msg.content, isMine)}
                          {truncate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedMsgIds((prev) => new Set([...prev, msg.id]));
                              }}
                              className={`text-[0.75rem] mt-1 font-semibold hover:underline block ${isMine ? 'text-blue-200' : 'text-blue-500'}`}
                            >
                              ...devamını gör
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : ''}`}>
                    <span className="text-[0.65rem] text-slate-400">{formatTime(msg.created_at)}</span>
                    {isMine && msg.status !== 'uploading' && (
                      <span className="text-slate-400">
                        {msg.status === 'sending'
                          ? <Check size={13} strokeWidth={2.5} />
                          : <CheckCheck size={13} strokeWidth={2.5} />
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Pending files preview */}
        {pendingFiles.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex flex-col gap-1">
            {pendingFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-2">
                <FileText size={13} strokeWidth={2} className="text-slate-400 shrink-0" />
                <span className="text-[0.8rem] text-slate-700 flex-1 truncate">{file.name}</span>
                <button
                  onClick={() => removePendingFile(i)}
                  className="text-slate-300 hover:text-red-500 transition-colors text-[0.75rem] shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          id="chat-input-wrap"
          className="bg-white border-t border-slate-200 px-4 py-[0.8rem] flex flex-col gap-1.5"
        >
          {error && (
            <p className="text-[0.75rem] text-red-500">{error}</p>
          )}
          {text.length >= MAX_INPUT_CHARS - 200 && (
            <p className={`text-[0.72rem] text-right ${text.length >= MAX_INPUT_CHARS ? 'text-red-500' : 'text-slate-400'}`}>
              {text.length} / {MAX_INPUT_CHARS}
            </p>
          )}
          <div className="flex gap-2 items-end">
            <div className="relative shrink-0" ref={attachMenuRef}>
              {showAttachMenu && (
                <div className="absolute bottom-[calc(100%+8px)] left-0 bg-white border border-slate-200 rounded-[10px] shadow-lg overflow-hidden z-20 min-w-[140px]">
                  <button
                    onClick={() => { setShowAttachMenu(false); fileInputRef.current?.click(); }}
                    className="w-full flex items-center gap-2 px-4 py-[0.6rem] text-[0.82rem] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <FileText size={14} strokeWidth={2} />
                    Dosya Yükle
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowAttachMenu((v) => !v)}
                disabled={uploading || isPending}
                className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
              >
                <Paperclip size={20} strokeWidth={2} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <textarea
              ref={textareaRef}
              rows={1}
              maxLength={MAX_INPUT_CHARS}
              className="flex-1 border-[1.5px] border-slate-200 rounded-[10px] px-4 py-[0.65rem] font-[inherit] text-[0.88rem] outline-none transition-colors bg-slate-50 focus:border-blue-600 focus:bg-white resize-none overflow-hidden leading-relaxed"
              placeholder="Mesaj yaz..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={isPending || uploading || (!text.trim() && pendingFiles.length === 0)}
              className="bg-blue-600 text-white border-none rounded-[10px] w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
            >
              <Send size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
