import Navbar from "@/components/admin/NavBar";
import SideBar from "@/components/admin/SideBar";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  
  return (
    <>
      <AuthProvider>
          <div className="flex top-0 min-h-[100vh] w-full admin-layout">
            <SideBar />
            <div className="w-full lg:w-[calc(100%-280px)] px-5">
              <Navbar />
              
              {children}
            
            </div>
          </div>
      </AuthProvider>
    </>
  );
}
