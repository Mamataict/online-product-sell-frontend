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
  fetchOrder,
  fetchOrders,
  order,
  cancelOrder,
  deleteOrder,
  handlePrint,
  handlePrintInvoiceReport,
  total_income,
  total_delivery_fee,
  total_subtotal,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200">Order ID</th>

              <th className="p-4 border-b border-gray-200">Status</th>

              <th className="p-4 border-b border-gray-200">Customer</th>
              <th className="p-4 border-b border-gray-200">
                Customer Phone Number
              </th>
              <th className="p-4 border-b border-gray-200">Place Date</th>
              <th className="p-4 border-b border-gray-200">Orders</th>

              <th className="p-4 border-b border-gray-200">Amount</th>

              <th className="p-4 border-b border-gray-200">Payment Status</th>

              <th className="p-4 border-b border-gray-200">Handler</th>
              <th className="p-4 border-b border-gray-200">Remark</th>

              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200">
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

                <td className="p-4 border-b border-gray-200">
                  {order?.orders?.map((item) => (
                    <div key={item.id}>
                      {item.product?.name} - ({Number(item.qty)}) - {Number(item.qty) * Number(item.price)} BDT
                    </div>
                  ))}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {order.grand_total}
                </td>

                <td
                  className={`p-4 border-b border-gray-200 ${
                    order.payment_status == 1
                      ? "text-amber-500"
                      : "text-green-500"
                  }`}
                >
                  {order.payment_status_text}
                </td>

                <td className="p-4 border-b border-gray-200">
                  {order.handler && (
                    <>
                      {order.handler?.name} ({order.handler?.username})
                    </>
                  )}
                </td>

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
                          <button
                            onClick={() => handlePrintInvoiceReport(order.id)}
                            className="text-blue-600 cursor-pointer"
                            title="Print Invoice Report"
                          >
                            <FontAwesomeIcon icon={faPrint} />
                          </button>
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
                    <PermissionGuard permission={"order.update"}>
                      <>
                        <Link
                          href={`/dashboard/order/new?order_id=${order.id}&&order_type=edit`}
                          className=" text-blue-600 cursor-pointer hover:underline"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        |
                      </>
                    </PermissionGuard>

                    <a
                      href="#"
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        fetchOrder(order.id);
                        setIsModalOpen(true);
                      }}
                      className=" text-blue-600 cursor-pointer hover:underline"
                    >
                      <FontAwesomeIcon icon={faList} />
                    </a>

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
              <td className="p-4 border-b border-gray-200" colSpan={5}>
                Total
              </td>
              <td className="p-4 border-b border-gray-200">
                {total_subtotal?.toFixed(2)}
              </td>
              <td className="p-4 border-b border-gray-200">
                {total_delivery_fee?.toFixed(2)}
              </td>
              <td className="p-4 border-b border-gray-200">
                {total_income?.toFixed(2)}
              </td>
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

      {isModalOpen && (
        <DetailsModal
          key={order?.id}
          setIsModalOpen={setIsModalOpen}
          order={order}
          fetchOrder={fetchOrder}
          fetchOrders={fetchOrders}
        />
      )}
    </>
  );
}
