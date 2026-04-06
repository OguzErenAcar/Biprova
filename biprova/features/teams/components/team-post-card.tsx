type TagType = "update" | "milestone" | "announcement" | "city" | "category";

interface Tag {
  type: TagType;
  label: string;
}

interface Member {
  initials: string;
  name: string;
  color: string;
}

interface TeamPostCardProps {
  postId?: string;
  teamEmoji: string;
  teamAvatarBg: string;
  teamName: string;
  location: string;
  memberCount: number;
  postedAt: string;
  tags: Tag[];
  title: string;
  body: string;
  hasImage?: boolean;
  imageUrls?: string[];
  members: Member[];
  likes: number;
  comments: number;
  liked?: boolean;
  isOwnTeam?: boolean;
}

// const TAG_STYLES: Record<TagType, string> = {
//   update:       "bg-green-50 text-green-700",
//   milestone:    "bg-violet-50 text-violet-700",
//   announcement: "bg-amber-50 text-amber-800",
//   city:         "bg-blue-50 text-blue-600",
//   category:     "bg-slate-100 text-slate-500",
// };

export function TeamPostCard({
  postId,
  teamEmoji,
  teamAvatarBg,
  teamName,
  location,
  memberCount,
  postedAt, 
  title,
  body,
  hasImage,
  imageUrls, 
  likes,
  comments,
  liked,
  isOwnTeam,
}: TeamPostCardProps) {
  return (
    <div
      id={postId ? `team-post-card-${postId}` : undefined}
      className={`border-[1.5px] rounded-2xl p-[1.4rem] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-150 cursor-pointer mb-4 ${
        isOwnTeam
          ? "bg-[#f8faff] border-blue-200"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Ekip kimlik satırı */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-[13px] flex items-center justify-center text-[1.3rem] flex-shrink-0"
          style={{ background: teamAvatarBg }}
        >
          {teamEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-nunito font-black text-[0.95rem] text-slate-900 flex items-center gap-1 flex-wrap">
            {teamName}
          
            {isOwnTeam && (
              <span className="text-blue-600 font-bold text-[0.75rem]">· Senin ekibin</span>
            )}
          </div>
          <div className="text-[0.75rem] text-slate-400 flex items-center gap-[0.4rem] mt-[0.1rem]">
            <span>{location}</span>
            <span className="opacity-40">·</span>
            <span>{memberCount} üye</span>
          </div>
        </div>
        <span className="text-[0.75rem] text-slate-400 whitespace-nowrap flex-shrink-0">
          {postedAt}
        </span>
      </div>
 
      {/* Başlık */}
      <div className="font-nunito font-black text-[1.05rem] leading-[1.35] text-slate-900 mb-[0.45rem]">
        {title}
      </div>

      {/* Açıklama */}
      <div className="text-[0.86rem] text-slate-500 leading-[1.6] mb-4">
        {body}{" "}
        <span className="text-blue-600 font-semibold cursor-pointer">Devamını oku</span>
      </div>

      {/* Görseller */}
      {imageUrls && imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {imageUrls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-1/3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-auto rounded-[8px]" />
            </a>
          ))}
        </div>
      )}
      {!imageUrls && hasImage && (
        <div className="w-full h-[180px] rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-[2.5rem] mb-4">
          📸
        </div>
      )}

 

      {/* Aksiyon butonları */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <button
          className={`flex items-center gap-[0.35rem] border-[1.5px] rounded-lg font-jakarta text-[0.8rem] font-semibold px-[0.85rem] py-[0.4rem] cursor-pointer transition-all duration-150 ${
            liked
              ? "border-red-300 text-red-500 bg-red-50"
              : "border-slate-200 text-slate-500 bg-transparent hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          👍 {likes}
        </button>
        <button className="flex items-center gap-[0.35rem] border-[1.5px] border-slate-200 rounded-lg font-jakarta text-[0.8rem] font-semibold text-slate-500 px-[0.85rem] py-[0.4rem] cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150">
          💬 {comments}  
        </button>
        <button  className="ml-auto flex items-center gap-[0.35rem] border-[1.5px] border-slate-200 rounded-lg font-jakarta text-[0.8rem] font-semibold text-slate-500 px-[0.85rem] py-[0.4rem] cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150">
          ↗ Paylaş
        </button>
      </div>
    </div>
  );
}
