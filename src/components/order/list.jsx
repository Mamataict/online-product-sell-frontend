"use client";

import {
  faCross,
  faDumpster,
  faEdit,
  faEye,
  faFileEdit,
  faList,
  faPrint,
  faRecycle,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Receipt from "./Reciept";
import DetailsModal from "./DetailsModal";
import PermissionGuard from "../dashboard/PermissionGuard";

export default function List({
  orders,
  currentPage,
  setCurrentPage,
  lastPage,
  handlePageChange,

  fetchOrders,
  order,
  cancelOrder,
  deleteOrder,
  handlePrint,
  handlePrintInvoiceReport,
  total_paid,
  total_due,
  serial,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table-fixed ">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200 w-5">SL.</th>
              <th className="p-4 border-b border-gray-200 w-20">Order ID</th>

              <th className="p-4 border-b border-gray-200 w-10">Status</th>

              <th className="p-4 border-b border-gray-200 w-20">Customer</th>
              <th className="p-4 border-b border-gray-200 w-20">
                Customer Phone Number
              </th>
              <th className="p-4 border-b border-gray-200 w-10">Place Date</th>
              <th className="p-4 border-b border-gray-200 w-64">Order Items</th>

              <th className="p-4 border-b border-gray-200 w-7">Delivery Fee</th>
              <th className="p-4 border-b border-gray-200 w-20">Paid</th>
              <th className="p-4 border-b border-gray-200 w-20">Due</th>

              {/* <th className="p-4 border-b border-gray-200 w-32">Handler</th> */}
              <th className="p-4 border-b border-gray-200 w-32">Remark</th>

              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">
                  {serial + index}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.order_info_id}
                </td>

                <td
                  className={`p-4 border-b border-gray-200 ${
                    order.status == 1
                      ? "text-amber-500"
                      : order.status == 2
                        ? "text-green-500"
                        : order.status == 4
                          ? "text-red-500"
                          : "text-gray-500"
                  }`}
                >
                  {order.status_text}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.customer?.name}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.customer?.phone}
                </td>

                <td className="p-4 border-b border-gray-200">
                  {order.place_date?.toString()}
                </td>

                <td className="p-4 border-b border-gray-200 w-64">
                  {order?.orders?.map((item) => (
                    <div key={item.id} className="break-words">
                      {item.product?.name} - {item.product?.unit} - (
                      {Number(item.qty)}) -{" "}
                      {Number(item.qty) * Number(item.price)} BDT
                    </div>
                  ))}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {Number(order.delivery_fee)}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.total_paid}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.due_amount}
                </td>
                {/* 
                <td className="p-4 border-b border-gray-200">
                  {order.handler && (
                    <>
                      {order.handler?.name} ({order.handler?.username})
                    </>
                  )}
                </td> */}

                <td className="p-4 border-b border-gray-200">{order.remark}</td>

                <td className="p-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    {/* <Link
                      href={`/dashboard/order/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Details
                    </Link> */}
                    {/* | */}
                    {order.status === "completed" && (
                      <>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePrint(order.id)}
                            className="text-blue-600 cursor-pointer flex"
                            title="Print Order"
                          >
                            SLIP
                          </button>
                          |
                          {/* {hasPermission(["order.cancel"]) && (
                            <>
                              <span className="text-gray-400">|</span>
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="text-red-600 cursor-pointer"
                                title="Cancel Order"
                              >
                                <FontAwesomeIcon icon={faRemove} />
                              </button>
                            </>
                          )} */}
                        </div>
                        |
                      </>
                    )}
                    <button
                      onClick={() => handlePrintInvoiceReport(order.id)}
                      className="text-blue-600 cursor-pointer"
                      title="Print Invoice Report"
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </button>
                    |
                    <PermissionGuard permission={"order.update"}>
                      <>
                        <Link
                          href={`/dashboard/order/${order.id}`}
                          className=" text-blue-600 cursor-pointer hover:underline"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                      </>
                    </PermissionGuard>
                    <PermissionGuard permission={"order.destroy"}>
                      <>
                        <span className="text-gray-400">|</span>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-red-600 cursor-pointer"
                          title="Remove Order"
                        >
                          <FontAwesomeIcon icon={faRemove} />
                        </button>
                      </>
                    </PermissionGuard>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-b border-gray-200">
              <td className="p-4 border-b border-gray-200" colSpan={8}>
                Total
              </td>

              <td className="p-4 border-b border-gray-200">{total_paid}</td>
              <td className="p-4 border-b border-gray-200">{total_due}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-evenly items-center mt-4">
        <a
          href="#"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className="disabled:opacity-50 text-blue-950 underline"
        >
          Previous
        </a>

        <span>
          Page{" "}
          <input
            type="text"
            onChange={(e) => {
              e.preventDefault();
              setCurrentPage(e.target.value);
            }}
            value={currentPage}
            className="p-1 text-center w-8 border-2 border-gray-400 rounded-xl"
          />{" "}
          of {lastPage}
        </span>

        <a
          href="#"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(currentPage + 1);
          }}
          disabled={currentPage === lastPage}
          className="disabled:opacity-50 text-blue-950 underline"
        >
          Next
        </a>
      </div>
    </>
  );
}
