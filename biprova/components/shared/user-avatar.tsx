interface UserAvatarProps {
  initials: string;
  className?: string;
}

export function UserAvatar({ initials, className = "" }: UserAvatarProps) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-nunito font-black text-white shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}
