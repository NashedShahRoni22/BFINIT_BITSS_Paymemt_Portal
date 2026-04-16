import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";

function UserRow({ user }) {
  const navigate = useNavigate();

  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const colorClass = colors[user.id % colors.length];

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <tr
      onClick={() => navigate(`/dashboard/bitss/users/${user.id}`)}
      className="border-b border-gray-100 hover:bg-indigo-50/50 cursor-pointer transition-colors group"
    >
      {/* ID */}
      <td className="px-5 py-3.5 text-sm text-gray-400 font-medium w-16">
        #{user.id}
      </td>

      {/* Name + Avatar */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorClass}`}
          >
            {initials}
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {user.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-5 py-3.5 text-sm text-gray-600">{user.email || "—"}</td>

      {/* Address */}
      <td className="px-5 py-3.5 text-sm text-gray-500">
        {user.address || "—"}
      </td>

      {/* Arrow */}
      <td className="px-5 py-3.5 w-10">
        <ChevronRight
          size={15}
          className="text-gray-300 group-hover:text-indigo-500 transition-colors"
        />
      </td>
    </tr>
  );
}

export default function UserTable({ users }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
