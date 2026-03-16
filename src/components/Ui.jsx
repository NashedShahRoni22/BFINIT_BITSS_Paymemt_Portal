// ─── Shared UI primitives ─────────────────────────────────────────────────────

export function FormField({ label, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ error, className = "", ...props }) {
  return (
    <input
      {...props}
      className={`
        w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-800
        placeholder:text-gray-400 transition-all outline-none
        focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
        ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}
        ${className}
      `}
    />
  );
}

export function TextArea({ error, className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`
        w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-800
        placeholder:text-gray-400 transition-all outline-none resize-none
        focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
        ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}
        ${className}
      `}
    />
  );
}

export function SelectInput({ error, children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`
        w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-800
        transition-all outline-none cursor-pointer bg-white
        focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}
        ${className}
      `}
    >
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`
          relative mt-0.5 w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
          ${checked ? "bg-indigo-600" : "bg-gray-300"}
        `}
      >
        <div
          className={`
            absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm
            transition-transform duration-200
            ${checked ? "translate-x-5" : "translate-x-0.5"}
          `}
        />
      </div>
      {(label || description) && (
        <div>
          {label && (
            <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
              {label}
            </p>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </label>
  );
}

export function SectionCard({ title, description, children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}
    >
      {(title || description) && (
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          {title && (
            <h3 className="text-sm font-bold text-gray-800">{title}</h3>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function InfoBox({ children, variant = "blue" }) {
  const styles = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    green: "bg-green-50 border-green-200 text-green-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div
      className={`text-xs font-medium px-4 py-3 rounded-lg border ${styles[variant]}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = "gray" }) {
  const styles = {
    gray: "bg-gray-100 text-gray-600",
    indigo: "bg-indigo-100 text-indigo-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    violet: "bg-violet-100 text-violet-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function IconButton({ onClick, children, title, className = "" }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 text-gray-400 hover:text-gray-600 ${className}`}
    >
      {children}
    </button>
  );
}
