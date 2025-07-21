import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { IEmployeeLeaveData } from "@/interface/employeeLeave/EmployeeLeaveInterface";
import {
  AddEmployeeLeaveData,
  GetEmployeeLastLeaveDataByEmployeeId,
  GetEmployeeLeaveDataById,
  UpdateEmployeeLeave,
} from "@/services/employeeLeaveService";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { useDispatch, useSelector } from "react-redux";
import { GroupOption, Option } from "@/interface/customSelect/customSelect";
import {
  activeEmployeeDataSelector,
  activeEmployeeSelector,
  setActiveEmployee,
} from "@/redux/slices/employeeSlice";
import { EmployeeLeaveValidationSchema } from "@/validations/employeeLeave/employeeLeaveValidation";
import moment from "moment";
import GroupSelectComponent from "@/components/formComponents/customSelect/GroupSelect";
import { setEmployeeDropdownOptions } from "@/helpers/Utils";
import { activeClientSelector } from "@/redux/slices/clientSlice";
// import { GetEmployeeReliquat } from "@/services/reliquatCalculationService";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ToastShow } from "@/redux/slices/toastSlice";

interface AddEmployeeLeaveProps {
  employeeLeaveId?: string;
  employeeId?: number;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
  setEmployeeLeaveId?: React.Dispatch<React.SetStateAction<string>>;
}

