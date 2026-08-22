"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";

export default function ProductAdCarousel({ order_data }) {
  const products = order_data?.products_view;

  if (!products?.length) return null;

  return (
    <Swiper
      rewind={true}
      navigation={true}
      modules={[Navigation, Autoplay]}
      className="mySwiper"
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        0:    { slidesPerView: 1, spaceBetween: 10 },
        640:  { slidesPerView: 1, spaceBetween: 20 },
        768:  { slidesPerView: 2, spaceBetween: 40 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      }}
    >
      {products.map((product, index) => (
        <SwiperSlide key={product.id}>
          <div className="relative w-full h-full shadow-md overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}