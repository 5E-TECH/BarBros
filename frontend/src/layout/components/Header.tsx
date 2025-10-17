import { memo } from "react";
import logoo from "../../shared/assets/logoo.svg";
import profile from "../../shared/assets/profil.jpg";
import { Bell, Globe } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between text-white px-[45px] py-[14px] bg-[#14151F]">
      <div className="flex gap-[] items-center">
        <img src={logoo} alt=""/>
        <h2 className="text-[20px] font-medium">BarBrons</h2>
      </div>
      <div className="flex items-center gap-[24px]">
        <div className="flex items-center gap-[10px]">
          <Globe />
          <select name="" id="">
            <option value="">RU</option>
            <option value="">UZ</option>
          </select>
        </div>
          <Bell />
          <img
            src={profile}
            alt=""
            className="w-[30px] h-[30px] rounded-[50%] object-cover"
          />
      </div>
    </div>
  );
};

export default memo(Header);
