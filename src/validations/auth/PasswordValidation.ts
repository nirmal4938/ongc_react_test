import { TFunction } from "i18next";
import * as Yup from "yup";

export const PasswordValidation = () =>
  Yup.string()
    .trim()
    .required("Password is required")
    .matches(
      /(?=.*[A-Z])/,
      "Password needs to have at least one capital letter"
    )
    .matches(
      /(?=.*[!@#$%^&()*])/,
      "Password needs to have at least one special character"
    )
    .matches(
      /(?=.*[a-z])/,
      "Password needs to have at least one lower case character"
    )
    .matches(/(?=.*[0-9])/, "Password needs to have at least one number")
    .min(8, "Password must contain minimum 8 letters without space")
    .max(15);

export const PasswordValidationNullable = (
  t: TFunction<"translation", undefined, "translation">
) =>
  Yup.string()
    .trim()
    .transform((value) => (!value ? null : value))
    .nullable()
    .matches(
      /(?=.*[A-Z])/,
      `${t("Password needs to have at least one capital letter")}`
    )
    .matches(
      /(?=.*[!@#$%^&*])/,
      `${t("Password needs to have at least one special character")}`
    )
    .matches(
      /(?=.*[a-z])/,
      `${t("Password needs to have at least one lower case character")}`
    )
    .matches(
      /(?=.*[0-9])/,
      `${t("Password needs to have at least one number")}`
    )
    .min(8, `${t("Password must contain minimum 8 letters without space")}`)
    .max(15);

export const OldPasswordValidation = () =>
  Yup.string()
    .trim()
    .required("Old Password is required")
    .matches(
      /(?=.*[A-Z])/,
      "Password needs to have at least one capital letter"
    )
    .matches(
      /(?=.*[!@#$%^&*])/,
      "Password needs to have at least one special character"
    )
    .matches(
      /(?=.*[a-z])/,
      "Password needs to have at least one lower case character"
    )
    .matches(/(?=.*[0-9])/, "Password needs to have at least one number")
    .min(8, "Password must contain minimum 8 letters without space")
    .max(15);

export const CreatePasswordValidation = (
  t: TFunction<"translation", undefined, "translation">
) =>
  Yup.string()
    .trim()
    .required(`${t("Create Password is required")}`)
    .matches(/^\S*$/, `${t("Whitespace is not allowed in Password")}`)
    .matches(
      /(?=.*[A-Z])/,
      `${t("Password needs to have at least one capital letter")}`
    )
    .matches(
      /(?=.*[!@#$%^&*])/,
      `${t("Password needs to have at least one special character")}`
    )
    .matches(
      /(?=.*[a-z])/,
      `${t("Password needs to have at least one lower case character")}`
    )
    .matches(
      /(?=.*[0-9])/,
      `${t("Password needs to have at least one number")}`
    )
    .min(8, `${t("Password must contain minimum 8 letters without space")}`)
    .max(15);

export const NewPasswordValidation = () =>
  Yup.string()
    .trim()
    .required("New Password is required")
    .matches(
      /(?=.*[A-Z])/,
      "Password needs to have at least one capital letter"
    )
    .matches(
      /(?=.*[!@#$%^&*])/,
      "Password needs to have at least one special character"
    )
    .matches(
      /(?=.*[a-z])/,
      "Password needs to have at least one lower case character"
    )
    .matches(/(?=.*[0-9])/, "Password needs to have at least one number")
    .min(8, "Password must contain minimum 8 letters without space")
    .max(15);

export const ConfirmPasswordValidation = () =>
  Yup.string()
    .label("confirm password")
    .required("Confirm Password is required")
    .oneOf(
      [Yup.ref("password") || null],
      "Confirm password must match with New Password"
    );
