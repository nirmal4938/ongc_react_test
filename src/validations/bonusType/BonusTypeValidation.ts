import * as Yup from "yup";

export const BonusTypeValidationSchema = () =>
  Yup.object().shape({
    code: Yup.string().trim().required("Code is required"),
    name: Yup.string().trim().required("Name is required"),
    basePrice: Yup.number()
      .required("Base Price is required")
      .test(
        "Is positive?",
        "Base price must be greater than 0 !",
        (value) => value > 0
      ),
    timesheetName: Yup.string()
      .trim()
      .label("Timesheet Name")
      .required("Timesheet Name is required"),
  });
