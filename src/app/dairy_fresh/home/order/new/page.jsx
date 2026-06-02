"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { useRouter, useSearchParams } from "next/navigation";
import Receipt from "@/components/order/Reciept";
import OrderPlaceModal from "@/components/order/OrderPlaceModal";
import Link from "next/link";
import AdjustmentModal from "@/components/order/AdjustmentModal";

export default function CreateOrder() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);

  const [product_category_id, setProductCategoryId] = useState("");
  const [product_pricing_id, setProductPricingId] = useState("");
  const [payment_type_id, setPaymentTypeId] = useState("");
  const [campaign_id, setCampaignId] = useState("");
  const [order, setOrder] = useState([]);
  const [campaignDiscount, setCampaignDiscount] = useState({
    discount: 0,
    type: "flat",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inputText, setInputText] = useState("");
  const [address, setAddress] = useState("");
  const [place_date, setPlaceDate] = useState("");
  const [customers, setCustomers] = useState([]);
  const [pay_amount, setPayAmount] = useState(0);
  const [delivery_fee, setDeliveryFee] = useState(0);
  const [total_discount, setTotalDiscount] = useState(0);
  const [total_price, setTotalPrice] = useState(0);
  const [is_active, setIsActive] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const token = Cookies.get("auth_token");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order_id, setOrderId] = useState("");
  const [product_qty, setProductQty] = useState([]);
  const [adjustment_product_qty, setAdjustmentProductQty] = useState([]);
  const [adjustment_date, setAdjustmentDate] = useState();
  const [adjust_modal_open, setAdjustModalOpen] = useState(false);
  const [order_details_id, setOrderDetailsId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (order_id) {
      params.set("order_id", order_id);
      params.set("order_type", searchParams.get("order_type") || "");
      router.replace(`/dairy_fresh/home/order/new?${params.toString()}`);
    }
  }, [order_id]);

  const fetchOrderCreate = async () => {
    try {
      const res = await api.get(
        `/api/order/create?order_id=${
          searchParams.get("order_id") || ""
        }&&order_type=${searchParams.get("order_type") || ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setData(res.data?.data);
      setOrder(res.data?.data?.order);
      setTotalDiscount(
        res.data?.data?.order?.orders.reduce(
          (acc, item) => acc + Number(item.discount || 0),
          0,
        ),
      );
      setTotalPrice(
        res.data?.data?.order?.orders.reduce(
          (acc, item) => acc + Number(item.price || 0),
          0,
        ),
      );
      setOrderId(res.data?.data?.order?.id);
      setPayAmount(Number(res.data?.data?.order?.init_pay || 0));
      setDeliveryFee(Number(res.data?.data?.order?.delivery_fee || 0));
      setPlaceDate(res.data?.data?.order?.place_date);
      setPaymentTypeId(res.data?.data?.order?.payment_via_id);
      setCampaignId(res.data?.data?.order?.campaign_details_id || "");

      setName(res.data?.data?.order?.customer?.name || "");
      setEmail(res.data?.data?.order?.customer?.email || "");
      setPhone(res.data?.data?.order?.customer?.phone || "");
      setInputText(res.data?.data?.order?.customer?.phone || "");
      setAddress(res.data?.data?.order?.customer?.address || "");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrderCreate();
  }, []);

  const fetchCustomerDetails = async (searched) => {
    const res = await api.get(`/api/customers?phone=${searched.phone}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data.data;
    setCustomers(data);
  };

  const handleSelectCampaign = async (selected) => {
    try {
      const campaign_id = selected?.value ?? "";
      const order_id_cus = order.id;
      if (campaign_id !== "") {
        const res = await api.post(
          "/api/order/campaign",
          { campaign_id, order_id_cus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        setCampaignId(campaign_id);
        fetchOrderCreate();
      }
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const handleSelectPaymentType = async (selected) => {
    try {
      const cus_payment_type_id = selected?.value ?? "";
      const order_id_cus = order.id;

      const res = await api.post(
        "/api/order/payment_type",
        { cus_payment_type_id, order_id_cus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setPaymentTypeId(cus_payment_type_id);
      fetchOrderCreate();
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const orderStore = async (selected) => {
    const product_pricing_id_cus = selected?.value ?? "";
    try {
      if (product_pricing_id_cus !== "") {
        const res = await api.post(
          "/api/order",
          {
            product_pricing_id_cus,
            order_id,
            qty: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        setProductPricingId(product_pricing_id_cus);
        fetchOrderCreate();
      }
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const productQtyChange = async (order_details_id, qty) => {
    setProductQty((prev) => {
      const exists = prev.some(
        (item) => item.order_details_id === order_details_id,
      );

      if (exists) {
        return prev.map((item) =>
          item.order_details_id === order_details_id ? { ...item, qty } : item,
        );
      }

      return [...prev, { order_details_id, qty }];
    });

    try {
      const res = await api.post(
        "/api/order/product_qty",
        { order_details_id, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      fetchOrderCreate();
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const payAmount = async (pay) => {
    try {
      const res = await api.post(
        "/api/order/pay_amount",
        { order_id, pay },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      fetchOrderCreate();
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const deliveryFee = async (delivery_fee) => {
    try {
      const res = await api.post(
        "/api/order/delivery_fee",
        { order_id, delivery_fee },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      fetchOrderCreate();
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const removeItem = async (order_id) => {
    try {
      const res = await api.post(
        "/api/order/remove",
        { order_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.status) {
        setProductPricingId("");
      } else toast.error(res.data.message);

      fetchOrderCreate();
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const removeCampaign = async (order_id) => {
    try {
      const res = await api.post(
        "/api/order/campaign/remove",
        { order_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.status) {
        setCampaignId("");
      } else toast.error(res.data.message);

      fetchOrderCreate();
    } catch (err) {
      setError(err?.response?.data);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);

    try {
      const res = await api.post(
        "/api/order/place",
        { name, email, phone, address, order_id, place_date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setButtonPressed(false);
      if (res.data.status) {
        fetchOrderCreate();
        setSuccess(!success);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      setError(err?.response?.data);
      setButtonPressed(false);
    }
  };

  const handlePrint = async (order_id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pos/receipt/${order_id}`,
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

  const productCategoryOptions =
    data?.product_categories?.map((product_category) => ({
      value: product_category.id,
      label: product_category.name,
    })) || [];

  const productOptions = async (inputValue) => {
    if (!inputValue || inputValue.trim().length < 2) return [];

    try {
      const res = await api.get(`/api/order/products?search=${inputValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.data.data.map((product) => ({
        value: product.id,
        label: `${product.product.name}, (${product.product.product_id})`,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const campaignOptions =
    data?.campaigns?.map((campaign) => ({
      value: campaign.id,
      label: campaign.campaign.name,
      discount: campaign.discount,
      discount_type: campaign.discount_type,
    })) || [];

  const paymentTypeOptions =
    data?.payment_via?.map((payment_type) => ({
      value: payment_type.id,
      label: payment_type.name,
    })) || [];

  const customersOptions =
    customers?.map((customer) => ({
      customer_phone: customer.phone,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_address: customer.address,
    })) || [];

  return (
    <>
      {productCategoryOptions.length > 0 && (
        <div className="rounded-md shadow-md p-4 bg-white w-full max-w-5xl">
          {error?.message && (
            <div className="w-full pb-2 text-red-400 text-lg">
              * {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {order && (
              <div>
                <div className="py-3">
                  <Link
                    href={{
                      pathname: "/dairy_fresh/home/order/new",
                      query: { order_type: "another" },
                    }}
                    className="text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Create New Order
                  </Link>
                </div>

                <label className="block font-medium text-gray-700 mb-1 text-lg">
                  Product
                </label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={productOptions}
                  name="product"
                  onChange={orderStore}
                  placeholder="Select Product"
                  isClearable
                />
              </div>
            )}

            <div className="border-t-2 border-b-2 border-gray-300 rounded-lg p-3 mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">Order Items</h3>
                <span className="text-gray-600">
                  Total Items: {order?.orders?.length || 0}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 text-left">
                  <thead>
                    <tr className="bg-blue-100 text-gray-700 uppercase text-sm">
                      <th className="p-3 border-b">Product Name</th>
                      <th className="p-3 border-b">Unit</th>
                      <th className="p-3 border-b">Qty</th>

                      {/* <th className="p-3 border-b">
                        Discount (1<span className="text-xs">✖</span>)
                      </th>
                      <th className="p-3 border-b">Discount</th> */}
                      <th className="p-3 border-b">
                        Price (1<span className="text-xs">✖</span>)
                      </th>

                      <th className="p-3 border-b">Price</th>
                      <th className="p-3 border-b">Adj. Date</th>
                      <th className="p-3 border-b">Adj. Amount</th>
                      <th className="p-3 border-b">Reason</th>
                      <th className="p-3 border-b">Type</th>
                      <th className="p-3 border-b">Adj. By</th>
                      <th className="p-3 border-b">Adj. By (Username)</th>

                      <th className="p-3 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.orders?.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-4 text-gray-400"
                        >
                          No products added yet
                        </td>
                      </tr>
                    )}

                    {order?.orders?.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3">
                          {item.product_price.product.name}
                        </td>
                        <td className="p-3">
                          {item.product_price.product.unit}
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            value={
                              product_qty.find(
                                (p) => p.order_details_id === item.id,
                              )?.qty || Number(item.qty || 0)
                            }
                            className="w-16 px-2 py-1 border rounded"
                            onChange={(e) =>
                              productQtyChange(item.id, Number(e.target.value))
                            }
                            required
                          />
                        </td>

                        {/* <td className="p-3">
                          {Number(item.discount / item.qty)}
                        </td>

                        <td className="p-3">{Number(item.discount)}</td> */}
                        <td className="p-3">{Number(item.price / item.qty)}</td>
                        <td className="p-3">{Number(item.price)}</td>
                        <td className="p-3">{item.adjustment?.adjustment_date?.toString() ?? 'N/A'}</td>
                        <td className="p-3">{item.adjustment?.adjustment_amount ?? 'N/A'}</td>
                        <td className="p-3">{item.adjustment?.reason ?? 'N/A'}</td>
                        <td className="p-3">{item.adjustment ? (item.adjustment?.adjustment_type == 'refund' ? 'Refund' : 'Adjustment') : 'N/A'}</td>
                        <td className="p-3">{item.adjustment?.creator?.name ?? 'N/A'}</td>
                        <td className="p-3">{item.adjustment?.creator?.username ?? 'N/A'}</td>
                        <td className="p-3 ">

                          <div className="flex space-x-1">

                          {searchParams.get("order_type") != "edit" && (
                            <button
                              type="button"
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              onClick={() => removeItem(item.id)}
                            >
                              X
                            </button>
                          )}
                          
                           <button
                              type="button"
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              onClick={() => setOrderDetailsId(item.id)}
                            >
                              Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    <tr className="border-t-2 border-green-200">
                      <td colSpan="2" className="p-3 text-right font-bold">
                        Total Amount
                      </td>
                      <td className="p-3"></td>
                      <td className="p-3">{Number(total_discount)}</td>
                      <td className="p-3"></td>
                      <td className="p-3">{Number(total_price)}</td>
                    </tr>

                    {order?.orders?.length > 0 && (
                      <tr className="bg-gray-200 font-bold text-lg">
                        <td colSpan="6" className="p-2 text-right">
                          Payable Price
                        </td>
                        <td className="p-2 text-right">
                          {Number(order.payable_price || 0)}
                        </td>
                        <td></td>
                      </tr>
                    )}

                    {order?.orders?.length > 0 && order?.campaign && (
                      <tr className="font-bold text-lg">
                        <td colSpan="5" className="p-2 text-right">
                          Campaign Discount
                        </td>
                        <td className="p-2 text-right">
                          {order.campaign.discount_type == "percentage"
                            ? `${Number(order.campaign.discount || 0)}%`
                            : `${Number(order.campaign.discount || 0)} BDT`}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="px-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            onClick={() => removeCampaign(order.id)}
                          >
                            <div className="">X</div>
                          </button>
                        </td>
                      </tr>
                    )}
                    {order?.orders?.length > 0 && (
                      <tr className="bg-gray-200 font-bold text-lg">
                        <td colSpan="6" className="p-2 text-right">
                          Paid
                        </td>
                        <td className="p-2 text-right">
                          <input
                            className="bg-white rounded p-2"
                            type="number"
                            min={0}
                            name="pay_amount"
                            value={pay_amount}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value === "" || !isNaN(value)) {
                                payAmount(value === "" ? 0 : Number(value));
                                setPayAmount(value === "" ? 0 : Number(value));
                              }
                            }}
                          />
                        </td>
                        <td></td>
                      </tr>
                    )}
                    {order?.orders?.length > 0 && (
                      <tr className="bg-gray-200 font-bold text-lg">
                        <td colSpan="6" className="p-2 text-right">
                          Due
                        </td>
                        <td className="p-2 text-right">
                          {Number(order.due_amount)}
                        </td>
                      </tr>
                    )}
                    {order?.orders?.length > 0 && (
                      <tr className="bg-gray-200 font-bold text-lg">
                        <td colSpan="6" className="p-2 text-right">
                          Delivery Fee
                        </td>
                        <td className="p-2 text-right">
                          <input
                            className="bg-white rounded p-2"
                            type="number"
                            min={0}
                            name="delivery_fee"
                            value={delivery_fee}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || !isNaN(value)) {
                                deliveryFee(value === "" ? 0 : Number(value));
                                setDeliveryFee(
                                  value === "" ? 0 : Number(value),
                                );
                              }
                            }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {order?.orders?.length > 0 && (
              <>
                <div className="grid grid-cols-2 w-full gap-2">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1 text-lg">
                      Campaign
                    </label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions={campaignOptions}
                      loadOptions={(inputValue) =>
                        Promise.resolve(
                          campaignOptions.filter((item) =>
                            item.label
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()),
                          ),
                        )
                      }
                      value={
                        campaignOptions.find(
                          (opt) => opt.value === campaign_id,
                        ) || null
                      }
                      onChange={handleSelectCampaign}
                      placeholder="Select Campaign"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1 text-lg">
                      Payment type
                    </label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions={paymentTypeOptions}
                      loadOptions={(inputValue) =>
                        Promise.resolve(
                          paymentTypeOptions.filter((item) =>
                            item.label
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()),
                          ),
                        )
                      }
                      value={
                        paymentTypeOptions.find(
                          (opt) => opt.value === payment_type_id,
                        ) || null
                      }
                      onChange={handleSelectPaymentType}
                      placeholder="Select Payment Type"
                      isClearable
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-0.5 text-lg">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter Date"
                      value={place_date}
                      onChange={(e) => setPlaceDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                  <h3 className="text-xl font-semibold py-3">
                    Customer Details
                  </h3>
                  <hr />
                  <div className="space-y-2 py-3">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1 text-lg">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      {error?.errors?.name && (
                        <div className="text-red-400 text-sm pt-1">
                          * {error.errors.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1 text-lg">
                        Email
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {error?.errors?.email && (
                        <div className="text-red-400 text-sm pt-1">
                          * {error.errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1 text-lg">
                        Phone
                      </label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions={customersOptions}
                        loadOptions={(inputValue) =>
                          Promise.resolve(
                            customersOptions.filter((item) =>
                              item.customer_phone
                                .toLowerCase()
                                .includes(inputValue.toLowerCase()),
                            ),
                          )
                        }
                        inputValue={inputText}
                        value={
                          customersOptions.find(
                            (opt) => opt.customer_phone === phone,
                          ) || null
                        }
                        onInputChange={(value, { action }) => {
                          if (action === "input-change" && value.length <= 11) {
                            setInputText(value);
                            setPhone(value);

                            if (value.length >= 2) {
                              fetchCustomerDetails({ phone: value });
                            }
                          }
                        }}
                        onChange={(selectedOption) => {
                          if (selectedOption) {
                            setPhone(selectedOption.customer_phone);
                            setInputText("");

                            setName(selectedOption.customer_name || "");
                            setEmail(selectedOption.customer_email || "");
                            setAddress(selectedOption.customer_address || "");
                          } else {
                            setPhone("");
                            setInputText("");
                          }
                        }}
                        onBlur={() => {
                          if (
                            phone &&
                            !customersOptions.some(
                              (opt) => opt.customer_phone === phone,
                            )
                          ) {
                            // setName("");
                            // setEmail("");
                            // setAddress("");
                          }
                        }}
                        getOptionLabel={(option) => option.customer_phone}
                        getOptionValue={(option) => option.customer_phone}
                        placeholder="Enter phone"
                        isClearable
                      />

                      {error?.errors?.phone && (
                        <div className="text-red-400 text-sm pt-1">
                          * {error.errors.phone}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1 text-lg">
                        Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                      {error?.errors?.address && (
                        <div className="text-red-400 text-sm pt-1">
                          * {error.errors.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className={`w-full btn-primary-cus text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-md transition duration-300 ${
                      buttonPressed
                        ? "opacity-60 cursor-not-allowed pointer-events-none"
                        : "cursor-pointer"
                    }`}
                    disabled={buttonPressed}
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </form>

          {success && (
            <OrderPlaceModal handlePrint={handlePrint} order={order} />
          )}
          {order_details_id && (
            <AdjustmentModal onChange={fetchOrderCreate} setOrderDetailsId={setOrderDetailsId} order_details_id={order_details_id} />
          )}
        </div>
      )}
    </>
  );
}
