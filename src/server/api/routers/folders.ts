import { insertFolderSchema } from "@/validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Folder, Prisma } from "@prisma/client";

export const foldersRouter = createTRPCRouter({
  manyByParentId: protectedProcedure
    .input(z.object({ parentFolderId: z.number({ coerce: true }).nullable() }))
    .query(({ ctx, input }) =>
      ctx.db.folder.findMany({
        include: {
          parent_folder: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          parent_folder_id: input.parentFolderId,
        },
      }),
    ),

  byIdWithParents: protectedProcedure
    .input(z.object({ folderId: z.number({ coerce: true }) }))
    .query(async ({ ctx, input }) => {
      const folderWithParents: Prisma.FolderGetPayload<{
        include: {
          parent_folder: {
            select: {
              id: true;
              name: true;
            };
          };
        };
      }>[] = [];

      // Função recursiva para obter o folder atual e seus pais
      const getFolderWithParents = async (folderId: number) => {
        const folder = await ctx.db.folder.findUnique({
          where: { id: folderId },
          include: {
            parent_folder: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        if (folder) {
          folderWithParents.unshift(folder); // Adiciona o folder no início do array
          if (folder.parent_folder) {
            await getFolderWithParents(folder.parent_folder.id); // Obtém o pai do folder atual
          }
        }
      };

      await getFolderWithParents(input.folderId);

      return folderWithParents.map((folder) => folder.parent_folder);
    }),

  createOne: protectedProcedure
    .input(insertFolderSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.folder.create({
        data: {
          ...input,
          created_by_id: parseInt(ctx.session.user.id),
        },
      }),
    ),
});
