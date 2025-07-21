import * as Yup from "yup";

export const MedicalTypeValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    format: Yup.string().trim().required("Format is required"),
    daysBeforeExpiry: Yup.number().nullable().label("Day Before Expiry"),
    daysExpiry: Yup.number().nullable().label("Day Expiry"),
  });
