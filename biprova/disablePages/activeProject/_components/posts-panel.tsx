"use client";

interface PostCardProps {
  date: string;
  body: string;
  likes: number;
  comments: number;
}

function PostCard({ date, body, likes, comments }: PostCardProps) {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-[13px] p-[0.95rem_1.1rem] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex items-center gap-[0.55rem] mb-[0.6rem]">
        <div className="w-[30px] h-[30px] rounded-[8px] bg-gradient-to-br from-blue-700 to-indigo-500 flex items-center justify-center text-[0.85rem] shrink-0">
          📱
        </div>
        <div>
          <div className="text-[0.78rem] font-bold text-slate-900">Sokak Hayvanları Takip Ekibi</div>
        </div>
        <div className="text-[0.68rem] text-slate-300 ml-auto">{date}</div>
      </div>
      <div className="text-[0.84rem] text-slate-900 leading-[1.6] mb-[0.65rem]">{body}</div>
      <div className="flex gap-[0.9rem] text-[0.73rem] font-bold text-slate-400">
        <span className="flex items-center gap-[0.28rem] cursor-pointer hover:text-blue-600">❤️ {likes}</span>
        <span className="flex items-center gap-[0.28rem] cursor-pointer hover:text-blue-600">💬 {comments} yorum</span>
        <span className="flex items-center gap-[0.28rem] cursor-pointer hover:text-blue-600">↗️ Paylaş</span>
      </div>
    </div>
  );
}

export function PostsPanel() {
  return (
    <div id="posts-panel" className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-[1.4rem] py-[0.85rem] flex items-center justify-between shrink-0">
        <div className="font-nunito font-black text-[0.95rem]">Ekip Gönderileri</div>
        <button className="bg-blue-600 text-white border-none rounded-[9px] py-[0.42rem] px-[0.85rem] font-['Plus_Jakarta_Sans'] font-bold text-[0.78rem] cursor-pointer flex items-center gap-[0.3rem] hover:bg-blue-700 transition-colors">
          ✏️ Yeni Gönderi
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-[1.4rem] py-[1.2rem] flex flex-col gap-4">
        <div className="bg-white border-[1.5px] border-blue-600 rounded-[14px] p-[1rem_1.15rem] mb-1">
          <div className="font-nunito font-black text-[0.88rem] mb-[0.7rem] text-slate-900 flex items-center gap-[0.4rem]">
            📢 Yeni Gönderi Paylaş
          </div>
          <textarea
            className="w-full bg-slate-50 border-[1.5px] border-slate-200 rounded-[10px] px-[0.8rem] py-[0.6rem] font-['Plus_Jakarta_Sans'] text-[0.84rem] text-slate-900 resize-none outline-none min-h-[76px] transition-colors focus:border-blue-600 focus:bg-white placeholder:text-slate-300 block box-border"
            placeholder="Ekip adına bir güncelleme paylaş — sprint tamamlandı, ilerleme göster, duyuru yap..."
          />
          <div className="flex items-center justify-between mt-[0.7rem]">
            <div className="text-[0.7rem] text-slate-300">
              Feed&apos;de{" "}
              <span className="text-blue-600 font-semibold">Sokak Hayvanları Takip Ekibi</span>{" "}
              adına görünür
            </div>
            <button className="bg-blue-600 text-white border-none rounded-[8px] py-[0.42rem] px-[0.9rem] font-bold text-[0.78rem] cursor-pointer hover:bg-blue-700 transition-colors">
              Yayınla
            </button>
          </div>
        </div>

        <PostCard
          date="2 gün önce"
          body="İlk sprint'i tamamladık! 🎉 Harita entegrasyonu çalışıyor, mama noktası ekleme akışı tamamlandı."
          likes={24}
          comments={7}
        />
        <PostCard
          date="5 gün önce"
          body="Kickoff toplantımızı yaptık. Stack: Expo + Node.js + PostGIS. Hedef: 6 haftada beta 🚀"
          likes={41}
          comments={12}
        />
      </div>
    </div>
  );
}
