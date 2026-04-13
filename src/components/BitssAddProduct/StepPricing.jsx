import { Plus, Trash2, Info } from "lucide-react";
import { SelectInput, TextInput, SectionCard, InfoBox, Toggle } from "../Ui";
import { DISCOUNT_TYPES } from "../../hooks/useProductForm";
import { useCountries } from "../../hooks/useCountries";
import { useVariants } from "../../hooks/useVariants";

// ─── Single period row ────────────────────────────────────────────────────────
function PeriodRow({
  row,
  index,
  onChange,
  onRemove,
  canRemove,
  isUsb,
  showVariants,
}) {
  const { data: countries, isLoading } = useCountries();
  const { data: variants = [], isLoading: variantsLoading } = useVariants();

  const set = (field, value) => onChange(index, { ...row, [field]: value });

  const showDiscount = row.discount_type && row.discount_type !== "";

  const selectedCountry = countries?.find(
    (c) => String(c.id) === String(row.country_id),
  );

  const CurrencySymbol = () =>
    selectedCountry ? (
      <span
        dangerouslySetInnerHTML={{ __html: selectedCountry.currency_icon }}
      />
    ) : (
      <span>—</span>
    );

  const currencyLabel = selectedCountry
    ? `Price (${selectedCountry.abbreviation.toUpperCase()})`
    : "Price";

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
      {/* Row header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Entry #{index + 1}
          </span>
          {selectedCountry && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full">
              {selectedCountry.country_name} ·{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: selectedCountry.currency_icon,
                }}
              />
            </span>
          )}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Row 1: core fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Country — always required */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Country <span className="text-red-500">*</span>
          </label>
          <SelectInput
            value={row.country_id}
            onChange={(e) => set("country_id", e.target.value)}
            error={!row.country_id}
          >
            <option value="" disabled>
              {isLoading ? "Loading…" : "Select country…"}
            </option>
            {!isLoading &&
              countries?.map((c) => (
                <option key={String(c.id)} value={String(c.id)}>
                  {c.country_name} ({c.abbreviation.toUpperCase()})
                </option>
              ))}
          </SelectInput>
          {!row.country_id && <p className="text-xs text-red-400">Required</p>}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {currencyLabel} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">
              <CurrencySymbol />
            </span>
            <TextInput
              type="number"
              step="0.01"
              min="0"
              value={row.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0.00"
              className="pl-7"
              disabled={!row.country_id}
            />
          </div>
          {!row.country_id && (
            <p className="text-xs text-gray-400 italic">
              Select a country first
            </p>
          )}
        </div>

        {/* Duration — non-USB only */}
        {!isUsb && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Duration (mo.) <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="number"
              min="1"
              value={row.duration}
              onChange={(e) => set("duration", e.target.value)}
              placeholder="12"
            />
          </div>
        )}

        {/* Unit — USB only */}
        {isUsb && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Unit{" "}
              <span className="normal-case text-gray-400 font-normal">
                (1, 6, 10…)
              </span>
            </label>
            <TextInput
              type="number"
              min="1"
              value={row.unit}
              onChange={(e) => set("unit", e.target.value)}
              placeholder="1"
            />
          </div>
        )}

        {/* Variant — USB with variants only */}
        {showVariants && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Variant
            </label>
            <SelectInput
              value={row.variant_id}
              onChange={(e) => set("variant_id", e.target.value)}
            >
              <option value="">
                {variantsLoading ? "Loading…" : "All Variants"}
              </option>
              {!variantsLoading &&
                variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.variant_name ?? v.name ?? `Variant ${v.id}`}
                  </option>
                ))}
            </SelectInput>
          </div>
        )}
      </div>

      {/* Row 2: discount + status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Discount Type
          </label>
          <SelectInput
            value={row.discount_type}
            onChange={(e) => set("discount_type", e.target.value)}
            disabled={!row.country_id}
          >
            {DISCOUNT_TYPES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </SelectInput>
        </div>

        {showDiscount && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Discount Amount
              </label>
              <TextInput
                type="number"
                step="0.01"
                min="0"
                value={row.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder={
                  row.discount_type === "percent" ? "e.g. 10" : "e.g. 5.00"
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Discount Expires
              </label>
              <TextInput
                type="datetime-local"
                value={row.discount_expires_at}
                onChange={(e) => set("discount_expires_at", e.target.value)}
              />
            </div>
          </>
        )}

        {/* Status toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status
          </label>
          <Toggle
            checked={row.status}
            onChange={(val) => set("status", val)}
            label={row.status ? "Active" : "Inactive"}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Pricing section (unified — all product types) ────────────────────────────
function PricingSection({ form, update, errors }) {
  const periods = form.subscription_periods;
  const isUsb = form.is_usb;
  const showVariants = isUsb && form.is_product_variant;

  const addRow = () => {
    update("subscription_periods", [
      ...periods,
      {
        duration: "",
        price: "",
        country_id: "",
        variant_id: "",
        unit: "",
        discount_type: "",
        amount: "",
        discount_expires_at: "",
        status: true,
      },
    ]);
  };

  const updateRow = (index, updated) => {
    const arr = [...periods];
    arr[index] = updated;
    update("subscription_periods", arr);
  };

  const removeRow = (index) => {
    update(
      "subscription_periods",
      periods.filter((_, i) => i !== index),
    );
  };

  return (
    <SectionCard
      title={isUsb ? "Unit Pricing" : "Subscription Pricing"}
      description={
        isUsb
          ? "Add a price per country and unit quantity"
          : "Add a price per country and subscription duration"
      }
    >
      <InfoBox variant="blue">
        <div className="flex items-start gap-2">
          <Info size={13} className="mt-0.5 flex-shrink-0" />
          <span>
            Every entry <strong>must have a country and price</strong>.
            {!isUsb &&
              " Duration (months) is required for subscription products."}
            {isUsb && " Unit quantity is required for USB products."}
            {showVariants && " You can also assign a price per USB variant."}
          </span>
        </div>
      </InfoBox>

      {periods.length === 0 ? (
        <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">
            No pricing entries yet — click "Add Entry" to start.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {periods.map((row, i) => (
            <PeriodRow
              key={i}
              row={row}
              index={i}
              onChange={updateRow}
              onRemove={removeRow}
              canRemove={periods.length > 1}
              isUsb={isUsb}
              showVariants={showVariants}
            />
          ))}
        </div>
      )}

      {errors.subscription_periods && (
        <p className="text-xs text-red-500 font-medium mt-2">
          ⚠ {errors.subscription_periods}
        </p>
      )}

      <button
        type="button"
        onClick={addRow}
        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <Plus size={13} /> Add Entry
      </button>
    </SectionCard>
  );
}

// ─── Step 4 main ──────────────────────────────────────────────────────────────
export default function StepPricing({ form, update, errors }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
        <p className="text-sm text-gray-500 mt-1">
          Set country-specific prices
          {form.is_usb && form.is_product_variant ? " and per USB variant" : ""}
          .{!form.is_usb && " Each entry requires a duration and country."}
        </p>
      </div>

      {/* Delivery charge toggle */}
      <SectionCard
        title="Delivery Settings"
        description="Configure whether this product has an associated delivery charge"
      >
        <Toggle
          checked={form.is_delivery_charge}
          onChange={(val) => update("is_delivery_charge", val)}
          label="Apply delivery charge"
          description="Enable if customers will be charged a delivery fee for this product. The charge amount is configured in Delivery Charges settings."
        />
      </SectionCard>

      <PricingSection form={form} update={update} errors={errors} />
    </div>
  );
}
