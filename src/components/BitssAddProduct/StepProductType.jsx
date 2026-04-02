import { Package, Gift, Usb } from "lucide-react";
import { Toggle } from "../Ui";

const TYPE_OPTIONS = [
  {
    id: "single",
    label: "Single Product",
    description: "A standalone digital license, key, or subscription.",
    icon: Package,
    badge: "Most Common",
    badgeColor: "bg-green-100 text-green-700",
    sets: { is_combo: false, is_usb: false },
  },
  {
    id: "combo",
    label: "Combo Pack",
    description: "Bundle multiple existing products sold as one offering.",
    icon: Gift,
    badge: "Bundle",
    badgeColor: "bg-violet-100 text-violet-700",
    sets: { is_combo: true, is_usb: false },
  },
  {
    id: "usb",
    label: "USB Device",
    description: "Physical USB device shipped with pre-loaded software.",
    icon: Usb,
    badge: "Physical + Digital",
    badgeColor: "bg-amber-100 text-amber-700",
    sets: { is_combo: false, is_usb: true },
  },
];

function resolveType(form) {
  if (form.is_usb) return "usb";
  if (form.is_combo) return "combo";
  return "single";
}

export default function StepProductType({ form, update }) {
  const currentType = resolveType(form);

  const handleSelect = (option) => {
    update("is_combo", option.sets.is_combo);
    update("is_usb", option.sets.is_usb);
    // default ON for USB, reset to false for any other type
    update("is_product_variant", option.sets.is_usb ? true : false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          What are you creating?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          The form will adapt based on the product type you choose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TYPE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = currentType === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                relative text-left p-5 rounded-xl border-2 transition-all duration-200
                hover:shadow-md focus:outline-none
                ${
                  isActive
                    ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              <div
                className={`
                w-11 h-11 rounded-xl flex items-center justify-center mb-4
                ${isActive ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}
              `}
              >
                <Icon size={22} />
              </div>

              <div className="mb-2">
                <span
                  className={`
                  inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2
                  ${option.badgeColor}
                `}
                >
                  {option.badge}
                </span>
                <h3
                  className={`font-bold text-base ${isActive ? "text-indigo-900" : "text-gray-800"}`}
                >
                  {option.label}
                </h3>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* USB variant toggle — only visible when USB is selected */}
      {form.is_usb && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-1">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
            🔌 USB Configuration
          </p>
          <Toggle
            checked={form.is_product_variant}
            onChange={(val) => update("is_product_variant", val)}
            label="This USB has size variants"
            description="Enable if the USB comes in different sizes (e.g. 16GB, 32GB, 64GB). When enabled, you will add variants in the next step and pricing can be set per variant."
          />
        </div>
      )}

      {/* Domain required toggle — applies to all product types */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 space-y-1">
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
          🌐 Domain Configuration
        </p>
        <Toggle
          checked={form.is_domain}
          onChange={(val) => update("is_domain", val)}
          label="Domain is required for this product"
          description="Enable if the customer must provide a domain name during checkout (e.g. SSL certificates, hosted software licenses)."
        />
      </div>

      {/* Summary line */}
      <div className="flex items-center gap-4 pt-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <p className="text-xs text-gray-500">
            Selected:{" "}
            <span className="font-semibold text-gray-700">
              {TYPE_OPTIONS.find((t) => t.id === currentType)?.label}
              {form.is_usb && form.is_product_variant ? " (with variants)" : ""}
            </span>
          </p>
        </div>
        {form.is_domain && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">
                Domain required
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
