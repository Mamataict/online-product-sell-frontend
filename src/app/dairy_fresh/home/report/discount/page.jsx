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

export default function Campaign() {
  const [discounts, setDiscounts] = useState([]);
  const [total_discount, setTotalDiscount] = useState(0);
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

  const fetchDiscountReport = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/order/discounts?page=${page} && 
        search=${searchTerm} &&
        start_date=${start_date} &&
        end_date=${end_date}
        `,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDiscounts(res.data.data.discounts.data);
      setTotalDiscount(res.data.data.total_discount);
      setCurrentPage(res.data.data.discounts.current_page);
      setLastPage(res.data.data.discounts.last_page);
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
    fetchDiscountReport(1);
  }, [start_date, end_date, searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchDiscountReport(newPage);
    }
  };

  const { user_data } = useContext(AuthContext);

  const hasPermission = (permissionList) => {
    return permissionList.some((p) => user_data?.permissions?.includes(p));
  };

  const handlePrint = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/discount/print/${id}`,
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

  console.log(discounts);

  return (
    <div className="max-w-3xl p-4 bg-white rounded-md shadow-md">
      <div>
        <div className="flex gap-2">
          <input
            id="search"
            type="text"
            placeholder="Invoice"
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
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="pl-10 py-5">
            Total Discount: <span className="font-bold">{total_discount.toFixed(2)}৳</span>
        </div>
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200">Date</th>
              <th className="p-4 border-b border-gray-200">Invoice</th>
              <th className="p-4 border-b border-gray-200">Customer</th>
              <th className="p-4 border-b border-gray-200">Discount</th>
              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length > 0 && discounts.map((discount_info) => (
              <tr key={discount_info.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">
                  {discount_info.place_date.toString()}
                </td>

                <td className="p-4 border-b border-gray-200 flex gap-4">
                  {discount_info.invoice}
                </td>

                <td className="p-4 border-b border-gray-200">
                  {discount_info.customer.name}
                </td>
                
                <td className="p-4 border-b border-gray-200">
                  {(discount_info.campaign.discount_type === "percentage") ? (
                    <span>{((100 * Number(discount_info.payable_price)) / (100 - Number(discount_info.campaign.discount))).toFixed(2) }</span>
                  ) : (
                    <span>{(Number(discount_info.payable_price) + Number(discount_info.campaign.discount)).toFixed(2)}৳</span>
                  )}
                </td>
              
                <td className=" p-4 border-b border-gray-200">
                  <div className="flex gap-2">
                   
                    <a
                      href="#"
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrint(discount_info.id);
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
