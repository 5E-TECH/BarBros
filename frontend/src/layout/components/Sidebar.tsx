import { memo } from "react";
import { Clock, Settings, Home, CalendarCheck } from "lucide-react";
import SideBarLink from "./SideBarLink";

const Sidebar = () => {
  const links = [
    { to: `/`, icon: <Home />, label: "Kalendar", end: true },
    { to: `booking`, icon: <CalendarCheck />, label: "Bron qilingan" },
    { to: `service`, icon: <Clock />, label: "Xizmatlar" },
    { to: `setting`, icon: <Settings />, label: "Kamentariyalar" },
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

export default memo(Sidebar);
