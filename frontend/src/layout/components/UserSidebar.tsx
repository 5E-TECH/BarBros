import { memo } from "react";
import { Clock, Settings, Home } from "lucide-react";
import SideBarLink from "./SideBarLink";

const UserSidebar = () => {
  const links = [
    { to: `/`, icon: <Home />, label: "Sartaroshxonalar", end: true },
    { to: `booking`, icon: <Clock />, label: "Tarix" },
    { to: `setting`, icon: <Settings />, label: "Sozlamalar" },
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

export default memo(UserSidebar);
