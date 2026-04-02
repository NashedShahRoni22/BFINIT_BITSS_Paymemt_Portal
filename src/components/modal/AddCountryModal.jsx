import { useState } from "react";
import { X } from "lucide-react";
import { useAddCountry } from "../../hooks/useAddCountry";

const INITIAL_FORM = {
  country_name: "",
  currency_icon: "",
  abbreviation: "",
  currency_name: "",
};

export default function AddCountryModal({ onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const { mutate, isPending, isError, error } = useAddCountry();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">Add New Country</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {isError && (
          <p className="text-sm text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">
            {error?.message || "Something went wrong"}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="country_name"
              required
              value={formData.country_name}
              onChange={handleChange}
              placeholder="e.g. France"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Symbol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="currency_icon"
              required
              value={formData.currency_icon}
              onChange={handleChange}
              placeholder="e.g. €"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Abbreviation
            </label>
            <input
              type="text"
              name="abbreviation"
              value={formData.abbreviation}
              onChange={handleChange}
              placeholder="e.g. FR"
              maxLength={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Name
            </label>
            <input
              type="text"
              name="currency_name"
              value={formData.currency_name}
              onChange={handleChange}
              placeholder="e.g. Euro"
              maxLength={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Country"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