const AddEmployeeLeave = ({
  employeeLeaveId,
  employeeId,
  openModal,
  setOpenModal,
  fetchAllData,
  setEmployeeLeaveId,
}: AddEmployeeLeaveProps) => {
  const defaultInitialValues: IEmployeeLeaveData = {
    employeeId: employeeId ?? 0,
    startDate: new Date(),
    endDate: new Date(),
    leaveType: "CR",
  };
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const activeEmployee = useSelector(activeEmployeeSelector);
  const activeClient = useSelector(activeClientSelector);
  const activeEmployeeData = useSelector(activeEmployeeDataSelector);
  const [employeeOptions, setEmployeeOptions] = useState<GroupOption[]>([]);
  const [reliquatData, setReliquatData] = useState<IEmployeeLeaveData | null>(
    null
  );
  const [employeeLeaveData, setEmployeeLeaveData] =
    useState<IEmployeeLeaveData>(defaultInitialValues);
  // const [totalReliquat, setTotalReliquat] = useState("-");
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    let response;
    if (employeeLeaveId) {
      if (
        moment(values?.startDate).format("DD-MM-YYYY") !==
          moment(employeeLeaveData?.startDate).format("DD-MM-YYYY") ||
        moment(values?.endDate).format("DD-MM-YYYY") !==
          moment(employeeLeaveData?.endDate).format("DD-MM-YYYY")
      ) {
        response = await UpdateEmployeeLeave(employeeLeaveId, values);
      } else {
        dispatch(
          ToastShow({
            message: `Please update the leave dates!`,
            type: "error",
          })
        );
      }
    } else {
      response = await AddEmployeeLeaveData(values);
    }
    if (response?.data?.response_type === "success") {
      setOpenModal(false);
      setEmployeeLeaveId && setEmployeeLeaveId("");
      fetchAllData?.();
    }
    setLoader(false);
  };

  useEffect(() => {
    if (activeEmployee) {
      fetchEmployeeReliquatData(activeEmployee);
      // if (activeClient) {
      //   fetchReliquatData(activeEmployee, Number(activeClient));
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEmployee]);

  const fetchAllDetails = async () => {
    if (Number(activeClient) > 0) {
      setEmployeeOptions(
        await setEmployeeDropdownOptions(Number(activeClient), true)
      );
    }
  };

  useEffect(() => {
    fetchAllDetails();
    if (employeeLeaveId) {
      fetchEmployeeLeaveData(employeeLeaveId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  async function fetchEmployeeLeaveData(employeeLeaveId: string) {
    dispatch(showLoader());
    const response = await GetEmployeeLeaveDataById(employeeLeaveId);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setEmployeeLeaveData({
        employeeId: result.employeeId ? result.employeeId : 0,
        startDate: result.startDate ? new Date(result.startDate) : null,
        endDate: result.endDate ? new Date(result.endDate) : null,
        leaveType: result.leaveType,
      });
    }
    dispatch(hideLoader());
  }

  // async function fetchReliquatData(employeeId: number, clientId: number) {
  //   dispatch(showLoader());
  //   const response = await GetEmployeeReliquat(
  //     `?employeeId=${employeeId}&clientId=${clientId}`
  //   );

  //   if (response?.data?.responseData) {
  //     const result = response?.data?.responseData;
  //     // setTotalReliquat(Math.ceil(result?.result).toString());
  //   }
  //   dispatch(hideLoader());
  // }

  async function fetchEmployeeReliquatData(id: number) {
    dispatch(showLoader());
    const response = await GetEmployeeLastLeaveDataByEmployeeId(id);

    if (response?.data?.responseData) {
      setReliquatData(response?.data?.responseData);
    } else {
      setReliquatData(null);
    }
    dispatch(hideLoader());
  }

  let reliquantDate = "";
  if (activeEmployeeData?.terminationDate)
    reliquantDate = moment(activeEmployeeData?.terminationDate).format(
      "DD/MM/YYYY"
    );
  else if (reliquatData)
    reliquantDate = moment(reliquatData?.endDate).format("DD/MM/YYYY");
  else reliquantDate = moment(new Date()).format("DD/MM/YYYY");

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
          title="Titre de Congé"
          closeModal={() => {
            setOpenModal(false);
            setEmployeeLeaveId && setEmployeeLeaveId("");
          }}
        >
          <Formik
            initialValues={employeeLeaveData}
            enableReinitialize={true}
            validationSchema={EmployeeLeaveValidationSchema()}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <GroupSelectComponent
                    options={employeeOptions ?? []}
                    selectedValue={values.employeeId ? values.employeeId : null}
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
                </Card>
                {activeEmployee != 0 && (
                  <>
                    <Card title="Employee Details" parentClass="mb-5 last:mb-0">
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
                            {activeEmployeeData?.segment?.name}{" "}
                            {activeEmployeeData?.subSegment?.name
                              ? ` - ${activeEmployeeData?.subSegment?.name}`
                              : ""}
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
                      </ul>
                    </Card>
                    <Card parentClass="mb-5 last:mb-0">
                      <table className="small w-full">
                        <thead>
                          <tr>
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Date
                            </th>
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Description
                            </th>
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Leave Type
                            </th>
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Reliquat
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-3 font-medium text-sm/18px">
                              {reliquantDate}
                            </td>
                            <td className="py-3 font-medium text-sm/18px">
                              {reliquatData ? reliquatData?.reference : "-"}
                            </td>
                            <td className="py-3 font-medium text-sm/18px">
                              {employeeLeaveData
                                ? employeeLeaveData?.leaveType
                                : "-"}
                            </td>
                            <td className="py-3 font-medium text-sm/18px">
                              {reliquatData?.reliquatCalculation ?? "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Card>
                    {/* {(!activeEmployeeData?.terminationDate ||
                      moment(activeEmployeeData?.terminationDate).isAfter(
                        moment()
                      )) && ( */}
                    <Card
                      title="Titre de Congé Dates"
                      parentClass="mb-5 last:mb-0"
                    >
                      <>
                        <div className="grid grid-cols-2 gap-5">
                          <DateComponent
                            name="startDate"
                            value={values.startDate}
                            minDate={moment(
                              activeEmployeeData?.startDate
                            ).toDate()}
                            onChange={(date) => {
                              setFieldValue("startDate", date);
                              if (date) {
                                setFieldValue("endDate", date);
                              }
                            }}
                            maxDate={
                              activeEmployeeData?.terminationDate
                                ? moment(
                                    activeEmployeeData?.terminationDate
                                  ).toDate()
                                : null
                            }
                            isCompulsory={true}
                            label="Start Date"
                          />
                          <DateComponent
                            name="endDate"
                            value={values.endDate}
                            onChange={(date) => {
                              setFieldValue("endDate", date);
                            }}
                            minDate={values.startDate}
                            maxDate={
                              activeEmployeeData?.terminationDate
                                ? moment(
                                    activeEmployeeData?.terminationDate
                                  ).toDate()
                                : null
                            }
                            isCompulsory={true}
                            label="End Date"
                          />
                        </div>
                        <div className="flex items-center justify-between mt-5">
                          <div></div>
                          <div className="bg-primaryRed rounded-lg">
                            <p className="text-white p-2 text-sm/18px font-semibold">
                              The End Date is the final day of time off.
                            </p>
                          </div>
                        </div>
                        {/* <div className="mt-5 grid gap-5">
                            <SelectComponent
                              options={employeeLeaveTypeOptions}
                              selectedValue={
                                employeeLeaveId ? values.leaveType : "CR"
                              }
                              onChange={(option: Option | Option[]) => {
                                setFieldValue(
                                  "leaveType",
                                  (option as Option).value
                                );
                              }}
                              name="leaveType"
                              label="Leave Type"
                              className="bg-white"
                              isCompulsory={true}
                              parentClass="mb-5"
                              menuPlacement="top"
                            />
                          </div> */}
                      </>
                    </Card>
                    {/* )} */}
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

export default AddEmployeeLeave;
