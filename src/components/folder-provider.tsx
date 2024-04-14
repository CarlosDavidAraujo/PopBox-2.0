"use client";

import type { RouterOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import { type ReactNode, createContext, useContext } from "react";

type FolderContextValue = {
  folder: RouterOutputs["folders"]["getOneById"];
};

const FolderContext = createContext({} as FolderContextValue);

const useCurrentFolder = () => {
  const folderContext = useContext(FolderContext);
  if (!folderContext)
    throw new Error("useFolder must be used inside a FolderProvider");

  return folderContext;
};

const FolderProvider = ({
  children,
  initialFolder,
}: {
  initialFolder: RouterOutputs["folders"]["getOneById"];
  children: ReactNode;
}) => {
  const { data: folder } = api.folders.getOneById.useQuery(
    { folderId: initialFolder?.id ?? "" },
    { initialData: initialFolder },
  );

  return (
    <FolderContext.Provider value={{ folder }}>
      {children}
    </FolderContext.Provider>
  );
};

export { FolderProvider, useCurrentFolder };
