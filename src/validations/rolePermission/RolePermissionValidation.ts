import * as Yup from "yup";

export const RolePermissionValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().required("Role Name is required"),
    permissions: Yup.array()
      .of(Yup.number())
      .min(1, "Permissions field must have at least 1 items")
      .required("Permission is required"),
  });
