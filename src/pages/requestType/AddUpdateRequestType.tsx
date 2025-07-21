import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { IRequestTypeData } from "@/interface/requestType/requestTypeInterface";
import {
  AddRequestTypeData,
  EditRequestTypeData,
  GetRequestTypeDataById,
} from "@/services/requestTypeService";
import { RequestTypeValidationSchema } from "@/validations/requestType/RequestTypeValidation";
import Textarea from "@/components/formComponents/textarea/Textarea";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { useDispatch } from "react-redux";

interface AddUpdateRequestTypeProps {
  id?: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateRequestType = ({
  id,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateRequestTypeProps) => {
  const defaultInitialValues: IRequestTypeData = {
    name: "",
    notificationEmails: "",
  };
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [requestTypeData, setRequestTypeData] =
    useState<IRequestTypeData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    values.notificationEmails = values.notificationEmails
      ? values.notificationEmails.replaceAll(", ", ",").split(",")
      : [];
    if (id) {
      delete values.clientId;
      const response = await EditRequestTypeData(values, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddRequestTypeData(values);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    if (id) {
      fetchRequestTypeData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchRequestTypeData(id: string) {
    dispatch(showLoader());
    try {
      const response = await GetRequestTypeDataById(id);

      if (response?.data?.responseData) {
        const resultData = response?.data?.responseData;
        setRequestTypeData({
          name: resultData.name,
          notificationEmails: resultData.notificationEmails,
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
          title={`${id ? "Edit" : "Add"} Request Types`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={requestTypeData}
            enableReinitialize={true}
            validationSchema={RequestTypeValidationSchema()}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {() => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <TextField
                      name="name"
                      parentClass="mb-5 last:mb-0"
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Enter Name"}
                      isCompulsory={true}
                    />
                    <Textarea
                      name="notificationEmails"
                      parentClass="mb-5 last:mb-0"
                      type="text"
                      smallFiled={true}
                      label={"Notification Emails"}
                      placeholder={"Enter Notification Emails"}
                    />
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

export default AddUpdateRequestType;
