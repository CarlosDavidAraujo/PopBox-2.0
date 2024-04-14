"use client";

import { FolderDelete } from "./folder-delete";
import { FolderMove, useFolderMoveStore } from "./folder-move";
import { DataTable } from "./table/DataTable";
import { DataTableProvider } from "./table/DataTableProvider";
import { ScrollArea } from "./ui/scroll-area";
import { useCurrentFolder } from "./folder-provider";
import { useMemo } from "react";
import { formatFileSize } from "@/utils/formatFIleSize";
import { getFileExtensionIcon } from "@/utils/getFileExtensionIcon";
import { FaFolder } from "react-icons/fa";
import Link from "next/link";
import { Button } from "./ui/button";
import { FolderInput } from "lucide-react";
import { NewFolderForm } from "./folder-create";
import { FileUploader } from "./file-uploader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function FolderList({ page }: { page: "repositories" | "trash" }) {
  const { folder } = useCurrentFolder();
  const setModalOpen = useFolderMoveStore((state) => state.setIsModalOpen);
  const setSourceFolderId = useFolderMoveStore(
    (state) => state.setSourceFolderId,
  );

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
    <>
      <FolderMove />
      <NewFolderForm />
      <FileUploader />
      <ScrollArea className="h-1 flex-grow">
        <DataTableProvider
          data={mergedFoldersWithFiles}
          columns={[
            {
              accessorKey: "name",
              header: "Nome",
              cell: ({ row }) => (
                <Link
                  href={`/${page}/${row.original.id}`}
                  className="flex items-center gap-4"
                >
                  {row.original.type === "folder" ? (
                    <FaFolder className="h-6 w-6 text-amber-500" />
                  ) : (
                    getFileExtensionIcon(row.original.type)
                  )}
                  {row.original.name}
                </Link>
              ),
            },
            { accessorKey: "createdBy", header: "Proprietário" },
            { accessorKey: "size", header: "Tamanho" },
            { accessorKey: "createdAt", header: "Criado em" },
            { accessorKey: "updatedAt", header: "Última atualização" },
            {
              accessorKey: "actions",
              header: "",
              cell: ({ row: { original: folder } }) => (
                <div className="flex">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            setModalOpen(true);
                            setSourceFolderId(folder.id);
                          }}
                          variant="secondary"
                          className="aspect-square rounded-full p-0"
                        >
                          <FolderInput className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mover</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <FolderDelete folderId={folder.id} />
                </div>
              ),
            },
          ]}
        >
          <DataTable />
        </DataTableProvider>
      </ScrollArea>
    </>
  );
}
