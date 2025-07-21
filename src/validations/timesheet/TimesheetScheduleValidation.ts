import * as Yup from "yup";

export const TimesheetScheduleValidationSchema = () =>
  Yup.object().shape({
    startDate: Yup.date().label("startDate").required(),
    endDate: Yup.date().label("startDate").required(),
    updateStatus: Yup.string().trim().required("updateStatus is required"),
    overtimeHours: Yup.number()
      .max(24, "Max. overtime hours must be less than or equal to 24")
      .min(1, "Min. overtime hours must be greater than or equal to 1"),
  });
