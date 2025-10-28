import { memo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import PrimaryButton from "../dashboard/lib/button";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Profile = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj as FileType);
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) =>
    setFileList(fileList.slice(-1));

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="flex gap-12">
      <div className="w-[300px] bg-[#14151F] py-8 rounded-2xl flex flex-col items-center">
        <div className="mb-[10px]">
          <Upload
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (v) => setPreviewOpen(v),
                afterOpenChange: (v) => !v && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
        <h4 className="text-[22px] mb-[5px] font-medium">Bahodir</h4>
        <span className="bg-[#184034] text-[#0bc062] px-2 py-1 rounded-2xl">
          active
        </span>
      </div>

      <div className="w-[300px] bg-[#14151F] py-8 px-6 rounded-2xl flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="pb-1 text-gray-400 text-sm">Ism</span>
            <div className="w-full py-1 px-2 rounded-md bg-[#0A0B16] text-white">
              Bahodir
            </div>
          </div>

          <div className="flex flex-col">
            <span className="pb-1 text-gray-400 text-sm">Familiya</span>
            <div className="w-full py-1 px-2 rounded-md bg-[#0A0B16] text-white">
              Nabijanov
            </div>
          </div>

          <div className="flex flex-col">
            <span className="pb-1 text-gray-400 text-sm">Telefon</span>
            <div className="w-full py-1 px-2 rounded-md bg-[#0A0B16] text-white">
              +998 90 123 45 67
            </div>
          </div>

          <div className="flex flex-col">
            <span className="pb-1 text-gray-400 text-sm">Hudud</span>
            <div className="w-full py-1 px-2 rounded-md bg-[#0A0B16] text-white">
              Toshkent
            </div>
          </div>
        </div>

        <PrimaryButton className="mt-4">Edit</PrimaryButton>
      </div>
    </div>
  );
};

export default memo(Profile);

// import { memo, useEffect, useState } from "react";
// import { Upload } from "antd";
// import type { UploadFile, UploadProps } from "antd";
// import ImgCrop from "antd-img-crop";
// import { Eye, EyeOff, Edit } from "lucide-react";

// type ProfileData = {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   password: string;
//   username: string;
//   address: string;
//   image?: string;
// };

// interface ProfileProps {
//   data?: ProfileData | null;
// }

// const Profile = ({ data }: ProfileProps) => {
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [show, setShow] = useState(false);
//   const [editMode, setEditMode] = useState(false);

//   useEffect(() => {
//     if (data?.image) {
//       setFileList([
//         {
//           uid: "-1",
//           name: "avatar.png",
//           status: "done",
//           url: data.image,
//         },
//       ]);
//     }
//   }, [data]);

//   const onChange: UploadProps["onChange"] = ({ fileList: newList }) => {
//     setFileList(newList.slice(-1));
//   };

//   const onPreview = async (file: UploadFile) => {
//     const src = file.url || (file.preview as string);
//     const image = new Image();
//     image.src = src;
//     const imgWindow = window.open(src);
//     imgWindow?.document.write(image.outerHTML);
//   };

//   return (
//     <div className="rounded-lg text-white">
//       <h2 className="text-[18px] font-semibold mb-[6px]">Profile</h2>

//       <div>
//         <div className="flex items-center gap-6 mb-6">
//           <ImgCrop rotationSlider>
//             <Upload
//               listType="picture-circle"
//               fileList={fileList}
//               onChange={onChange}
//               onPreview={onPreview}
//               maxCount={1}
//             >
//               {fileList.length === 0 && "+ Upload"}
//             </Upload>
//           </ImgCrop>

//           <div>
//             <p className="text-lg font-medium">
//               {data?.firstName} {data?.lastName}
//             </p>
//             <p className="text-sm text-gray-400">{data?.username}</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6 mb-6">
//           {[
//             { label: "Ism", value: data?.firstName },
//             { label: "Familiya", value: data?.lastName },
//             { label: "Telefon raqam", value: data?.phone },
//             { label: "Username", value: data?.username },
//             { label: "Parol", value: show ? data?.password : "********" },
//             { label: "Manzil", value: data?.address },
//           ].map((field, i) => (
//             <div key={i}>
//               <label className="block mb-2 text-sm">{field.label}</label>

//               {editMode ? (
//                 <input
//                   defaultValue={field.value}
//                   className="w-full border border-[#DBDADE] bg-transparent pl-[14px] py-[7px] rounded-[6px] outline-none"
//                 />
//               ) : (
//                 <div className="w-full border border-[#DBDADE] bg-[#1f2027] text-gray-200 pl-[14px] py-[7px] rounded-[6px]">
//                   {field.value || "-"}
//                 </div>
//               )}

//               {field.label === "Parol" && (
//                 <div
//                   onClick={() => setShow(!show)}
//                   className="absolute ml-[90%] -mt-7 cursor-pointer"
//                 >
//                   {show ? <Eye size={16} /> : <EyeOff size={16} />}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="flex gap-[16px]">
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="bg-[#FA8B00] px-[20px] py-[10px] rounded-[6px] font-medium text-[15px] cursor-pointer flex items-center gap-2"
//             >
//               <Edit size={16} /> Edit
//             </button>
//           ) : (
//             <>
//               <button className="bg-[#FA8B00] px-[20px] py-[10px] rounded-[6px] font-medium text-[15px] cursor-pointer">
//                 O'zgarishlarni saqlash
//               </button>
//               <button
//                 onClick={() => setEditMode(false)}
//                 className="bg-[#2d2e36] px-[20px] py-[10px] rounded-[6px] font-medium text-[15px] cursor-pointer"
//               >
//                 Bekor qilish
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default memo(Profile)
