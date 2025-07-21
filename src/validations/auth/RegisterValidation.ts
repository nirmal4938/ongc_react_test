import { TFunction } from "i18next";
import * as Yup from "yup";
import {
  ConfirmPasswordValidation,
  CreatePasswordValidation,
} from "./PasswordValidation";

export const RegisterValidationSchema = (
  t: TFunction<"translation", undefined, "translation">
) =>
  Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .matches(/^\S*$/, `${t("Whitespace is not allowed in First Name")}`)
      .max(255, `${t("Maximum 255 Characters allowed")}`)
      .required(`${t("First Name is required")}`),
    lastName: Yup.string()
      .trim()
      .matches(/^\S*$/, `${t("Whitespace is not allowed in Last Name")}`)
      .max(255, `${t("Maximum 255 Characters allowed")}`)
      .required(`${t("Last Name is required")}`),
    email: Yup.string()
      .email(`${t("Email is invalid")}`)
      .max(255, `${t("Maximum 255 Characters allowed")}`)
      .required(`${t("Email is required")}`)
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, `${t("Email is invalid")}`),
    enrollNumber: Yup.number()
      .max(10000000000000000, `${t("Enrollment Number must be of 16 digit")}`)
      .typeError(
        `${t("Please enter number value only for the  Enrollment Number")}`
      )
      .required(`${t("Enrollment Number is required")}`),
    password: CreatePasswordValidation(t),
    confirmPassword: ConfirmPasswordValidation(),
  });
