import FrontAdModal from "@/components/advertisement/FrontAdModal";
import ProductAdCarousel from "@/components/features_cus/ProductAdCarousel/ProductAdCarousel";
import Footer from "@/components/Footer";
import FabButton from "@/components/front/FabButton";
import OrderForm from "@/components/front/OrderForm";
import api from "@/lib/axios";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const res = await api.get("/api/home");
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Home API error:", error?.response?.data || error.message);
    return null;
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[650px] 2xl:h-[1000px] 3xl:h-[1500px] w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/background/milk-ghee.jpg`}
          alt="Dairy Fresh background"
          fill
          priority
          className="object-cover"
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/logo/dairy_fresh_transparent.png`}
          alt="Dairy Fresh logo"
          fill
          className="object-contain"
        />
      </section>

      {/* Product Carousel */}
      <section className="container mx-auto my-15 h-[450px]">
        <ProductAdCarousel order_data={data} />
      </section>

      <section className="container mx-auto my-15 h-[750px] flex justify-center items-center">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/bdb89f9a-15c3-4af0-9068-13abf3f95fd8.jfif`}
          width={1200}
          height={800}
          className=" w-auto h-full object-contain rounded-lg shadow-2xl"
          alt="Beef"
        />
      </section>

      {/* Order Form */}
      <section className="container mx-auto py-10">
        <h2 className="bg-[#0F6939] text-white text-center text-2xl font-bold py-5 rounded-t-xl">
          নিচের ফর্মটি পূরণ করে আপনার অর্ডার নিশ্চিত করুন
        </h2>
        <div className="border-2 border-[#0F6939] py-8 px-3 rounded-b-xl">
          <OrderForm order_data={data} />
        </div>
      </section>
      <FrontAdModal />
      <FabButton />
      <Footer />
    </main>
  );
}
