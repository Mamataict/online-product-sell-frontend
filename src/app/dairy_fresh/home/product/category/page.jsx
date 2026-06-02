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

export default function ProductCategory() {
  const [product_categories, setProductCategories] = useState([]);
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

  const fetchProductCategories = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/product_category?page=${page} && 
        search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProductCategories(res.data.data.data);
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
    if (currentPage >= 1 && currentPage <= lastPage) {
      fetchProductCategories(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProductCategories(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await api.delete(`/api/product_category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchProductCategories(currentPage);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleActivation = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await api.put(
        `/api/product_category/${id}/activation`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      fetchProductCategories(currentPage);
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
            placeholder="Search by name..."
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          {hasPermission(["product_category.store"]) && (
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
            href={`/dairy_fresh/home/product/category/new`}
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
              <th className="p-4 border-b border-gray-200">Products</th>
              <th className="p-4 border-b border-gray-200">Status</th>
              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {product_categories.map((product_category) => (
              <tr
                key={product_category.id}
                className="border-b border-gray-200"
              >
                <td className="p-4 border-b border-gray-200">
                  {product_category.name}
                </td>
                <td className="p-4 border-b border-gray-200">
                  
                  <Link
                    href={`/dairy_fresh/home/product/${product_category.id}`}
                    className="text-blue-600 hover:underline"
                  >{product_category.products.length}</Link>
                </td>
                <td className="p-4 border-b border-gray-200">
                  <a
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleActivation(product_category.id);
                    }}
                    className={`cursor-pointer hover:underline ${
                      product_category.is_active
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product_category.is_active ? "Active" : "Inactive"}
                  </a>
                </td>
                <td className="flex gap-2 p-4 border-b border-gray-200">
                  <Link
                    href={`/dairy_fresh/home/product/category/edit/${product_category.id}`}
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
                      handleDelete(product_category.id);
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
