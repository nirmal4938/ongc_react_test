import * as Yup from "yup";

export const SegmentValidationSchema = () =>
  Yup.object().shape({
    code: Yup.string().trim().required("Code is required"),
    name: Yup.string().trim().required("Name is required"),
    costCentre: Yup.string().trim().nullable(),
    fridayBonus: Yup.number().label("Friday Bonus").default(0),
    saturdayBonus: Yup.number().label("Saturday Bonus").default(0),
    overtime01Bonus: Yup.number().label("Overtime 01 Bonus").default(0),
    overtime02Bonus: Yup.number().label("Overtime 02 Bonus").default(0),
    vatRate: Yup.number().label("Vat Rate").nullable(),
    xeroFormat: Yup.number().label("Xero Format").required(),
    clientId: Yup.number().label("Client Id").required(),
    createdBy: Yup.number().label("Created By"),
  });
