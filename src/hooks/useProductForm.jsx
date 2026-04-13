import { useState } from "react";

export const INITIAL_FORM = {
  name: "",
  status: "available",
  category_id: "",
  is_domain: false,
  is_combo: false,
  is_usb: false,
  is_product_variant: false,
  is_delivery_charge: false,
  sort_description: "",
  // product_variants / variants removed — variant selection now happens
  // per-row in the Pricing step for USB+variant products.
  selected_products: [],
  product_details: [""],
  // All pricing lives here. Shape varies by product type:
  //   Non-USB  → duration required, no unit/variant
  //   USB      → no duration, unit required, variant required if is_product_variant
  subscription_periods: [
    {
      duration: "12",
      price: "",
      country_id: "",
      variant_id: "",
      unit: "",
      discount_type: "",
      amount: "",
      discount_expires_at: "",
      status: true,
    },
    {
      duration: "24",
      price: "",
      country_id: "",
      variant_id: "",
      unit: "",
      discount_type: "",
      amount: "",
      discount_expires_at: "",
      status: true,
    },
    {
      duration: "36",
      price: "",
      country_id: "",
      variant_id: "",
      unit: "",
      discount_type: "",
      amount: "",
      discount_expires_at: "",
      status: true,
    },
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
  { value: "percent", label: "Percentage (%)" },
  { value: "flat", label: "Flat" },
];

export const SUB_DISCOUNT_TYPES = [
  { value: "percent", label: "Percent (%)" },
  { value: "flat", label: "Flat" },
];

// Build final payload matching exact API contract
export function buildPayload(form) {
  const isUsb = form.is_usb;
  const hasVariants = isUsb && form.is_product_variant;

  const subscription_periods = form.subscription_periods
    .filter((s) => {
      if (!s.price || !s.country_id) return false;
      if (!isUsb && !s.duration) return false; // non-USB needs duration
      if (isUsb && !s.unit) return false; // USB needs unit
      if (hasVariants && !s.variant_id) return false; // USB+variants needs variant_id
      return true;
    })
    .map((s) => {
      const entry = {
        price: parseFloat(s.price),
        country_id: parseInt(s.country_id),
        status: s.status,
      };
      entry.duration = isUsb ? null : parseInt(s.duration); // null for USB, required for non-USB
      if (isUsb) entry.unit = s.unit; // USB only (string)
      if (s.variant_id) entry.variant_id = parseInt(s.variant_id);
      if (s.discount_type) entry.discount_type = s.discount_type;
      if (s.amount !== "" && s.amount !== undefined)
        entry.amount = parseFloat(s.amount);
      if (s.discount_expires_at)
        entry.discount_expires_at = s.discount_expires_at;
      return entry;
    });

  const payload = {
    name: form.name,
    status: form.status,
    category_id: parseInt(form.category_id) || null,
    is_domain: form.is_domain,
    is_combo: form.is_combo,
    is_usb: isUsb,
    is_product_variant: form.is_product_variant,
    is_delivery_charge: form.is_delivery_charge,
    sort_description: form.sort_description,
    product_details: form.product_details.filter((d) => d.trim() !== ""),
    subscription_periods,
  };

  if (form.is_combo) {
    payload.selected_products = form.selected_products.map((id) => ({
      product_id: parseInt(id),
    }));
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

  // Per-step validation
  const validate = (currentStep) => {
    const errs = {};
    const isUsb = form.is_usb;
    const hasVariants = isUsb && form.is_product_variant;

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
      if (form.subscription_periods.length === 0) {
        errs.subscription_periods = "Add at least one pricing entry";
      } else {
        const hasInvalidRow = form.subscription_periods.some((s) => {
          if (!s.price || !s.country_id) return true;
          if (!isUsb && !s.duration) return true;
          if (isUsb && !s.unit) return true;
          if (hasVariants && !s.variant_id) return true;
          return false;
        });
        if (hasInvalidRow) {
          if (isUsb && hasVariants)
            errs.subscription_periods =
              "Every entry must have a country, price, unit, and variant";
          else if (isUsb)
            errs.subscription_periods =
              "Every entry must have a country, price, and unit";
          else
            errs.subscription_periods =
              "Every entry must have a duration, country, and price";
        }
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
