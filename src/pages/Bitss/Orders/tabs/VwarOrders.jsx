import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function VwarOrders({ user, baseUrl, onCountChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Track per-row approval state
  const [approvalStatus, setApprovalStatus] = useState({}); // { [orderId]: selectedStatus }
  const [approvingId, setApprovingId] = useState(null); // currently submitting order id

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/orders/vwar/usb-usb-key-protection/orders`,
        { headers: { Authorization: `Bearer ${user}` } },
      );

      if (!response.ok)
        throw new Error(`Failed to fetch VWAR orders: ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
        onCountChange(result.data.length);

        // Initialize approval status from current payment status
        const initialStatuses = {};
        result.data.forEach((order) => {
          initialStatuses[order._id] = order.payment?.status || "PENDING";
        });
        setApprovalStatus(initialStatuses);
      } else {
        throw new Error(result.message || "Failed to fetch VWAR orders");
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

  const handleApprove = async (order) => {
    const paymentId = order.payment?._id;
    const status = approvalStatus[order._id];

    if (!paymentId || !status) return;

    try {
      setApprovingId(order._id);

      const response = await fetch(
        `${baseUrl}/orders/vwar/usb-usb-key-protection/order/payment/approve?payment_id=${paymentId}&status=${status}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${user}` },
        },
      );

      if (!response.ok) throw new Error(`Approval failed: ${response.status}`);

      const result = await response.json();
      if (result.success) {
        // Update the order's payment status locally
        setOrders((prev) =>
          prev.map((o) =>
            o._id === order._id
              ? { ...o, payment: { ...o.payment, status } }
              : o,
          ),
        );
      } else {
        throw new Error(result.message || "Approval failed");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setApprovingId(null);
    }
  };

  // Stats
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.payment?.status === "PAID").length;
  const pendingOrders = orders.filter(
    (o) => o.payment?.status === "PENDING",
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

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Orders", value: totalOrders, color: "text-gray-800" },
          { label: "Paid", value: paidOrders, color: "text-green-600" },
          {
            label: "Pending Payment",
            value: pendingOrders,
            color: "text-yellow-600",
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
                  "Order Number",
                  "User",
                  "USB Quantity",
                  "Amount",
                  "Payment Type",
                  "Payment Status",
                  "Date",
                  "Approve",
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
                currentItems.map((order) => {
                  const isApproving = approvingId === order._id;
                  const currentStatus = order.payment?.status;
                  const selectedStatus =
                    approvalStatus[order._id] || currentStatus;
                  const isUnchanged = selectedStatus === currentStatus;

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Order Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {order.order_number}
                        </span>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.user?.username || order.username || "N/A"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {order.user?.email || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* USB Quantity */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {order.usb_device_quantity}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {order.payment?.amount} {order.payment?.currency}
                        </span>
                      </td>

                      {/* Payment Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {order.payment?.payment_type?.replace(/_/g, " ") ||
                            "N/A"}
                        </span>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getPaymentStatusStyle(currentStatus)}`}
                        >
                          {currentStatus || "N/A"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>

                      {/* Approve Action */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedStatus}
                            onChange={(e) =>
                              setApprovalStatus((prev) => ({
                                ...prev,
                                [order._id]: e.target.value,
                              }))
                            }
                            disabled={isApproving}
                            className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="FAILED">FAILED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>

                          <button
                            onClick={() => handleApprove(order)}
                            disabled={isApproving || isUnchanged}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isApproving ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            {isApproving ? "Saving..." : "Apply"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
