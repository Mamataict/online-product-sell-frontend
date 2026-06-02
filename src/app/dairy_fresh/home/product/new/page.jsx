"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Select from "react-select";
import CheckBox from "@/components/features_cus/CheckBox";

export default function CreateProduct() {
  const [name, setName] = useState("");

  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState("");

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [category_id, setCategoryId] = useState("");
  const [is_active, setIsActive] = useState(0);
  const [product_create_elements, setProductCreateElements] = useState([]);
  const [error, setError] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [success, setSuccess] = useState(false);
  const token = Cookies.get("auth_token");

  const [priceGroups, setPriceGroups] = useState([
    {
      price: "",
      effect_date: "",
      is_active: false,
    },
  ]);

  useEffect(() => {
    const fetchProductCreate = async () => {
      const res = await api.get(`/api/product/create`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProductCreateElements(res.data.data);
    };
    fetchProductCreate();
  }, [success]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setImage(null);
      setPreviewUrl(null);
    }
  };

  const handleAddPriceGroup = () => {
    setPriceGroups([
      ...priceGroups,
      {
        price: "",
        effect_date: "",
        is_active: false,
      },
    ]);
  };

  const handleRemovePriceGroup = (index) => {
    if (priceGroups.length === 1) return;
    setPriceGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePricingActivation = (index) => {
    const updated = [...priceGroups];
    updated[index].is_active = !updated[index].is_active;
    setPriceGroups(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("unit", unit);
      formData.append("stock", stock);
      formData.append("product_category_id", category_id);
      formData.append("is_active", is_active);
      if (image) formData.append("image", image);

      priceGroups.forEach((group, index) => {
        formData.append(`prices[${index}][price]`, group.price);
        formData.append(`prices[${index}][effect_date]`, group.effect_date);
        formData.append(`prices[${index}][is_active]`, group.is_active);
    
      });

      const res = await api.post("/api/product", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message);
      console.log("Product created:", res.data);
      setButtonPressed(false);
      setSuccess(!success);

    } catch (err) {
      setError(err?.response?.data);
      setButtonPressed(false);
    }
  };

  const productCategoryOption =
    product_create_elements?.product_categories?.map((category) => ({
      value: category.id,
      label: `${category.name}`,
    })) || [];


  return (
    <>
      {error?.message && (
        <div className="w-full pb-4 text-red-500 text-lg font-medium">
          * {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rounded-md shadow-md p-4 bg-white w-full max-w-[900px]">
          <div className="space-y-6 grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Product Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              {error?.errors?.name && (
                <p className="text-red-500 text-sm pt-1">
                  * {error.errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Enter Product Unit"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              {error?.errors?.unit && (
                <p className="text-red-500 text-sm pt-1">
                  * {error.errors.unit}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Stock
              </label>
              <input
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter Product Stock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              {error?.errors?.stock && (
                <p className="text-red-500 text-sm pt-1">
                  * {error.errors.stock}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Image
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {error?.errors?.image && (
                <p className="text-red-500 text-sm pt-1">
                  * {error.errors.image}
                </p>
              )}
              {previewUrl && (
                <div className="mt-4">
                  <Image
                    src={previewUrl}
                    width={200}
                    height={200}
                    alt="Preview"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Category
              </label>
              <Select
                options={productCategoryOption}
                value={
                  productCategoryOption.find(
                    (opt) => opt.value === category_id
                  ) || ""
                }
                onChange={(selected) => setCategoryId(selected?.value || "")}
                placeholder="Select Product Category"
                isClearable
              />
              {error?.errors?.product_category_id && (
                <p className="text-red-500 text-sm pt-1">
                  * {error.errors.product_category_id}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Status
              </label>
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <CheckBox
                  checked={is_active}
                  onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
                />
                <span>{is_active ? "Active" : "Inactive"}</span>
              </label>
              {error?.errors?.is_active && (
                <p className="text-red-500 text-sm pt-1">
                  * {error.errors.is_active}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-md shadow-md p-4 mt-3 bg-white w-full max-w-[900px]">
          <div className="flex justify-between items-center pb-3">
            <h2 className="font-semibold text-lg">Product Pricing</h2>
            <button
              type="button"
              onClick={handleAddPriceGroup}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full"
            >
              + Add Price
            </button>
          </div>

          {priceGroups.map((group, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-md mb-3 relative"
            >
              <CheckBox
                checked={group.is_active}
                onChange={(e) => handlePricingActivation(index)
                }
              />
              <button
                type="button"
                onClick={() => handleRemovePriceGroup(index)}
                disabled={priceGroups.length === 1}
                className={`absolute top-2 right-2 text-white text-sm font-semibold px-3 py-1 rounded ${
                  priceGroups.length === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-700"
                }`}
              >
                Remove
              </button>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {/* Price */}
                
                <div>
                  <label>Price (BDT)</label>
                  <input
                    type="number"
                    value={group.price}
                    onChange={(e) => {
                      const updated = [...priceGroups];
                      updated[index].price = e.target.value;
                      setPriceGroups(updated);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                  {error?.errors?.[`prices.${index}.price`] && (
                    <p className="text-red-500 text-sm pt-1">
                      * {error.errors[`prices.${index}.price`]}
                    </p>
                  )}
                </div>

              </div>

              <div className="mt-3">
                <label>Effective Date</label>
                <input
                  type="date"
                  value={group.effect_date}
                  onChange={(e) => {
                    const updated = [...priceGroups];
                    updated[index].effect_date = e.target.value;
                    setPriceGroups(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                {error?.errors?.[`prices.${index}.effect_date`] && (
                  <p className="text-red-500 text-sm pt-1">
                    * {error.errors[`prices.${index}.effect_date`]}
                  </p>
                )}
              </div>

          
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`w-full mt-4 max-w-sm bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-md ${
            buttonPressed ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={buttonPressed}
        >
          Create
        </button>
      </form>
    </>
  );
}
