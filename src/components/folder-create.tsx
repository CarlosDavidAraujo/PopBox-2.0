"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { insertFolderSchema } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "./ui/use-toast";
import { useCurrentFolder } from "./folder-provider";
import { FolderPlus } from "lucide-react";

function NewFolderForm() {
  const { folder } = useCurrentFolder();

  const form = useForm<z.infer<typeof insertFolderSchema>>({
    resolver: zodResolver(insertFolderSchema),
    defaultValues: {
      name: "",
      parent_folder_id: folder?.id,
    },
  });

  const utils = api.useUtils();
  const { mutate } = api.folders.createOne.useMutation({
    onSuccess: () =>
      utils.folders.getOneById.invalidate({
        folderId: folder?.id,
      }),
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start gap-3">
          <FolderPlus className="h-4 w-4" />
          Nova pasta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da pasta</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="justify-self-end" type="submit">
              Criar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { NewFolderForm };
