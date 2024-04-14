"use client";

import { FolderTree } from "./folder-tree";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { create } from "zustand";
import { useState } from "react";
import { api } from "@/trpc/react";
import type { Folder } from "@prisma/client";
import { useSession } from "next-auth/react";

interface FolderMoveStore {
  isModalOpen: boolean;
  sourceFolderId: string | null;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setSourceFolderId: (sourceFolderId: string) => void;
}

export const useFolderMoveStore = create<FolderMoveStore>()((set) => ({
  isModalOpen: false,
  sourceFolderId: null,
  setIsModalOpen: (isModalOpen) =>
    set({ isModalOpen, ...(!isModalOpen && { sourceFolderId: null }) }),
  setSourceFolderId: (sourceFolderId) => set({ sourceFolderId }),
}));

export function FolderMove() {
  const isModalOpen = useFolderMoveStore((state) => state.isModalOpen);
  const setIsModalOpen = useFolderMoveStore((state) => state.setIsModalOpen);
  const sourceFolderId = useFolderMoveStore((state) => state.sourceFolderId);
  const [destinationFolder, setDestinationFolder] = useState<Folder | null>(
    null,
  );
  const session = useSession();

  const { mutate } = api.folders.move.useMutation();

  const handleMoveFolder = () => {
    if (!destinationFolder || !sourceFolderId) return;
    mutate({
      destinationFolderId: destinationFolder.id,
      sourceFolderId,
    });
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Selecione a pasta destino</AlertDialogTitle>
        </AlertDialogHeader>
        <FolderTree
          rootFolderId={session.data?.user.id ?? ""}
          onFolderSelected={(folder) => setDestinationFolder(folder)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={handleMoveFolder}>Confirmar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
