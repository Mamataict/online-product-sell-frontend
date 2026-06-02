"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import CheckBox from "@/components/features_cus/CheckBox";
import { toast } from "react-hot-toast";

export default function EditDeliveryFee() {
  const [info, setInfo] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [effect_date, setEffectDate] = useState(new Date().toISOString().split('T')[0]);
  const [is_active, setIsActive] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const token = Cookies.get("auth_token");

  useEffect(() => {
    const fetchDeliveryFee = async () => {
      const res = await api.get(`/api/delivery_fee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setInfo(res.data.data.info);
      setDeliveryCharge(res.data.data.delivery_charge);
      setEffectDate(res.data.data.effect_date);
      setIsActive(res.data.data.is_active);
      setLoading(false);
    };
    fetchDeliveryFee();
  }, [id, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    formData.append("info", info);
    formData.append("delivery_charge", deliveryCharge);
    formData.append("effect_date", effect_date);
    formData.append("is_active", is_active);
    formData.append("_method", "PUT");

    try {
      const res = await api.post(`/api/delivery_fee/${id}`, formData, {
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
              htmlFor="info"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Info
            </label>
            <input
              id="info"
              type="text"
              name="info"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter info"
              value={info || ""}
              onChange={(e) => setInfo(e.target.value)}
            />
            {error?.errors?.info && (
              <div className="text-red-400 text-sm pt-1">
                * {error.errors.info}
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
