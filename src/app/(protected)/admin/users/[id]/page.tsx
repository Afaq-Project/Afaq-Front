import { notFound } from "next/navigation";

import { USERS } from "@/src/feature/admin/user-management/mocks/users";
import { getUserById } from "@/src/feature/admin/user-management/services/utils";
import { UserDetailView } from "@/src/feature/admin/user-management/components/UserDetailView";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = getUserById(USERS, id);

  if (!user) {
    notFound();
  }

  return <UserDetailView user={user} />;
}
