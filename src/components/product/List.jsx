"use client";

import Image from "next/image";
import Link from "next/link";

export default function List({
  products,
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
              <th className="p-4 border-b border-gray-200">Image</th>
              <th className="p-4 border-b border-gray-200">Name</th>
              <th className="p-4 border-b border-gray-200">Unit</th>
              <th className="p-4 border-b border-gray-200">Pricing</th>
              <th className="p-4 border-b border-gray-200">View Order</th>
              <th className="p-4 border-b border-gray-200">Status</th>
              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200">
                <td className="p-4 ">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={50}
                    height={50}
                  />
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.unit}</td>
                <td className="p-4">{product.prices.length}</td>
                <td className="p-4">{product.view_order}</td>
                <td className="p-4 ">
                  <a
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleActivation(product.id);
                    }}
                    className={`cursor-pointer hover:underline ${
                      product.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </a>
                </td>
                <td className=" p-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/dairy_fresh/home/product/edit/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    |
                    <a
                      href="#"
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(product.id);
                      }}
                      className="text-red-600 cursor-pointer hover:underline"
                    >
                      Delete
                    </a>
                  </div>
                </td>
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
