import { Pagination } from "@/src/shared/ui/Pagination";
import { ManagedUser } from "../types/user";
import { UserRow } from "./UserRow";

export function UsersTable({
  users,
  page,
  pageCount,
  onPageChange,
}: {
  users: ManagedUser[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="bg-white shadow-card rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-100 text-caption text-neutral-800 uppercase tracking-wide">
              <th className="px-5 py-4 font-medium">Name / email</th>
              <th className="px-5 py-4 font-medium">Signup method</th>
              <th className="px-5 py-4 font-medium">Tier</th>
              <th className="px-5 py-4 font-medium">Profile completion</th>
              <th className="px-5 py-4 font-medium">Signup date</th>
              <th className="px-5 py-4 font-medium">Last active</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center">
                  <p className="font-medium text-neutral-800 text-small">
                    No users match your filters
                  </p>
                  <p className="mt-1 text-neutral-500 text-small">
                    Try adjusting the search or filters above.
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => <UserRow key={user.id} user={user} />)
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
        className="px-5 py-4 border-neutral-100 border-t"
      />
    </div>
  );
}
