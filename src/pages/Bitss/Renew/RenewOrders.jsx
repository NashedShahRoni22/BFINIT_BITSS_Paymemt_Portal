import { useState, useEffect } from "react";
import {
  Calendar,
  RefreshCw,
  Eye,
  Filter,
  X,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";

export default function RenewOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState({});

  // Get initial filters from URL
  const getFiltersFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      startDate: params.get("startDate") || "",
      endDate: params.get("endDate") || "",
      email: params.get("email") || "",
      orderNumber: params.get("order_number") || "",
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());

  // Update URL with filter parameters
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.startDate) params.set("startDate", newFilters.startDate);
    if (newFilters.endDate) params.set("endDate", newFilters.endDate);
    if (newFilters.email) params.set("email", newFilters.email);
    if (newFilters.orderNumber)
      params.set("order_number", newFilters.orderNumber);

    const newURL = `${window.location.pathname}${
      params.toString() ? "?" + params.toString() : ""
    }`;
    window.history.pushState({}, "", newURL);
  };

  // Fetch renewal orders from API
  const fetchRenewOrders = async (filtersToUse = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtersToUse.startDate)
        params.append("startDate", filtersToUse.startDate);
      if (filtersToUse.endDate) params.append("endDate", filtersToUse.endDate);
      if (filtersToUse.email) params.append("email", filtersToUse.email);
      if (filtersToUse.orderNumber)
        params.append("order_number", filtersToUse.orderNumber);

      const response = await fetch(
        `https://backend.bitss.one/api/v1/orders/order/renew/list?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
      } else {
        console.error("Failed to fetch orders:", result.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      startDate: "",
      endDate: "",
      email: "",
      orderNumber: "",
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
    fetchRenewOrders(clearedFilters);
  };

  const applyFilters = () => {
    updateURL(filters);
    fetchRenewOrders(filters);
  };

  const handleApproveOrder = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to approve this invoice?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://backend.bitss.one/api/v1/orders/order/renew/approve/manual?invoice_id=${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        fetchRenewOrders();
        alert("Order approved successfully!");
      } else {
        alert("Failed to approve order: " + result.message);
      }
    } catch (error) {
      console.error("Error approving order:", error);
      alert("Error approving order. Please try again.");
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Calculate stats based on all invoices
  const calculateStats = () => {
    let totalInvoices = 0;
    let paidInvoices = 0;
    let pendingInvoices = 0;

    orders.forEach((order) => {
      totalInvoices += order.invoices.length;
      order.invoices.forEach((invoice) => {
        if (invoice.paid) {
          paidInvoices++;
        } else {
          pendingInvoices++;
        }
      });
    });

    return {
      total: totalInvoices,
      paid: paidInvoices,
      pending: pendingInvoices,
    };
  };

  const stats = calculateStats();

  const paginatedOrders = orders.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(orders.length / entriesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Renew Orders
          </h1>
          <p className="text-gray-600">Track and manage renewal orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Renewals</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Renewed</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.paid}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-green-600 font-bold text-xl">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            {(filters.startDate ||
              filters.endDate ||
              filters.email ||
              filters.orderNumber) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={filters.email}
                    onChange={(e) =>
                      handleFilterChange("email", e.target.value)
                    }
                    placeholder="Enter email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    value={filters.orderNumber}
                    onChange={(e) =>
                      handleFilterChange("orderNumber", e.target.value)
                    }
                    placeholder="Enter order number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="text-sm text-gray-600">
              Showing{" "}
              {orders.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1}{" "}
              to {Math.min(currentPage * entriesPerPage, orders.length)} of{" "}
              {orders.length} orders
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Invoices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product(s)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                      Loading...
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No renewal orders found
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const isExpanded = expandedOrders[order._id];
                    const hasMultipleInvoices = order.invoices.length > 1;

                    return (
                      <>
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {hasMultipleInvoices && (
                                <button
                                  onClick={() =>
                                    toggleOrderExpansion(order._id)
                                  }
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {order.order_number}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              {order.invoices.length} invoice
                              {order.invoices.length !== 1 ? "s" : ""}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700">
                              {hasMultipleInvoices ? (
                                <span className="font-medium">
                                  {order.invoices.length} products
                                </span>
                              ) : (
                                order.invoices[0]?.product?.name
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">
                              {order.invoices[0]?.order?.domain}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {order.invoices[0]?.order_user?.name}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {order.invoices[0]?.order_user?.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full w-fit ${
                                  order.invoices[0]?.order?.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.invoices[0]?.order?.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {
                                  order.invoices.filter((inv) => inv.paid)
                                    .length
                                }{" "}
                                paid / {order.invoices.length} total
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasMultipleInvoices ? (
                              <button
                                onClick={() => toggleOrderExpansion(order._id)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {isExpanded ? "Hide" : "View"} Details
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/dashboard/bitss/renew/${order.invoices[0]._id}`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Link>
                                {!order.invoices[0].paid && (
                                  <button
                                    onClick={() =>
                                      handleApproveOrder(order.invoices[0]._id)
                                    }
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Expanded Invoices */}
                        {isExpanded && hasMultipleInvoices && (
                          <tr>
                            <td colSpan="7" className="px-6 py-4 bg-gray-50">
                              <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                  Invoices for Order {order.order_number}
                                </h4>
                                <div className="space-y-2">
                                  {order.invoices.map((invoice, idx) => (
                                    <div
                                      key={invoice._id}
                                      className="bg-white rounded-lg border border-gray-200 p-4"
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                        <div className="md:col-span-2">
                                          <p className="text-xs text-gray-500 mb-1">
                                            Product
                                          </p>
                                          <p className="text-sm font-medium text-gray-900">
                                            {invoice.product?.name}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">
                                            Issued
                                          </p>
                                          <p className="text-sm text-gray-700">
                                            {formatDate(invoice.issued_at)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">
                                            End Date
                                          </p>
                                          <p className="text-sm text-gray-700">
                                            {formatDate(invoice.end_date)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">
                                            Payment
                                          </p>
                                          <span
                                            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                                              invoice.paid
                                                ? "bg-green-100 text-green-800"
                                                : "bg-orange-100 text-orange-800"
                                            }`}
                                          >
                                            {invoice.paid
                                              ? `✓ ${invoice.payment_type}`
                                              : "Pending"}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                          <Link
                                            to={`/dashboard/bitss/renew/${invoice._id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                          >
                                            <Eye className="w-3 h-3" />
                                            View
                                          </Link>
                                          {!invoice.paid && (
                                            <button
                                              onClick={() =>
                                                handleApproveOrder(invoice._id)
                                              }
                                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                              <CheckCircle className="w-3 h-3" />
                                              Approve
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
