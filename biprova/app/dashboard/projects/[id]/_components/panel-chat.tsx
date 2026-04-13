"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
import { Paperclip, Send, Trash2 } from 'lucide-react';
import type { ProjectMessage } from '@/features/projects/actions';
import { sendProjectMessage } from '@/features/projects/actions';
import { createClient } from '@/lib/supabase/client';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface Props {
  teamId: string;
  messages: ProjectMessage[];
  viewerId: string;
  viewerName: string;
}

export function PanelChat({ teamId, messages: initialMessages, viewerId, viewerName }: Props) {
  const [messages, setMessages] = useState<ProjectMessage[]>(initialMessages);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedMsgIds, setSelectedMsgIds] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();

    interface ChatBroadcastPayload {
      id: string;
      sender_id: string;
      sender_name: string;
      content: string;
      created_at: string;
    }

    const channel = supabase
      .channel(`team-chat-${teamId}`)
      .on<ChatBroadcastPayload>(
        'broadcast',
        { event: 'new_message' },
        ({ payload: row }) => {
          setMessages((prev) => [
            ...prev,
            {
              id: row.id,
              sender_id: row.sender_id,
              sender_name: row.sender_name,
              sender_avatar: null,
              content: row.content,
              created_at: row.created_at,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  function handleSend() {
    if (!text.trim() || isPending) return;
    const content = text.trim();
    setText('');
    setError(null);
    startTransition(async () => {
      const result = await sendProjectMessage(teamId, content, viewerName);
      if (result.error) {
        setText(content);
        setError(result.error);
      }
    });
  }

  function handlePressStart(msgId: string) {
    pressTimerRef.current = setTimeout(() => {
      setSelectedMsgIds((prev) => {
        const next = new Set(prev);
        next.add(msgId);
        return next;
      });
    }, 2000);
  }

  function handlePressEnd() {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }

  return (
    <div id="panel-chat">
      <div
        className="bg-gray-200 border-[1.5px] border-slate-200 flex flex-col relative"
        style={{ height: 'calc(100vh - 100px)', minHeight: '430px' }}
      >
        {/* Top bar */}
        <div id="chat-topbar" className="absolute top-0 left-0 right-0 h-[35px] bg-white z-10 flex items-center px-3">
          {selectedMsgIds.size > 0 && (
            <button
              onClick={() => setSelectedMsgIds(new Set())}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} strokeWidth={2} />
              <span className="text-[0.75rem] font-semibold">Sil ({selectedMsgIds.size})</span>
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          id="chat-messages"
          className="flex-1 overflow-y-scroll p-4 pt-[46px] flex flex-col gap-3"
          onClick={() => setSelectedMsgIds(new Set())}
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
                className={`flex gap-2 items-start ${isMine ? 'flex-row-reverse' : ''}`}
                onMouseDown={(e) => { e.stopPropagation(); handlePressStart(msg.id); }}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={(e) => { e.stopPropagation(); handlePressStart(msg.id); }}
                onTouchEnd={handlePressEnd}
              >
                <div className="w-[30px] h-[30px] rounded-full bg-blue-500 flex items-center justify-center font-nunito font-black text-[0.68rem] text-white shrink-0">
                  {getInitials(msg.sender_name)}
                </div>
                <div className="max-w-[70%]">
                  <div className={`text-[0.7rem] text-slate-400 mb-0.5 ${isMine ? 'text-right' : ''}`}>
                    {msg.sender_name}
                  </div>
                  <div
                    className={`rounded-[12px] px-[0.9rem] py-[0.65rem] text-[0.85rem] leading-relaxed border transition-opacity ${
                      isSelected ? 'opacity-50' : ''
                    } ${
                      isMine
                        ? 'bg-green-200 text-black border-green-300'
                        : 'bg-slate-100 text-slate-900 border-slate-300'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className={`text-[0.65rem] text-slate-400 mt-0.5 ${isMine ? 'text-right' : ''}`}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          id="chat-input-wrap"
          className="bg-white border-t border-slate-200 px-4 py-[0.8rem] flex flex-col gap-1.5"
        >
          {error && (
            <p className="text-[0.75rem] text-red-500">{error}</p>
          )}
          <div className="flex gap-2 items-center">
            <button className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
              <Paperclip size={20} strokeWidth={2} />
            </button>
            <input
              className="flex-1 border-[1.5px] border-slate-200 rounded-[10px] px-4 py-[0.65rem] font-[inherit] text-[0.88rem] outline-none transition-colors bg-slate-50 focus:border-blue-600 focus:bg-white"
              placeholder="Mesaj yaz..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button
              onClick={handleSend}
              disabled={isPending || !text.trim()}
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
