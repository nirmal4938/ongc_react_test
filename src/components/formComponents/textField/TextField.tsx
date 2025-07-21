import { ErrorMessage, useField } from "formik";
import { ChangeEvent, ReactElement, ReactNode, WheelEvent } from "react";

import { DefaultTFuncReturn } from "i18next";

interface TextFieldProps {
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
  min?: number;
  max?: number;
  value?: string | number;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: any;
}

const TextField = (props: TextFieldProps) => {
  const numberInputOnWheelPreventChange = (e: WheelEvent) => {
    // Prevent the input value change
    (e.target as HTMLElement).blur();

    // Prevent the page/container scrolling
    e.stopPropagation();

    // Refocus immediately, on the next tick (after the current function is done)
    setTimeout(() => {
      (e.target as HTMLElement).focus();
    }, 0);
  };

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
        <input
          placeholder={props.placeholder ? props.placeholder : ""}
          type={props.type}
          {...field}
          name={props.name}
          min={props.min}
          max={props.max}
          value={props.value ? props.value : field.value ?? ""}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          {...(props.onChange ? { onChange: (e: ChangeEvent) => props.onChange(e) } : {})}
          autoComplete="new-password"
          disabled={props.disabled !== undefined ? props.disabled : false}
          className={`
          ${props.className ? props.className : ""}
          ${props.smallFiled ? "py-11px px-15px" : " py-4 px-5"}
          text-sm/18px text-black placeholder:text-black/50 w-full border border-solid border-customGray/20 rounded-lg transition-all duration-300  focus:ring-2 focus:ring-customGray/30 focus:ring-offset-2
          `}
          // onWheel={return false}
          onWheel={numberInputOnWheelPreventChange}
        />
        <ErrorMessage name={props.name}>
          {(msg) => (
            <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
              {msg}
            </div>
          )}
        </ErrorMessage>
        {props?.icon}
      </div>
    </>
  );
};

export default TextField;
