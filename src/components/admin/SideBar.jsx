"use client";

import Image from "next/image";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const SideBar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const { user_data, hasPermission, hasAnyPermission, logout, loading } = useAuth();

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (menuName) => {
    setOpenSubMenu(openSubMenu === menuName ? null : menuName);
  };

  if (loading) return null;

  const arrowClass = (menu) =>
    `transition-transform duration-300 ${
      openMenu === menu ? "rotate-180" : ""
    }`;
  const arrowClassSub = (menu) =>
    `transition-transform duration-300 ${
      openSubMenu === menu ? "rotate-180" : ""
    }`;

  return (
    <aside className="hidden lg:flex w-[280px] justify-center text-gray-700 h-full">
      <div className="w-[90%] shadow-xl text-xl rounded-[2rem] my-[70px] min-h-[490px] py-2 bg-white overflow-hidden">
       
        <div className="h-[100px] flex justify-center items-center">
          <Link href="/">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/icons/dairy-fresh.png`}
              alt="Logo"
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>

        <Link
          href="/dashboard"
          className="block px-4 py-3 admin-sidebar-menu rounded mb-2"
        >
          Dashboard
        </Link>

        {hasAnyPermission(["role.index", "role.store"]) && (
          <div>
            <button
              onClick={() => toggleMenu("roles")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Role
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("roles")}
              />
            </button>

            {openMenu === "roles" && (
              <div className="pl-6 space-y-1 mt-2">
                {hasPermission("role.index") && (
                  <Link
                    href="/dashboard/role"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    All Roles
                  </Link>
                )}
                {hasPermission("role.store") && (
                  <Link
                    href="/dashboard/role/new"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    Add Role
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {hasAnyPermission(["permission.index", "permission.store"]) && (
          <div>
            <button
              onClick={() => toggleMenu("permission")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Permission
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("permission")}
              />
            </button>

            {openMenu === "permission" && (
              <div className="pl-6 space-y-1 mt-2">
                {hasPermission("permission.index") && (
                  <Link
                    href="/dashboard/permission"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    All Permissions
                  </Link>
                )}
                {hasPermission("permission.store") && (
                  <Link
                    href="/dashboard/permission/new"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    Add Permission
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {hasAnyPermission(["user.index", "user.store"]) && (
          <div>
            <button
              onClick={() => toggleMenu("user")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              User
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("user")}
              />
            </button>

            {openMenu === "user" && (
              <div className="pl-6 space-y-1 mt-2">
                {hasPermission("user.index") && (
                  <Link
                    href="/dashboard/user"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    All User
                  </Link>
                )}
                {hasPermission("user.store") && (
                  <Link
                    href="/dashboard/user/new"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    Add User
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {hasAnyPermission([
          "product_category.index",
          "product.index",
          "supplier.index",
        ]) && (
          <div>
            <button
              onClick={() => toggleMenu("product")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Product
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("product")}
              />
            </button>

            {openMenu === "product" && (
              <div className="pl-6 space-y-1 mt-2">
                {hasPermission("product_category.index") && (
                  <Link
                    href="/dashboard/product/category"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    Product Category
                  </Link>
                )}
                {hasPermission("product.index") && (
                  <Link
                    href="/dashboard/product"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    Product
                  </Link>
                )}
                {hasPermission("supplier.index") && (
                  <Link
                    href="/dashboard/product/supplier"
                    className="block px-2 py-2 admin-sidebar-menu rounded"
                  >
                    Supplier
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {hasAnyPermission(["branch.index", "branch.store.index"]) && (
          <div>
            <button
              onClick={() => toggleMenu("branch")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Branch
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("branch")}
              />
            </button>

            {openMenu === "branch" && (
              <div className="pl-6 space-y-1 mt-2">
                <Link
                  href="/dashboard/branch"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Branch Info
                </Link>
                <Link
                  href="/dashboard/branch/store"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Store
                </Link>
              </div>
            )}
          </div>
        )}

        {hasAnyPermission(["campaign.index"]) && (
          <div>
            <button
              onClick={() => toggleMenu("campaign")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Campaign
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("campaign")}
              />
            </button>

            {openMenu === "campaign" && (
              <div className="pl-6 space-y-1 mt-2">
                <Link
                  href="/dashboard/campaign"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Campaign Info
                </Link>
              </div>
            )}
          </div>
        )}

        {hasAnyPermission(["payment_type.index"]) && (
          <div>
            <button
              onClick={() => toggleMenu("payment_info")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Payment Info
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("payment_info")}
              />
            </button>

            {openMenu === "payment_info" && (
              <div className="pl-6 space-y-1 mt-2">
                <Link
                  href="/dashboard/payment_info/type"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Type
                </Link>
                <Link
                  href="/dashboard/payment_info"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Type Info
                </Link>
              </div>
            )}
          </div>
        )}

        {hasAnyPermission(["order.index", "order.store"]) && (
          <div>
            <button
              onClick={() => toggleMenu("order")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Sale
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("order")}
              />
            </button>

            {openMenu === "order" && (
              <div className="pl-6 space-y-1 mt-2">
                <Link
                  href="/dashboard/order"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Sale Info
                </Link>
                {/* <Link
                  href="/dashboard/order/product"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Product Sale Info
                </Link>
                <Link
                  href="/dashboard/customer"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Customer
                </Link>
                <Link
                  href="/dashboard/order/new"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Sale Create
                </Link> */}
                
              </div>
            )}
          </div>
        )}
        {hasAnyPermission(["delivery_fee.index", "delivery_fee.store"]) && (
          <div>
            <button
              onClick={() => toggleMenu("delivery_fee")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Delivery Fee
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("delivery_fee")}
              />
            </button>

            {openMenu === "delivery_fee" && (
              <div className="pl-6 space-y-1 mt-2">
                <Link
                  href="/dashboard/delivery_fee"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Delivery Fee
                </Link>
                {/* <Link
                  href="/dashboard/order/product"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Product Sale Info
                </Link>
                <Link
                  href="/dashboard/customer"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Customer
                </Link>
                <Link
                  href="/dashboard/order/new"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Sale Create
                </Link> */}
                
              </div>
            )}
          </div>
        )}

        {hasAnyPermission(["order.due.report"]) && (
          <div>
            <button
              onClick={() => toggleMenu("order_due_report")}
              className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
            >
              Report
              <FontAwesomeIcon
                icon={faChevronDown}
                className={arrowClass("order_due_report")}
              />
            </button>

            {openMenu === "order_due_report" && (
              <div className="pl-6 space-y-1 mt-2">
                <Link
                  href="/dashboard/report/due"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Due Report
                </Link>

                <Link
                  href="/dashboard/report/discount"
                  className="block px-2 py-2 admin-sidebar-menu rounded"
                >
                  Discount Report
                </Link>

                <div>
                  <button
                    onClick={() => toggleSubMenu("customer_due_report")}
                    className="flex justify-between w-full px-4 py-3 admin-sidebar-menu rounded"
                  >
                    Customer
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={arrowClassSub("customer_due_report")}
                    />
                  </button>

                  {openSubMenu === "customer_due_report" && (
                    <div className="pl-6 space-y-1 mt-2">
                      <Link
                        href="/dashboard/report/customer/transaction"
                        className="block px-2 py-2 admin-sidebar-menu rounded"
                      >
                        Transaction Report
                      </Link>
                      <Link
                        href="/dashboard/report/customer/due"
                        className="block px-2 py-2 admin-sidebar-menu rounded"
                      >
                        Due Report
                      </Link>
                      <Link
                        href="/dashboard/report/customer/discount"
                        className="block px-2 py-2 admin-sidebar-menu rounded"
                      >
                        Discount Report
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
