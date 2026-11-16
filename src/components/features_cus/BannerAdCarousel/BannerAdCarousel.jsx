"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
// import "./styles.css";

export default function ProductAdCarousel({ order_data, custom_preview = null, custom_space = null, custom_class = null }) {
  const banners = order_data?.position_main;

  if (!banners?.length) return null;

  return (
    <Swiper
      rewind={true}
      navigation={true}
      modules={[Navigation, Autoplay]}
      className="mySwiper custom-class-main-carousel"
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        // 0:    { slidesPerView: custom_preview ?? 1, spaceBetween: custom_space ?? 10 },
        // 640:  { slidesPerView: custom_preview ?? 1, spaceBetween: custom_space ?? 20 },
        // 768:  { slidesPerView: custom_preview ?? 2, spaceBetween: custom_space ?? 40 },
        // 1024: { slidesPerView: custom_preview ?? 3, spaceBetween: custom_space ?? 30 },
      }}
    >
      {banners?.map((banner, index) => (
        <SwiperSlide key={banner.id}>
          <div className={`relative w-full h-auto shadow-md overflow-hidden ` + (custom_class || '')}>
            <Image
              src={banner.image_url}
              alt={banner.name}
              width={400}
              height={400}
              loading={index === 0 ? "eager" : "lazy"}
              className={'w-full h-auto'}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}