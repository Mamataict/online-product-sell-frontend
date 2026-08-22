"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import CheckBox from "@/components/features_cus/CheckBox";
import { useParams } from "next/navigation";

export default function SupplierDetails() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [is_active, setIsActive] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { id } = useParams();
  const token = Cookies.get("auth_token");

  useEffect(() => {
    const fetchSupplier = async () => {
      const res = await api.get(`/api/supplier/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setName(res.data.data.name);
      setAddress(res.data.data.address);
      setPhone(res.data.data.phone);
      setIsActive(res.data.data.is_active);
    };
    fetchSupplier();
  }, [id, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("is_active", is_active);
    formData.append("_method", "PUT");

    try {
      const res = await api.post(
        `/api/supplier/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message);
      setError("");
      setSuccess(true);
      setButtonPressed(false);
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
              placeholder="Enter Name"
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
              htmlFor="phone"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Phone
            </label>

            <input
              id="phone"
              type="text"
              name="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter Phonenumber"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />

            {error?.errors?.phone && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.phone}
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
