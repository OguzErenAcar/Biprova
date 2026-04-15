 
export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <div id="dashboard-shell" className="">
        <div id="dashboard-main ">
          {children}
        </div>

      </div>
    </>
  );
}

 