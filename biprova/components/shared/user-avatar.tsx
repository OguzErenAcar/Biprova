const DEFAULT_FALLBACK = "/images/432-4329071_team-icon-png-transparent-png.png";

interface UserAvatarProps {
  initials?: string;
  avatarUrl?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  badge?: string | null;
}

export function UserAvatar({
  initials,
  avatarUrl,
  alt,
  size,
  className = "",
}: UserAvatarProps) {
  const sizeStyle = size ? { width: size, height: size } : undefined;
  const base = `rounded-full shrink-0 ${className}`;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={alt ?? initials ?? "Avatar"}
        className={`object-cover ${base}`}
        style={sizeStyle}
      />
    );
  }

  if (initials) {
    return (
      <div
        className={`bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-nunito font-black text-white ${base}`}
        style={sizeStyle}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={DEFAULT_FALLBACK}
      alt={alt ?? "Avatar"}
      className={`object-cover ${base}`}
      style={sizeStyle}
    />
  );
}
