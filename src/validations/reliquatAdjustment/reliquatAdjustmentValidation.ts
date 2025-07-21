import * as Yup from "yup";

export const ReliquatAdjustmentValidationSchema = () =>
  Yup.object().shape({
    clientId: Yup.number().required("Client is required"),
    employeeId: Yup.number().required("Employee is required"),
    adjustment: Yup.number().required("Adjustment is required"),
    startDate: Yup.string().trim().required("Start Date is required"),
  });
