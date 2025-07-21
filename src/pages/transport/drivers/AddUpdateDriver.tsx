import Card from "@/components/card/Card";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import { IDriverInitialData } from "@/interface/transport/transportInterface";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  AddDriverData,
  GetDriverDataById,
  UpdateDriverData,
} from "@/services/transportDriverService";
import { GetTransportData } from "@/services/transportSummaryService";
import { addUpdateDriverValidationSchema } from "@/validations/transport/addUpdateDriverValidation";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddUpdateDriver = ({
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
    driverNo: "",
    firstName: "",
    lastName: "",
    positionId: "",
    companyStart: null,
    experienceStart: null,
  };
  const [initialValues, setInitialValues] =
    useState<IDriverInitialData>(defaultInitialValues);
  const clientId = useSelector(activeClientSelector);
  const [loader, setLoader] = useState<boolean>(false);
  const [positionsOptions, setPositionsOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    getPositionsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getDriverDataById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDriverDataById = async (id: string) => {
    dispatch(showLoader());
    const response = await GetDriverDataById(id);
    if (
      response.data.responseData &&
      response.data.response_type === "success"
    ) {
      const data = response.data.responseData;
      setInitialValues({
        driverNo: data.driverNo,
        firstName: data.firstName,
        lastName: data.lastName,
        positionId: data.positionId,
        companyStart: data.companyStart ? new Date(data.companyStart) : null,
        experienceStart: data.experienceStart
          ? new Date(data.experienceStart)
          : null,
      });
    }
    dispatch(hideLoader());
  };

  const getPositionsData = async () => {
    const queryString =
      `?type=TransportPositions` +
      (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);
    if (clientId) {
      const res = await GetTransportData(queryString);
      if (res?.data?.response_type === "success" && res.data.responseData) {
        const result = res?.data?.responseData;
        const temp = result.data.map((e: { [key: string]: string }) => ({
          value: e.id,
          label: e.name,
        }));
        setPositionsOptions(temp);
      }
    }
  };

  const onSubmit = async (values: FormikValues) => {
    setLoader(true);
    if (clientId) {
      const params = {
        driverNo: values.driverNo,
        firstName: values.firstName,
        lastName: values.lastName,
        positionId: values.positionId,
        companyStart: values.companyStart,
        experienceStart: values.experienceStart,
        clientId: clientId,
      };
      if (id) {
        const response = await UpdateDriverData(params, id);
        if (response?.data?.response_type === "success") {
          setOpenModal(false);
          fetchDataById?.(id);
        }
      } else {
        const response = await AddDriverData(params);
        if (response?.data?.response_type === "success") {
          setOpenModal(false);
          if (fetchAllData) {
            fetchAllData();
          }
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
        title={`${id ? "Edit" : "Add"} Driver`}
        closeModal={() => setOpenModal(false)}
        onClickHandler={handleSubmitRef}
        loaderButton={loader}
        modalBodyClass="overflow-unset"
      >
        <Formik
          innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={addUpdateDriverValidationSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Card parentClass="mb-5 last:mb-0">
                <>
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="driverNo"
                      parentClass=" col-span-2"
                      type="text"
                      smallFiled={true}
                      label={"Driver No"}
                      placeholder={""}
                      isCompulsory={true}
                    />
                    <TextField
                      name="firstName"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"First Name"}
                      placeholder={""}
                      isCompulsory={true}
                    />

                    <TextField
                      name="lastName"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Last Name"}
                      placeholder={""}
                      isCompulsory={true}
                    />
                    <CustomSelect
                      inputClass={"bg-white"}
                      className={"bg-white"}
                      name="positionId"
                      label="Position"
                      isMulti={false}
                      placeholder=""
                      options={positionsOptions}
                      selectedValue={values.positionId}
                      isCompulsory={true}
                      isUseFocus={true}
                    />
                    <DateComponent
                      name="companyStart"
                      dateFormat="dd/MM/yyyy"
                      isCompulsory={true}
                      smallFiled
                      label={"Company Start"}
                      value={values.companyStart}
                      placeholder={""}
                      // maxDate={new Date()}
                      onChange={(date) => {
                        setFieldValue("companyStart", date);
                      }}
                    />
                    <DateComponent
                      name="experienceStart"
                      dateFormat="dd/MM/yyyy"
                      isCompulsory={true}
                      smallFiled
                      label={"Experience Start"}
                      value={values.experienceStart}
                      placeholder={""}
                      maxDate={new Date()}
                      onChange={(date) => {
                        setFieldValue("experienceStart", date);
                      }}
                    />
                  </div>
                </>
              </Card>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default AddUpdateDriver;
