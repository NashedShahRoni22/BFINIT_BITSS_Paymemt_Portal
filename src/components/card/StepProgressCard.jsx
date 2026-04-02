import { Check } from "lucide-react";

export default function StepProgressCard({ step, currentStep, onGoToStep }) {
  const isCompleted = currentStep > step.id;
  const isCurrent = currentStep === step.id;
  const isUpcoming = currentStep < step.id;

  return (
    <div
      onClick={() => isCompleted && onGoToStep(step.id)}
      className="z-10 cursor-pointer"
    >
      <div className="flex flex-col items-center gap-2 group">
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
    </div>
  );
}
