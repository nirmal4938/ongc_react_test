import moment from "moment";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

export const EmployeeValidationSchema = (id?: string | number | undefined) => {
  let salaryDateValidation = Yup.date().nullable();

  if (id) {
    salaryDateValidation = Yup.date()
      .required("Salary Date is required")
      .test({
        name: "afterStartDate",
        exclusive: true,
        message: "Salary Date has to be more than or equal to start date",
        test: function (value) {
          const startDate = this.resolve(Yup.ref("startDate"));
          return !startDate || !value || value >= startDate;
        },
      })
      .test({
        name: "requiredForEdit",
        message: "Salary Date is required",
        test: function (value) {
          const { salaryDate } = this.parent;
          return salaryDate === null || salaryDate === undefined
            ? !!value
            : true;
        },
      });
  }
  return Yup.object().shape({
    employeeNumber: Yup.string().trim().label("Employee Number").required(),
    TempNumber: Yup.string().trim().label("TempNumber").nullable(),
    // contractNumber: Yup.number()
    //   .typeError("Contract Number must be a valid number.")
    //   .label("Contract Number")
    //   .nullable(),
    contractEndDate: Yup.date().label("Contract End Date").nullable(),
    contractSignedDate: Yup.date().label("CNAS Declaration Date").nullable(),
    startDate: Yup.date().label("Start Date").required(),
    salaryDate: salaryDateValidation,
    timezone: Yup.string().required("Timezone is required"),
    firstName: Yup.string().trim().label("First Name").required(),
    lastName: Yup.string().trim().label("Last Name").required(),
    fonction: Yup.string().trim().label("Fonction").required(),
    dOB: Yup.date()
      .label("Date of Birth")
      .max(new Date(Date.now() - 504576000000), "Must be at least 16 years old")
      .nullable(),
    medicalCheckDate: Yup.date().label("Medical Check Date").nullable(),
    medicalCheckExpiry: Yup.date().label("Medical Check Expiry").nullable(),
    placeOfBirth: Yup.string().trim().label("Place Of Birth").nullable(),
    nSS: Yup.string().trim().label("NSS").nullable(),
    gender: Yup.string().trim().label("Gender").required(),
    baseSalary: Yup.number().label("Base Salary").nullable(),
    travelAllowance: Yup.number().label("Travel Allowance").nullable(),
    Housing: Yup.number().label("Housing").nullable(),
    monthlySalary: Yup.number().label("Monthly Salary").nullable(),
    address: Yup.string().trim().label("Address").nullable(),
    medicalInsurance: Yup.boolean().label("Medical Insurance").nullable(),
    rollover: Yup.boolean().label("Rollover").nullable(),
    isAbsenseValueInReliquat: Yup.boolean()
      .label("Is Absense Value In Reliquat")
      .nullable(),
    dailyCost: Yup.number().label("Daily Cost").nullable(),
    hourlyRate: Yup.number().label("Hourly Rate").nullable(),
    mobileNumber: Yup.string()
      .nullable()
      .test("phone-validation", "Mobile Number is Invalid ", async (value) => {
        if (value) {
          return isValidPhoneNumber(value) ? true : false;
        } else {
          return true;
        }
      }),
    nextOfKinMobile: Yup.string().trim().label("Next Of Kin Mobile").nullable(),
    initialBalance: Yup.number().label("Initial Balance").nullable(),
    photoVersionNumber: Yup.number().label("Photo Version Number").nullable(),
    email: Yup.string().email().trim().label("Email").nullable(),
    clientId: Yup.number().label("Client Id").required(),
    rotationId: Yup.number().label("Rotation Id").required(),
    segmentId: Yup.number().label("Segment Id").required(),
    subSegmentId: Yup.number().label("Sub Segment Id").nullable(),
  });
};

export const EmployeeUpdateValidationSchema = ({
  segmentDate,
  rotationDate,
  startDate,
}: {
  segmentDate: Date | null;
  rotationDate: Date | null;
  startDate: Date | null;
}) => {
  const segmentDateValidation = Yup.date()
    .test({
      name: "segmentStartDate",
      exclusive: true,
      message: `Segment Date has to be greater than ${
        segmentDate
          ? moment(segmentDate).format("DD/MM/YYYY")
          : startDate
          ? moment(startDate).format("DD/MM/YYYY")
          : moment().format("DD/MM/YYYY")
      }`,
      test: function (value) {
        if (value) {
          if (segmentDate) {
            return value >= new Date(segmentDate);
          } else if (startDate) {
            return value >= new Date(startDate);
          } else {
            return value >= new Date();
          }
        }
      },
    })
    .nullable();

  const rotationDateValidation = Yup.date()
    .test({
      name: "rotationStartDate",
      exclusive: true,
      message: `Rotation Date has to be greater than ${
        rotationDate
          ? moment(rotationDate).format("DD/MM/YYYY")
          : startDate
          ? moment(startDate).format("DD/MM/YYYY")
          : moment().format("DD/MM/YYYY")
      }`,
      test: function (value) {
        if (value) {
          if (rotationDate) {
            return value >= new Date(rotationDate);
          } else if (startDate) {
            return value >= new Date(startDate);
          } else {
            return value >= new Date();
          }
        }
      },
    })
    .nullable();

  Yup.object().shape({
    employeeNumber: Yup.string().trim().label("Employee Number").required(),
    firstName: Yup.string().trim().label("First Name").required(),
    lastName: Yup.string().trim().label("Last Name").required(),
    fonction: Yup.string().trim().label("Fonction").required(),
    mobileNumber: Yup.string()
      .nullable()
      .test("phone-validation", "Mobile Number is Invalid ", async (value) => {
        if (value) {
          return isValidPhoneNumber(value) ? true : false;
        } else {
          return true;
        }
      }),
    email: Yup.string().email().trim().label("Email").nullable(),
    rotationDate: rotationDateValidation,
    segmentDate: segmentDateValidation,
  });
};
