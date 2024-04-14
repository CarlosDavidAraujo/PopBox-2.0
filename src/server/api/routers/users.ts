import { createUserSchema, updateUserSchema } from "@/validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { hashSync } from "bcrypt";
import { supabase } from "@/lib/supabase";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createUserSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.$transaction(async (tx) => {
        // create the user
        const user = await tx.user.create({
          data: {
            ...input,
            password: hashSync(input.password, 10),
          },
        });

        // create the root folder of user on database
        await tx.folder.create({
          data: {
            created_by_id: user.id,
            name: `${user.name} root folder`,
            id: user.id.toString(),
            departmentId: input.department_id ?? 1,
          },
        });

        // create user's root folder on storage
        const { error } = await supabase.storage
          .from("popbox")
          // @ts-expect-error supabase nao suporta a criacao de pastas vazias, mas podemos criar uma pasta com um arquivo vazio
          .upload(`${user.id}/welcome.txt`);

        if (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        return user;
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
