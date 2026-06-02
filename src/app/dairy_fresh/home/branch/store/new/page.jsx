"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import CheckBox from "@/components/features_cus/CheckBox";

export default function CreateBranchStore() {
  const [name, setName] = useState("");
  const [store_code, setBranchStoreCode] = useState("");
  const [address, setAddress] = useState("");
  const [branch_info_id, setBranchInfoId] = useState("");
  const [is_active, setIsActive] = useState(0);
  const [branch_store_create, setBranchStoreCreate] = useState([]);
  const [success, setSuccess] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");

  const token = Cookies.get("auth_token");

  useEffect(() => {
    const fetchBranchStoreCreate = async () => {
      const res = await api.get(`/api/branch/store/create`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBranchStoreCreate(res.data.data);
 
    };
    fetchBranchStoreCreate();
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("store_code", store_code);
      formData.append("address", address);
      formData.append("branch_info_id", branch_info_id);
      formData.append("is_active", is_active);

      const res = await api.post("/api/branch/store", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      setButtonPressed(false);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data);
      setButtonPressed(false);
    }
  };

  return (
    <>
      <div className="rounded-md shadow-md p-4 bg-white w-full max-w-sm">
        <div>
          {error?.message && (
            <div className="w-full pb-2 text-red-400 text-lg">
              * {error.message}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter Branch Store Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            {error?.errors?.name && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.name}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="store_code"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Branch Store Code
            </label>

            <input
              id="store_code"
              type="text"
              name="store_code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter Branch Store Code"
              value={store_code}
              onChange={(e) => {
                setBranchStoreCode(e.target.value);
              }}
            />

            {error?.errors?.store_code && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.store_code}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Address
            </label>

            <input
              id="address"
              type="text"
              name="address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />

            {error?.errors?.address && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.address}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="branch_info_id"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Branch Info
            </label>

            <select
              id="branch_info_id"
              name="branch_info_id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={branch_info_id}
              onChange={(e) => setBranchInfoId(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branch_store_create?.branches?.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            {error?.errors?.branch_info_id && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.branch_info_id}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="is_active"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Status
            </label>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <CheckBox
                checked={is_active}
                onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
              />
              <span>{is_active ? "Active" : "Inactive"}</span>
            </label>

            {error?.errors?.is_active && (
              <div className="text-red-400 text-sm pt-1">
                * {error.errors.is_active}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className={`w-full btn-primary-cus text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-md transition duration-300 ${
                buttonPressed
                  ? "opacity-60 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              disabled={buttonPressed}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
