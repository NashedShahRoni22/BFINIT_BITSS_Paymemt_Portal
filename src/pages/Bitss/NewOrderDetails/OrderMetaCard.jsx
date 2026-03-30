import { Calendar, CalendarX, Globe, RotateCcw, Tag } from "lucide-react";

function MetaRow({ icon: Icon, label, value, accent = false }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="p-1.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 flex justify-between items-center gap-4">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </span>
        <span
          className={`text-sm font-medium text-right ${
            accent ? "text-indigo-600" : "text-slate-700"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrderMetaCard({ order }) {
  const currency = order.country?.currency_icon
    ? new DOMParser().parseFromString(order.country.currency_icon, "text/html")
        .body.textContent
    : "৳";

  const discountDisplay = order.discount
    ? `${order.discount}${order.discount_type === "percent" ? "%" : ` ${currency}`} off`
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Order Summary
      </h2>

      <MetaRow icon={Calendar} label="Start Date" value={fmt(order.start_at)} />
      <MetaRow
        icon={CalendarX}
        label="Expiry Date"
        value={order.expire_at ? fmt(order.expire_at) : "No Expiry"}
      />
      <MetaRow
        icon={Globe}
        label="Country"
        value={order.country?.country_name}
      />
      <MetaRow icon={Tag} label="Discount" value={discountDisplay} accent />
      <MetaRow
        icon={RotateCcw}
        label="Renewal"
        value={order.is_renew ? "Yes" : "No"}
      />

      {/* Total row */}
      <div className="pt-3 mt-1 border-t border-slate-200 flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-600">
          Total Amount
        </span>
        <span className="text-xl font-bold text-slate-900">
          {currency}
          {order.amount?.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
