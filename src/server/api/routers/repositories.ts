import { createTRPCRouter, protectedProcedure } from "../trpc";

export const repositoriesRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => ctx.db.repository.findMany()),
});
