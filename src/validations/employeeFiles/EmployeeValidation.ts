import * as Yup from "yup";

export const EmployeeValidationSchema = () =>
  Yup.object().shape({
    employeeNumber: Yup.string().trim().label("employeeNumber").required(),
    TempNumber: Yup.string().trim().label("TempNumber").nullable(),
    contractNumber: Yup.string().trim().label("contractNumber").nullable(),
    contractSignedDate: Yup.date().label("contractSignedDate").nullable(),
    startDate: Yup.date().label("startDate").nullable(),
    firstName: Yup.string().trim().label("firstName").required(),
    lastName: Yup.string().trim().label("lastName").required(),
    fonction: Yup.string().trim().label("fonction").nullable(),
    dOB: Yup.date().label("dOB").nullable(),
    placeOfBirth: Yup.string().trim().label("placeOfBirth").nullable(),
    nSS: Yup.string().trim().label("nSS").nullable(),
    gender: Yup.string().trim().label("gender").required(),
    terminationDate: Yup.date().label("terminationDate").nullable(),
    baseSalary: Yup.number().label("baseSalary").nullable(),
    travelAllowance: Yup.number().label("travelAllowance").nullable(),
    Housing: Yup.number().label("Housing").nullable(),
    monthlySalary: Yup.number().label("monthlySalary").nullable(),
    address: Yup.string().trim().label("address").nullable(),
    medicalCheckDate: Yup.date().label("medicalCheckDate").nullable(),
    medicalCheckExpiry: Yup.date().label("medicalCheckExpiry").nullable(),
    medicalInsurance: Yup.boolean().label("medicalInsurance").nullable(),
    contractEndDate: Yup.date().label("contractEndDate").nullable(),
    dailyCost: Yup.number().label("dailyCost").nullable(),
    mobileNumber: Yup.string().trim().label("mobileNumber").nullable(),
    nextOfKinMobile: Yup.string().trim().label("nextOfKinMobile").nullable(),
    initialBalance: Yup.number().label("initialBalance").nullable(),
    photoVersionNumber: Yup.number().label("photoVersionNumber").nullable(),
    email: Yup.string().trim().label("email").nullable(),
    clientId: Yup.number().label("clientId").required(),
    segmentId: Yup.number().label("segmentId").required(),
    subSegmentId: Yup.number().label("subSegmentId").nullable(),
  });

  export const  EmployeeImportValidationSchema = () =>
  Yup.object().shape({
    employeeFile: Yup.string().label("File").required(),
  });
