"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import CheckBox from "@/components/features_cus/CheckBox";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

export default function DueInvoice() {
  const [order_info, setOrderInfo] = useState([]);
  const [payment_via, setPaymentVia] = useState([]);
  const [invoice, setInvoice] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [sale_date, setSaleDate] = useState("");
  const [paid_amount, setPaidAmount] = useState(0);
  const [due_amount, setDueAmount] = useState(0);
  const [due_paid_date, setDuePaidDate] = useState("");
  const [due_pay_amount, setDuePayAmount] = useState(0);
  const [due_paid_amount, setDuePaidAmount] = useState(0);
  const [payment_method, setPaymentMethod] = useState("");
  const [remark, setRemark] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const token = Cookies.get("auth_token");

  useEffect(() => {
    const fetchDueInfo = async () => {
      const res = await api.get(`/api/order/due/invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setOrderInfo(res.data?.data?.order);
      setInvoice(res.data?.data?.order?.invoice || "");
      setCustomerName(res.data?.data?.order?.customer?.name || "");
      setSaleDate(res.data?.data?.order?.place_date || "");
      setPaidAmount(Number(res.data?.data?.order?.grand_total) || "");
      setDueAmount(Number(res.data?.data?.order?.due) || 0);
      setDuePaidDate(res.data?.data?.order?.due_paid_date || "");
      setDuePaidAmount(Number(res.data?.data?.order?.due_paid_amount) || 0);
      setDuePayAmount(
        Number(res.data?.data?.order?.due_paid_amount) +
          Number(res.data?.data?.order?.due) || 0,
      );
      setRemark(res.data?.data?.order?.remark || "");
      setPaymentMethod(res.data?.data?.order?.due_payment_via?.id || "");
      setPaymentVia(res.data?.data?.payment_vias);
      setLoading(false);
    };
    fetchDueInfo();
  }, [id, success]);

  const dueAmountFunc = (value) => {
    // if(due_pay_amount >= Number(value))
    // {
    if (value <= due_pay_amount) {
      if (value >= due_pay_amount) {
        setDueAmount(value - due_pay_amount);
      } else {
        setDueAmount(due_pay_amount - value);
      }

      setDuePaidAmount(Number(value));
    }
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();

    formData.append("due_paid_date", due_paid_date);
    formData.append("due_paid_amount", due_paid_amount);
    formData.append("due_amount", due_amount);
    formData.append("payment_method", payment_method);

    formData.append("remark", remark);

    formData.append("_method", "PUT");

    try {
      const res = await api.post(`/api/order/due/pay/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      setError("");
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setButtonPressed(false);
    }
  };

  const handlePrint = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/due/print/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.src = url;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        const iframeWindow = iframe.contentWindow;

        iframeWindow.focus();
        iframeWindow.print();

        // Remove only after printing is done
        iframeWindow.onafterprint = () => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        };
      };
    } catch (err) {
      console.error("Failed to print receipt:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="rounded-md shadow-md p-4 bg-white sm:w-4xl">
        <div>
          {error?.message && (
            <div className="w-full pb-2 text-red-400 text-lg">
              * {error.message}
            </div>
          )}
        </div>

        {(order_info && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-gray-200">Product</th>
                    <th className="p-4 border-b border-gray-200">Qty</th>
                    <th className="p-4 border-b border-gray-200">Price</th>
                    <th className="p-4 border-b border-gray-200">Amount</th>
                    <th className="p-4 border-b border-gray-200">Discount</th>
                    <th className="p-4 border-b border-gray-200">Rec.Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {order_info?.orders?.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200">
                      <td className="p-4 border-b border-gray-200">
                        {order?.product_price?.product?.name}
                      </td>

                      <td className="p-4 border-b border-gray-200 flex gap-4">
                        {Number(order?.qty)}
                      </td>

                      <td className="p-4 border-b border-gray-200">
                        {Number(order?.price) + Number(order?.discount)}
                      </td>

                      <td className="p-4 border-b border-gray-200">
                        {(Number(order?.price) + Number(order?.discount)) *
                          Number(order?.qty)}
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        {Number(order?.discount) * Number(order?.qty)}
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        {Number(order?.price) * Number(order?.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 p-5 gap-4 border-2 border-gray-200 rounded-md">
              <div>
                <label
                  htmlFor="invoice"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Invoice
                </label>

                <input
                  id="invoice"
                  type="text"
                  name="invoice"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter Invoice"
                  value={invoice}
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="customer_name"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Customer
                </label>

                <input
                  id="customer_name"
                  type="text"
                  name="customer_name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter Customer Name"
                  value={customer_name}
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="sale_date"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Sale Date
                </label>

                <input
                  id="sale_date"
                  type="text"
                  name="sale_date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter Sale Date"
                  value={sale_date}
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="paid_amount"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Paid Amount
                </label>

                <input
                  id="paid_amount"
                  type="text"
                  name="paid_amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter Paid Amount"
                  value={paid_amount}
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="due_amount"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Due Amount
                </label>

                <input
                  id="due_amount"
                  type="text"
                  name="due_amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter Due Amount"
                  value={due_amount}
                  disabled
                />
              </div>

              <div>
                <label
                  htmlFor="payment_method"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Payment Method
                </label>

                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  value={payment_method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  {payment_via.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {error?.errors?.payment_method && (
                  <div className="w-full text-red-400 text-md pt-1">
                    * {error?.errors?.payment_method}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="due_paid_date"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Due Paid Date
                </label>

                <input
                  id="due_paid_date"
                  type="date"
                  name="due_paid_date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter Due Paid Date"
                  value={due_paid_date}
                  onChange={(e) => {
                    setDuePaidDate(e.target.value);
                  }}
                />

                {error?.errors?.due_paid_date && (
                  <div className="w-full text-red-400 text-md pt-1">
                    * {error?.errors?.due_paid_date}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="due_paid_amount"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Due Paid Amount{" "}
                  {Number(due_pay_amount) > 0 && (
                    <span className="text-green-500">({due_pay_amount})</span>
                  )}
                </label>

                <input
                  id="due_paid_amount"
                  type="text"
                  name="due_paid_amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter Due Paid Amount"
                  value={due_paid_amount}
                  onChange={(e) => {
                    dueAmountFunc(e.target.value);
                  }}
                />

                {error?.errors?.due_paid_amount && (
                  <div className="w-full text-red-400 text-md pt-1">
                    * {error?.errors?.due_paid_amount}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="remark"
                  className="block font-medium text-gray-700 mb-1 text-lg"
                >
                  Remark
                </label>

                <input
                  id="remark"
                  type="text"
                  name="remark"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter Remark"
                  value={remark}
                  onChange={(e) => {
                    setRemark(e.target.value);
                  }}
                />

                {error?.errors?.remark && (
                  <div className="w-full text-red-400 text-md pt-1">
                    * {error?.errors?.remark}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className={`w-full btn-primary-cus text-white py-3 text-lg font-semibold rounded-md transition duration-300 cursor-pointer ${
                  buttonPressed ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={buttonPressed}
              >
                {buttonPressed ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                className={`w-full btn-primary-cus text-white py-3 text-lg font-semibold rounded-md transition duration-300 cursor-pointer ${
                  buttonPressed ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePrint(id)}
                disabled={buttonPressed}
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </form>
        )) || <p>No due information available.</p>}
      </div>
    </>
  );
}
