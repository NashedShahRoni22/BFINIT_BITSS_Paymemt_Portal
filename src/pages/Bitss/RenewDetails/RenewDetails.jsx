import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Check,
  X,
  Loader2,
  Package,
  Calendar,
  CreditCard,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";

export default function RenewDetails() {
  const { invoiceId } = useParams();
  const { user: token } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [invoiceId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://backend.bitss.one/api/v1/orders/order/show/renew/invoice?invoice_id=${invoiceId}`,
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
      if (result.success) {
        setOrderData(result.data);
      } else {
        throw new Error(result.message || "Failed to load order");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewalCancel = async () => {
    if (
      !window.confirm(`Are you sure you want to cancel this renewal order?`)
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        `https://backend.bitss.one/api/v1/orders/order/renew/invoice/inactive/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to cancel renewal order`);
      }

      await fetchOrderDetails();

      alert(`Renewal order cancelled successfully!`);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenewApprove = async () => {
    if (
      !window.confirm("Are you sure you want to approve this renewal order?")
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        `https://backend.bitss.one/api/v1/orders/order/renew/approve/manual?invoice_id=${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to approve renewal order`);
      }

      await fetchOrderDetails();

      alert(`Renewal order approved successfully!`);
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
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fixed function to handle status as any type
  const getStatusColor = (status) => {
    // Convert status to string and handle null/undefined
    const statusStr = status ? String(status).toLowerCase() : "";

    switch (statusStr) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
      case "inactive":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaidStatusColor = (paid) => {
    return paid
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  // Fixed function to format status safely
  const formatStatus = (status) => {
    if (!status) return "Unknown";
    const statusStr = String(status);
    return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
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

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const { invoice, order, product } = orderData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard/bitss/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Renewal Order Details
              </h1>
              <p className="text-gray-600 mt-1">Order #{order.order_number}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(
                  order.status
                )}`}
              >
                {formatStatus(order.status)}
              </span>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getPaidStatusColor(
                  invoice.paid
                )}`}
              >
                {invoice.paid ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info & Customer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Invoice Information
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Invoice Type</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {invoice.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {invoice.payment_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issued At</p>
                  <p className="font-semibold text-gray-800">
                    {formatDateTime(invoice.issued_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="font-semibold text-gray-800">
                    {invoice.currency} (Rate: {invoice.currency_rate})
                  </p>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Order Information
                </h2>
              </div>
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
                  <p className="text-sm text-gray-600">Order Type</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {order.order_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-semibold text-gray-800">
                    {formatDateTime(order.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updated At</p>
                  <p className="font-semibold text-gray-800">
                    {formatDateTime(order.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {invoice.user && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Customer Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="text-gray-400 mt-1 w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-800">
                        {invoice.user.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-1 w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">
                        {invoice.user.email}
                      </p>
                    </div>
                  </div>
                  {invoice.user.personal_email && (
                    <div className="flex items-start gap-3">
                      <Mail className="text-gray-400 mt-1 w-5 h-5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Personal Email</p>
                        <p className="font-semibold text-gray-800">
                          {invoice.user.personal_email}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1 w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-800">
                        {invoice.user.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Renewal Product
                </h2>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                      {product.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Renewal Period: {product.period} months
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-lg">
                      {orderData.currency} {orderData.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Base: {product.product.price} × {product.period}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Subscription:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {product.subscription.duration} months
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Discount:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {product.subscription.amount}
                      {product.subscription.discount_type === "percent"
                        ? "%"
                        : ` ${orderData.currency}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Start Date:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {formatDate(product.start_date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {formatDate(product.end_date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(
                        product.renew_status
                      )}`}
                    >
                      {formatStatus(product.renew_status)}
                    </span>
                  </div>
                </div>

                {product.product.product_details &&
                  product.product.product_details.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-2">
                        Features:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1.5">
                        {product.product.product_details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-0.5">
                              ✓
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Payment Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Product Price</span>
                  <span>
                    {orderData.currency} {orderData.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Currency Rate</span>
                  <span>×{orderData.rateUsed}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total Amount</span>
                  <span>
                    {invoice.currency} {invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaidStatusColor(
                      invoice.paid
                    )}`}
                  >
                    {invoice.paid ? "Paid" : "Unpaid"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Renewal Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      invoice.paid
                    )}`}
                  >
                    {invoice.paid ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Action Buttons - Fixed condition */}
              {!invoice.paid && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleRenewApprove}
                    disabled={actionLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Approve Renewal
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRenewalCancel}
                    disabled={actionLoading}
                    className="w-full bg-white border-2 border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5 mr-2" />
                        Cancel Renewal
                      </>
                    )}
                  </button>
                </div>
              )}

              {invoice.paid && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 text-center font-medium">
                    ✓ Renewal order has been approved
                  </p>
                </div>
              )}

              {/* {!invoice.paid && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 text-center font-medium">
                    ✗ Renewal order has been cancelled
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
