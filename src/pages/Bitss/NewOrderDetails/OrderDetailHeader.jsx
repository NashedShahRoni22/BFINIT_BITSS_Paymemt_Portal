import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import OrderStatusBadge from "../NewOrders/OrderStatusBadge";

const STATUS_TRANSITIONS = {
  processing: ["active", "cancelled"],
  active: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  expired: [],
};

const STATUS_LABELS = {
  active: "Mark as Active",
  completed: "Mark as Completed",
  cancelled: "Cancel Order",
};

export default function OrderDetailHeader({
  order,
  onStatusChange,
  isUpdating,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const transitions = STATUS_TRANSITIONS[order.status] ?? [];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Order #{order.id}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Placed on{" "}
            {new Date(order.start_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Status action button */}
      {transitions.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-60"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Update Status
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
              {transitions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setOpen(false);
                    onStatusChange(s);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition ${
                    s === "cancelled"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-slate-700"
                  }`}
                >
                  {STATUS_LABELS[s] ?? s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
