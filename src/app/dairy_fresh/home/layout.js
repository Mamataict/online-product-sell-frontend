import Navbar from "@/components/admin/NavBar";
import SideBar from "@/components/admin/SideBar";
import SmoothScrollProvider from "@/components/features_cus/SmoothScrollProvider";
import { AuthProvider } from "@/context/auth-context";
import { Suspense } from "react";
import Loading from "./loading";

export default function AdminLayout({ children }) {
  
  return (
    <>
      <AuthProvider>
        {/* <SmoothScrollProvider> */}
          <div className="flex top-0 min-h-[100vh] w-full admin-layout">
            <SideBar />
            <div className="w-full lg:w-[calc(100%-280px)] px-5">
              <Navbar />
              
              {children}
            
            </div>
          </div>
        {/* </SmoothScrollProvider> */}
      </AuthProvider>
    </>
  );
}
