import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { IMedicalRequestData } from "@/interface/medicalRequest/MedicalRequestInterface";
import { AddMedicalRequestData } from "@/services/medicalRequestService";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { useDispatch, useSelector } from "react-redux";
import { GroupOption, Option } from "@/interface/customSelect/customSelect";
import ClientDropdown from "@/components/dropdown/ClientDropdown";
import {
  activeEmployeeDataSelector,
  activeEmployeeSelector,
  setActiveEmployee,
} from "@/redux/slices/employeeSlice";
import { MedicalRequestValidationSchema } from "@/validations/medicalRequest/medicalRequestValidation";
import { GetMedicalTypeData } from "@/services/medicalTypeService";
import { IMedicalTypeData } from "@/interface/medicalType/MedicalTypeInterface";
import moment from "moment";
import GroupSelectComponent from "@/components/formComponents/customSelect/GroupSelect";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { setEmployeeDropdownOptions } from "@/helpers/Utils";


interface AddUpdateMedicalRequestProps {
  employeeId?: number;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateMedicalRequest = ({
  employeeId,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateMedicalRequestProps) => {
  const [defaultInitialValues, setDefaultInitialValues] =
    useState<IMedicalRequestData>({
      employeeId: employeeId,
      medicalTypeId: null,
      medicalDate: new Date(),
    });

  const formikRef = useRef<FormikProps<FormikValues>>();
  const dispatch = useDispatch();
  const activeClient = useSelector(activeClientSelector);
  const [activeLocalClient, setActiveLocalClient] = useState<string | number>(
    activeClient
  );
  const activeEmployee = useSelector(activeEmployeeSelector);
  const activeEmployeeData = useSelector(activeEmployeeDataSelector);
  const [employeeOptions, setEmployeeOptions] = useState<GroupOption[]>([]);
  const [medicalTypeData, setMedicalTypeData] = useState<IMedicalTypeData[]>(
    []
  );
  const [dateValidataion, setDateValidation] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const response = await AddMedicalRequestData(values);
    if (response?.data?.response_type === "success") {
      setOpenModal(false);
      fetchAllData?.();
    }
    setLoader(false);
  };

  async function fetchAllMedicalType() {
    setLoader(true);
    const response = await GetMedicalTypeData();

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setMedicalTypeData(result?.data);
    }
    setLoader(false);
  }

  useEffect(() => {
    fetchAllMedicalType();
  }, []);

  const fetchAllDetails = async () => {
    if (Number(activeLocalClient) > 0) {
      setEmployeeOptions(
        await setEmployeeDropdownOptions(Number(activeLocalClient))
      );
    }
  };

  const checkMedicalType = (value: number) => {
    if (
      value &&
      medicalTypeData?.find(
        (type) => type.id === value && type.format === "Tuesdays and Thursdays"
      )
    )
      setDateValidation(true);
    else setDateValidation(false);
  };

  useEffect(() => {
    fetchAllDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocalClient]);

