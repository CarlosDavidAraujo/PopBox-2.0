"use client";
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/server/api/root";
import { DocumentsContextMenu } from "./folder-context-menu";
import { Folder } from "./folder";
import { usePathname } from "next/navigation";

interface FoldersProps {
  initialFolders: RouterOutputs["folders"]["manyByParentId"];
}

export function Folders({ initialFolders }: FoldersProps) {
  const currentPath = usePathname();
  const pathnameParts = currentPath.split("/").slice(1);
  const parentFolderId = pathnameParts[pathnameParts.length - 1] ?? null;

  const { data: folders } = api.folders.manyByParentId.useQuery(
    { parentFolderId },
    { initialData: initialFolders },
  );

  return (
    <div className="flex flex-grow flex-col gap-6">
      <h1 className="text-lg font-semibold md:text-2xl">Documentos</h1>
      <Breadcrumb>
        <BreadcrumbList>
          {pathnameParts.map((id, index, array) => (
            <React.Fragment key={id}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/documents/${array.slice(1, index + 1).join("/")}`}
                  >
                    {index === 0 ? "Início" : id}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== array.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <DocumentsContextMenu currentFolderId={parentFolderId}>
        <div className="flex items-start gap-4">
          {folders.map((folder) => (
            <Folder
              key={folder.id}
              folder={folder}
              href={`${currentPath}/${folder.id}`}
            />
          ))}
        </div>
      </DocumentsContextMenu>
    </div>
  );
}
