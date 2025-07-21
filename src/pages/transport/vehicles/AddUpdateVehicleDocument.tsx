import Card from "@/components/card/Card";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import FileInput from "@/components/formComponents/fileInput/FileInput";
import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import { Option } from "@/interface/customSelect/customSelect";
import {
  IVehicleData,
  IVehicleDocument,
} from "@/interface/transport/transportInterface";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { GetFolderData } from "@/services/folderService";
import {
  AddVehicleDocumentData,
  GetVehicleDocumentByDocumentId,
  UpdateVehicleDocumentByDocumentId,
} from "@/services/transportVehicleService";
import { addUpdateVehicleDocumentValidationSchema } from "@/validations/transport/addUpdateVehicleDocumentValidation";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddUpdateVehicleDocument = ({
  setOpenModal,
  id,
  vehicleDetail,
  fetchAllData,
}: {
  id?: string;
  vehicleDetail?: IVehicleData;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}) => {
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const defaultInitialValues = {
    documentName: "",
    folderId: "",
    documentPath: "",
    issueDate: null,
    expiryDate: null,
  };
  const clientId = useSelector(activeClientSelector);
  const [initialValues, setInitialValues] =
    useState<IVehicleDocument>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const [folderOptions, setFolderOptions] = useState<Option[]>([]);

  useEffect(() => {
    getFolderData();
  }, []);

  useEffect(() => {
    if (id) {
      getVehicleDocumentDataByDocumentId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getVehicleDocumentDataByDocumentId = async (id: string) => {
    dispatch(showLoader());
    const response = await GetVehicleDocumentByDocumentId(id);
    if (
      response.data.responseData &&
      response.data.response_type === "success"
    ) {
      const data = response.data.responseData;

      setInitialValues({
        documentName: data.documentName,
        folderId: data.folderId,
        documentPath: data.documentPath,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      });
    }
    dispatch(hideLoader());
  };

  const getFolderData = async () => {
    const response = await GetFolderData();
    if (
      response?.data?.response_type === "success" &&
      response.data.responseData
    ) {
      const result = response?.data?.responseData;
      const temp = result.data.map((e: { [key: string]: string }) => ({
        value: e.id,
        label: e.name,
      }));
      setFolderOptions(temp);
    }
  };

  const submitFormData = async (bodyData: FormData, id?: string) => {
    const response = id
      ? await UpdateVehicleDocumentByDocumentId(bodyData, id)
      : await AddVehicleDocumentData(bodyData);

    return response?.data?.response_type === "success";
  };

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);

    const bodyData = new FormData();
    bodyData.append("clientId", String(clientId));
    bodyData.append("vehicleId", String(vehicleDetail?.id ?? ""));
    bodyData.append("documentName", values.documentName);
    bodyData.append("documentPath", values.documentPath);

    values.folderId && bodyData.append("folderId", values.folderId);
    values.issueDate && bodyData.append("issueDate", values.issueDate);
    values.expiryDate && bodyData.append("expiryDate", values.expiryDate);

    if (clientId) {
      const success = await submitFormData(bodyData, id);

      if (success) {
        setOpenModal(false);
        if (fetchAllData) {
          fetchAllData();
        }
        if (id) {
          setInitialValues(defaultInitialValues);
        }
      }
    }
    setLoader(false);
  };

  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <div>
      <Modal
        hideFooterButton={false}
        width="max-w-[870px]"
        title={`${id ? "Edit" : "Add"} Document`}
        closeModal={() => setOpenModal(false)}
        onClickHandler={handleSubmitRef}
        loaderButton={loader}
        modalBodyClass="overflow-unset"
      >
        <>
          {id && (
            <Card>
              <div>
                <h2 className="text-25px leading-28px font-bold">
                  <span className="inline-block">OverView</span>
                </h2>
                <div className="flex flex-row">
                  <h3 className="text-25px leading-28px font-bold">
                    <span className="inline-block">Vehicle No:</span>
                  </h3>
                  {vehicleDetail?.vehicleNo ?? "-"}
                </div>
              </div>
            </Card>
          )}
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={addUpdateVehicleDocumentValidationSchema}
            onSubmit={(values) => OnSubmit(values)}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <>
                  <Card parentClass="mb-5 last:mb-0">
                    <div className="grid grid-cols-2 gap-5">
                      <TextField
                        name="documentName"
                        parentClass=""
                        type="text"
                        smallFiled={true}
                        label={"File Name"}
                        placeholder={""}
                        isCompulsory={true}
                      />
                      <CustomSelect
                        inputClass={""}
                        name="folderId"
                        label="Folder"
                        isMulti={false}
                        placeholder=""
                        options={folderOptions}
                        selectedValue={values.folderId}
                        isCompulsory={true}
                        isUseFocus={true}
                        className="bg-white"
                      />
                      <FileInput
                        parentClass=" col-span-2"
                        setValue={setFieldValue}
                        name="documentPath"
                        value={
                          values?.documentPath ? values?.documentPath : null
                        }
                        isImage={true}
                        acceptTypes="application/pdf,application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                      <DateComponent
                        name="issueDate"
                        smallFiled
                        dateFormat="dd/MM/yyyy"
                        label={"Issue Date"}
                        value={values.issueDate}
                        placeholder={""}
                        onChange={(date) => {
                          setFieldValue("issueDate", date);
                        }}
                      />
                      <DateComponent
                        name="expiryDate"
                        smallFiled
                        dateFormat="dd/MM/yyyy"
                        label={"Expiry Date"}
                        value={values.expiryDate}
                        placeholder={""}
                        onChange={(date) => {
                          setFieldValue("expiryDate", date);
                        }}
                      />
                    </div>
                  </Card>
                </>
              </Form>
            )}
          </Formik>
        </>
      </Modal>
    </div>
  );
};

export default AddUpdateVehicleDocument;
