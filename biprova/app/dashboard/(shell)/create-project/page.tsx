import { CreateProjectTopbar } from "./_components/create-project-topbar";
import { CreateProjectLeftCol } from "./_components/create-project-left-col";

export default function CreateProjectPage() {
  return (
    <div>
      <CreateProjectTopbar />
      <div className="p-6 md:p-8">
        <CreateProjectLeftCol />
      </div>
    </div>
  );
}
