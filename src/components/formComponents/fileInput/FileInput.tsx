import { CrossIcon, FileIcon } from "@/components/svgIcons";
import { VITE_APP_API_URL } from "@/config";
import { ErrorMessage } from "formik";

import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

interface FileInputProps {
  acceptTypes?: string;
  parentClass?: string;
  removeDisabled?: boolean;
  setValue: (
    field: string,
    value: (string | File)[] | File | null,
    shouldValidate?: boolean
  ) => void;
  name: string;
  isMulti?: boolean;
  value: File | string | Array<File | string> | null;
  label?: string;
  isCompulsory?: boolean;
  isImage?: boolean;
  onFileUpload?: (file: File) => Promise<void>;
}
const FileInput = ({
  parentClass,
  setValue,
  isImage = true,
  name,
  isMulti = false,
  value,
  label,
  removeDisabled = false,
  acceptTypes,
  isCompulsory = false,
  onFileUpload,
}: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className={`relative ${parentClass ? parentClass : ""}`}>
        <div className="inner relative">
          {label && (
            <label className="block mb-10px text-sm/18px text-left font-semibold">
              {label}
              {isCompulsory && <span className="text-red">*</span>}
            </label>
          )}

          {!value ? (
            <>
              <input
                type="file"
                ref={inputRef}
                id="inputFile"
                accept={acceptTypes}
                name=""
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  if (
                    isMulti === false &&
                    event.target.files &&
                    event.target.files[0]
                  ) {
                    setValue(name, event.target.files[0]);
                    onFileUpload?.(event.target.files[0]);
                  }
                }}
                hidden
              />

              <label
                htmlFor="inputFile"
                className={`flex flex-col items-center justify-center w-full bg-white border border-dashed border-black/30 rounded-md cursor-pointer active:scale-95 min-h-[120px] p-2 transition-all duration-300`}
              >
                <>
                  <span className="block text-base/5 font-semibold pointer-events-none h-fit text-center">
                    Select file
                  </span>
                  <span className="block text-sm/4 text-black/50 mt-2 font-medium pointer-events-none h-fit text-center">
                    {isImage
                      ? "Drop images here to upload"
                      : "Drop files here to upload"}
                  </span>
                </>
              </label>
            </>
          ) : (
            <label
              htmlFor=""
              className={`flex flex-col items-center justify-center w-full bg-white border border-dashed border-black/30 rounded-md cursor-pointer active:scale-95 min-h-[120px] p-2 transition-all duration-300`}
            >
              <>
                <div
                  className={`mt-4 ${
                    isImage
                      ? " grid gap-3 grid-cols-[repeat(auto-fill,_minmax(56px,_1fr))]"
                      : " max-w-[300px]"
                  }`}
                >
                  {value && (
                    <FileList
                      value={value as File | string}
                      name={name}
                      removeDisabled={removeDisabled}
                      setValue={setValue}
                      Ref={inputRef}
                      isImage={isImage}
                    />
                  )}
                </div>
              </>
            </label>
          )}
        </div>

        <ErrorMessage name={name}>
          {(msg) => (
            <div className="fm_error text-red text-sm pt-[2px] font-BinerkaDemo">
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    </>
  );
};

export const FileList = ({
  value,
  name,
  removeDisabled,
  setValue,
  Ref,
  isImage,
}: {
  value: File | string;
  name: string;
  removeDisabled?: boolean;
  setValue: (
    field: string,
    value: (string | File)[] | File | null,
    shouldValidate?: boolean
  ) => void;
  Ref?: MutableRefObject<HTMLInputElement | null>;
  isImage?: boolean;
}) => {
  const [source, setSource] = useState<string>();

  const removeFile = () => {
    if (Ref?.current) {
      Ref.current.value = "";
    }
    setValue(name, null);
  };

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setSource(VITE_APP_API_URL + value);
      } else {
        setSource(window?.URL?.createObjectURL(value));
      }
    } else {
      setSource("");
    }
  }, [value]);

  return (
    <div
      className={`relative bg-white rounded-md ${
        isImage ? "min-h-[56px]" : " flex flex-col gap-4"
      }`}
    >
      {isImage ? (
        <img
          src={source}
          className="rounded-md w-full h-full object-contain"
          width={"80"}
          height={"80"}
          alt=""
        />
      ) : (
        <>
          {/* <span className="text-sm/5 font-semibold max-w-[calc(100%_-_100px)] w-full mx-auto">
        {typeof value !== "string"
            ? value.name
            : value.split("/")[value.split("/").length - 1] ?? "file"}
        </span> */}
          <div className="flex w-full bg-black/10 p-1 items-center border-b border-solid border-black/05 last:border-none rounded-lg">
            <div className="relative w-12 h-12 bg-white rounded-md">
              <FileIcon className="w-full h-full p-2 text-black/70" />
            </div>
            <p className="text-sm/5 font-semibold max-w-[calc(100%_-_100px)] w-full mx-auto truncate">
              {typeof value !== "string"
                ? value.name
                : value.split("/")[value.split("/").length - 1] ?? "file"}
            </p>
            {!removeDisabled && (
              <span
                onClick={() => removeFile()}
                className="icon mx-auto select-none inline-block w-5 h-5 bg-red hover:bg-tomatoRed text-white p-1.5 rounded-full cursor-pointer"
              >
                <CrossIcon className="w-full h-full" />
              </span>
            )}
          </div>
        </>
      )}
      {isImage && value && (
        <span
          className="icon absolute -top-1 -right-1 select-none inline-block w-4 h-4 bg-red hover:bg-tomatoRed text-white p-1 rounded-full cursor-pointer"
          onClick={() => removeFile()}
        >
          <CrossIcon className="w-full h-full" />
        </span>
      )}
    </div>
  );
};

export default FileInput;
