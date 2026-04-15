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
  return (
    <span className="absolute bottom-0 right-0 w-[38%] h-[38%] rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-slate-200">
      {isUrl(url) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="badge" className="w-full h-full object-cover" />
      ) : (
        <span className="w-full h-full bg-amber-400 block" />
      )}
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
