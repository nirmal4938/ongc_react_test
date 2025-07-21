interface modalProps {
  percentage: number;
  type: string;
  message: string;
}

import Modal from "../modal/Modal";

const generateDataModal = (data: modalProps) => {
  return (
    <>
      <Modal
        width="max-w-[475px]"
        hideCrossIcon={true}
        hideFooterButton
        modalBoxClass="shadow-lg"
      >
        <>
          <div className="title text-center">
            <h4 className="text-30px leading-[1.2] font-semibold text-primaryRed">
              Hold On!
            </h4>
          </div>

          <div className="mt-8 xl:mt-12 2xl:mt-20">
            <span className="block w-40 h-40 mx-auto">
              <img
                src="/assets/images/loading.gif"
                width={160}
                height={160}
                alt=""
              />
            </span>
          </div>
          <div className="desc my-8 xl:my-10 2xl:my-14">
            <p className="text-lg leading-7 text-grayDark text-center">
              {data?.message}!
            </p>
          </div>

          <div className="loader desc mb-8 xl:mb-10 2xl:mb-14">
            <div className="flex gap-x-10px">
              <div
                className={`flex-[1_0_0%] h-10px rounded-full ${
                  data?.percentage >= 20 ? "bg-primaryRed" : "bg-lightGray"
                }`}
              ></div>
              <div
                className={`flex-[1_0_0%] h-10px rounded-full ${
                  data?.percentage >= 40 ? "bg-primaryRed" : "bg-lightGray"
                }`}
              ></div>
              <div
                className={`flex-[1_0_0%] h-10px rounded-full ${
                  data?.percentage >= 60 ? "bg-primaryRed" : "bg-lightGray"
                }`}
              ></div>
              <div
                className={`flex-[1_0_0%] h-10px rounded-full ${
                  data?.percentage >= 80 ? "bg-primaryRed" : "bg-lightGray"
                }`}
              ></div>
              <div
                className={`flex-[1_0_0%] h-10px rounded-full ${
                  data?.percentage >= 100 ? "bg-primaryRed" : "bg-lightGray"
                }`}
              ></div>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};

export default generateDataModal;
