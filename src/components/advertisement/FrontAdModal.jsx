"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductAdCarousel from "../features_cus/ProductAdCarousel/ProductAdCarousel";

const AUTO_CLOSE_SECONDS = 10;

export default function FrontAdModal() {
  const [isModalOpen, setIsModalOpen] = useState(true);

   useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(false);
      
    }, AUTO_CLOSE_SECONDS * 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 ">
      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 w-full h-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Images */}
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/bdb89f9a-15c3-4af0-9068-13abf3f95fd8.jfif`}
          width={1200}
          height={800}
          sizes="(max-width: 640px) 90vw, 45vw"
          className="w-full sm:w-1/2 h-auto max-h-[45vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl"
          alt="Beef"
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/orosh.jpg`}
          width={1200}
          height={800}
          sizes="(max-width: 640px) 90vw, 45vw"
          className="w-full sm:w-1/2 h-auto max-h-[45vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl"
          alt="Orosh"
        />

        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="fixed top-3 right-3 sm:top-5 sm:right-5
                     flex items-center justify-center
                     w-9 h-9 sm:w-12 sm:h-12
                     rounded-full
                     bg-black/70 text-white
                     text-2xl sm:text-3xl font-semibold leading-none
                     hover:bg-black transition
                     focus:outline-none focus:ring-2 focus:ring-white/70"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
}