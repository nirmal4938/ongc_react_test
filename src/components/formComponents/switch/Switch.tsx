interface SwitchProps {
  parantClass?: string;
  label?: string;
  onClick?: () => void;
}

const Switch = (props: SwitchProps) => {
  return (
    <>
      <div
        className={`flex self-center  ${
          props.parantClass ? props.parantClass : ""
        }`}
      >
        <div className="relative w-10 h-5 cursor-pointer">
          <input
            type="checkbox"
            name=""
            id=""
            className="peer select-none absolute w-full h-full top-0 left-0 opacity-0 z-20 cursor-pointer"
            onClick={props?.onClick}
          />
          <label
            htmlFor=""
            className="w-full h-full absolute left-0 top-0 rounded-full border border-solid border-black/10 peer-checked:border-primaryRed select-none transition-all duration-300"
          ></label>
          <span className="w-3.5 h-3.5 absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-black/30 peer-checked:bg-primaryRed select-none peer-checked:-translate-y-1/2 peer-checked:translate-x-5 transition-all duration-300"></span>
        </div>
        {props.label && (
          <label
            htmlFor=""
            className="block mb-10px text-sm/18px text-left font-semibold max-w-[calc(100%_-_40px)] pl-2.5"
          >
            {props.label}
          </label>
        )}
      </div>
    </>
  );
};

export default Switch;
