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
                    className="border bg-white border-neutral-200 text-sm text-gray-600"
                  >
                    <td className="px-3 py-2 border border-neutral-200">
                      #{order?.order_id}
                    </td>
                    <td className="px-3 py-2 border border-neutral-200">
                      <span className="text-base font-medium">
                        {order?.name}
                      </span>{" "}
                      <br />{" "}
                      <span className="text-neutral-500">{order?.email}</span>
                    </td>
                    <td className="px-3 py-2 border border-neutral-200">
                      <span className="text-base font-medium">
                        {order?.software}
                      </span>{" "}
                    </td>
                    <td className="px-3 py-2 border border-neutral-200">
                      €{order?.paid_amount}
                    </td>
                    <td className="px-3 py-2 capitalize border border-neutral-200">
                      {order?.payment_type}
                      <br />
                      {order?.status ? (
                        <span className="px-1 py-0.5 rounded text-xs mt-1 inline-block border border-green-100 text-green-500 bg-green-100">
                          Paid
                        </span>
                      ) : (
                        <span className="px-1 py-0.5 rounded text-xs mt-1 inline-block border border-red-100 text-red-500 bg-red-100">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 border border-neutral-200">
                      <div className="flex h-full items-center justify-start gap-4">
                        <Link
                          to={`/dashboard/bfinit/${order?._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        {/* <button
                          // onClick={() => handleorderDelete(order.id, order.title)}
                          className="text-red-500 hover:text-red-700"
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
