"use client";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faCross,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const status = {
  1: "Pending",
  2: "Confirmed",
  3: "Delivered",
  4: "Cancelled",
};

const payment_status = {
  1: "Due",
  2: "Paid",
};

export default function OrderDetails() {
  const { id } = useParams();
  const [remark, setRemark] = useState("");
  const token = Cookies.get("auth_token");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [delivery_fee, setDeliveryFee] = useState(0);
  const [edit_delivery_fee, setEditDeliveryFee] = useState(false);
  const [edit_item_qty, setEditItemQty] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [edit_customer_info, setEditCustomerInfo] = useState(false);
  const [customer_name, setCustomerName] = useState("");
  const [customer_phone, setCustomerPhone] = useState("");
  const [customer_address, setCustomerAddress] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/order/${id}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(res.data.data);

      setRemark(res.data.data.remark ?? "");
      setDeliveryFee(Number(res.data.data.delivery_fee ?? 0));
      setCustomerName(res.data.data.customer?.name ?? "");
      setCustomerPhone(res.data.data.customer?.phone ?? "");
      setCustomerAddress(res.data.data.customer?.address ?? "");
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order?.orders?.length) {
      const initialQuantities = {};

      order.orders.forEach((item) => {
        initialQuantities[item.id] = Number(item.qty);
      });

      setQuantities(initialQuantities);
    }
  }, [order]);
  const orderStatusChange = async (orderId, status) => {
    if (Number(status) === Number(order.status)) return;
    setLoading(true);
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };
  const orderPaymentStatusChange = async (orderId, status) => {
    if (Number(status) === Number(order.payment_status)) return;
    setLoading(true);
    try {
      const res = await api.put(
        `/api/order/${orderId}/payment/status`,
        {
          payment_status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchOrder(orderId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };
  const orderRemarkChange = async (orderId) => {
    setLoading(true);
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  const orderDeliveryFeeChange = async () => {
    setLoading(true);
    try {
      const res = await api.put(
        `/api/order/${id}/delivery-fee`,
        {
          delivery_fee: delivery_fee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchOrder(id);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update order");
    } finally {
      setEditDeliveryFee(false);
      setLoading(false);
    }
  };
  const itemQtyChange = async () => {
    setLoading(true);

    const updateItems = Object.entries(quantities).map(
      ([orderItemId, quantity]) => ({
        order_item_id: Number(orderItemId),
        quantity: Number(quantity),
      }),
    );

    try {
      const res = await api.put(
        `/api/order/item-qty`,
        {
          items: updateItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchOrder(id);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update order");
    } finally {
      setEditItemQty(false);
      setLoading(false);
    }
  };
  const customerInfoChange = async () => {
    setLoading(true);

    try {
      const res = await api.put(
        `/api/order/${order?.customer_id}/customer-info`,
        {
          name: customer_name,
          phone: customer_phone,
          address: customer_address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchOrder(id);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update customer info",
      );
    } finally {
      setEditCustomerInfo(false);
      setLoading(false);
    }
  };

  const handleQuantityChange = (orderItemId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [orderItemId]: Number(quantity),
    }));
  };

  return (
    <div className="">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <span className="text-lg font-medium text-amber-800">Loading...</span>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-2xl ">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-5 border-b">
              <div>
                <Link
                  href="/dashboard/order"
                  className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Back
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">
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
              <div className="bg-slate-50 border rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500 mb-1">Subtotal Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  ৳ {Number(order?.subtotal)}
                </p>
              </div>
              <div className="bg-slate-50 border rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500 mb-1">Delivery Fee</p>
                <div className="text-2xl font-bold text-gray-800 flex items-center">
                  <div className=" m-auto flex space-x-2">
                    <div>৳</div>
                    {edit_delivery_fee ? (
                      <div>
                        <input
                          type="text"
                          value={delivery_fee}
                          onChange={(e) =>
                            setDeliveryFee(
                              e.target.value != "" &&
                                !isNaN(e.target.value) &&
                                Number(e.target.value) >= 0
                                ? Number(e.target.value)
                                : 0,
                            )
                          }
                          className="border w-20 rounded-lg p-2 text-center"
                        />

                        <FontAwesomeIcon
                          icon={faPlus}
                          className="ml-2 cursor-pointer rotate-45"
                          onClick={() => {
                            (setEditDeliveryFee(false), fetchOrder(id));
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="ml-2 cursor-pointer"
                          onClick={() => orderDeliveryFeeChange()}
                        />
                      </div>
                    ) : (
                      <div>
                        {delivery_fee}
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="ml-2 cursor-pointer"
                          onClick={() => setEditDeliveryFee(true)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 border rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500 mb-1">Grand Total</p>
                <p className="text-2xl font-bold text-gray-800">
                  ৳ {Number(order?.grand_total)}
                </p>
              </div>
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
                      <th className="p-3 text-center">
                        Qty{" "}
                        {!edit_item_qty ? (
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="ml-2 cursor-pointer"
                            onClick={() => setEditItemQty(true)}
                          />
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="ml-2 cursor-pointer rotate-45"
                              onClick={() => {
                                (setEditItemQty(false), fetchOrder(id));
                              }}
                            />
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="ml-2 cursor-pointer"
                              onClick={() => itemQtyChange()}
                            />
                          </>
                        )}
                      </th>
                      <th className="p-3 text-center">Price (1&times;)</th>
                      <th className="p-3 text-center">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.orders?.map((item) => (
                      <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-800">
                          {item.product?.name}
                        </td>

                        <td className="p-3 text-center">
                          {item.product?.unit}
                        </td>
                        <td className="p-3 text-center">
                          {!edit_item_qty ? (
                            <div>{quantities[item.id] ?? Number(item.qty)}</div>
                          ) : (
                            <>
                              <input
                                type="number"
                                min="1"
                                value={quantities[item.id] ?? Number(item.qty)}
                                onChange={(e) =>
                                  handleQuantityChange(item.id, e.target.value)
                                }
                                className="border rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          ৳ {Number(item.price)}
                        </td>
                        <td className="p-3 text-center">
                          ৳ {Number(item.price) * Number(item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Info Sections */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Customer
                  {edit_customer_info ? (
                    <>
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="ml-2 cursor-pointer rotate-45"
                        onClick={() => {
                          (
                            setEditCustomerInfo(false), fetchOrder(id)
                          );
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="ml-2 cursor-pointer"
                        onClick={() => customerInfoChange()}
                      />
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="ml-2 cursor-pointer"
                        onClick={() => setEditCustomerInfo(true)}
                      />
                    </>
                  )}
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-600">Name:</span>{" "}
                    {edit_customer_info ? (
                      <input
                        type="text"
                        value={customer_name}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="border rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <>{customer_name}</>
                    )}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Phone:</span>{" "}
                    {edit_customer_info ? (
                      <input
                        type="text"
                        value={customer_phone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="border rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <>{customer_phone}</>
                    )}
                  </p>

                  <p>
                    <span className="font-medium text-gray-600">Address:</span>{" "}
                    {edit_customer_info ? (
                      <textarea
                        type="text"
                        value={customer_address}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="border rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <>{customer_address}</>
                    )}
                  </p>
                </div>
              </div>
              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-semibold text-gray-800 mb-2">Handler</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-600">Name:</span>{" "}
                    {order?.handler?.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">User ID:</span>{" "}
                    {order?.handler?.username}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Email:</span>{" "}
                    {order?.handler?.email}
                  </p>
                </div>
              </div>
              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Remarked By
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-600">Name:</span>{" "}
                    {order?.remarker?.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">User ID:</span>{" "}
                    {order?.remarker?.username}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Email:</span>{" "}
                    {order?.remarker?.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1 text-lg">
                  Remarks
                </label>
                <textarea
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-60 h-30 p-2"
                  placeholder="Enter text here"
                  value={remark}
                ></textarea>

                <button
                  onClick={() => orderRemarkChange(order.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Remarks
                </button>
              </div>
            </section>

            <section className="sm:flex gap-2 p-6">
              {Object.entries(status).map(([key, value]) => (
                <label
                  className="flex items-center gap-2 cursor-pointer"
                  key={key}
                >
                  <input
                    type="radio"
                    name="status"
                    value={key}
                    checked={Number(key) === Number(order.status)}
                    onChange={() => orderStatusChange(order.id, key)}
                  />
                  <div>{value}</div>
                </label>
              ))}
            </section>
            <section className="sm:flex gap-2 p-6">
              {Object.entries(payment_status).map(([key, value]) => (
                <label
                  className="flex items-center gap-2 cursor-pointer"
                  key={key}
                >
                  <input
                    type="radio"
                    name="payment_status"
                    value={key}
                    checked={Number(key) === Number(order.payment_status)}
                    onChange={() => orderPaymentStatusChange(order.id, key)}
                  />
                  <div>{value}</div>
                </label>
              ))}
            </section>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
              <Link
                href="/dashboard/order"
                className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
