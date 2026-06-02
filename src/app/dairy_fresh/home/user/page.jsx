"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function Role() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/users?page=${page}&& 
        search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.data);

      setUsers(res.data.data.data);
      setCurrentPage(res.data.data.pagination.current_page);
      setLastPage(res.data.data.pagination.last_page);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    try {
      const res = await api.delete(`/api/user/${id}/destroy`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchUsers(currentPage);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="max-w-3xl p-4 bg-white rounded-md shadow-md">
      <input
        id="search"
        type="text"
        placeholder="Search user..."
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="py-3 px-2 flex flex-col sm:flex-row gap-2 justify-between">
                <div>
                  <div>
                    <Image src={user.image} width={100} height={100} alt={user.name}/>
                  </div>
                  <div className="text-lg font-medium">Name: {user.name}</div>
                  <div className="text-sm text-gray-500">
                   User Name: {user.username}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dairy_fresh/home/user/${user.id}/branch`}
                    className="text-blue-600 hover:underline"
                  >
                    Branches
                  </Link>
                  |
                  <Link
                    href={`/dairy_fresh/home/role?user=${user.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Roles
                  </Link>
                  |
                  <Link
                    href={`/dairy_fresh/home/user/edit/${user.id}`}
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
                      handleDelete(user.id);
                    }}
                    className=" text-red-600 cursor-pointer hover:underline"
                  >
                    Delete
                  </a>
                </div>
              </li>
            ))}
          </ul>

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
              Page {currentPage} of {lastPage}
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
        </>
      )}
    </div>
  );
}
