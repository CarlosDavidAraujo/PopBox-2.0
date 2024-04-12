"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import type { z } from "zod";
import { upsertDepartmentSchema } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Department } from "@prisma/client";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { Input } from "./ui/input";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
import { cn } from "@/lib/utils";

export function DepartmentForm({
  editableDepartment,
}: {
  editableDepartment?: Department;
}) {
  const form = useForm<z.infer<typeof upsertDepartmentSchema>>({
    resolver: zodResolver(upsertDepartmentSchema),
    defaultValues: {
      acronym: "",
      address: "",
      name: "",
    },
    ...(editableDepartment && { values: editableDepartment }),
  });

  const utils = api.useUtils();
  const { mutate } = api.departments.upsert.useMutation({
    onSuccess: () => utils.departments.getAll.invalidate(),
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return (
    <Sheet onOpenChange={(open) => !open && form.reset()}>
      <SheetTrigger asChild>
        <Button
          variant={editableDepartment ? "ghost" : "default"}
          className={cn(editableDepartment && "aspect-square rounded-full p-0")}
        >
          {editableDepartment ? <Pencil className="h-4 w-4" /> : "Novo Setor"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {editableDepartment ? "Edição de Setor" : "Cadastro de Setor"}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    O nome do setor. Evite o uso do {'"capslock"'} para não
                    prejudicar a formatação dos documentos que usarem o nome
                    deste setor.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acronym"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sigla</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Esse endereço será exibido quando este setor for
                    referenciado em um documento.
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit">Confirmar</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
