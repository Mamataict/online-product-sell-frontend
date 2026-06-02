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
  title: "POS",
  description: "Product Sale Management System",
};

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/features_cus/SmoothScrollProvider";
import { AuthProvider } from "@/context/auth-context";

config.autoAddCss = false;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <SmoothScrollProvider> */}
        <AuthProvider>

          {children}
          <Toaster position="top-center" />
        </AuthProvider>
        {/* </SmoothScrollProvider> */}
      </body>
    </html>
  );
}
