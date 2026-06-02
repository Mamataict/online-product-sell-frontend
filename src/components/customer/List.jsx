"use client";

import Image from "next/image";
import Link from "next/link";

export default function List({
  customers,
  currentPage,
  setCurrentPage,
  lastPage,
  handlePageChange,
  handleDelete,
  handleActivation,
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200">Name</th>
              <th className="p-4 border-b border-gray-200">Email</th>
              <th className="p-4 border-b border-gray-200">Phone</th>
              <th className="p-4 border-b border-gray-200">Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-200">
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">{customer.address}</td>
              </tr>
            ))}
          </tbody>
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
