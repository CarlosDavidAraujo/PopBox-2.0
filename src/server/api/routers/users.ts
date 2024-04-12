import { createUserSchema, updateUserSchema } from "@/validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { hashSync } from "bcrypt";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createUserSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.user.create({
        data: {
          ...input,
          password: hashSync(input.password, 10),
        },
      }),
    ),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.user.update({
        data: input,
        where: {
          id: input.id,
        },
      }),
    ),

  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.db.user.findMany({
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
      where: {
        id: {
          not: parseInt(ctx.session.user.id),
        },
      },
    }),
  ),
});
