import * as Yup from "yup";

export const addRequestValidationSchema = () =>
  Yup.object().shape({
    source: Yup.string().trim().required("Start is required"),
    startDate: Yup.date()
      .min(new Date(), "Start date should be a future date")
      .required("Start date is required")
      .typeError("Start date is invalid"),
    destination: Yup.string().trim().required("Destination is required"),
    destinationDate: Yup.date()
      .min(
        Yup.ref("startDate"),
        "Destination date should be later than source date"
      )
      .required("Destination date is required")
      .typeError("Destination date is invalid"),
  });
