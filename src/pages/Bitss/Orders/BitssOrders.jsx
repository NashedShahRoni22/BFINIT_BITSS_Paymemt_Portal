import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BitssOrderTable from "../../../components/BitssOrders/BitssOrderTable";
import ManualOrderTable from "../../../components/BitssOrders/ManualOrderTable";

export default function BitssOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [manualOrders, setManualOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("online"); // 'online' or 'manual'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // API base URL
  const baseUrl = import.meta.env.VITE_Base_Url;

  // Fetch online orders from API
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
  }, [baseUrl, user]);

  // Fetch manual orders when tab is switched
  useEffect(() => {
    const fetchManualOrders = async () => {
      if (activeTab !== "manual") return;

      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/orders/order/retail/package/index`,
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

    if (activeTab === "manual" && manualOrders.length === 0) {
      fetchManualOrders();
    }
  }, [activeTab, baseUrl, user, manualOrders.length]);

  // Get current data based on active tab
  const currentData = activeTab === "online" ? orders : manualOrders;

  // Calculate stats from actual data (only for online orders)
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

  // Calculate stats for manual orders
  const totalManualOrders = manualOrders.length;
  const pendingManualOrders = manualOrders.filter(
    (order) => order.order_status === "pending"
  ).length;
  const processingManualOrders = manualOrders.filter(
    (order) => order.order_status === "processing"
  ).length;
  const completedmanualOrders = manualOrders.filter(
    (order) => order.order_status === "completed"
  ).length;

  // Pagination calculations
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentData.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setError(null);
  };

  // Handle status update for manual orders
  const handleStatusUpdate = (orderId, newStatus) => {
    setManualOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, order_status: newStatus } : order
      )
    );
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Generate page numbers
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

  if (loading && currentData.length === 0) {
    return <Loader />;
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
          BITSS Order
        </h1>
        <p className="text-neutral-600">Manage and track all BITSS orders</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-neutral-200">
        <div className="flex gap-4">
          <button
            onClick={() => handleTabChange("online")}
            className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
              activeTab === "online"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-neutral-600 hover:text-neutral-800"
            }`}
          >
            Online Orders
            {totalOrders > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "online"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-neutral-100 text-neutral-600"
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
                : "text-neutral-600 hover:text-neutral-800"
            }`}
          >
            Manual Orders
            {totalManualOrders > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "manual"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {totalManualOrders}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards - Show different stats based on active tab */}
      {activeTab === "online" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Total Orders
            </h3>
            <p className="text-2xl font-bold text-neutral-800">{totalOrders}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Pending
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingOrders}
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Processing
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {processingOrders}
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Completed
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {completedOrders}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Total Orders
            </h3>
            <p className="text-2xl font-bold text-neutral-800">
              {totalManualOrders}
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Pending
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingManualOrders}
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Processing
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {processingManualOrders}
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Completed
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {completedmanualOrders}
            </p>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        {/* Items per page selector */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-neutral-600">
              Show
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-neutral-600">entries</span>
          </div>
          <div className="text-sm text-neutral-600">
            Showing {totalItems > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, totalItems)} of {totalItems} orders
          </div>
        </div>

        {/* Render appropriate table based on active tab */}
        {activeTab === "online" ? (
          <BitssOrderTable currentOrders={currentItems} />
        ) : (
          <ManualOrderTable
            currentOrders={currentItems}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaChevronLeft className="text-xs" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {getPageNumbers().map((pageNum, index) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-neutral-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
