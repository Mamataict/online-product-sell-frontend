import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Lenis from "@studio-freight/lenis";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dairy Fresh",
  description: "Product Sale Management System",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_API_URL}/images_cus/icons/dairy_fresh_logo.png`,
  },
};

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import FabButton from "@/components/front/FabButton";
import Footer from "@/components/Footer";

config.autoAddCss = false;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

          {children}
          <Toaster position="center" />
      
      </body>
    </html>
  );
}
