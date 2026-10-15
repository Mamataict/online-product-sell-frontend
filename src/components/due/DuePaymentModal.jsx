"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import Cookies from "js-cookie";

export default function DuePaymentModal({
  setActiveDuePay,
  order_id,
  payment_method,
  due_amount,
  onDuePaymentChange
}) {
  const [amount, setAmount] = useState("");
  const [payment_method_id, setPaymentMethodId] = useState("");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState("");

  const token = Cookies.get("auth_token");

  const saveDuePayment = async (e) => {
    e.preventDefault();
    if (!amount || !payment_method_id || !remark || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();

    formData.append("due_paid_date", date);
    formData.append("due_paid_amount", amount);
    formData.append("payment_method", payment_method_id);
    formData.append("remark", remark);
    formData.append("_method", "PUT");

    try {
      const res = await api.post(`/api/order/due/pay/${order_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status) {
        toast.success(res.data.message);
        setActiveDuePay(false);
        onDuePaymentChange();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.data.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[90%] lg:w-[400px] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Due Payment</h2>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                value={amount}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setAmount(
                    value >= 0 && value <= due_amount ? value : due_amount,
                  );
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Payment By
              </label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={payment_method_id}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                required
              >

                {payment_method.map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Remark</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
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
              onClick={saveDuePayment}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => setActiveDuePay(false)}
            className="px-6 py-2 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
