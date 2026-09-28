"use client";

import {
  faCross,
  faDumpster,
  faEdit,
  faEye,
  faList,
  faPrint,
  faRecycle,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

import api from "@/lib/axios";
import Cookies from "js-cookie";
// import Receipt from "./Reciept";
import DetailsModal from "./DetailsModal";

export default function List({
  products,
  currentPage,
  setCurrentPage,
  lastPage,
  handlePageChange,
  setOrderId,
  order,
  cancelOrder,
  handlePrint,
  total_qty,
  total_price,
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200">SL.</th>
              <th className="p-4 border-b border-gray-200">Date</th>
              <th className="p-4 border-b border-gray-200">Invoice</th>
              <th className="p-4 border-b border-gray-200">Payment Status</th>
              <th className="p-4 border-b border-gray-200">Customer</th>
              <th className="p-4 border-b border-gray-200">Qty</th>
              <th className="p-4 border-b border-gray-200">Amount</th>
              <th className="p-4 border-b border-gray-200">Remark</th>
              {/* <th className="p-4 border-b border-gray-200">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {products.map((order, index) => (
              <tr key={order.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">
                  {index + 1}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.order_info?.place_date.toString().split("T")[0]}
                </td>

                <td className="p-4 border-b border-gray-200">
                  {order.order_info?.order_info_id}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.order_info?.payment_status_text}
                </td>
              
                <td className="p-4 border-b border-gray-200">
                  {order.order_info?.customer?.name} ({order.order_info?.customer?.phone})
                </td>
                <td className="p-4 border-b border-gray-200">
                  {Number(order.qty).toFixed(2)}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {Number(order.total_item_price).toFixed(2)}
                </td>

                 <td className="p-4 border-b border-gray-200">
                  {order.order_info?.remark}
                </td>

                {/* <td className="p-4 border-b border-gray-200">
                  {order.payment_status == "completed" && (
                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>
                  )}
                  {order.payment_status == "cancelled" && (
                    <span className="text-red-600 font-semibold">
                      Cancelled
                    </span>
                  )}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.payment_via?.name}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.seller?.name}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.customer?.name}
                </td> */}
                {/* <td className="p-4 border-b border-gray-200"> */}
                {/* <div className="flex gap-2"> */}

                {/* <a
                      href="#"
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        orderInfo(order?.id);
                        setIsModalOpen(true);
                      }}
                      className=" text-blue-600 cursor-pointer hover:underline"
                    >
                      <FontAwesomeIcon icon={faList} />
                    </a> */}
                {/* | */}
                {/* {order.payment_status === "completed" && (
                      <>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePrint(order.id)}
                            className="text-blue-600 cursor-pointer"
                            title="Print Order"
                          >
                            <FontAwesomeIcon icon={faPrint} />
                          </button> */}

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
                {/* </div>
                        |
                      </>
                    )}
                    <Link
                      href={`/dashboard/order/new?order_id=${order.id}&&order_type=edit`}
                      className=" text-blue-600 cursor-pointer hover:underline"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    |
                    <a
                      href="#"
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setOrderId(order.id);
                        setIsModalOpen(true);
                      }}
                      className=" text-blue-600 cursor-pointer hover:underline"
                    >
                      <FontAwesomeIcon icon={faList} />
                    </a>
                  </div> */}
                {/* </td> */}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="p-4 border-b border-gray-200 font-bold" colSpan={5}>Total: </td>
              <td className="p-4 border-b border-gray-200">{Number(total_qty).toFixed(2)} </td>
              <td className="p-4 border-b border-gray-200">{Number(total_price).toFixed(2)} </td>
              <td className="p-4 border-b border-gray-200"></td>
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

      {/* {isModalOpen && productsData && (
        <DetailsModal setIsModalOpen={setIsModalOpen} order={productsData} />
      )} */}
    </>
  );
}
