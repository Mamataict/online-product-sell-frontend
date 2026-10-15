"use client";
import { useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faPrint,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { printReport, cleanupPrint } from "@/lib/printReport";
import Select from "react-select";

export default function DueReport() {
  const [due_reports, setDueReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token");
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState("");
  const [openMore, setOpenMore] = useState(false);

  const today = new Date();

  const [start_date, setStartDate] = useState(today.toISOString().slice(0, 10));
  const [end_date, setEndDate] = useState(today.toISOString().slice(0, 10));

  const [orderStatus, setOrderStatus] = useState(2);

  const fetchDueReport = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/report/due?page=${page}&invoice=${invoice}&start_date=${start_date}&end_date=${end_date}&order_status=${orderStatus}
        `,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDueReports(res.data.data);
      setCurrentPage(res.data.data.orders.data.current_page);
      setLastPage(res.data.data.orders.data.last_page);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueReport(1);
  }, []);

  const clickSearch = () => {
    fetchDueReport(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      fetchDueReport(newPage);
    }
  };

  const handlePrint = async (id) => {
    try {
      await printReport({
        path: `/api/report/due/print/${id}`,
        token,
        filename: "due-report.pdf",
        params: {
          start_date,
          end_date,
          invoice,
          order_status: orderStatus
        },
      });
    } catch (err) {
      console.error("Failed to print receipt:", err);
    }
  };
  const handleDuePrint = async () => {
    try {
      await printReport({
        path: `/api/report/orders/due/print/`,
        token,
        filename: "due-report.pdf",
        params: {
          start_date,
          end_date,
          invoice,
          order_status: orderStatus
        },
      });
    } catch (err) {
      console.error("Failed to print receipt:", err);
    }
  };

  const orderStatusOptions = [
    { value: 2, label: "Confirmed" },
    { value: 3, label: "Delivered" },
  ];

  const toDateString = (date) => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="max-w-5xl p-4 bg-white rounded-md shadow-md">
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <input
            id="search"
            type="text"
            placeholder="Invoice number"
            className=" px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setInvoice(e.target.value);
            }}
          />

          <DatePicker
            selected={start_date ? new Date(start_date) : null}
            onChange={(date) => setStartDate(toDateString(date))}
            dateFormat="dd/MM/yyyy"
            placeholderText="Search by date..."
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            wrapperClassName="w-full"
            portalId="datepicker-portal"
          />
          <DatePicker
            selected={end_date ? new Date(end_date) : null}
            onChange={(date) => setEndDate(toDateString(date))}
            dateFormat="dd/MM/yyyy"
            placeholderText="Search by date..."
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            wrapperClassName="w-full"
            portalId="datepicker-portal"
          />

          <Select
            options={orderStatusOptions}
            value={
              orderStatusOptions.find((opt) => opt.value === orderStatus) || ""
            }
            onChange={(selected) => setOrderStatus(selected?.value || "")}
            placeholder="Select Order Status"
            isClearable
          />

          <button
            type="button"
            onClick={clickSearch}
            className="p-2 bg-blue-500 rounded-lg text-white h-10 cursor-pointer"
          >
            Search
          </button>

          <button
            onClick={() => handleDuePrint()}
            className="text-blue-600 cursor-pointer border-2  h-10 border-blue-500 rounded-xl"
            title="Print Invoice Report"
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
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
            {due_reports?.orders?.data?.map((due_info) => (
              <tr key={due_info.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">
                  {due_info.place_date.toString()}
                </td>

                <td className="p-4 border-b border-gray-200">
                  {due_info.order_info_id}
                </td>

                <td className="p-4 border-b border-gray-200">
                  {due_info.customer.name} ({due_info.customer.phone})
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
                      href={`/dashboard/report/due/invoice/${due_info.id}`}
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

          <tfoot>
            <tr className="border-b border-gray-200">
              <td className="p-4 border-b border-gray-200" colSpan={3}>Total:</td>
              <td className="p-4 border-b border-gray-200">{due_reports?.total_due_paid}</td>
              <td className="p-4 border-b border-gray-200">{due_reports?.total_due_remaining}</td>
              <td className="p-4 border-b border-gray-200"></td>
            </tr>
          </tfoot>
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
