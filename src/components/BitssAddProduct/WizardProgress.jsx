import { Check } from "lucide-react";

export default function WizardProgress({ steps, currentStep, onGoToStep }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-indigo-600 z-0 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 z-10 cursor-pointer group"
                onClick={() => isCompleted && onGoToStep(step.id)}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-bold transition-all duration-300 border-2
                    ${
                      isCompleted
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700"
                        : isCurrent
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                          : "bg-white border-gray-300 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap hidden sm:block transition-colors
                    ${isCurrent ? "text-indigo-700" : isCompleted ? "text-indigo-500" : "text-gray-400"}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
