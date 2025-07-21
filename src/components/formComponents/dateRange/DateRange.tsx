import { InputCalendarIcon } from "@/components/svgIcons";
import { Dispatch, SetStateAction, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangeProps {
  parentClass?: string;
  className?: string;
  dateFilter?: { startDate: Date; endDate: Date };
  setDateFilter?: Dispatch<SetStateAction<{ startDate: Date; endDate: Date }>>;
  inputParentClass?: string;
}

const DateRange = (props: DateRangeProps) => {
  const [startDate, setStartDate] = useState<Date>(
    props?.dateFilter?.startDate ? props?.dateFilter?.startDate : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    props?.dateFilter?.endDate ? props?.dateFilter?.endDate : new Date()
  );
  return (
    <>
      <div className={`${props.parentClass ? props.parentClass : ""} relative`}>
        <div className="flex flex-wrap gap-4">
          <div
            className={`flex items-center w-full ${
              props.inputParentClass ? props.inputParentClass : ""
            }`}
          >
            <label className="block text-13px/4 text-left font-semibold whitespace-nowrap mr-6px w-[70px]">
              Start Date
            </label>
            <div className="relative max-w-[calc(100%_-_75px)] w-full">
              <ReactDatePicker
                dateFormat={"dd/MM/yyyy"}
                className={`max-w-full bg-white py-11px px-15px pr-6 bg-transparent text-sm/18px font-semibold text-black placeholder:text-black/50 w-full border border-solid border-customGray/20 rounded-10 transition-all duration-300  focus:ring-2 focus:ring-customGray/30 focus:ring-offset-2 ${
                  props.className ? props.className : ""
                }`}
                selected={startDate}
                onChange={(date) => {
                  if (date) {
                    props.setDateFilter?.({
                      endDate: endDate,
                      startDate: date ? date : startDate,
                    });
                    setStartDate(date);
                  }
                }}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                selectsStart
                startDate={startDate}
                endDate={endDate}
              />
              <span className="inline-block w-18px h-18px text-black/40 pointer-events-none top-1/2 -translate-y-1/2 absolute right-3">
                <InputCalendarIcon className="w-full h-full" />
              </span>
            </div>
          </div>
          <div
            className={`flex items-center w-full ${
              props.inputParentClass ? props.inputParentClass : ""
            }`}
          >
            <label className="block text-13px/4 text-left font-semibold whitespace-nowrap mr-6px w-[70px]">
              End Date
            </label>
            <div className="relative max-w-[calc(100%_-_75px)] w-full">
              <ReactDatePicker
                dateFormat={"dd/MM/yyyy"}
                className={`max-w-full bg-white py-11px px-15px pr-6 bg-transparent text-sm/18px font-semibold text-black placeholder:text-black/50 w-full border border-solid border-customGray/20 rounded-10 transition-all duration-300  focus:ring-2 focus:ring-customGray/30 focus:ring-offset-2 ${
                  props.className ? props.className : ""
                }`}
                selected={endDate}
                onChange={(date) => {
                  if (date) {
                    props.setDateFilter?.({
                      endDate: date ? date : endDate,
                      startDate: startDate,
                    });
                    setEndDate(date);
                  }
                }}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
              <span className="inline-block w-18px h-18px text-black/40 pointer-events-none top-1/2 -translate-y-1/2 absolute right-3">
                <InputCalendarIcon className="w-full h-full" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DateRange;
