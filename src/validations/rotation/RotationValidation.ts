import * as Yup from "yup";

export const RotationValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    weekOn: Yup.number().nullable().min(0).max(365).label("Week On"),
    weekOff: Yup.number().nullable().min(0).max(365).label("Week Off"),
    daysWorked: Yup.string().trim().nullable(),
    isResident: Yup.boolean().default(false),
    isWeekendBonus: Yup.boolean().default(false),
    isOvertimeBonus: Yup.boolean().default(false),
  });
