import { api } from "@/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";
import { FolderContextMenu } from "@/components/folder-context-menu";

export default async function FoldersPage({
  params,
}: {
  params: { folderId: string };
}) {
  const initialFolders = await api.folders.getManyByParentId({
    parentFolderId: params.folderId,
  });

  const parentFolders = await api.folders.byIdWithParents({
    folderId: params.folderId,
  });

  const currentFolderPath = parentFolders.map((folder) => folder.id).join("/");
  const storagePath = `/documents/${currentFolderPath}`;

  return (
    <div className="flex flex-grow flex-col gap-6">
      <h1 className="text-lg font-semibold md:text-2xl">Documentos</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/documents">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {parentFolders.map((folder, index, array) => (
            <React.Fragment key={folder?.id}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/documents/${folder?.id ?? ""}`}>
                    {folder?.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== array.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <FolderContextMenu
        initialFolders={initialFolders}
        parentFolderId={params.folderId}
        storagePath={storagePath}
      />
    </div>
  );
}
