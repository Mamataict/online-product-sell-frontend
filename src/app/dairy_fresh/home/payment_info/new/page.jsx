"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import CheckBox from "@/components/features_cus/CheckBox";
import AsyncSelect from "react-select/async";

export default function CreatePaymentType() {
  const [name, setName] = useState("");
  const [is_active, setIsActive] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");

  const [paymentTypes, setPaymentTypes] = useState([]);

  const [selectedType, setSelectedType] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');

  const token = Cookies.get("auth_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setError("");

    try {
      const res = await api.post(
        "/api/payment_info",
        { name, selectedTypeId, is_active },
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

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const res = await api.get("/api/payment_info/types", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data.data);
        setPaymentTypes(res.data.data);
      } catch (err) {
        setError(err?.response?.data);
      }
    };
    fetchPaymentTypes();
  }, [buttonPressed]);

  const paymentTypeOptions = async (inputValue) => {
  return paymentTypes
    .filter((item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    )
    .map((payment_type) => ({
      value: payment_type.id,
      label: payment_type.name,
    }));
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
              htmlFor="Payment Type"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Payment Type
            </label>

             <AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={paymentTypeOptions}
  value={selectedType}
  onChange={(selectedOption) => {
    setSelectedType(selectedOption);
    setSelectedTypeId(selectedOption ? selectedOption.value : "");
  }}
  placeholder="Select Payment Type"
  isClearable
/>

            {error?.errors?.name && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.name}
              </div>
            )}
          </div>

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
              placeholder="Enter Branch Name"
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
