"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import CheckBox from "@/components/features_cus/CheckBox";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import DuePaymentModal from "@/components/due/DuePaymentModal";
import EditDuePaymentModal from "@/components/due/EditDuePaymentModal";
import { printReport, cleanupPrint } from "@/lib/printReport";

export default function DueInvoice() {
  const [order_info, setOrderInfo] = useState([]);
  const [due_info, setDueInfo] = useState([]);
  const [payment_via, setPaymentVia] = useState([]);
  const [due_amount, setDueAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [active_due_pay, setActiveDuePay] = useState(false);
  const [edit_due_pay_id, setEditDuePayId] = useState("");
  const { id } = useParams();
  const token = Cookies.get("auth_token");

  const fetchDueInfo = async () => {
    const res = await api.get(`/api/order/due/invoice/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setOrderInfo(res.data?.data?.order);
    setDueAmount(Number(res.data?.data?.order?.due_amount) || 0);

    setPaymentVia(res.data?.data?.payment_vias);

    setLoading(false);
  };

  useEffect(() => {
    fetchDueInfo();
  }, [id]);

  const editDuePaymentInfo = async (editable_id) => {
    const res = await api.get(`/api/order/due/payment/${editable_id}/edit`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setDueInfo(res?.data?.data);

    setEditDuePayId(res?.data?.data?.id);
  };

  const deleteDuePaymentInfo = async (deleteable_id) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }
    try {
      setButtonPressed(true);
      await api.delete(`/api/order/due/payment/delete/${deleteable_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchDueInfo();
      setButtonPressed(false);
    } catch (error) {
      setButtonPressed(false);
      console.error(error);
    }
  };

  const handlePrint = async (id) => {
    try {
      setButtonPressed(true);

      await printReport({
        path: `/api/report/due/print/${id}`,
        token,
        filename: "due-report.pdf",
        params: {},
      });
    } catch (err) {
      setButtonPressed(false);
      console.error("Failed to print receipt:", err);
    } finally {
      setButtonPressed(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="rounded-md shadow-md p-4 bg-white sm:w-4xl">
        {(order_info && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <div className="mb-8">
                <div className="ml-auto w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Invoice:</span>
                    <span className="font-semibold">
                      {order_info?.order_info_id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Status:</span>
                    <span className="font-semibold">
                      {order_info?.status_text}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{order_info?.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span>{order_info?.delivery_fee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Grand Total:</span>
                    <span>{order_info?.grand_total}</span>
                  </div>

                  <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Paid:</span>
                    <span>{order_info?.total_paid}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-gray-300 pt-2 mt-2">
                    <span>Due:</span>
                    <span className="text-red-600">
                      {order_info?.due_amount}
                    </span>
                  </div>
                </div>
              </div>

              <table className="w-full mb-5 border border-collapse border-gray-300">
                <thead className="my-3">
                  <tr>
                    <th className="p-4 border border-gray-300">Customer</th>
                  </tr>
                </thead>
                <tbody className="my-3">
                  <tr>
                    <td className="p-4 border border-gray-300">
                      <div>Name: {order_info?.customer?.name}</div>
                      <div>Contact: {order_info?.customer?.phone}</div>
                      <div>Address: {order_info?.customer?.address}</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="table-auto w-full text-left border border-collapse border-gray-300">
                <thead>
                  <tr>
                    <th className="p-4 border border-gray-200">Product</th>
                    <th className="p-4 border border-gray-200">Unit</th>
                    <th className="p-4 border border-gray-200">Qty</th>
                    <th className="p-4 border border-gray-200">
                      Price (1<span className="text-xs">✖</span>)
                    </th>
                    <th className="p-4 border border-gray-200">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order_info?.orders?.map((order) => (
                    <tr key={order.id} className="border border-gray-200">
                      <td className="p-4 border border-gray-200">
                        {order?.product?.name}
                      </td>

                      <td className="p-4 border border-gray-200">
                        {order?.product?.unit}
                      </td>

                      <td className="p-4 border border-gray-200">
                        {Number(order?.qty)}
                      </td>

                      <td className="p-4 border border-gray-200">
                        {Number(order?.price)}
                      </td>

                      <td className="p-4 border border-gray-200">
                        {Number(order?.price) * Number(order?.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-2 border-gray-200 rounded-md">
              <div className="text-xl text-center py-2">Payments</div>
              <table className="w-full border border-collapse border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Date</th>
                    <th className="border border-gray-300 px-2 py-1">Paid</th>
                    <th className="border border-gray-300 px-2 py-1">
                      Payment type
                    </th>
                    <th className="border border-gray-300 px-2 py-1">Remark</th>
                    <th className="border border-gray-300 px-2 py-1">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {order_info.init_pay != 0 && (
                    <tr>
                      <td className="border border-gray-300 px-2 py-1">
                        {order_info.place_date}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {order_info.init_pay}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {order_info.pay_via}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {order_info.remark}
                      </td>
                      <td className="border border-gray-300 px-2 py-1"></td>
                    </tr>
                  )}
                  {order_info?.due_payments?.map((due_payment) => (
                    <tr key={due_payment.id}>
                      <td className="border border-gray-300 px-2 py-1">
                        {due_payment.due_paid_date}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {due_payment.due_paid_amount}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {due_payment.pay_via}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {due_payment.remark}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 flex space-x-2">
                        <button
                          onClick={() => editDuePaymentInfo(due_payment.id)}
                        >
                          {" "}
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="cursor-pointer"
                          />
                        </button>
                        <button
                          onClick={() => deleteDuePaymentInfo(due_payment.id)}
                          className={
                            buttonPressed ? "opacity-60 cursor-not-allowed" : ""
                          }
                          disabled={buttonPressed}
                        >
                          {" "}
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="cursor-pointer"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                className={`w-full btn-primary-cus text-white py-3 text-lg font-semibold rounded-md transition duration-300 cursor-pointer`}
                onClick={() => setActiveDuePay(!active_due_pay)}
              >
                Pay
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
          </div>
        )) || <p>No due information available.</p>}

        {active_due_pay && (
          <DuePaymentModal
            setActiveDuePay={setActiveDuePay}
            order_id={order_info.id}
            payment_method={payment_via}
            due_amount={due_amount}
            onDuePaymentChange={fetchDueInfo}
          />
        )}
        {edit_due_pay_id && (
          <EditDuePaymentModal
            due_info={due_info}
            setEditDuePayId={setEditDuePayId}
            edit_due_pay_id={edit_due_pay_id}
            payment_method={payment_via}
            due_amount={due_amount}
            onDuePaymentChange={fetchDueInfo}
          />
        )}
      </div>
    </>
  );
}
