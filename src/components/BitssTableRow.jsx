import { useState } from "react";
import { Link } from "react-router";
import { FiEye } from "react-icons/fi";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

export default function BitssTableRow({ order, orders }) {
  const [status, setStatus] = useState(order?.status);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStatusConfirmed, setIsStatusConfirmed] = useState(
    order?.status === "paid"
  );

  const validTill = order?.valid_till ? new Date(order.valid_till) : null;
  const formattedDate = validTill ? validTill.toISOString().split("T")[0] : "";

  const handleStatusUpdate = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    if (newStatus !== order?.status) {
      setShowUpdateStatus(true);
    } else {
      setShowUpdateStatus(false);
    }
  };

  const handleCancel = () => {
    setStatus(order?.status);
    setShowUpdateStatus(false);
  };

  const handleConfirmStatusUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_Base_Url}/payments/bitss/payment/approved/${
          order?._id
        }`
      );
      const data = await res.json();

      if (data.success) {
        setShowUpdateStatus(false);
        setIsStatusConfirmed(true); // Mark as confirmed so select is disabled
        const updatedOrder = orders.find((o) => o._id === order._id);
        if (updatedOrder) {
          updatedOrder.status = status; // fix: use string not boolean
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border bg-white border-neutral-200 text-sm text-gray-600">
      <td className="px-3 py-2 border border-neutral-200">
        #{order?.order_id}
      </td>
      <td className="px-3 py-2 border border-neutral-200">
        <span className="text-base font-medium">{order?.name}</span> <br />
        <span className="text-neutral-500">{order?.email}</span>
      </td>
      <td className="px-3 py-2 border border-neutral-200">
        <span className="text-base font-medium">{order?.software}</span> <br />
        {formattedDate && `${formattedDate} Months`}
      </td>
      <td className="px-3 py-2 border border-neutral-200">
        {order?.price} {order?.currencey}
      </td>
      <td className="px-3 flex justify-between items-center gap-1 py-2 capitalize">
        <select
          value={status}
          onChange={handleStatusUpdate}
          disabled={isStatusConfirmed || loading}
          className={`px-2 py-1 rounded border border-neutral-200 focus:outline-none transition-colors duration-200 ${
            status === "paid"
              ? "bg-neutral-100 text-neutral-400"
              : "cursor-pointer"
          }`}
        >
          <option value="paid">Paid</option>
          <option value="unpaid" disabled>
            Unpaid
          </option>
        </select>

        {/* Show update buttons only if status changed and not already confirmed */}
        {showUpdateStatus && !isStatusConfirmed && (
          <>
            <button
              disabled={loading}
              onClick={handleConfirmStatusUpdate}
              className={`border cursor-pointer rounded ${
                loading
                  ? "border-neutral-200 bg-neutral-100 text-neutral-400"
                  : "border-green-500 bg-green-100 text-green-500"
              }`}
            >
              <IoCheckmarkOutline className="text-lg" />
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className={`border cursor-pointer rounded ${
                loading
                  ? "border-neutral-200 bg-neutral-100 text-neutral-400"
                  : "border-red-500 bg-red-100 text-red-500"
              }`}
            >
              <IoCloseOutline className="text-lg" />
            </button>
          </>
        )}
      </td>
      <td className="px-3 py-2 border border-neutral-200">
        <div className="flex h-full items-center justify-center gap-4">
          <Link
            to={`/dashboard/bitss/${order?._id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEye className="h-5 w-5" />
          </Link>
          {/* <button className="text-red-500 hover:text-red-700">
            <FiTrash2 className="h-5 w-5" />
          </button> */}
        </div>
      </td>
    </tr>
  );
}
