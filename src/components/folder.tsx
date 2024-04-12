"use client";

import { FolderIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { FolderOptions } from "./folder-options";
import type { Folder } from "@prisma/client";

export function Folder({ folder, href }: { folder: Folder; href: string }) {
  const router = useRouter();
  return (
    <Button
      key={folder.id}
      variant="secondary"
      size="lg"
      className="flex cursor-default items-center gap-2 p-4"
      onDoubleClick={() => router.push(href)}
    >
      <FolderIcon className="h-6 w-6" /> {folder.name}
      <FolderOptions />
    </Button>
  );
}
