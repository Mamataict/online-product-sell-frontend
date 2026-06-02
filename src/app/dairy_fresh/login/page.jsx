"use client";
import { AuthContext } from "@/context/auth-context";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [error, setError] = useState("");
  const [pass_show, setPassShow] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setButtonPressed(true);
      await login({ username, password });
      router.push("/dairy_fresh/home");
    } catch (err) {
      setError(err);
      setButtonPressed(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="rounded-2xl bg-white px-4 py-6 sm:px-8 sm:py-10 shadow-2xl w-full max-w-md">
        <div className="w-full flex justify-center items-center mb-4">
          <Link href="/">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/icons/dairy-fresh.png`}
              alt="Mamata BD"
              width={130}
              height={130}
              className="object-contain"
            />
          </Link>
        </div>

        <div>
          {error?.message && (
            <div className="w-full pb-2 text-red-400 text-lg">
              * {error.message}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 text-base sm:text-lg font-medium mb-1"
            >
              User Name
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="w-full px-4 py-3 border text-base sm:text-lg border-gray-300 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter your username, example: 020..."
            />
            {error?.errors?.username && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.username}
              </div>
            )}
            <div></div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-base sm:text-lg font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={pass_show ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full px-4 py-3 border text-base sm:text-lg border-gray-300 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                {pass_show ? (
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className="text-gray-500 text-2xl"
                    onClick={() => setPassShow(false)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faEye}
                    className="text-gray-500 text-2xl"
                    onClick={() => setPassShow(true)}
                  />
                )}
              </div>
            </div>
            {error?.errors?.password && (
              <div className="w-full text-red-400 text-md pt-1">
                * {error?.errors?.password}
              </div>
            )}
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className={`w-full btn-primary-cus text-white py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-md transition duration-300 ${
                buttonPressed
                  ? "opacity-60 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              disabled={buttonPressed}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
