import { useState } from "react";
import { Pencil, Plus, Building2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { useCountries } from "../../../hooks/useCountries";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const BANK_TYPES = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "mobile_banking", label: "Mobile Banking" },
];

// ─── API calls ────────────────────────────────────────────────────────────────
const fetchBankInfos = async (token) => {
  const res = await fetch(`${BASE_URL}/bank-informations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch bank information");
  const data = await res.json();
  if (!data.success && !data.status)
    throw new Error(data.message || "Invalid response");
  return data.data || [];
};

const createBankInfo = async ({ payload, token }) => {
  const res = await fetch(`${BASE_URL}/bank-informations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create bank information");
  const data = await res.json();
  if (!data.success && !data.status)
    throw new Error(data.message || "Failed to create");
  return data;
};

const updateBankInfo = async ({ id, payload, token }) => {
  const res = await fetch(`${BASE_URL}/bank-informations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update bank information");
  const data = await res.json();
  if (!data.success && !data.status)
    throw new Error(data.message || "Failed to update");
  return data;
};

// ─── Empty form ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  country_id: "",
  bank_name: "",
  account_no: "",
  branch: "",
  routing_number: "",
  swift_code: "",
  type: "bank_transfer",
};

// ─── Shared input style ───────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none";

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Bank form (shared by add + edit modal) ───────────────────────────────────
function BankForm({ formData, setFormData, countries, countriesLoading }) {
  const set = (field, val) =>
    setFormData((prev) => ({ ...prev, [field]: val }));

  return (
    <div className="space-y-4">
      {/* Country */}
      <Field label="Country" required>
        <select
          value={formData.country_id}
          onChange={(e) => set("country_id", e.target.value)}
          className={inputCls}
          required
        >
          <option value="">
            {countriesLoading ? "Loading…" : "Select a country…"}
          </option>
          {!countriesLoading &&
            countries?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.country_name} ({c.abbreviation})
              </option>
            ))}
        </select>
      </Field>

      {/* Bank Name */}
      <Field label="Bank Name" required>
        <input
          type="text"
          required
          value={formData.bank_name}
          onChange={(e) => set("bank_name", e.target.value)}
          placeholder="e.g. ABC Bank"
          className={inputCls}
        />
      </Field>

      {/* Account No */}
      <Field label="Account Number" required>
        <input
          type="text"
          required
          value={formData.account_no}
          onChange={(e) => set("account_no", e.target.value)}
          placeholder="e.g. 1234567890"
          className={inputCls}
        />
      </Field>

      {/* Branch */}
      <Field label="Branch">
        <input
          type="text"
          value={formData.branch}
          onChange={(e) => set("branch", e.target.value)}
          placeholder="e.g. Main Branch"
          className={inputCls}
        />
      </Field>

      {/* Routing Number + Swift side by side */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Routing Number">
          <input
            type="text"
            value={formData.routing_number}
            onChange={(e) => set("routing_number", e.target.value)}
            placeholder="e.g. 987654321"
            className={inputCls}
          />
        </Field>
        <Field label="SWIFT Code">
          <input
            type="text"
            value={formData.swift_code}
            onChange={(e) => set("swift_code", e.target.value)}
            placeholder="e.g. ABCDEF12"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Type */}
      <Field label="Transfer Type" required>
        <select
          value={formData.type}
          onChange={(e) => set("type", e.target.value)}
          className={inputCls}
        >
          {BANK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSubmit, isPending, submitLabel, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">{title}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {children}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50"
              >
                {isPending ? "Saving…" : submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Bank card ────────────────────────────────────────────────────────────────
function BankCard({ bank, countryName, currencyIcon, onEdit }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm shrink-0">
          {bank?.country?.country_name?.slice(0, 2).toUpperCase() ?? "—"}
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-800 leading-tight">
            {bank.bank_name}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {bank?.country?.country_name ??
              `Country: ${bank?.country?.country_name}`}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex justify-between">
          <span className="text-gray-400">Account No</span>
          <span className="font-medium text-gray-700">{bank.account_no}</span>
        </div>
        {bank.branch && (
          <div className="flex justify-between">
            <span className="text-gray-400">Branch</span>
            <span className="font-medium text-gray-700">{bank.branch}</span>
          </div>
        )}
        {bank.routing_number && (
          <div className="flex justify-between">
            <span className="text-gray-400">Routing</span>
            <span className="font-medium text-gray-700">
              {bank.routing_number}
            </span>
          </div>
        )}
        {bank.swift_code && (
          <div className="flex justify-between">
            <span className="text-gray-400">SWIFT</span>
            <span className="font-medium text-gray-700 font-mono">
              {bank.swift_code}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
          {BANK_TYPES.find((t) => t.value === bank.type)?.label ?? bank.type}
        </span>
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
          title="Edit"
        >
          <Pencil size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BankInformation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  // ─── Countries ──────────────────────────────────────────────────────────────
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  const getCountryName = (id) =>
    countries.find((c) => String(c.id) === String(id))?.country_name ?? null;

  // ─── GET ────────────────────────────────────────────────────────────────────
  const {
    data: banks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bank-informations"],
    queryFn: () => fetchBankInfos(user),
    enabled: !!user,
  });

  // ─── CREATE ─────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload) => createBankInfo({ payload, token: user }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-informations"] });
      setShowAddModal(false);
      setAddForm(EMPTY_FORM);
    },
    onError: (err) => alert(err.message),
  });

  // ─── UPDATE ─────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (payload) =>
      updateBankInfo({ id: selectedBank.id, payload, token: user }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-informations"] });
      setShowEditModal(false);
      setSelectedBank(null);
      setEditForm(EMPTY_FORM);
    },
    onError: (err) => alert(err.message),
  });

  const openEditModal = (bank) => {
    setSelectedBank(bank);
    setEditForm({
      country_id: String(bank.country?.id ?? bank.country_id ?? ""),
      bank_name: bank.bank_name ?? "",
      account_no: bank.account_no ?? "",
      branch: bank.branch ?? "",
      routing_number: bank.routing_number ?? "",
      swift_code: bank.swift_code ?? "",
      type: bank.type_name ?? "bank_transfer",
    });
    setShowEditModal(true);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-700">{banks.length}</span>{" "}
          bank{banks.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={16} />
          Add Bank
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm">Loading bank information…</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-10">
          <p className="text-red-500 text-sm">
            Failed to load bank information.
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && banks.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {banks.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              countryName={getCountryName(bank.country_id)}
              onEdit={() => openEditModal(bank)}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && banks.length === 0 && (
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No bank information found
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click "Add Bank" to create your first entry.
          </p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          title="Add Bank Information"
          onClose={() => {
            setShowAddModal(false);
            setAddForm(EMPTY_FORM);
          }}
          onSubmit={() => createMutation.mutate(addForm)}
          isPending={createMutation.isPending}
          submitLabel="Create"
        >
          <BankForm
            formData={addForm}
            setFormData={setAddForm}
            countries={countries}
            countriesLoading={countriesLoading}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBank && (
        <Modal
          title="Update Bank Information"
          onClose={() => {
            setShowEditModal(false);
            setSelectedBank(null);
          }}
          onSubmit={() => updateMutation.mutate(editForm)}
          isPending={updateMutation.isPending}
          submitLabel="Update"
        >
          <BankForm
            formData={editForm}
            setFormData={setEditForm}
            countries={countries}
            countriesLoading={countriesLoading}
          />
        </Modal>
      )}
    </div>
  );
}
