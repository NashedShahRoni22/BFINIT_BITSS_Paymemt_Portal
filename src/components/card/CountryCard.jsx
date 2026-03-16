import { useState } from "react";
import { Pencil } from "lucide-react";
import UpdateCountryModal from "../modal/UpdateCountryModal";

export default function CountryCard({ country }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-5 flex flex-col gap-3">
        {/* Abbreviation Badge + Country Name */}
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm shrink-0">
            {country.abbreviation ?? "—"}
          </span>
          <div>
            <h2 className="text-base font-semibold text-gray-800 leading-tight">
              {country.country_name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">ID: {country.id}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Currency + Edit */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Currency Symbol</span>
            <span
              className="text-lg font-semibold text-gray-700"
              dangerouslySetInnerHTML={{ __html: country.currency_icon }}
            />
          </div>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <Pencil size={15} />
          </button>
        </div>
      </div>

      {showUpdateModal && (
        <UpdateCountryModal
          countryId={country.id}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </>
  );
}
