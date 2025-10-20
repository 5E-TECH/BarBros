import { memo } from "react";
import { BarChart3, Briefcase, Settings, UserCheck } from "lucide-react";
import SideBarLink from "./SideBarLink";

const AdminSidebar = () => {
  const links = [
    { to: `/`, icon: <Briefcase />, label: "BarberShop", end: true },
    { to: `booking`, icon: <UserCheck />, label: "Foydalanuvchilar" },
    { to: `service`, icon: <BarChart3 />, label: "Statistika" },
    { to: `setting`, icon: <Settings />, label: "Audit loglar" },
  ];

  return (
    <div className="w-[289px] border-r border-[#2d2e36]">
      <ul className="flex flex-col">
        {links.map((link, i) => (
          <li key={i} className="mb-[24px]">
            <SideBarLink {...link} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(AdminSidebar);
