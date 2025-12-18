import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import {
  AlertCircle,
  Check,
  Loader2,
  ShieldAlert,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { user: token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_Base_Url || ""}/orders/order/show/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const result = await response.json();
      setOrder(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async () => {
    if (
      !window.confirm(
        "Are you sure you want to approve this order? This will mark it as 'active'."
      )
    ) {
      return;
    }

    try {
      setApproveLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_Base_Url || ""
        }/orders/order/confirm/paid/${orderId}/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve order");
      }

      const result = await response.json();

      // Refetch order details to get the updated status
      await fetchOrderDetails();

      alert("Order approved successfully!");
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setCancelLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_Base_Url || ""
        }/orders/order/confirm/paid/${orderId}/inactive`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      const result = await response.json();

      // Refetch order details to get the updated status
      await fetchOrderDetails();

      alert("Order cancelled successfully!");
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === order.status) {
      alert("Status is already set to this value");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to change the order status to ${selectedStatus}?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_Base_Url || ""
        }/orders/order/inactive/${orderId}/${selectedStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update order status`);
      }

      const result = await response.json();

      // Refetch order details to get the updated status
      await fetchOrderDetails();

      alert(`Order status updated to ${selectedStatus} successfully!`);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700 border-gray-200";

    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
      case "inactive":
        return "bg-red-100 text-red-700 border-red-200";
      case "refunded":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const calculateProductTotal = (product) => {
    return product.price || 0;
  };

  const calculateOrderSubtotal = () => {
    if (!order?.products) return 0;
    return order.products.reduce(
      (sum, product) => sum + calculateProductTotal(product),
      0
    );
  };

  const calculateOrderTotal = () => {
    const subtotal = calculateOrderSubtotal();
    return (order?.currency_rate || 1) * subtotal;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error}</p>
          <Link
            to="/dashboard/bitss/orders"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const statusOptions = [
    { value: "active", label: "Active", color: "text-green-700" },
    { value: "processing", label: "Processing", color: "text-blue-700" },
    { value: "cancelled", label: "Cancelled", color: "text-red-700" },
    { value: "refunded", label: "Refunded", color: "text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard/bitss/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1">Order #{order.order_number}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(
                order.status
              )}`}
            >
              {formatStatus(order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info & Customer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold text-gray-800">
                    {order.order_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Domain</p>
                  <p className="font-semibold text-gray-800">{order.domain}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-semibold text-gray-800">{order.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="font-semibold text-gray-800">
                    {order.currency} (Rate: {order.currency_rate})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updated At</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(order.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {order.user && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-800">
                        {order.user.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">
                        {order.user.email}
                      </p>
                    </div>
                  </div>
                  {order.user.personal_email && (
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Personal Email</p>
                        <p className="font-semibold text-gray-800">
                          {order.user.personal_email}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-800">
                        {order.user.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.user.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            <div className="bg-white rounded-xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-blue-600">Products</span>
              </h2>

              <div className="space-y-5">
                {order.products?.map((item) => (
                  <div
                    key={item._id}
                    className={`rounded-xl p-5 transition-all duration-300 relative overflow-hidden border-2 ${
                      item.renew_status === "inactive"
                        ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
                        : "bg-white border-blue-100 hover:border-blue-300"
                    }`}
                  >
                    {/* Inactive Status Badge */}
                    {item.renew_status === "inactive" && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 text-xs font-bold rounded-bl-xl flex items-center gap-1.5">
                          <ShieldAlert size={14} />
                          RENEWAL INACTIVE
                        </div>
                      </div>
                    )}

                    {/* Product Header */}
                    <div className="flex justify-between items-start mb-4 mt-2">
                      <div className="flex-1 pr-4">
                        <h3
                          className={`font-bold text-lg leading-tight ${
                            item.renew_status === "inactive"
                              ? "text-orange-900"
                              : "text-slate-800"
                          }`}
                        >
                          {item.product.name}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            item.renew_status === "inactive"
                              ? "text-orange-700"
                              : "text-slate-600"
                          }`}
                        >
                          {item.product.category.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-xl ${
                            item.renew_status === "inactive"
                              ? "text-orange-800"
                              : "text-blue-600"
                          }`}
                        >
                          {order.currency}{" "}
                          {(item.price * item.period).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Inactive Warning Alert */}
                    {item.renew_status === "inactive" && (
                      <div className="mb-4 p-4 bg-white border-2 border-orange-300 rounded-lg shadow-sm">
                        <div className="flex items-start gap-3">
                          <AlertCircle
                            className="text-orange-600 flex-shrink-0 mt-0.5"
                            size={20}
                          />
                          <div className="text-sm">
                            <p className="font-bold text-orange-900 mb-1">
                              ⚠️ Auto-Renewal Disabled
                            </p>
                            <p className="text-orange-800">
                              Your subscription will expire on{" "}
                              <span className="font-semibold">
                                {new Date(item.end_date).toLocaleDateString()}
                              </span>
                              . Reactivate now to maintain uninterrupted
                              service.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Subscription Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-blue-700 font-medium mb-1">
                          Subscription
                        </p>
                        <p className="text-slate-800 font-bold">
                          {item.subscription.duration / 12} year
                          {item.subscription.duration / 12 > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-green-700 font-medium mb-1">
                          Discount
                        </p>
                        <p className="text-slate-800 font-bold">
                          {item.subscription.amount}
                          {item.subscription.discount_type === "percent"
                            ? "%"
                            : ` ${order.currency}`}
                        </p>
                      </div>
                      <div className="col-span-2 bg-purple-50 rounded-lg p-3">
                        <p className="text-purple-700 font-medium mb-1">
                          Active Period
                        </p>
                        <p className="text-slate-800 font-semibold">
                          {new Date(item.start_date).toLocaleDateString()}
                          {" → "}
                          {new Date(item.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Features Section */}
                    {item.product.product_details &&
                      item.product.product_details.length > 0 && (
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200">
                          <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <span className="text-blue-600">✨</span>
                            Key Features
                          </p>
                          <ul className="text-sm space-y-2">
                            {item.product.product_details
                              .slice(0, 3)
                              .map((detail, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span
                                    className={`flex-shrink-0 mr-2.5 font-bold ${
                                      item.renew_status === "inactive"
                                        ? "text-orange-400"
                                        : "text-green-500"
                                    }`}
                                  >
                                    ✓
                                  </span>
                                  <span
                                    className={
                                      item.renew_status === "inactive"
                                        ? "text-orange-800"
                                        : "text-slate-700"
                                    }
                                  >
                                    {detail}
                                  </span>
                                </li>
                              ))}
                            {item.product.product_details.length > 3 && (
                              <li className="text-slate-500 italic pl-6">
                                +{item.product.product_details.length - 3} more
                                features
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({order.products?.length} items)</span>
                  <span>
                    {order.currency} {order?.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Currency Rate</span>
                  <span>×{order.currency_rate}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>
                    {order.currency} {order?.totalPrice}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Current Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>
              </div>

              {/* Approve and Cancel Order Buttons */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Order Actions
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={handleApproveOrder}
                    disabled={approveLoading || order.status !== "pending"}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {approveLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2" size={20} />
                        Approve Order
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Change Radio Buttons */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Update Order Status
                </h3>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedStatus === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="orderStatus"
                        value={option.value}
                        checked={selectedStatus === option.value}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className={`ml-3 font-medium ${
                          selectedStatus === option.value
                            ? option.color
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={actionLoading || selectedStatus === order.status}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Updating Status...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2" size={20} />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
