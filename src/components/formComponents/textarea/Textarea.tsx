import { ErrorMessage, useField } from "formik";
import { ReactElement, ReactNode } from "react";

import { DefaultTFuncReturn } from "i18next";

interface TextareaProps {
  parentClass?: string;
  type: string;
  extraElement?: ReactNode;
  label?: DefaultTFuncReturn | string;
  name: string;
  disabled?: boolean;
  placeholder?: string | DefaultTFuncReturn;
  icon?: ReactElement;
  className?: string;
  isCompulsory?: boolean;
  smallFiled?: boolean;
}

const Textarea = (props: TextareaProps) => {
  const [field] = useField(props.name);
  return (
    <>
      <div
        className={`input-item relative ${
          props.parentClass ? props.parentClass : ""
        }`}
      >
        {props.label && (
          <label className="block mb-10px text-sm/18px text-left font-semibold">
            {props.label}
            {props.isCompulsory && <span className="text-red">*</span>}
          </label>
        )}

        <textarea
          className={`
        ${props.className ? props.className : ""}
        ${props.smallFiled ? "py-11px px-15px" : " py-4 px-5"}
        text-sm/18px text-black placeholder:text-black/50 w-full border border-solid border-customGray/20 rounded-lg transition-all duration-300  focus:ring-2 focus:ring-customGray/30 focus:ring-offset-2
        `}
          {...field}
          value={field.value ?? ""}
          name={props.name}
          placeholder={props.placeholder ? props.placeholder : ""}
          disabled={props.disabled !== undefined ? props.disabled : false}
        ></textarea>
        <ErrorMessage name={props.name}>
          {(msg) => (
            <div className="fm_error text-red text-sm pt-[2px] font-BinerkaDemo">
              {msg}
            </div>
          )}
        </ErrorMessage>
        {props?.icon}
      </div>
    </>
  );
};

export default Textarea;
