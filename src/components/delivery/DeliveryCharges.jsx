import { useState } from "react";
import { Truck, Plus } from "lucide-react";
import DeliveryChargeCard from "./DeliveryChargeCard";
import AddDeliveryChargeModal from "./AddDeliveryChargeModal";
import { useDeliveryCharges } from "../../hooks/useDeliveryCharges";

export default function DeliveryCharges() {
  const [showModal, setShowModal] = useState(false);
  const {
    data: deliveryCharges,
    isLoading,
    isError,
    error,
  } = useDeliveryCharges();

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">Loading delivery charges...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">
          {error?.message || "Failed to load delivery charges"}
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
            {deliveryCharges?.length ?? 0}
          </span>{" "}
          delivery charges
        </span>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium hover:cursor-pointer"
        >
          <Plus size={16} />
          Add Delivery Charge
        </button>
      </div>

      {/* Empty State */}
      {(!deliveryCharges || deliveryCharges.length === 0) && (
        <div className="text-center py-20">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No delivery charges found
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click &quot;Add Delivery Charge&quot; to create your first one.
          </p>
        </div>
      )}

      {/* Grid */}
      {deliveryCharges && deliveryCharges.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deliveryCharges.map((charge) => (
            <DeliveryChargeCard key={charge.id} charge={charge} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddDeliveryChargeModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
