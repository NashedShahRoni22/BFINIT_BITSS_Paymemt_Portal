import { useState } from "react";
import { Users as UsersIcon, Search } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import UserTable from "../../components/card/UserTable";

export default function Users() {
  const { data: users = [], isLoading, isError, error } = useUsers();
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.address?.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">Loading users...</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">
          {error?.message || "Failed to load users"}
        </p>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          User Management
        </h1>
        <p className="text-neutral-600">View and manage all registered users</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <span className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-700">{users.length}</span>{" "}
          users
        </span>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No users found</p>
          <p className="text-sm text-gray-500 mt-2">
            {search ? "Try a different search term." : "No users exist yet."}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && <UserTable users={filtered} />}
    </div>
  );
}
