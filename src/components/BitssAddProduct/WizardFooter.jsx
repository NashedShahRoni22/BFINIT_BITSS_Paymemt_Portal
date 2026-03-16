import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";

export default function WizardFooter({
  step,
  totalSteps,
  onBack,
  onNext,
  onPublish,
  loading,
}) {
  const isFirst = step === 1;
  const isLast = step === totalSteps;

  return (
    <div className="sticky bottom-0 z-20 bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Step counter */}
        <span className="text-xs font-semibold text-gray-400 hidden sm:block">
          Step {step} of {totalSteps}
        </span>

        <div className="flex items-center gap-3 ml-auto">
          {/* Back */}
          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
          )}

          {/* Next / Publish */}
          {isLast ? (
            <button
              type="button"
              onClick={onPublish}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Send size={15} />
                  Publish Product
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              Continue
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
