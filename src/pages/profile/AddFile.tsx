import SelectComponent from "@/components/formComponents/customSelect/Select";
import TextField from "@/components/formComponents/textField/TextField";
import { Option } from "@/interface/customSelect/customSelect";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { GetFolderData } from "@/services/folderService";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import FileInput from "@/components/formComponents/fileInput/FileInput";
import { AddEmployeeFileData } from "@/services/employeeFileService";
import { addProfileValidation } from "@/validations/profile/ProfileValidation";

interface AddFileProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  employeeData: IEmployeeData | null;
}

const AddFile = ({ openModal, setOpenModal, employeeData }: AddFileProps) => {
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [loader, setLoader] = useState<boolean>(false);
  const [folderData, setFolderData] = useState<Option[]>([]);

  useEffect(() => {
    if (employeeData?.id) {
      fetchAllFolder();
    }
  }, [employeeData?.id]);

  async function fetchAllFolder() {
    setLoader(true);
    const response = await GetFolderData();
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setFolderData(resp);
    }
    setLoader(false);
  }

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const EmployeeFileData = new FormData();
    EmployeeFileData.append("employeeId", String(employeeData?.id));
    EmployeeFileData.append("folderId", values?.folderId);
    if (values.employeeFile) {
      EmployeeFileData.append("fileName", values.employeeFile);
      EmployeeFileData.append("fileLink", "false");
    } else if (values.fileLink) {
      EmployeeFileData.append("fileName", values.fileLink);
      EmployeeFileData.append("fileLink", "true");
    }

    const response = await AddEmployeeFileData(EmployeeFileData);
    if (response?.data?.response_type === "success") {
      setOpenModal(false);
    }
    setLoader(false);
  };
  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <>
      {openModal && (
        <Modal
          width="max-w-[870px]"
          title={"Add File"}
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
          loaderButton={loader}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={{
              matricule: employeeData?.employeeNumber,
              contractNumber:
                employeeData?.employeeContracts?.length &&
                employeeData?.employeeContracts[0]?.newContractNumber,
              folderId: null,
              employeeFile: null,
              fileLink: null,
            }}
            validationSchema={addProfileValidation()}
            enableReinitialize={true}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ setFieldValue, values }) => (
              <Form>
                <Card title="Employee Details" parentClass="mb-10 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="matricule"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Matricule"}
                      placeholder={""}
                      disabled={true}
                    />
                    <TextField
                      name="contractNumber"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Contract Number"}
                      placeholder={""}
                      disabled={true}
                    />
                    <SelectComponent
                      name="folderId"
                      selectedValue={values?.folderId}
                      options={folderData}
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("folderId", (option as Option).value);
                      }}
                      placeholder="Select"
                      label="Folder"
                      className="bg-white"
                      isCompulsory
                    />
                  </div>
                </Card>
                <Card title="Employee Details" parentClass="mb-10 last:mb-0">
                  <div className="grid grid-cols-1 gap-5">
                    <TextField
                      name="fileLink"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Employee File URL"}
                      placeholder={""}
                    />
                    <FileInput
                      setValue={setFieldValue}
                      acceptTypes="application/pdf,application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      name="employeeFile"
                      label="Employee File"
                      value={values?.employeeFile ? values?.employeeFile : null}
                      isImage={false}
                      // isCompulsory
                    />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default AddFile;
