import * as Yup from "yup";

export const ClientValidationSchema = () =>
  Yup.object().shape({
    code: Yup.string().trim().required("Code is required"),
    name: Yup.string().trim().required("Name is required"),
    weekendDays: Yup.string().trim().nullable(),
    email: Yup.string()
      .nullable()
      .trim()
      .label("Email")
      .test("Valid Email", "Email is invalid", (value) => {
        if (!value) return true; // Allow empty string if needed
        const isValidEmail = value.includes("@") && value.includes(".");
        if (isValidEmail) {
          return true;
        } else {
          return false;
        }
      }),
    country: Yup.string().trim().label("Country").required(),
    isActive: Yup.boolean().default(false),
    startDate: Yup.date().label("Start Date").required(),
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
    timezone: Yup.string().required("Timezone is required"),
    currency: Yup.string().nullable(),
    autoUpdateEndDate: Yup.number()
      .min(0, "Auto Update End Date must be greater than or equal to 0")
      .label("Auto Update End Date"),
    timeSheetStartDay: Yup.number()
      .label("Timesheet Start Day")
      .min(0)
      .max(31)
      .default(1)
      .required(),
    approvalEmail: Yup.string()
      .trim()
      .nullable()
      .label("Approval Email")
      .test("valid-emails", "Approval Email is Invalid", (value) => {
        if (!value) return true; // Allow empty string if needed
        const emails = value.split(",").map((email) => email.trim());
        const isValidEmails = emails.every((email) => {
          return email.includes("@") && email.includes(".");
        });
        if (isValidEmails) {
          return true;
        } else {
          return false;
        }
      }),
    isShowPrices: Yup.boolean().default(false).label("Show Prices"),
    isShowCostCenter: Yup.boolean().default(false).label("Show Cost Center"),
    isShowCatalogueNo: Yup.boolean().default(false).label("Show Catalogue No"),
    titreDeConge: Yup.string()
      .trim()
      .nullable()
      .label("Titre De Conge")
      .test("valid-emails", "Titre de Congé Email is Invalid", (value) => {
        if (!value) return true; // Allow empty string if needed
        const emails = value.split(",").map((email) => email.trim());
        const isValidEmails = emails.every((email) => {
          return email.includes("@") && email.includes(".");
        });
        if (isValidEmails) {
          return true;
        } else {
          return false;
        }
      }),
    isResetBalance: Yup.boolean().default(false).label("Reset Balance"),
    startMonthBack: Yup.number()
      .label("Start Month Back")
      .default(0)
      .required(),
    medicalEmailSubmission: Yup.string()
      .trim()
      .nullable()
      .label("Medical Email Submission")
      .test("valid-emails", "Medical Email Submission is Invalid", (value) => {
        if (!value) return true; // Allow empty string if needed
        const emails = value.split(",").map((email) => email.trim());
        const isValidEmails = emails.every((email) => {
          return email.includes("@") && email.includes(".");
        });
        if (isValidEmails) {
          return true;
        } else {
          return false;
        }
      }),
    medicalEmailToday: Yup.string()
      .trim()
      .nullable()
      .label("Medical Email Today")
      .test("valid-emails", "Medical Email Today is Invalid", (value) => {
        if (!value) return true; // Allow empty string if needed
        const emails = value.split(",").map((email) => email.trim());
        const isValidEmails = emails.every((email) => {
          return email.includes("@") && email.includes(".");
        });
        if (isValidEmails) {
          return true;
        } else {
          return false;
        }
      }),
    medicalEmailMonthly: Yup.string()
      .trim()
      .nullable()
      .label("Medical Email Monthly")
      .test("valid-emails", "Medical Email Monthly is Invalid", (value) => {
        if (!value) return true; // Allow empty string if needed
        const emails = value.split(",").map((email) => email.trim());
        const isValidEmails = emails.every((email) => {
          return email.includes("@") && email.includes(".");
        });
        if (isValidEmails) {
          return true;
        } else {
          return false;
        }
      }),
    isShowNSS: Yup.boolean().default(false).label("Show NSS"),
    isShowCarteChifa: Yup.boolean().default(false).label("Show Carte Chifa"),
    isShowSalaryInfo: Yup.boolean().default(false).label("Show Salary Info"),
    isShowRotation: Yup.boolean().default(false).label("Show Rotation"),
    isShowBalance: Yup.boolean().default(false).label("Show Balance"),
    logo: Yup.string().nullable().label("Logo"),
    stampLogo: Yup.string().nullable().label("Stamp Logo"),
    // .test(
    //   "fileType",
    //   "Invalid file. only images are allowed (.jpg, .jpeg, .png)",
    //   function (value: any) {
    //     return !value || ImageTypeValidation(["jpg", "jpeg", "png"], value);
    //   }
    // )
    segment: Yup.string().trim().nullable().label("Segment"),
    subSegment: Yup.string().trim().nullable().label("Sub Segment"),
    bonusType: Yup.string().trim().nullable().label("Bonus Type"),
    contractTagline: Yup.string().trim().nullable().label("Tagline"),
    contractN: Yup.string().trim().nullable().label("N"),
    address: Yup.string().trim().nullable().label("Address"),
  });
