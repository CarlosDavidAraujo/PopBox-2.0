import { UsersTable } from "@/components/users-table";
import { api } from "@/trpc/server";

export default async function AdminUsersPage() {
  const initialUsers = await api.users.getAll();
  return <UsersTable initialUsers={initialUsers} />;
}
