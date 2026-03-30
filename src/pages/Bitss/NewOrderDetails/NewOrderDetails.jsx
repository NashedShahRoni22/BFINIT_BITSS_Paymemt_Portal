import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Package,
  Layers,
  Usb,
  RotateCcw,
  Building2,
  RefreshCw,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import OrderDetailSidebar from "./OrderDetailSidebar";
import OrderStatusBadge, {
  PaymentStatusBadge,
} from "../NewOrders/OrderStatusBadge";

const baseUrl = import.meta.env.VITE_NEW_BASE_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseCurrency(htmlEntity) {
  if (!htmlEntity) return "৳";
  return new DOMParser().parseFromString(htmlEntity, "text/html").body
    .textContent;
}

// ─── Small reusable pieces ────────────────────────────────────────────────────

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {title && (
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {title}
          </h3>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

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

function ProductTypePill({ product }) {
  const { is_combo, is_variant, is_usb } = product;
  if (is_combo)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
        <Layers className="w-3 h-3" /> Combo
      </span>
    );
  if (is_usb && is_variant)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full">
        <Usb className="w-3 h-3" /> USB + Variant
      </span>
    );
  if (is_usb)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full">
        <Usb className="w-3 h-3" /> USB
      </span>
    );
  if (is_variant)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
        <RotateCcw className="w-3 h-3" /> Variant
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
      <Package className="w-3 h-3" /> Single
    </span>
  );
}

function BankAccountCard({ account }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
      <div className="p-1.5 bg-white border border-slate-200 rounded-md mt-0.5">
        <Building2 className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700">
          {account.bank_name}
        </p>
        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5">
          {account.account_number && (
            <span className="text-xs text-slate-500">
              Acc:{" "}
              <span className="font-mono text-slate-700">
                {account.account_number}
              </span>
            </span>
          )}
          {account.branch_name && (
            <span className="text-xs text-slate-500">
              Branch: {account.branch_name}
            </span>
          )}
          {account.routing_number && (
            <span className="text-xs text-slate-500">
              Routing: {account.routing_number}
            </span>
          )}
          {account.swift_code && (
            <span className="text-xs text-slate-500">
              Swift: {account.swift_code}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
        >
          {[...Array(4)].map((_, j) => (
            <div
              key={j}
              className="h-4 bg-slate-100 rounded animate-pulse"
              style={{ width: `${60 + j * 10}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user: token } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/orders/order/details/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Failed to fetch order");
      return json;
    },
    enabled: !!token && !!orderId,
    staleTime: 1000 * 60,
  });

  const order = data?.data;
  const payment = order?.payments?.[0];
  const currency = parseCurrency(order?.country?.currency_icon);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition text-slate-500"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            {order ? (
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Order #{order.id}
                  </h1>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-slate-400 mt-0.5">
                  Placed on {formatDate(order.start_at)}
                </p>
              </div>
            ) : (
              <div className="h-7 w-40 bg-slate-100 rounded animate-pulse" />
            )}
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* ── Error ── */}
        {isError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Failed to load order</p>
              <p className="text-red-500 text-xs mt-0.5">
                {error?.message || "Unknown error"}
              </p>
            </div>
          </div>
        )}

        {/* ── Body ── */}
        {isLoading ? (
          <DetailSkeleton />
        ) : order ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* ── Left: 2-col main area ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Product */}
              <SectionCard title="Product">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-base font-semibold text-slate-800">
                      {order.product.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {order.product.slug}
                    </p>
                  </div>
                  <ProductTypePill product={order.product} />
                </div>
                {order.product.description && (
                  <p className="text-sm text-slate-500 mb-3">
                    {order.product.description}
                  </p>
                )}
                {order.product.features?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Features
                    </p>
                    {order.product.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {f.name ?? f}
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Payment details */}
              <SectionCard title="Payment">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-500">Status</span>
                  <PaymentStatusBadge status={payment?.status} />
                </div>
                <FieldRow label="Amount">
                  <span className="text-base font-bold text-slate-900">
                    {currency}
                    {order.amount?.toLocaleString()}
                  </span>
                </FieldRow>
                <FieldRow label="Method">
                  <span className="capitalize">
                    {payment?.payment_method?.replace("_", " ") ?? "—"}
                  </span>
                </FieldRow>
                <FieldRow label="Type">
                  <span className="capitalize">
                    {payment?.payment_type ?? "—"}
                  </span>
                </FieldRow>
                {payment?.paid_at && (
                  <FieldRow label="Paid at">
                    {formatDate(payment.paid_at)}
                  </FieldRow>
                )}
                {order.bank_accounts?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Bank Accounts
                    </p>
                    {order.bank_accounts.map((acc, i) => (
                      <BankAccountCard key={i} account={acc} />
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* ── Right sidebar ── */}
            <OrderDetailSidebar
              order={order}
              token={token}
              onStatusUpdated={() => refetch()}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
