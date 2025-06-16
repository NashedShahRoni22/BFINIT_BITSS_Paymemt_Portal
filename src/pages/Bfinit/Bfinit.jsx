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

  return (
    <section className="px-5">
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto py-6">
          <table className="min-w-full border-collapse table-auto bg-white">
            <thead>
              <tr className="bg-neutral-100 text-left text-sm font-medium text-gray-700">
                <th className="text-center border border-neutral-200 p-3">
                  Order Id
                </th>
                <th className="text-center border border-neutral-200 p-3">
                  Customer
                </th>
                <th className="text-center border border-neutral-200 p-3">
                  Software
                </th>
                <th className="text-center border border-neutral-200 p-3">
                  Paid Amount
                </th>
                <th className="text-center border border-neutral-200 p-3">
                  Status
                </th>
                <th className="text-center border border-neutral-200 p-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border bg-white border-neutral-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3 border border-neutral-200 font-medium text-gray-800">
                      #{order?.order_id}
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(order?.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/dashboard/bfinit/${order?._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Order"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        {/* Uncomment if delete is used later */}
                        {/* <button
        className="text-red-500 hover:text-red-700"
        title="Delete Order"
      >
        <FiTrash2 className="h-5 w-5" />
      </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
