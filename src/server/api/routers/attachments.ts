import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { supabase } from "@/lib/supabase";

export const attachmentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        attachment_url: z.string(),
        folder_id: z.string(),
        name: z.string().min(1),
        size: z.number(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const attachment = await ctx.db.attachment.create({
          data: {
            ...input,
            created_by_id: parseInt(ctx.session.user.id),
          },
        });
        return attachment;
      } catch {
        await supabase.storage.from("popbox").remove([input.attachment_url]);
      }
    }),

  getManyByParentFolderId: protectedProcedure
    .input(z.object({ parentFolderId: z.string() }))
    .query(({ input, ctx }) =>
      ctx.db.attachment.findMany({
        include: {
          created_by: {
            select: {
              name: true,
            },
          },
        },
        where: { folder_id: input.parentFolderId },
      }),
    ),
});
