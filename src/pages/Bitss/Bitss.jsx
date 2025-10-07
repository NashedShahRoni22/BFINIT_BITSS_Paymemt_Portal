import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import BitssTableRow from "../../components/BitssTableRow";
import useAuth from "../../hooks/useAuth";

export default function Bitss() {
  const { user } = useAuth();
  const baseUrl = import.meta.env.VITE_Base_Url;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`${baseUrl}/payments/bitss/all`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
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
                  <BitssTableRow
                    key={order._id}
                    orders={orders}
                    order={order}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
