import FrontAdModal from "@/components/advertisement/FrontAdModal";
import ProductAdCarousel from "@/components/features_cus/ProductAdCarousel/ProductAdCarousel";
import BannerAdCarousel from "@/components/features_cus/BannerAdCarousel/BannerAdCarousel";
import Footer from "@/components/Footer";
import FabButton from "@/components/front/FabButton";
import OrderForm from "@/components/front/OrderForm";
import Navbar from "@/components/NavBar";
import api from "@/lib/axios";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const res = await api.get("/api/home");
    return res.data?.data ?? null;
  } catch (err) {
    return null;
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main>
      <Navbar />

      <section className="container mx-auto mt-30 my-15 h-auto">
       
        <BannerAdCarousel order_data={data} />
        {/* <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/background/milk-ghee.jpg`}
          alt="Dairy Fresh background"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 z-[1] bg-black/50" />

        <div className="absolute inset-0 z-10">
       
          <div className="container mx-auto grid w-full grid-cols-1 items-center gap-8 px-6 py-25 sm:grid-cols-2 sm:px-10 lg:px-16 2xl:px-24">
            <div className="flex w-full flex-col items-center justify-center text-center">
              {data?.position_main && (
                <Image
                  src={data.position_main?.image_url}
                  alt={data.position_main?.name}
                  width={500}
                  height={500}
                  priority
                  className="mb-6 w-[250px] lg:w-[350px] 2xl:w-[400px]"
                />
              )}
            </div>

            <div className="flex w-full items-center justify-center">
              <div className="w-full max-w-[450px] z-[999999] h-[380px] flex-col items-center justify-center text-center">
                <ProductAdCarousel
                  order_data={data}
                  custom_preview={1}
                  custom_space={10}
                  custom_class={
                    "w-70 h-50 sm:w-90 sm:h-100 custom-class-for-carousel"
                  }
                />

                <a
                  href="#orders"
                  className="mt-8 inline-flex items-center rounded-lg bg-[#0F6939] px-6 py-3 text-xl font-bold text-white shadow-lg transition-colors hover:bg-[#0a4d2a] sm:px-8 sm:py-4 sm:text-2xl"
                >
                  অর্ডার করুন
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    className="ml-3 text-lg sm:text-xl"
                  />
                </a>
              </div>
            </div>
          </div>
        </div> */}
      </section>
   
      <section className="container mx-auto my-15 h-[450px]">
        <ProductAdCarousel order_data={data} />
      </section>

      {/* {data?.position_mid?.length > 0 && (
        <section className="bg-[#14261C] py-16 sm:py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {data.position_mid?.map((banner, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/5] overflow-hidden rounded-sm"
                >
                  <Image
                    src={banner.image_url}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    alt={banner.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}
      <section className="container mx-auto py-10" id="orders">
        <h2 className="bg-[#0F6939] text-white text-center text-2xl font-bold py-5 rounded-t-xl">
          নিচের ফর্মটি পূরণ করে আপনার অর্ডার নিশ্চিত করুন
        </h2>
        <div className="border-2 border-[#0F6939] py-8 px-3 rounded-b-xl">
          <OrderForm order_data={data} />
        </div>
      </section>
      <FrontAdModal data={data} />
      <FabButton />
      <Footer />
    </main>
  );
}
