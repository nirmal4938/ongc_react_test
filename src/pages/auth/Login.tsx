import { Formik, Form, ErrorMessage } from "formik";
import { useRef, useState } from "react";
import TextField from "../../components/formComponents/textField/TextField";
import Button from "../../components/formComponents/button/Button";
import { LoginValidationSchema } from "../../validations/auth/LoginValidation";
import { IconEye, IconEyeSlash } from "../../components/svgIcons";
import ReCAPTCHA from "react-google-recaptcha";

import { Link, useNavigate } from "react-router-dom";
import { ILoginForm } from "@/interface/auth/loginInterface";
import { useDispatch } from "react-redux";
import { LoginUser } from "../../services/authService";
import { setToken, setUser } from "@/redux/slices/userSlice";
import { setActiveTab } from "@/redux/slices/adminSidebarSlice";
import {
  DefaultRoles,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { VITE_GOOGLE_RECAPTCH_SITE_KEY } from "./../../config/index";
import { GetUserRolePermission } from "@/services/userService";
import { GetSlugByUserId } from "@/services/employeeService";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recaptchaRef = useRef<any>(null);
  const [loader, setLoader] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const defaultInitialValues = {
    email: "",
    password: "",
    recaptcha: "",
  };

  const handleResetRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setIsReset(true);
    }
  };

  const fetchRolePermissionData = async (query: string) => {
    const response = await GetUserRolePermission(query);
    return response.data.responseData;
  };

  async function OnSubmit(data: ILoginForm) {
    setLoader(true);
    const params = {
      email: data.email,
      password: data.password,
      recaptcha: isReset ? undefined : data.recaptcha || undefined,
    };
    const response = await LoginUser(params);
    const { response_type, responseData } = response.data;
    if (response_type === "success") {
      if (responseData) {
        const userId =
          responseData?.user?.clientId && responseData?.user?.clientId !== null
            ? "clientId=" + responseData?.user?.clientId + "&"
            : "clientId=&";
        const loginUserId = responseData?.user?.loginUserId
          ? "userId=" + responseData?.user?.loginUserId
          : "userId=";

        dispatch(setToken(responseData?.access_token));
        const allFeatures = await fetchRolePermissionData(
          "?" + userId + loginUserId || ""
        );
        dispatch(setUser(responseData.user));
        let userClientId = null;
        if (responseData?.user?.loginUserData?.employee?.length)
          userClientId =
            responseData?.user?.loginUserData?.employee[0].clientId;
        else if (responseData?.user?.loginUserData?.client?.length)
          userClientId = responseData?.user?.loginUserData?.client[0].id;
        if (
          responseData?.user?.roleData?.name === DefaultRoles.Employee &&
          userClientId
        ) {
          let slug = await GetSlugByUserId(Number(userClientId));
          slug = slug?.data?.responseData?.slug;
          if (slug !== undefined) {
            navigate(`/profile/${slug}`);
          }
        } else if (
          !(
            allFeatures[FeaturesNameEnum.Dashboard]?.find(
              (item: string) => item == PermissionEnum.View
            ) ?? false
          )
        ) {
          navigate(`/admin/user-profile`);
        } else if (
          allFeatures[FeaturesNameEnum.Dashboard]?.find(
            (item: string) => item == PermissionEnum.View
          ) ??
          false
        ) {
          dispatch(setActiveTab("Dashboard"));
          navigate(`/`);
        }
      }
    } else {
      handleResetRecaptcha();
    }
    setLoader(false);
  }
  return (
    <div className="min-h-dvh bg-offWhite p-8 md:p-12 lg:p-16 xl:p-20 2xl:p-100px flex 1200:items-center">
      <div className="max-w-[1545px] mx-auto w-full">
        <div className="flex flex-wrap justify-between">
          <div className="img-wrapper hidden 1200:block xl:max-w-[450px] 2xl:max-w-[669px] h-auto w-full">
            <img
              src="/assets/images/lred-auth-img.png"
              width={669}
              height={669}
              className="w-full h-full object-contain"
              alt=""
            />
          </div>
          <div className="auth-box-wrap xl:max-w-[600px] 2xl:max-w-[720px] w-full">
            <div className="bg-white w-full py-8 xl:py-12 2xl:py-16 rounded-15">
              <div className="max-w-[460px] mx-auto text-center">
                <div className="logo mb-10">
                  <img
                    src="/assets/images/lred-main-logo.png"
                    className="mx-auto max-w-[159px]"
                    width={159}
                    height={57}
                    alt=""
                  />
                </div>
                <p className="text-32px mb-4">Login to LRED Portal</p>

                <div className="input-list-wrapper mt-10 text-left">
                  <Formik
                    initialValues={defaultInitialValues}
                    // validationSchema={LoginValidationSchema()}
                    onSubmit={OnSubmit}
                  >
                    {({ setFieldValue }) => (
                      <Form>
                        <div className="input-item mb-30px">
                          <TextField
                            type={"text"}
                            label="Email"
                            name="email"
                            parentClass={"mb-6"}
                            isCompulsory={true}
                            placeholder="Email"
                          />
                        </div>
                        <div className="input-item mb-30px">
                          <TextField
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            name="password"
                            parentClass={"mb-2.5"}
                            isCompulsory={true}
                            placeholder="Password"
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

                        <div>
                          {/* <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={VITE_GOOGLE_RECAPTCH_SITE_KEY}
                            onChange={(value) => {
                              setFieldValue("recaptcha", value);
                              setIsReset(false);
                            }}
                          /> */}
                          <ErrorMessage name="recaptcha">
                            {(msg) => (
                              <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="forgot-pass text-right mt-10px">
                          <Link
                            to="/forgot-password"
                            className="text-primaryRed font-semibold text-right inline-block"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <Button
                          variant={"primary"}
                          type="submit"
                          className="w-full !text-base/6"
                          parentClass="mt-10"
                          loader={loader}
                        >
                          Login
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
