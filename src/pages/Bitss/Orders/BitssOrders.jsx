import { useState, useEffect } from "react";
import {
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";

export default function BitssOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [manualOrders, setManualOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("online");
  const [showFilters, setShowFilters] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get initial filters from URL
  const getFiltersFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      startDate: params.get("startDate") || "",
      endDate: params.get("endDate") || "",
      email: params.get("email") || "",
      orderNumber: params.get("orderNumber") || "",
      status: params.get("status") || "",
      domain: params.get("domain") || "",
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());
  const baseUrl = "https://backend.bitss.one/api/v1";

  // Update URL with filter parameters
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.startDate) params.set("startDate", newFilters.startDate);
    if (newFilters.endDate) params.set("endDate", newFilters.endDate);
    if (newFilters.email) params.set("email", newFilters.email);
    if (newFilters.orderNumber)
      params.set("orderNumber", newFilters.orderNumber);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.domain) params.set("domain", newFilters.domain);

    const newURL = `${window.location.pathname}${
      params.toString() ? "?" + params.toString() : ""
    }`;
    window.history.pushState({}, "", newURL);
  };

  // Fetch online orders
  const fetchOrders = async (filtersToUse = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtersToUse.startDate)
        params.append("startDate", filtersToUse.startDate);
      if (filtersToUse.endDate) params.append("endDate", filtersToUse.endDate);
      if (filtersToUse.email) params.append("email", filtersToUse.email);
      if (filtersToUse.orderNumber)
        params.append("orderNumber", filtersToUse.orderNumber);
      if (filtersToUse.status) params.append("status", filtersToUse.status);
      if (filtersToUse.domain) params.append("domain", filtersToUse.domain);

      const response = await fetch(
        `${baseUrl}/orders/order/index?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );

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

  // Fetch manual orders
  const fetchManualOrders = async (filtersToUse = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtersToUse.startDate)
        params.append("startDate", filtersToUse.startDate);
      if (filtersToUse.endDate) params.append("endDate", filtersToUse.endDate);
      if (filtersToUse.email) params.append("email", filtersToUse.email);
      if (filtersToUse.orderNumber)
        params.append("orderNumber", filtersToUse.orderNumber);
      if (filtersToUse.status) params.append("status", filtersToUse.status);
      if (filtersToUse.domain) params.append("domain", filtersToUse.domain);

      const response = await fetch(
        `${baseUrl}/orders/order/retail/package/index?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch manual orders: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setManualOrders(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch manual orders");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching manual orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "online") {
      fetchOrders();
    } else {
      fetchManualOrders();
    }
  }, [activeTab]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      startDate: "",
      endDate: "",
      email: "",
      orderNumber: "",
      status: "",
      domain: "",
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
    if (activeTab === "online") {
      fetchOrders(clearedFilters);
    } else {
      fetchManualOrders(clearedFilters);
    }
    setCurrentPage(1);
  };

  const applyFilters = () => {
    updateURL(filters);
    if (activeTab === "online") {
      fetchOrders(filters);
    } else {
      fetchManualOrders(filters);
    }
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setError(null);
  };

  // Get current data based on active tab
  const currentData = activeTab === "online" ? orders : manualOrders;

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "processing"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "active"
  ).length;

  const totalManualOrders = manualOrders.length;
  const pendingManualOrders = manualOrders.filter(
    (order) => order.order_status === "pending"
  ).length;
  const processingManualOrders = manualOrders.filter(
    (order) => order.order_status === "processing"
  ).length;
  const completedManualOrders = manualOrders.filter(
    (order) => order.order_status === "completed"
  ).length;

  // Pagination
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentData.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BITSS Orders
          </h1>
          <p className="text-gray-600">Manage and track all BITSS orders</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => handleTabChange("online")}
              className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
                activeTab === "online"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Online Orders
              {totalOrders > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "online"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {totalOrders}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange("manual")}
              className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
                activeTab === "manual"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Manual Orders
              {totalManualOrders > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "manual"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {totalManualOrders}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === "online" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Total Orders
              </h3>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Pending
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingOrders}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Processing
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {processingOrders}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Completed
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {completedOrders}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Total Orders
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {totalManualOrders}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Pending
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingManualOrders}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Processing
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {processingManualOrders}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Completed
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {completedManualOrders}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            {hasActiveFilters && (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Statuses</option>
                    {activeTab === "online" ? (
                      <>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="active">Active</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    ) : (
                      <>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={filters.domain}
                    onChange={(e) =>
                      handleFilterChange("domain", e.target.value)
                    }
                    placeholder="Enter domain"
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
        </div> */}

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
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
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
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {order.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.user?.name || "N/A"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {order.user?.email || order.user || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {activeTab === "online" ? (
                            order.products && order.products.length > 0 ? (
                              <div className="space-y-1">
                                {order.products.map((productItem, idx) => (
                                  <div
                                    key={productItem._id || idx}
                                    className="text-gray-700"
                                  >
                                    {productItem.product?.name ||
                                      "Unknown Product"}
                                    {order.products.length > 1 && (
                                      <span className="text-gray-400 ml-1">
                                        ({idx + 1}/{order.products.length})
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">No products</span>
                            )
                          ) : (
                            <span className="text-gray-700">
                              {order.package?.name || "N/A"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            (activeTab === "online"
                              ? order.status
                              : order.order_status) === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : (activeTab === "online"
                                  ? order.status
                                  : order.order_status) === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : (activeTab === "online"
                                  ? order.status
                                  : order.order_status) === "active" ||
                                (activeTab === "online"
                                  ? order.status
                                  : order.order_status) === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {activeTab === "online"
                            ? order.status
                            : order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/dashboard/bitss/orders/${order.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {getPageNumbers().map((pageNum, index) =>
                  pageNum === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-500"
                    >
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
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
