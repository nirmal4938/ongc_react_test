import * as Yup from "yup";

export const UserValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    roleId: Yup.number().required("Role is required"),
    password: Yup.string()
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
      .matches(/\d/, "Password needs to have at least one number")
      .min(8, "Password must contain minimum 8 letters without space")
      .max(15),
    timezone: Yup.string().required("Timezone is required"),
    permissions: Yup.array()
      .of(Yup.number())
      .min(1, "Permissions field must have at least 1 items")
      .required("Permission is required"),
  });
