import { useEffect, useState } from "react";
import { ArrowLeft, Globe } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useProductForm, {
  buildPayload,
  INITIAL_FORM,
} from "../../hooks/useProductForm";
import WizardFooter from "../../components/BitssAddProduct/WizardFooter";
import StepProductType from "../../components/BitssAddProduct/StepProductType";
import StepBasicInfo from "../../components/BitssAddProduct/StepBasicInfo";
import StepFeatures from "../../components/BitssAddProduct/StepFeatures";
import StepPricing from "../../components/BitssAddProduct/StepPricing";
import StepReview from "../../components/BitssAddProduct/StepReview";
import SuccessState from "../../components/BitssAddProduct/SuccessState";
import WizardProgress from "../../components/BitssAddProduct/WizardProgress";
import { useCountries } from "../../hooks/useCountries";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

// ─── Map API response → form shape ───────────────────────────────────────────
//
// Handles all 4 API shapes:
//   1. Single subscription product  (is_combo:false, is_usb:false, is_variant:false)
//   2. Combo pack                   (is_combo:true)
//   3. USB without variants         (is_usb:true,  is_variant:false)
//   4. USB with size variants       (is_usb:true,  is_variant:true)
//
function mapProductToForm(product) {
  const prices = product.prices ?? [];
  const isUsb = Boolean(product.is_usb);

  // ── product_prices ──────────────────────────────────────────────────────
  // API key is `original_price`, not `price`.
  // discount_type: null  →  "" (form convention for "no discount").
  // discount_amount: 0 with no type  →  "" so the discount field stays empty.
  const product_prices = prices.map((p) => ({
    country_id: p.country_id != null ? String(p.country_id) : "",
    variant_id: p.variant_id != null ? String(p.variant_id) : "",
    price: p.original_price != null ? String(p.original_price) : "",
    discount_type: p.discount_type ?? "",
    discount_amount:
      p.discount_type && p.discount_amount ? String(p.discount_amount) : "",
    discount_expire_at: p.discount_expire_at ?? "",
    unit: p.unit != null ? String(p.unit) : "",
    delivery_charge_id:
      p.delivery_charge_id != null ? String(p.delivery_charge_id) : null,
  }));

  // ── subscription_periods (non-USB only) ─────────────────────────────────
  // The API nests subscription data inside each price entry under
  // `subscription_pricing[]`, not at the product level.
  // All price entries share the same subscription list; use the first one
  // that has data.
  let subscription_periods = INITIAL_FORM.subscription_periods;
  if (!isUsb) {
    const sourcePriceEntry = prices.find(
      (p) => p.subscription_pricing?.length > 0,
    );
    if (sourcePriceEntry) {
      subscription_periods = sourcePriceEntry.subscription_pricing.map(
        (sub) => ({
          subscription_id: sub.subscription_id, // keep for PUT reference
          duration: String(sub.duration_months ?? ""),
          discount_type: sub.discount_type ?? "",
          // Only surface an amount when there's an actual discount type
          amount:
            sub.discount_type && sub.discount_amount
              ? String(sub.discount_amount)
              : "",
          status: true, // API doesn't return status per-period; default active
        }),
      );
    }
  }

  // ── selected_products (combo) ────────────────────────────────────────────
  // combo_products[] objects have an `id` field (the child product's ID).
  const selected_products = Boolean(product.is_combo)
    ? (product.combo_products ?? []).map((p) => p.id)
    : [];

  // ── variants for USB+variant products ───────────────────────────────────
  // The API always returns `variants: []` (empty). Variant information is
  // embedded in each price entry as `variant_id` + `variant_name`.
  // We derive:
  //   form.variants         — numeric IDs for VariantPicker checkboxes
  //   form.product_variants — {variant_name} objects for StepReview display
  const seen = new Set();
  const product_variants = [];
  const variants = [];
  for (const p of prices) {
    if (p.variant_id != null && !seen.has(p.variant_id)) {
      seen.add(p.variant_id);
      variants.push(Number(p.variant_id));
      product_variants.push({
        variant_id: String(p.variant_id),
        variant_name: p.variant_name ?? "",
      });
    }
  }

  // ── details[] ───────────────────────────────────────────────────────────
  // API returns plain strings. Guard against the legacy object shape
  // {desc_name} just in case the API ever changes back.
  const product_details =
    (product.details ?? []).length > 0
      ? product.details
          .map((d) =>
            typeof d === "object" ? (d.desc_name ?? "") : String(d ?? ""),
          )
          .filter((d) => d !== "")
      : [""];

  // ── status ───────────────────────────────────────────────────────────────
  // The product-detail endpoint does NOT return a top-level `status` field.
  // Map integer status if present (comes from combo_products children),
  // otherwise fall back to "available".
  const statusRaw = product.status;
  const status =
    statusRaw === 1 || statusRaw === "1"
      ? "available"
      : statusRaw === 0 || statusRaw === "0"
        ? "unavailable"
        : typeof statusRaw === "string" && statusRaw.length > 0
          ? statusRaw
          : "available";

  return {
    ...INITIAL_FORM,
    name: product.name ?? "",
    status,
    category_id: product.category_id ? String(product.category_id) : "",
    // API uses `description`; form uses `sort_description`
    sort_description: product.description ?? product.sort_description ?? "",
    is_combo: Boolean(product.is_combo),
    is_usb: isUsb,
    // API uses `is_variant`; form uses `is_product_variant`
    is_product_variant: Boolean(
      product.is_variant ?? product.is_product_variant,
    ),
    is_domain: Boolean(product.is_domain),
    is_delivery_charge: Boolean(product.is_delivery_charge),
    product_details,
    product_prices,
    subscription_periods,
    selected_products,
    variants,
    product_variants,
  };
}

