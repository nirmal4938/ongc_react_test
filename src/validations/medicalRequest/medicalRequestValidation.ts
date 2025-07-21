import * as Yup from "yup";

export const MedicalRequestValidationSchema = () =>
  Yup.object().shape({
    employeeId: Yup.number().required("Employee is required"),
    medicalTypeId: Yup.number().required("Medical Type is required"),
    medicalDate: Yup.string().trim().required("Medical Date is required"),
  });
