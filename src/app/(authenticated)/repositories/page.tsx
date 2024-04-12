import { api } from "@/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";
import { FolderProvider } from "@/components/folder-provider";
import { FolderList } from "@/components/folder-list";

export default async function RepositoriesPage() {
  const initialFolder = await api.folders.getOneById({
    folderId: "_root",
  });

  return (
    <div className="flex flex-grow flex-col gap-6">
      <h1 className="text-lg font-semibold md:text-2xl">Repositórios</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/repositories">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <FolderProvider
        folderId="_root"
        initialFolder={initialFolder}
        storagePath="_root"
      >
        <FolderList page="repositories" />
      </FolderProvider>
    </div>
  );
}
