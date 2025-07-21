import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import TextField from "../../components/formComponents/textField/TextField";
import Button from "../../components/formComponents/button/Button";
import { ResetPasswordValidationSchema } from "../../validations/auth/ResetPasswordValidation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IResetPassword } from "@/interface/auth/resetPasswordInterface";
import { CheckValidUserEmail, ResetUserPassword } from "@/services/authService";
import { IconEye, IconEyeSlash } from "@/components/svgIcons";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const email = queryParameters.get("email");
  const token = queryParameters.get("token");
  const defaultInitialValues = {
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    if (!email && !token) {
      navigate("/login");
    }
    if (email && token) {
      checkValidEmail(email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkValidEmail = async (email: string) => {
    const response = await CheckValidUserEmail(email);
    const { response_type } = response.data;
    if (response_type === "error") {
      navigate("/forgot-password");
    }
  };

  async function OnSubmit(data: IResetPassword) {
    setLoader(true);
    if (email && token) {
      const params = {
        hashToken: token,
        newPassword: data.password,
        email: email,
      };

      const response = await ResetUserPassword(params);
      const { response_type } = response.data;
      if (response_type === "success") {
        navigate("/login");
      } else {
        navigate("/forgot-password");
      }
    }
    setLoader(false);
  }
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
                <p className="text-32px mb-4">Reset Password</p>
                <Formik
                  initialValues={defaultInitialValues}
                  validationSchema={ResetPasswordValidationSchema()}
                  onSubmit={OnSubmit}
                >
                  {() => (
                    <Form>
                      <div className="input-list-wrapper mt-12 text-left">
                        <div className="input-item mb-30px">
                          <TextField
                            type={showPassword ? "text" : "password"}
                            label="New Password"
                            name="password"
                            parentClass={"mb-6"}
                            isCompulsory={true}
                            placeholder="New Password"
                            icon={
                              <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-10 rtl:left-4 rtl:right-auto cursor-pointer"
                              >
                                {showPassword ? <IconEye /> : <IconEyeSlash />}
                              </div>
                            }
                          />
                        </div>
                        <div className="input-item">
                          <TextField
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirm Password"
                            name="confirmPassword"
                            parentClass={"mb-6"}
                            isCompulsory={true}
                            placeholder="Confirm Password"
                            icon={
                              <div
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-10 rtl:left-4 rtl:right-auto cursor-pointer"
                              >
                                {showConfirmPassword ? (
                                  <IconEye />
                                ) : (
                                  <IconEyeSlash />
                                )}
                              </div>
                            }
                          />
                        </div>
                        <Button
                          variant={"primary"}
                          type="submit"
                          className="w-full mt-6 !text-base/6"
                          loader={loader}
                        >
                          Reset Password
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
                    Go Back
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

export default ResetPassword;
