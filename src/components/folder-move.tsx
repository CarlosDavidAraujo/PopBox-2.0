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
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export function FolderMove() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Mover</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Selecione a pasta destino</AlertDialogTitle>
        </AlertDialogHeader>
        <FolderTree
          rootFolderId="_root"
          //onFolderSelected={(folder) => console.log(folder?.name)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button>Confirmar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
