"use client";

import { Button } from "@/components/ui/button";
import type { RouterOutputs } from "@/server/api/root";
import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";

export function Repository({
  repository,
  parentPath,
}: {
  repository: RouterOutputs["repositories"]["all"][0];
  parentPath: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      size="lg"
      className="flex items-center gap-2 p-4"
      onDoubleClick={() =>
        router.push(`/repositories/${parentPath}/${repository.id}`)
      }
    >
      <Folder className="h-6 w-6" /> {repository.name}
    </Button>
  );
}
