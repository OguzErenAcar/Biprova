const DEFAULT_FALLBACK = "/images/432-4329071_team-icon-png-transparent-png.png";

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

function Badge({ url }: { url: string }) {
  if (!isUrl(url)) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt="badge"
      className="absolute -bottom-0.5 -right-0.5 w-[42%] h-[42%] object-contain pointer-events-none"
    />
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
    <img
      src={avatarUrl}
      alt={alt ?? initials ?? "Avatar"}
      className={`object-cover ${base}`}
      style={sizeStyle}
    />
  ) : initials ? (
    <div
      className={`bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-nunito font-black text-white ${base}`}
      style={sizeStyle}
    >
      {initials}
    </div>
  ) : (
    <img
      src={DEFAULT_FALLBACK}
      alt={alt ?? "Avatar"}
      className={`object-cover ${base}`}
      style={sizeStyle}
    />
  );

  if (!badge) return avatar;

  return (
    <div className="relative inline-flex shrink-0" style={sizeStyle}>
      <div className="w-full h-full">{avatar}</div>
      <Badge url={badge} />
    </div>
  );
}
