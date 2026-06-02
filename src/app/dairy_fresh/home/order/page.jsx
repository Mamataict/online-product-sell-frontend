"use client";
import { useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faBriefcase,
  faMoneyBill,
  faUsers,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import List from "@/components/order/list";
import AsyncSelect from "react-select/async";
import Select from "react-select";

export default function OrdersInfo() {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token");
  const [error, setError] = useState("");

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [start_date, setStartDate] = useState(
    thirtyDaysAgo.toISOString().slice(0, 10),
  );
  const [end_date, setEndDate] = useState(today.toISOString().slice(0, 10));

  const searchParams = useSearchParams();

  const [openMore, setOpenMore] = useState(false);
  const [order_id, setOrderId] = useState("");
  const [order_info_id, setOrderInfoId] = useState("");
  const [cus_phone, setCusPhoneNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState(1);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/order?page=${page} &&  
        start_date=${start_date} && 
        end_date=${end_date} && order_id=${order_info_id} && cus_phone=${cus_phone} && order_status=${orderStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(res.data.data.orders.data);
      setCurrentPage(res.data.data.orders.current_page);
      setLastPage(res.data.data.orders.last_page);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const fetchOrder = async (order_id_cus) => {
    try {
      const res = await api.get(`/api/order/${order_id_cus}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(res.data.data);
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchOrders(newPage);
    }
  };

  const cancelOrder = async (id) => {
    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) return;

    try {
      const res = await api.put(
        `/api/order/${id}/cancel`,
        {}, // request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchOrders(currentPage);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    }
  };

  const { user_data } = useContext(AuthContext);

  const hasPermission = (permissionList) => {
    return permissionList.some((p) => user_data?.permissions?.includes(p));
  };

  const orderStatusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Confirmed" },
    { value: 3, label: "Delivered" },
    { value: 4, label: "Cancelled" },
  ];

  const total_income = orders.reduce((sum, order) => sum + Number(order.grand_total), 0);
  const total_delivery_fee = orders.reduce((sum, order) => sum + Number(order.delivery_fee), 0);
  const total_subtotal = orders.reduce((sum, order) => sum + Number(order.subtotal), 0);


  return (
    <div className="space-y-5">
      {/* {hasPermission(["order.inquiry"]) && (
        <div className="grid sm:grid-cols-3 gap-4 max-w-6xl">
          <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
            <div className="mb-4 space-y-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Orders Count
              </label>
              <div className="text-3xl">{order_count}</div>
            </div>
            <div className="text-sm mt-6">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="text-green-500 mr-1"
              />
              Total orders ({start_date} to {end_date})
            </div>
          </div>

          <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
            <div className="mb-4 space-y-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Paid
              </label>
              <div className="text-3xl">{Number(order_income)} BDT</div>
            </div>
            <div className="text-sm mt-6">
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-green-500 mr-1"
              />
              Total paid ({start_date} to {end_date})
            </div>
          </div>

          <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
            <div className="mb-4 space-y-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Due
              </label>
              <div className="text-3xl">{Number(due)} BDT</div>
            </div>
            <div className="text-sm mt-6">
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-green-500 mr-1"
              />
              Total due ({start_date} to {end_date})
            </div>
          </div>

          <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
            <div className="mb-4 space-y-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Due Paid
              </label>
              <div className="text-3xl">{Number(due_paid)} BDT</div>
            </div>
            <div className="text-sm mt-6">
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-green-500 mr-1"
              />
              Total due paid ({start_date} to {end_date})
            </div>
          </div>
          <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
            <div className="mb-4 space-y-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Delivery Fee
              </label>
              <div className="text-3xl">{Number(delivery_fee)} BDT</div>
            </div>
            <div className="text-sm mt-6">
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-green-500 mr-1"
              />
              Total delivery fee ({start_date} to {end_date})
            </div>
          </div>
          <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
            <div className="mb-4 space-y-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Delivery Fee
              </label>
              <div className="text-3xl">{Number(delivery_fee)} BDT</div>
            </div>
            <div className="text-sm mt-6">
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-green-500 mr-1"
              />
              Total delivery fee ({start_date} to {end_date})
            </div>
          </div>
          <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
            <div className="mb-4 space-y-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Total Bill Adjustment
              </label>
              <div className="text-3xl">{Number(total_bill_adjust_amount)} BDT</div>
            </div>
            <div className="text-sm mt-6">
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-green-500 mr-1"
              />
              Total bill adjustment ({start_date} to {end_date})
            </div>
          </div>

          <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
            <div className="mb-4 space-y-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Customers Count
              </label>
              <div className="text-3xl">{customer_count}</div>
            </div>
            <div className="text-sm mt-6">
              <FontAwesomeIcon icon={faUsers} className="text-green-500 mr-1" />
              Total customer ({start_date} to {end_date})
            </div>
          </div>
        </div>
      )} */}
      <div className="max-w-6xl p-4 bg-white rounded-md shadow-md">
        <div>
          <div className="flex">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <input
                id="search"
                type="date"
                placeholder="Search by date..."
                className=" px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                value={start_date}
              />
              <input
                id="search"
                type="date"
                placeholder="Search by date..."
                className=" px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                value={end_date}
              />
              <input
                id="search"
                type="text"
                placeholder="Order ID"
                className="px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                onChange={(e) => {
                  setOrderInfoId(e.target.value);
                }}
                value={order_info_id}
              />
              <input
                id="search"
                type="text"
                placeholder="Customer Phone number"
                className="px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                onChange={(e) => {
                  setCusPhoneNumber(e.target.value);
                }}
                value={cus_phone}
              />

              <Select
                options={orderStatusOptions}
                value={
                  orderStatusOptions.find(
                    (opt) => opt.value === orderStatus,
                  ) || ""
                }
                onChange={(selected) => setOrderStatus(selected?.value || "")}
                placeholder="Select Order Status"
                isClearable
              />

              <button
                onClick={() => fetchOrders(1)}
                className="px-4 py-2 h-11 bg-blue-600 rounded-lg shadow-xs text-white cursor-pointer"
              >
                Search
              </button>
            </div>
            {/* 
            {hasPermission(["order.store"]) && (
              <FontAwesomeIcon
                icon={faPlus}
                className={`transition-transform duration-300 text-4xl cursor-pointer ml-2 ${
                  openMore ? "rotate-45" : ""
                }`}
                onClick={() => setOpenMore(!openMore)}
              />
            )} */}
          </div>
          {/* 
          <div
            className={`overflow-hidden flex transition-all duration-500 ease-in-out 
    ${openMore ? "max-h-40 opacity-100 p-5 " : "max-h-0 opacity-0 p-0"}`}
          >
            <div className="px-2">Will you add new?</div>
            <Link
              href={`/dairy_fresh/home/order/new`}
              className="text-blue-600 hover:underline"
            >
              click here
            </Link>
          </div> */}
        </div>

        <List
          orders={orders}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          handlePageChange={handlePageChange}
          fetchOrder={fetchOrder}
          fetchOrders={fetchOrders}
          order={order}
          cancelOrder={cancelOrder}
          hasPermission={hasPermission}
          total_income={total_income}
          total_delivery_fee={total_delivery_fee}
          total_subtotal={total_subtotal}
        />
      </div>
    </div>
  );
}
