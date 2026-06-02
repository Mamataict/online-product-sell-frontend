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
  faPrint,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import AsyncSelect from "react-select/async";

export default function Campaign() {
  const [due_reports, setDueReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const user_cus = searchParams.get("user");
  const [user, setUser] = useState(user_cus);
  const [openMore, setOpenMore] = useState(false);

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [start_date, setStartDate] = useState(
    thirtyDaysAgo.toISOString().slice(0, 10),
  );
  const [end_date, setEndDate] = useState(today.toISOString().slice(0, 10));

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customer_id, setCustomerId] = useState("");

  const fetchDueReport = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/report/due?page=${page} && 
        search=${searchTerm} &&
        start_date=${start_date} &&
        end_date=${end_date} &&
        customer_id=${customer_id}
        `,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDueReports(res.data.data.data);
      setCurrentPage(res.data.data.current_page);
      setLastPage(res.data.data.last_page);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user_cus) {
      setUser(null);
    }
  }, [user_cus]);

  useEffect(() => {
    setCurrentPage(1);
    fetchDueReport(1);
  }, [start_date, end_date, searchTerm, customer_id]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchDueReport(newPage);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await api.delete(`/api/campaign/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchDueReport(currentPage);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleActivation = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await api.put(
        `/api/campaign/${id}/activation`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchDueReport(currentPage);
    } catch (err) {
      toast.error("Failed to change status");
    }
  };

  const { user_data } = useContext(AuthContext);

  const hasPermission = (permissionList) => {
    return permissionList.some((p) => user_data?.permissions?.includes(p));
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

  return (
    <div className="max-w-3xl p-4 bg-white rounded-md shadow-md">
      <div>
        <div className="flex gap-2 flex-wrap">
          <input
            id="search"
            type="text"
            placeholder="Invoice Or Phone Number..."
            className="min-w-xs px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <input
            id="date"
            type="date"
            placeholder="Search by date..."
            className=" px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            value={start_date}
          />
          <input
            id="date"
            type="date"
            placeholder="Search by date..."
            className=" px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            value={end_date}
          />

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
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200">Date</th>
              <th className="p-4 border-b border-gray-200">Invoice</th>
              <th className="p-4 border-b border-gray-200">Customer</th>
              <th className="p-4 border-b border-gray-200">Due Paid</th>
              <th className="p-4 border-b border-gray-200">Due Remaining</th>
              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {due_reports.map((due_info) => (
              <tr key={due_info.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">
                  {due_info.place_date.toString()}
                </td>

                <td className="p-4 border-b border-gray-200 flex gap-4">
                  {due_info.invoice}
                </td>

                <td className="p-4 border-b border-gray-200">
                  {due_info.customer.name}
                </td>
                
                <td className="p-4 border-b border-gray-200">
                  {Number(due_info.due_paid_amount)}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {Number(due_info.due_amount)}
                </td>
              
                <td className=" p-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    <Link
                      href={`/dairy_fresh/home/report/due/invoice/${due_info.order_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      <FontAwesomeIcon icon={faWrench} />
                    </Link>
                    |
                    <a
                      href="#"
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrint(due_info.id);
                      }}
                      className=" text-red-600 cursor-pointer hover:underline"
                    >
                      <FontAwesomeIcon icon={faPrint} className="mr-2" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-evenly items-center mt-4">
        <a
          href="#"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className="disabled:opacity-50 text-blue-950 underline"
        >
          Previous
        </a>

        <span>
          Page{" "}
          <input
            type="text"
            onChange={(e) => {
              e.preventDefault();
              setCurrentPage(e.target.value);
            }}
            value={currentPage}
            className="p-1 text-center w-8 border-2 border-gray-400 rounded-xl"
          />{" "}
          of {lastPage}
        </span>

        <a
          href="#"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(currentPage + 1);
          }}
          disabled={currentPage === lastPage}
          className="disabled:opacity-50 text-blue-950 underline"
        >
          Next
        </a>
      </div>
    </div>
  );
}
