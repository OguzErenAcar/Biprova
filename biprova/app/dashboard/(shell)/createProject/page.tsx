import { CreateProjectTopbar } from "./_components/create-project-topbar";
import { CreateProjectLeftCol } from "./_components/create-project-left-col";
import { getCategories, getCities, getSkills } from "@/features/projects/actions";

export default async function CreateProjectPage() {
  const [categories, cities, skills] = await Promise.all([
    getCategories(),
    getCities(),
    getSkills(),
  ]);

  return (
    <div>
      <CreateProjectTopbar />
      <div className="p-6 md:p-8">
        <CreateProjectLeftCol categories={categories} cities={cities} skills={skills} />
      </div>
    </div>
  );
}
