import * as Yup from "yup";

export const EmployeeLeaveValidationSchema = () =>
  Yup.object().shape({
    employeeId: Yup.number().required("Employee is required"),
    startDate: Yup.date()
      // .min(new Date(), "Start date should be a future date")
      .required("Start date is required")
      .typeError("Start is invalid"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date should be later than start date")
      .required("End Date is required"),
    leaveType: Yup.string().trim().required("Leave Type is required"),
  });
