import { memo, useState, type FormEvent } from "react";
import PrimaryButton from "../../../../shared/components/button";
import FormPopup from "../../../../shared/components/popup";

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

  const inputs = [
    {
      name: "name",
      label: "Xizmat nomi",
      type: "text",
      value: form.name,
      placeholder: "Masalan, Soch olish",
    },
    {
      name: "price",
      label: "Narxi (so‘m)",
      type: "number",
      value: form.price,
      placeholder: "100000",
    },
    {
      name: "duration",
      label: "Vaqti (daqiqa)",
      type: "number",
      value: form.duration,
      placeholder: "45",
    },
    {
      name: "description",
      label: "Tavsif",
      type: "textarea",
      value: form.description,
      placeholder: "Xizmat haqida qisqacha",
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h3 className="font-medium text-[20px]">Xizmatlar ro’yxati</h3>
        <PrimaryButton onClick={() => setShow(true)}>
          Xizmat qo'shish
        </PrimaryButton>
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

      <FormPopup
        isShow={show}
        title="Yangi xizmat qo‘shish"
        inputs={inputs}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => setShow(false)}
        submitText="Xizmat Qo'shish"
        cancelText="Bekor qilish"
      />
    </div>
  );
};

export default memo(Service);
