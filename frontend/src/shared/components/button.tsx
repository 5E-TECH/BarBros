import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  type = "button",
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#FA8B00] text-[14px] font-medium py-[6px] px-[16px] rounded-[6px] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all duration-150 ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
