import React, { memo } from "react";
import { NavLink } from "react-router-dom";

interface SideBarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const SideBarLink: React.FC<SideBarLinkProps> = ({ to, icon, label, end }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 text-[14px] transition-colors duration-200 ${
          isActive
            ? "bg-[#FA8B00] text-white px-4 py-3"
            : "text-[#fff] hover:text-[#FA8B00] cursor-pointer px-4 py-3"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default memo(SideBarLink);
