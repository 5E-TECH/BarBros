import LoginImg from "../../../shared/assets/login.png";
import { useNavigate } from "react-router-dom";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useLogin } from "./service/useLogin";
import { useDispatch } from "react-redux";
import { setToken } from "./store/tokenSlice";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const { signinUser } = useLogin()


  const handleSignin = () => {
    const data = {
      email: username,
      password: password
    }
    signinUser.mutate(data, {
      onSuccess: (res:any) => {
        const token = res?.data?.acsesToken; 
        console.log(token);
        dispatch(setToken(token));
        navigate("/")
      }
    })
  }





  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      // navigate("/");
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
    <div className="py-[60px] sm:py-[90px] bg-[#0a0a0a] min-h-screen flex items-center">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 gap-10">
        <img
          className="w-[300px] sm:w-[400px] md:w-[550px] lg:w-[593px] h-auto object-contain"
          src={LoginImg}
          alt="Login"
        />

        <div className="flex flex-col text-white max-w-[400px] w-full">
          <h1 className="font-[600] text-[22px] sm:text-[26px] leading-[32px] mb-1 text-center md:text-left">
            BarBrosga Xush Kelibsiz ! 👋
          </h1>
          <p className="font-normal text-[14px] sm:text-[15px] mb-[30px] text-center md:text-left">
            Iltimos, hisobingizga kiring
          </p>

          <form className="flex flex-col" onSubmit={handleLogin}>
            <div className="mb-[15px]">
              <h2 className="font-normal text-[13px] mb-[5px]">Foydalanuvchi nom</h2>
              <input
                className="w-full h-[36px] bg-white/90 text-black rounded-[5px] px-3 outline-none"
                type="text"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />
            </div>

            <div className="mb-[15px]">
              <div className="flex items-center justify-between">
                <h2 className="font-normal text-[13px] mb-[5px]">Parol</h2>
                <h3
                  className="text-[#FA8B00] text-[13px] cursor-pointer"
                  onClick={handleForgotPassword}
                >
                  Parolni unutdingizmi ?
                </h3>
              </div>
              <input
                className="w-full h-[36px] bg-white/90 text-black rounded-[5px] px-3 outline-none"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="flex items-center gap-[8px] mt-[15px] mb-[15px]">
              <label className="flex items-center gap-[8px] text-[13px]">
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

            <button
              onClick={() => handleSignin()}
              className="w-full h-[40px] bg-[#FA8B00] text-white font-medium text-[15px] rounded-[6px] mb-[15px] hover:bg-[#ff9c1a] transition"
              type="submit"
            >
              Kirish
            </button>
          </form>

          <h2 className="text-[14px] sm:text-[15px] text-center">
            Ro’yxatdan o’tmaganmisiz?{" "}
            <span
              className="text-[#FA8B00] cursor-pointer"
              onClick={handleRegister}
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
