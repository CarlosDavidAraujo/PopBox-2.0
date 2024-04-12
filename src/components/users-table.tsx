"use client";

import type { RouterOutputs } from "@/server/api/root";
import { DataTable } from "./table/DataTable";
import { DataTableProvider } from "./table/DataTableProvider";
import { api } from "@/trpc/react";
import { genderMap } from "@/constants/gender-map";
import { UserSignupForm } from "./user-signup-form";
import { Badge } from "./ui/badge";
import { UserUpdateForm } from "./user-update-form";

export function UsersTable({
  initialUsers,
}: {
  initialUsers: RouterOutputs["users"]["getAll"];
}) {
  const { data: users } = api.users.getAll.useQuery(undefined, {
    initialData: initialUsers,
  });

  return (
    <DataTableProvider
      data={users}
      columns={[
        { accessorKey: "name", header: "Nome" },
        { accessorKey: "department.name", header: "Setor" },
        {
          accessorKey: "gender",
          header: "Gênero",
          cell: ({ row }) => (
            <Badge variant="outline">{genderMap[row.original.gender]}</Badge>
          ),
        },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Telefone" },
        { accessorKey: "cellphone", header: "Celular" },
        { accessorKey: "fax", header: "Fax" },
        {
          accessorKey: "created_at",
          header: "Cadastrado em",
          cell: ({ row }) => row.original.created_at.toLocaleDateString(),
        },
        {
          accessorKey: "updated_at",
          header: "Última atualização",
          cell: ({ row }) => row.original.updated_at.toLocaleDateString(),
        },
        {
          accessorKey: "actions",
          header: "",
          cell: ({ row }) => (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-end [&:not(:hover)]:opacity-0">
              <UserUpdateForm editableUser={row.original} />
            </div>
          ),
        },
      ]}
    >
      <div className="flex flex-col">
        <div className="self-end">
          <UserSignupForm />
        </div>
        <DataTable />
      </div>
    </DataTableProvider>
  );
}
