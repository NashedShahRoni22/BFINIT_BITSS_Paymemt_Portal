import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

export default function ManualTableRow({ order, onStatusUpdate }) {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.order_status);
  const baseUrl = import.meta.env.VITE_Base_Url;

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format phone number
  const formatPhone = (phone) => {
    return phone || "N/A";
  };

  // Get status badge styling
  const getStatusConfig = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending",
      },
      processing: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Processing",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Completed",
      },
      cancle: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Cancelled",
      },
    };

    return statusConfig[status?.toLowerCase()] || statusConfig.pending;
  };

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);

    try {
      const response = await fetch(
        `${baseUrl}/orders/order/retail/package/status/?id=${order._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
          body: JSON.stringify({
            order_status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setCurrentStatus(newStatus);
        toast.success(`Order status updated to ${newStatus}`);

        // Call the callback to refresh parent data if provided
        if (onStatusUpdate) {
          onStatusUpdate(order._id, newStatus);
        }
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const statusConfig = getStatusConfig(currentStatus);

  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-neutral-900">
          {order.full_name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-neutral-600">{order.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-neutral-600">
          {formatPhone(order.phone)}
        </div>
      </td>
      {/* <td className="px-6 py-4">
        <div className="text-sm font-medium text-neutral-900">
          {order.package_name}
        </div>
      </td> */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-neutral-600">{order.duration} months</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-neutral-900">
          ${order.package_price.toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-neutral-600">{order.country}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="relative">
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={` px-3 py-1 pr-8 rounded-lg text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${
              statusConfig.bg
            } ${statusConfig.text} ${
              isUpdating
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-md focus:ring-blue-500"
            }`}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancle">Cancelled</option>
          </select>
          {isUpdating && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-3 w-3 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-neutral-600">
          {formatDate(order.createdAt)}
        </div>
      </td>
    </tr>
  );
}
