import { Package, Gift, Usb, CheckCircle2, ChevronRight } from "lucide-react";
import { Badge } from "../Ui";
import { useCountries } from "../../hooks/useCountries";
import { useCategories } from "../../hooks/useCategories";

// ─── Section wrapper ──────────────────────────────────────────────────────────
function ReviewSection({ title, onEdit, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
          {title}
        </h4>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
          >
            Edit <ChevronRight size={12} />
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Key-value row ────────────────────────────────────────────────────────────
function KVRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-xs font-semibold text-gray-500 flex-shrink-0 w-40">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium text-right">
        {value ?? <span className="text-gray-400 italic">—</span>}
      </span>
    </div>
  );
}

// ─── Product type badge ───────────────────────────────────────────────────────
function ProductTypeBadge({ form }) {
  if (form.is_usb)
    return (
      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Usb size={18} className="text-amber-600" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">USB Device</p>
          {form.is_product_variant && (
            <p className="text-xs text-amber-600">With size variants</p>
          )}
        </div>
        <Badge variant="amber">Physical + Digital</Badge>
      </div>
    );
  if (form.is_combo)
    return (
      <div className="flex items-center gap-3 p-3 bg-violet-50 border border-violet-200 rounded-xl">
        <Gift size={18} className="text-violet-600" />
        <div className="flex-1">
          <p className="text-sm font-bold text-violet-800">Combo Pack</p>
          <p className="text-xs text-violet-600">
            {form.selected_products.length} products bundled
          </p>
        </div>
        <Badge variant="violet">Bundle</Badge>
      </div>
    );
  return (
    <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
      <Package size={18} className="text-indigo-600" />
      <div className="flex-1">
        <p className="text-sm font-bold text-indigo-800">Single Product</p>
        <p className="text-xs text-indigo-600">
          Digital license or subscription
        </p>
      </div>
      <Badge variant="indigo">Single</Badge>
    </div>
  );
}

// ─── Inline currency icon ─────────────────────────────────────────────────────
const CurrencyIcon = ({ html }) => (
  <span dangerouslySetInnerHTML={{ __html: html }} />
);

// ─── Subscription periods review table ───────────────────────────────────────
// Unified for all product types — reads from form.subscription_periods.
function PeriodsTable({ periods, countries, isUsb, showVariants, onEdit }) {
  const filled = periods.filter((s) => s.duration && s.price && s.country_id);

  const getCountry = (country_id) =>
    countries?.find((c) => String(c.id) === String(country_id));

  const discountLabel = (s, country) => {
    if (!s.discount_type || !s.amount) return "—";
    if (s.discount_type === "percent") return `${s.amount}% off`;
    const icon = country?.currency_icon ?? "";
    return (
      <span>
        <CurrencyIcon html={icon} />
        {s.amount} off
      </span>
    );
  };

  // Build headers dynamically based on product type
  // Duration is only relevant for non-USB products
  const headers = isUsb
    ? ["Country & Currency", "Price", "Discount", "Expires", "Status"]
    : [
        "Duration",
        "Country & Currency",
        "Price",
        "Discount",
        "Expires",
        "Status",
      ];
  if (showVariants) headers.unshift("Variant"); // prepend for USB+variants
  if (isUsb) headers.unshift("Unit"); // prepend Unit for all USB

  return (
    <ReviewSection title="Pricing Periods" onEdit={onEdit}>
      {filled.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          No pricing periods added.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {headers.map((h) => (
                  <th
                    key={h}
                    className="text-xs font-semibold text-gray-500 pb-2 text-left pr-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filled.map((s, i) => {
                const country = getCountry(s.country_id);
                return (
                  <tr
                    key={i}
                    className="border-b border-gray-100 last:border-0"
                  >
                    {/* Unit — USB only, shown first */}
                    {isUsb && (
                      <td className="py-2.5 pr-4 text-gray-600 font-medium whitespace-nowrap">
                        {s.unit || <span className="text-gray-400">—</span>}
                      </td>
                    )}

                    {/* Variant — USB+variants only */}
                    {showVariants && (
                      <td className="py-2.5 pr-4 text-gray-600">
                        {s.variant_id ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                            #{s.variant_id}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    )}

                    {/* Duration — non-USB only */}
                    {!isUsb && (
                      <td className="py-2.5 pr-4 font-semibold text-gray-900 whitespace-nowrap">
                        {s.duration} mo.
                      </td>
                    )}

                    {/* Country + currency */}
                    <td className="py-2.5 pr-4">
                      {country ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {country.country_name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                            <CurrencyIcon html={country.currency_icon} />
                            {country.abbreviation.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">
                          Unknown country
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-2.5 pr-4 font-bold text-gray-900 whitespace-nowrap">
                      {country ? (
                        <>
                          <CurrencyIcon html={country.currency_icon} />
                          {s.price}
                        </>
                      ) : (
                        s.price
                      )}
                    </td>

                    {/* Discount */}
                    <td className="py-2.5 pr-4 text-gray-600 whitespace-nowrap">
                      {discountLabel(s, country)}
                    </td>

                    {/* Expires */}
                    <td className="py-2.5 pr-4 text-gray-500 text-xs whitespace-nowrap">
                      {s.discount_expires_at ? (
                        s.discount_expires_at.slice(0, 10)
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5">
                      <Badge variant={s.status ? "green" : "gray"}>
                        {s.status ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ReviewSection>
  );
}

// ─── Step 5 main ─────────────────────────────────────────────────────────────
export default function StepReview({ form, onGoToStep }) {
  const { data: countries } = useCountries();
  const { data: categories } = useCategories();

  const categoryName =
    categories?.find((c) => String(c.id) === String(form.category_id))?.name ??
    null;

  const showVariants = form.is_usb && form.is_product_variant;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Review & Publish</h2>
        <p className="text-sm text-gray-500 mt-1">
          Check everything below before publishing. Click any section to edit.
        </p>
      </div>

      {/* Product type */}
      <ProductTypeBadge form={form} />

      {/* Basic info */}
      <ReviewSection title="Basic Information" onEdit={() => onGoToStep(2)}>
        <KVRow label="Product Name" value={form.name} />
        <KVRow label="Category" value={categoryName} />
        <KVRow label="Status" value={form.status} />
        <KVRow
          label="Short Description"
          value={form.sort_description || null}
        />
      </ReviewSection>

      {/* Combo products */}
      {form.is_combo && form.selected_products.length > 0 && (
        <ReviewSection title="Combo Products" onEdit={() => onGoToStep(2)}>
          <div className="space-y-1.5">
            {form.selected_products.map((id, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                <span className="font-medium text-gray-700">
                  Product ID: {id}
                </span>
              </div>
            ))}
          </div>
        </ReviewSection>
      )}

      {/* Features */}
      <ReviewSection title="Product Features" onEdit={() => onGoToStep(3)}>
        <ul className="space-y-1.5">
          {form.product_details
            .filter((d) => d.trim())
            .map((d, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                {d}
              </li>
            ))}
        </ul>
      </ReviewSection>

      {/* Pricing periods — all product types */}
      <PeriodsTable
        periods={form.subscription_periods}
        countries={countries}
        isUsb={form.is_usb}
        showVariants={showVariants}
        onEdit={() => onGoToStep(4)}
      />

      {/* Ready indicator */}
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-green-800">Ready to publish</p>
          <p className="text-xs text-green-600">
            Review the information above, then click &quot;Publish Product&quot;
            to create it.
          </p>
        </div>
      </div>
    </div>
  );
}
