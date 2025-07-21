import * as Yup from "yup";

export const RequestDocumentValidationSchema = () =>
  Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    contractNumber: Yup.string().trim().required("Contract Number is required"),
    mobileNumber: Yup.string().trim().required("Mobile Number is required"),
    email: Yup.string()
      .email("Email is invalid")
      .max(255, "Maximum 255 Characters allowed")
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, "Email is invalid"),
    emailDocument: Yup.boolean().label("Email Document"),
    deliveryType: Yup.string().required("Delivery Type is required"),
    deliveryDate: Yup.string().required("Date is required"),
    requestDocument: Yup.array()
      .of(
        Yup.object().shape({
          documentType: Yup.number().label("Document Type").required(),
          otherInfo: Yup.string().label("Other Info"),
        })
      )
      .min(1, "Document Type is required"),
  });
