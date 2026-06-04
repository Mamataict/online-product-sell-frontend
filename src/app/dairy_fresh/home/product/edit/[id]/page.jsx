"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Select from "react-select";
import CheckBox from "@/components/features_cus/CheckBox";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [instruction, setInstruction] = useState("");
  const [view_order, setViewOrder] = useState("");
  const [stock, setStock] = useState(0);
  const [available_stock, setAvailableStock] = useState(0);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category_id, setCategoryId] = useState("");
  const [is_active, setIsActive] = useState(0);
  const [product_categories, setProductCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [priceGroups, setPriceGroups] = useState([]);
  const [deletePriceIds, setDeletePriceIds] = useState([]);
  const token = Cookies.get("auth_token");
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const productRes = await api.get(`/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const p = productRes.data.data;

        setName(p.product.name ?? "");
        setUnit(p.product.unit ?? "");
        setInstruction(p.product.instruction ?? "");
        setStock(p.product.stock ?? 0);
        setAvailableStock(p.product.available_qty ?? 0);
        setViewOrder(p.product.view_order ?? "");
        setCategoryId(
          p.product.product_category_id ?? p.product.category?.id ?? "",
        );

        setIsActive(p.product.is_active ? 1 : 0);
        setPreviewUrl(p.product.image_url ?? "");
        setProductCategories(p.product_categories || []);

        const formattedPrices =
          (p.product.prices || []).map((pr) => ({
            id: pr.id ?? null,
            price: pr.price ?? "",
            effect_date: pr.effect_date ?? "",
            is_active: pr.is_active || false,
          })) || [];

        setPriceGroups(
          formattedPrices.length
            ? formattedPrices
            : [
                {
                  price_id: "",
                  price: "",
                  effect_date: "",
                  is_active: false,
                },
              ],
        );
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(err?.response?.data || "Failed to load product");
      }
    };

    if (id) loadData();
  }, [id, success]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAddPriceGroup = () => {
    setPriceGroups([
      ...priceGroups,
      {
        price_id: "",
        price: "",
        effect_date: "",
        is_active: false,
      },
    ]);
  };

  const handleRemovePriceGroup = (i) => {
    const group = priceGroups[i];

    if (group.id) {
      setDeletePriceIds((prev) => [...prev, group.id]);
    }

    if (priceGroups.length === 1) return;
    setPriceGroups(priceGroups.filter((_, index) => index !== i));
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
      formData.append("instruction", instruction);
      formData.append("view_order", view_order);
      formData.append("stock", stock);
      if (category_id !== "")
        formData.append("product_category_id", category_id);

      formData.append("is_active", is_active);

      if (image) formData.append("image", image);

      formData.append("_method", "PUT");

      priceGroups.forEach((group, index) => {
        formData.append(`prices[${index}][price_id]`, group.id ?? "");
        formData.append(`prices[${index}][price]`, group.price ?? "");
        formData.append(`prices[${index}][is_active]`, group.is_active);

        formData.append(
          `prices[${index}][effect_date]`,
          group.effect_date ?? "",
        );
      });

      deletePriceIds.forEach((delId, index) => {
        formData.append(`delete_ids[${index}]`, delId);
      });

      const res = await api.post(`/api/product/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data?.message || "Product updated successfully!");
      setButtonPressed(false);
      setSuccess((s) => !s);
    } catch (err) {
      console.error("Update error:", err);
      setError(err?.response?.data || "Update failed");
      setButtonPressed(false);
    }
  };

  const productCategoryOption =
    product_categories?.map((c) => ({ value: c.id, label: c.name })) || [];

  return (
    <>
      {error?.message ? (
        <p className="text-red-500 text-lg pb-3">* {error.message}</p>
      ) : typeof error === "string" && error ? (
        <p className="text-red-500 text-lg pb-3">* {error}</p>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="rounded-md shadow-md p-4 bg-white max-w-[900px]">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-lg">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-lg">Unit</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-lg">Stock</label>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-lg">Available Stock</label>
              <div className="text-md mb-1 border-2 border-gray-300 rounded px-3 py-2">
                {available_stock}
              </div>
            </div>



            <div>
              <label className="block mb-1 text-lg">Image</label>
              <input type="file" onChange={handleFileChange} />
              {previewUrl && (
                <div className="mt-2">
                  <Image
                    src={previewUrl}
                    width={200}
                    height={200}
                    alt="Preview"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 text-lg">Category</label>
              <Select
                options={productCategoryOption}
                value={
                  productCategoryOption.find((c) => c.value === category_id) ||
                  null
                }
                onChange={(v) => setCategoryId(v?.value ?? "")}
                placeholder="Select Product Category"
                isClearable
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                Instruction
              </label>
              <textarea
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Enter Product Instruction"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              >
              </textarea>
              {error?.errors?.instruction && (
                <p className="text-red-500 text-sm pt-1">
                  * {error.errors.instruction}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">
                View Order
              </label>
              <input
                type="text"
                value={view_order}
                onChange={(e) => setViewOrder(e.target.value)}
                placeholder="Enter Product View Order"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
             
              {error?.errors?.view_order && (
                <p className="text-red-500 text-sm pt-1">
                  * {error.errors.view_order}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-lg">Status</label>
              <div className="flex items-center">
                <CheckBox
                  checked={is_active === 1}
                  onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
                />
                <span className="ml-2">
                  {is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md shadow-md p-4 mt-4 bg-white max-w-[900px]">
          <div className="flex justify-between items-center pb-3">
            <h2 className="font-semibold text-lg">Product Pricing</h2>

            <button
              type="button"
              onClick={handleAddPriceGroup}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              + Add Price
            </button>
          </div>

          {priceGroups.map((group, index) => (
            <div key={index} className="border rounded p-4 mb-3 relative">
              <CheckBox
                checked={group.is_active}
                onChange={(e) => handlePricingActivation(index)}
              />
              <button
                type="button"
                onClick={() => handleRemovePriceGroup(index)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                disabled={priceGroups.length === 1}
              >
                Remove
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <div>
                  <label>Price (BDT)</label>
                  <input
                    type="number"
                    value={group.price || ""}
                    onChange={(e) => {
                      const updated = [...priceGroups];
                      updated[index].price = e.target.value;
                      setPriceGroups(updated);
                    }}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label>Effective Date</label>
                  <input
                    type="date"
                    value={group.effect_date || ""}
                    onChange={(e) => {
                      const updated = [...priceGroups];
                      updated[index].effect_date = e.target.value;
                      setPriceGroups(updated);
                    }}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`w-full mt-4 max-w-sm bg-green-600 text-white py-3 rounded-md text-lg cursor-pointer ${
            buttonPressed ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={buttonPressed}
        >
          Update Product
        </button>
      </form>
    </>
  );
}
