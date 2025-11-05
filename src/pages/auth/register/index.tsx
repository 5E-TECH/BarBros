import RegisterImg from "../../../shared/assets/register.png"
import { useState, type FormEvent, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"

const Register: React.FC = () => {
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [agree, setAgree] = useState<boolean>(false)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!firstName || !lastName || !username || !phone || !password) {
            alert("Iltimos, barcha maydonlarni to‘ldiring!")
            return
        }

        if (!agree) {
            alert("Ro‘yxatdan o‘tishdan oldin shartlarga rozilik bildiring!")
            return
        }

        navigate("/")
    }

    const handleLoginRedirect = () => {
        navigate("/login")
    }

    return (
        <section className="py-[90px] bg-[#0a0a0a] min-h-screen">
            <div className="container mx-auto flex items-center justify-between px-6">
                <img
                    className="w-[560px] h-[811px] object-contain"
                    src={RegisterImg}
                    alt="register"
                />

                <div className="flex flex-col text-white">
                    <h2 className="font-semibold text-[26px] leading-[36px] mb-[15px]">
                        Ro’yxatdan o’tishni boshlang 🚀
                    </h2>

                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="mb-[15px]">
                            <h3 className="font-normal text-[13px] mb-[5px]">Ism</h3>
                            <input
                                className="w-[372px] h-[34px] rounded-[5px] bg-white/90 text-black px-2 outline-none"
                                type="text"
                                value={firstName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setFirstName(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-[15px]">
                            <h3 className="font-normal text-[13px] mb-[5px]">Familiya</h3>
                            <input
                                className="w-[372px] h-[34px] rounded-[5px] bg-white/90 text-black px-2 outline-none"
                                type="text"
                                value={lastName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setLastName(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-[15px]">
                            <h3 className="font-normal text-[13px] mb-[5px]">Foydalanuvchi nomi</h3>
                            <input
                                className="w-[372px] h-[34px] rounded-[5px] bg-white/90 text-black px-2 outline-none"
                                type="text"
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setUsername(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-[15px]">
                            <h3 className="font-normal text-[13px] mb-[5px]">Telefon raqam</h3>
                            <input
                                className="w-[372px] h-[34px] rounded-[5px] bg-white/90 text-black px-2 outline-none"
                                type="text"
                                value={phone}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setPhone(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-[15px]">
                            <h3 className="font-normal text-[13px] mb-[5px]">Parol</h3>
                            <input
                                className="w-[372px] h-[34px] rounded-[5px] bg-white/90 text-black px-2 outline-none"
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
                            <h4 className="text-[15px] leading-[22px]">
                                Men{" "}
                                <span className="text-[#FA8B00] cursor-pointer">
                                    maxfiylik siyosati
                                </span>{" "}
                                va shartlariga roziman
                            </h4>
                        </div>

                        <button
                            className="w-[372px] h-[38px] rounded-[6px] bg-[#FA8B00] text-white font-medium text-[15px] tracking-[0.43px] mb-[15px] hover:bg-[#ff9c1a] transition"
                            type="submit"
                        >
                            Ro’yxatdan o’tish
                        </button>
                    </form>

                    <h4 className="text-[15px] text-center">
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
    )
}

export default Register
