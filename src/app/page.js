import FrontAdModal from "@/components/advertisement/FrontAdModal";
import ProductAdCarousel from "@/components/features_cus/ProductAdCarousel/ProductAdCarousel";
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
  } catch (error) {
    console.error("Home API error:", error?.response?.data || error.message);
    return null;
  }
}

const products = [
  {
    src: "beef.jpg",
    name: "Beef",
  },
  {
    src: "omega-3.jfif",
    name: "Omega 3",
  },
];

export default async function Home() {
  const data = await getHomeData();

  return (
    <main>
      {/* <Navbar /> */}
      {/* Hero */}
      {/* <section className="relative h-[650px] 2xl:h-[1000px] 3xl:h-[1500px] w-full">
        <Image
    src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/background/milk-ghee.jpg`}
    alt="Dairy Fresh background"
    fill
    priority
    className="object-cover"
  />

  

        <div className="absolute top-0 left-0 w-[100vw] z-[999999] grid sm:grid-cols-2 gap-4 ">
          <div className=" w-full p-4 sm:p-20 lg:p-10">

          <ProductAdCarousel
            order_data={data}
            custom_preview={1}
            custom_space={10}
          />
          </div>
          <div className="flex justify-center items-center w-full">

          <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/icons/dairy_fresh_logo.png`}
            alt="Dairy Fresh background"
            width={400}
            height={400}
            priority
            className="mt-20 mb-20"
          />
          <button className="bg-[#0F6939] text-white py-4 px-6 rounded-lg hover:bg-[#0a4d2a] transition-colors text-5xl font-bold ml-8">
            বিস্তারিত <FontAwesomeIcon icon={faArrowDown} className="ml-2 text-md" />
          </button>
          </div>
          </div>
          
        </div>
      </section> */}

      <section className="relative min-h-[1100px] w-full overflow-hidden sm:min-h-[800px] lg:min-h-[900px] ">
        {/* Background */}
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/background/bg-cover.jpg`}
          alt="Dairy Fresh background"
          fill
          priority
          className="object-cover"
        />

        {/* Optional dark overlay for better readability */}
        <div className="absolute inset-0 z-[1] bg-black/40" />

        {/* Content */}

        <div className="absolute inset-0 z-10">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/logo/logo-splash.png`}
            alt="Dairy Fresh logo"
            width={500}
            height={500}
            priority
            className="mb-6 w-20 sm:w-40 h-auto ml-5 mt-5 sm:ml-[30px] sm:mt-[30px]"
          />
          <div className="container mx-auto grid w-full grid-cols-1 items-center gap-8 px-6 py-2 sm:grid-cols-2 sm:px-10 lg:px-16 2xl:px-24">
            <div className="flex w-full flex-col items-center justify-center text-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/beef-2.jpg`}
                alt="Dairy Fresh logo"
                width={500}
                height={500}
                priority
                className="mb-6 w-[250px] lg:w-[350px] 2xl:w-[400px]"
              />
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
        </div>
      </section>

      {/* Product Carousel */}
      <section className="container mx-auto my-15 h-[450px]">
        <ProductAdCarousel order_data={data} />
      </section>

      <section className="bg-[#14261C] py-16 sm:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {products.map((product) => (
              <div
                key={product.src}
                className="group relative aspect-[4/5] overflow-hidden rounded-sm"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/${product.src}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  alt={product.name}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section className="container mx-auto py-10" id="orders">
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
