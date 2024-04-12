import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { documentsRouter } from "./routers/documents";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { foldersRouter } from "./routers/folders";
import { attachmentsRouter } from "./routers/attachments";
import { departmentsRouter } from "./routers/departments";
import { userRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  documents: documentsRouter,
  folders: foldersRouter,
  attachments: attachmentsRouter,
  departments: departmentsRouter,
  users: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
