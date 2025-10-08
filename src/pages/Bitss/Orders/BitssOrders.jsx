import { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";

export default function BitssOrders() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - you might want to set this as an environment variable
  const baseUrl = import.meta.env.VITE_Base_Url;

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/orders/order/index`, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setOrders(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [baseUrl]);

  // Calculate stats from actual data
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "processing"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateOrderTotal = (order) => {
    if (order.invoices && order.invoices.length > 0) {
      return `$${order.invoices[0].totalAmount}`;
    }

    // Fallback: calculate from products
    if (order.products && order.products.length > 0) {
      const total = order.products.reduce(
        (sum, product) => sum + (product.price || 0),
        0
      );
      return `$${total}`;
    }

    return "$0.00";
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-neutral-600">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error loading orders</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Order Management
        </h1>
        <p className="text-neutral-600">Manage and track all BITSS orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-1">
            Total Orders
          </h3>
          <p className="text-2xl font-bold text-neutral-800">{totalOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-1">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-1">
            Processing
          </h3>
          <p className="text-2xl font-bold text-blue-600">{processingOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-1">
            Completed
          </h3>
          <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search orders by ID, order number, domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors duration-200">
            Add New Order
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-neutral-500"
                  >
                    {orders.length === 0
                      ? "No orders found"
                      : "No orders match your search"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-700">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {order.domain}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-800">
                      {calculateOrderTotal(order)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/dashboard/bitss/orders/${order.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <FaEye />
                        </Link>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors">
                          <FaEdit />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
