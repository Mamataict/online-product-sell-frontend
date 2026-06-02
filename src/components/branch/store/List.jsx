"use client";

import Link from "next/link";

export default function List({
  branchStores,
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
              <th className="p-4 border-b border-gray-200">Store Code</th>
              <th className="p-4 border-b border-gray-200">Branch</th>
              <th className="p-4 border-b border-gray-200">Status</th>
              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branchStores.map((branch) => (
              <tr key={branch.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">{branch?.name}</td>
                <td className="p-4 border-b border-gray-200">
                  {branch?.store_code}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {branch?.branch_info?.name}
                </td>

                <td className="p-4 border-b border-gray-200">
                  <a
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleActivation(branch.id);
                    }}
                    className={`cursor-pointer hover:underline ${
                      branch?.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {branch?.is_active ? "Active" : "Inactive"}
                  </a>
                </td>
                <td className=" p-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    <Link
                      href={`/dairy_fresh/home/branch/store/edit/${branch.id}`}
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
                        handleDelete(branch.id);
                      }}
                      className=" text-red-600 cursor-pointer hover:underline"
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
