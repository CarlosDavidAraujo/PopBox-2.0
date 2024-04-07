import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReactNode } from "react";
import { NewFolderForm } from "./new-folder-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function DocumentsContextMenu({
  children,
  currentFolderId,
}: {
  children: ReactNode;
  currentFolderId: number | null;
}) {
  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger className="flex flex-grow flex-col rounded border border-dashed p-4">
          <ScrollArea className="h-1 flex-grow">{children}</ScrollArea>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <DialogTrigger asChild>
            <ContextMenuItem>Nova pasta</ContextMenuItem>
          </DialogTrigger>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DialogContent>
        <NewFolderForm parentFolderId={currentFolderId} />
      </DialogContent>
    </Dialog>
  );
}
