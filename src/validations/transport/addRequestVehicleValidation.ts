import * as Yup from "yup";

export const addRequestVehicleValidationSchema = () =>
  Yup.object().shape({
    vehicleId: Yup.string().required("Vehicle No is required"),
    driverId: Yup.string().required("Driver is required"),
  });
