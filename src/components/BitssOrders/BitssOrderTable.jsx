import BitssTableRow from "../BitssTableRow";

export default function BitssOrderTable({ currentOrders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
              Domain
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
              Payment Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
              Payment Method
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
          {currentOrders.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="px-6 py-8 text-center text-neutral-500"
              >
                No orders found
              </td>
            </tr>
          ) : (
            currentOrders.map((order) => (
              <BitssTableRow key={order._id} order={order} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
