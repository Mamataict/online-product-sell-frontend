import FrontAdModal from "@/components/advertisement/FrontAdModal";
import ProductAdCarousel from "@/components/features_cus/ProductAdCarousel/ProductAdCarousel";
import BannerAdCarousel from "@/components/features_cus/BannerAdCarousel/BannerAdCarousel";
import Footer from "@/components/Footer";
import FabButton from "@/components/front/FabButton";
import OrderSection from "@/components/front/OrderSection";
import Navbar from "@/components/NavBar";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getHomeData() {
  try {
    const res = await fetch(`${API_URL}/api/home`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main>
      <Navbar />

      {!data ? (
        <div className="container mx-auto mt-30 py-40 text-center text-red-500">
          সার্ভারে সমস্যা হয়েছে। একটু পরে চেষ্টা করুন।
        </div>
      ) : (
        <>
          <section className="container mx-auto mt-30 mb-5 sm:mb-10 h-auto">
            <BannerAdCarousel order_data={data} />
          </section>

          <section className="container mx-auto">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-[2px] flex-1 bg-[#0F6939]/20"></div>
              <h2 className="text-2xl md:text-3xl text-center">
                Product Category
              </h2>
              <div className="h-[2px] flex-1 bg-[#0F6939]/20"></div>
            </div>
          </section>

          <section className="container mx-auto my-5 sm:my-10 h-[450px]">
            <ProductAdCarousel order_data={data} />
          </section>

          <OrderSection data={data} />

          <FrontAdModal data={data} />
        </>
      )}

      <FabButton />
      <Footer />
    </main>
  );
}