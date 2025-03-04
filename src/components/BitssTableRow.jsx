import { useState } from "react";
import { Link } from "react-router";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

export default function BitssTableRow({ order, orders }) {
  const [status, setStatus] = useState(order?.status ? "paid" : "unpaid");
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);

  // Handle Status Update
  const handleStatusUpdate = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (newStatus !== (order?.status ? "paid" : "unpaid")) {
      setShowUpdateStatus(true);
    } else {
      setShowUpdateStatus(false);
    }
  };

  // Cancel Status Update
  const handleCancel = () => {
    setShowUpdateStatus(false);
    setStatus(order?.status ? "paid" : "unpaid");
  };

  // Confirm Payment Status Update
  const handleConfirmStatusUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_Base_Url}/payments/bitss/payment/approved/${
          order?._id
        }`
      );
      const data = await res.json();
      if (data.success) {
        setShowUpdateStatus(false);
        const updatedOrder = orders.find((o) => o._id === order._id);
        if (updatedOrder) {
          updatedOrder.status = status === "paid";
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <tr className="border bg-white border-neutral-200 text-sm text-gray-600">
      <td className="px-3 py-2 border border-neutral-200">
        #{order?.order_id}
      </td>
      <td className="px-3 py-2 border border-neutral-200">
        <span className="text-base font-medium">{order?.name}</span> <br />{" "}
        <span className="text-neutral-500">{order?.email}</span>
      </td>
      <td className="px-3 py-2 border border-neutral-200">
        <span className="text-base font-medium">{order?.software}</span> <br />{" "}
        {order?.duration} Months
      </td>
      <td className="px-3 py-2 border border-neutral-200">
        {order?.price} {order?.currencey}
      </td>
      <td className="px-3 flex justify-between items-center gap-1 py-2 capitalize">
        <select
          value={status}
          onChange={handleStatusUpdate}
          className="px-2 py-1 rounded border border-neutral-200 focus:outline-none"
        >
          <option value="paid" disabled={order?.status}>
            Paid
          </option>
          <option value="unpaid" disabled={!order?.status}>
            Unpaid
          </option>
        </select>

        {showUpdateStatus && (
          <>
            <button
              onClick={handleConfirmStatusUpdate}
              className="border border-green-500 bg-green-100 text-green-500 cursor-pointer rounded"
            >
              <IoCheckmarkOutline className="text-lg" />
            </button>
            <button
              onClick={handleCancel}
              className="border border-red-500 bg-red-100 text-red-500 cursor-pointer rounded"
            >
              <IoCloseOutline className="text-lg" />
            </button>
          </>
        )}
      </td>
      <td className="px-3 py-2 border border-neutral-200">
        <div className="flex h-full items-center justify-start gap-4">
          <Link
            to={`/dashboard/update-order/${order?._id}`}
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
  );
}
