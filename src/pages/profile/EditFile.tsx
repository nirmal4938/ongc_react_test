import SelectComponent from "@/components/formComponents/customSelect/Select";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { Option } from "@/interface/customSelect/customSelect";
import { GetFolderData } from "@/services/folderService";
import { IEmployeeFileData } from "@/interface/employeeFile/employeeFileInterface";
import TextField from "@/components/formComponents/textField/TextField";
import { EditEmployeeFileData } from "@/services/employeeFileService";
interface EditFileProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  requiredValues: {
    employeeName: string;
    fileDetails: IEmployeeFileData | null;
  };
}

const EditFile = ({
  openModal,
  setOpenModal,
  requiredValues,
}: EditFileProps) => {
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [folderData, setFolderData] = useState<Option[]>([]);
  useEffect(() => {
    fetchAllFolder();
  }, []);

  async function fetchAllFolder() {
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
  }
  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };
  return (
    <>
      {openModal && (
        <Modal
          title="Edit Employee File"
          width="max-w-[564px]"
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
            initialValues={{
              folderId: requiredValues.fileDetails?.folderId,
              name: requiredValues.fileDetails?.name,
            }}
            enableReinitialize={true}
            onSubmit={async (values) => {
              await EditEmployeeFileData(
                {
                  folderId: values.folderId,
                  newFileName: values.name,
                },
                Number(requiredValues.fileDetails?.id)
              );
              setOpenModal(false);
            }}
          >
            {({ setFieldValue, values }) => (
              <Form>
                <Card title="Information" parentClass="mb-5 last:mb-0">
                  <>
                    <ul className="grid gap-4">
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          Employee:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          {requiredValues?.employeeName}
                        </span>
                      </li>
                      <li className="flex flex-wrap text-sm/18px">
                        <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                          File name:
                        </span>
                        <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                          {requiredValues?.fileDetails?.name}
                        </span>
                      </li>
                    </ul>
                  </>
                </Card>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid gap-5">
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
                      />
                      <TextField
                        name="name"
                        parentClass=""
                        type="text"
                        smallFiled={true}
                        label={"File name"}
                        placeholder={""}
                      />
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default EditFile;
