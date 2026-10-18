"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Select from "react-select";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function EditBanner() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [view_order, setViewOrder] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selected_position, setSelectedPosition] = useState("");

  const token = Cookies.get("auth_token");
  const { id } = useParams();
  const fetchBanner = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/api/banner/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setName(res.data.data.name);
      setViewOrder(res.data.data.view_order);
      setSelectedPosition(res.data.data.position);
      setPreviewUrl(res.data.data.image_url);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("position", selected_position);
      formData.append("view_order", view_order);
      formData.append("_method", "PUT");
      if (image) formData.append("image", image);

      const res = await api.post(`/api/banner/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      setButtonPressed(false);
    } catch (err) {
      setError(err?.response?.data);
      setButtonPressed(false);
    }
  };

  const position = [
    { value: "position-1", label: "1st Banner" },
    { value: "position-2", label: "2nd Banner Row" },
    { value: "position-3", label: "Modal Banner" },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setImage(null);
      setPreviewUrl(null);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <span className="text-lg font-medium text-amber-800">Loading...</span>
        </div>
      ) : (
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
                htmlFor="Position"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Position
              </label>

              <Select
                options={position}
                value={
                  position.find((opt) => opt.value === selected_position) ||
                  null
                }
                onChange={(selected) =>
                  setSelectedPosition(selected?.value || "")
                }
                placeholder="Select Position"
                className="px-4 mb-4 border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                isClearable
              />

              {error?.errors?.position && (
                <div className="w-full text-red-400 text-md pt-1">
                  * {error?.errors?.position}
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
                placeholder="Enter Banner Name"
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
                htmlFor="image"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Image
              </label>

              <input
                id="image"
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />

              {previewUrl && (
                <div className="mt-4">
                  <Image
                    src={previewUrl}
                    width={200}
                    height={200}
                    alt="Preview"
                  />
                </div>
              )}
              {error?.errors?.image && (
                <div className="w-full text-red-400 text-md pt-1">
                  * {error?.errors?.image}
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
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
