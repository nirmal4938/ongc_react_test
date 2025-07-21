import { DownTriangleIcon } from "../svgIcons";

interface CardProps {
  parentClass?: string;
  title?: string;
  children?: JSX.Element | string;
  cardColor?: string;
  titleClassName?: string;
  isDownIcon?: boolean;
  setActivePointer?: React.Dispatch<
    React.SetStateAction<
      | {
          [key: string]: boolean;
        }
      | undefined
    >
  >;
  activePointer?: {
    [key: string]: boolean;
  };
}

const Card = (props: CardProps) => {
  const isDownIcon = props?.isDownIcon ?? false;
  return (
    <>
      <div className={`${props.parentClass ? props.parentClass : ""}`}>
        <div
          className={` rounded-10 ${
            props.cardColor ? props.cardColor : " bg-primaryRed/[0.03]"
          }`}
        >
          {props.title && (
            <>
              <div className="card-header px-6 pt-4 pb-18px relative rounded-t-10 before:absolute before:content-[''] before:max-w-[calc(100%_-_48px)] before:left-0 before:right-0 before:mx-auto before:h-px before:bottom-0 before:bg-black/10">
                <h5
                  className={`text-xl/6 font-semibold ${
                    isDownIcon ? "flex justify-between items-center" : ""
                  } ${props.titleClassName ? props.titleClassName : ""}`}
                >
                  {props.title}
                  {isDownIcon && (
                    <>
                      <span
                        className="flex items-center"
                        onClick={() => {
                          if (props?.activePointer) {
                            const newStatus = { ...props?.activePointer };
                            newStatus[props.title ?? ""] =
                              !props?.activePointer[props.title ?? ""];
                            props?.setActivePointer &&
                              props?.setActivePointer(newStatus);
                          }
                        }}
                      >
                        <DownTriangleIcon
                          className={`w-4 h-4 inline-block mr-2 -rotate-90 ${
                            props?.activePointer &&
                            props?.activePointer[props?.title ?? ""]
                              ? "rotate-0"
                              : ""
                          }`}
                        />
                      </span>
                    </>
                  )}
                </h5>
              </div>
            </>
          )}
          <div className="card-body px-6 pb-7 pt-4 rounded-b-10">
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
