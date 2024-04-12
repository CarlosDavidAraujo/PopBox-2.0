import { FolderContextMenu } from "@/components/folder-context-menu";
import { FolderMove } from "@/components/folder-tree";
import { FolderProvider } from "@/components/folder-provider";
import { api } from "@/trpc/server";

export default async function TrashPage() {
  const trash = await api.folders.getAllInTrash({ folderId: "_trash" });

  return (
    <div className="flex flex-grow">
      <FolderMove />
      {trash?.child_folders.length === 0 ? (
        <div>Lixeira vazia</div>
      ) : (
        <FolderProvider
          folderId="_trash"
          initialFolder={trash}
          storagePath="/_trash"
        >
          <FolderContextMenu page="trash" />
        </FolderProvider>
      )}
    </div>
  );
}
