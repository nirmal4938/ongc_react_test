import Card from "@/components/card/Card";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";
import Modal from "@/components/modal/Modal";
import { Option } from "@/interface/customSelect/customSelect";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { GetAllAvailableDriverData } from "@/services/transportDriverService";
import { GetAllAvailableVehicleData } from "@/services/transportVehicleService";
import {
  AddRequestVehicleData,
  GetRequestVehicleDetailById,
  UpdateRequestVehicleData,
} from "@/services/transportRequestService";
import { addRequestVehicleValidationSchema } from "@/validations/transport/addRequestVehicleValidation";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRequestData } from "@/interface/transport/transportInterface";
import moment from "moment";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";

const AddUpdateRequestVehicle = ({
  setOpenModal,
  id,
  fetchAllData,
  requestId,
  requestData,
}: {
  requestId: string | undefined;
  id?: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
  requestData?: IRequestData;
}) => {
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const defaultInitialValues = {
    vehicleId: "",
    driverId: "",
  };
  const clientId = useSelector(activeClientSelector);
  const [initialValues, setInitialValues] = useState<{
    vehicleId: string;
    driverId: string;
  }>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const [vehicleOptions, setVehicleOptions] = useState<Option[]>([]);
  const [driverOptions, setDriverOptions] = useState<Option[]>([]);

  const queryString = `?clientId=${clientId}&transportStartDate=${moment(
    requestData?.startDate
  ).format("DD/MM/YYYY")}&transportEndDate=${moment(
    requestData?.destinationDate
  ).format("DD/MM/YYYY")}`;

  useEffect(() => {
    if (requestData && clientId) {
      getVehicleOptions(queryString);
      getDriverOptions(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getRequestVehicleDetailById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getRequestVehicleDetailById = async (id: string) => {
    dispatch(showLoader());
    const response = await GetRequestVehicleDetailById(id);
    if (
      response.data.responseData &&
      response.data.response_type === "success"
    ) {
      const data = response.data.responseData;
      setVehicleOptions((prev) => [
        ...prev,
        { value: data.vehicleId, label: data.vehicle.vehicleNo },
      ]);
      setDriverOptions((prev) => [
        ...prev,
        { value: data.driverId, label: data.driver.driverNo },
      ]);

      setInitialValues({
        vehicleId: data.vehicleId,
        driverId: data.driverId,
      });
    }
    dispatch(hideLoader());
  };

  const getVehicleOptions = async (query: string) => {
    const response = await GetAllAvailableVehicleData(query);
    if (
      response?.data?.response_type === "success" &&
      response.data.responseData
    ) {
      const result = response?.data?.responseData;
      const temp = result.map((e: { [key: string]: string }) => ({
        value: e.id,
        label: e.vehicleNo,
      }));
      setVehicleOptions(temp);
    }
  };
  const getDriverOptions = async (query: string) => {
    const response = await GetAllAvailableDriverData(query);
    if (
      response?.data?.response_type === "success" &&
      response.data.responseData
    ) {
      const result = response?.data?.responseData;
      const temp = result.map((e: { [key: string]: string }) => ({
        value: e.id,
        label: e.driverNo,
      }));
      setDriverOptions(temp);
    }
  };

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    if (requestId && clientId && requestData) {
      const params = {
        clientId: clientId,
        vehicleId: values.vehicleId,
        driverId: values.driverId,
        requestId: requestId,
        startDate: moment(requestData?.startDate).format("DD/MM/YYYY"),
        endDate: moment(requestData?.destinationDate).format("DD/MM/YYYY"),
      };
      if (id) {
        const response = await UpdateRequestVehicleData(params, id);
        if (response?.data?.response_type === "success") {
          setOpenModal(false);
          fetchAllData?.();
          setInitialValues(defaultInitialValues);
        }
      } else {
        const response = await AddRequestVehicleData(params);
        if (response?.data?.response_type === "success") {
          setOpenModal(false);
          fetchAllData?.();
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
        title={`${id ? "Edit" : "Add"} Transport Request`}
        closeModal={() => setOpenModal(false)}
        onClickHandler={handleSubmitRef}
        loaderButton={loader}
      >
        <>
          <Card>
            <Formik
              innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={addRequestVehicleValidationSchema}
              onSubmit={(values) => OnSubmit(values)}
            >
              {({ values }) => (
                <Form>
                  <>
                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <CustomSelect
                        inputClass={""}
                        name="driverId"
                        label="Driver No"
                        isMulti={false}
                        placeholder=""
                        options={driverOptions}
                        selectedValue={values.driverId}
                        isCompulsory={true}
                        isUseFocus={true}
                      />

                      <CustomSelect
                        inputClass={""}
                        name="vehicleId"
                        label="Vehicle No"
                        isMulti={false}
                        placeholder=""
                        options={vehicleOptions}
                        selectedValue={values.vehicleId}
                        isCompulsory={true}
                        isUseFocus={true}
                      />
                    </div>
                  </>
                </Form>
              )}
            </Formik>
          </Card>
        </>
      </Modal>
    </div>
  );
};

export default AddUpdateRequestVehicle;
