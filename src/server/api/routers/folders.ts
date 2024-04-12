import { insertFolderSchema } from "@/validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { supabase } from "@/lib/supabase";

export const foldersRouter = createTRPCRouter({
  createOne: protectedProcedure
    .input(insertFolderSchema)
    .mutation(({ ctx, input: folder }) =>
      ctx.db.$transaction(async (tx) => {
        // Insert the folder on database
        const dbFolder = await tx.folder.create({
          data: {
            name: folder.name,
            departmentId: ctx.session.user.department?.id ?? 1,
            parent_folder_id: folder.parent_folder_id,
            created_by_id: parseInt(ctx.session.user.id),
          },
        });

        // Create the folder on storage
        const { error } = await supabase.storage
          .from("popbox")
          // @ts-expect-error supabase nao suporta a criacao de pastas vazias, mas podemos criar uma pasta com um arquivo vazio
          .upload(`${folder.storagePath}/${dbFolder.id}/welcome.txt`);

        if (error)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });

        return dbFolder;
      }),
    ),

  move: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
        destinationFolderId: z.string(),
        sourcePath: z.string(),
        destinationPath: z.string(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.$transaction(async (tx) => {
        const updatedFolder = await tx.folder.update({
          where: {
            id: input.folderId,
          },
          data: {
            parent_folder_id: input.destinationFolderId,
          },
        });

        async function moveStorageFolderRecursively(
          sourcePath: string,
          destinationPath: string,
        ) {
          // List all subfolders and files of the source folder
          const { data: items, error } = await supabase.storage
            .from("popbox")
            .list(sourcePath);

          if (error) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: error.message,
            });
          }
          // Move each file or folder
          for (const item of items) {
            const isFolder = item.id === null;

            if (isFolder) {
              await moveStorageFolderRecursively(
                `${sourcePath}/${item.name}`,
                `${destinationPath}/${item.name}`,
              );
            } else {
              const { error } = await supabase.storage
                .from("popbox")
                .move(
                  `${sourcePath}/${item.name}`,
                  `${destinationPath}/${item.name}`,
                );
              if (error) {
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: error.message,
                });
              }
            }
          }
        }

        await moveStorageFolderRecursively(
          input.sourcePath,
          input.destinationPath,
        );

        return updatedFolder;
      }),
    ),

  sendToTrash: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.folder.update({
        data: {
          parent_folder_id: "_trash",
        },
        where: {
          id: input.folderId,
        },
      }),
    ),

  delete: protectedProcedure
    .input(z.object({ folderId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const folderToDelete = await ctx.db.folder.findUnique({
        select: {
          id: true,
          child_folders: true,
        },
        where: {
          id: input.folderId,
        },
      });

      const hasChildFolders =
        folderToDelete && folderToDelete.child_folders.length > 0;

      if (hasChildFolders) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "A pasta que você está tentando deletar possui conteúdo. Exclua o conteúdo da pasta antes de deletá-la.",
        });
      }

      await ctx.db.folder.delete({
        where: {
          id: input.folderId,
        },
      });
    }),

  getOneById: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.folder.findUnique({
        where: {
          id: input.folderId,
          isTrash: false,
        },
        include: {
          created_by: {
            select: {
              name: true,
            },
          },
          child_folders: {
            where: { isTrash: false },
            include: {
              created_by: {
                select: {
                  name: true,
                },
              },
            },
          },
          attachments: {
            include: {
              created_by: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ),

  getAllInTrash: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.folder.findUnique({
        where: {
          id: input.folderId,
        },
        include: {
          created_by: {
            select: {
              name: true,
            },
          },
          child_folders: {
            include: {
              created_by: {
                select: {
                  name: true,
                },
              },
            },
            where: {
              created_by_id: parseInt(ctx.session.user.id),
            },
          },
          attachments: {
            include: {
              created_by: {
                select: {
                  name: true,
                },
              },
            },
            where: {
              created_by_id: parseInt(ctx.session.user.id),
            },
          },
        },
      }),
    ),

  byIdWithParents: protectedProcedure
    .input(z.object({ folderId: z.string().nullable() }))
    .query(
      async ({ ctx, input }) => ctx.db.$queryRaw<
        {
          id: string;
          name: string;
        }[]
      >`
      WITH RECURSIVE folderPath AS (
        SELECT id, name, parent_folder_id FROM "Folder" WHERE id = ${input.folderId}
        UNION ALL
        SELECT f.id, f.name, f.parent_folder_id FROM "Folder" f
        JOIN folderPath fp ON f.id = fp.parent_folder_id
      )
      SELECT id, name FROM folderPath ORDER BY id ASC;
    `,
    ),
});
