"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import type { RouterOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import { DepartmentForm } from "./department-form";

export function DepartmentsTable({
  initialDepartments,
}: {
  initialDepartments: RouterOutputs["departments"]["getAll"];
}) {
  const { data: departments } = api.departments.getAll.useQuery(undefined, {
    initialData: initialDepartments,
  });

  return (
    <DataTableProvider
      data={departments}
      columns={[
        { accessorKey: "name", header: "Nome" },
        { accessorKey: "acronym", header: "Sigla" },
        { accessorKey: "created_by_id", header: "Criado por" },
        { accessorKey: "address", header: "Endereço" },
        {
          accessorKey: "created_at",
          header: "Criado em",
          cell: ({ row }) => row.original.created_at.toLocaleDateString(),
        },
        {
          accessorKey: "updated_at",
          header: "Última atualiazação",
          cell: ({ row }) => row.original.updated_at.toLocaleDateString(),
        },
        {
          accessorKey: "actions",
          header: "",
          cell: ({ row }) => (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-end [&:not(:hover)]:opacity-0">
              <DepartmentForm editableDepartment={row.original} />
            </div>
          ),
        },
      ]}
    >
      <div className="flex flex-col">
        <div className="self-end">
          <DepartmentForm />
        </div>
        <DataTable />
      </div>
    </DataTableProvider>
  );
}
