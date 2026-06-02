"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import CheckBox from "@/components/features_cus/CheckBox";
import { toast } from "react-hot-toast";

export default function EditBranch() {
  const [name, setName] = useState("");
  const [branch_code, setBranchCode] = useState("");
  const [address, setAddress] = useState("");
  const [is_active, setIsActive] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const token = Cookies.get("auth_token");

  useEffect(() => {
    const fetchBranch = async () => {
      const res = await api.get(`/api/branch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setName(res.data.data.name);
      setBranchCode(res.data.data.branch_code);
      setAddress(res.data.data.address);
      setIsActive(res.data.data.is_active);
      setLoading(false);
    };
    fetchBranch();
  }, [id, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("branch_code", branch_code);
    formData.append("address", address);
    formData.append("is_active", is_active);
    formData.append("_method", "PUT");

    try {
      const res = await api.post(`/api/branch/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      setError("");
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setButtonPressed(false);
    }
  };

  if (loading) return <p>Loading...</p>;

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
            {error?.errors?.name && (
              <div className="text-red-400 text-sm pt-1">
                * {error.errors.name}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="branch_code"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Branch Code
            </label>
            <input
              id="branch_code"
              type="text"
              name="branch_code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter Branch Code"
              value={branch_code || ""}
              onChange={(e) => setBranchCode(e.target.value)}
            />
            {error?.errors?.branch_code && (
              <div className="text-red-400 text-sm pt-1">
                * {error.errors.branch_code}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter address"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
            />
            {error?.errors?.address && (
              <div className="text-red-400 text-sm pt-1">
                * {error.errors.address}
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
              className={`w-full btn-primary-cus text-white py-3 text-lg font-semibold rounded-md transition duration-300 cursor-pointer ${
                buttonPressed ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={buttonPressed}
            >
              {buttonPressed ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
