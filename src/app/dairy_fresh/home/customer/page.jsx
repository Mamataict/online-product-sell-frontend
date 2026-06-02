"use client";
import { useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { AuthContext } from "@/context/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import List from "@/components/customer/List";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
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

  const { id } = useParams();

  const fetchCustomers = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/customers_info?page=${page} && 
        search=${searchTerm}
        `,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(res.data.data.data);
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
      fetchCustomers(1);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchCustomers(newPage);
    }
  };

  const { user_data } = useContext(AuthContext);

  const hasPermission = (permissionList) => {
    return permissionList.some((p) => user_data?.permissions?.includes(p));
  };

  return (
    <div className="max-w-3xl p-4 bg-white rounded-md shadow-md">
      <div>
        <div className="flex">
          <input
            id="search"
            type="text"
            placeholder="Search by phone..."
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          {/* {hasPermission(["product_category.store"]) && (
            <FontAwesomeIcon
              icon={faPlus}
              className={`transition-transform duration-300 text-4xl cursor-pointer ml-2 ${
                openMore ? "rotate-45" : ""
              }`}
              onClick={() => setOpenMore(!openMore)}
            />
          )} */}
        </div>
        {/* <div
          className={`overflow-hidden flex transition-all duration-500 ease-in-out 
    ${openMore ? "max-h-40 opacity-100 p-5 " : "max-h-0 opacity-0 p-0"}`}
        >
          <div className="px-2">Will you add new?</div>
          <Link
            href={`/dairy_fresh/home/product/new`}
            className="text-blue-600 hover:underline"
          >
            click here
          </Link>
        </div> */}
      </div>

       <List
        customers={customers}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
        handlePageChange={handlePageChange}
        // handleDelete={handleDelete}
        // handleActivation={handleActivation}
        user={user}
      />
    </div>
  );
}
