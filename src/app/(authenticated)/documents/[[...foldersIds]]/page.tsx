import { api } from "@/trpc/server";
import { Folders } from "../components/folders";

export default async function FoldersPage({
  params,
}: {
  params: { foldersIds?: string[] };
}) {
  const foldersIds = params.foldersIds ?? [];
  const parentFolderId = foldersIds.length
    ? parseInt(foldersIds[foldersIds.length - 1], 10)
    : null;

  const initialFolders = await api.folders.manyByParentId({ parentFolderId });

  const parentFolders = await api.folders.byIdWithParents({
    folderId: parentFolderId,
  });

  console.log(parentFolders);

  return <Folders initialFolders={initialFolders} />;
}
