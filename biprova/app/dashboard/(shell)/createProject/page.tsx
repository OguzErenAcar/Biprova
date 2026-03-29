import { Suspense } from "react";
import { CreateProjectTopbar } from "./_components/create-project-topbar";
import { CreateProjectLeftCol } from "./_components/create-project-left-col";
import { getCategories, getCities, getSkills } from "@/features/projects/actions";

async function CreateProjectContent() {
  const [categories, cities, skills] = await Promise.all([
    getCategories(),
    getCities(),
    getSkills(),
  ]);

  return <CreateProjectLeftCol categories={categories} cities={cities} skills={skills} />;
}

export default function CreateProjectPage() {
  return (
    <div>
      <CreateProjectTopbar />
      <div className="p-6 md:p-8">
        <Suspense>
          <CreateProjectContent />
        </Suspense>
      </div>
    </div>
  );
}
