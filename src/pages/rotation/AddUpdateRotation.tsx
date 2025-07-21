import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { ErrorMessage, Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { IRotationData } from "@/interface/rotation/rotationInterface";
import { RotationValidationSchema } from "@/validations/rotation/RotationValidation";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import {
  AddRotationData,
  EditRotationData,
  GetRotationDataById,
} from "@/services/rotationService";
import { daysOfWeek } from "@/constants/DropdownConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { useDispatch } from "react-redux";

interface AddUpdateRotationProps {
  id?: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateRotation = ({
  id,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateRotationProps) => {
  const defaultInitialValues: IRotationData = {
    name: "",
    weekOn: null,
    weekOff: null,
    isResident: false,
    daysWorked: "",
    isWeekendBonus: false,
    isOvertimeBonus: false,
  };
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [rotationData, setRotationData] =
    useState<IRotationData>(defaultInitialValues);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    values.daysWorked = [...selectedDays]
      .sort(function (a, b) {
        return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
      })
      .toString();
    values.weekOff =
      values.weekOff != null || values.weekOff != "" ? values.weekOff : null;
    values.weekOn =
      values.weekOn != null || values.weekOn != "" ? values.weekOn : null;
    values.daysWorked = values.daysWorked ?? "";
    if (id) {
      delete values.clientId;
      const response = await EditRotationData(values, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddRotationData(values);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    if (id) {
      fetchRotationData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCheckboxChange = (day: string) => {
    let dayArray = [];
    if (selectedDays.includes(day)) {
      dayArray = selectedDays.filter((selectedDay) => selectedDay !== day);
    } else {
      dayArray = [...selectedDays, day];
    }
    setSelectedDays(dayArray);
    return dayArray;
  };

  async function fetchRotationData(id: string) {
    dispatch(showLoader());
    const response = await GetRotationDataById(id);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setRotationData({
        name: resultData.name,
        weekOn: resultData.weekOn,
        weekOff: resultData.weekOff,
        isResident: resultData.isResident,
        daysWorked: resultData.daysWorked ?? "",
        isWeekendBonus: resultData.isWeekendBonus,
        isOvertimeBonus: resultData.isOvertimeBonus,
      });
      setSelectedDays(
        resultData.daysWorked ? resultData.daysWorked.split(",") : []
      );
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
          title={`${id ? "Edit" : "Add"} Rotation`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={rotationData}
            enableReinitialize={true}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
            validationSchema={RotationValidationSchema()}
            onSubmit={OnSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="name"
                      parentClass=" col-span-2"
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Enter Name"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="weekOn"
                      parentClass=" col-span-1"
                      type="number"
                      min={0}
                      max={365}
                      smallFiled={true}
                      label={"On"}
                      placeholder={"Week On"}
                      disabled={id ? true : false}
                    />
                    <TextField
                      name="weekOff"
                      parentClass=" col-span-1"
                      type="number"
                      min={0}
                      max={365}
                      smallFiled={true}
                      label={"Off"}
                      placeholder={"Week Off"}
                      disabled={id ? true : false}
                    />
                    <CheckBox
                      parentClass="col-span-2"
                      label="Resident"
                      id="isResident"
                      labelClass=" !text-black"
                      checked={values.isResident}
                      value={values.isResident ? "true" : "false"}
                      onChangeHandler={() => {
                        setFieldValue(
                          "isResident",
                          values.isResident ? false : true
                        );
                      }}
                      idDisabled={id ? true : false}
                    />
                    <hr className="col-span-2" />
                    <div className="grid grid-cols-4 gap-y-4 gap-x-2 col-span-2">
                      <p className="col-span-4 text-base/5 font-semibold text-black">
                        Days Worked (Resident)
                      </p>
                      {daysOfWeek.map((day: string) => {
                        return (
                          <CheckBox
                            key={day}
                            label={day}
                            id={day}
                            value={day}
                            checked={selectedDays.includes(day)}
                            onChangeHandler={() => {
                              const result = handleCheckboxChange(day);
                              setFieldValue("daysWorked", result.toString());
                            }}
                            labelClass=" !text-black"
                          />
                        );
                      })}
                    </div>
                    <ErrorMessage name={"daysWorked"}>
                      {(msg) => (
                        <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>

                    <hr className="col-span-2" />
                    <CheckBox
                      label="Weekend Bonus"
                      id="isWeekendBonus"
                      labelClass=" !text-black"
                      checked={values.isWeekendBonus}
                      value={values.isWeekendBonus ? "true" : "false"}
                      onChangeHandler={() => {
                        setFieldValue(
                          "isWeekendBonus",
                          values.isWeekendBonus ? false : true
                        );
                      }}
                    />
                    <CheckBox
                      label="Overtime Bonus"
                      id="isOvertimeBonus"
                      labelClass=" !text-black"
                      checked={values.isOvertimeBonus}
                      value={values.isOvertimeBonus ? "true" : "false"}
                      onChangeHandler={() => {
                        setFieldValue(
                          "isOvertimeBonus",
                          values.isOvertimeBonus ? false : true
                        );
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

export default AddUpdateRotation;
