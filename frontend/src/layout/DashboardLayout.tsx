import { memo, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import { UserRole } from "../shared/enum";

const DashboardLayout = () => {
  const location = useLocation();

  const role = useMemo(() => {
    if (location.pathname.startsWith("/admin")) return UserRole.Admin;
    if (location.pathname.startsWith("/sartaroshxona"))
      return UserRole.Sartaroshxona;
    if (location.pathname.startsWith("/sartarosh")) return UserRole.Sartarosh;
    if (location.pathname.startsWith("/foydalanuvchi"))
      return UserRole.Foydalanuvchi;
    return UserRole.Sartarosh; 
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0C0D14] text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={role} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default memo(DashboardLayout);
