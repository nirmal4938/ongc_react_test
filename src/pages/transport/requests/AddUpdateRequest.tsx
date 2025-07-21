import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useRef, useState } from "react";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { IAddUpdateRequest } from "@/interface/transport/transportInterface";
import { addRequestValidationSchema } from "@/validations/transport/addRequestValidation";
import { AddRequestData } from "@/services/transportRequestService";
import moment from "moment";

interface AddUpdateRotationProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateRequest = ({
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateRotationProps) => {
  const formikRef = useRef<FormikProps<FormikValues>>();
  const requestInitialData: IAddUpdateRequest = {
    source: "",
    startDate: null,
    destination: "",
    destinationDate: null,
  };
  const clientId = useSelector(activeClientSelector);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const params = {
      clientId: clientId,
      source: values.source,
      startDate: values.startDate,
      destination: values.destination,
      destinationDate: moment(values.destinationDate)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss+05:30"),
    };
    if (clientId) {
      const response = await AddRequestData(params);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        if (fetchAllData) {
          fetchAllData();
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
    <>
      {openModal && (
        <Modal
          hideFooterButton={false}
          width="max-w-[870px]"
          title={`Add Request   `}
          closeModal={() => setOpenModal(false)}
          onClickHandler={handleSubmitRef}
          loaderButton={loader}
          modalBodyClass="!max-h-unset overflow-unset"
        >
          <Formik
            initialValues={requestInitialData}
            enableReinitialize={true}
            validationSchema={addRequestValidationSchema()}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="source"
                      parentClass=" col-span-2"
                      type="text"
                      smallFiled={true}
                      label={"Source"}
                      placeholder={""}
                      isCompulsory={true}
                    />
                    <DateComponent
                      name="startDate"
                      smallFiled
                      dateFormat="dd/MM/yyyy"
                      label={"Start Date"}
                      value={values.startDate}
                      placeholder={""}
                      minDate={new Date()}
                      isCompulsory={true}
                      onChange={(date) => {
                        setFieldValue("startDate", date);
                      }}
                    />
                    <TextField
                      name="destination"
                      parentClass=" col-span-1"
                      type="text"
                      smallFiled={true}
                      label={"Destination"}
                      placeholder={""}
                      isCompulsory={true}
                    />
                    <DateComponent
                      name="destinationDate"
                      smallFiled
                      label={"Destination Date"}
                      dateFormat="dd/MM/yyyy"
                      value={values.destinationDate}
                      placeholder={""}
                      minDate={new Date(values.startDate)}
                      isCompulsory={true}
                      onChange={(date) => {
                        setFieldValue("destinationDate", date);
                      }}
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

export default AddUpdateRequest;
