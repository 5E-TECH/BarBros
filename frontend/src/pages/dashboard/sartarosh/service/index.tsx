import { memo, useState } from "react";
import Popup from "../../../../shared/ui/Popup";
import { X } from "lucide-react";

const Service = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="font-medium text-[20px]">Xizmatlar</h3>
        <button
          onClick={() => setShow(true)}
          className="bg-[#FA8B00] text-[14px] font-medium py-[6px] px-[16px] rounded-[6px] cursor-pointer"
        >
          Xizmat qo'shish
        </button>
      </div>
      <Popup isShow={show} onClose={() => setShow(false)}>
        <div className="w-[639px] rounded-[8px] p-[32px] bg-[#14151F]">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-[28px]">Xizmat qo'shish</h2>
            <div
              onClick={() => setShow(false)}
              className="cursor-pointer hover:bg-[#0A0B16]"
            >
              <X size={30} />
            </div>
          </div>
          <form action="">
            <div>
              <label htmlFor="">Xizmat nomi</label>
              <input type="text" name="" id="" placeholder="Xizmatni yozing" />
            </div>
            <div>
              <label htmlFor="">Xizmat nomi</label>
              <input
                type="number"
                name=""
                id=""
                placeholder="Xizmatni yozing"
              />
            </div>
            <div>
              <label htmlFor="">Xizmat nomi</label>
              <input type="time" name="" id="" placeholder="Xizmatni yozing" />
            </div>
            <div>
              <label htmlFor="">Tafsif</label>
              <textarea name="" id=""></textarea>
            </div>
            <div className="flex gap-[14px]">
              <button
                className="bg-[#FA8B00] text-[14px] font-medium py-[6px] px-[16px] rounded-[6px] cursor-pointer"
              >
                Xizmat qo'shish
              </button>
              <button onClick={() => setShow(false)} className="bg-[#3a3b43] text-[14px] font-medium py-[6px] px-[16px] rounded-[6px] cursor-pointer">Bekor qilish</button>
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};

export default memo(Service);
