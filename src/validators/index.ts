import { z } from "zod";

export const insertFolderSchema = z.object({
  name: z.string().min(1),
  parent_folder_id: z.coerce.number().nullable(),
});
