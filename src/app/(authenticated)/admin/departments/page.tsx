import { DepartmentsTable } from "@/components/department-table";

import { api } from "@/trpc/server";

export default async function AdminDepartmentPage() {
  const initialDepartments = await api.departments.getAll();

  return (
    <div>
      <DepartmentsTable initialDepartments={initialDepartments} />
    </div>
  );
}
