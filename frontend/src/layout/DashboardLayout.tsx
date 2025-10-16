import { memo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex bg-[#0C0D14] min-h-screen text-white p-[32px]">
      <Sidebar />
      <main className="flex-1 p-[32px]">
        <Outlet /> 
      </main>
    </div>
  );
};

export default memo(DashboardLayout);
