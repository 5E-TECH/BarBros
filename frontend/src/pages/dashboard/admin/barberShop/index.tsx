import { memo, useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import Popup from "../../../../shared/ui/Popup";
import { X } from "lucide-react";

const BarberShop = () => {
  const [show, setShow] = useState(false);

  const data = [
    {
      name: "BarberShop",
      address: "Manzil",
      phone: "+998918687100",
      description: "Tavsif",
      workTime: "09:00–18:00",
      createdAt: "10.10.2025",
    },
    {
      name: "BarberShop",
      address: "Manzil",
      phone: "+998918687100",
      description: "Tavsif",
      workTime: "09:00–18:00",
      createdAt: "10.10.2025",
    },
    {
      name: "BarberShop",
      address: "Manzil",
      phone: "+998918687100",
      description: "Tavsif",
      workTime: "09:00–18:00",
      createdAt: "10.10.2025",
    },
    {
      name: "BarberShop",
      address: "Manzil",
      phone: "+998918687100",
      description: "Tavsif",
      workTime: "09:00–18:00",
      createdAt: "10.10.2025",
    },
    {
      name: "BarberShop",
      address: "Manzil",
      phone: "+998918687100",
      description: "Tavsif",
      workTime: "09:00–18:00",
      createdAt: "10.10.2025",
    },
    {
      name: "BarberShop",
      address: "Manzil",
      phone: "+998918687100",
      description: "Tavsif",
      workTime: "09:00–18:00",
      createdAt: "10.10.2025",
    },
  ];

  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-medium text-[18px]">BarberShoplar ro’yxati</h3>
        <button
          onClick={() => setShow(true)}
          className="bg-[#FA8B00] text-white text-[18px] font-medium px-4 p-2 rounded-[6px] cursor-pointer hover:bg-[#ff9f26]"
        >
          BarberShop qo’shish
        </button>
      </div>

      <div className="overflow-hidden bg-[#14151f] rounded-md">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="bg-[#FA8B00] border-[#FA8B00]">
              <th className="w-[16.6%] py-4 px-4 text-left text-[18px] border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Barbershop nomi
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Manzili
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Telefon raqam
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Tavsifi
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Ish vaqti
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left font-medium text-[#FFFFFF]">
                Tashkil qilingan sana
              </th>
            </tr>
          </thead>

          <tbody className="bg-[#14151f]">
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-[#2E2E34] hover:bg-[#1C1C21] transition"
              >
                <td className="py-6 px-4 text-[18px] align-middle">
                  {item.name}
                </td>
                <td className="py-6 px-4 text-[18px] align-middle">
                  {item.address}
                </td>
                <td className="py-6 px-4 text-[18px] align-middle">
                  {item.phone}
                </td>
                <td className="py-6 px-4 text-[18px] align-middle">
                  {item.description}
                </td>
                <td className="py-6 px-4 text-[18px] align-middle">
                  {item.workTime}
                </td>
                <td className="py-6 px-4 text-[18px] align-middle flex items-center justify-between">
                  <span>{item.createdAt}</span>
                  <MoreOutlined className="cursor-pointer text-[28px] text-white hover:text-[#FA8B00] transition ml-2" />
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-[#14151f]">
            <tr>
              <td colSpan={6} className="border-t-2 border-gray-400 py-2"></td>
            </tr>
          </tfoot>
        </table>
        <div className="flex justify-end bg-[#14151f] px-4 py-4">
          <Pagination
            total={100}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Jami ${total} ta`}
            className="!text-white !text-[16px]"
          />
        </div>
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

export default memo(BarberShop);
