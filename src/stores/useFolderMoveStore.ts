import { create } from "zustand";

type FolderMoveStore = {
  folderId: string;
  setFolderId: (folderId: string) => void;
};

export const useFolderMoveStore = create<FolderMoveStore>()((set) => ({
  folderId: "",
  setFolderId: (folderId) => set({ folderId }),
}));
