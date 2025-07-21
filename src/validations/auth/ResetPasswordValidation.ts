import * as Yup from "yup";
import {
  NewPasswordValidation,
  ConfirmPasswordValidation,
} from "./PasswordValidation";

export const ResetPasswordValidationSchema = () =>
  Yup.object().shape({
    password: NewPasswordValidation(),
    confirmPassword: ConfirmPasswordValidation(),
  });
