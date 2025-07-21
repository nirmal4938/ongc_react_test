import { MouseEvent } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  children: JSX.Element | string;
  variant?: "gray" | "primary" | "primaryBorder" | null;
  onClickHandler?: (e: MouseEvent<HTMLElement>) => void;
  loader?: boolean;
  disabled?: boolean;
  className?: string;
  parentClass?: string;
  icon?: JSX.Element;
  iconParentClass?: string;
}

const Button = (props: ButtonProps) => {
  return (
    <>
      <div className={`input-item relative ${props.parentClass}`}>
        <button
          type={props.type}
          disabled={props.disabled || props.loader}
          className={`
          flex items-center justify-center py-11px px-15px text-13px/16px font-semibold rounded-md transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-offset-2  border border-solid
          ${
            props.variant === "gray"
              ? "focus:ring-black/20 bg-transparent hover:bg-white text-black/50 border-black/20"
              : ""
          }
          ${
            props.variant === "primary"
              ? "focus:ring-primaryRed bg-primaryRed hover:bg-primaryRed/80 text-white border-primaryRed"
              : ""
          }
          ${
            props.variant === "primaryBorder"
              ? "focus:ring-primaryRed bg-transparent hover:bg-primaryRed text-primaryRed border-primaryRed hover:text-white"
              : ""
          }
          ${props.className ? props.className : ""}`}
          onClick={props.onClickHandler}
        >
          {props.icon && <span className={`inline-block mr-1.5 ${props.iconParentClass ? props.iconParentClass : ''}`}>{props.icon}</span>}
          {props.children}
          {props.loader && (
            <div className="flex rounded-full items-center ms-2 bg-inputBorder z-30">
              <div
                className={`spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-current border-r-current border-b-current border-l-white/0 `}
                role="status"
              ></div>
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default Button;
