import "./style.css"
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
        <section className="register">
            <div className="container register__container">
                <img className="register__img" src={RegisterImg} alt="register" />
                <div className="register__content">
                    <h2 className="register__title">Ro’yxatdan o’tishni boshlang 🚀</h2>

                    <form className="register__form" onSubmit={handleSubmit}>
                        <div className="register__input">
                            <h3 className="register__sub-title">Ism</h3>
                            <input
                                className="register__input-btn"
                                type="text"
                                value={firstName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="register__input">
                            <h3 className="register__sub-title">Familiya</h3>
                            <input
                                className="register__input-btn"
                                type="text"
                                value={lastName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="register__input">
                            <h3 className="register__sub-title">Foydalanuvchi nomi</h3>
                            <input
                                className="register__input-btn"
                                type="text"
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="register__input">
                            <h3 className="register__sub-title">Telefon raqam</h3>
                            <input
                                className="register__input-btn"
                                type="text"
                                value={phone}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="register__input">
                            <h3 className="register__sub-title">Parol</h3>
                            <input
                                className="register__input-btn"
                                type="password"
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="register__row">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setAgree(e.target.checked)}
                            />
                            <h4 className="register__sub2-title">
                                Men{" "}
                                <span className="register__span">maxfiylik siyosati</span> va shartlariga roziman
                            </h4>
                        </div>

                        <button className="register__btn" type="submit">
                            Ro’yxatdan o’tish
                        </button>
                    </form>

                    <h4 className="register__sub3-title">
                        Hisobingiz bormi?{" "}
                        <span
                            className="register__span"
                            onClick={handleLoginRedirect}
                            style={{ cursor: "pointer" }}
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
