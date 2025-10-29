import { memo } from "react";
import logoo from "../../shared/assets/logoo.svg";
import profile from "../../shared/assets/profil.jpg";
import { Bell, Globe } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Select } from "antd";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between text-white px-[45px] py-[14px] bg-[#14151F]">
      <div
        onClick={() => navigate("/")}
        className="flex gap-[] items-center cursor-pointer"
      >
        <img src={logoo} alt="" />
        <h2 className="text-[20px] font-medium">BarBrons</h2>
      </div>
      <div className="flex items-center gap-[24px]">
        <div className="flex items-center gap-[10px]">
          <Globe />
          <Select
            defaultValue="ru"
            style={{ backgroundColor: "#14151F"}}
            options={[
              { value: "ru", label: "RU" },
              { value: "uz", label: "UZ" },
            ]}
          />
        </div>
        <Bell />
        <NavLink to={"profile"}>
          <img
            src={profile}
            alt=""
            className="w-[30px] h-[30px] rounded-[50%] object-cover"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default memo(Header);
