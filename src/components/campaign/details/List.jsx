"use client";

import { faEdit, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function List({
  campaignDetails,
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
              <th className="p-4 border-b border-gray-200">Campaign Name</th>
              <th className="p-4 border-b border-gray-200">Discount type</th>
              <th className="p-4 border-b border-gray-200">Discount</th>
              {/* <th className="p-4 border-b border-gray-200">Product Prices</th> */}
              <th className="p-4 border-b border-gray-200">Branches</th>
              <th className="p-4 border-b border-gray-200">Effect Date</th>
              <th className="p-4 border-b border-gray-200">Status</th>
              <th className="p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaignDetails.map((details) => (
              <tr key={details.id} className="border-b border-gray-200">
                <td className="p-4 border-b border-gray-200">
                  {details?.campaign?.name}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {details?.discount_type}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {details?.discount}
                </td>
                {/* <td className="p-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    <div>{details?.product_prices?.length}</div>
                    <Link
                      className="text-blue-600 hover:underline "
                      href={`/dairy_fresh/home/campaign/${details?.campaign?.id}/details/${details?.campaign?.id}/branch`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </div>
                </td> */}
                <td className="p-4 border-b border-gray-200 ">
                  <div className="flex gap-2">
                    <div>{details?.branches?.length}</div>
                    <Link
                      className="text-blue-600 hover:underline "
                      href={`/dairy_fresh/home/campaign/${details?.campaign?.id}/details/${details?.id}/branch`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200">
                  {details?.effect_date &&
                    new Date(details.effect_date).toLocaleDateString()}
                </td>

                <td className="p-4 border-b border-gray-200">
                  <a
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleActivation(details.id);
                    }}
                    className={`cursor-pointer hover:underline ${
                      details?.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {details?.is_active ? "Active" : "Inactive"}
                  </a>
                </td>
                <td className=" p-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    <Link
                      href={`/dairy_fresh/home/campaign/details/edit/${details.id}`}
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
                        handleDelete(details.id);
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
