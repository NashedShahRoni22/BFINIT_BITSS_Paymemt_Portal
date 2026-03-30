// components/orders/OrdersFilterBar.jsx
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All Orders" },
  { value: "processing", label: "Processing" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
];

export default function OrdersFilterBar({ filters, onChange, total }) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilter = filters.search || filters.status;

  const handleClear = () => {
    onChange({ search: "", status: "" });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, order ID..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${
            showFilters || filters.status
              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {filters.status && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 ml-0.5" />
          )}
        </button>

        {hasActiveFilter && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Expandable status filter row */}
      {showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500 mr-1">
            Status:
          </span>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, status: opt.value })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                filters.status === opt.value
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      <div className="text-xs text-slate-400">
        Showing <span className="font-semibold text-slate-600">{total}</span>{" "}
        order{total !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
