import { CheckCircle2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function SuccessState({ productName, onAddAnother, onBack }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16 space-y-6">
      {/* Animated check */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
          <CheckCircle2 size={52} className="text-green-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Product Published!</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          <span className="font-semibold text-gray-700">
            &quot;{productName}&quot;
          </span>{" "}
          has been successfully created and is now live in your product catalog.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/dashboard/bitss/products"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Products
        </Link>
        <button
          type="button"
          onClick={onAddAnother}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus size={15} />
          Add Another Product
        </button>
      </div>
    </div>
  );
}
