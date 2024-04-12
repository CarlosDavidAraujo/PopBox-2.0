import { useFolder } from "@/components/folder-provider";
import { toast } from "@/components/ui/use-toast";
///import { supabase } from "@/lib/supabase";
import { api } from "@/trpc/react";
//import { useMutation } from "@tanstack/react-query";

export const useFileUploadMutation = () => {
  const { folder } = useFolder();
  const utils = api.useUtils();

  const mutation = api.attachments.create.useMutation({
    onSuccess: async () => {
      await utils.folders.getOneById.invalidate({
        folderId: folder?.id ?? "",
      });
      toast({ description: "Upload bem sucedido" });
    },
    onError: async (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  /*   const mutation = useMutation({
    mutationFn: async (file?: File) => {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data, error } = await supabase.storage
        .from("popbox")
        .upload(`${storagePath}/${file.name}`, file);

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: (data) => {
      const fileName = data?.path.split("/").pop()?.toString() ?? "unkown";
      createAttachmentOnDatabase({
        attachment_url: data!.path,
        folder_id: parentFolderId,
        name: fileName,
        size: 
      });
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });
 */
  return mutation;
};
