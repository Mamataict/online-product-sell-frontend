"use client";
import { useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Tiptap from "@/components/features_cus/Tiptap";

export default function CreateRole() {
  const [name, setName] = useState("");
  const [guard_name, setGuardName] = useState("");
  const [description, setDescription] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");

  const token = Cookies.get("auth_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setError("");

    try {
      const res = await api.post(
        "/api/permission",
        { name, guard_name, description },
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
              placeholder="Enter permission name"
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
              htmlFor="guard_name"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Guard Name
            </label>

            <input
              id="guard_name"
              type="text"
              name="guard_name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter guard name"
              value={guard_name}
              onChange={(e) => {
                setGuardName(e.target.value);
              }}
            />

            {error?.errors?.guard_name && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.guard_name}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Description
            </label>

            <Tiptap
              editorContent={description}
              onChange={setDescription}
            />

            {error?.errors?.description && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.description}
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
