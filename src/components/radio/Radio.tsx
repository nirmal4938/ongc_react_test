import { ChangeEvent } from "react";

interface CheckBoxProps {
  parentClass?: string;
  inputClass?: string;
  labelClass?: string;
  label?: string;
  id?: string;
  checked?: boolean;
  value?: string | number;
  name?: string;
  onChangeHandler?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Radio = (props: CheckBoxProps) => {
  return (
    <>
      <div
        className={`${
          props.parentClass ? props.parentClass : ""
        } relative flex`}
      >
        <input
          type="radio"
          name={props.name}
          checked={props.checked}
          value={props.value}
          className="appearance-none w-3 h-3 mt-0.5 outline outline-2 outline-black/50 border-2 border-solid border-white rounded-full transition-all duration-300 checked:bg-primaryRed checked:outline-primaryRed cursor-pointer active:scale-90 focus:ring-2 focus:ring-offset-4 focus:ring-primaryRed/50"
          id={props.id ? props.id : ""}
          onChange={props.onChangeHandler}
        />
        <label
          htmlFor={props.id ? props.id : ""}
          className={`text-sm/18px text-black/50 font-semibold max-w-[calc(100%_-_16px)] cursor-pointer pl-2 ${
            props.labelClass ? props.labelClass : ""
          }`}
        >
          {props.label}
        </label>
      </div>
    </>
  );
};

export default Radio;
