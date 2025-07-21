import * as Yup from "yup";
import { PasswordValidation } from "./PasswordValidation";

export const LoginValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .email("Email is invalid")
      .max(255, "Maximum 255 Characters allowed")
      .required("Email is required")
      .matches(/^.+@.+\..+$/, "Email is invalid"),
      // .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, "Email is invalid"),
    password: PasswordValidation(),
    // recaptcha: Yup.string().required("ReCaptcha is required"),
  });
