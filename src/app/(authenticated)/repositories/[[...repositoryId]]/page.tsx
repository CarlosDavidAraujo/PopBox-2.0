import { api } from "@/trpc/server";
import { Repository } from "../repository";

export default async function RepositoriesPage({
  params,
}: {
  params: { repositoriesIds?: string[] };
}) {
  const repositories = await api.repositories.all();
  const currentPath = params.repositoriesIds
    ? params.repositoriesIds.join("/")
    : "";
  return (
    <div className="flex-col space-y-6">
      <h1 className="text-lg font-semibold md:text-2xl">Repositórios</h1>
      <div className="flex flex-grow items-start gap-4">
        {repositories.map((repository) => (
          <Repository
            key={repository.id}
            repository={repository}
            parentPath={currentPath}
          />
        ))}
      </div>
    </div>
  );
}
