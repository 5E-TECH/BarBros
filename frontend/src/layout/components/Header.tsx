import { memo, useState } from "react";
import logoo from "../../shared/assets/logoo.svg";
import profile from "../../shared/assets/profil.jpg";
import { Bell, Globe, Home, Menu, User, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Select } from "antd";
import shelbi from "../../shared/assets/profil.jpg";

const Header = () => {
  const navigate = useNavigate();
  const [burger, setBurger] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center text-white px-[20px] md:px-[45px] py-[14px] bg-[#14151F] relative z-50">
        <div className="flex items-center gap-[10px]">
          <div className="flex md:hidden items-center">
            {burger ? (
              <X
                size={28}
                onClick={() => setBurger(false)}
                className="cursor-pointer"
              />
            ) : (
              <Menu
                size={28}
                onClick={() => setBurger(true)}
                className="cursor-pointer bg-[#FA8B004D] text-[#FA8B00] px-1 py-1 rounded-xl"
              />
            )}
          </div>

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-[8px] cursor-pointer"
          >
            <img src={logoo} alt="logo" className="w-[30px]" />
            <h2 className="text-[18px] md:text-[20px] font-medium">BarBrons</h2>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-[24px]">
          <div className="flex items-center gap-[10px]">
            <Globe />
            <Select
              defaultValue="ru"
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

      {burger && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/40 z-40"
            onClick={() => setBurger(false)}
          ></div>

          <div className="fixed top-0 left-0 w-[250px] h-full bg-[#14151F] text-white z-50 flex flex-col gap-6 transition-all">
            <div className="border-b p-6">
              <img
                src={shelbi}
                alt=""
                className="w-[45px] h-[45px] rounded-[50%] mb-[10px] object-cover border"
              />
              <div className="text-[16px] font-bold mb-[8px]">
                <h3>Bahodir</h3>
                <h3>Nabijanov</h3>
              </div>
              <p className="text-[#FA8B00] text-[16px] font-normal">
                Sartarosh
              </p>
            </div>

            <div className="p-6">
              <NavLink
                to="/"
                onClick={() => setBurger(false)}
                className={({ isActive }) =>
                  `text-[18px] font-medium hover:text-[#f69a29] flex items-center gap-[24px] transition mb-[30px] ${
                    isActive ? "text-[#FA8B00]" : ""
                  }`
                }
              >
                <Home size={30} />
                Home
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setBurger(false)}
                className={({ isActive }) =>
                  `text-[18px] font-medium hover:text-[#f69a29] flex items-center gap-[24px] transition ${
                    isActive ? "text-[#FA8B00]" : ""
                  }`
                }
              >
                <User size={30} />
                Profile
              </NavLink>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default memo(Header);
