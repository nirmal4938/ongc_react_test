import { transportSummaryEnum } from "@/enum/transport";
import * as Yup from "yup";

export const addSummaryValidationSchema = () =>
  Yup.object().shape({
    summaryType: Yup.string().trim().required("Summary Type is required"),
    name: Yup.string()
      .trim()
      .when("summaryType", (data, schema) => {
        if (data && data[0] === transportSummaryEnum.Capacity) {
          return schema.required("Value is required");
        } else return schema.required("Name is required ");
      }),
  });
