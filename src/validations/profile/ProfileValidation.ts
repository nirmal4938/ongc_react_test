import { FileLinkReg } from "@/utils/commonConstants";
import * as Yup from "yup";
export const addProfileValidation = () =>
  Yup.object().shape({
    matricule: Yup.string().label("Matricule").trim(),
    contractNumber: Yup.string().label("Contract Number").trim(),
    folderId: Yup.number().label("Folder Id").required(),
    fileLink: Yup.string().trim().matches(FileLinkReg, 'Enter valid file link. Only docs,docx and pdf file link allowed').label("Employee File Link").nullable(),
    employeeFile: Yup.string().when(
      "fileLink",
      (e: string[] | null, schema) => {
        const filteredArray = e?.filter((data) => data !== null) ?? [];
        if (filteredArray?.length == 0) {
          return schema.required(
            "Either select a file or fill up the file link below"
          );
        } else {
          return schema.nullable();
        }
      }
    ),
  });
