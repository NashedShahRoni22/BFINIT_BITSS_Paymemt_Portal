import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { user: token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

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
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
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
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Products
              </h2>
              <div className="space-y-4">
                {order.products?.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.product.category.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.currency}{" "}
                          {(order.currency_rate * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Subscription:</span>
                        <span className="ml-2 font-medium">
                          {item.subscription.duration} month(s)
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Discount:</span>
                        <span className="ml-2 font-medium">
                          {item.subscription.amount}
                          {item.subscription.discount_type === "percent"
                            ? "%"
                            : ` ${order.currency}`}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Period:</span>
                        <span className="ml-2 font-medium">
                          {new Date(item.start_date).toLocaleDateString()} -{" "}
                          {new Date(item.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {item.product.product_details &&
                      item.product.product_details.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Features:
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {item.product.product_details
                              .slice(0, 3)
                              .map((detail, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-green-500 mr-2">✓</span>
                                  {detail}
                                </li>
                              ))}
                            {item.product.product_details.length > 3 && (
                              <li className="text-gray-500 italic">
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
                  <span>${calculateOrderSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Currency Rate</span>
                  <span>×{order.currency_rate}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>
                    {order.currency} {calculateOrderTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-gray-600">Terms Accepted:</span>
                  <span
                    className={
                      order.terms_and_conditions
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {order.terms_and_conditions ? "✓ Yes" : "✗ No"}
                  </span>
                </div> */}
              </div>

              {/* <div className="mt-6 space-y-2">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Print Invoice
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
                  Send to Customer
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
