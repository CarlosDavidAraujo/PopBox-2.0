import { upsertDepartmentSchema } from "@/validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const departmentsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.db.department.findMany({
      orderBy: {
        id: "asc",
      },
    }),
  ),

  upsert: protectedProcedure
    .input(upsertDepartmentSchema)
    .mutation(({ ctx, input }) =>
      input.id
        ? ctx.db.department.update({ data: input, where: { id: input.id } })
        : ctx.db.department.create({
            data: {
              ...input,
              created_by_id: parseInt(ctx.session.user.id, 10),
            },
          }),
    ),
});
