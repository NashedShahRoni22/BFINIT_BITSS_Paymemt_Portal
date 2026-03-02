import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Eye } from "lucide-react";
import { Link } from "react-router";

export default function ManualOrders({ user, baseUrl, onCountChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/orders/order/retail/package/index`,
        { headers: { Authorization: `Bearer ${user}` } },
      );

      if (!response.ok)
        throw new Error(`Failed to fetch manual orders: ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
        onCountChange(result.data.length);
      } else {
        throw new Error(result.message || "Failed to fetch manual orders");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.order_status === "pending",
  ).length;
  const processingOrders = orders.filter(
    (o) => o.order_status === "processing",
  ).length;
  const completedOrders = orders.filter(
    (o) => o.order_status === "completed",
  ).length;

  // Pagination
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pageNumbers.push(i);
      pageNumbers.push("...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, "...");
      for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1, "...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++)
        pageNumbers.push(i);
      pageNumbers.push("...", totalPages);
    }
    return pageNumbers;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Orders", value: totalOrders, color: "text-gray-800" },
          { label: "Pending", value: pendingOrders, color: "text-yellow-600" },
          {
            label: "Processing",
            value: processingOrders,
            color: "text-blue-600",
          },
          {
            label: "Completed",
            value: completedOrders,
            color: "text-green-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {stat.label}
            </h3>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="text-sm text-gray-600">
            Showing {totalItems > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, totalItems)} of {totalItems} orders
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Customer",
                  "Contact",
                  "Product",
                  "Subscription",
                  "Price",
                  "Status",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                currentItems.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {order.full_name || "N/A"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {order.country || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-700">
                          {order.email || "N/A"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {order.phone || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4 max-w-xs">
                      <span
                        className="text-sm text-gray-700 block truncate"
                        title={order.product?.name}
                      >
                        {order.product?.name || "N/A"}
                      </span>
                    </td>

                    {/* Subscription */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-700">
                          {order.subscription?.duration} months
                        </div>
                        <div className="text-gray-500 text-xs">
                          {order.subscription?.amount}%{" "}
                          {order.subscription?.discount_type} off
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ${order.package_price?.toFixed(2)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusStyle(order.order_status)}`}
                      >
                        {order.order_status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-2">
              {getPageNumbers().map((pageNum, index) =>
                pageNum === "..." ? (
                  <span key={`e-${index}`} className="px-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
