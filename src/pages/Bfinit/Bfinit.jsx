import { useEffect, useState } from "react";
import { Link } from "react-router";
import Loader from "../../components/Loader";
import { FiEye } from "react-icons/fi";

export default function Bfinit() {
  const baseUrl = import.meta.env.VITE_Base_Url;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`${baseUrl}/payments/all`);
      const data = await res.json();
      if (data.success === true) {
        setOrders(data.data);
      } else {
        console.log(data.message);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [baseUrl]);

  // Calculate stats from actual data
  const totalOrders = orders.length;
  const paidOrders = orders.filter((order) => order.status === true).length;
  const unpaidOrders = orders.filter((order) => order.status === false).length;
  const totalRevenue = orders
    .filter((order) => order.status === true)
    .reduce((sum, order) => sum + order.paid_amount, 0);

  return (
    <div className="p-6 lg:p-8">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              Omada Orders
            </h1>
            <p className="text-neutral-600">
              Manage and track all Omada payments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-sm font-medium text-neutral-600 mb-1">
                Total Orders
              </h3>
              <p className="text-2xl font-bold text-neutral-800">
                {totalOrders}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-sm font-medium text-neutral-600 mb-1">
                Paid
              </h3>
              <p className="text-2xl font-bold text-green-600">{paidOrders}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-sm font-medium text-neutral-600 mb-1">
                Unpaid
              </h3>
              <p className="text-2xl font-bold text-red-600">{unpaidOrders}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-sm font-medium text-neutral-600 mb-1">
                Total Revenue
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                €{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                    <th className="text-center border border-neutral-200 px-6 py-3">
                      Order Id
                    </th>
                    <th className="text-center border border-neutral-200 px-6 py-3">
                      Customer
                    </th>
                    <th className="text-center border border-neutral-200 px-6 py-3">
                      Software
                    </th>
                    <th className="text-center border border-neutral-200 px-6 py-3">
                      Paid Amount
                    </th>
                    <th className="text-center border border-neutral-200 px-6 py-3">
                      Status
                    </th>
                    <th className="text-center border border-neutral-200 px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-neutral-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border bg-white border-neutral-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        {/* Order ID */}
                        <td className="px-4 py-3 border border-neutral-200 font-medium text-gray-800">
                          #{order?.order_id}
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(order?.createdAt).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="px-4 py-3 border border-neutral-200">
                          <div className="font-semibold text-gray-900">
                            {order?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order?.email}
                          </div>
                        </td>

                        {/* Software */}
                        <td className="px-4 py-3 border border-neutral-200">
                          <div className="font-medium">{order?.software}</div>
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-3 border border-neutral-200">
                          <div className="font-semibold text-gray-800">
                            €{order?.paid_amount.toLocaleString()}{" "}
                            <span className="text-xs text-gray-500">
                              / €{order?.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full h-1 mt-1 bg-neutral-200 rounded">
                            <div
                              className="h-full bg-blue-500 rounded"
                              style={{
                                width: `${
                                  (order?.paid_amount / order?.price) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 border border-neutral-200">
                          <div className="capitalize font-medium text-gray-700 mb-1">
                            {order?.payment_type}
                          </div>
                          {order?.status ? (
                            <span className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 border border-green-200">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-600 border border-red-200">
                              Unpaid
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 border border-neutral-200">
                          <div className="flex items-center justify-center gap-3">
                            <Link
                              to={`/dashboard/bfinit/${order?._id}`}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Order"
                            >
                              <FiEye className="h-5 w-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}