import { useState } from "react";
import { Truck, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import EditDeliveryChargeModal from "./EditDeliveryChargeModal";
import useAuth from "../../hooks/useAuth";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

export default function DeliveryChargeCard({ charge }) {
  const { user: token } = useAuth();
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this delivery charge?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/delivery-charges/${charge.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Delivery charge deleted successfully!");
        queryClient.invalidateQueries(["delivery-charges"]);
      } else {
        alert(data.message || "Failed to delete delivery charge");
      }
    } catch (error) {
      console.error("Error deleting delivery charge:", error);
      alert("Failed to delete delivery charge");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {charge?.country_name || "Unknown Country"}
              </h3>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Delivery Charge</p>
          <p className="text-2xl font-bold text-gray-800">
            {getCurrencySymbol(charge?.currency)}
            {charge.amount?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditDeliveryChargeModal
          charge={charge}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
