import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { IFolderData } from "@/interface/folder/folderInterface";
import { FolderValidationSchema } from "@/validations/folder/FolderValidation";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { folderTypeIdList } from "@/constants/DropdownConstants";
import {
  AddFolderData,
  EditFolderData,
  GetFolderDataById,
} from "@/services/folderService";
import { Option } from "@/interface/customSelect/customSelect";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { useDispatch } from "react-redux";

interface AddUpdateFolderProps {
  id?: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateFolder = ({
  id,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateFolderProps) => {
  const defaultInitialValues: IFolderData = {
    name: "",
    index: null,
    typeId: 1,
  };
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [folderData, setFolderData] =
    useState<IFolderData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    if (id) {
      delete values.clientId;
      const response = await EditFolderData(values, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddFolderData(values);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    if (id) {
      fetchFolderData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchFolderData(id: string) {
    dispatch(showLoader());
    try {
      const response = await GetFolderDataById(id);

      if (response?.data?.responseData) {
        const resultData = response?.data?.responseData;
        setFolderData({
          name: resultData.name,
          index: resultData.index,
          typeId: resultData.typeId,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
    dispatch(hideLoader());
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
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
          loaderButton={loader}
          width="max-w-[870px]"
          title={`${id ? "Edit" : "Add"} Folder`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={folderData}
            validationSchema={FolderValidationSchema()}
            enableReinitialize={true}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="name"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Name"}
                      isCompulsory={true}
                      disabled={!!id}
                    />
                    <TextField
                      name="index"
                      parentClass=""
                      type="number"
                      smallFiled={true}
                      label={"Index"}
                      placeholder={"Index"}
                      isCompulsory={true}
                      min={1}
                    />
                    <SelectComponent
                      options={folderTypeIdList ? folderTypeIdList : []}
                      selectedValue={values.typeId}
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("typeId", (option as Option).value);
                      }}
                      name="typeId"
                      label="Status"
                      className="bg-white"
                      isCompulsory={true}
                      menuPlacement="top"
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

export default AddUpdateFolder;
