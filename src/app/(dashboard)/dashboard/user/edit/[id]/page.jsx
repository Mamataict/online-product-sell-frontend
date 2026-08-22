"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "./../../../../../../lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function EditUserPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const token = Cookies.get("auth_token");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get(`/api/user/${id}/show`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setName(res.data.data.name);
      setUsername(res.data.data.username);
      setPreviewUrl(res.data.data.image)
    };
    fetchUser();
  }, [id, success]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    if (password) formData.append("password", password);
    if (password_confirmation) formData.append("password_confirmation", password_confirmation);
    if (image) formData.append("image", image);

    formData.append("_method", "PUT");

    try {
      const res = await api.post(`/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);

      setName("");
      setUsername("");
      setPassword("");
      setPasswordConfirmation("");
      setImage(null);
      setPreviewUrl(null);
      setError("");
      setSuccess(true);
      
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setButtonPressed(false);
    }
  };

  if (!name || !username) return <p>Loading...</p>;

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
        <form onSubmit={handleSubmit} className="space-y-6" >
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
              value={name}
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
              htmlFor="username"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {error?.errors?.username && (
              <div className="text-red-400 text-sm pt-1">
                * {error.errors.username}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error?.errors?.password && (
              <div className="text-red-400 text-sm pt-1">
                * {error.errors.password}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="block font-medium text-gray-700 mb-1 text-lg"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Confirm password"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            
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
              name="image"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              onChange={handleFileChange}
            />
            {error?.errors?.image && (
              <div className="text-red-400 text-sm pt-1">
                * {error.errors.image}
              </div>
            )}
            {previewUrl && (
              <div className="mt-5">
                <Image
                  src={previewUrl}
                  width={200}
                  height={200}
                  alt="Preview"
                />
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
