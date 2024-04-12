import { FolderContextMenu } from "@/components/folder-context-menu";
import { FolderProvider } from "@/components/folder-provider";
import { api } from "@/trpc/server";

export default async function TrashPage({
  params,
}: {
  params: { folderId: string };
}) {
  const initialFolder = await api.folders.getAllInTrash({
    folderId: params.folderId,
  });

  return (
    <div className="flex flex-grow">
      {initialFolder?.child_folders.length === 0 ? (
        <div>Lixeira vazia</div>
      ) : (
        <FolderProvider
          folderId={params.folderId}
          initialFolder={initialFolder}
          storagePath="/_trash"
        >
          <FolderContextMenu page="trash" />
        </FolderProvider>
      )}
    </div>
  );
}
