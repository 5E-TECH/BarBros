import { memo } from "react";
import {
  Home,
  Clock,
  Settings,
  CalendarCheck,
  BarChart3,
  Users,
  FileText,
} from "lucide-react";
import SideBarLink from "./SideBarLink";
import { UserRole } from "../../shared/enum";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

// interface SidebarProps {
//   role: UserRole;
// }

interface LinkItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const sidebarConfig: Record<UserRole, LinkItem[]> = {
  [UserRole.Foydalanuvchi]: [
    { to: "/barbershops", icon: <Home />, label: "Barbershoplar" },
    { to: "/history", icon: <Clock />, label: "Bronlar tarixi" },
    { to: "/settings", icon: <Settings />, label: "Sozlamalar" },
  ],
  [UserRole.Sartarosh]: [
    { to: "/", icon: <Home />, label: "Kalendar", end: true },
    { to: "/booking", icon: <CalendarCheck />, label: "Bron qilinganlar" },
    { to: "/service", icon: <Clock />, label: "Xizmatlar" },
    { to: "/comment", icon: <Settings />, label: "Izohlar" },
  ],
  [UserRole.Sartaroshxona]: [
    { to: "/statistics", icon: <BarChart3 />, label: "Statistika" },
    { to: "/barbers", icon: <Users />, label: "Sartaroshlar" },
    { to: "/settings", icon: <Settings />, label: "Sozlamalar" },
  ],
  [UserRole.Admin]: [
    { to: "/barbershop", icon: <Home />, label: "Barbershoplar" },
    { to: "/users", icon: <Users />, label: "Foydalanuvchilar" },
    { to: "/statistics", icon: <BarChart3 />, label: "Statistika" },
    { to: "/audit-logs", icon: <FileText />, label: "Audit loglari" },
  ],
};

const Sidebar = () => {

  const userRole = useSelector((state: RootState) => state.roleSlice.role);

  let role: UserRole | undefined = undefined;
  if (userRole === "supperadmin") {
    role = UserRole.Admin
  }else if(userRole === "barber"){
    role = UserRole.Sartarosh
  }

  const links = role ? sidebarConfig[role] : [];


  return (
    <div className="w-[289px] border-r border-[#2d2e36] max-sm:hidden">
      <ul className="flex flex-col">
        {links.map((link, i) => (
          <li key={i} className="mb-[12px]">
            <SideBarLink {...link} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(Sidebar);
