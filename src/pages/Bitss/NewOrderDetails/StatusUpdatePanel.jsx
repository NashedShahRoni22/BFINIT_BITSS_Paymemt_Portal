import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Smartphone,
} from "lucide-react";
import {
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  MANUAL_PAYMENT_METHODS,
} from "../../../utils/Orderdetailconstants";

const baseUrl = import.meta.env.VITE_NEW_BASE_URL;

export default function StatusUpdatePanel({ order, token, onSuccess }) {
  const queryClient = useQueryClient();
  const payment = order?.payment;
  const paymentMethod = payment?.payment_method ?? "";
  const defaultPaymentStatus = payment?.status;
  const isManualPayment = MANUAL_PAYMENT_METHODS.includes(paymentMethod);

  const [orderStatus, setOrderStatus] = useState(order.status ?? "processing");
  const [paymentStatus, setPaymentStatus] = useState(
    payment?.status ?? "pending",
  );
  const [toast, setToast] = useState(null);

  const isStripePayment = paymentMethod === "stripe";

  const isDirty =
    orderStatus !== order.status ||
    (isManualPayment && paymentStatus !== payment?.status);

  const resolvedPaymentStatus = isManualPayment
    ? paymentStatus
    : (payment?.status ?? "pending");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        order_status: orderStatus,
        ...(defaultPaymentStatus !== "paid" && {
          payment_status: resolvedPaymentStatus,
        }),
        payment_method: paymentMethod || "bank_transfer",
      };
      const res = await fetch(`${baseUrl}/orders/order/approve/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Update failed");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      setToast({ type: "success", msg: "Order updated successfully." });
      onSuccess?.();
      setTimeout(() => setToast(null), 3500);
    },
    onError: (err) => {
      setToast({ type: "error", msg: err.message });
      setTimeout(() => setToast(null), 4000);
    },
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Manage Status
        </h3>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* ── Order Status ── */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Order Status
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition text-slate-800"
          >
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            Controls fulfillment lifecycle
          </p>
        </div>

        {/* ── Payment Status — manual methods only ── */}
        {!isStripePayment && isManualPayment ? (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Payment Verification
              </label>
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600">
                {paymentMethod === "mobile_banking" ? (
                  <Smartphone className="w-3 h-3" />
                ) : (
                  <Building2 className="w-3 h-3" />
                )}
                {paymentMethod === "mobile_banking"
                  ? "Mobile"
                  : "Bank Transfer"}
              </span>
            </div>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition text-slate-800"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 border border-amber-100 rounded-md px-2.5 py-1.5 leading-relaxed">
              Only mark as <strong>Paid</strong> after confirming the transfer
              receipt in your bank or mobile account.
            </p>
          </div>
        ) : (
          paymentMethod && (
            <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                Payment status is managed automatically for{" "}
                <span className="font-medium text-slate-500 capitalize">
                  {paymentMethod.replace("_", " ")}
                </span>{" "}
                payments.
              </span>
            </div>
          )
        )}

        {/* ── Toast feedback ── */}
        {toast && (
          <div
            className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2.5 border ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            {toast.msg}
          </div>
        )}

        {/* ── Apply button ── */}
        <button
          onClick={() => mutate()}
          disabled={isPending || !isDirty}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition
            bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Apply Changes"
          )}
        </button>

        {!isDirty && !isPending && (
          <p className="text-center text-xs text-slate-400">
            No changes to save
          </p>
        )}
      </div>
    </div>
  );
}
