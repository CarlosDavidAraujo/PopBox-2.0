import { api } from "@/trpc/server";
import { Folders } from "../../../components/folder/folders";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { NewFolderForm } from "../../../components/folder-create";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

export default async function FoldersPage() {
  const initialFolders = await api.folders.getManyByParentId({
    parentFolderId: null,
  });

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
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
