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
import { FolderProvider } from "@/components/folder-provider";
import { FolderList } from "@/components/folder-list";
import { getServerAuthSession } from "@/server/auth";

export default async function RepositoriesPage({
  params,
}: {
  params: { repositoryId: string };
}) {
  const initialFolder = await api.folders.getOneById({
    folderId: params.repositoryId,
  });

  const parentFolders = await api.folders.byIdWithParents({
    folderId: params.repositoryId,
  });

  const session = await getServerAuthSession();

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
          <BreadcrumbSeparator />
          {parentFolders.map(
            (folder) =>
              folder.id !== session?.user.id && (
                <React.Fragment key={folder.id}>
                  <BreadcrumbLink asChild>
                    <Link href={`/repositories/${folder.id}`}>
                      {folder.name}
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </React.Fragment>
              ),
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <FolderProvider initialFolder={initialFolder}>
        <FolderList page="repositories" />
      </FolderProvider>
    </div>
  );
}
