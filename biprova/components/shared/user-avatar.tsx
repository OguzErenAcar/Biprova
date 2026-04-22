import Image from "next/image";

interface UserAvatarProps {
  initials?: string;
  avatarUrl?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  badge?: string | null;
}

function isUrl(value: string) {
  return value.startsWith("http") || value.startsWith("/");
}

function BadgeImage({ url }: { url: string }) {
  if (!isUrl(url)) return null;
  return (
    <span className="absolute -bottom-0.5 -right-0.5 w-[42%] h-[42%] block">
      <Image
        src={url}
        alt="badge"
        fill
        className="object-contain pointer-events-none"
        sizes="48px"
      />
    </span>
  );
}

export function UserAvatar({
  initials,
  avatarUrl,
  alt,
  size,
  className = "",
  badge,
}: UserAvatarProps) {
  const sizeStyle = size ? { width: size, height: size } : undefined;
  const base = `rounded-full shrink-0 ${className}`;

  const avatar = avatarUrl ? (
    <span className={`relative block ${base}`} style={sizeStyle}>
      <Image
        src={avatarUrl}
        alt={alt ?? initials ?? "Avatar"}
        fill
        className="object-cover rounded-full"
        sizes="120px"
      />
    </span>
  ) : initials ? (
    <div
      className={`bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-nunito font-black text-white ${base}`}
      style={sizeStyle}
    >
      {initials}
    </div>
  ) : (
    <div
      className={`bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-nunito font-black text-white ${base}`}
      style={sizeStyle}
    >
      {alt ? alt.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") : "?"}
    </div>
  );

  if (!badge) return avatar;

  return (
    <div className="relative inline-flex shrink-0" style={sizeStyle}>
      <div className="w-full h-full">{avatar}</div>
      <BadgeImage url={badge} />
    </div>
  );
}
