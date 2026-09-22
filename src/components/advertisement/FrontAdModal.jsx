"use client";
import Image from "next/image";
import { useState } from "react";

export default function FrontAdModal() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  if (!isModalOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative flex items-center justify-center w-full h-full max-w-6xl max-h-[95vh]">
        {/* Image */}
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/bdb89f9a-15c3-4af0-9068-13abf3f95fd8.jfif`}
          width={1200}
          height={800}
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
          alt="Beef"
        />

        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4
                 flex items-center justify-center
                 w-10 h-10 sm:w-20 sm:h-20
                 rounded-full
                 bg-black/70 text-white
                 text-5xl font-semibold
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
