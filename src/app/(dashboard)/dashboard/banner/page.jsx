"use client";
import { useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import PermissionGuard from "@/components/dashboard/PermissionGuard";
import Image from "next/image";
import Select from "react-select";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token");
  const [error, setError] = useState("");
  const [search_by_name, setSearchByName] = useState("");
  const [search_by_position, setSearchByPosition] = useState("");

  const [openMore, setOpenMore] = useState(false);

  const fetchBanners = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/banner?page=${page}&&name=${search_by_name}&&position=${search_by_position}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBanners(res.data.data.data);
      setCurrentPage(res.data.data.current_page);
      setLastPage(res.data.data.last_page);
      setPerPage(res.data.data.per_page);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage >= 1 && currentPage <= lastPage) {
      fetchBanners(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await api.delete(`/api/banner/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchBanners(currentPage);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const position = [
    { value: "position-1", label: "1st Banner" },
    { value: "position-2", label: "2nd Banner Row" },
    { value: "position-3", label: "Modal Banner" },
  ];

  return (
    <div className="max-w-3xl p-4 bg-white rounded-md shadow-md">
      <div>
        <div className="grid grid-cols-3 gap-2">
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            className="w-full px-4 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setSearchByName(e.target.value);
            }}
          />

          <Select
            options={position}
            value={
              position.find((opt) => opt.value === search_by_position) || null
            }
            onChange={(selected) => setSearchByPosition(selected?.value || "")}
            placeholder="Select Position"
            className="px-4 mb-4 border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            isClearable
          />

          <button
            onClick={() => fetchBanners(1)}
            className="px-4 py-2 h-11 bg-blue-600 rounded-lg shadow-xs text-white cursor-pointer"
          >
            Search
          </button>

          <PermissionGuard permission={"banner.store"}>
            <FontAwesomeIcon
              icon={faPlus}
              className={`transition-transform duration-300 text-4xl cursor-pointer ml-2 ${
                openMore ? "rotate-45" : ""
              }`}
              onClick={() => setOpenMore(!openMore)}
            />
          </PermissionGuard>
        </div>
        <div
          className={`overflow-hidden flex transition-all duration-500 ease-in-out 
    ${openMore ? "max-h-40 opacity-100 p-5 " : "max-h-0 opacity-0 p-0"}`}
        >
          <div className="px-2">Will you add new?</div>
          <Link
            href={`/dashboard/banner/new`}
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
              <th className="p-4 border-b border-gray-200">SL.</th>
              <th className="p-4 border-b border-gray-200">Name</th>
              <th className="p-4 border-b border-gray-200">Image</th>
              <th className="p-4 border-b border-gray-200">Position</th>
              <th className="p-4 border-b border-gray-200">View Order</th>
              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">{(index+1)+((currentPage-1)*perPage)}</td>
                <td className="p-4 border-b border-gray-200">{banner.name}</td>
                <td className="p-4 border-b border-gray-200">
                  <Image
                    src={banner.image_url}
                    alt={banner.name}
                    width={50}
                    height={50}
                    className="w-30 h-auto"
                  />
                </td>
                <td className="p-4 border-b border-gray-200">
                  {banner.position}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {banner.view_order}
                </td>

                <td className=" p-4 border-b border-gray-200">

                  <div className="flex gap-2">

                  <Link
                    href={`/dashboard/banner/edit/${banner.id}`}
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
                      handleDelete(banner.id);
                    }}
                    className=" text-red-600 cursor-pointer hover:underline"
                  >
                    Delete
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
