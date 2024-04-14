"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import type { Folder } from "@prisma/client";
import { useFolderMoveStore } from "./folder-move";

interface FolderTreeProps {
  rootFolderId: string;
  onFolderSelected?: (folder: Folder) => void;
}

export function FolderTree({
  rootFolderId,
  onFolderSelected,
}: FolderTreeProps) {
  const folderToMoveId = useFolderMoveStore((state) => state.sourceFolderId);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const { data: folder } = api.folders.getOneById.useQuery({
    folderId: rootFolderId,
  });

  if (!folder) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  return (
    <ul>
      {folder.child_folders.map(
        (childFolder) =>
          childFolder.id !== folderToMoveId && (
            <li key={childFolder.id}>
              <Accordion
                value={expandedFolders}
                onValueChange={setExpandedFolders}
                type="multiple"
              >
                <AccordionItem value={childFolder.id} className="border-b-0">
                  <AccordionTrigger
                    onClick={() => onFolderSelected?.(childFolder)}
                    className="flex-row-reverse justify-end [&[data-state=closed]>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0"
                  >
                    {childFolder.name}{" "}
                    {expandedFolders.includes(childFolder.id) ? (
                      <FaFolderOpen className="mr-4 !rotate-0 text-amber-500" />
                    ) : (
                      <FaFolder className="mr-4 !rotate-0 text-amber-500" />
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="ml-4 border-l">
                    {expandedFolders.includes(childFolder.id) && (
                      <FolderTree
                        rootFolderId={childFolder.id}
                        onFolderSelected={onFolderSelected}
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </li>
          ),
      )}
    </ul>
  );
}
