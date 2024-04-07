"use client";

import { Button } from "@/components/ui/button";
import type { RouterOutputs } from "@/server/api/root";
import { Folder as FolderIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function Folder({
  folder,
  href,
}: {
  folder: RouterOutputs["folders"]["byParentId"][0];
  href: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      size="lg"
      className="flex items-center gap-2 p-4"
      onDoubleClick={() => router.push(href)}
    >
      <FolderIcon className="h-6 w-6" /> {folder.name}
    </Button>
  );
}
