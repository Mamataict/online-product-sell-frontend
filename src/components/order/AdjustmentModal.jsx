import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import Cookies from "js-cookie";

export default function AdjustmentModal({
  onChange,
  setOrderDetailsId,
  order_details_id,
}) {
  const [amount, setAmount] = useState("");
  const [adjustment_type, setAdjustmentType] = useState("refund");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");

  const token = Cookies.get("auth_token");

  const adjustment = async () => {
    try {

      if (!order_details_id || !amount || !adjustment_type || !reason || !date) {
        toast.error("Please fill in all fields");
        return;
      }
      const res = await api.post(
        "/api/order/adjustment",
        {
          order_details_id,
          adjustment_type,
          amount,
          reason,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status) {
        toast.success(res.data.message);

        if (onChange) {
          onChange();
        }

        setOrderDetailsId(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[90%] lg:w-[400px] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Adjustment
          </h2>

          <div className="space-y-4 text-left">
       
            <div>
              <label className="block text-sm font-medium mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Type
              </label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={adjustment_type}
                onChange={(e) => setAdjustmentType(e.target.value)}
                required
              >
                <option value="refund">Refund</option>
                <option value="replace">Replace</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reason
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={adjustment}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Submit Adjustment
            </button>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => setOrderDetailsId(null)}
            className="px-6 py-2 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}