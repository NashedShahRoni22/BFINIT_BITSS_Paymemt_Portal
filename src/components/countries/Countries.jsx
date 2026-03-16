import { useState } from "react";
import { Globe, Plus } from "lucide-react";
import CountryCard from "../card/CountryCard";
import AddCountryModal from "../modal/AddCountryModal";
import { useCountries } from "../../hooks/useCountries";

export default function Countries() {
  const [showModal, setShowModal] = useState(false);
  const { data: countries, isLoading, isError, error } = useCountries();

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">Loading countries...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">
          {error?.message || "Failed to load countries"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-700">
            {countries?.length ?? 0}
          </span>{" "}
          countries
        </span>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium hover:cursor-pointer"
        >
          <Plus size={16} />
          Add Country
        </button>
      </div>

      {/* Empty State */}
      {(!countries || countries.length === 0) && (
        <div className="text-center py-20">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No countries found
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click &quot;Add Country&quot; to create your first one.
          </p>
        </div>
      )}

      {/* Grid */}
      {countries && countries.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {countries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && <AddCountryModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
