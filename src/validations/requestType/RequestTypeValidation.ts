import * as Yup from "yup";

export const RequestTypeValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    notificationEmails: Yup.string()
      .trim()
      .label("Notification Emails")
      .test("valid-emails", "Notification Emails is Invalid", (value) => {
        if (!value) return true; // Allow empty string if needed
        const emails = value.split(",").map((email) => email.trim());
        const emailSchema = Yup.string().email(
          "Notification Emails is Invalid"
        );
        return emails.every((email) => emailSchema.isValidSync(email));
      }),
  });
