import { ChevronRight, Package, Usb, Layers, RotateCcw } from "lucide-react";
import OrderStatusBadge, { PaymentStatusBadge } from "./OrderStatusBadge";
import { useNavigate } from "react-router";

function ProductTypePill({ order }) {
  const { is_combo, is_variant, is_usb } = order.product;
  if (is_combo)
    return (
      <span className="inline-flex w-fit items-center gap-1 text-xs text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
        <Layers className="w-3 h-3" /> Combo
      </span>
    );
  if (is_usb && is_variant)
    return (
      <span className="inline-flex w-fit items-center gap-1 text-xs text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full">
        <Usb className="w-3 h-3" /> USB + Variant
      </span>
    );
  if (is_usb)
    return (
      <span className="inline-flex w-fit items-center gap-1 text-xs text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full">
        <Usb className="w-3 h-3" /> USB
      </span>
    );
  if (is_variant)
    return (
      <span className="inline-flex w-fit items-center gap-1 text-xs text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
        <RotateCcw className="w-3 h-3" /> Variant
      </span>
    );
  return (
    <span className="inline-flex w-fit items-center gap-1 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
      <Package className="w-3 h-3" /> Single
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderRow({ order }) {
  const navigate = useNavigate();
  const payment = order?.payment;
  const currencyIcon = order.country?.currency_icon
    ? new DOMParser().parseFromString(order.country.currency_icon, "text/html")
        .body.textContent
    : "৳";

  return (
    <tr
      onClick={() => navigate(`/dashboard/bitss/orders/${order.id}`)}
      className="group cursor-pointer hover:bg-indigo-50/40 transition-colors border-b border-slate-100 last:border-0"
    >
      {/* Order ID */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="font-mono text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
          #{order.order_number}
        </span>
      </td>

      {/* Product */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-800 line-clamp-1">
            {order.product.name}
          </span>
          <ProductTypePill order={order} />
        </div>
      </td>

      {/* Amount */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-sm font-semibold text-slate-800">
          {currencyIcon}
          {order.amount.toLocaleString()}
        </span>
        {order.discount && (
          <div className="text-xs text-emerald-600">-{order.discount} off</div>
        )}
      </td>

      {/* Order Status */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <OrderStatusBadge status={order.status} />
      </td>

      {/* Payment */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <PaymentStatusBadge status={payment?.status} />
          <span className="text-xs text-slate-400 capitalize">
            {payment?.payment_method?.replace("_", " ")}
          </span>
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-xs text-slate-500">
          {formatDate(order.start_at)}
        </span>
      </td>

      {/* Arrow */}
      <td className="px-4 py-3.5 whitespace-nowrap text-right">
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all ml-auto" />
      </td>
    </tr>
  );
}
