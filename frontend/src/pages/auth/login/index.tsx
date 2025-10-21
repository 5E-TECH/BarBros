import "./style.css";
import LoginImg from "../../../shared/assets/login.png";
import { useNavigate } from "react-router-dom";
import { useState, type FormEvent, type ChangeEvent } from "react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      navigate("/");
    } else {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
    }
  };

  const handleForgotPassword = () => {
    alert("Parolni tiklash funksiyasi hali qo‘shilmagan.");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login">
      <div className="container login__container">
        <img className="login__img" src={LoginImg} alt="Login" />
        <div className="login__content">
          <h1 className="login__title">BarBrosga Xush Kelibsiz ! 👋</h1>
          <p className="login__text">Iltimos, hisobingizga kiring</p>

          <form className="login__form" onSubmit={handleLogin}>
            <div className="login__input">
              <h2 className="login__sub-title">Foydalanuvchi nom</h2>
              <input
                className="login__input-btn"
                type="text"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />
            </div>

            <div className="login__input">
              <div className="login__row">
                <h2 className="login__sub-title">Parol</h2>
                <h3
                  className="login__sub2-title"
                  onClick={handleForgotPassword}
                  style={{ cursor: "pointer" }}
                >
                  Parolni unutdingizmi ?
                </h3>
              </div>
              <input
                className="login__input-btn"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="login__row2">
              <label
                className="login__sub-title"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRemember(e.target.checked)
                  }
                />
                Eslab qolish
              </label>
            </div>

            <button className="login__btn" type="submit">
              Kirish
            </button>
          </form>

          <h2 className="login__sub3-title">
            Ro’yxatdan o’tmaganmisiz?{" "}
            <span
              className="login__title-span"
              onClick={handleRegister}
              style={{ cursor: "pointer" }}
            >
              Hisob yaratish
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
