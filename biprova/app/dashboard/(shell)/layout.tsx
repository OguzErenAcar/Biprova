 
export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <div id="dashboard-shell" className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-5 items-start">
        <div id="dashboard-main">
          {children}
        </div>

      </div>
    </>
  );
}

 