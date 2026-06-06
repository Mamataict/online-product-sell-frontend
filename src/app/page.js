import CustomerReviewCarousel from "@/components/features_cus/CustomerReviewCarousel/CustomerReviewCarousel";
import ProductAdCarousel from "@/components/features_cus/ProductAdCarousel/ProductAdCarousel";
import Footer from "@/components/Footer";
import FabButton from "@/components/front/FabButton";

import OrderForm from "@/components/front/OrderForm";

import api from "@/lib/axios";
import Cookies from "js-cookie";
import Image from "next/image";

async function getRepo() {
  try {
    const res = await api.get("/api/home", {
      params: {
        session_id: Cookies.get("session_id"),
      },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    return res.data;
  } catch (error) {
    console.log("API Error", error?.response?.data || error.message);
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const repo = await getRepo();

  Cookies.set("session_id", repo?.data?.session_id);

  return (
    <div>
      <div className="relative h-[650px] 2xl:h-[1000px] 3xl:h-[1500px] py-10 w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/background/milk-ghee.jpg`}
          alt="Dairy Fresh"
          fill
          className="object-cover"
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/logo/dairy_fresh_transparent.png`}
          alt="Dairy Fresh"
          fill
          className="w-[200px] 2xl:w-[300px] 3xl:w-[400px] object-contain absolute"
        />
      </div>
      <div className="h-[450px] my-15 container mx-auto">
        <ProductAdCarousel order_data={repo?.data} />
      </div>

      {/* <div className="h-[450px] py-10 container mx-auto">
        <div className="text-center text-2xl font-bold text-[#0F6939] mb-5">
          আমাদের সম্মানিত কাস্টমারদের রিভিউ
        </div>
        <CustomerReviewCarousel />
      </div> */}

      <div className="container mx-auto py-10">
        <div className="bg-[#0F6939] text-white text-center text-2xl font-bold py-5 rounded-t-xl">
          নিচের ফর্মটি পূরণ করে আপনার অর্ডার নিশ্চিত করুন
        </div>
        <div className="border-2 border-[#0F6939] py-8 px-3 rounded-b-xl">
          <OrderForm order_data={repo?.data} />
        </div>
      </div>

      <FabButton />

      <Footer />
    </div>
  );
}
