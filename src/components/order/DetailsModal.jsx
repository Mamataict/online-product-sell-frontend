import api from "@/lib/axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useState } from "react";

const status = {
  1: "Pending",
  2: "Confirmed",
  3: "Delivered",
  4: "Cancelled",
};

export default function DetailsModal({
  setIsModalOpen,
  order,
  fetchOrder,
  fetchOrders,
}) {

  const [remark, setRemark] = useState(order?.remark || "");
  const token = Cookies.get("auth_token");
  const orderStatusChange = async (orderId, status) => {
    if (Number(status) === Number(order.status)) return;

    try {
      const res = await api.put(
        `/api/order/${orderId}/status`,
        {
          status: status,
    
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchOrder(orderId);
      fetchOrders(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    }
  };
  const orderRemarkChange = async (orderId) => {
    // if (Number(status) === Number(order.status)) return;

    try {
      const res = await api.put(
        `/api/order/${orderId}/remark`,
        {
          remark: remark,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchOrder(orderId);
      fetchOrders(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[95%] lg:w-4/5 xl:w-3/4 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Order Id #{order?.order_info_id}
            </h2>
            <p className="text-sm text-gray-500">
              Placing Date: {order?.place_date?.toString()}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold
              ${
                order.status == 1
                  ? "text-amber-500"
                  : order.status == 2
                    ? "text-green-500"
                    : order.status == 4
                      ? "text-red-500"
                      : "text-gray-500"
              }`}
          >
            {order?.status_text}
          </span>
        </div>

        {/* Amount Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
          {[
            { label: "Subtotal Amount", value: order?.subtotal },
            { label: "Delivery Fee", value: order?.delivery_fee },
            { label: "Grand Total", value: order?.grand_total ?? 0 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border rounded-xl p-5 text-center"
            >
              <p className="text-sm text-gray-500 mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800">
                ৳ {Number(item.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Order Items */}
        <section className="px-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Items
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">Unit</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">Qty</th>
                </tr>
              </thead>
              <tbody>
                {order?.orders?.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">
                      {item.product.name}
                    </td>

                    <td className="p-3 text-center">{item.product.unit}</td>
                    <td className="p-3 text-center">৳ {item.price}</td>
                    <td className="p-3 text-center">{item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Info Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
          {[
            {
              title: "Customer",
              data: [
                ["Name", order?.customer?.name],
                ["Phone", order?.customer?.phone],
                ["Email", order?.customer?.email],
                ["Address", order?.customer?.address],
              ],
            },
            {
              title: "Handler",
              data: [
                ["Name", order?.handler?.name],
                ["User ID", order?.handler?.username],
                ["Email", order?.handler?.email],
              ],
            },
            {
              title: "Remarked By",
              data: [
                ["Name", order?.remarker?.name],
                ["User ID", order?.remarker?.username],
                ["Email", order?.remarker?.email],
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="border rounded-xl p-4 bg-slate-50">
              <h4 className="font-semibold text-gray-800 mb-2">
                {section.title}
              </h4>
              <div className="space-y-1 text-sm text-gray-700">
                {section.data.map(([label, value], i) => (
                  <p key={i}>
                    <span className="font-medium text-gray-600">{label}:</span>{" "}
                    {value || "-"}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block font-medium text-gray-700 mb-1 text-lg">
              Remarks
            </label>
            <textarea onChange={(e) => setRemark(e.target.value)} className="w-60 h-30 p-2" placeholder="Enter text here" value={remark}></textarea>

            <button onClick={() => orderRemarkChange(order.id)} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Save Remarks
            </button>
          </div>
        </section>
         

        <section className="sm:flex gap-2 p-6">
          {Object.entries(status).map(([key, value]) => (
            <div className="flex gap-2" key={key}>
              <input
                type="radio"
                name="status"
                value={key}
                checked={Number(key) == Number(order.status)}
                onChange={() => orderStatusChange(order.id, key)}
              />
              <div>{value}</div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
