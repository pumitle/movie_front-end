interface UserItem {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email: string;
  role: string;
}

interface Props {
  users: UserItem[];
}

const UserTable = ({ users }: Props) => {
  const roleStyles: Record<string, string> = {
    MANAGER: "border-red-200 bg-red-50 text-red-700",
    TEAMLEADER: "border-blue-200 bg-blue-50 text-blue-700",
    FLOORSTAFF: "border-sky-200 bg-sky-50 text-sky-700",
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-3 py-3">Name</th>
            <th className="px-3 py-3">Email</th>
            <th className="px-3 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
            const displayName = fullName || user.name || "-";
            const role = user.role.toUpperCase();
            const roleClass = roleStyles[role] ?? "border-gray-200 bg-gray-50 text-gray-700";

            return (
              <tr key={user.id} className="border-b border-gray-50 text-gray-800">
                <td className="px-3 py-3 font-medium">{displayName}</td>
                <td className="px-3 py-3">{user.email}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${roleClass}`}>
                    {role}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
