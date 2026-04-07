"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectMessage } from '@/features/projects/actions';
import { sendProjectMessage } from '@/features/projects/actions';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
}

export function PanelChat({ teamId, messages, viewerId }: Props) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!text.trim() || isPending) return;
    const content = text.trim();
    setText('');
    startTransition(async () => {
      await sendProjectMessage(teamId, content);
      router.refresh();
    });
  }

  return (
    <div id="panel-chat">
      <Card
        className="overflow-hidden flex flex-col"
        style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}
      >
        {/* Messages */}
        <div
          id="chat-messages"
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
        >
          {messages.length === 0 && (
            <div className="text-center text-caption text-ink-subtle mt-8">
              Henüz mesaj yok. İlk mesajı sen gönder!
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender_id === viewerId;
            return (
              <div
                key={msg.id}
                className={`flex gap-2 items-start ${isMine ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-[30px] h-[30px] shrink-0">
                  <AvatarFallback className="bg-brand font-nunito font-black text-label text-white">
                    {getInitials(msg.sender_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[70%]">
                  <div className={`text-label text-ink-subtle mb-0.5 ${isMine ? 'text-right' : ''}`}>
                    {msg.sender_name}
                  </div>
                  <div
                    className={`rounded-[12px] px-[0.9rem] py-[0.65rem] text-body leading-relaxed border ${
                      isMine
                        ? 'bg-brand text-white border-brand'
                        : 'bg-slate-100 text-ink border-edge'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className={`text-label text-ink-subtle mt-0.5 ${isMine ? 'text-right' : ''}`}>
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
          className="border-t border-edge px-4 py-[0.8rem] flex gap-2 items-center"
        >
          <Input
            className="flex-1 rounded-[10px] text-body bg-canvas focus-visible:bg-canvas"
            placeholder="Mesaj yaz..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isPending || !text.trim()}
            className="rounded-[10px] shrink-0"
          >
            →
          </Button>
        </div>
      </Card>
    </div>
  );
}
