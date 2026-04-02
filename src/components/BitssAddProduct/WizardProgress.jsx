import { Check } from "lucide-react";
import StepProgressCard from "../card/StepProgressCard";

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

          {steps.map((step) => (
            <StepProgressCard
              key={step.id}
              step={step}
              currentStep={currentStep}
              onGoToStep={onGoToStep}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
