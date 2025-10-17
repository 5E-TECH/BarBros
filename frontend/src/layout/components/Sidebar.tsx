import { memo } from "react";
import { Briefcase, Wallet, Clock, Smartphone, Globe } from "lucide-react";
import SideBarLink from "./SideBarLink";
import profil from "../../shared/assets/profil.jpg"

const Sidebar = () => {
  const links = [
    { to: "/", icon: <Briefcase />, label: "Department" },
    { to: "rating", icon: <Wallet />, label: "Rating" },
    { to: "clock", icon: <Clock />, label: "Clock" },
    { to: "phone-number", icon: <Smartphone />, label: "PhoneNumber" },
    { to: "address", icon: <Globe />, label: "Address" },
  ];

  return (
    <div className="w-[289px] p-[32px] rounded-[8px]">
      <ul className="flex flex-col">
        <div className="flex gap-[13px] text-white mb-[32px]">
          <div>
            <img src={profil} alt=""  className="w-[50px] h-[50px] rounded-[50%]"/>
          </div>
          <div>
            <h3 className="font-bold text-[14px]">Tomas Shelbi</h3>
            <p className="font-normal text-[12px]">Sartarosh</p>
          </div>
        </div>
        <h2 className="mb-[16px] font-medium text-[14px]">Ma'lumot</h2>
        {links?.map((link, i) => (
          <li key={i} className="mb-[24px]">
            <SideBarLink {...link} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(Sidebar);
