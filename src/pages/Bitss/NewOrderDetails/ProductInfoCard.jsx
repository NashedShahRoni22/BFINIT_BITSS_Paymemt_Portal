import { Package, Layers, Usb, GitBranch, CheckCircle2 } from "lucide-react";

function TypeTag({ icon: Icon, label, color }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

function getProductTags(product) {
  const tags = [];
  if (product.is_combo)
    tags.push({
      icon: Layers,
      label: "Combo",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    });
  if (product.is_usb)
    tags.push({
      icon: Usb,
      label: "USB",
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    });
  if (product.is_variant)
    tags.push({
      icon: GitBranch,
      label: "Variant",
      color: "bg-violet-50 text-violet-700 border-violet-200",
    });
  if (tags.length === 0)
    tags.push({
      icon: Package,
      label: "Single Product",
      color: "bg-slate-100 text-slate-600 border-slate-200",
    });
  return tags;
}

export default function ProductInfoCard({ product }) {
  const tags = getProductTags(product);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Product
      </h2>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            {product.slug}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {tags.map((t) => (
            <TypeTag key={t.label} {...t} />
          ))}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div
          className="text-sm text-slate-600 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      {/* Feature details */}
      {product.details?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Features
          </p>
          <ul className="space-y-1.5">
            {product.details.map((d, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
