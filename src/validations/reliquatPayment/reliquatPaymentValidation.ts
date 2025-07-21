import * as Yup from "yup";

export const ReliquatPaymentValidationSchema = () =>
  Yup.object().shape({
    clientId: Yup.number().required("Client is required"),
    employeeId: Yup.number().required("Employee is required"),
    startDate: Yup.string().trim().required("Start Date is required"),
    amount: Yup.number().required("Amount is required"),
  });
