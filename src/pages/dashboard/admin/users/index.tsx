import { memo } from "react";
import { Pagination } from "antd";
import { Edit, Trash2 } from "lucide-react";

const Users = () => {
  const data = [
    {
      name: "Yaxshimurod",
      lastName: "Yaxshimuratov",
      phone: "+998918687100",
      username: "Foydalanuvchi nom",
      registrationDate: "10.10.2025",
    },
    {
      name: "Yaxshimurod",
      lastName: "Yaxshimuratov",
      phone: "+998918687100",
      username: "Foydalanuvchi nom",
      registrationDate: "10.10.2025",
    },
    {
      name: "Yaxshimurod",
      lastName: "Yaxshimuratov",
      phone: "+998918687100",
      username: "Foydalanuvchi nom",
      registrationDate: "10.10.2025",
    },
    {
      name: "Yaxshimurod",
      lastName: "Yaxshimuratov",
      phone: "+998918687100",
      username: "Foydalanuvchi nom",
      registrationDate: "10.10.2025",
    },
    {
      name: "Yaxshimurod",
      lastName: "Yaxshimuratov",
      phone: "+998918687100",
      username: "Foydalanuvchi nom",
      registrationDate: "10.10.2025",
    },
    {
      name: "Yaxshimurod",
      lastName: "Yaxshimuratov",
      phone: "+998918687100",
      username: "Foydalanuvchi nom",
      registrationDate: "10.10.2025",
    },
  ];

  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-medium text-[18px]">Foydalanuvchilar ro’yxati</h3>
      </div>

      <div className="overflow-hidden bg-[#14151f] rounded-md">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="bg-[#FA8B00] border-[#FA8B00]">
              <th className="w-[16.6%] py-4 px-4 text-left text-[18px] border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Ism
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Familiya
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Telefon raqam
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Foydalanuvchi nom
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left border-r border-[#FFFFFF] font-medium text-[#FFFFFF]">
                Ro’yxatdan o’tgan sana
              </th>
              <th className="w-[16.6%] py-4 px-4 text-[18px] text-left font-medium text-[#FFFFFF]">
                Xolat
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
                  {item.lastName}
                </td>
                <td className="py-6 px-4 text-[18px] align-middle">
                  {item.phone}
                </td>
                <td className="py-6 px-4 text-[18px] align-middle">
                  {item.username}
                </td>
                <td className="py-6 px-4 text-[18px] align-middle flex items-center justify-between">
                  <span>{item.registrationDate}</span>
                </td>
                <td className="py-6 px-4 text-[18px] align-middle">
                  <div className="flex gap-6">
                    <Edit className="text-green-600"/>
                    <Trash2 className="text-red-600"/>
                  </div>
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
    </div>
  );
};

export default memo(Users);
