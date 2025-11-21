  import { memo } from "react";
  import { testData } from "../../../../shared/types";

  type BookingData = {
    time: string;
    fullname: string;
    phone: string;
    date: string;
  };

  // interface BookingProps {
  //   datas?: BookingData[] | null;
  // }

  const Booking = () => {
    
    const datt = testData

    return (
      <div>
        {datt.map((data: BookingData, index) => (
          <div
            key={index}
            className="mb-[15px] px-[24px] py-[16px] bg-[#14151F] rounded-lg text-white"
          >
          <div>
            <p className="font-bold text-[16px] mb-[20px]">{data.time}</p>
            <div className="flex font-normal text-[16px]">
              <h3 className="border-r pr-8">{data.fullname}</h3>
              <p className="border-r px-8">{data.phone}</p>
              <span className="pl-8">{data.date}</span>
            </div>
          </div>
          </div>
        ))}
      </div>
    );
  };

  export default memo(Booking);
