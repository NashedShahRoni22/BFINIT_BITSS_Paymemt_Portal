import ManualTableRow from "./ManualTableRow";

export default function ManualOrderTable({ currentOrders, onStatusUpdate }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Phone
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Package Name
            </th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Country
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Order Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {currentOrders.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="px-6 py-8 text-center text-neutral-500"
              >
                No manual orders found
              </td>
            </tr>
          ) : (
            currentOrders.map((order) => (
              <ManualTableRow
                key={order._id}
                order={order}
                onStatusUpdate={onStatusUpdate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
