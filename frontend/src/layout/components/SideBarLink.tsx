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
              ? "text-[#FA8B00]"
              : "text-[#fff] hover:text-[#FA8B00] cursor-pointer"
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
