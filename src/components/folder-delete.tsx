import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { useCurrentFolder } from "./folder-provider";
import { toast } from "./ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function FolderDelete({ folderId }: { folderId: string }) {
  const { folder: currentFolder } = useCurrentFolder();

  const utils = api.useUtils();
  const { mutate: sendFolderToTrash } = api.folders.sendToTrash.useMutation({
    onSuccess: () =>
      utils.folders.getOneById.invalidate({ folderId: currentFolder?.id }),
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const onDelete = () => sendFolderToTrash({ folderId });

  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <AlertDialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                className="aspect-square rounded-full p-0"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </AlertDialogTrigger>
          <TooltipContent>Excluir</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja enviar esta pasta para a lixeira?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
