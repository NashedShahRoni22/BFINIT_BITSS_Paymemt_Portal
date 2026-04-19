import { Clock, Tag } from "lucide-react";

function formatDuration(months) {
  if (!months) return "—";
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} Year${years > 1 ? "s" : ""}`;
  }
  return `${months} Month${months > 1 ? "s" : ""}`;
}

export default function SubscriptionInfo({ subscription }) {
  if (!subscription?.duration) return null;

  const { duration, discount_type, amount } = subscription;

  const hasDiscount = discount_type && amount != null;
  const discountLabel = hasDiscount
    ? discount_type === "percent"
      ? `${amount}% off`
      : `${amount} off`
    : null;

  return (
    <>
      {/* Duration row */}
      <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
        <span className=" text-sm text-gray-500">Duration</span>
        <span className="text-sm flex items-center gap-2 font-semibold text-gray-800">
          <Clock size={14} className="text-gray-400" />{" "}
          {formatDuration(duration)}
        </span>
      </div>

      {/* Discount row — only shown when a discount exists */}
      {hasDiscount && (
        <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
          <span className=" text-sm text-gray-500">Discount</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            <Tag size={10} />
            {discountLabel}
          </span>
        </div>
      )}
    </>
  );
}
