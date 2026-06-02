"use client";
import { useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export default function Campaign() {
  const [campaigns, setCampaigns] = useState([]);
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

  const fetchCampaigns = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/campaign?page=${page} && 
        search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCampaigns(res.data.data.data);
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
      fetchCampaigns(1);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchCampaigns(newPage);
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
      fetchCampaigns(currentPage);
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
        }
      );

      toast.success(res.data.message);
      fetchCampaigns(currentPage);
    } catch (err) {
      toast.error("Failed to change status");
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
            placeholder="Search by name or post..."
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          {hasPermission(["campaign.store"]) && (
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
            href={`/dairy_fresh/home/campaign/new`}
            className="text-blue-600 hover:underline"
          >
            click here
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200">Name</th>
              <th className="p-4 border-b border-gray-200">Info</th>
              <th className="p-4 border-b border-gray-200">Status</th>
              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">
                  {campaign.name}
                </td>

                <td className="p-4 border-b border-gray-200 flex gap-4">
                  {campaign.details.length > 0 && (
                    <>
                      <Link
                        href={`/dairy_fresh/home/campaign/${campaign.id}/details`}
                        className="text-blue-600 hover:underline"
                      >
                        {campaign.details.length}
                      </Link>

                      <div className="px-1">|</div>
                    </>
                  )}
                  <Link
                    href={`/dairy_fresh/home/campaign/${campaign.id}/details/new`}
                    className="text-blue-600 hover:underline"
                  >
                    New?
                  </Link>
                </td>

                <td className="p-4 border-b border-gray-200">
                  <a
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleActivation(campaign.id);
                    }}
                    className={`cursor-pointer hover:underline ${
                      campaign.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {campaign.is_active ? "Active" : "Inactive"}
                  </a>
                </td>
                <td className="flex gap-2 p-4 border-b border-gray-200">
                  <Link
                    href={`/dairy_fresh/home/campaign/edit/${campaign.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  |
                  <a
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(campaign.id);
                    }}
                    className=" text-red-600 cursor-pointer hover:underline"
                  >
                    Delete
                  </a>
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
