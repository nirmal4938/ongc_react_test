import * as Yup from "yup";

export const addUpdateVehicleValidationSchema = () =>
  Yup.object().shape({
    vehicleNo: Yup.string().trim().required("Vehicle No is required"),
    year: Yup.date().required("Year is required"),
    typeId: Yup.string().required("Type is required"),
    modelId: Yup.string().required("Model is required"),
    capacity: Yup.array()
      .of(Yup.string())
      .min(1, "Capacity is required")
      .required("Capacity is required"),
  });
