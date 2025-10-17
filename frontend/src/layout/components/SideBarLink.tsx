import React, { memo } from "react";
import { NavLink } from "react-router-dom";

interface SideBarLink {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const SidebarLink: React.FC<SideBarLink> = ({ to, icon, label, end }) => {
  return (
    <div>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex items-center gap-2 text-sm transition-colors duration-200 ${
            isActive
              ? "bg-[#FA8B00] px-[16px] py-[12px]"
              : "text-[#fff] hover:text-[#FA8B00] cursor-pointer px-[16px] py-[12px]"
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </div>
  );
};

export default memo(SidebarLink);
