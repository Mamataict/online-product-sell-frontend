"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items array
  const navItems = [{ name: "Items", href: "#orders" }];

  return (
    <div>
      <nav className="fixed block w-full max-w-screen px-4 py-3 mx-auto bg-white bg-opacity-90 top-0 shadow lg:px-8 backdrop-blur-lg backdrop-saturate-150 z-[9999]">
        <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
          <Link
            href="/"
            className="mr-4 block cursor-pointer py-1.5 text-red-600 font-bold text-2xl"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/icons/dairy_fresh_logo.png`}
              alt="Mamata BD"
              width={60}
              height={60}
              className="transition-transform duration-500"
            />
          </Link>

          <div className="lg:hidden">
            <button
              className="relative ml-auto flex h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 shrink-0 items-center justify-center rounded-lg text-inherit transition-all hover:bg-gray-100"
              onClick={toggleMobileMenu}
              type="button"
            >
              <span className="flex items-center justify-center">
                <Image src={'/images/menu.png'} width={300} height={300} alt="Menu" className="w-20 h-auto" />
              </span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 left-0 min-h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden z-50`}
          >
            <div className="flex flex-row items-center border-b pb-4">
              <Link
                href="/"
                className="cursor-pointer text-red-600 font-bold text-xl pt-4 ps-4"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/icons/dairy_fresh_logo.png`}
                  alt="Mamata BD"
                  width={50}
                  height={50}
                  className="transition-transform duration-500"
                />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="absolute top-4 right-4 text-slate-600 hover:text-[#0F6939]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col h-full gap-4 p-4">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1 text-lg gap-x-2 text-slate-600 hover:text-[#0F6939]"
                >
                  <Link
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    href={item.href}
                    className="flex items-center"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1 text-lg gap-x-2 text-slate-600 hover:text-[#0F6939]"
                >
                  <Link href={item.href} className="flex items-center">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
