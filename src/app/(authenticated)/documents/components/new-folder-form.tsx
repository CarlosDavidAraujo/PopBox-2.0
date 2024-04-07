"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
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

export function NewFolderForm({
  parentFolderId,
}: {
  parentFolderId: number | null;
}) {
  const form = useForm<z.infer<typeof insertFolderSchema>>({
    resolver: zodResolver(insertFolderSchema),
    defaultValues: {
      name: "",
      parent_folder_id: parentFolderId,
    },
  });

  const utils = api.useUtils();
  const { mutate } = api.folders.createOne.useMutation({
    onSuccess: () =>
      utils.folders.manyByParentId.invalidate({ parentFolderId }),
  });

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return (
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
        <DialogClose asChild>
          <Button className="justify-self-end" type="submit">
            Criar
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
