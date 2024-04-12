"use client";

import { useRouter } from "next/navigation";
import { FolderDelete } from "./folder-delete";
import { FolderMove } from "./folder-move";
import { DataTable } from "./table/DataTable";
import { DataTableProvider } from "./table/DataTableProvider";
import { ScrollArea } from "./ui/scroll-area";
import { useFolder } from "./folder-provider";
import { useMemo } from "react";
import { formatFileSize } from "@/utils/formatFIleSize";
import { getFileExtensionIcon } from "@/utils/getFileExtensionIcon";
import { FaFolder } from "react-icons/fa";

export function FolderList({ page }: { page: "repositories" | "trash" }) {
  const router = useRouter();
  const { folder } = useFolder();

  // Função para padronizar a estrutura dos dados de folders
  const formattedFoldersData = useMemo(
    () =>
      folder?.child_folders.map((folder) => ({
        id: folder.id,
        name: folder.name,
        type: "folder",
        size: "-",
        createdBy: folder.created_by.name,
        createdAt: folder.created_at.toLocaleString(),
        updatedAt: folder.updated_at.toLocaleString(),
      })) ?? [],
    [folder],
  );

  // Função para padronizar a estrutura dos dados de files
  const formattedFilesData = useMemo(
    () =>
      folder?.attachments.map((file) => ({
        id: file.id,
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        createdBy: file.created_by.name, // Aqui você pode preencher com o nome do usuário que criou o arquivo, se aplicável
        createdAt: file.created_at.toLocaleString(),
        updatedAt: file.updated_at.toLocaleString(),
      })) ?? [],
    [folder],
  );

  const mergedFoldersWithFiles =
    formattedFoldersData?.concat(formattedFilesData) ?? [];

  return (
    <ScrollArea className="h-1 flex-grow">
      <FolderMove />
      <DataTableProvider
        data={mergedFoldersWithFiles}
        columns={[
          {
            accessorKey: "name",
            header: "Nome",
            cell: ({ row }) => (
              <div className="flex items-center gap-4">
                {row.original.type === "folder" ? (
                  <FaFolder className="h-6 w-6 text-amber-500" />
                ) : (
                  getFileExtensionIcon(row.original.type)
                )}
                {row.original.name}
              </div>
            ),
          },
          { accessorKey: "createdBy", header: "Proprietário" },
          { accessorKey: "size", header: "Tamanho" },
          { accessorKey: "createdAt", header: "Criado em" },
          { accessorKey: "updatedAt", header: "Última atualização" },
          {
            accessorKey: "actions",
            header: "",
            cell: ({ row }) => (
              <div
                className="absolute left-0 top-0 flex h-full w-full items-center justify-end px-4 [&:not(:hover)]:opacity-0"
                onDoubleClick={() =>
                  row.original.type === "folder" &&
                  router.push(`/${page}/${row.original.id}`)
                }
              >
                <FolderMove />
                <FolderDelete folderId={row.original.id} />
              </div>
            ),
          },
        ]}
      >
        <DataTable />
      </DataTableProvider>
    </ScrollArea>
  );
}
