import { useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function BitssOrders() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample order data
  const orders = [
    {
      id: "ORD-1001",
      customer: "John Doe",
      email: "john@example.com",
      status: "Completed",
      total: "$245.00",
      date: "2025-10-01",
    },
    {
      id: "ORD-1002",
      customer: "Jane Smith",
      email: "jane@example.com",
      status: "Pending",
      total: "$189.50",
      date: "2025-10-03",
    },
    {
      id: "ORD-1003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      status: "Processing",
      total: "$432.00",
      date: "2025-10-05",
    },
    {
      id: "ORD-1004",
      customer: "Sarah Williams",
      email: "sarah@example.com",
      status: "Completed",
      total: "$156.75",
      date: "2025-10-06",
    },
    {
      id: "ORD-1005",
      customer: "David Brown",
      email: "david@example.com",
      status: "Cancelled",
      total: "$98.00",
      date: "2025-10-07",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
          <p className="text-2xl font-bold text-neutral-800">1,234</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-1">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">45</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-1">
            Processing
          </h3>
          <p className="text-2xl font-bold text-blue-600">23</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-1">
            Completed
          </h3>
          <p className="text-2xl font-bold text-green-600">1,166</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name..."
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
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Email
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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {order.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {order.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-800">
                    {order.total}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors">
                        <FaEdit />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
