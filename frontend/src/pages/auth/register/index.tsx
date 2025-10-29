import RegisterImg from "../../../shared/assets/register.png";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [agree, setAgree] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!firstName || !lastName || !username || !phone || !password) {
            alert("Iltimos, barcha maydonlarni to‘ldiring!");
            return;
        }

        if (!agree) {
            alert("Ro‘yxatdan o‘tishdan oldin shartlarga rozilik bildiring!");
            return;
        }

        navigate("/");
    };

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <section className="py-[60px] sm:py-[90px] bg-[#0a0a0a] min-h-screen flex items-center">
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 gap-10">
                <img
                    className="w-[300px] sm:w-[400px] md:w-[560px] h-auto object-contain"
                    src={RegisterImg}
                    alt="register"
                />

                <div className="flex flex-col text-white max-w-[400px] w-full">
                    <h2 className="font-semibold text-[22px] sm:text-[26px] leading-[36px] mb-[15px] text-center md:text-left">
                        Ro’yxatdan o’tishni boshlang 🚀
                    </h2>

                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        {[
                            { label: "Ism", value: firstName, set: setFirstName },
                            { label: "Familiya", value: lastName, set: setLastName },
                            { label: "Foydalanuvchi nomi", value: username, set: setUsername },
                            { label: "Telefon raqam", value: phone, set: setPhone },
                        ].map((field, idx) => (
                            <div key={idx} className="mb-[15px]">
                                <h3 className="font-normal text-[13px] mb-[5px]">{field.label}</h3>
                                <input
                                    className="w-full h-[36px] bg-white/90 text-black rounded-[5px] px-3 outline-none"
                                    type="text"
                                    value={field.value}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        field.set(e.target.value)
                                    }
                                />
                            </div>
                        ))}

                        <div className="mb-[15px]">
                            <h3 className="font-normal text-[13px] mb-[5px]">Parol</h3>
                            <input
                                className="w-full h-[36px] bg-white/90 text-black rounded-[5px] px-3 outline-none"
                                type="password"
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center gap-[5px] mb-[15px]">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setAgree(e.target.checked)
                                }
                            />
                            <h4 className="text-[14px] sm:text-[15px] leading-[22px]">
                                Men{" "}
                                <span className="text-[#FA8B00] cursor-pointer">
                                    maxfiylik siyosati
                                </span>{" "}
                                va shartlariga roziman
                            </h4>
                        </div>

                        <button
                            className="w-full h-[40px] bg-[#FA8B00] text-white font-medium text-[15px] rounded-[6px] mb-[15px] hover:bg-[#ff9c1a] transition"
                            type="submit"
                        >
                            Ro’yxatdan o’tish
                        </button>
                    </form>

                    <h4 className="text-[14px] sm:text-[15px] text-center">
                        Hisobingiz bormi?{" "}
                        <span
                            className="text-[#FA8B00] cursor-pointer"
                            onClick={handleLoginRedirect}
                        >
                            Tizimga kirish
                        </span>
                    </h4>
                </div>
            </div>
        </section>
    );
};

export default Register;
