import * as Yup from "yup";

export const ContractTemplateValidationSchema = () =>
  Yup.object().shape({
    contractName: Yup.string().trim().required("Contract Name is required"),
    isActive: Yup.boolean().default(false),
  });

export const ContractSummaryValidationSchema = () =>
  Yup.object().shape({
    employeeId: Yup.number().required("The Employee field is required."),
    contractTemplateId: Yup.number().required(
      "The Contract Template field is required."
    ),
    contractVersionId: Yup.number().required(
      "The Contract Template Version field is required."
    ),
    description: Yup.string()
      .label("Description")
      .test(
        "description",
        "Please enter the valid information. The Employee Contract does not allow this type data [firstName] ",
        async (value) => {
          if (value) {
            const disallowedPattern = /\[([^\]]+)\]/g;
            if (disallowedPattern.test(value)) {
              return false;
            }
            return true;
          }
          return true;
        }
      )
      .nullable(),
    startDate: Yup.date()
      .label("startDate")
      .required("The Start Date field is required."),
    endDate: Yup.date()
      .label("endDate")
      .test(
        "same_dates_test",
        "Start and end dates must not be equal.",
        function (value: Date | undefined) {
          const { startDate } = this.parent;
          return value?.getTime() !== startDate.getTime();
        }
      )
      .min(Yup.ref("startDate"), "End Date has to be more than start date")
      .required("The End Date field is required."),
    newContractNumber: Yup.string()
      .trim()
      // .typeError("New Contract Number must be a valid number.")
      .label("Contract Number")
      .required("The Contract Number field is required."),

    workOrderDate: Yup.date().label("Work Order Date"),
    contractorsPassport: Yup.string()
      .label("Contractor's Passport")
      .nullable()
      .test(
        "contractorsPassport",
        "Contractor's Passport must be either string or number.",
        (value) => {
          const regex = /^(?:[a-zA-Z]+|\d+|[a-zA-Z]+\d+)$/;
          if (value && !regex.test(value)) {
            return false;
          }
          return true;
        }
      ),
    endOfAssignmentDate: Yup.date().label("End of Assignment Date"),
    descriptionOfAssignmentAndOrderConditions: Yup.string().label(
      "Description of Assignment and Order Conditions"
    ),
    durationOfAssignment: Yup.string().label("Duration of Assignment"),
    workLocation: Yup.string().label("Work Location"),
    workOrderNumber: Yup.string()
      .label("Work Order Number")
      .nullable()
      .test(
        "workOrderNumber",
        "Work Order Number must be either string or number.",
        (value) => {
          const regex = /^(?:[a-zA-Z]+|\d+|[a-zA-Z]+\d+)$/;
          if (value && !regex.test(value)) {
            return false;
          }
          return true;
        }
      ),
    remuneration: Yup.number().label("Work Order Number"),
    workCurrency: Yup.string().label("Currency"),
  });

export const ContractTemplateVersionValidationSchema = () =>
  Yup.object().shape({
    versionName: Yup.string()
      .trim()
      .label("Version Name")
      .required("Version Name is required"),
    description: Yup.string()
      .trim()
      .required("Contract Description is required"),
    isActive: Yup.boolean().default(true),
  });
