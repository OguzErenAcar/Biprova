import { Suspense } from "react";
import { CreateProjectTopbar } from "./_components/create-project-topbar";
import { CreateProjectLeftCol } from "./_components/create-project-left-col";
import { getCategories, getCities, getSkills, getUserTeams } from "@/features/projects/actions";

async function CreateProjectContent() {
  const [categories, cities, skills, userTeams] = await Promise.all([
    getCategories(),
    getCities(),
    getSkills(),
    getUserTeams(),
  ]);

  return <CreateProjectLeftCol categories={categories} cities={cities} skills={skills} userTeams={userTeams} />;
}

export default function CreateProjectPage() {
  return (
    <div>
      <CreateProjectTopbar />
      <div className="px-2 pb-4 md:p-8">
        <Suspense>
          <CreateProjectContent />
        </Suspense>
      </div>
    </div>
  );
}
