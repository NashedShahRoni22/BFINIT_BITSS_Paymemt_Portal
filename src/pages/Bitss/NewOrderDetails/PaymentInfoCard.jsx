import { Building2 } from "lucide-react";
import { PaymentStatusBadge } from "../NewOrders/OrderStatusBadge";

function InfoRow({ label, value, mono = false }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span
        className={`text-sm text-slate-700 text-right ${
          mono ? "font-mono" : "font-medium"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function BankCard({ bank }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Building2 className="w-4 h-4 text-slate-400" />
        {bank.bank_name}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-slate-400">Account No</span>
        <span className="font-mono text-slate-700">{bank.account_no}</span>
        <span className="text-slate-400">Branch</span>
        <span className="text-slate-700">{bank.branch}</span>
        <span className="text-slate-400">Routing</span>
        <span className="font-mono text-slate-700">{bank.routing_number}</span>
        <span className="text-slate-400">Swift</span>
        <span className="font-mono text-slate-700">{bank.swift_code}</span>
      </div>
    </div>
  );
}

export default function PaymentInfoCard({ payments, country }) {
  const payment = payments?.[0];
  if (!payment) return null;

  const currency = country?.currency_icon
    ? new DOMParser().parseFromString(country.currency_icon, "text/html").body
        .textContent
    : "৳";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Payment
        </h2>
        <PaymentStatusBadge status={payment.status} />
      </div>

      <div>
        <InfoRow
          label="Amount"
          value={`${currency}${payment.amount?.toLocaleString()}`}
        />
        <InfoRow
          label="Method"
          value={payment.payment_method?.replace(/_/g, " ")}
        />
        <InfoRow label="Gateway" value={payment.payment_gateway} />
        <InfoRow label="Transaction ID" value={payment.transaction_id} mono />
        <InfoRow label="Type" value={payment.payment_type} />
        <InfoRow
          label="Paid At"
          value={new Date(payment.paid_at).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      </div>

      {/* Bank info */}
      {country?.bank_informations?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Bank Accounts
          </p>
          {country.bank_informations.map((bank) => (
            <BankCard key={bank.id} bank={bank} />
          ))}
        </div>
      )}
    </div>
  );
}
