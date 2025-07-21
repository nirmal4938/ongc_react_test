import * as Yup from "yup";

export const ContactValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    // clientId: Yup.number().required("Client Id is required"),
    email: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required"),
    address1: Yup.string().trim().required("Address Line 1 is required"),
    address2: Yup.string().nullable().label("Address Line 2"),
    address3: Yup.string().nullable().label("Address Line 3"),
    address4: Yup.string().nullable().label("Address Line 4"),
    city: Yup.string().trim().required("City is required"),
    region: Yup.string().trim().required("Region is required"),
    country: Yup.string().required("Country is required"),
    postalCode: Yup.number()
      .typeError("Postal Code must be a valid number.")
      .required("Postal Code is required"),
    dueDateDays: Yup.number().nullable().label("Due Date Days"),
    brandingTheme: Yup.string().nullable().label("Branding Theme"),
  });
