import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import useProductForm, { buildPayload } from "../../hooks/useProductForm";
import WizardProgress from "../../components/BitssAddProduct/WizardProgress";
import SuccessState from "../../components/BitssAddProduct/SuccessState";
import StepProductType from "../../components/BitssAddProduct/StepProductType";
import StepBasicInfo from "../../components/BitssAddProduct/StepBasicInfo";
import StepFeatures from "../../components/BitssAddProduct/StepFeatures";
import StepPricing from "../../components/BitssAddProduct/StepPricing";
import StepReview from "../../components/BitssAddProduct/StepReview";
import WizardFooter from "../../components/BitssAddProduct/WizardFooter";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

export default function AddProductPage() {
  const { user: token } = useAuth();
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
    reset,
  } = useProductForm();

  const [published, setPublished] = useState(false);

  const createProductMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product.");
      return data;
    },
    onSuccess: (data) => {
      // Sync form with any server-returned fields (e.g. assigned id, slug, etc.)
      if (data?.product) setForm((prev) => ({ ...prev, ...data.product }));
      setPublished(true);
    },
    onError: (err) => {
      alert(err.message || "Failed to create product. Please try again.");
    },
  });

  const handlePublish = () => {
    if (!validate(5)) return;
    const payload = buildPayload(form);
    createProductMutation.mutate(payload);
  };

  const handleAddAnother = () => {
    reset();
    setPublished(false);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            to="/dashboard/bitss/products"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hover:text-indigo-600 transition-colors">
                Products
              </span>
              <span>/</span>
              <span className="font-semibold text-gray-800">
                Add New Product
              </span>
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
      {!published && (
        <WizardProgress
          steps={steps}
          currentStep={step}
          onGoToStep={goToStep}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {published ? (
            <SuccessState
              productName={form.name}
              onAddAnother={handleAddAnother}
            />
          ) : (
            <>
              {/* Step content with fade animation */}
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
            </>
          )}
        </div>
      </div>

      {/* Sticky bottom footer — hide on success */}
      {!published && (
        <WizardFooter
          step={step}
          totalSteps={steps.length}
          onBack={prevStep}
          onNext={nextStep}
          onPublish={handlePublish}
          loading={createProductMutation.isPending}
        />
      )}
    </div>
  );
}
