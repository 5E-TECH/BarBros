import { memo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import PrimaryButton from "../../shared/components/button";
import FormPopup from "../../shared/components/popup";

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
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    phone_number: "",
    address: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form:", form);
    setShow(false);
  };

  const inputs = [
    {
      name: "name",
      label: "Ism",
      value: form.name,
      placeholder: "Ismingizni kiriting",
    },
    {
      name: "familiya",
      label: "Familiya",
      value: form.surname,
      placeholder: "Familiyangizni kiriting",
    },
    {
      name: "username",
      label: "Username",
      value: form.username,
      placeholder: "Usernameni kiriting",
    },
    {
      name: "password",
      label: "Parol",
      value: form.password,
      placeholder: "Passwordni kiriting",
    },
    {
      name: "phone_number",
      label: "Telefon",
      value: form.phone_number,
      placeholder: "Telefon kiriting",
    },
    {
      name: "address",
      label: "Manzil",
      value: form.address,
      placeholder: "Manzilni kiriting",
    },
  ];

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj as FileType);
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUploadChange: UploadProps["onChange"] = ({ fileList }) =>
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
    <div>
      <div className="flex gap-12">
        <div className="w-[300px] bg-[#14151F] py-8 rounded-2xl flex flex-col items-center">
          <div className="mb-[10px]">
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleUploadChange}
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

        <div className="w-[800px] bg-[#14151F] py-8 px-6 rounded-2xl flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className="pb-1 text-gray-400 text-sm">Ism</span>
              <div className="w-full py-1 px-2 rounded-md border border-[#DBDADE] text-white">
                Bahodir
              </div>
            </div>

            <div className="flex flex-col">
              <span className="pb-1 text-gray-400 text-sm">Familiya</span>
              <div className="w-full py-1 px-2 rounded-md border border-[#DBDADE] text-white">
                Nabijanov
              </div>
            </div>

            <div className="flex flex-col">
              <span className="pb-1 text-gray-400 text-sm">Username</span>
              <div className="w-full py-1 px-2 rounded-md border border-[#DBDADE] text-white">
                Hucker
              </div>
            </div>

            <div className="flex flex-col">
              <span className="pb-1 text-gray-400 text-sm">Parol</span>
              <div className="w-full py-1 px-2 rounded-md border border-[#DBDADE] text-white">
                1230
              </div>
            </div>

            <div className="flex flex-col">
              <span className="pb-1 text-gray-400 text-sm">Telefon</span>
              <div className="w-full py-1 px-2 rounded-md border border-[#DBDADE] text-white">
                +998 90 123 45 67
              </div>
            </div>

            <div className="flex flex-col">
              <span className="pb-1 text-gray-400 text-sm">Hudud</span>
              <div className="w-full py-1 px-2 rounded-md border border-[#DBDADE] text-white">
                Toshkent
              </div>
            </div>
          </div>

          <PrimaryButton className="mt-4" onClick={() => setShow(true)}>
            Edit
          </PrimaryButton>
        </div>
      </div>

      <FormPopup
        isShow={show}
        title="Profilni tahrirlash"
        inputs={inputs}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={() => setShow(false)}
      />
    </div>
  );
};

export default memo(Profile);
