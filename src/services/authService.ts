import { axiosGet, axiosPost } from "../axios/axios";

const prefix = "/auth";
export const RegisterUser = (data: object) => {
  return axiosPost(`${prefix}/register`, data);
};
export const LoginUser = (data: object) => {
  return axiosPost(`${prefix}/login`, data);
};
export const VerifyOTP = (data: object) => {
  return axiosPost(`${prefix}/otp-verification`, data);
};

export const ForgotPasswordUser = (data: object) => {
  return axiosPost(`${prefix}/forgot-password`, data);
};
export const SendOTPRegister = (data: object) => {
  return axiosPost(`${prefix}/send-otp`, data);
};
export const ResetUserPassword = (data: object) => {
  return axiosPost(`${prefix}/set-password`, data);
};

export const CheckValidUserEmail = (email: string) => {
  return axiosGet(`${prefix}/user-validate?email=${email}`);
};

export const GetCurrentUser = () => {
  return axiosGet(`${prefix}/getLoggedIn`);
};

export const ChangePasswordData = (data: object) => {
  return axiosPost(`${prefix}/change-password`, data);
};
