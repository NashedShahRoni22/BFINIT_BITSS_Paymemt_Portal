import { ArrowLeft, Mail, MapPin, User } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0">
        <Icon size={15} className="text-indigo-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: token } = useAuth();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/admin/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "User not found");
      // handle both object and array response shapes
      return Array.isArray(json.message) ? json.message[0] : json.message;
    },
    enabled: !!id && !!token,
  });

  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const colorClass = user ? colors[user.id % colors.length] : colors[0];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading user…</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">
            {error?.message ?? "Failed to load user."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Users
          </button>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      {/* Back nav */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span
            className="hover:text-indigo-600 cursor-pointer transition-colors"
            onClick={() => navigate("/dashboard/bitss/users")}
          >
            Users
          </span>
          <span>/</span>
          <span className="font-semibold text-gray-800">{user?.name}</span>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Top banner */}
        <div className="h-20 bg-gradient-to-r from-indigo-500 to-violet-500" />

        {/* Avatar + name */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <div
              className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold shadow-sm ${colorClass}`}
            >
              {initials}
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-400">User ID #{user?.id}</p>

          {/* Detail rows */}
          <div className="mt-5">
            <DetailRow icon={User} label="Full Name" value={user?.name} />
            <DetailRow icon={Mail} label="Email Address" value={user?.email} />
            <DetailRow icon={MapPin} label="Address" value={user?.address} />
          </div>
        </div>
      </div>
    </div>
  );
}
