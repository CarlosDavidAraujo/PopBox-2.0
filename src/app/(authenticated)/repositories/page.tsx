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
import { getServerAuthSession } from "@/server/auth";

export default async function RepositoriesPage() {
  const session = await getServerAuthSession();

  const initialFolder = await api.folders.getOneById({
    folderId: session!.user.id,
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
      <FolderProvider initialFolder={initialFolder}>
        <FolderList page="repositories" />
      </FolderProvider>
    </div>
  );
}
