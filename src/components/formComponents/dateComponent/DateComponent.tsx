import { InputCalendarIcon } from "@/components/svgIcons";
import { DefaultTFuncReturn } from "i18next";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { ErrorMessage, useField } from "formik";
import "react-datepicker/dist/react-datepicker.css";

interface DateProps {
  parentClass?: string;
  label?: DefaultTFuncReturn | string;
  name: string;
  placeholder?: string | DefaultTFuncReturn;
  className?: string;
  isCompulsory?: boolean;
  smallFiled?: boolean;
  value?: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  onChange?: (date: Date | null) => void;
  dateFormat?: string;
  isDisabled?: boolean;
  timeIntervals?: number;
  showTimeSelect?: boolean;
  filterDate?: (date: Date) => boolean;
  openToDate?: boolean;
}

const DateComponent = (props: DateProps) => {
  const [field] = useField(props.name);
  const [, setStartDate] = useState<Date | null>();
  useEffect(() => {
    props.value && setStartDate(props.value);
  }, [props.value]);
  return (
    <>
      <div className={`${props.parentClass ? props.parentClass : ""} relative`}>
        <label className="block mb-10px text-sm/18px text-left font-semibold">
          {props.label}
          {props.isCompulsory && <span className="text-red">*</span>}
        </label>
        <div className="relative ReactDatePickerMianWrapper">
          <ReactDatePicker
            {...field}
            dateFormat={props.dateFormat || "dd/MM/yyyy"}
            maxDate={props.maxDate ? props.maxDate : undefined}
            name={props.name}
            filterDate={props.filterDate}
            timeIntervals={
              props.timeIntervals ? props.timeIntervals : undefined
            }
            showTimeSelect={
              props.showTimeSelect ? props.showTimeSelect : undefined
            }
            className={`
            ${props.className ? props.className : ""}
            ${props.smallFiled ? "py-11px px-15px" : " py-4 px-5"}
            text-sm/18px text-black placeholder:text-black/50 w-full border border-solid border-customGray/20 rounded-lg transition-all duration-300  focus:ring-2 focus:ring-customGray/30 focus:ring-offset-2
            `}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            minDate={props.minDate ? props.minDate : undefined}
            selected={props.value}
            onChange={(date) => {
              // if (date) setStartDate(date);
              if (props.onChange) props.onChange(date as Date | null);
            }}
            disabled={props.isDisabled}
            placeholderText={props.placeholder ? props.placeholder : ""}
            openToDate={
              props?.openToDate
                ? props.minDate
                  ? props.minDate
                  : undefined
                : undefined
            }
          />
          <span className="inline-block w-18px h-18px text-black/40 pointer-events-none top-1/2 -translate-y-1/2 absolute right-3">
            <InputCalendarIcon className="w-full h-full" />
          </span>
        </div>
        <ErrorMessage name={props.name}>
          {(msg) => (
            <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    </>
  );
};

export default DateComponent;
