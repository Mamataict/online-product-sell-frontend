"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Tiptap from "@/components/features_cus/Tiptap";
import { useSearchParams } from "next/navigation";
import CheckBox from "@/components/features_cus/CheckBox";

export default function Permission() {
  const [permissions, setPermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const role_cus = searchParams.get('role');
  const [role, setRole] = useState(role_cus);

  const fetchPermissions = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/permission?page=${page}&& 
        search=${searchTerm} && role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPermissions(res.data.data.data);
      setCurrentPage(res.data.data.current_page);
      setLastPage(res.data.data.last_page);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   if(!role_cus){
     setRole(null);
   }
  }, [role_cus]);

  useEffect(() => {
      fetchPermissions(1);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchPermissions(newPage);
    }
  };

  const onPermit = async (permission) => {
    
    try {
      const res = await api.post(
        `/api/role/${role}/permission`,
        { permission: permission },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      fetchPermissions(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign permission");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this permission?"
    );
    if (!confirm) return;

    try {
      const res = await api.delete(`/api/permission/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchPermissions(currentPage);
    } catch (err) {
      toast.error("Failed to delete permission");
    }
  };

  return (
    <div className="max-w-3xl p-4 bg-white rounded-md shadow-md">
      <input
        id="search"
        type="text"
        placeholder="Search roles..."
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 ">
            {permissions.map((permission) => (
              <li
                key={permission.id}
                className="py-3 px-2 flex flex-col gap-2 justify-between"
              >
                <div className="gap-2 flex flex-col">
                  <div className="text-2xl font-medium">{permission.name}</div>
                  <div className="text-lg text-gray-500">
                    Guard: {permission.guard_name}
                  </div>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: permission.description,
                    }}
                  ></div>
                </div>
                <div className="flex gap-2">
                  {role && (
                    <CheckBox
                      checked={permission.roles?.length > 0}
                      onChange={() => onPermit(permission.id)}
                    />
                  )}
                  <Link
                    href={`/dairy_fresh/home/permission/edit/${permission.id}`}
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
                      handleDelete(permission.id);
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
