import React from "react";
import { X } from "lucide-react";
import PrimaryButton from "./button";
import Popup from "../ui/Popup";

interface InputField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string | number;
}

interface FormPopupProps {
  isShow: boolean;
  title: string;
  inputs: InputField[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  submitText?: string; 
  cancelText?: string; 
}

const FormPopup: React.FC<FormPopupProps> = ({
  isShow,
  title,
  inputs,
  onChange,
  onSubmit,
  onClose,
  submitText = "Saqlash", 
  cancelText = "Bekor qilish",
}) => {
  return (
    <Popup isShow={isShow} onClose={onClose}>
      <div
        className="w-[639px] rounded-[8px] p-[32px] bg-[#14151F]"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-[16px]">
          <h2 className="font-medium text-[28px]">{title}</h2>
          <div
            onClick={onClose}
            className="cursor-pointer hover:bg-[#0A0B16] p-1 rounded"
          >
            <X size={28} />
          </div>
        </div>

        <form onSubmit={onSubmit}>
          {inputs.map((field) => (
            <div
              key={field.name}
              className="flex flex-col gap-[8px] font-normal text-[14px] mb-[24px]"
            >
              <label>{field.label}</label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={field.value}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  className="border border-[#C2C2C2] rounded-[8px] w-full px-[16px] py-[11px] text-[#9E9E9E] outline-0 bg-transparent"
                ></textarea>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={field.value}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  className="border border-[#C2C2C2] rounded-[8px] w-full px-[16px] py-[11px] text-[#9E9E9E] outline-0 bg-transparent"
                />
              )}
            </div>
          ))}

          <div className="flex gap-[14px]">
            <PrimaryButton type="submit">{submitText}</PrimaryButton>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#3a3b43] text-[14px] font-medium py-[6px] px-[16px] rounded-[6px] cursor-pointer hover:opacity-90"
            >
              {cancelText}
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default React.memo(FormPopup);
