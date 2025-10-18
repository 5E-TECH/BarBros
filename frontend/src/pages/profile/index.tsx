import { memo, useEffect, useState } from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { Eye, EyeOff } from 'lucide-react';

type ProfileData = {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  username: string;
  address: string;
  image?: string;
};

interface ProfileProps {
  data?: ProfileData | null;
}

const Profile = ({ data }: ProfileProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (data?.image) {
      setFileList([
        {
          uid: "-1",
          name: "avatar.png",
          status: "done",
          url: data.image,
        },
      ]);
    }
  }, [data]);

  const onChange: UploadProps["onChange"] = ({ fileList: newList }) => {
    setFileList(newList.slice(-1));
  };

  const onPreview = async (file: UploadFile) => {
    const src = file.url || (file.preview as string);
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="rounded-lg text-white">
      <h2 className="text-[18px] font-semibold mb-[6px]">Profile</h2>

      <div>
        <div className="flex items-center gap-6 mb-6">
          <ImgCrop rotationSlider>
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              maxCount={1}
            >
              {fileList.length === 0 && "+ Upload"}
            </Upload>
          </ImgCrop>

          <div>
            <p className="text-lg font-medium">
              {data?.firstName} {data?.lastName}
            </p>
            <p className="text-sm text-gray-400">{data?.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 text-sm">Ism</label>
            <input
              name="firstName"
              value={data?.firstName}
              placeholder="Ism"
              className="w-full border border-[#DBDADE] bg-transparent pl-[14px] py-[7px] rounded-[6px] outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Familiya</label>
            <input
              name="lastName"
              value={data?.lastName}
              placeholder="Familiya"
              className="w-full border border-[#DBDADE] bg-transparent pl-[14px] py-[7px] rounded-[6px] outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Telefon raqam</label>
            <input
              name="phone"
              value={data?.phone}
              placeholder="+998..."
              className="w-full border border-[#DBDADE] bg-transparent pl-[14px] py-[7px] rounded-[6px] outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Username</label>
            <input
              name="username"
              value={data?.username}
              placeholder="username"
              className="w-full border border-[#DBDADE] bg-transparent pl-[14px] py-[7px] rounded-[6px] outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Parol</label>
            <input
              name="password"
              value={data?.password}
              placeholder="Parol"
              type="password"
              className="w-full border border-[#DBDADE] bg-transparent pl-[14px] py-[7px] rounded-[6px] outline-none"
            />
            <div onClick={() => setShow(!show)}>

            {show ? <Eye/> : <EyeOff/>}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Manzilni kiriting</label>
            <input
              name="address"
              value={data?.address}
              placeholder="Manzil"
              className="w-full border border-[#DBDADE] bg-transparent pl-[14px] py-[7px] rounded-[6px] outline-none"
            />
          </div>
        </div>

        <div className="flex gap-[16px]">
          <button className="bg-[#FA8B00] px-[20px] py-[10px] rounded-[6px] font-medium text-[15px] cursor-pointer">
            O'zgarishlarni saqlash
          </button>
          <button className="bg-[#2d2e36] px-[20px] py-[10px] rounded-[6px] font-medium text-[15px] cursor-pointer">
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Profile);
