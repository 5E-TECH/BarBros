import { memo } from "react";
import logoo from "../../shared/assets/logoo.svg";
import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { Trans, useTranslation } from "react-i18next";

const Footer = () => {
  useTranslation();

  return (
    <div className="flex flex-col items-center bg-[#14151F] py-2">
      <div className="flex items-center mb-[25px]">
        <img src={logoo} alt="" className="w-[60px]" />
        <ul className="flex gap-[60px] font-medium text-[16px]">
          <li>Services</li>
          <li>About me</li>
          <li>Portfolio</li>
          <li>Contact me</li>
        </ul>
      </div>
      <div className="flex gap-[40px]">
        <div className="flex gap-[16px]">
          <Mail />
          <p>bahodirxro1@gmail.com</p>
        </div>
        <div className="flex gap-[16px]">
          <Phone />
          <strong>+998 94 232 55 67</strong>
        </div>
        <div className="flex gap-[20px] mb-[25px]">
          <a
            href="https://www.instagram.com/ye77i.tech?igsh=eHpwaDVhb2R5dWtq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <Instagram className="hover:text-red-600" />
          </a>
          <a
            href="https://www.linkedin.com/in/bahodir-soft/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <Linkedin className="hover:text-blue-400" />
          </a>
          <a
            href="https://t.me/yetti_tech"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500"
          >
            <FaTelegramPlane className="hover:text-blue-400" size={25} />
          </a>
        </div>
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
    </div>
  );
};

export default memo(Footer);
