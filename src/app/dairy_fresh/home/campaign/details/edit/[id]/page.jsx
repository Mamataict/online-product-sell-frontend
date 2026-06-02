"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import CheckBox from "@/components/features_cus/CheckBox";

export default function EditCampaignDetails() {
  const [discount, setDiscount] = useState("");
  const [discount_type, setDiscountType] = useState("");
  const [effect_date, setEffectDate] = useState("");
  const [campaign_info_id, setCampaignInfoId] = useState("");
  const [campaign_info, setCampaignInfo] = useState([]);
  const [is_active, setIsActive] = useState(0);
  const [success, setSuccess] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const token = Cookies.get("auth_token");

  const fetchCampaignDetails = async () => {
    const res = await api.get(`/api/campaign/details/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setCampaignInfo(res.data.data.campaign_info);
    setDiscount(res.data.data.campaign_details.discount ?? "");
    setDiscountType(res.data.data.campaign_details.discount_type ?? "");
    setEffectDate(res.data.data.campaign_details.effect_date ?? "");
    setCampaignInfoId(res.data.data.campaign_details.campaign_info_id ?? "");
    setIsActive(res.data.data.campaign_details.is_active ? 1 : 0);
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("discount", discount);
      formData.append("discount_type", discount_type);
      formData.append("effect_date", effect_date);
      formData.append("campaign_info_id", campaign_info_id);
      formData.append("is_active", is_active);
      formData.append("_method", "PUT");

      const res = await api.post(`/api/campaign/details/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const discount_types = [
    { id: "percentage", name: "Percentage" },
    { id: "fixed", name: "Fixed Amount" },
  ];

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
              htmlFor="discount"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Discount
            </label>

            <input
              id="discount"
              type="text"
              name="discount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter Discount"
              value={discount}
              onChange={(e) => {
                setDiscount(e.target.value);
              }}
            />

            {error?.errors?.discount && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.discount}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="discount_type"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Discount Type
            </label>

            <select
              id="discount_type"
              name="discount_type"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={discount_type}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="">Select Discount Type</option>
              {discount_types?.map((discount_type) => (
                <option key={discount_type.id} value={discount_type.id}>
                  {discount_type.name}
                </option>
              ))}
            </select>

            {error?.errors?.discount_type && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.discount_type}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="campaign_info_id"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Campaign Info
            </label>

            <select
              id="campaign_info_id"
              name="campaign_info_id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={campaign_info_id}
              onChange={(e) => setCampaignInfoId(e.target.value)}
            >
              <option value="">Select Campaign</option>
              {campaign_info?.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>

            {error?.errors?.campaign_info_id && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.campaign_info_id}
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
              placeholder="Enter Effect Date"
              value={effect_date}
              onChange={(e) => {
                setEffectDate(e.target.value);
              }}
            />

            {error?.errors?.effect_date && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.effect_date}
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
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
