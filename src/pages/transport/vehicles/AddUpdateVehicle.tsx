import Card from "@/components/card/Card";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";
import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import { Option } from "@/interface/customSelect/customSelect";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  GetAllSummaryData,
  GetTransportCapacityData,
} from "@/services/transportSummaryService";
import {
  AddVehicleData,
  GetVehicleDataById,
  UpdateVehicleData,
} from "@/services/transportVehicleService";
import { addUpdateVehicleValidationSchema } from "@/validations/transport/addUpdateVehicleValidation";
import { ErrorMessage, Form, Formik, FormikProps, FormikValues } from "formik";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";

const AddUpdateVehicle = ({
  setOpenModal,
  id,
  fetchAllData,
  fetchDataById,
}: {
  id?: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
  fetchDataById?: (id: string) => void;
}) => {
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const defaultInitialValues = {
    vehicleNo: "",
    year: new Date(),
    typeId: "",
    modelId: "",
    capacity: [],
  };
  const [initialValues, setInitialValues] = useState(defaultInitialValues);
  const clientId = useSelector(activeClientSelector);
  const [loader, setLoader] = useState<boolean>(false);
  const [typeOptions, setTypeOptions] = useState<Option[]>([]);
  const [modelOptions, setModelOptions] = useState<Option[]>([]);
  const [capacityOptions, setCapacityOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (clientId) {
      getTypeData();
      getModelData();
      getCapacityData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getVehicleDataById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getVehicleDataById = async (id: string) => {
    dispatch(showLoader());
    const response = await GetVehicleDataById(id);
    if (
      response.data.responseData &&
      response.data.response_type === "success"
    ) {
      const data = response.data.responseData;
      setInitialValues({
        ...response.data.responseData,
        capacity: data.capacity.split(","),
        year: new Date(String(data.year)),
      });
    }
    dispatch(hideLoader());
  };

  const getTypeData = async () => {
    const queryString =
      `?type=TransportType` +
      (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);
    const res = await GetAllSummaryData(queryString);
    if (res?.data?.response_type === "success" && res.data.responseData) {
      const result = res?.data?.responseData;
      const temp = result.data.map((e: { [key: string]: string }) => ({
        value: e.id,
        label: e.name,
      }));
      setTypeOptions(temp);
    }
  };

  const getModelData = async () => {
    const queryString =
      `?type=TransportModels` +
      (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);
    const res = await GetAllSummaryData(queryString);
    if (res?.data?.response_type === "success" && res.data.responseData) {
      const result = res?.data?.responseData;
      const temp = result.data.map((e: { [key: string]: string }) => ({
        value: e.id,
        label: e.name,
      }));
      setModelOptions(temp);
    }
  };

  const getCapacityData = async () => {
    const queryString =
      clientId != 0 && clientId != -1 ? `?clientId=${clientId}` : ``;
    const res = await GetTransportCapacityData(queryString);
    if (res?.data?.response_type === "success" && res.data.responseData) {
      const result = res?.data?.responseData;
      const temp = result.data.map((e: { [key: string]: string }) => ({
        value: String(e.value),
        label: e.value,
      }));
      setCapacityOptions(temp);
    }
  };

  const onSubmit = async (values: FormikValues) => {
    setLoader(true);
    if (clientId) {
      const params = {
        vehicleNo: values.vehicleNo,
        modelId: values.modelId,
        year: values.year.getFullYear(),
        typeId: values.typeId,
        capacity: values.capacity,
        clientId: clientId,
      };
      const handleSuccess = async () => {
        setOpenModal(false);
        if (id) {
          fetchDataById?.(id);
        } else {
          fetchAllData?.();
        }
      };

      if (id) {
        const response = await UpdateVehicleData(params, id);
        if (response?.data?.response_type === "success") {
          await handleSuccess();
        }
      } else {
        const response = await AddVehicleData(params);
        if (response?.data?.response_type === "success") {
          await handleSuccess();
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
        title={`${id ? "Edit" : "Add"} Vehicle`}
        closeModal={() => setOpenModal(false)}
        onClickHandler={handleSubmitRef}
        loaderButton={loader}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={addUpdateVehicleValidationSchema}
          onSubmit={(values) => onSubmit(values)}
          innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Card parentClass="mb-5 last:mb-0">
                <div className="grid grid-cols-2 gap-5">
                  <TextField
                    name="vehicleNo"
                    parentClass=" col-span-2"
                    type="text"
                    smallFiled={true}
                    label={"Vehicle No"}
                    isCompulsory={true}
                    placeholder={""}
                  />
                  <div>
                    <label className="block mb-10px text-sm/18px text-left font-semibold">
                      Year
                      <span className="text-red">*</span>
                    </label>
                    <DatePicker
                      name="year"
                      dateFormatCalendar="yyyy"
                      className={` py-11px px-15px text-sm/18px text-black placeholder:text-black/50 w-full border border-solid border-customGray/20 rounded-lg transition-all duration-300  focus:ring-2 focus:ring-customGray/30 focus:ring-offset-2`}
                      onChange={(date: Date) => setFieldValue("year", date)}
                      selected={values.year}
                      showYearPicker
                      dateFormat="yyyy"
                      maxDate={moment().toDate()}
                    />
                    <ErrorMessage name={"year"}>
                      {(msg) => (
                        <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                  <CustomSelect
                    inputClass={""}
                    name="typeId"
                    label="Type"
                    isMulti={false}
                    placeholder=""
                    options={typeOptions}
                    selectedValue={values.typeId}
                    isCompulsory={true}
                    isUseFocus={true}
                    className="bg-white"
                  />
                  <CustomSelect
                    isUseFocus={true}
                    inputClass={""}
                    label="Model"
                    isMulti={false}
                    name="modelId"
                    placeholder=""
                    options={modelOptions}
                    selectedValue={values.modelId}
                    isCompulsory={true}
                    className="bg-white"
                  />
                  <CustomSelect
                    isUseFocus={false}
                    inputClass={""}
                    label="Capacity"
                    isMulti={true}
                    name="capacity"
                    placeholder=""
                    options={capacityOptions}
                    isCompulsory={true}
                    className="bg-white"
                  />
                </div>
              </Card>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default AddUpdateVehicle;