  useEffect(() => {
    if (employeeOptions?.length > 0 && !activeEmployee) {
      const activeEmployeeId = Number(employeeOptions[0]?.options[0]?.value);
      dispatch(setActiveEmployee(activeEmployeeId));
      setDefaultInitialValues({
        ...defaultInitialValues,
        employeeId: activeEmployeeId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeOptions]);

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
          title="Add Medical Request"
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={defaultInitialValues}
            validationSchema={MedicalRequestValidationSchema()}
            onSubmit={OnSubmit}
            enableReinitialize
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <ClientDropdown
                        label="Select Client"
                        isCompulsory={true}
                        isUpdateGlobal={false}
                        updateFunction={(newValue) => {
                          setActiveLocalClient(newValue);
                          dispatch(setActiveEmployee(0));
                        }}
                      />
                      <GroupSelectComponent
                        options={employeeOptions || []}
                        selectedValue={
                          values.employeeId ? values.employeeId : null
                        }
                        onChange={(e: Option | Option[]) => {
                          dispatch(setActiveEmployee((e as Option).value));
                          setFieldValue("employeeId", (e as Option).value);
                        }}
                        name="employeeId"
                        isMulti={false}
                        placeholder="Select Employee"
                        label="Select Employee"
                        className="bg-white"
                        parentClass=""
                        isCompulsory={true}
                      />
                    </div>
                  </>
                </Card>
                {activeEmployee != 0 && employeeOptions && employeeOptions?.length > 0 && (
                  <>
                    <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                      <>
                        <ul className="grid gap-4">
                          <li className="flex flex-wrap text-sm/18px">
                            <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                              Employee:
                            </span>
                            <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                              {activeEmployeeData?.employeeNumber +
                                " " +
                                activeEmployeeData?.loginUserData?.lastName +
                                " " +
                                activeEmployeeData?.loginUserData?.firstName}
                            </span>
                          </li>
                          <li className="flex flex-wrap text-sm/18px">
                            <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                              Fonction:
                            </span>
                            <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                              {activeEmployeeData?.fonction}
                            </span>
                          </li>
                          <li className="flex flex-wrap text-sm/18px">
                            <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                              Medical Check Date:
                            </span>
                            <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                              {activeEmployeeData?.medicalCheckDate
                                ? moment(
                                    activeEmployeeData?.medicalCheckDate
                                  ).format("DD/MM/YYYY")
                                : ""}
                            </span>
                          </li>
                          <li className="flex flex-wrap text-sm/18px">
                            <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                              Segment:
                            </span>
                            <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                              {activeEmployeeData?.segment?.name}
                            </span>
                          </li>
                          <li className="flex flex-wrap text-sm/18px">
                            <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                              Rotation:
                            </span>
                            <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                              {activeEmployeeData?.rotation?.name}
                            </span>
                          </li>
                          <li className="flex flex-wrap text-sm/18px">
                            <span className="font-bold inline-block pr-10px w-full max-w-[180px]">
                              Medical Check Expiry:
                            </span>
                            <span className="font-medium inline-block max-w-[calc(100%_-_180px)]">
                              {activeEmployeeData?.medicalCheckExpiry
                                ? moment(
                                    activeEmployeeData?.medicalCheckExpiry
                                  ).format("DD/MM/YYYY")
                                : ""}
                            </span>
                          </li>
                        </ul>
                      </>
                    </Card>
                    <Card
                      title="Medical Request Details"
                      parentClass="mb-5 last:mb-0"
                    >
                      <>
                        <div className="grid grid-cols-2 gap-5">
                          <SelectComponent
                            options={
                              (medicalTypeData?.map(
                                (value: IMedicalTypeData) => {
                                  return {
                                    label: value?.name,
                                    value: value?.id,
                                  };
                                }
                              ) ?? []) as Option[]
                            }
                            selectedValue={
                              values.medicalTypeId ? values.medicalTypeId : null
                            }
                            onChange={(e: Option | Option[]) => {
                              setFieldValue(
                                "medicalTypeId",
                                (e as Option).value
                              );
                              checkMedicalType(Number((e as Option).value));
                              setDefaultInitialValues({
                                ...defaultInitialValues,
                                medicalTypeId: Number((e as Option).value),
                              });
                            }}
                            name="medicalTypeId"
                            isMulti={false}
                            placeholder="Select Medical Type"
                            label="Select Medical Type"
                            className="bg-white"
                            parentClass=""
                            isCompulsory={true}
                            menuPlacement="top"
                          />

                          <DateComponent
                            name="medicalDate"
                            value={values.medicalDate}
                            onChange={(date) => {
                              setFieldValue("medicalDate", date);
                              if (date) {
                                setDefaultInitialValues({
                                  ...defaultInitialValues,
                                  medicalDate: date,
                                });
                              }
                            }}
                            minDate={new Date()}
                            isCompulsory={true}
                            label="Medical Date"
                            smallFiled={true}
                            filterDate={
                              dateValidataion
                                ? (date: Date) => {
                                    const dayOfWeek = date.getDay();
                                    return dayOfWeek === 2 || dayOfWeek === 4;
                                  }
                                : undefined
                            }
                          />
                        </div>
                      </>
                    </Card>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default AddUpdateMedicalRequest;
