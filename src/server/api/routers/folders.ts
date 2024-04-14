import { insertFolderSchema } from "@/validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { supabase } from "@/lib/supabase";

export const foldersRouter = createTRPCRouter({
  createOne: protectedProcedure
    .input(insertFolderSchema)
    .mutation(({ ctx, input: folder }) =>
      ctx.db.folder.create({
        data: {
          name: folder.name,
          departmentId: ctx.session.user.department?.id ?? 1,
          parent_folder_id: folder.parent_folder_id,
          created_by_id: parseInt(ctx.session.user.id),
        },
      }),
    ),

  move: protectedProcedure
    .input(
      z.object({
        sourceFolderId: z.string(),
        destinationFolderId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.folder.update({
        where: {
          id: input.sourceFolderId,
        },
        data: {
          parent_folder_id: input.destinationFolderId,
        },
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
          created_by_id: parseInt(ctx.session.user.id),
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
