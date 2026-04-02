import { useState } from "react";

export const INITIAL_FORM = {
  name: "",
  status: "available",
  category_id: "",
  is_combo: false,
  is_usb: false,
  is_product_variant: false,
  is_domain: false,
  sort_description: "",
  product_variants: [],
  variants: [], // selected variant IDs for is_product_variant USB products
  selected_products: [],
  product_details: [""],
  // is_delivery_charge is a top-level toggle — when true each price row
  // may carry a delivery_charge_id (nullable: the charge that applies for that
  // country). The backend accepts null to mean "no charge for this country".
  is_delivery_charge: false,
  product_prices: [],
  subscription_periods: [
    { duration: "12", discount_type: "", amount: "", status: true },
    { duration: "24", discount_type: "", amount: "", status: true },
    { duration: "36", discount_type: "", amount: "", status: true },
  ],
};

export const STEPS = [
  { id: 1, label: "Product Type", short: "Type" },
  { id: 2, label: "Basic Info", short: "Basics" },
  { id: 3, label: "Features", short: "Features" },
  { id: 4, label: "Pricing", short: "Pricing" },
  { id: 5, label: "Review", short: "Review" },
];

export const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "draft", label: "Draft" },
];

export const DISCOUNT_TYPES = [
  { value: "", label: "No Discount" },
  { value: "percentage", label: "Percentage (%)" },
  { value: "flat", label: "Flat" },
];

export const SUB_DISCOUNT_TYPES = [
  { value: "percent", label: "Percent (%)" },
  { value: "flat", label: "Flat" },
];

// ─── Build final payload matching exact API contract ─────────────────────────
export function buildPayload(form) {
  const payload = {
    name: form.name,
    status: form.status,
    category_id: parseInt(form.category_id) || null,
    is_combo: form.is_combo,
    is_usb: form.is_usb,
    is_product_variant: form.is_product_variant,
    is_domain: form.is_domain,
    is_delivery_charge: form.is_delivery_charge,
    sort_description: form.sort_description,
    product_details: form.product_details.filter((d) => d.trim() !== ""),
    product_prices: form.product_prices
      .filter((p) => p.price !== "")
      .map((p) => {
        const entry = {
          price: parseFloat(p.price) || 0,
          country_id: parseInt(p.country_id),
        };
        if (p.variant_id) entry.variant_id = parseInt(p.variant_id);
        if (p.discount_type) entry.discount_type = p.discount_type;
        if (p.discount_amount)
          entry.discount_amount = parseFloat(p.discount_amount);
        if (p.discount_expire_at)
          entry.discount_expire_at = p.discount_expire_at;
        if (form.is_usb && p.unit) entry.unit = parseInt(p.unit);
        return entry;
      }),
  };

  if (form.is_combo) {
    payload.selected_products = form.selected_products.map((id) => ({
      product_id: parseInt(id),
    }));
  }

  if (form.is_usb && form.is_product_variant && form.variants?.length > 0) {
    payload.variants = form.variants.map((id) => parseInt(id));
  }

  if (!form.is_usb) {
    payload.subscription_periods = form.subscription_periods
      .filter((s) => s.duration)
      .map((s) => {
        const entry = {
          duration: String(s.duration),
          status: s.status,
        };
        if (s.discount_type) entry.discount_type = s.discount_type;
        if (s.amount !== "" && s.amount !== undefined)
          entry.amount = parseFloat(s.amount);
        return entry;
      });
  }

  return payload;
}

export default function useProductForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const e = { ...prev };
      delete e[field];
      return e;
    });
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setStep(1);
    setErrors({});
  };

  // ─── Per-step validation ───────────────────────────────────────────────────
  const validate = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      // type is always set — no validation needed
    }
    if (currentStep === 2) {
      if (!form.name.trim()) errs.name = "Product name is required";
      if (!form.category_id) errs.category_id = "Category is required";
      if (form.is_combo && form.selected_products.length < 2)
        errs.selected_products = "Select at least 2 products for a combo pack";
    }
    if (currentStep === 3) {
      const valid = form.product_details.some((d) => d.trim() !== "");
      if (!valid) errs.product_details = "Add at least one product feature";
    }
    if (currentStep === 4) {
      if (form.product_prices.length === 0) {
        errs.product_prices = "Add at least one country price entry";
      } else {
        const hasInvalidRow = form.product_prices.some(
          (p) => !p.country_id || p.price === "",
        );
        if (hasInvalidRow)
          errs.product_prices =
            "Every price entry must have a country and a price";
      }
      if (!form.is_usb) {
        const hasDuration = form.subscription_periods.some((s) => s.duration);
        if (!hasDuration)
          errs.subscription_periods =
            "At least one subscription period is required";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validate(step)) setStep((s) => Math.min(s + 1, STEPS.length));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (s) => setStep(s);

  return {
    form,
    update,
    setForm,
    step,
    steps: STEPS,
    errors,
    nextStep,
    prevStep,
    goToStep,
    validate,
    reset,
  };
}
