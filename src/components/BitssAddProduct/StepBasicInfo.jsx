import { Search, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { FormField, TextInput, SelectInput, SectionCard, InfoBox } from "../Ui";
import { STATUS_OPTIONS } from "../../hooks/useProductForm";
import { useVariants } from "../../hooks/useVariants";

// ─── Sub-component: Variant picker (USB with is_product_variant) ──────────────
function VariantPicker({ selectedIds, onChange }) {
  const { data: variants = [], isLoading, isError } = useVariants();

  const toggle = (id) => {
    const exists = selectedIds.includes(id);
    onChange(
      exists ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
    );
  };

  return (
    <SectionCard
      title="Storage Variants"
      description="Select which variants this USB product comes in"
    >
      {isLoading && (
        <p className="text-sm text-gray-400 py-2">Loading variants…</p>
      )}
      {isError && (
        <p className="text-sm text-red-400 py-2">Failed to load variants.</p>
      )}
      {!isLoading && !isError && (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {variants.length === 0 && (
            <p className="text-sm text-gray-400 py-2">No variants found.</p>
          )}
          {variants.map((v) => {
            const isSelected = selectedIds.includes(v.id);
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => toggle(v.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left
                  ${
                    isSelected
                      ? "border-amber-400 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div
                  className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"}
                `}
                >
                  {isSelected && (
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
                  )}
                </div>
                <span
                  className={`flex-1 text-sm font-medium ${isSelected ? "text-amber-800" : "text-gray-700"}`}
                >
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {selectedIds.length > 0 && (
        <p className="text-xs font-semibold text-amber-600 mt-2">
          {selectedIds.length} variant{selectedIds.length !== 1 ? "s" : ""}{" "}
          selected
        </p>
      )}
    </SectionCard>
  );
}
import { useCountries } from "../../hooks/useCountries";
import useAuth from "../../hooks/useAuth";
import { useCategories } from "../../hooks/useCategories";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const fetchProducts = async (countryId, token) => {
  const res = await fetch(`${BASE_URL}/products?country_id=${countryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Invalid response");
  return data.data || [];
};

// ─── Sub-component: Combo product picker ─────────────────────────────────────
function ComboProductPicker({ selectedIds, onChange, error }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [countryId, setCountryId] = useState("");

  const { data: countries, isLoading: countriesLoading } = useCountries();

  // Auto-select first country once loadedimport { useCategories } from "../../hooks/useCategories";
  useEffect(() => {
    if (countries?.length > 0 && !countryId) {
      setCountryId(String(countries[0].id));
    }
  }, [countries]);

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["combo-products", countryId],
    queryFn: () => fetchProducts(countryId, user),
    enabled: !!countryId && !!user,
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id) => {
    const exists = selectedIds.includes(id);
    onChange(
      exists ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
    );
  };

  return (
    <SectionCard
      title="Products in this Combo"
      description="Select at least 2 products to bundle together"
    >
      {/* Country selector + Search row */}
      <div className="flex gap-2 mb-3">
        {/* Country */}
        <div className="relative flex items-center flex-shrink-0">
          <Globe
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            disabled={countriesLoading}
            className="pl-7 pr-7 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700
              bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              appearance-none cursor-pointer disabled:opacity-50 min-w-[150px]"
          >
            {countriesLoading && <option>Loading…</option>}
            {!countriesLoading &&
              countries?.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.country_name} ({c.abbreviation})
                </option>
              ))}
          </select>
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
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

        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none
              focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Product list */}
      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
        {/* Loading */}
        {productsLoading && (
          <p className="text-center text-sm text-gray-400 py-4">
            Loading products…
          </p>
        )}

        {/* Error */}
        {productsError && (
          <p className="text-center text-sm text-red-400 py-4">
            Failed to load products.
          </p>
        )}

        {/* List */}
        {!productsLoading &&
          !productsError &&
          filtered.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            // Get price for selected country
            const priceEntry = product.prices?.find(
              (p) => String(p.country_id) === String(countryId),
            );

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggle(product.id)}
                className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left
                ${
                  isSelected
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
              >
                <div
                  className={`
                w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isSelected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}
              `}
                >
                  {isSelected && (
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
                  )}
                </div>
                <span
                  className={`flex-1 text-sm font-medium ${isSelected ? "text-indigo-800" : "text-gray-700"}`}
                >
                  {product.name}
                </span>
                {priceEntry ? (
                  <span className="text-xs font-semibold text-gray-400">
                    {priceEntry.price}
                  </span>
                ) : (
                  <span className="text-xs text-gray-300 italic">No price</span>
                )}
              </button>
            );
          })}

        {!productsLoading && !productsError && filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">
            No products found
          </p>
        )}
      </div>

      {selectedIds.length > 0 && (
        <p className="text-xs font-semibold text-indigo-600 mt-2">
          {selectedIds.length} product{selectedIds.length !== 1 ? "s" : ""}{" "}
          selected
        </p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1.5">⚠ {error}</p>
      )}
    </SectionCard>
  );
}

// ─── Main Step 2 component ────────────────────────────────────────────────────
export default function StepBasicInfo({ form, update, errors }) {
  // { id, name, slug, icon, sort_description, is_default, ... }
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-500 mt-1">
          Core details that identify this product in the system.
        </p>
      </div>

      <SectionCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name — full width */}
          <div className="md:col-span-2">
            <FormField label="Product Name" required error={errors.name}>
              <TextInput
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Norton 360 Deluxe — 3 Devices, 1 Year"
                error={errors.name}
              />
            </FormField>
          </div>

          {/* Category */}
          <FormField label="Category" required error={errors.category_id}>
            <SelectInput
              value={form.category_id}
              onChange={(e) => update("category_id", e.target.value)}
              error={errors.category_id}
            >
              <option value="">
                {categoriesLoading ? "Loading…" : "Select a category…"}
              </option>
              {!categoriesLoading &&
                categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </SelectInput>
          </FormField>

          {/* Status */}
          <FormField label="Status">
            <SelectInput
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </SelectInput>
          </FormField>

          {/* Description — full width, rich text */}
          <div className="md:col-span-2">
            <FormField label="Description">
              <div className="rounded-lg overflow-hidden border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <SunEditor
                  setContents={form.sort_description}
                  onChange={(content) => update("sort_description", content)}
                  setOptions={{
                    buttonList: [
                      [
                        "undo",
                        "redo",
                        "formatBlock",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                      ],
                      ["fontSize", "fontColor", "hiliteColor", "removeFormat"],
                      ["align", "list", "outdent", "indent", "lineHeight"],
                      [
                        "blockquote",
                        "horizontalRule",
                        "table",
                        "link",
                        "image",
                        "video",
                      ],
                      ["fullScreen", "showBlocks", "preview"],
                    ],
                    charCounter: true,
                    charCounterLabel: "Characters:",

                    formats: [
                      "p",
                      "div",
                      "h1",
                      "h2",
                      "h3",
                      "h4",
                      "h5",
                      "h6",
                      "blockquote",
                    ],
                    fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36],
                  }}
                />
              </div>
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* Combo product picker */}
      {form.is_combo && (
        <ComboProductPicker
          selectedIds={form.selected_products}
          onChange={(ids) => update("selected_products", ids)}
          error={errors.selected_products}
        />
      )}

      {/* Variant picker — USB with is_product_variant */}
      {form.is_usb && form.is_product_variant && (
        <VariantPicker
          selectedIds={form.variants || []}
          onChange={(ids) => update("variants", ids)}
        />
      )}

      {/* Contextual info boxes */}
      {form.is_combo && (
        <InfoBox variant="blue">
          💡 <strong>Combo Pack:</strong> Individual product prices are managed
          separately per product.
        </InfoBox>
      )}
      {form.is_usb && (
        <InfoBox variant="amber">
          🔌 <strong>USB Device:</strong> Unit-based pricing (e.g. per 1, 6, or
          10 units) is configured in the Pricing step. Subscription periods do
          not apply.
        </InfoBox>
      )}
    </div>
  );
}