// ─── Country selection screen ─────────────────────────────────────────────────
function CountrySelectScreen({ onSelect, onBack }) {
  const { data: countries = [], isLoading, isError } = useCountries();
  const [selected, setSelected] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className="hover:text-indigo-600 cursor-pointer"
                onClick={onBack}
              >
                Products
              </span>
              <span>/</span>
              <span className="font-semibold text-gray-800">Edit Product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-lg p-8 space-y-6">
          {/* Icon + heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto">
              <Globe size={22} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Select a Country
            </h2>
            <p className="text-sm text-gray-500">
              Choose a country to load the product&apos;s pricing for that
              market.
            </p>
          </div>

          {/* Country select */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to load countries.
            </p>
          )}
          {!isLoading && !isError && (
            <div className="space-y-2">
              {countries.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(String(c.id))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left
                    ${
                      selected === String(c.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${selected === String(c.id) ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}`}
                  >
                    {selected === String(c.id) && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={`flex-1 text-sm font-medium
                    ${selected === String(c.id) ? "text-indigo-800" : "text-gray-700"}`}
                  >
                    {c.country_name}
                  </span>
                  <span
                    className="text-sm text-gray-400"
                    dangerouslySetInnerHTML={{ __html: c.currency_icon }}
                  />
                  <span className="text-xs text-gray-400 font-medium">
                    {c.abbreviation}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Continue button */}
          <button
            type="button"
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg
              hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue to Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Country must be selected before product is fetched
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  const {
    form,
    update,
    setForm,
    step,
    steps,
    errors,
    nextStep,
    prevStep,
    goToStep,
    validate,
  } = useProductForm();

  const [updated, setUpdated] = useState(false);

  // ─── Fetch product by ID with selected country ───────────────────────────
  const {
    data: productData,
    isLoading: fetchLoading,
    isError: fetchError,
    error: fetchErrorMsg,
  } = useQuery({
    queryKey: ["product", id, selectedCountryId],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/products/${id}?country_id=${selectedCountryId}`,
        { headers: { Authorization: `Bearer ${user}` } },
      );
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Product not found");
      return data.data;
    },
    enabled: !!id && !!user && !!selectedCountryId,
  });

  // Pre-populate form when product data arrives
  useEffect(() => {
    if (productData) setForm(mapProductToForm(productData));
  }, [productData]);

  // ─── Update mutation ──────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update product");
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to update product");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setUpdated(true);
    },
    onError: (err) =>
      alert(err.message || "Failed to update product. Please try again."),
  });

  const handleUpdate = () => {
    if (!validate(5)) return;
    updateMutation.mutate(buildPayload(form));
  };

  const goBack = () => navigate(-1);

  // ─── Show country selection screen first ──────────────────────────────────
  if (!selectedCountryId) {
    return (
      <CountrySelectScreen
        onSelect={(countryId) => setSelectedCountryId(countryId)}
        onBack={() => navigate(-1)}
      />
    );
  }

  // ─── Loading state ────────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading product…</p>
        </div>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-red-500 font-medium">
            {fetchErrorMsg?.message ?? "Failed to load product."}
          </p>
          <button
            onClick={goBack}
            className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className="hover:text-indigo-600 cursor-pointer transition-colors"
                onClick={goBack}
              >
                Products
              </span>
              <span>/</span>
              <span className="font-semibold text-gray-800">Edit Product</span>
            </div>
            {form.name && (
              <p className="text-xs text-gray-400 mt-0.5">
                &quot;{form.name}&quot;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step progress — hide on success */}
      {!updated && (
        <WizardProgress
          steps={steps}
          currentStep={step}
          onGoToStep={goToStep}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {updated ? (
            <SuccessState
              productName={form.name}
              mode="update"
              onBack={goBack}
            />
          ) : (
            <div key={step} className="animate-fadeIn">
              {step === 1 && <StepProductType form={form} update={update} />}
              {step === 2 && (
                <StepBasicInfo form={form} update={update} errors={errors} />
              )}
              {step === 3 && (
                <StepFeatures form={form} update={update} errors={errors} />
              )}
              {step === 4 && (
                <StepPricing form={form} update={update} errors={errors} />
              )}
              {step === 5 && <StepReview form={form} onGoToStep={goToStep} />}
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer — hide on success */}
      {!updated && (
        <WizardFooter
          step={step}
          totalSteps={steps.length}
          onBack={prevStep}
          onNext={nextStep}
          onPublish={handleUpdate}
          loading={updateMutation.isPending}
          publishLabel="Save Changes"
        />
      )}
    </div>
  );
}
