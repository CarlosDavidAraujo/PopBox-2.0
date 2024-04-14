import { Gender } from "@prisma/client";
import { z } from "zod";

export const insertFolderSchema = z.object({
  name: z.string().min(1),
  parent_folder_id: z.string().nullable(),
});

export const upsertDepartmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "É necessário preencher um nome"),
  acronym: z
    .string()
    .min(3, { message: "A sigla deve possuir pelo menos 3 caractéres" }),
  address: z.string().min(1, { message: "É necessário preencher um endereço" }),
});

export const createUserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email({ message: "Email inválido" }),
  gender: z.nativeEnum(Gender),
  password: z
    .string()
    .min(6, { message: "A senha deve possuir no mínimo 6 caractéres" }),
  name: z.string().min(1, { message: "É necessário preencher um nome" }),
  cellphone: z.string().optional(),
  department_id: z.number().min(1).nullable(),
  fax: z.string().optional(),
  phone: z.string().optional(),
});

export const updateUserSchema = createUserSchema
  .omit({ password: true, id: true })
  .merge(z.object({ id: z.number() }));
