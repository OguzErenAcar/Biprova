"use client";

interface MessageProps {
  avatar: { initials: string; gradient: string } | null;
  sender?: string;
  time?: string;
  text: string;
  self?: boolean;
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-[0.7rem] my-[0.3rem]">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-[0.67rem] font-bold text-slate-300 whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function MessageGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-[0.2rem]">{children}</div>;
}

function Message({ avatar, sender, time, text, self }: MessageProps) {
  return (
    <div className={`flex gap-[0.55rem] items-start ${self ? "flex-row-reverse" : ""}`}>
      {avatar ? (
        <div
          className={`w-[27px] h-[27px] rounded-full flex items-center justify-center font-nunito font-black text-[0.65rem] text-white shrink-0 mt-0.5 bg-gradient-to-br ${avatar.gradient}`}
        >
          {avatar.initials}
        </div>
      ) : (
        <div className="w-[27px] h-[27px] shrink-0" />
      )}
      <div className={`max-w-[68%] flex flex-col gap-[0.15rem] ${self ? "items-end" : ""}`}>
        {sender && time && (
          <div
            className={`text-[0.66rem] text-slate-300 flex items-center gap-[0.3rem] mb-[0.06rem] ${
              self ? "justify-end" : ""
            }`}
          >
            <span className="font-bold text-slate-400">{sender}</span>
            <span>{time}</span>
          </div>
        )}
        <div
          className={`border rounded-[13px] px-[0.78rem] py-[0.52rem] text-[0.84rem] leading-[1.55] break-words ${
            self
              ? "bg-blue-600 text-white border-blue-600 rounded-tr-[4px]"
              : "bg-white border-slate-200 text-slate-900 rounded-tl-[4px]"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export function ChatPanel() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-[1.4rem] py-[1.2rem] flex flex-col gap-[0.9rem]">
        <DateDivider label="24 Mart 2026" />

        <div className="text-center text-[0.7rem] text-slate-400 bg-white/65 border border-slate-200 rounded-[20px] py-[0.26rem] px-[0.8rem] self-center">
          🎉 Ekip kuruldu — tüm roller dolu!
        </div>

        <MessageGroup>
          <Message
            avatar={{ initials: "ZK", gradient: "from-blue-600 to-indigo-500" }}
            sender="Zeynep K."
            time="14:02"
            text="Merhaba ekip! Hepinize hoş geldiniz 🙌 Harika bir takım olduk."
          />
          <Message
            avatar={null}
            text="Kickoff toplantısı için yarın akşam 20:00 uygun mu? Google Meet üzerinden yapabiliriz."
          />
        </MessageGroup>

        <MessageGroup>
          <Message
            avatar={{ initials: "AY", gradient: "from-violet-700 to-pink-500" }}
            sender="Ali Y."
            time="14:08"
            text="Benim için uygun! Backend tarafında iskelet hazır, paylaşabilirim."
          />
        </MessageGroup>

        <MessageGroup>
          <Message
            avatar={{ initials: "MB", gradient: "from-amber-500 to-red-500" }}
            sender="Merve B."
            time="14:11"
            text="Ben de katılabilirim 👍 Figma'da wireframe'ler çizmeye başladım."
          />
        </MessageGroup>

        <MessageGroup>
          <Message
            avatar={{ initials: "SK", gradient: "from-cyan-600 to-green-500" }}
            sender="Sen"
            time="14:15"
            text="Harika! Expo mu gidiyoruz?"
            self
          />
        </MessageGroup>

        <MessageGroup>
          <Message
            avatar={{ initials: "ZK", gradient: "from-blue-600 to-indigo-500" }}
            sender="Zeynep K."
            time="14:18"
            text="Evet, Expo tercih ederim — daha hızlı iterasyon 🚀"
          />
        </MessageGroup>

        <DateDivider label="Bugün" />

        <MessageGroup>
          <Message
            avatar={{ initials: "AY", gradient: "from-violet-700 to-pink-500" }}
            sender="Ali Y."
            time="09:30"
            text="GitHub repo açtım — herkesi invite ettim."
          />
        </MessageGroup>

        <MessageGroup>
          <Message
            avatar={{ initials: "SK", gradient: "from-cyan-600 to-green-500" }}
            sender="Sen"
            time="09:45"
            text="Aldım, teşekkürler! Akşama kadar navigation yapısını çıkarayım."
            self
          />
        </MessageGroup>
      </div>

      <div className="bg-white border-t border-slate-200 px-[1.4rem] py-[0.8rem] shrink-0">
        <div className="flex items-center gap-[0.55rem] bg-slate-50 border-[1.5px] border-slate-200 rounded-[13px] px-[0.65rem] py-[0.45rem] focus-within:border-blue-600 focus-within:bg-white transition-colors">
          <input
            type="text"
            placeholder="Mesaj yaz..."
            className="flex-1 bg-transparent border-none outline-none font-['Plus_Jakarta_Sans'] text-[0.875rem] text-slate-900 placeholder:text-slate-300"
          />
          <button className="w-[29px] h-[29px] bg-blue-600 border-none rounded-[8px] flex items-center justify-center text-[0.88rem] cursor-pointer text-white shrink-0 transition-all hover:bg-blue-700 hover:scale-105">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
