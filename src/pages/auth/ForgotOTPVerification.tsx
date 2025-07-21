import Button from "@/components/formComponents/button/Button";
import { ForgotPasswordUser, VerifyOTP } from "@/services/authService";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";

let timerId: NodeJS.Timer;
let minutes;
let seconds;

export const ForgotOTPVerification = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [countDown, setCountDown] = useState(900);
  const { state }: { state: { email: string } } = useLocation();
  const [loader, setLoader] = useState(false);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const defaultInitialValues = {
    otp1: "",
  };
  const [initialValues, setValue] = useState(defaultInitialValues);

  const resendOtp = async () => {
    setShowResendOtp(false);
    setCountDown(900);
    await ForgotPasswordUser({
      email: state.email,
      type: "FORGOT",
    });
  };

  useEffect(() => {
    timerId = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);
    if (countDown < 0 && timerId) {
      setShowResendOtp(true);
      setCountDown(0);
    }
    return () => clearInterval(Number(timerId));
  }, [countDown]);

  const changeDataValue = (e: string) => {
    setValue({ otp1: e });
  };

  useEffect(() => {
    if (countDown < 0 && timerId) {
      setCountDown(0);
    }
  }, [countDown]);

  const handleSubmit = async () => {
    setLoader(true);
    if (
      initialValues.otp1.length === 6 &&
      state.email &&
      typeof state.email === "string"
    ) {
      const params = {
        email: state.email,
        otp: initialValues.otp1,
        type: "FORGOT",
      };

      await VerifyOTP(params)
        .then((response) => {
          const { response_type } = response.data;
          if (response_type === "success") {
            setShowSuccess(true);
          } else {
            setValue({ otp1: "" });
          }
        })
        .catch((e: Error) => {
          console.log(e);
        });
    } else {
      setErrorMessage("OTP is not valid.");
    }
    setLoader(false);
  };

  seconds = String(countDown % 60).padStart(2, "0");
  minutes = String(Math.floor(countDown / 60)).padStart(2, "0");

  return (
    <div className="min-h-dvh bg-offWhite p-8  flex 1200:items-center">
      <div className="max-w-[1545px] mx-auto w-full">
        <div className="flex flex-wrap justify-between">
          <div className="img-wrapper hidden 1200:block xl:max-w-[450px] 2xl:max-w-[669px] h-auto w-full">
            <img
              src="/assets/images/lred-auth-img-2.png"
              width={669}
              height={669}
              className="w-full h-full object-contain"
              alt=""
            />
          </div>

          <div className="auth-box-wrap xl:max-w-[600px] 2xl:max-w-[720px] 2xl:min-h-[800px] w-full">
            <div className="bg-white w-full py-8 xl:py-12 2xl:py-16 rounded-15 h-full">
              {showSuccess ? (
                <div className="max-w-[460px] mx-auto text-center flex flex-col items-center justify-center h-full">
                  <span className="block w-24 h-24">
                    <img
                      src="/assets/images/success-check.svg"
                      width={96}
                      height={96}
                      alt=""
                    />
                  </span>
                  <h3 className="text-2xl 1200:text-3xl mt-10 mb-4 text-black">
                    OTP Verified Successfully
                  </h3>
                  <p className="pb-10 text-black opacity-50 font-medium">
                    Please check your Email, We've sent reset password link.
                  </p>
                  <Button
                    variant={"primaryBorder"}
                    onClickHandler={() => navigate("/login")}
                  >
                    Go Back
                  </Button>
                </div>
              ) : (
                <div className="max-w-[460px] mx-auto text-center flex flex-col h-full">
                  <div className="logo mb-10">
                    <img
                      src="/assets/images/lred-main-logo.png"
                      className="mx-auto max-w-[159px]"
                      width={159}
                      height={57}
                      alt=""
                    />
                  </div>
                  <p className="text-32px mb-4">OTP Verification</p>
                  <p className="text-base/6 text-Seconday">
                    Enter the OTP which you have received in {state.email}.
                  </p>

                  <div className="input-list-wrapper mt-12 text-left">
                    <div className="input-item flex items-center justify-center otp-input">
                      <OTPInput
                        numInputs={6}
                        value={initialValues.otp1}
                        onChange={changeDataValue}
                        renderInput={(props) => <input {...props} />}
                        renderSeparator={<span>-</span>}
                        inputStyle={{}}
                      />
                    </div>
                    {errorMessage && (
                      <div className="error text-red text-sm pt-[4px] font-BinerkaDemo">
                        {errorMessage}
                      </div>
                    )}
                    <p className="text-center mt-30px">
                      <span className="inline-block text-primaryGreen/50 font-FiraSansSB">
                        {showResendOtp
                          ? "Your code has been expired"
                          : "Your code will expire in" +
                            ` ${minutes}:${seconds}`}
                      </span>
                    </p>
                    <Button
                      variant={"primary"}
                      type="button"
                      className="w-full mt-4 !text-base/6"
                      onClickHandler={handleSubmit}
                      loader={loader}
                    >
                      Submit
                    </Button>
                    {showResendOtp && (
                      <>
                        <p className="text-center mt-6 md:mt-10 text-black">
                          <span>{"Didn't receive OTP?"}</span>
                        </p>

                        <p className="text-center mt-5 md:mt-7 text-primaryGreen hover:text-primaryGold transition-all duration-300 font-semibold cursor-pointer">
                          <span onClick={resendOtp}>{"Resend OTP"}</span>
                        </p>
                      </>
                    )}
                  </div>

                  <div className="forgot-pass mt-auto">
                    Wrong Email Address?&nbsp;
                    <Link
                      to="/forgot-password"
                      className="text-primaryRed font-semibold text-right inline-block"
                    >
                      Go back
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotOTPVerification;
