"use client";

import {
  faBriefcase,
  faListDots,
  faMoneyBill,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { AuthContext } from "@/context/auth-context";

export default function AdminDashboard() {
  const [data, setData] = useState({
    order_count: 0,
    order_income: 0,
    customer_count: 0,
  });
  const [error, setError] = useState(null);

  const token = Cookies.get("auth_token");

  const { user_data } = useContext(AuthContext);

  const hasPermission = (permissionList) => {
    return permissionList.some((p) => user_data?.permissions?.includes(p));
  };

  useEffect(() => {
  if (!token) return;

  const fetchDashboardInfo = async () => {
    try {
      const res = await api.get("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data);
    } catch (err) {
      setError(err?.response?.data || "Failed to fetch dashboard info");
    }
  };

  fetchDashboardInfo();
}, [token]);

  return (
    <>
      {/* {hasPermission(["order.inquiry"]) &&
        (data?.order_count > 0 ||
          data?.order_income > 0 ||
          data?.customer_count > 0 ||
          data?.branches?.length > 0) && ( */}
          <div className="container mx-auto">
            <div className="grid sm:grid-cols-3 gap-4 max-w-6xl">
              <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
                <div className="mb-4 space-y-6">
                  <label className="block font-medium text-gray-700 mb-1 text-lg">
                    Orders Count
                  </label>
                  <div className="text-3xl">{data?.total_orders ?? ""}</div>
                </div>
                {/* <div className="text-sm mt-6">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="text-green-500 mr-1"
                  />
                  Total orders in the last 30 days
                </div> */}
              </div>

              <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
                <div className="mb-4 space-y-6">
                  <label className="block font-medium text-gray-700 mb-1 text-lg">
                    Paid Amount
                  </label>
                  <div className="text-3xl">
                    {Number(data?.total_paid ?? 0) ?? ""} BDT
                  </div>
                </div>
                {/* <div className="text-sm mt-6">
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    className="text-green-500 mr-1"
                  />
                  Total income in the last 30 days
                </div> */}
              </div>

              <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
                <div className="mb-4 space-y-6">
                  <label className="block font-medium text-gray-700 mb-1 text-lg">
                    Pending Count
                  </label>
                  <div className="text-3xl">{data?.total_pending ?? ""}</div>
                </div>
                {/* <div className="text-sm mt-6">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-green-500 mr-1"
                  />
                  Last 30 days customers count
                </div> */}
              </div>
              <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
                <div className="mb-4 space-y-6">
                  <label className="block font-medium text-gray-700 mb-1 text-lg">
                    Confirmed Count
                  </label>
                  <div className="text-3xl">{data?.total_confirmed ?? ""}</div>
                </div>
                {/* <div className="text-sm mt-6">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-green-500 mr-1"
                  />
                  Last 30 days customers count
                </div> */}
              </div>
              <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
                <div className="mb-4 space-y-6">
                  <label className="block font-medium text-gray-700 mb-1 text-lg">
                    Delivered Count
                  </label>
                  <div className="text-3xl">{data?.total_delivered ?? ""}</div>
                </div>
                {/* <div className="text-sm mt-6">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-green-500 mr-1"
                  />
                  Last 30 days customers count
                </div> */}
              </div>
              <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
                <div className="mb-4 space-y-6">
                  <label className="block font-medium text-gray-700 mb-1 text-lg">
                    Cancelled Count
                  </label>
                  <div className="text-3xl">{data?.total_cancelled ?? ""}</div>
                </div>
                {/* <div className="text-sm mt-6">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-green-500 mr-1"
                  />
                  Last 30 days customers count
                </div> */}
              </div>

              {/* <div className="rounded-md shadow-md p-4 bg-white w-full max-w-xs">
                <div className="mb-4 space-y-6">
                  <label className="block font-medium text-gray-700 mb-1 text-lg">
                    Branches
                  </label>
                  <div className="text-3xl pl-4 space-y-1">
                    {data?.branches?.map((branch) => (
                      <li key={branch.id} className="text-sm">
                        <span className="mr-2">{branch.name}</span>
                      </li>
                    ))}
                  </div>
                </div>
                <div className="text-sm mt-6">
                  <FontAwesomeIcon
                    icon={faListDots}
                    className="text-green-500 mr-1"
                  />
                  Assigned branches
                </div>
              </div> */}
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        {/* )} */}

    </>
  );
}
