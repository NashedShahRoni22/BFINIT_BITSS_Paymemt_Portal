// pages/admin/NewOrders.jsx
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw, PackageSearch } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import OrdersStats from "./OrderStatus";
import OrdersFilterBar from "./OrdersFilterbar";
import OrderRow from "./OrderRow";

const baseUrl = import.meta.env.VITE_NEW_BASE_URL;

// ─── Skeleton row ────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ hasFilter }) {
  return (
    <tr>
      <td colSpan={7}>
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
          <PackageSearch className="w-10 h-10 mb-3 opacity-30" />
          <p className="font-medium text-slate-500">No orders found</p>
          <p className="text-sm mt-1">
            {hasFilter
              ? "Try adjusting your search or filters."
              : "Orders will appear here once placed."}
          </p>
        </div>
      </td>
    </tr>
  );
}

// ─── Table header ─────────────────────────────────────────────────────────────
function TableHead() {
  const cols = [
    "Order ID",
    "Product",
    "Amount",
    "Order Status",
    "Payment",
    "Date",
    "",
  ];
  return (
    <thead>
      <tr className="border-b border-slate-200 bg-slate-50/70">
        {cols.map((col) => (
          <th
            key={col}
            className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide uppercase"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NewOrders() {
  const { user: token } = useAuth();
  const [filters, setFilters] = useState({ search: "", status: "" });

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/orders/index`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Failed to fetch orders");
      return json;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });

  const orders = data?.data ?? [];

  // Client-side filtering
  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        !filters.search ||
        order.product.name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        String(order.id).includes(filters.search);

      const matchStatus = !filters.status || order.status === filters.status;

      return matchSearch && matchStatus;
    });
  }, [orders, filters]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Orders
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage and review all customer orders
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        {!isLoading && !isError && orders.length > 0 && (
          <OrdersStats orders={orders} />
        )}

        {/* ── Error banner ── */}
        {isError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Failed to load orders</p>
              <p className="text-red-500 text-xs mt-0.5">
                {error?.message || "Unknown error"}
              </p>
            </div>
          </div>
        )}

        {/* ── Filter bar ── */}
        <OrdersFilterBar
          filters={filters}
          onChange={setFilters}
          total={filtered.length}
        />

        {/* ── Table card ── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <TableHead />
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <EmptyState
                    hasFilter={!!(filters.search || filters.status)}
                  />
                ) : (
                  filtered.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer note ── */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-center text-xs text-slate-400 pb-4">
            Click any row to view order details and manage it.
          </p>
        )}
      </div>
    </div>
  );
}
