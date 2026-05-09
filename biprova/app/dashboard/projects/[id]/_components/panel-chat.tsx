"use client";

import Link from 'next/link';
import { useState, useTransition, useRef, useEffect } from 'react';
import { Paperclip, FileText, Send, Trash2, Check, CheckCheck, MoreHorizontal, Copy, Info, X, Star, Reply, ChevronDown } from 'lucide-react';
import type { ProjectMessage, MessageReader } from '@/features/projects/actions';
import { sendProjectMessage, recordTeamFile, deleteProjectMessage, toggleMessageFavorite, markMessagesRead, getMessageReaders, getTeamMessages, getOlderMessages } from '@/features/projects/actions';
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
  projectName: string;
  messages: ProjectMessage[];
  viewerId: string;
  viewerName: string;
  viewerAvatar?: string | null;
  isLeader?: boolean;
}

export function PanelChat({ teamId, projectName, messages: initialMessages, viewerId, viewerName, viewerAvatar }: Props) {
  const [messages, setMessages] = useState<LocalMessage[]>(
    initialMessages.map((m) => ({ ...m, status: 'sent' as const }))
  );
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [msiActive, setMsiActive] = useState(false);
  const [detailsMsgId, setDetailsMsgId] = useState<string | null>(null);
  const [selectedMsgIds, setSelectedMsgIds] = useState<Set<string>>(new Set());
  const [favMsgIds, setFavMsgIds] = useState<Set<string>>(
    new Set(initialMessages.filter((m) => m.is_favorited).map((m) => m.id))
  );
  const [readers, setReaders] = useState<MessageReader[]>([]);
  const [readersLoading, setReadersLoading] = useState(false);
  const [expandedMsgIds, setExpandedMsgIds] = useState<Set<string>>(new Set());
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showFavPanel, setShowFavPanel] = useState(false);
  const [expandedFavIds, setExpandedFavIds] = useState<Set<string>>(new Set());
  const [replyToMsg, setReplyToMsg] = useState<LocalMessage | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const [pullUp, setPullUp] = useState(0);
  const pullStartY = useRef(0);
  const pullActive = useRef(false);
  const [hasMore, setHasMore] = useState(initialMessages.length >= 30);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollHeightRef = useRef(0);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sentMessageIds = useRef<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const longPressStartPos = useRef<{ x: number; y: number } | null>(null);
  const lastMarkedRef = useRef<string | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

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
    const el = chatContainerRef.current;
    if (!el) return;
    const onScroll = async () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 120);

      if (el.scrollTop <= 0) {
        setHasMore((currentHasMore) => {
          if (!currentHasMore) return currentHasMore;
          setLoadingMore((currentLoading) => {
            if (currentLoading) return currentLoading;
            setMessages((currentMsgs) => {
              const oldest = currentMsgs[0];
              if (!oldest) return currentMsgs;
              scrollHeightRef.current = el.scrollHeight;
              getOlderMessages(teamId, oldest.created_at).then((older) => {
                if (older.length === 0) {
                  setHasMore(false);
                } else {
                  setMessages((prev) => {
                    const existingIds = new Set(prev.map((m) => m.id));
                    const fresh = older.filter((m) => !existingIds.has(m.id));
                    return [...fresh.map((m) => ({ ...m, status: 'sent' as const })), ...prev];
                  });
                  if (older.length < 30) setHasMore(false);
                  requestAnimationFrame(() => {
                    el.scrollTop = el.scrollHeight - scrollHeightRef.current;
                  });
                }
                setLoadingMore(false);
              });
              return currentMsgs;
            });
            return true;
          });
          return currentHasMore;
        });
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [teamId]);

  useEffect(() => {
    const supabase = createClient();

    interface ChatBroadcastPayload {
      id: string;
      sender_id: string;
      sender_name: string;
      sender_avatar: string | null;
      content: string;
      created_at: string;
      reply_to_id: string | null;
      reply_to_sender_name: string | null;
      reply_to_content: string | null;
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
                deleted_at: null,
                is_favorited: false,
                reply_to_id: row.reply_to_id,
                reply_to_sender_name: row.reply_to_sender_name,
                reply_to_content: row.reply_to_content,
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
              deleted_at: null,
              is_favorited: false,
              reply_to_id: row.reply_to_id,
              reply_to_sender_name: row.reply_to_sender_name,
              reply_to_content: row.reply_to_content,
              status: 'sent' as const,
            }];
          });
        }
      )
      .on(
        'broadcast',
        { event: 'delete_message' },
        ({ payload }: { payload: { message_id: string } }) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === payload.message_id
                ? { ...m, deleted_at: new Date().toISOString() }
                : m
            )
          );
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const uniqueIds = new Set(
          Object.values(state).flat().map((p) => (p as { user_id: string }).user_id)
        );
        setOnlineCount(uniqueIds.size);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: viewerId });
        }
      });

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

  useEffect(() => {
    const sent = messages.filter((m) => m.status === 'sent');
    const lastMsg = sent[sent.length - 1];
    if (!lastMsg || lastMsg.id === lastMarkedRef.current) return;
    lastMarkedRef.current = lastMsg.id;
    markMessagesRead(teamId, lastMsg.id);
  }, [messages, teamId]);

  useEffect(() => {
    if (!detailsMsgId) { setReaders([]); return; }
    const msg = messagesRef.current.find((m) => m.id === detailsMsgId);
    if (!msg) return;
    setReadersLoading(true);
    getMessageReaders(teamId, msg.created_at, msg.sender_id).then((result) => {
      setReaders(result);
      setReadersLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsMsgId, teamId]);

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
    const replyId = replyToMsg?.id ?? null;
    const replyName = replyToMsg?.sender_name ?? null;
    const replyContent = replyToMsg?.content ?? null;
    setReplyToMsg(null);

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
        deleted_at: null,
        is_favorited: false,
        reply_to_id: replyId,
        reply_to_sender_name: replyName,
        reply_to_content: replyContent,
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
        deleted_at: null,
        is_favorited: false,
        reply_to_id: replyId,
        reply_to_sender_name: replyName,
        reply_to_content: replyContent,
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
        const result = await sendProjectMessage(teamId, parts.join('\n'), viewerName, viewerAvatar, replyId);
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
    const deletedAt = new Date().toISOString();
    setMessages((prev) =>
      prev.map((m) => selectedIds.has(m.id) ? { ...m, deleted_at: deletedAt } : m)
    );
    cancelMsi();
    selectedIds.forEach((id) => {
      deleteProjectMessage(teamId, id);
    });
  }

  const allSelectedFaved = selectedMsgIds.size > 0 && [...selectedMsgIds].every((id) => favMsgIds.has(id));
  const allSelectedAreMine = selectedMsgIds.size > 0 && [...selectedMsgIds].every((id) => {
    const msg = messages.find((m) => m.id === id);
    return msg?.sender_id === viewerId;
  });

  const topMenuButtons: TopMenuButton[] = [
    {
      id: 'reply',
      icon: <Reply size={15} strokeWidth={2} />,
      className: 'text-slate-400 hover:text-blue-500 hover:bg-slate-100',
      showWhen: (count) => count === 1,
      onApply: (selectedIds) => {
        const msg = messages.find((m) => m.id === [...selectedIds][0]);
        if (msg && !msg.deleted_at) setReplyToMsg(msg);
        cancelMsi();
      },
    },
    {
      id: 'fav',
      icon: <Star size={15} strokeWidth={2} fill={allSelectedFaved ? 'currentColor' : 'none'} />,
      className: allSelectedFaved
        ? 'text-amber-400 bg-slate-100'
        : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100',
      showWhen: () => true,
      onApply: (selectedIds) => {
        const allFaved = [...selectedIds].every((id) => favMsgIds.has(id));
        setFavMsgIds((prev) => {
          const next = new Set(prev);
          if (allFaved) selectedIds.forEach((id) => next.delete(id));
          else selectedIds.forEach((id) => next.add(id));
          return next;
        });
        selectedIds.forEach((id) => {
          if (allFaved) toggleMessageFavorite(id, true);
          else if (!favMsgIds.has(id)) toggleMessageFavorite(id, false);
        });
        cancelMsi();
      },
    },
    {
      id: 'delete',
      icon: <Trash2 size={15} strokeWidth={2} />,
      className: 'text-slate-400 hover:text-red-500 hover:bg-slate-100',
      showWhen: () => allSelectedAreMine,
      onApply: handleMsiDelete,
    },
    {
      id: 'details',
      icon: <Info size={15} strokeWidth={2} />,
      className: 'text-slate-400 hover:text-slate-700 hover:bg-slate-100',
      showWhen: (count) => {
        if (count !== 1) return false;
        const [id] = selectedMsgIds;
        return messages.find((m) => m.id === id)?.sender_id === viewerId;
      },
      onApply: (selectedIds) => {
        setDetailsMsgId([...selectedIds][0]);
        setShowFavPanel(false);
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
        className="bg-gray-200 border-[1.5px] border-slate-200 flex flex-col relative overflow-hidden"
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
            {detailsMsgId && (() => {
              const msg = messages.find((m) => m.id === detailsMsgId);
              if (!msg) return null;
              const textLines = msg.content.split('\n').filter((l) => !l.startsWith('📎 '));
              const hasFiles = msg.content.split('\n').some((l) => l.startsWith('📎 '));
              const preview = msg.deleted_at
                ? 'bu mesaj silindi'
                : textLines.join('\n').trim() || (hasFiles ? '📎 Dosya' : '');
              return (
                <div className="flex flex-col gap-5">
                  {/* Mesaj önizlemesi */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <span className="block text-[0.7rem] font-semibold text-slate-400 mb-1">{msg.sender_name}</span>
                    <span className={`text-[0.82rem] line-clamp-4 ${msg.deleted_at ? 'italic text-slate-400' : 'text-slate-700'}`}>
                      {preview}
                    </span>
                  </div>
                  {/* Görüldü listesi */}
                  <div>
                    <span className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-wide">Görüldü</span>
                    {readersLoading ? (
                      <p className="text-[0.8rem] text-slate-400 mt-2">Yükleniyor...</p>
                    ) : readers.length === 0 ? (
                      <p className="text-[0.8rem] text-slate-400 mt-2">Henüz görülmedi</p>
                    ) : (
                      <div className="flex flex-col gap-2 mt-2">
                        {readers.map((r) => (
                          <div key={r.user_id} className="flex items-center gap-2">
                            {r.avatar_url ? (
                              <img src={r.avatar_url} alt={r.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                            ) : (
                              <span className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0">
                                {getInitials(r.name)}
                              </span>
                            )}
                            <span className="text-[0.82rem] text-slate-700 flex-1 truncate">{r.name}</span>
                            <span className="text-[0.65rem] text-slate-400 shrink-0">{formatTime(r.read_at)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Favorites panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[75%] bg-white z-20 flex flex-col shadow-xl transition-transform duration-300 ${showFavPanel ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-4 h-[35px] border-b border-slate-100 shrink-0">
            <span className="text-[0.8rem] font-semibold text-slate-600">Favori Mesajlar</span>
            <button
              onClick={() => setShowFavPanel(false)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={15} strokeWidth={2} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {(() => {
              const favMessages = messages.filter((m) => favMsgIds.has(m.id));
              if (favMessages.length === 0) {
                return <p className="text-[0.8rem] text-slate-400 mt-2">Henüz favori mesaj yok</p>;
              }
              return (
                <div className="flex flex-col gap-2">
                  {favMessages.map((m) => {
                    const textLines = m.content.split('\n').filter((l) => !l.startsWith('📎 '));
                    const hasFiles = m.content.split('\n').some((l) => l.startsWith('📎 '));
                    const preview = m.deleted_at
                      ? 'bu mesaj silindi'
                      : textLines.join('\n').trim() || (hasFiles ? '📎 Dosya' : '');
                    const isExpanded = expandedFavIds.has(m.id);
                    const truncate = !m.deleted_at && !isExpanded && needsTruncation(m.content);
                    const displayText = truncate ? truncateContent(preview) : preview;
                    return (
                      <div key={m.id} className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                        <button
                          onClick={() => {
                            setShowFavPanel(false);
                            setTimeout(() => {
                              document.getElementById(`msg-${m.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 320);
                          }}
                          className="w-full text-left p-3 hover:bg-amber-50 hover:border-amber-200 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[0.7rem] font-semibold text-slate-400">{m.sender_name}</span>
                            <span className="text-[0.65rem] text-slate-400">{formatTime(m.created_at)}</span>
                          </div>
                          <span className={`text-[0.82rem] ${m.deleted_at ? 'italic text-slate-400' : 'text-slate-700'}`}>
                            {displayText}
                          </span>
                        </button>
                        {truncate && (
                          <button
                            onClick={() => setExpandedFavIds((prev) => new Set([...prev, m.id]))}
                            className="w-full text-left px-3 pb-2 text-[0.75rem] font-semibold text-blue-500 hover:underline"
                          >
                            ...devamını oku
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Top bar */}
        <div id="chat-topbar" className="absolute top-0 left-0 right-0 h-[35px] bg-white z-10 flex items-center justify-between px-3">
          {!msiActive && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[0.75rem] font-semibold text-slate-700 truncate">{projectName}</span>
              <span className="text-[0.65rem] text-slate-400">
                {onlineCount > 0 ? `${onlineCount} çevrimiçi` : 'Grup'}
              </span>
            </div>
          )}
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
                <>
                  <button
                    onClick={() => { setShowFavPanel((v) => !v); setDetailsMsgId(null); }}
                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${showFavPanel ? 'text-amber-400 bg-slate-100' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100'}`}
                  >
                    <Star size={15} strokeWidth={2} fill={showFavPanel ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => setShowTopMenu((v) => !v)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${showTopMenu ? 'text-slate-700 bg-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                  >
                    <MoreHorizontal size={16} strokeWidth={2} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          id="chat-messages"
          ref={chatContainerRef}
          className="flex-1 overflow-y-scroll p-4 pt-[46px] flex flex-col gap-3"
          onTouchStart={(e) => {
            const el = chatContainerRef.current;
            if (!el) return;
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
            if (atBottom) {
              pullStartY.current = e.touches[0].clientY;
              pullActive.current = true;
            }
          }}
          onTouchMove={(e) => {
            if (!pullActive.current) return;
            const delta = pullStartY.current - e.touches[0].clientY;
            if (delta > 0) setPullUp(Math.min(delta, 72));
          }}
          onTouchEnd={async () => {
            if (!pullActive.current) return;
            pullActive.current = false;
            if (pullUp >= 60 && !pullRefreshing) {
              setPullUp(0);
              setPullRefreshing(true);
              const fresh = await getTeamMessages(teamId);
              setMessages(fresh.map((m) => ({ ...m, status: 'sent' as const })));
              setPullRefreshing(false);
            } else {
              setPullUp(0);
            }
          }}
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
                id={`msg-${msg.id}`}
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
                    {msg.reply_to_id && (
                      <div onClick={() => document.getElementById(`msg-${msg.reply_to_id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className={`border-l-2 rounded-sm px-2 py-1 mb-1.5 cursor-pointer ${isMine ? 'border-white/40 bg-white/10 hover:bg-white/20' : 'border-blue-400 bg-slate-200/70 hover:bg-slate-300/70'}`}>
                        <span className={`text-[0.68rem] font-semibold block truncate ${isMine ? 'text-white/70' : 'text-blue-500'}`}>
                          {msg.reply_to_sender_name ?? ''}
                        </span>
                        <span className={`text-[0.78rem] line-clamp-2 block ${isMine ? 'text-white/60' : 'text-slate-500'}`}>
                          {(() => { const t = msg.reply_to_content ?? ''; return t.length > 80 ? t.slice(0, 80) + '…' : t; })()}
                        </span>
                      </div>
                    )}
                    {msg.deleted_at ? (
                      <span className={`text-[0.82rem] italic ${isMine ? 'text-white/50' : 'text-slate-400'}`}>
                        bu mesaj silindi
                      </span>
                    ) : msg.status === 'uploading' ? (
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
                    {favMsgIds.has(msg.id) && (
                      <Star size={10} strokeWidth={2} fill="currentColor" className="text-amber-400 shrink-0" />
                    )}
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
          {(pullUp > 0 || pullRefreshing) && (
            <div className="flex items-center justify-center py-1" style={{ height: pullRefreshing ? 32 : pullUp * 0.45 }}>
              <div className={`w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent ${pullRefreshing ? 'animate-spin' : ''}`} />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showScrollBtn && (
          <button
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute bottom-[90px] right-4 z-30 bg-white border border-slate-200 shadow-md rounded-full w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-300 transition-colors"
          >
            <ChevronDown size={16} strokeWidth={2} />
          </button>
        )}

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
          {replyToMsg && (
            <div className="flex items-start gap-2 border-l-2 border-blue-500 pl-2 py-0.5 bg-blue-50 rounded-r-md">
              <div className="flex-1 min-w-0">
                <span className="text-[0.7rem] font-semibold text-blue-500 block">{replyToMsg.sender_name}</span>
                <span className="text-[0.75rem] text-slate-500 truncate block">
                  {(() => { const t = replyToMsg.content.split('\n').filter((l) => !l.startsWith('📎 ')).join(' ').trim() || '📎 Dosya'; return t.length > 80 ? t.slice(0, 80) + '…' : t; })()}
                </span>
              </div>
              <button onClick={() => setReplyToMsg(null)} className="shrink-0 text-slate-400 hover:text-slate-600">
                <X size={13} strokeWidth={2} />
              </button>
            </div>
          )}
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
