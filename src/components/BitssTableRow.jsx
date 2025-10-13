import { Link } from "react-router";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEllipsisV,
} from "react-icons/fa";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function BitssTableRow({ order }) {
  const { user: token } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (isPaid) => {
    return isPaid
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700";
  };

  const getPaymentMethodDisplay = (paymentType) => {
    const methods = {
      bank: "Bank Transfer",
      bkash: "bKash",
      nagad: "Nagad",
      rocket: "Rocket",
      card: "Card",
      stripe: "Stripe",
      paypal: "PayPal",
    };
    return methods[paymentType?.toLowerCase()] || paymentType || "N/A";
  };

  const calculateOrderTotal = (order) => {
    if (order.invoices && order.invoices.length > 0) {
      return `${order.currency} ${(
        order.currency_rate * order.invoices[0].totalAmount
      ).toFixed(2)}`;
    }

    if (order.products && order.products.length > 0) {
      const total = order.products.reduce(
        (sum, product) => sum + (product.price || 0),
        0
      );
      return `${order.currency} ${(order.currency_rate * total).toFixed(2)}`;
    }

    return `${order.currency} 0.00`;
  };

  const getPaymentStatus = () => {
    if (order.invoices && order.invoices.length > 0) {
      return order.invoices[0].paid;
    }
    return false;
  };

  const getPaymentMethod = () => {
    if (order.invoices && order.invoices.length > 0) {
      return order.invoices[0].payment_type;
    }
    return null;
  };

  const handleApproveOrder = async () => {
    if (!confirm("Are you sure you want to approve this order?")) {
      return;
    }

    setIsLoading(true);
    setShowDropdown(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_Base_Url || ""}/orders/order/confirm/paid/${order.id
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to approve order: ${response.statusText}`);
      }

      const data = await response.json();
      alert("Order approved successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error approving order:", error);
      alert(`Failed to approve order: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectOrder = () => {
    setShowDropdown(false);
    alert("Reject order functionality - To be implemented");
  };

  const isPaid = getPaymentStatus();
  const paymentMethod = getPaymentMethod();

  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-6 py-4 text-sm font-medium text-neutral-800">
        {order.id}
      </td>
      <td className="px-6 py-4 text-sm text-neutral-600">{order.domain}</td>
      <td className="px-6 py-4 text-sm text-neutral-600">
        {formatDate(order.created_at)}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
            isPaid
          )}`}
        >
          {isPaid ? "✓ Paid" : "⏱ Unpaid"}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-neutral-600">
        {getPaymentMethodDisplay(paymentMethod)}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-neutral-800">
        {calculateOrderTotal(order)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <Link
            to={`/dashboard/bitss/orders/${order.id}`}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <FaEye />
            <span>View Details</span>
          </Link>

          {order.status === "pending" ? (
            <button
              onClick={handleApproveOrder}
              disabled={isLoading}
              className="cursor-pointer px-4 py-2 text-sm font-medium flex items-center gap-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCheck className="text-green-600" />
              {isLoading ? "Approving..." : "Approve"}
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-green-700 bg-green-50 rounded-lg opacity-60 cursor-not-allowed"
            >
              <FaCheck className="text-green-600" />
              Approved
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
