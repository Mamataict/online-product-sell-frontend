"use client";
import { useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function CreateDeliveryFee() {
  const [info, setInfo] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [effect_date, setEffectDate] = useState(new Date().toISOString().split('T')[0]);
  const [is_active, setIsActive] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");

  const token = Cookies.get("auth_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setError("");

    try {
      const res = await api.post(
        "/api/delivery_fee",
        { info, delivery_charge: deliveryCharge, effect_date, is_active },
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
              htmlFor="info"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Info
            </label>

            <input
              id="info"
              type="text"
              name="info"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter Info"
              value={info}
              onChange={(e) => {
                setInfo(e.target.value);
              }}
            />

            {error?.errors?.info && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.info}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="delivery_charge"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Delivery Charge
            </label>

            <input
              id="delivery_charge"
              type="text"
              name="delivery_charge"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter Delivery Charge"
              value={deliveryCharge}
              onChange={(e) => {
                setDeliveryCharge(e.target.value);
              }}
            />

            {error?.errors?.delivery_charge && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.delivery_charge}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="effect_date"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Effect Date
            </label>

            <input
              id="effect_date"
              type="date"
              name="effect_date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={effect_date}
              onChange={(e) => {
                setEffectDate(e.target.value);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="is_active"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Is Active
            </label>

            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              checked={is_active}
              onChange={(e) => {
                setIsActive(e.target.checked);
              }}
            />
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
