"use client";
import { useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function CreateProductCategory() {
  const [name, setName] = useState("");
  const [view_order, setViewOrder] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");

  const token = Cookies.get("auth_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setError("");

    try {
      const res = await api.post(
        "/api/product_category",
        { name, view_order },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message);
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
              placeholder="Enter Product Category Name"
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
              htmlFor="view_order"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              View Order
            </label>

            <input
              id="view_order"
              type="number"
              name="view_order"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter View Order"
              value={view_order}
              onChange={(e) => {
                setViewOrder(e.target.value);
              }}
            />

            {error?.errors?.view_order && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.view_order}
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
