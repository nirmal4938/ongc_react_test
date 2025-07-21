import * as Yup from "yup";
import {
  NewPasswordValidation,
  ConfirmPasswordValidation,
  OldPasswordValidation,
} from "./PasswordValidation";

export const ChangePasswordValidationSchema = () =>
  Yup.object().shape({
    oldPassword: OldPasswordValidation(),
    password: NewPasswordValidation(),
    confirmPassword: ConfirmPasswordValidation(),
  });
