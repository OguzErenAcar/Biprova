import { LastActiveUsers } from "@/components/shared/last-active-users";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LastActiveUsers />
      {children}
    </>
  );
}
