import * as Yup from "yup";
import { DOCUMENT_SUPPORTED_FORMATS } from "@/utils/commonConstants";

export const addUpdateVehicleDocumentValidationSchema = () =>
  Yup.object().shape({
    documentName: Yup.string().trim().required("Document Name is required"),
    folderId: Yup.string().trim().required("Folder is required"),
    documentPath: Yup.lazy((value) => {
      switch (typeof value) {
        case "string":
          return Yup.string();
        default:
          return Yup.mixed()
            .required("Document is required")
            .test(
              "size",
              "Document size should be less than 5 MB",
              () => !value || (value && value.size <= 1024 * 1024 * 5)
            )
            .test(
              "format",
              "Only the following formats are accepted: .jpeg, .jpg, and .png .pdf",
              () =>
                !value ||
                (value && DOCUMENT_SUPPORTED_FORMATS.includes(value.type))
            );
      }
    }),
  });
