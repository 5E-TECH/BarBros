import { memo } from "react";
import { Home, Scissors} from "lucide-react";
import SideBarLink from "./SideBarLink";

const SartaroshxonaSidebar = () => {
  const links = [
    { to: `/`, icon: <Home />, label: "Statistika", end: true },
    { to: `booking`, icon: <Scissors />, label: "Sartaroshlar" }
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

export default memo(SartaroshxonaSidebar);
