import { memo, useState, type FormEvent } from "react";
import Popup from "../../../../shared/ui/Popup";
import { X } from "lucide-react";

interface ServiceType {
  name: string;
  price: number;
  duration: string;
  description: string;
}

const Service = () => {
  const [show, setShow] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [form, setForm] = useState<ServiceType>({
    name: "",
    price: 0,
    duration: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.duration) return;

    setServices((prev) => [...prev, form]);
    setForm({ name: "", price: 0, duration: "", description: "" });
    setShow(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h3 className="font-medium text-[20px]">Xizmatlar ro’yxati</h3>
        <button
          onClick={() => setShow(true)}
          className="bg-[#FA8B00] text-[14px] font-medium py-[6px] px-[16px] rounded-[6px] cursor-pointer"
        >
          Xizmat qo'shish
        </button>
      </div>

      {services.length === 0 ? (
        <p className="text-[#9E9E9E]">Hozircha xizmatlar yo‘q</p>
      ) : (
        <div className="grid grid-cols-4 gap-[20px]">
          {services.map((item, i) => (
            <div
              key={i}
              className="bg-[#14151F] rounded-[6px] p-[24px] shadow-2xs w-[359px]"
            >
              <h4 className="font-semibold text-[18px] mb-2">{item.name}</h4>
              <p className="text-[15px] mb-3 overflow-y-auto break-words line-clamp-3 leading-6">
                {item.description || "Hech qanday tavsif kiritilmagan"}
              </p>
              <div className="flex items-center gap-3">
                <span className="bg-[#00CFE829] text-[#00CFE8] px-3 py-1 rounded text-sm font-medium">
                  {item.price.toLocaleString()} so‘m
                </span>
                <span className="bg-[#FA8B0029] text-[#FA8B00] px-3 py-1 rounded text-sm font-medium">
                  {item.duration}-min
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Popup isShow={show} onClose={() => setShow(false)}>
        <div className="w-[639px] rounded-[8px] p-[32px] bg-[#14151F]">
          <div className="flex justify-between items-center mb-[16px]">
            <h2 className="font-medium text-[28px]">Xizmat qo'shish</h2>
            <div
              onClick={() => setShow(false)}
              className="cursor-pointer hover:bg-[#0A0B16]"
            >
              <X size={30} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-[8px] font-normal text-[14px] mb-[24px]">
              <label>Xizmat nomi</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Xizmat nomi"
                className="border border-[#C2C2C2] rounded-[8px] w-full px-[16px] py-[11px] text-[#9E9E9E] outline-0 bg-transparent"
              />
            </div>

            <div className="flex flex-col gap-[8px] font-normal text-[14px] mb-[24px]">
              <label>Narxi (so‘m)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="100000"
                className="border border-[#C2C2C2] rounded-[8px] w-full px-[16px] py-[11px] text-[#9E9E9E] outline-0 bg-transparent"
              />
            </div>

            <div className="flex flex-col gap-[8px] font-normal text-[14px] mb-[24px]">
              <label>Vaqti (daqiqa)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="daq"
                className="border border-[#C2C2C2] rounded-[8px] w-full px-[16px] py-[11px] text-[#9E9E9E] outline-0 bg-transparent"
              />
            </div>

            <div className="flex flex-col gap-[8px] font-normal text-[14px] mb-[24px]">
              <label>Tavsif</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Xizmat haqida qisqacha"
                className="border border-[#C2C2C2] rounded-[8px] w-full px-[16px] py-[11px] text-[#9E9E9E] outline-0 bg-transparent"
              ></textarea>
            </div>

            <div className="flex gap-[14px]">
              <button
                type="submit"
                className="bg-[#FA8B00] text-[14px] font-medium py-[6px] px-[16px] rounded-[6px] cursor-pointer"
              >
                Xizmat qo'shish
              </button>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="bg-[#3a3b43] text-[14px] font-medium py-[6px] px-[16px] rounded-[6px] cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};

export default memo(Service);
