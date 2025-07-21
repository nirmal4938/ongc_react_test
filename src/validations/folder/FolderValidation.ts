import * as Yup from "yup";

export const FolderValidationSchema = () =>
  Yup.object().shape({
    index: Yup.number()
      .required("Index is required")
      .test(
        "Is positive?",
        "Index must be greater than 0 !",
        (value) => value > 0
      ),
    name: Yup.string().trim().required("Name is required"),
    typeId: Yup.number().required("Type Id is required"),
  });
