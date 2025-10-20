import { memo } from "react";
import { Instagram, Linkedin } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { Trans } from "react-i18next";

const Footer = () => {
  return (
    <div className="flex justify-center items-center gap-4 bg-[#14151F] py-2">
      <div className="flex gap-[40px]">
        <div className="flex gap-[20px] mb-[15px]"></div>
      </div>
      <span>
        <Trans
          i18nKey="footer.madeWith"
          components={{ bold: <span className="font-semibold" /> }}
        >
          © 2025, Made with 🏢 by{" "}
          <span className="font-semibold">Ye77i group</span>
        </Trans>
      </span>
      <a
        href="https://www.instagram.com/ye77i.tech?igsh=eHpwaDVhb2R5dWtq"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-pink-500"
      >
        <Instagram className="hover:text-red-600" size={20}/>
      </a>
      <a
        href="https://www.linkedin.com/in/bahodir-soft/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-600"
      >
        <Linkedin className="hover:text-blue-400" size={20}/>
      </a>
      <a
        href="https://t.me/yetti_tech"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-sky-500"
      >
        <FaTelegramPlane className="hover:text-blue-400" size={20} />
      </a>
    </div>
  );
};

export default memo(Footer);
