"use client";

import Select from "react-select";
import CheckBox from "@/components/features_cus/CheckBox";

export default function Pricing({
unit, setUnit,
price, setPrice,
discount_type, setDiscountType,
discount, setDiscount,
effect_date, setEffectDate,
branch, setBranch,
is_price_active, setIsPriceActive,
error, branchOptions,
discountTypeOptions,
}) {
  return (
    <>
    <div className="space-y-6 grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="unit"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Unit
              </label>

              <input
                id="unit"
                type="text"
                name="unit"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter Product Unit"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                }}
              />

              {error?.errors?.unit && (
                <div className="w-full text-red-400 text-md pt-1">
                  * {error?.errors?.unit}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Price
              </label>

              <input
                id="price"
                type="text"
                name="price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter Product Price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />

              {error?.errors?.price && (
                <div className="w-full text-red-400 text-md pt-1">
                  * {error?.errors?.price}
                </div>
              )}
            </div>


            <div>
              <label
                htmlFor="discount_type"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Discount Type
              </label>

              <Select
                options={discountTypeOptions}
                value={
                  discountTypeOptions.find(
                    (opt) => opt.value === discount_type
                  ) || ""
                }
                onChange={(selected) => setDiscountType(selected?.value || "")}
                placeholder="Select Discount Type"
                className="w-full"
                classNamePrefix="select"
              />

              {error?.errors?.discount_type && (
                <div className="w-full text-red-400 text-md pt-1">
                  * {error?.errors?.discount_type}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="discount"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Discount
              </label>

              <input
                id="discount"
                type="text"
                name="discount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter Product Discount"
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);
                }}
              />

              {error?.errors?.discount && (
                <div className="w-full text-red-400 text-md pt-1">
                  * {error?.errors?.discount}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="effect_date"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Effect Date
              </label>

              <input
                id="effect_date"
                type="text"
                name="effect_date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter Effect Date"
                value={effect_date}
                onChange={(e) => {
                  setEffectDate(e.target.value);
                }}
              />

              {error?.errors?.effect_date && (
                <div className="w-full text-red-400 text-md pt-1">
                  * {error?.errors?.effect_date}
                </div>
              )}
            </div>

             <div>
              <label
                htmlFor="branch"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Branch
              </label>

              <Select
                isMulti
                options={branchOptions}
                value={branchOptions.filter((opt) =>
                  branch.includes(opt.value)
                )}
                onChange={(selected) =>
                  setBranch(selected.map((item) => Number(item.value)))
                }
                placeholder="Select Branch"
                className="w-full"
                classNamePrefix="select"
              />

              {error?.errors?.branch && (
                <div className="w-full text-red-400 text-md pt-1">
                  * {error?.errors?.branch}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="is_price_active"
                className="block font-medium text-gray-700 mb-1 text-lg"
              >
                Status
              </label>

              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <CheckBox
                  checked={is_price_active}
                  onChange={(e) => setIsPriceActive(e.target.checked ? 1 : 0)}
                />
                <span>{is_price_active ? "Active" : "Inactive"}</span>
              </label>

              {error?.errors?.is_price_active && (
                <div className="text-red-400 text-sm pt-1">
                  * {error.errors.is_price_active}
                </div>
              )}
            </div>
          </div>
    </>
  )}