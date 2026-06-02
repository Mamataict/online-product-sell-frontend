"use client";

import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "@/context/auth-context";
import Breadcrumb from "@/components/BreadCrumb";

const Navbar = () => {
  const { logout, user_data } = useContext(AuthContext);

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const wrapperRef = useRef(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const hasPermission = (permissionList) => {
    if (!user_data?.permissions) return false;
    return permissionList.some((p) => user_data.permissions.includes(p));
  };

  const arrowClass = (menu) =>
    `transition-transform duration-300 ${
      openMenu === menu ? "rotate-180" : ""
    }`;

  const arrowClassSub = (menu) =>
    `transition-transform duration-300 ${
      openSubMenu === menu ? "rotate-180" : ""
    }`;

  /* close profile dropdown */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="w-full h-[200px] lg:h-[100px] text-gray-700 relative">

      {/* ===== MOBILE HEADER ===== */}
      <div className="bg-white rounded-2xl lg:hidden my-3 p-3 flex justify-between">
        <Link href="/dairy_fresh/home">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/icons/logo.png`}
            alt="Logo"
            width={80}
            height={80}
            priority
          />
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col justify-between w-[55px] h-[40px] mt-5"
        >
          <span className={`h-1 bg-gray-800 rounded transition ${isMenuOpen ? "rotate-45 translate-y-[10px]" : ""}`} />
          <span className={`h-1 bg-gray-800 rounded transition ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`h-1 bg-gray-800 rounded transition ${isMenuOpen ? "-rotate-45 -translate-y-[10px]" : ""}`} />
        </button>
      </div>

      {/* ===== DESKTOP HEADER ===== */}
      <div className="flex items-center justify-between pt-4 px-3 lg:px-0">
        <Breadcrumb />

        {user_data && (
          <div className="relative" ref={wrapperRef}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setOpenProfileMenu(!openProfileMenu)}
            >
              <span className="hidden sm:block sm:text-lg font-medium">
                {user_data.name}
              </span>

              <Image
                src={user_data.image}
                width={50}
                height={50}
                alt="Profile"
                className="rounded-full w-[50px] h-[50px] object-cover"
              />
            </div>

            {openProfileMenu && (
              <div className="absolute right-0 mt-3 shadow rounded-xl p-3 bg-white z-[9999]">
                <div className="text-red-400 py-2 cursor-pointer" onClick={logout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== MOBILE MENU ===== */}
      {isMenuOpen && (
        <div className="absolute lg:hidden rounded-2xl shadow-xl bg-white top-[115px] z-[9999] px-3 sm:px-6 py-10 w-full">

          <Link href="/dairy_fresh/home" className="block px-4 py-3">
            Dashboard
          </Link>

          {/* ROLE */}
          {hasPermission(["role.index", "role.store"]) && (
            <div>
              <button onClick={() => toggleMenu("role")} className="flex justify-between w-full px-4 py-3">
                Role
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("role")} />
              </button>

              {openMenu === "role" && (
                <div className="pl-6">
                  {hasPermission(["role.index"]) && (
                    <Link href="/dairy_fresh/home/role" className="block py-2">All Roles</Link>
                  )}
                  {hasPermission(["role.store"]) && (
                    <Link href="/dairy_fresh/home/role/new" className="block py-2">Add Role</Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PERMISSION */}
          {hasPermission(["permission.index", "permission.store"]) && (
            <div>
              <button onClick={() => toggleMenu("permission")} className="flex justify-between w-full px-4 py-3">
                Permission
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("permission")} />
              </button>

              {openMenu === "permission" && (
                <div className="pl-6">
                  {hasPermission(["permission.index"]) && (
                    <Link href="/dairy_fresh/home/permission" className="block py-2">
                      All Permissions
                    </Link>
                  )}
                  {hasPermission(["permission.store"]) && (
                    <Link href="/dairy_fresh/home/permission/new" className="block py-2">
                      Add Permission
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* USER */}
          {hasPermission(["user.index", "user.store"]) && (
            <div>
              <button onClick={() => toggleMenu("user")} className="flex justify-between w-full px-4 py-3">
                User
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("user")} />
              </button>

              {openMenu === "user" && (
                <div className="pl-6">
                  {hasPermission(["user.index"]) && (
                    <Link href="/dairy_fresh/home/user" className="block py-2">All Users</Link>
                  )}
                  {hasPermission(["user.store"]) && (
                    <Link href="/dairy_fresh/home/user/new" className="block py-2">Add User</Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PRODUCT */}
          {hasPermission(["product_category.index", "product.index", "supplier.index"]) && (
            <div>
              <button onClick={() => toggleMenu("product")} className="flex justify-between w-full px-4 py-3">
                Product
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("product")} />
              </button>

              {openMenu === "product" && (
                <div className="pl-6">
                  {hasPermission(["product_category.index"]) && (
                    <Link href="/dairy_fresh/home/product/category" className="block py-2">
                      Product Category
                    </Link>
                  )}
                  {hasPermission(["product.index"]) && (
                    <Link href="/dairy_fresh/home/product" className="block py-2">
                      Product
                    </Link>
                  )}
                  {hasPermission(["supplier.index"]) && (
                    <Link href="/dairy_fresh/home/product/supplier" className="block py-2">
                      Supplier
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BRANCH */}
          {hasPermission(["branch.index", "branch.store.index"]) && (
            <div>
              <button onClick={() => toggleMenu("branch")} className="flex justify-between w-full px-4 py-3">
                Branch
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("branch")} />
              </button>

              {openMenu === "branch" && (
                <div className="pl-6">
                  <Link href="/dairy_fresh/home/branch" className="block py-2">Branch Info</Link>
                  <Link href="/dairy_fresh/home/branch/store" className="block py-2">Store</Link>
                </div>
              )}
            </div>
          )}

          {/* CAMPAIGN */}
          {hasPermission(["campaign.index"]) && (
            <div>
              <button onClick={() => toggleMenu("campaign")} className="flex justify-between w-full px-4 py-3">
                Campaign
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("campaign")} />
              </button>

              {openMenu === "campaign" && (
                <div className="pl-6">
                  <Link href="/dairy_fresh/home/campaign" className="block py-2">
                    Campaign Info
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* PAYMENT */}
          {hasPermission(["payment_type.index"]) && (
            <div>
              <button onClick={() => toggleMenu("payment")} className="flex justify-between w-full px-4 py-3">
                Payment Info
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("payment")} />
              </button>

              {openMenu === "payment" && (
                <>
                <div className="pl-6">
                  <Link href="/dairy_fresh/home/payment_info" className="block py-2">
                    Type
                  </Link>
                </div>
                <div className="pl-6">
                  <Link href="/dairy_fresh/home/payment_info/type" className="block py-2">
                    Type Info
                  </Link>
                </div>
                </>
              )}
            </div>
          )}

          {/* SALE */}
          {hasPermission(["order.index", "order.store", "order.customers.info"]) && (
            <div>
              <button onClick={() => toggleMenu("order")} className="flex justify-between w-full px-4 py-3">
                Sale
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("order")} />
              </button>

              {openMenu === "order" && (
                <div className="pl-6">
                  <Link href="/dairy_fresh/home/order" className="block py-2">Sale Info</Link>
                  <Link href="/dairy_fresh/home/order/product" className="block py-2">Product Sale Info</Link>
                  <Link href="/dairy_fresh/home/customer" className="block py-2">Customer</Link>
                  <Link href="/dairy_fresh/home/order/new" className="block py-2">Sale Create</Link>
                </div>
              )}
            </div>
          )}

          {/* REPORT */}
          {hasPermission(["order.due.report"]) && (
            <div>
              <button onClick={() => toggleMenu("report")} className="flex justify-between w-full px-4 py-3">
                Report
                <FontAwesomeIcon icon={faChevronDown} className={arrowClass("report")} />
              </button>

              {openMenu === "report" && (
                <div className="pl-6">
                  <Link href="/dairy_fresh/home/report/due" className="block py-2">
                    Due Report
                  </Link>
                  <Link href="/dairy_fresh/home/report/discount" className="block py-2">
                    Discount Report
                  </Link>

                  <button
                    onClick={() => toggleSubMenu("customer")}
                    className="flex justify-between w-full px-4 py-3"
                  >
                    Customer
                    <FontAwesomeIcon icon={faChevronDown} className={arrowClassSub("customer")} />
                  </button>

                  {openSubMenu === "customer" && (
                    <>
                    <div className="pl-6">
                      <Link href="/dairy_fresh/home/report/customer/transaction" className="block py-2">
                        Transaction Report
                      </Link>
                    </div>
                    <div className="pl-6">
                      <Link href="/dairy_fresh/home/report/customer/due" className="block py-2">
                        Due Report
                      </Link>
                    </div>
                    <div className="pl-6">
                      <Link href="/dairy_fresh/home/report/customer/discount" className="block py-2">
                        Discount Report
                      </Link>
                    </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;