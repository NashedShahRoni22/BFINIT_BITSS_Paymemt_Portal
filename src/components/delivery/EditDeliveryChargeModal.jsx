import { useState, useEffect } from "react";
import { X, Truck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCountries } from "../../hooks/useCountries";
import useAuth from "../../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

export default function EditDeliveryChargeModal({ charge, onClose }) {
  const { user: token } = useAuth();
  const queryClient = useQueryClient();
  const { data: countries, isLoading: countriesLoading } = useCountries();

  const [formData, setFormData] = useState({
    country_id: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  // Initialize form with charge data
  useEffect(() => {
    if (charge) {
      setFormData({
        country_id: charge.country_id || charge.country?.id || "",
        amount: charge.amount || "",
      });
    }
  }, [charge]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.country_id || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/delivery-charges/${charge.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country_id: parseInt(formData.country_id),
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Delivery charge updated successfully!");
        queryClient.invalidateQueries(["delivery-charges"]);
        onClose();
      } else {
        alert(data.message || "Failed to update delivery charge");
      }
    } catch (error) {
      console.error("Error updating delivery charge:", error);
      alert("Failed to update delivery charge");
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countries?.find(
    (c) => c.id === parseInt(formData.country_id),
  );

  const currencyIcon = selectedCountry?.currency_icon
    ? new DOMParser().parseFromString(
        selectedCountry.currency_icon,
        "text/html",
      ).body.textContent
    : "৳";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Edit Delivery Charge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            {countriesLoading ? (
              <div className="text-sm text-gray-500">Loading countries...</div>
            ) : (
              <select
                value={formData.country_id}
                onChange={(e) =>
                  setFormData({ ...formData, country_id: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select a country</option>
                {countries?.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.country_name} ({country.abbreviation})
                  </option>
                ))}
              </select>
            )}
            {selectedCountry && (
              <p className="mt-2 text-xs text-gray-500">
                Currency:{" "}
                <span
                  className="font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: selectedCountry.currency_icon,
                  }}
                />{" "}
                {selectedCountry.abbreviation}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {currencyIcon}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
