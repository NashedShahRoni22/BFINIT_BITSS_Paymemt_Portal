import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { Globe } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { useCountries } from "../../hooks/useCountries";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

// ─── Fetcher ──────────────────────────────────────────────────────────────────
const fetchProducts = async (countryId, token) => {
  const res = await fetch(`${BASE_URL}/products?country_id=${countryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Invalid response");
  return (data.data || []).map((c) => ({
    ...c,
    currency_icon: c["currency_icon "] ?? c.currency_icon ?? "",
  }));
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Find the price entry matching the selected country
const getCountryPrice = (prices, countryId) =>
  prices?.find((p) => String(p.country_id) === String(countryId)) ?? null;

// Format subscription duration in months → human label
const formatDuration = (months) => {
  if (!months) return "—";
  if (months % 12 === 0) return `${months / 12} yr`;
  return `${months} mo`;
};

// ─── Type badge ───────────────────────────────────────────────────────────────
function TypeBadge({ product }) {
  if (product.is_combo)
    return (
      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
        Combo
      </span>
    );
  if (product.is_usb)
    return (
      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
        USB
      </span>
    );
  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Products() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");

  const {
    data: countries,
    isLoading: countriesLoading,
    isError: countriesError,
  } = useCountries();

  useEffect(() => {
    if (countries?.length > 0 && !selectedCountryId) {
      setSelectedCountryId(String(countries[0].id));
    }
  }, [countries]);

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", selectedCountryId],
    queryFn: () => fetchProducts(selectedCountryId, user),
    enabled: !!selectedCountryId && !!user,
  });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedCountry = countries?.find(
    (c) => String(c.id) === String(selectedCountryId),
  );

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Country selector */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Globe
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                disabled={countriesLoading || countriesError}
                className="pl-8 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-700
                  bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer min-w-[170px]"
              >
                {countriesLoading && <option>Loading…</option>}
                {countriesError && <option>Failed to load</option>}
                {!countriesLoading &&
                  !countriesError &&
                  countries?.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.country_name} ({c.abbreviation})
                    </option>
                  ))}
              </select>
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Currency pill */}
            {selectedCountry && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100
                border border-gray-200 rounded-lg text-xs font-semibold text-gray-600"
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: selectedCountry.currency_icon,
                  }}
                />
                {selectedCountry.abbreviation}
              </span>
            )}
          </div>

          {/* Add product */}
          <Link
            to="add"
            className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600
              text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <FaPlus size={12} /> Add Product
          </Link>
        </div>
      </div>

      {/* Loading */}
      {productsLoading && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm">Loading products…</p>
        </div>
      )}

      {/* Error */}
      {productsError && (
        <div className="text-center py-10">
          <p className="text-red-500 text-sm">Failed to load products.</p>
          <button
            onClick={() => refetchProducts()}
            className="mt-2 text-xs text-blue-600 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      {!productsLoading && !productsError && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                    {selectedCountry && (
                      <span
                        className="ml-1 text-xs font-normal text-gray-400"
                        dangerouslySetInnerHTML={{
                          __html: `(${selectedCountry.currency_icon})`,
                        }}
                      />
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Subscriptions
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-400 text-sm"
                    >
                      {searchTerm
                        ? "No products match your search"
                        : selectedCountryId
                          ? "No products available for this country"
                          : "Select a country to view products"}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    // ── Resolve price for the selected country ──────────────
                    const priceEntry = getCountryPrice(
                      product.prices,
                      selectedCountryId,
                    );
                    const hasPrice = priceEntry && priceEntry.price != null;

                    // ── Discount label ──────────────────────────────────────
                    const discountLabel = () => {
                      if (
                        !priceEntry?.discount_type ||
                        !priceEntry?.discount_amount
                      )
                        return null;
                      return priceEntry.discount_type === "percentage"
                        ? `${priceEntry.discount_amount}% off`
                        : `${selectedCountry?.currency_icon ?? ""} ${priceEntry.discount_amount} off`;
                    };
                    const discount = discountLabel();

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Name + ID + type badges */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-800">
                              {product.name}
                            </span>
                            <TypeBadge product={product} />
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            ID: {product.id} · {product.slug}
                          </div>
                        </td>

                        {/* Price — from prices[] for the selected country */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasPrice ? (
                            <div>
                              <span className="text-sm font-semibold text-gray-800">
                                {selectedCountry && (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: selectedCountry.currency_icon,
                                    }}
                                  />
                                )}
                                {priceEntry.price}
                              </span>
                              {discount && (
                                <span
                                  className="ml-2 text-xs font-medium text-green-600 bg-green-50
                                    border border-green-200 px-1.5 py-0.5 rounded-full"
                                  dangerouslySetInnerHTML={{ __html: discount }}
                                />
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              No price for this country
                            </span>
                          )}
                        </td>

                        {/* Features — product.details[] */}
                        <td className="px-6 py-4">
                          {product.details?.length > 0 ? (
                            <div className="text-xs text-gray-600">
                              <div className="truncate max-w-xs">
                                {product.details[0]}
                              </div>
                              {product.details.length > 1 && (
                                <div className="text-blue-600 font-medium mt-0.5">
                                  +{product.details.length - 1} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No features
                            </span>
                          )}
                        </td>

                        {/* Subscriptions — product.subscription_period[] */}
                        <td className="px-6 py-4">
                          {product.subscription_period?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.subscription_period
                                .slice(0, 2)
                                .map((sub) => (
                                  <span
                                    key={sub.id}
                                    className={`text-xs px-2 py-1 rounded
                                    ${
                                      sub.status === 1
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-gray-100 text-gray-400 line-through"
                                    }`}
                                    title={
                                      sub.discount_type
                                        ? `${sub.discount_type}: ${sub.amount}`
                                        : `Amount: ${sub.amount}`
                                    }
                                  >
                                    {formatDuration(sub.duration)}
                                  </span>
                                ))}
                              {product.subscription_period.length > 2 && (
                                <span className="text-xs text-blue-600 font-medium">
                                  +{product.subscription_period.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <Link
                              to={`edit/${product.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit product"
                            >
                              <FaEdit />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {products.length}
                </span>{" "}
                products
                {selectedCountry && (
                  <span className="text-gray-400">
                    {" "}
                    in {selectedCountry.country_name}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
