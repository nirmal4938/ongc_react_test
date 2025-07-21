import { CrossIcon } from "../svgIcons";
import Button from "../formComponents/button/Button";
import { MouseEvent } from "react";

interface ModalProps {
  parentClass?: string;
  overlayClass?: string;
  children?: JSX.Element | string;
  closeModal?: (e: MouseEvent<HTMLElement>) => void;
  onClickHandler?: () => void;
  hideCancelButton?: boolean;
  width?: string;
  title?: string;
  variant?: "Confirmation" | null;
  okbtnText?: string;
  cancelbtnText?: string;
  icon?: JSX.Element | string;
  confirmationText?: string;
  hideFooterButton?: boolean;
  loaderButton?: boolean;
  disabledButton?: boolean;
  modalBodyClass?: string;
  modalBoxClass?: string;
  hideCrossIcon?: boolean;
  visible?: boolean;
  isVisible?:boolean
}

const Modal = (props: ModalProps) => {
  return (
    <>
      <div
        className={`modal fixed top-0 left-0 w-full h-dvh z-4 flex items-center justify-center ${
          props.parentClass ? props.parentClass : ""
        }`}
      >
        <div
          className={`modal-overlay fixed top-0 left-0 w-full h-dvh bg-offWhite/50 backdrop-blur-sm ${
            props.overlayClass ? props.overlayClass : ""
          }`}
        ></div>
        <div
          className={`modal-inner relative 1200:min-w-[400px] w-full max-h-[calc(100dvh_-_30px)]${props.visible ? "!overflow-visible":""} ${
            props.width ? props.width : " max-w-[700px]"
          }`}
        >
          {props?.hideCrossIcon ? (
            ""
          ) : (
            <span
              className="absolute top-4 right-4 block w-3 h-3 cursor-pointer hover:text-primaryRed active:scale-90 transition-all duration-300 select-none"
              onClick={props.closeModal}
            >
              <CrossIcon className="w-full h-full" />
            </span>
          )}
          <div
            className={`modal-box ${props.isVisible ? 'p-5' :'py-30px px-10'}  bg-white rounded-10 ${
              props.modalBoxClass ? props.modalBoxClass : ""
            }`}
          >
            {!props.variant && (
              <div className="modal-header flex justify-between">
                <h5 className="text-26px/8 text-black font-semibold">
                  {props.title}
                </h5>
              </div>
            )}
            {props.variant === "Confirmation" ? (
              <>
                <div className="relative mb-8">
                  <div className="title text-center">
                    <h2 className="font-bold text-primaryRed text-30px/9">
                      {props.title}
                    </h2>
                  </div>
                  <div className="icon my-20">
                    <span className="w-24 h-24 bg-primaryRed/10 p-5 rounded-full block mx-auto text-primaryRed ring-2 ring-primaryRed/20 ring-offset-8">
                      {props.icon}
                    </span>
                  </div>

                  <p className="max-w-[305px] mx-auto text-xl/7 text-grayDark text-center">
                    {props.confirmationText}
                  </p>
                </div>
              </>
            ) : (
              <div
                className={`modal-body max-h-[calc(100dvh_-_210px)] noscroll ${
                  props?.visible ? "overflow-visible" : "overflow-auto"
                }
                ${props.modalBodyClass ? props.modalBodyClass : ""}
                ${!props.hideFooterButton ? "my-6" : "mt-6"}`}
              >
                {props.children}
              </div>
            )}
            {!props.hideFooterButton && (
              <div className="modal-footer">
                <div
                  className={`flex gap-4 ${
                    props.variant === "Confirmation"
                      ? "justify-center"
                      : "justify-end"
                  } `}
                >
                  {props.hideCancelButton ? (
                    ""
                  ) : (
                    <Button
                      variant={"primaryBorder"}
                      onClickHandler={props.closeModal}
                    >
                      {props.cancelbtnText ? props.cancelbtnText : "Cancel"}
                    </Button>
                  )}
                  <Button
                    variant={"primary"}
                    onClickHandler={props.onClickHandler}
                    loader={props.loaderButton}
                    disabled={props.disabledButton}
                  >
                    {props.okbtnText ? props.okbtnText : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
