import { FieldArray, Form, Formik, FormikValues } from "formik";
import Button from "@/components/formComponents/button/Button";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import { Option } from "@/interface/customSelect/customSelect";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  IInitialSalaryMessageData,
  IMessageStatus,
} from "@/interface/message/message";
import ReactQuillComponent from "@/components/formComponents/reactQuillComponent/ReactQuillComponent";
import {
  AddSalaryMessageData,
  EditMessageData,
  GetMessageDataById,
} from "@/services/messageService";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { GetMessageUserDataById } from "@/services/userService";
import Card from "@/components/card/Card";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import TextField from "@/components/formComponents/textField/TextField";
// import { DefaultRoles } from "@/utils/commonConstants";
import { GetEmployeeData } from "@/services/employeeService";
import { MessageSalaryValidationSchema } from "@/validations/message/MessageValidation";
import { GetSegmentEmployeeData } from "@/services/segmentService";
import { ISegmentData } from "@/interface/segment/segmentInterface";
import {
  accountPODateSelector,
  setActiveAccountPODateDropdown,
} from "@/redux/slices/accountPOSlice";
import { GetDropdownDetails } from "@/services/timesheetService";
import moment from "moment";
import SelectComponent from "@/components/formComponents/customSelect/Select";

const AddUpdateSalaryMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const activeClient = useSelector(activeClientSelector);
  const dispatch = useDispatch();
  const activeDateDropdown = useSelector(accountPODateSelector);
  const tempEmp: string[] = [];
  const tempManager: string[] = [];

  const defaultInitialValues: IInitialSalaryMessageData = {
    employeeId: [],
    segmentId: [],
    managerId: [],
    salaryMonth: "",
    allCheck: false,
    message:
      "LRED: Transfer of [SalaryMonth] salary [MonthlySalary] sent on [SalaryDate] with the bonus [BonusPrice]. Salary total [Total]. Replies to this mobile aren't monitored.",
    isSchedule: false,
    scheduleDate: new Date(),
    messageData: [],
  };
  const [messageSalaryData, setMessageSalaryData] =
    useState<IInitialSalaryMessageData>(defaultInitialValues);
  const [segmentDataList, setSegmentDataList] = useState<Option[]>();
  const [loader, setLoader] = useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<Option[]>();
  const [dropdownDetails, setDropdownDetails] = useState<{
    dateDropDown: Option[];
  }>({
    dateDropDown: [],
  });
  // const [managerDataList, setManagerDataList] = useState<Option[]>();
  // const queryString = `?listView=true` + `&clientId=${activeClient}`;

  const queryString = `?clientId=${activeClient}`;
  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);

    const updatedMessageData = values.messageData.map((item: any) => {
      const monthlySalary = item.monthlySalary || 0;
      const bonusPrice = item.bonusPrice || 0;
      const total = monthlySalary + bonusPrice;
      return {
        ...item,
        total: total,
      };
    });

    const params = {
      employeeId: values.employeeId,
      segmentId: values.segmentId,
      salaryMonth: values.salaryMonth,
      managerUserId: values.managerId,
      message: values.message,
      clientId: activeClient.toString(),
      status: values.status,
      isSchedule: values.isSchedule,
      scheduleDate: values.scheduleDate,
      messageSalary: updatedMessageData,
    };

    if (id) {
      const response = await EditMessageData(params, id);
      if (response?.data?.response_type === "success") {
        navigate("/admin/salary-message");
      }
    } else {
      const response = await AddSalaryMessageData(params);
      if (response?.data?.response_type === "success") {
        navigate("/admin/salary-message");
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    // fetchAllUser(queryString);
    fetchAllDropdownDetails();
    fetchAllEmployee(queryString);
    fetchAllSegmentData(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient, activeDateDropdown]);

  useEffect(() => {
    if (id) {
      fetchMessageData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAllDropdownDetails = async () => {
    dispatch(showLoader());
    if (activeClient) {
      if (activeClient !== activeDateDropdown?.clientId) {
        dispatch(
          setActiveAccountPODateDropdown({
            clientId: 0,
            position: "",
            startDate: "",
            endDate: "",
          })
        );
      }
      const response = await GetDropdownDetails(activeClient);
      const datesDetailsResponse = response?.data?.responseData.dates.map(
        (data: string) => {
          return {
            label:
              moment(data?.split(" - ")[1], "DD-MM-YYYY").format("MMM-YY") +
              " (" +
              data +
              ")",
            value:
              moment(data?.split(" - ")[1], "DD-MM-YYYY").format("MMM-YY") +
              " (" +
              data +
              ")",
          };
        }
      );

      if (response?.data?.responseData) {
        setDropdownDetails({
          dateDropDown: datesDetailsResponse,
        });

        const currentDateIndex = datesDetailsResponse?.findIndex(
          (a: Option) => {
            const splitValues = a.label.split(" - ");
            return moment(
              moment().format("DD-MM-YYYY"),
              "DD-MM-YYYY"
            ).isSameOrBefore(moment(splitValues[1], "DD-MM-YYYY"));
          }
        );

        const dateRange =
          datesDetailsResponse[currentDateIndex]?.value.split(" - ");
        if (dateRange?.length > 0) {
          if (activeDateDropdown?.position == "") {
            dispatch(
              setActiveAccountPODateDropdown({
                clientId: activeClient,
                position: datesDetailsResponse[currentDateIndex]?.value,
                startDate: dateRange[0],
                endDate: dateRange[1],
              })
            );
          }
        }
      }
    }
    dispatch(hideLoader());
  };

  const fetchAllSegmentData = async (query: string) => {
    const response = await GetSegmentEmployeeData(query + `&isActive=true`);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      const segmentDataList = result?.map((data: ISegmentData) => ({
        label: data?.name,
        value: data.id,
        employeeData: data?.employee ?? [],
      }));
      setSegmentDataList(segmentDataList);
    }
  };

  const fetchAllEmployee = async (query: string) => {
    const response = await GetEmployeeData(query + `&isActive=true`);

    if (response?.data?.responseData?.data) {
      const employeeDataList = response?.data?.responseData?.data?.map(
        (data: IEmployeeData) => ({
          label:
            data?.loginUserData?.lastName +
            " " +
            data?.loginUserData?.firstName,
          value: data.id,
        })
      );
      setEmployeeData(employeeDataList);
    }
  };

  // const fetchAllUser = async (query: string) => {
  //   const response = await GetAllUser(query);
  //   if (response?.data?.responseData) {
  //     const resp: any[] = [];
  //     const respManager: any[] = [];
  //     response?.data?.responseData?.data?.forEach((data: IEmployeeData) => {
  //       if (data?.roleData?.name === DefaultRoles.Employee) {
  //         resp.push({ label: data?.loginUserData?.name, value: data?.id });
  //       } else if (data?.roleData?.name === "manager") {
  //         respManager.push({
  //           label: data?.loginUserData?.name,
  //           value: data?.id,
  //         });
  //       }
  //     });
  //     setManagerDataList(respManager);
  //     setEmployeeData(resp);
  //   }
  // };

  const fetchMessageData = async (id: string) => {
    dispatch(showLoader());
    const response = await GetMessageDataById(id);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      if (resultData?.length > 0) {
        resultData?.forEach(
          (e: { employeeId: string | null; managerUserId: string | null }) => {
            e.employeeId !== null && tempEmp.push(e.employeeId);
            e.managerUserId !== null && tempManager.push(e.managerUserId);
          }
        );
      }

      setMessageSalaryData({
        employeeId: [+tempEmp],
        salaryMonth: resultData[0]?.salaryMonth,
        managerId: [+tempManager],
        message: resultData[0]?.message ? resultData[0]?.message : "",
        isSchedule: resultData[0]?.isSchedule
          ? resultData[0]?.isSchedule
          : false,
        scheduleDate: resultData[0]?.scheduleDate
          ? new Date(resultData[0]?.scheduleDate)
          : null,
      });
    }
    dispatch(hideLoader());
  };

  const onSelectItems = async (
    selectedOption: any,
    values: any,
    setFieldValue: any,
    all: string,
    type?: "manager" | "employee" | "segment"
  ) => {
    try {
      const valuesOption = selectedOption.map((item: Option) => item.value);
      const response = await GetMessageUserDataById({ id: valuesOption });

      const filteredValue = values.messageData.filter((i: any) => {
        return valuesOption.includes(i.id) || (type && type !== i?.type);
      });

      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        // const newItems: {
        //   id: string;
        //   type: string;
        //   name?: string;
        //   roleId: string;
        //   employeeId?: string;
        //   managerUserId?: string;
        //   email?: string;
        //   phone?: string;
        //   monthlySalary?: number | null;
        //   bonusPrice?: number | null;
        //   total?: number | null;
        //   salaryDate?: Date | null;
        // }[] =
        result.reduce((prev: any, curr: any) => {
          // const customBonusData = curr?.employee?.customBonus?.length
          //   ? JSON.parse(curr?.employee?.customBonus)
          //   : [];

          const customBonusData = curr?.customBonus?.length
            ? JSON.parse(curr?.customBonus)
            : [];

          const exists = filteredValue.find((i: any) => i.id === curr.id);
          if (!exists) {
            prev.push({
              roleId: curr?.roleId,
              type,
              id: curr?.id,
              name: curr?.loginUserData?.name,
              email: curr?.loginUserData?.email ?? "",
              phone: curr?.loginUserData?.phone ?? "",
              segmentId: curr?.segmentId,
              bonusPrice:
                customBonusData?.data &&
                customBonusData?.data?.length > 0 &&
                customBonusData?.data[0]?.price
                  ? customBonusData?.data[0]?.price
                  : 0,
              monthlySalary: curr?.monthlySalary ?? 0,
              salaryDate:
                curr?.employeeSalary &&
                curr?.employeeSalary?.length > 0 &&
                new Date(curr?.employeeSalary[0]?.startDate ?? new Date()),
              total:
                customBonusData?.data &&
                customBonusData?.data?.length > 0 &&
                customBonusData?.data[0]?.price
                  ? Number(
                      customBonusData?.data &&
                        customBonusData?.data?.length > 0 &&
                        customBonusData?.data[0]?.price + curr?.monthlySalary
                    )
                  : curr?.monthlySalary ?? 0,
              // monthlySalary: curr?.employee?.monthlySalary ?? 0,
              // salaryDate:
              //   curr?.employee?.employeeSalary &&
              //   curr?.employee?.employeeSalary?.length > 0 &&
              //   new Date(
              //     curr?.employee?.employeeSalary[0]?.startDate ?? new Date()
              //   ),
              // total:
              //   customBonusData?.data &&
              //   customBonusData?.data?.length > 0 &&
              //   customBonusData?.data[0]?.price
              //     ? Number(
              //         customBonusData?.data &&
              //           customBonusData?.data?.length > 0 &&
              //           customBonusData?.data[0]?.price +
              //             curr?.employee?.monthlySalary
              //       )
              //     : curr?.employee?.monthlySalary ?? 0,
            });
          }

          return prev;
        }, filteredValue);

        if (all === "true") {
          setMessageSalaryData((prev: any) => ({
            ...prev,
            messageData: [...filteredValue],
          }));
          setFieldValue?.(`messageData`, filteredValue);
        } else {
          setMessageSalaryData((prev: any) => ({
            ...prev,
            messageData: filteredValue,
          }));
          setFieldValue?.(`messageData`, filteredValue);
        }
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <Card>
      <Formik
        initialValues={messageSalaryData}
        enableReinitialize={true}
        validationSchema={MessageSalaryValidationSchema()}
        onSubmit={OnSubmit}
      >
        {({ values, setFieldValue, setFieldTouched, handleSubmit, errors }) => (
          <Form>
            <CheckBox
              name={"allCheck"}
              id="selectAll"
              label="Select All (Send message to everyone)"
              checked={
                values.employeeId &&
                values.segmentId &&
                segmentDataList &&
                employeeData &&
                values.employeeId?.length + segmentDataList.length ===
                  employeeData.length + segmentDataList.length
                // values.employeeId &&
                // values.managerId &&
                // employeeData &&
                // managerDataList &&
                // values.employeeId?.length + values.managerId?.length ===
                //   employeeData.length + managerDataList?.length
              }
              onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue("allCheck", e.target.checked);
                if (e.target.checked === true) {
                  const selectedValues: number[] = (
                    employeeData as Option[]
                  ).map((item: Option) => Number(item.value));

                  const selectedSegmentValues: number[] = (
                    segmentDataList as Option[]
                  ).map((item: Option) => Number(item.value));

                  const valuesArray: any = [];
                  (segmentDataList as any).forEach(
                    (item: { value: number; employeeData: [] }) => {
                      if (item.employeeData && item.employeeData.length > 0) {
                        item.employeeData.forEach(
                          (employee: {
                            id: number;
                            loginUserData: { name: string };
                          }) => {
                            valuesArray.push({
                              label: employee?.loginUserData?.name,
                              value: employee?.id,
                              segmentId: item?.value,
                            });
                          }
                        );
                      }
                    }
                  );

                  // const selectedManagerValues: number[] = (
                  //   managerDataList as Option[]
                  // ).map((item: Option) => Number(item.value));

                  const data = [
                    ...(employeeData as Option[]),
                    ...(valuesArray as Option[]),
                    ...(segmentDataList as Option[]),
                    // ...(managerDataList as Option[]),
                  ];

                  segmentDataList &&
                    setFieldValue("segmentId", [
                      ...segmentDataList.map((e) => e.value),
                    ]);

                  employeeData &&
                    setFieldValue("employeeId", [
                      ...employeeData.map((e) => e.value),
                    ]);

                  // managerDataList &&
                  //   setFieldValue("managerId", [
                  //     ...managerDataList.map((e) => e.value),
                  //   ]);
                  setMessageSalaryData((prev) => ({
                    ...prev,
                    employeeId: selectedValues,
                    segmentId: selectedSegmentValues,
                    // managerId: selectedManagerValues,
                  }));
                  onSelectItems(data, values, setFieldValue, "true");
                } else {
                  setMessageSalaryData((prev) => ({
                    ...prev,
                    segmentId: [],
                    managerId: [],
                    employeeId: [],
                    // managerId: [],
                    messageData: [],
                  }));
                  setFieldValue("segmentId", []);
                  setFieldValue("messageData", []);
                  setFieldValue("employeeId", []);
                  // setFieldValue("managerId", []);
                }
              }}
            />

            <p className="text-left font-semibold  text-sm mt-5">
              <span className="inline-block mt-1 mb-4 text-left text-black">
                {
                  "Note:- Enter the message details for the template [Total] [BonusPrice] [SalaryMonth] [MonthlySalary] [SalaryDate]"
                }
              </span>
            </p>

            <SelectComponent
              options={dropdownDetails.dateDropDown}
              isMulti={false}
              selectedValue={values.salaryMonth}
              onChange={(option: Option | Option[]) => {
                if (!Array.isArray(option)) {
                  const dateRange = option.value.toString();
                  setMessageSalaryData((prev: any) => ({
                    ...prev,
                    salaryMonth: dateRange,
                  }));
                  setFieldValue("salaryMonth", dateRange);
                }
              }}
              placeholder="Select"
              label="Select Salary Month"
              isCompulsory
              className="bg-white"
            />

            <div className="grid grid-cols-2 gap-4 border border-solid border-black/10 p-4 rounded-md mt-4 bg-white">
              <ReactQuillComponent
                label={"Message"}
                key={messageSalaryData?.message}
                value={
                  messageSalaryData?.message ? messageSalaryData?.message : ""
                }
                setFieldValue={setFieldValue}
                name="message"
                isCompulsory={true}
                setFieldTouched={setFieldTouched}
                parentClass="col-span-2 background-white"
              />
              <CustomSelect
                inputClass={""}
                name="employeeId"
                label="Employee"
                isMulti={true}
                placeholder=""
                options={employeeData ?? []}
                isCompulsory={true}
                isUseFocus={false}
                className="bg-white"
                onChange={(selectedOptions) => {
                  const selectedValues: number[] = (
                    selectedOptions as Option[]
                  ).map((item: Option) => Number(item.value));

                  setFieldValue("employeeId", selectedValues);
                  setMessageSalaryData((prev: any) => ({
                    ...prev,
                    employeeId: selectedValues,
                  }));

                  onSelectItems(
                    selectedOptions,
                    values,
                    setFieldValue,
                    "false",
                    "employee"
                  );
                }}
              />
              <CustomSelect
                inputClass={""}
                name="segmentId"
                label="Segment"
                isMulti={true}
                placeholder=""
                options={segmentDataList ?? []}
                isCompulsory={true}
                isUseFocus={false}
                className="bg-white"
                onChange={(selectedOptions) => {
                  const selectedValues: number[] = (
                    selectedOptions as Option[]
                  ).map((item: Option) => Number(item.value));

                  const valuesArray: any = [];
                  (selectedOptions as any).forEach(
                    (item: { value: number; employeeData: [] }) => {
                      if (item.employeeData && item.employeeData.length > 0) {
                        item.employeeData.forEach(
                          (employee: {
                            id: number;
                            loginUserData: { name: string };
                          }) => {
                            valuesArray.push({
                              label: employee?.loginUserData?.name,
                              value: employee?.id,
                              segmentId: item?.value,
                            });
                          }
                        );
                      }
                    }
                  );
                  // const selectedEmpValues: number[] = (
                  //   valuesArray as Option[]
                  // ).map((item: Option) => Number(item.value));

                  setFieldValue("employeeId", valuesArray);
                  setFieldValue("segmentId", selectedValues);

                  setMessageSalaryData((prev: any) => ({
                    ...prev,
                    // employeeId: selectedEmpValues,
                    segmentId: selectedValues,
                  }));

                  onSelectItems(
                    valuesArray,
                    values,
                    setFieldValue,
                    "false",
                    "segment"
                  );
                }}
              />

              {/* <CustomSelect
                  inputClass={""}
                  name="managerId"
                  label="Select Manager"
                  isMulti={true}
                  placeholder=""
                  options={managerDataList ?? []}
                  isCompulsory={false}
                  isUseFocus={true}
                  className="bg-white"
                  onChange={(selectedOptions) => {
                    const selectedValues: number[] = (
                      selectedOptions as Option[]
                    ).map((item: Option) => Number(item.value));

                    setFieldValue("managerId", selectedValues);
                    setMessageSalaryData((prev) => ({
                      ...prev,
                      managerId: selectedValues,
                    }));

                    onSelectItems(
                      selectedOptions,
                      values,
                      setFieldValue,
                      "false",
                      "manager"
                    );
                  }}
                /> */}
            </div>

            <FieldArray name="messageData">
              {({ remove }) => (
                <>
                  {values?.messageData &&
                    values?.messageData.map((e: any, index: number) => (
                      <Fragment key={index}>
                        <div className="row  p-4 rounded-md mt-4 bg-white relative">
                          <div className="flex flex-wrap ">
                            <div className="flex w-full justify-between flex-wrap py-3 relative">
                              <div className="col px-3 absolute right-0 top-[-10px]">
                                <div
                                  className="text-red opacity-50 hover:opacity-100 font-semibold cursor-pointer mt-2"
                                  onClick={() => {
                                    try {
                                      remove(index);
                                      const empId = +e?.id;

                                      const empItem =
                                        messageSalaryData?.employeeId;
                                      const managerItem =
                                        messageSalaryData?.managerId;

                                      const empIndex = empItem?.indexOf(empId);
                                      const managerIndex =
                                        managerItem?.indexOf(empId);

                                      const segmentMessageId = +e?.segmentId;
                                      const segmentItem: any =
                                        messageSalaryData?.segmentId;

                                      const lastIndex = values?.messageData
                                        ?.map((item, index) => ({
                                          index,
                                          item,
                                        }))
                                        .reverse()
                                        .find(
                                          ({ item }) =>
                                            item.segmentId === segmentMessageId
                                        )?.index;

                                      let updatedSegmentId: number[] = [];

                                      if (
                                        lastIndex !== undefined &&
                                        lastIndex !== -1
                                      ) {
                                        const segmentCopy = [...segmentItem];

                                        segmentCopy.splice(lastIndex, 1);

                                        updatedSegmentId = segmentCopy;
                                      } else {
                                        updatedSegmentId = segmentItem;
                                      }

                                      const updatedMessageData =
                                        values.messageData?.filter(
                                          (item) => +item.id !== empId
                                        );
                                      const updatedEmployeeId =
                                        empIndex !== undefined &&
                                        empIndex !== -1
                                          ? empItem?.filter(
                                              (id) => id !== empId
                                            )
                                          : empItem;

                                      const updatedManagerId =
                                        managerIndex !== undefined &&
                                        managerIndex !== -1
                                          ? managerItem?.filter(
                                              (id) => id !== empId
                                            )
                                          : managerItem;

                                      setMessageSalaryData((prev) => ({
                                        ...prev,
                                        employeeId: updatedEmployeeId,
                                        managerId: updatedManagerId,
                                        segmentId: updatedSegmentId,
                                        messageData: updatedMessageData,
                                      }));

                                      setFieldValue(
                                        "messageData",
                                        updatedMessageData
                                      );
                                      setFieldValue(
                                        "employeeId",
                                        updatedEmployeeId
                                      );

                                      setFieldValue(
                                        "segmentId",
                                        updatedSegmentId
                                      );

                                      setFieldValue(
                                        "managerId",
                                        updatedManagerId
                                      );
                                    } catch (error) {
                                      console.log("error :>> ", error);
                                    }
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="16"
                                    width="12"
                                    viewBox="0 0 384 512"
                                    fill="red"
                                  >
                                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="px-3 w-[14%] py-3">
                                <TextField
                                  type="text"
                                  label="Name"
                                  name={`messageData[${index}].name`}
                                  placeholder="Enter Name"
                                  smallFiled
                                  disabled={true}
                                  className="rounded-10"
                                />
                              </div>
                              <div className="px-3 w-[14%] py-3">
                                <TextField
                                  type="text"
                                  label="Email"
                                  name={`messageData[${index}].email`}
                                  placeholder="Enter Email"
                                  smallFiled
                                  className="rounded-10"
                                />
                              </div>
                              <div className="px-3 w-[14%] py-3">
                                <TextField
                                  type="text"
                                  label="Phone"
                                  name={`messageData[${index}].phone`}
                                  placeholder="Enter Phone"
                                  smallFiled
                                  className="rounded-10"
                                />
                              </div>
                              <div className="px-3 w-[14%] py-3">
                                <DateComponent
                                  name={`messageData[${index}].salaryDate`}
                                  smallFiled
                                  label={"Salary Date"}
                                  value={
                                    values?.messageData &&
                                    values?.messageData[index]?.salaryDate
                                  }
                                  placeholder={""}
                                  onChange={(date) => {
                                    setFieldValue(
                                      `messageData[${index}].salaryDate`,
                                      date
                                    );
                                  }}
                                />
                              </div>
                              <div className="px-3 w-[14%] py-3">
                                <TextField
                                  type="number"
                                  label="Monthly Salary"
                                  name={`messageData[${index}].monthlySalary`}
                                  placeholder=""
                                  smallFiled
                                  className="rounded-10"
                                />
                              </div>
                              <div className="px-3 w-[14%] py-3">
                                <TextField
                                  type="number"
                                  label="Bonus Price"
                                  name={`messageData[${index}].bonusPrice`}
                                  placeholder="Enter Bonus Price"
                                  smallFiled
                                  className="rounded-10"
                                />
                              </div>
                              <div className="px-3 w-[14%] py-3">
                                <TextField
                                  type="text"
                                  label="Total"
                                  name={`messageData[${index}].total`}
                                  placeholder=""
                                  smallFiled
                                  disabled={true}
                                  className="rounded-10"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                </>
              )}
            </FieldArray>
            <div className="flex flex-wrap justify-end 1400:flex-nowrap gap-x-2 mt-4">
              <Button
                type="button"
                variant={"primary"}
                parentClass=""
                onClickHandler={() => {
                  setFieldValue("status", IMessageStatus.SENT);
                  handleSubmit();
                }}
                loader={
                  Object.keys(errors).length === 0 &&
                  (
                    values as object as {
                      status: IMessageStatus;
                    }
                  )?.status === IMessageStatus.SENT &&
                  loader
                }
              >
                Send
              </Button>

              <Button
                variant={"gray"}
                type="button"
                parentClass=""
                onClickHandler={() => navigate("/admin/salary-message")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default AddUpdateSalaryMessage;
