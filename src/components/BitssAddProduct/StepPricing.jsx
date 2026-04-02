import { Plus, Trash2, Info, Truck } from "lucide-react";
import { SelectInput, TextInput, SectionCard, InfoBox, Toggle } from "../Ui";
import { DISCOUNT_TYPES, SUB_DISCOUNT_TYPES } from "../../hooks/useProductForm";
import { useCountries } from "../../hooks/useCountries";
import { useVariants } from "../../hooks/useVariants";
import { useDeliveryCharges } from "../../hooks/useDeliveryCharges";

// ─── Single price row ─────────────────────────────────────────────────────────
function PriceRow({
  row,
  index,
  onChange,
  onRemove,
  showVariants,
  canRemove,
  isUsb,
  showDeliveryCharge,
  deliveryCharges,
}) {
  const { data: countries, isLoading } = useCountries();
  const { data: variants = [], isLoading: variantsLoading } = useVariants();

  const set = (field, value) => onChange(index, { ...row, [field]: value });

  // When country changes, auto-resolve the matching delivery charge
  const handleCountryChange = (countryId) => {
    const matched = deliveryCharges.find(
      (d) => String(d.country_id) === String(countryId),
    );
    onChange(index, {
      ...row,
      country_id: countryId,
      delivery_charge_id: matched ? String(matched.id) : null,
    });
  };

  const showDiscount = row.discount_type && row.discount_type !== "";

  const selectedCountry = countries?.find(
    (c) => String(c.id) === String(row.country_id),
  );

  // Delivery charges filtered to the selected country
  const countryDeliveryCharges = deliveryCharges.filter(
    (d) => String(d.country_id) === String(row.country_id),
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
            Price Entry #{index + 1}
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

      {/* Row 1: country (required), price, variant, unit */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Country — required */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Country <span className="text-red-500">*</span>
          </label>
          <SelectInput
            value={row.country_id}
            onChange={(e) => handleCountryChange(e.target.value)}
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

        {/* Variant — only if USB with product_variant */}
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
      </div>

      {/* Row 2: discount fields — only enabled after country selected */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                value={row.discount_amount}
                onChange={(e) => set("discount_amount", e.target.value)}
                placeholder={
                  row.discount_type === "percentage"
                    ? "e.g. 10 (%)"
                    : "e.g. 5.00"
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Discount Expires
              </label>
              <TextInput
                type="datetime-local"
                value={row.discount_expire_at}
                onChange={(e) => set("discount_expire_at", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {/* Delivery charge — auto-resolved, read-only display */}
      {showDeliveryCharge && (
        <div className="border-t border-gray-200 pt-3 mt-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Truck size={11} />
            Delivery Charge
          </label>
          {!row.country_id ? (
            <p className="text-xs text-gray-400 italic">
              Select a country first.
            </p>
          ) : countryDeliveryCharges.length === 0 ? (
            <p className="text-xs text-amber-600 italic">
              ⚠ No delivery charge configured for this country.
            </p>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Truck size={13} className="text-blue-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-blue-800">
                <span
                  dangerouslySetInnerHTML={{
                    __html: countryDeliveryCharges[0].currency,
                  }}
                />{" "}
                {countryDeliveryCharges[0].amount}
              </span>
              <span className="text-xs text-blue-500 ml-1">
                — {countryDeliveryCharges[0].country_name}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Product prices section ───────────────────────────────────────────────────
function ProductPricesSection({ form, update, errors }) {
  const prices = form.product_prices;
  const showVariants = form.is_usb && form.is_product_variant;

  // Fetch all delivery charges once; PriceRow filters by country_id
  const { data: deliveryCharges = [], isLoading: dcLoading } =
    useDeliveryCharges();

  const addRow = () => {
    update("product_prices", [
      ...prices,
      {
        country_id: "",
        variant_id: "",
        price: "",
        discount_type: "",
        discount_amount: "",
        discount_expire_at: "",
        unit: "",
        delivery_charge_id: null,
      },
    ]);
  };

  const updateRow = (index, updated) => {
    const arr = [...prices];
    arr[index] = updated;
    update("product_prices", arr);
  };

  const removeRow = (index) => {
    update(
      "product_prices",
      prices.filter((_, i) => i !== index),
    );
  };

  return (
    <SectionCard
      title="Country Prices"
      description="Add a price for each country you want to sell in — every entry requires a country"
    >
      <InfoBox variant="blue">
        <div className="flex items-start gap-2">
          <Info size={13} className="mt-0.5 flex-shrink-0" />
          <span>
            Every price entry <strong>must have a country selected</strong>. The
            currency symbol is pulled automatically from your country settings.
            {showVariants && " You can also assign a price per USB variant."}
          </span>
        </div>
      </InfoBox>

      {/* Delivery charge toggle */}
      <div className="mt-4 flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
        <Truck size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-blue-800 mb-0.5">
            Delivery Charge
          </p>
          <p className="text-xs text-blue-600 leading-relaxed">
            Enable if this product requires a delivery charge. The charge will
            be automatically resolved from the selected country.
          </p>
        </div>
        <Toggle
          checked={form.is_delivery_charge}
          onChange={(val) => update("is_delivery_charge", val)}
          label=""
        />
      </div>

      {prices.length === 0 ? (
        <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">
            No country prices yet — click &quot;Add Country Price&quot; to
            start.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {prices.map((row, i) => (
            <PriceRow
              key={i}
              row={row}
              index={i}
              onChange={updateRow}
              onRemove={removeRow}
              showVariants={showVariants}
              canRemove={prices.length > 1}
              isUsb={form.is_usb}
              showDeliveryCharge={form.is_delivery_charge}
              deliveryCharges={dcLoading ? [] : deliveryCharges}
            />
          ))}
        </div>
      )}

      {errors.product_prices && (
        <p className="text-xs text-red-500 font-medium mt-2">
          ⚠ {errors.product_prices}
        </p>
      )}

      <button
        type="button"
        onClick={addRow}
        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <Plus size={13} /> Add Country Price
      </button>
    </SectionCard>
  );
}

// ─── Subscription periods section ─────────────────────────────────────────────
function SubscriptionPeriodsSection({ form, update, errors }) {
  const periods = form.subscription_periods;

  const addPeriod = () => {
    update("subscription_periods", [
      ...periods,
      { duration: "", discount_type: "", amount: "", status: true },
    ]);
  };

  const updatePeriod = (index, field, value) => {
    const arr = [...periods];
    arr[index] = { ...arr[index], [field]: value };
    update("subscription_periods", arr);
  };

  const removePeriod = (index) => {
    update(
      "subscription_periods",
      periods.filter((_, i) => i !== index),
    );
  };

  return (
    <SectionCard
      title="Subscription Periods"
      description="Required for digital products — set pricing for 12, 24, 36-month commitments"
    >
      <div className="hidden md:grid grid-cols-12 gap-2 px-2 mb-2">
        {["Duration (mo.)", "Discount Type", "Amount", "Active", ""].map(
          (h, i) => (
            <span
              key={i}
              className={`text-xs font-semibold text-gray-400 uppercase tracking-wider
              ${i === 4 ? "col-span-1" : i === 3 ? "col-span-2" : "col-span-2"}`}
            >
              {h}
            </span>
          ),
        )}
      </div>

      <div className="space-y-2.5">
        {periods.map((period, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl p-3"
          >
            {/* Duration */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-500 md:hidden mb-1">
                Duration (months)
              </label>
              <TextInput
                type="number"
                min="1"
                value={period.duration}
                onChange={(e) => updatePeriod(i, "duration", e.target.value)}
                placeholder="12"
              />
            </div>

            {/* Discount Type */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-500 md:hidden mb-1">
                Discount Type
              </label>
              <SelectInput
                value={period.discount_type}
                onChange={(e) =>
                  updatePeriod(i, "discount_type", e.target.value)
                }
              >
                <option value="">No Discount</option>
                {SUB_DISCOUNT_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </SelectInput>
            </div>

            {/* Amount */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-500 md:hidden mb-1">
                Amount
              </label>
              <TextInput
                type="number"
                step="0.01"
                min="0"
                value={period.amount}
                onChange={(e) => updatePeriod(i, "amount", e.target.value)}
                placeholder={
                  period.discount_type === "percent" ? "e.g. 10" : "e.g. 5.00"
                }
              />
            </div>

            {/* Status toggle */}
            <div className="md:col-span-2 flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500 md:hidden">
                Active
              </label>
              <Toggle
                checked={period.status}
                onChange={(val) => updatePeriod(i, "status", val)}
                label={period.status ? "Active" : "Inactive"}
              />
            </div>

            {/* Remove */}
            <div className="md:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={() => periods.length > 1 && removePeriod(i)}
                className={`p-1.5 rounded-md transition-colors ${
                  periods.length === 1
                    ? "text-gray-200 cursor-not-allowed"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {errors.subscription_periods && (
        <p className="text-xs text-red-500 font-medium mt-2">
          ⚠ {errors.subscription_periods}
        </p>
      )}

      <button
        type="button"
        onClick={addPeriod}
        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <Plus size={13} /> Add Period
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
          .{!form.is_usb && " Then configure subscription period discounts."}
        </p>
      </div>

      <ProductPricesSection form={form} update={update} errors={errors} />

      {!form.is_usb ? (
        <SubscriptionPeriodsSection
          form={form}
          update={update}
          errors={errors}
        />
      ) : (
        <InfoBox variant="amber">
          🔌 <strong>USB products use unit-based pricing.</strong> Subscription
          periods are not applicable — customers purchase per unit (1, 6, 10,
          etc.).
        </InfoBox>
      )}
    </div>
  );
}
