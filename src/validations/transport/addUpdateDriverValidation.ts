import * as Yup from "yup";

export const addUpdateDriverValidationSchema = () =>
  Yup.object().shape({
    driverNo: Yup.string().trim().required("Driver No is required"),
    firstName: Yup.string().trim().required("First Name is required"),
    lastName: Yup.string().trim().required("Last Name is required"),
    positionId: Yup.string().required("Position is required"),
    companyStart: Yup.string().required("Company Start is required"),
    experienceStart: Yup.string().required("Experience Start is required"),
  });
