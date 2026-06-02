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

export default function ProductCategory() {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([]);
  const [order_count, setOrderCount] = useState(0);
  const [order_income, setOrderIncome] = useState(0);
  const [due, setDue] = useState(0);
  const [due_paid, setDuePaid] = useState(0);
  const [customer_count, setCustomerCount] = useState(0);
  const [delivery_fee, setDeliveryFee] = useState(0);
  const [order_cancel_permission, setCancelOrderPermission] = useState(0);
  const [invoice, setInvoice] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token");
  const [error, setError] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customer_id, setCustomerId] = useState("");

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [start_date, setStartDate] = useState(
    thirtyDaysAgo.toISOString().slice(0, 10),
  );
  const [end_date, setEndDate] = useState(today.toISOString().slice(0, 10));

  const searchParams = useSearchParams();
  const user_cus = searchParams.get("user");
  const [user, setUser] = useState(user_cus);
  const [openMore, setOpenMore] = useState(false);
  const [order_id, setOrderId] = useState(null);
  const [branch_id, setBranchId] = useState("");

  const fetchOrders = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/order?page=${page} &&  
        start_date=${start_date} && 
        end_date=${end_date} && invoice=${invoice} && branch_id=${branch_id} && customer_id=${customer_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(res.data.data.orders.data);
      setOrderCount(res.data.data.order_count);
      setOrderIncome(res.data.data.order_income);
      setDue(res.data.data.due_amount);
      setCustomerCount(res.data.data.customer_count);
      setDeliveryFee(res.data.data.delivery_fee);
      setDuePaid(res.data.data.due_paid);
      setCurrentPage(res.data.data.orders.current_page);
      setLastPage(res.data.data.orders.last_page);
      setCancelOrderPermission(hasPermission(["order.cancel"]) ? 1 : 0);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (order_id) fetchOrder(order_id);
  }, [order_id]);

  useEffect(() => {
    if (!user_cus) {
      setUser(null);
    }
  }, [user_cus]);

  useEffect(() => {
    fetchOrders(1);
  }, [start_date, end_date, invoice, branch_id, customer_id]);

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

  const branchOptions = async (inputValue) => {
    if (!inputValue || inputValue.trim().length < 2) return [];

    try {
      const res = await api.get(`/api/branches?search=${inputValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.data.data.map((branch) => ({
        value: branch.id,
        label: branch.name,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const customerOptions = async (inputValue) => {
    if (!inputValue || inputValue.trim().length < 2) return [];

    try {
      const res = await api.get(`/api/customers?search=${inputValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.data.data.map((customer) => ({
        value: customer.id,
        label: customer.name,
      }));
    } catch (error) {
      console.error(error);
      return [];
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

  const handlePrintInvoiceReport = async (order_id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/sale/invoice/${order_id}`,
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

  const { user_data } = useContext(AuthContext);

  const hasPermission = (permissionList) => {
    return permissionList.some((p) => user_data?.permissions?.includes(p));
  };

  return (
    <div className="space-y-5">
      {hasPermission(["order.inquiry"]) && (
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
      )}
      <div className="max-w-6xl p-4 bg-white rounded-md shadow-md">
        <div>
          <div className="flex">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <input
                id="search"
                type="date"
                placeholder="Search by date..."
                className="px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
              {/* <input
                id="search"
                type="text"
                placeholder="Search by Invoice..."
                className="px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                onChange={(e) => {
                  setInvoice(e.target.value);
                }}
                value={invoice}
              />

              {hasPermission(['branches.orders']) && (
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={branchOptions}
                  name="branch"
                  onChange={(selectedOption) => {
                    setBranchId(selectedOption ? selectedOption.value : '');
                  }}
                  placeholder="Select Branch"
                  isClearable
                />
              )} */}

              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={customerOptions}
                value={selectedCustomer}
                onChange={(selectedOption) => {
                  setSelectedCustomer(selectedOption);
                  const id = selectedOption ? selectedOption.value : "";
                  setCustomerId(id);
                }}
                placeholder="Select Customer"
                isClearable
              />
            </div>

            {hasPermission(["order.store"]) && (
              <FontAwesomeIcon
                icon={faPlus}
                className={`transition-transform duration-300 text-4xl cursor-pointer ml-2 ${
                  openMore ? "rotate-45" : ""
                }`}
                onClick={() => setOpenMore(!openMore)}
              />
            )}
          </div>

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
          </div>
        </div>

        <List
          orders={orders}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          handlePageChange={handlePageChange}
          user={user}
          setOrderId={setOrderId}
          order={order}
          cancelOrder={cancelOrder}
          hasPermission={hasPermission}
          handlePrint={handlePrint}
          handlePrintInvoiceReport={handlePrintInvoiceReport}
        />
      </div>
    </div>
  );
}
