import { CrossIcon, EditPenIcon } from "@/components/svgIcons";
import { VITE_APP_API_URL } from "@/config";

import { ChangeEvent, useEffect, useRef, useState } from "react";

interface FileInputProps {
  acceptTypes?: string;
  parentClass?: string;
  setValue: (
    field: string,
    value: (string | File)[] | File | null,
    shouldValidate?: boolean
  ) => void;
  name: string;
  value: File | string;
  label?: string;
  isCompulsory?: boolean;
  isImage?: boolean;
  isBigRadius?: boolean;
}
const ProfilePictureUpload = ({
  parentClass,
  setValue,
  name,
  value,
  label,
  acceptTypes,
  isCompulsory = false,
  isBigRadius = false,
}: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [source, setSource] = useState<string>();

  const removeFile = () => {
    if (inputRef?.current) inputRef.current.value = "";
    setValue(name, null);
  };

  useEffect(() => {
    if (typeof value === "string") {
      setSource(VITE_APP_API_URL + value);
    } else if (value) {
      setSource(window?.URL?.createObjectURL(value));
    } else {
      setSource("/assets/images/user.jpg");
    }
  }, [value]);
  return (
    <>
      <div className={`relative ${parentClass ?? ""}`}>
        {label && (
          <label className="block mb-10px text-sm/18px text-left font-semibold">
            {label}
            {isCompulsory && <span className="text-red">*</span>}
          </label>
        )}
        <div
          className={`${
            isBigRadius ? "w-32 h-32" : "w-24 h-24"
          } rounded-full relative mx-auto border-2 border-solid border-primaryRed p-1`}
        >
          <img
            src={source}
            className="w-full h-full object-contain rounded-full"
            width={96}
            height={96}
            alt=""
          />
          <input
            type="file"
            name=""
            id="ProfileIMG"
            hidden
            ref={inputRef}
            accept={acceptTypes}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (event?.target?.files && event?.target?.files.length) {
                setValue(name, event.target.files[0]);
              }
            }}
          />
          {!value && (
            <label
              htmlFor="ProfileIMG"
              className="inline-flex items-center justify-center cursor-pointer active:scale-90 transition-all absolute top-2 right-0 w-6 h-6 rounded-full bg-primaryRed p-1 text-white shadow-md"
            >
              <EditPenIcon />
            </label>
          )}
          {value && (
            <label className="inline-flex items-center justify-center cursor-pointer active:scale-90 transition-all absolute top-2 right-0 w-6 h-6 rounded-full bg-primaryRed p-1 text-white shadow-md">
              <span onClick={() => removeFile()}>
                <CrossIcon />
              </span>
            </label>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePictureUpload;
