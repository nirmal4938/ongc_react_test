import * as Yup from "yup";

export const MessageValidationSchema = () =>
  Yup.object().shape({
    employeeId: Yup.array()
      .of(Yup.string())
      .min(1, "At least one employee needs to be selected")
      .required("Employee is required"),
    message: Yup.string()
      .trim()
      .test("contains-meaningful-text", "Message is required", (value) => {
        const textWithoutTags = value?.replace(/<\/?[^>]+(>|$)/g, "");
        return textWithoutTags?.trim() !== "";
      }),
  });

export const MessageSalaryValidationSchema = () =>
  Yup.object().shape({
    employeeId: Yup.array().of(Yup.string()),
  segmentId: Yup.array()
    .of(Yup.string())
    .test({
      test: function (value) {
        const employeeId =
          this.parent.employeeId && this.parent.employeeId.length > 0;
        return employeeId || (value && value.length > 0);
      },
      message: "Either employeeId or segmentId is required",
    }),

    messageData: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().nullable(),
        phone: Yup.string().nullable(),
        email: Yup.string().nullable(),
        // .test({
        //   test: function (value) {
        //     const phone = this.parent.phone;
        //     return !phone || phone === "" ? !!value : true;
        //   },
        //   message: "Either email or phone is required",
        // })
        monthlySalary: Yup.number().nullable(),
        bonusPrice: Yup.number().nullable(),
        total: Yup.number().nullable(),
        salaryDate: Yup.date().nullable(),
        roleId: Yup.string().nullable(),
        id: Yup.string().nullable(),
      })
    ),

    message: Yup.string()
      .trim()
      .test("contains-meaningful-text", "Message is required", (value) => {
        const textWithoutTags = value?.replace(/<\/?[^>]+(>|$)/g, "");
        return textWithoutTags?.trim() !== "";
      })
      .test(
        "contains-placeholders",
        "Message must include [Total], [BonusPrice], [SalaryMonth], [MonthlySalary], [SalaryDate]",
        (value) => {
          const placeholders = [
            "[SalaryMonth]",
            "[Total]",
            "[BonusPrice]",
            "[MonthlySalary]",
            "[SalaryDate]",
          ];
          return placeholders.every((placeholder) =>
            value?.includes(placeholder)
          );
        }
      ),
  });
