"use client";

import api from "@/lib/axios";
import { faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/images/default.png`
  : "/images/default.png";

export default function OrderForm({ order_data }) {
  const router = useRouter();

  const products = order_data?.products || [];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [shipping, setShipping] = useState(
    order_data?.delivery_fee?.[0]?.id || null
  );
  const [cartItems, setCartItems] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const shippingCost =
    order_data?.delivery_fee?.find((fee) => fee.id === shipping)
      ?.delivery_charge || 0;

  const toggleProduct = (product) => {
    setCartItems((prev) => {
      if (prev[product.id]) {
        const updated = { ...prev };
        delete updated[product.id];
        return updated;
      }
      return {
        ...prev,
        [product.id]: {
          id: product.id,
          name: product.name,
          unit: product.unit,
          image: product.image_url,
          price: Number(product.latest_price?.price || 0),
          qty: 1,
        },
      };
    });
  };

  const increaseQty = (productId) => {
    setCartItems((prev) => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: { ...prev[productId], qty: prev[productId].qty + 1 },
      };
    });
  };

  const decreaseQty = (productId) => {
    setCartItems((prev) => {
      if (!prev[productId]) return prev;
      if (prev[productId].qty <= 1) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return {
        ...prev,
        [productId]: { ...prev[productId], qty: prev[productId].qty - 1 },
      };
    });
  };

  const cart = Object.values(cartItems);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart]
  );

  const total = subtotal + Number(shippingCost);

  const isDisabled =
    submitting ||
    cart.length === 0 ||
    !form.name.trim() ||
    !form.phone.trim() ||
    !form.address.trim();

  const handleOrderConfirm = async () => {
    if (cart.length === 0) return toast.error("Please select at least one product");
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.phone.trim()) return toast.error("Phone number is required");
    if (!form.address.trim()) return toast.error("Address is required");

    setSubmitting(true);

    const payload = {
      customer: {
        name: form.name,
        phone: form.phone,
        address: form.address,
      },
      shipping,
      shipping_cost: shippingCost,
      subtotal,
      total,
      products: cart.map((item) => ({
        product_id: item.id,
        qty: item.qty,
        price: item.price,
      })),
    };

    try {
      const res = await api.post("/api/order/confirm", payload);

      if (res.data.status === false) {
        toast.error(res.data.message);
      } else {
        const route = res?.data?.route;
        if (!route) {
          toast.error("Something went wrong. Please try again.");
          return;
        }
        router.push(`/order/${route}`);
      }
    } catch (error) {
      console.error("Order error:", error?.response?.data || error.message);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!order_data) {
    return (
      <div className="text-center py-20 text-red-500">
        সার্ভারে সমস্যা হয়েছে। একটু পরে চেষ্টা করুন।
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => {
          const selected = cartItems[product.id];
          return (
            <div
              key={product.id}
              className={`rounded-2xl flex space-x-3 shadow-md p-5 border-2 transition cursor-pointer ${
                selected ? "border-green-500 bg-green-50" : "border-transparent"
              }`}
              onClick={() => toggleProduct(product)}
            >
              <div className="pt-2">
                <input type="checkbox" checked={!!selected} readOnly />
              </div>

              <Image
                src={product.image_url || DEFAULT_IMAGE}
                alt={product.name}
                className="rounded-xl h-20 w-20 object-cover"
                width={100}
                height={100}
              />

              <div className="w-full">
                <div className="font-semibold">
                  {product.name} {product.unit}
                </div>

                <div className="flex items-center justify-between mt-3">
                  {selected ? (
                    <div
                      className="flex items-center border rounded-xl overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQty(product.id);
                        }}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={selected.qty}
                        readOnly
                        className="w-12 text-center outline-none"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQty(product.id);
                        }}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">Select Product</div>
                  )}

                  <div className="text-lg font-bold text-[#0F6939]">
                    {Number(product.latest_price?.price || 0)} ৳
                  </div>
                </div>

                {product.instruction && (
                  <span className="text-sm text-red-500">
                    * {product.instruction}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 py-6 gap-10">
        <div>
          <div className="text-2xl py-4 font-semibold">Billing Details</div>
          <div className="space-y-5">
            <input
              type="text"
              className="w-full rounded-2xl px-4 py-3 border-2 border-gray-200 focus:border-green-400 focus:outline-none"
              placeholder="আপনার নাম লিখুন"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              type="text"
              inputMode="numeric"
              className="w-full rounded-2xl px-4 py-3 border-2 border-gray-200 focus:border-green-400 focus:outline-none"
              placeholder="আপনার মোবাইল নাম্বার"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value.replace(/\D/g, ""),
                }))
              }
            />
            <textarea
              rows={4}
              className="w-full rounded-2xl px-4 py-3 border-2 border-gray-200 focus:border-green-400 focus:outline-none resize-none"
              placeholder="সম্পূর্ণ ঠিকানা"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </div>

          <div className="text-2xl py-4 font-semibold">Shipping</div>
          <div className="space-y-3">
            {order_data?.delivery_fee?.map((option) => (
              <div
                key={option.id}
                onClick={() => setShipping(option.id)}
                className={`flex justify-between p-4 rounded-2xl border-2 cursor-pointer ${
                  shipping === option.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    checked={shipping === option.id}
                    onChange={() => setShipping(option.id)}
                    className="mr-2"
                  />
                  {option.info}
                </label>
                <div className="font-semibold">{option.delivery_charge} ৳</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-2xl py-4 font-semibold">Your Order</div>

          {cart.length > 0 ? (
            <>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-left">Product</th>
                      <th className="p-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-4">
                          <div className="font-medium">
                            {item.name} ({item.unit})
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </div>
                        </td>
                        <td className="p-4 text-right font-semibold">
                          {item.price * item.qty} ৳
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 border border-gray-200 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal} ৳</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost} ৳</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{total} ৳</span>
                </div>
              </div>
              
              <div className="border-dotted rounded-2xl py-4">
                <div className="text-xl font-semibold">
                  Payment Method
                </div>
                <hr/>
                <div className="bg-green-100 border-2 border-green-500 w-full rounded-2xl px-4 py-4 mt-4">

                <FontAwesomeIcon className="text-green-700" icon={faCheckCircle}/> Cash on delivery (COD)
                </div>
              </div>
              <button
                onClick={handleOrderConfirm}
                disabled={isDisabled}
                className={`w-full transition font-bold text-xl py-4 mt-5 rounded-2xl flex justify-center items-center gap-3 ${
                  isDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
                }`}
              >
                <FontAwesomeIcon icon={faLock} />
                {submitting
                  ? "অপেক্ষা করুন..."
                  : `অর্ডার কনফার্ম করুন ${total} ৳`}
              </button>
            </>
          ) : (
            <div className="text-center py-10 rounded-2xl border border-dashed border-gray-300 text-gray-400 font-medium">
              Please select at least one product
            </div>
          )}
        </div>
      </div>
    </>
  );
}