import { Plus, X, ShieldCheck } from "lucide-react";
import { SectionCard, IconButton } from "../Ui";

// ─── Live preview card ────────────────────────────────────────────────────────
function FeaturesPreview({ productName, features }) {
  // Coerce all items to strings — API may return non-string values
  const filled = features
    .map((f) => String(f ?? ""))
    .filter((f) => f.trim() !== "");

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-5 text-white h-full min-h-48">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={16} className="text-indigo-200" />
        <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
          Customer Preview
        </span>
      </div>

      <h4 className="font-bold text-sm mb-3 text-white leading-snug">
        {productName || "Product Name"}
      </h4>

      {filled.length === 0 ? (
        <div className="space-y-2">
          {[80, 65, 72, 55].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              <div
                className="h-3 rounded bg-indigo-500/50"
                style={{ width: `${w}%` }}
              />
            </div>
          ))}
          <p className="text-xs text-indigo-300 mt-3 italic">
            Features will appear here as you type…
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filled.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-indigo-100 leading-relaxed"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0 mt-1.5" />
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Feature input list ───────────────────────────────────────────────────────
function FeaturesList({ features, onChange, error }) {
  const add = () => onChange([...features, ""]);

  const update = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    onChange(updated);
  };

  const remove = (index) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2.5">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-2.5 group">
          {/* Row number badge */}
          <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-colors">
            {String(i + 1).padStart(2, "0")}
          </span>

          <input
            type="text"
            value={feature}
            onChange={(e) => update(i, e.target.value)}
            placeholder="e.g. Real-time malware & ransomware protection"
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />

          {/* Remove — always show but muted if only 1 row */}
          <IconButton
            onClick={() => features.length > 1 && remove(i)}
            title="Remove feature"
            className={
              features.length === 1
                ? "opacity-25 cursor-not-allowed"
                : "hover:text-red-500 hover:bg-red-50"
            }
          >
            <X size={14} />
          </IconButton>
        </div>
      ))}

      {/* Add button */}
      <button
        type="button"
        onClick={add}
        className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors py-1"
      >
        <Plus size={13} />
        Add Feature
      </button>

      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">⚠ {error}</p>
      )}
    </div>
  );
}

// ─── Step 3 main ─────────────────────────────────────────────────────────────
export default function StepFeatures({ form, update, errors }) {
  // Ensure every item is a string — guards against API returning non-string values
  const details = (form.product_details ?? [""]).map((d) => String(d ?? ""));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Features & Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          These appear as bullet points on the product listing page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Features input — 3 cols */}
        <div className="lg:col-span-3">
          <SectionCard
            title="Product Features"
            description="Add one feature per row — be specific and customer-focused"
          >
            <FeaturesList
              features={details}
              onChange={(v) => update("product_details", v)}
              error={errors.product_details}
            />
          </SectionCard>
        </div>

        {/* Live preview — 2 cols */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
              Live Preview
            </p>
            <FeaturesPreview productName={form.name} features={details} />
            <p className="text-xs text-gray-400 mt-2 text-center">
              Updates as you type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
