import { Mail, MapPin } from "lucide-react";

export default function UserCard({ user }) {
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
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${colorClass}`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 truncate">{user.name}</p>
          <p className="text-xs text-gray-400">ID #{user.id}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.email || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.address || "No address"}</span>
        </div>
      </div>
    </div>
  );
}
