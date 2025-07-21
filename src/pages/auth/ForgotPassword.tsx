import Button from "@/components/formComponents/button/Button";
import TextField from "@/components/formComponents/textField/TextField";
import { ForgotPasswordUser } from "@/services/authService";
import { ForgotPasswordValidationSchema } from "@/validations/auth/ForgotPasswordValidation";
import { Formik, Form } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const defaultInitialValues = {
    email: "",
  };
  const OnSubmit = async (data: { email: string }) => {
    setLoader(true);
    const response = await ForgotPasswordUser({
      email: data.email,
      type: "FORGOT",
    });
    const { response_type } = response.data;
    if (response_type === "success") {
      navigate("/forgot-otp-verification", { state: { email: data.email } });
    }
    setLoader(false);
  };

  return (
    <div className="min-h-dvh bg-offWhite p-8 md:p-12 lg:p-16 xl:p-20 2xl:p-100px flex 1200:items-center">
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
                <p className="text-32px mb-4">Forgot Your Password?</p>
                <p className="text-base/6 text-Seconday">
                  Please provide email,Account activation link will be send to
                  this email address.
                </p>
                <Formik
                  initialValues={defaultInitialValues}
                  validationSchema={ForgotPasswordValidationSchema()}
                  onSubmit={OnSubmit}
                >
                  {() => (
                    <Form>
                      <div className="input-list-wrapper mt-12 text-left">
                        <div className="input-item mb-30px">
                          <TextField
                            type={"email"}
                            label="Email"
                            name="email"
                            parentClass={"mb-6"}
                            isCompulsory={true}
                            placeholder="Email"
                          />
                        </div>

                        <Button
                          variant={"primary"}
                          type="submit"
                          className="w-full !text-base/6"
                          loader={loader}
                        >
                          Send Link
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="forgot-pass mt-auto">
                  <Link
                    to="/login"
                    className="text-primaryRed font-semibold text-right inline-block"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
