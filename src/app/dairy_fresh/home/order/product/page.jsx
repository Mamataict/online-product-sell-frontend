"use client";
import { useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { AuthContext } from "@/context/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faPrint } from "@fortawesome/free-solid-svg-icons";
import List from "@/components/order/sold/list";
import AsyncSelect from "react-select/async";

export default function SoldProduct() {
  const [product_categories, setProductCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const user_cus = searchParams.get("user");
  const [user, setUser] = useState(user_cus);
  const [openMore, setOpenMore] = useState(false);
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [start_date, setStartDate] = useState(
    thirtyDaysAgo.toISOString().slice(0, 10),
  );
  const [end_date, setEndDate] = useState(today.toISOString().slice(0, 10));

  const fetchSoldProducts = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/order/product?page=${page} && 
        search=${searchTerm || ''} && start_date=${start_date || ''} && end_date=${end_date || ''} && product_id=${selectedProduct || ''}
        `,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts(res.data.data.products.data);
      setProductCategories(res.data.data.product_categories);
      setCurrentPage(res.data.products.current_page);
      setLastPage(res.data.products.last_page);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user_cus) {
      setUser(null);
    }
  }, [user_cus]);

  useEffect(() => {
    fetchSoldProducts(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchSoldProducts(newPage);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await api.delete(`/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      fetchSoldProducts(currentPage);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleActivation = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await api.put(
        `/api/product/${id}/activation`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchSoldProducts(currentPage);
    } catch (err) {
      toast.error("Failed to change status");
    }
  };

  const productOptions = async (inputValue) => {
    if (!inputValue || inputValue.trim().length < 2) return [];

    try {
      const res = await api.get(`/api/order/products?search=${inputValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.data.data.map((product) => ({
        value: product.product?.id,
        label: `${product.product.name}, (${product.product.product_id})`,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const selectProduct = (selectedId) => {
    setSelectedProduct(selectedId?.value);
  };

  const { user_data } = useContext(AuthContext);

  const hasPermission = (permissionList) => {
    return permissionList.some((p) => user_data?.permissions?.includes(p));
  };

  const applyBtn = () => {
    fetchSoldProducts(1);
  }

  const handlePrintReport = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/sold/product/invoice?search=${searchTerm || ''} && start_date=${start_date || ''} && end_date=${end_date || ''} && product_id=${selectedProduct || ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.src = url;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        const iframeWindow = iframe.contentWindow;

        iframeWindow.focus();
        iframeWindow.print();

        iframeWindow.onafterprint = () => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        };
      };
    } catch (err) {
      console.error("Failed to print receipt:", err);
    }
  };

  return (
    <div className="max-w-3xl p-4 bg-white rounded-md shadow-md">
      <div>
        <div className="grid grid-cols-2 gap-4 mb-4">

          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={productOptions}
            name="product"
            onChange={selectProduct}
            placeholder="Select Product..."
            isClearable
            className="w-full"
          />

          <input
            id="search"
            type="text"
            placeholder="Search by invoice..."
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <input
            id="search"
            type="date"
            placeholder="Search by date..."
            className="px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            value={start_date}
          />

          <input
            id="search"
            type="date"
            placeholder="Search by date..."
            className=" px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            value={end_date}
          />

          <button
            onClick={() => applyBtn()}
            className=" cursor-pointer bg-blue-700 text-white px-3 py-1 rounded"
            title="Print Invoice Report"
          >
            Search
          </button>

          <button
            onClick={() => handlePrintReport()}
            className=" cursor-pointer bg-blue-700 text-white px-3 py-1 rounded"
            title="Print Invoice Report"
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
          {/* <button
            onClick={() => handlePrint(order.id)}
            className="text-blue-600 cursor-pointer"
            title="Print Invoice Report"
          >
            <FontAwesomeIcon icon={faPrint} />
          </button> */}

          {/* {hasPermission(["product_category.store"]) && (
            <FontAwesomeIcon
              icon={faPlus}
              className={`transition-transform duration-300 text-4xl cursor-pointer ml-2 ${
                openMore ? "rotate-45" : ""
              }`}
              onClick={() => setOpenMore(!openMore)}
            />
          )} */}
        </div>
        {/* <div
          className={`overflow-hidden flex transition-all duration-500 ease-in-out 
    ${openMore ? "max-h-40 opacity-100 p-5 " : "max-h-0 opacity-0 p-0"}`}
        >
          <div className="px-2">Will you add new?</div>
          <Link
            href={`/dairy_fresh/home/product/new`}
            className="text-blue-600 hover:underline"
          >
            click here
          </Link>
        </div> */}
      </div>

      <List
        products={products}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
        handlePageChange={handlePageChange}
        handleDelete={handleDelete}
        handleActivation={handleActivation}
        user={user}
      />
    </div>
  );
}
