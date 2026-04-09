import { CalendarDays, RefreshCw, Ban, Globe } from "lucide-react";
import StatusUpdatePanel from "./StatusUpdatePanel";
import { formatPrice } from "../../../utils/formatPrice";

function FieldRow({ label, children }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right">
        {children}
      </span>
    </div>
  );
}

function formatDateShort(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrderDetailSidebar({ order, token, onStatusUpdated }) {
  const currency = order.country?.currency_icon
    ? new DOMParser().parseFromString(order.country.currency_icon, "text/html")
        .body.textContent
    : "৳";

  return (
    <div className="space-y-5">
      {/* ── Order Summary ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Order Summary
          </h3>
        </div>
        <div className="px-5 py-4">
          <FieldRow label="Start Date">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              {formatDateShort(order.start_at)}
            </span>
          </FieldRow>
          <FieldRow label="Expire Date">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              {order.expire_at ? formatDateShort(order.expire_at) : "No Expiry"}
            </span>
          </FieldRow>
          {order?.domain && (
            <FieldRow label="Domain">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {order.domain}
              </span>
            </FieldRow>
          )}
          <FieldRow label="Renewal">
            {order.is_renewal ? (
              <span className="flex items-center gap-1 text-indigo-600">
                <RefreshCw className="w-3.5 h-3.5" /> Yes
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400">
                <Ban className="w-3.5 h-3.5" /> No
              </span>
            )}
          </FieldRow>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">
              Total Amount
            </span>
            <span className="text-lg font-bold text-slate-900">
              {currency}
              {formatPrice(order.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Customer ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Customer
          </h3>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          <FieldRow label="Name">{order.user?.name ?? "—"}</FieldRow>
          <FieldRow label="Email">{order.user?.email ?? "—"}</FieldRow>
          <FieldRow label="Address">{order.user?.address ?? "—"}</FieldRow>
        </div>
      </div>

      {/* ── Status Update Panel ── */}
      <StatusUpdatePanel
        order={order}
        token={token}
        onSuccess={onStatusUpdated}
      />
    </div>
  );
}
