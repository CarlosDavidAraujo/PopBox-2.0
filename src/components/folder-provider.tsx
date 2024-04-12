"use client";

import type { RouterOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import { type ReactNode, createContext, useContext } from "react";

type FolderContextValue = {
  folder: RouterOutputs["folders"]["getOneById"];
  storagePath: string;
};

const FolderContext = createContext({} as FolderContextValue);

const useFolder = () => {
  const folderContext = useContext(FolderContext);
  if (!folderContext)
    throw new Error("useFolder must be used inside a FolderProvider");

  return folderContext;
};

const FolderProvider = ({
  children,
  initialFolder,
  folderId,
  storagePath,
}: {
  initialFolder: RouterOutputs["folders"]["getOneById"];
  children: ReactNode;
  folderId: string;
  storagePath: string;
}) => {
  const { data: folder } = api.folders.getOneById.useQuery(
    { folderId },
    { initialData: initialFolder },
  );

  return (
    <FolderContext.Provider value={{ folder, storagePath }}>
      {children}
    </FolderContext.Provider>
  );
};

export { FolderProvider, useFolder };
