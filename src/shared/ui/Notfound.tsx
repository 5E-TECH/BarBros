import { memo } from "react";
import error from "../../shared/assets/error.png";

const Notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C0D14] text-white text-center">
      <h1 className="font-semibold text-3xl mb-2">Page Not Found :(</h1>
      <p className="font-normal text-sm mb-6">
        Oops! 😖 The requested URL was not found on this server.
      </p>
      <button className="bg-[#FA8B00] text-[15px] font-medium px-5 py-2 rounded-md hover:bg-[#ff9d33] transition">
        Verify my account
      </button>
      <img
        src={error}
        alt="404 Error Illustration"
        className="w-[225px] h-[500px] object-cover"
      />
    </div>
  );
};

export default memo(Notfound);
