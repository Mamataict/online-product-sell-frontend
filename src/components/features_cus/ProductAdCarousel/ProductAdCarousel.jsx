"use client";

// core version + navigation, pagination modules:
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import "./styles.css";

// import required modules
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

export default function ProductAdCarousel({ order_data }) {
  return (
    <Swiper
      rewind={true}
      navigation={true}
      modules={[Navigation, Autoplay]}
      className="mySwiper"
      slidesPerView={3}
      spaceBetween={30}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      }}
    >
      {order_data?.products_view?.map((product, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-full rounded-lg shadow-md">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className=" object-cover"
            />
          </div>
          {/* <h3 className="text-lg font-bold mt-2">{product.name}</h3>
            <p className="text-xl font-bold text-green-600">৳{product.price.toFixed(2)}</p> */}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
