"use client";

import api from "@/lib/axios";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';

export default function OrderForm({ order_data }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState(order_data?.delivery_fee?.[0]?.id || null);

  const [button_pressed, setButtonPressed] = useState(false);

  const [err_msg, setErrMsg] = useState(null);
  const [success_msg, setSuccessMsg] = useState(null);

  const [cartItems, setCartItems] = useState({});

  const products = order_data?.products || [];

  const shippingCost = order_data?.delivery_fee?.find((fee) => fee.id === shipping)?.delivery_charge || 0;

  const router = useRouter();

  const toggleProduct = (product) => {
    setCartItems((prev) => {
      const exists = prev[product.id];

      if (exists) {
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
          available_qty: product.available_qty || 0,
        },
      };
    });
  };

  const increaseQty = (productId) => {
    setCartItems((prev) => {
      const item = prev[productId];

      if (!item) return prev;

      if (item.qty >= item.available_qty) {
        return prev;
      }

      return {
        ...prev,
        [productId]: {
          ...item,
          qty: item.qty + 1,
        },
      };
    });
  };

  const decreaseQty = (productId) => {
    setCartItems((prev) => {
      const item = prev[productId];

      if (!item) return prev;

      if (item.qty <= 1) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }

      return {
        ...prev,
        [productId]: {
          ...item,
          qty: item.qty - 1,
        },
      };
    });
  };

  const cart = Object.values(cartItems);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price * item.qty;
    }, 0);
  }, [cart]);

  const total = subtotal + Number(shippingCost);

  const handleOrderConfirm = async () => {

    

    if (cart.length === 0) {
      alert("Please select at least one product");
      return;
    }

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!phone.trim()) {
      alert("Phone number is required");
      return;
    }

    if (!address.trim()) {
      alert("Address is required");
      return;
    }

    setButtonPressed(true);

    const payload = {
      customer: {
        name,
        phone,
        address,
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

      if (res.data.status == false) {
        toast.error(res.data.message);
        setErrMsg(res.data.message);
        setButtonPressed(false);
      } else {
        setErrMsg(null);
        // setSuccessMsg(res.data.message);
        router.push(`/order/${res.data.route}`);
    
      }
    } catch (error) {
      console.log(error);
      setButtonPressed(false);
    }
  };

  useEffect(() => {
    if (!success_msg) return;

    const timer = setTimeout(() => {
      setSuccessMsg(null);
    }, 10000);

    return () => clearTimeout(timer);
  }, [success_msg]);

  return (
    <>
      {err_msg && (
        <>
          <div className="text-red-300 py-5">{err_msg}</div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product, i) => {
          const selected = cartItems[product.id];

          return (
            <div
              key={i}
              className={`rounded-2xl flex space-x-3 shadow-md p-5 border-2 transition cursor-pointer ${
                selected ? "border-green-500 bg-green-50" : "border-transparent"
              }`}
              onClick={() => toggleProduct(product)}
            >
              <div className="pt-2">
                <input type="checkbox" checked={!!selected} readOnly />
              </div>

              <Image
                src={product.image_url}
                alt={product.name}
                className="rounded-xl h-20 w-20 object-cover"
                width={100}
                height={100}
              />

              <div className="w-full">
                <div className="font-semibold">
                  {product.name} {product.unit} 
                </div>

                {product.available_qty < 5 && (
                  <div className="text-sm mt-1 text-red-500">
                    Limited stock! Hurry up!
                  </div>
                )}

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
                    <span className="text-sm text-red-500"> * {product.instruction}</span>
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
              required
              className="w-full rounded-2xl px-4 py-3 border-2 border-gray-200 focus:border-green-400 focus:outline-none"
              placeholder="আপনার নাম লিখুন"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              required
              inputMode="numeric"
              className="w-full rounded-2xl px-4 py-3 border-2 border-gray-200 focus:border-green-400 focus:outline-none"
              placeholder="আপনার মোবাইল নাম্বার"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />

            <textarea
              required
              rows={4}
              className="w-full rounded-2xl px-4 py-3 border-2 border-gray-200 focus:border-green-400 focus:outline-none resize-none"
              placeholder="সম্পূর্ণ ঠিকানা"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
            {/* <div
              onClick={() => setShipping("inside")}
              className={`flex justify-between p-4 rounded-2xl border-2 cursor-pointer ${
                shipping === "inside"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <label className="cursor-pointer">
                <input
                  type="radio"
                  checked={shipping === "inside"}
                  onChange={() => setShipping("inside")}
                  className="mr-2"
                />
                চট্টগ্রামের ভিতরে
              </label>

              <div className="font-semibold">60৳</div>
            </div> */}

            {/* <div
              onClick={() => setShipping("outside")}
              className={`flex justify-between p-4 rounded-2xl border-2 cursor-pointer ${
                shipping === "outside"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <label className="cursor-pointer">
                <input
                  type="radio"
                  checked={shipping === "outside"}
                  onChange={() => setShipping("outside")}
                  className="mr-2"
                />
                চট্টগ্রামের বাইরে
              </label>

              <div className="font-semibold">100৳</div>
            </div> */}
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

              <button
                onClick={handleOrderConfirm}
                disabled={
                  cart.length === 0 ||
                  !name.trim() ||
                  !phone.trim() ||
                  !address.trim() || button_pressed
                }
                className={`w-full transition font-bold text-xl py-4 mt-5 rounded-2xl flex justify-center items-center gap-3 cursor-pointer ${
                  cart.length === 0 ||
                  !name.trim() ||
                  !phone.trim() ||
                  !address.trim() || button_pressed
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}

              >
                <FontAwesomeIcon icon={faLock} />
                অর্ডার কনফার্ম করুন {total} ৳
              </button>

              {success_msg && (
                <div className="border-green-500 bg-green-50 border-2 my-2 p-3 text-2xl rounded-2xl">
                  {success_msg}
                </div>
              )}
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
