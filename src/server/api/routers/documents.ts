import { createTRPCRouter, protectedProcedure } from "../trpc";

export const documentsRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => ctx.db.document.findMany()),
});
