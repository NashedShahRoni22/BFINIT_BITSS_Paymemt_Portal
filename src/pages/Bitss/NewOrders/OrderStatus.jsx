// components/orders/OrdersStats.jsx
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";

export default function OrdersStats({ orders }) {
  const total = orders.length;
  const processing = orders.filter((o) => o.status === "processing").length;
  const active = orders.filter((o) => o.status === "active").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  const currency = orders[0]?.country?.currency_icon
    ? new DOMParser().parseFromString(
        orders[0].country.currency_icon,
        "text/html",
      ).body.textContent
    : "৳";

  const stats = [
    {
      label: "Total Orders",
      value: total,
      icon: ShoppingBag,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      label: "Processing",
      value: processing,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Revenue",
      value: `${currency}${totalRevenue.toLocaleString()}`,
      icon: XCircle,
      color: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
      wide: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.bg} ${s.border}`}
        >
          <div className={`p-2 rounded-lg bg-white shadow-sm ${s.color}`}>
            <s.icon className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
