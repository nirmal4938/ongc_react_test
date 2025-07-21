import "react-quill/dist/quill.snow.css";

import { DefaultTFuncReturn } from "i18next";
import { ErrorMessage } from "formik";
import ReactQuill from "react-quill";
import _ from "lodash";
import { useEffect, useRef } from "react";

interface IReactQuillField {
  value: string;
  setFieldValue?: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
  name: string;
  label?: DefaultTFuncReturn | string;
  isCompulsory?: boolean;
  parentClass?: string;
  setFieldTouched?: (
    field: string,
    isTouched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => void;
}

const ReactQuillComponent = ({
  value,
  setFieldValue,
  name,
  label,
  isCompulsory,
  parentClass,
  setFieldTouched,
}: IReactQuillField) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.innerHTML = highlightMatches(value);
    }
  }, [value]);
  const header = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "align",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "video",
  ];

  const highlightMatches = (content: string) => {
    const regex = /\[([^\]]+)\]/g;
    return content.replaceAll(regex, (match: string) =>
      match
        ? `<strong>${match}</strong>`
        : content
    );
  };
  return (
    <>
      <div className={`input-item custom-editor ${parentClass ?? ""} relative`}>
        {label && (
          <>
            <label className="block mb-10px text-sm/18px text-left font-semibold">
              {label}
              {isCompulsory && <span className="text-red">*</span>}
            </label>
          </>
        )}
        <ReactQuill
          className=""
          theme="snow"
          modules={header}
          onChange={(content: string) => {
            setFieldValue ? setFieldValue(name, _.unescape(content)) : "";
          }}
          defaultValue={highlightMatches(value)}
          formats={formats}
          onBlur={() => {
            if (setFieldTouched) setFieldTouched(name, true, true);
          }}
        />
        <ErrorMessage name={name}>
          {(msg) => (
            <div className="fm_error text-tomatoRed font-semibold text-sm pt-[2px] font-BinerkaDemo">
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    </>
  );
};

export default ReactQuillComponent;
