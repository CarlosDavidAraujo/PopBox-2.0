import { uploadFile } from "@/actions/upload-file";
import { useCurrentFolder } from "@/components/folder-provider";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";

export const useFileUploadMutation = () => {
  const { folder } = useCurrentFolder();
  const utils = api.useUtils();

  const mutation = useMutation({
    mutationFn: (file: File) => uploadFile(folder?.id, file),
    onSuccess: () =>
      utils.folders.getOneById.invalidate({ folderId: folder?.id }),
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  return mutation;
};
