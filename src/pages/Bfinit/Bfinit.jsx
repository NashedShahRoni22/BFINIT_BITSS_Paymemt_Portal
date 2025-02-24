import { useEffect, useState } from "react";
import { Link } from "react-router";
import Loader from "../../components/Loader";
import { FiEdit, FiTrash2 } from "react-icons/fi";

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

  console.log(orders);

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
                  Price
                </th>
                <th className="text-center border border-neutral-200 p-3">
                  Payment Type
                </th>
                <th className="text-center border border-neutral-200 p-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((order, i) => (
                  <tr
                    key={order._id}
                    className={`border border-neutral-200 text-sm text-gray-600 ${
                      i % 2 === 0 ? "bg-white" : "bg-neutral-50"
                    }`}
                  >
                    <td className="px-3 py-2">#{order.order_id}</td>
                    <td className="px-3 py-2">
                      <span className="text-base font-medium">
                        {order.name}
                      </span>{" "}
                      <br /> {order.email}
                    </td>
                    <td className="px-3 py-2">{order.software}</td>
                    <td className="px-3 py-2">€{order.price}</td>
                    <td className="px-3 py-2 capitalize">
                      {order.payment_type}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex h-full items-center justify-start gap-4">
                        <Link
                          to={`/dashboard/update-order/${order.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        <button
                          // onClick={() => handleorderDelete(order.id, order.title)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
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
