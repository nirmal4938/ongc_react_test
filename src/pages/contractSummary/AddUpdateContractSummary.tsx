import TextField from "@/components/formComponents/textField/TextField";
import { Form, Formik, FormikErrors, FormikValues } from "formik";
import Button from "@/components/formComponents/button/Button";
import { useEffect, useState } from "react";
import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GetEmployeeDetailById } from "@/services/employeeService";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { GroupOption, Option } from "@/interface/customSelect/customSelect";
import {
  AddContractSummaryData,
  GetContractSummaryDataById,
  GetEmployeeContractNumber,
} from "@/services/contractSummaryService";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  activeEmployeeSelector,
  setActiveEmployee,
} from "@/redux/slices/employeeSlice";
import { ContractSummaryValidationSchema } from "@/validations/contractTemplate/ContractTemplateValidation";
import {
  GetContractTemplateVersionData,
  GetContractTemplateVersionDataById,
} from "@/services/contractTemplateVersionService";
import { IContractTemplateVersionData } from "@/interface/contractTemplateVersion/contractTemplateVersion";
import GroupSelectComponent from "@/components/formComponents/customSelect/GroupSelect";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { setEmployeeDropdownOptions } from "@/helpers/Utils";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import ReactQuillComponent from "@/components/formComponents/reactQuillComponent/ReactQuillComponent";
import { GetRotationWiseContractTemplateData } from "@/services/contractTemplateService";
import {
  ContractPdfEnumTypes,
  ContractPdfTypes,
} from "@/utils/commonConstants";
import Textarea from "@/components/formComponents/textarea/Textarea";
import { ToastShow } from "@/redux/slices/toastSlice";
import { countries } from "../../../src/json/country.json";

const AddUpdateContractSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { state } = useLocation();
  const activeEmployee = useSelector(activeEmployeeSelector);
  const activeClient = useSelector(activeClientSelector);
  const defaultInitialValues: IContractSummaryData = {
    employeeId: 0,
    clientId: activeClient,
    contractVersionId: "",
    contractTemplateId: "",
    newContractNumber: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    workOrderDate: new Date(),
    contractorsPassport: "",
    endOfAssignmentDate: new Date(),
    descriptionOfAssignmentAndOrderConditions: "",
    durationOfAssignment: "",
    workLocation: "",
    workOrderNumber: "",
    remuneration: 0,
    workCurrency: "",
    uniqueWorkNumber: null,
  };
  const [contractSummaryData, setContractSummaryData] =
    useState<IContractSummaryData>(defaultInitialValues);
  const [isAvenant, setIsAvenant] = useState<boolean>(false);
  const [isExpat, setIsExpat] = useState<boolean>(false);
  const [employeeList, setEmployeeList] = useState<IEmployeeData>();
  const [loader, setLoader] = useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<GroupOption[]>([]);
  const [contractVersionDataList, setContractVersionDataList] = useState<
    Option[]
  >([]);
  const [contractTemplateList, setContractTemplateList] = useState<Option[]>(
    []
  );
  const [isDefaultContractTemplate, SetIsDefaultContractTemplate] =
    useState<boolean>(true);
  const currencyMap = new Map();
  for (const countryData of countries) {
    const isExist = currencyMap.get(
      `${countryData?.currencyName}-${countryData?.currencyCode}`
    );
    if (!isExist) {
      currencyMap.set(
        `${countryData?.currencyName}-${countryData?.currencyCode}`,
        countryData
      );
    }
  }
  const currencyData = [...currencyMap.values()];
  const currencyList: Option[] = currencyData.map(
    (values: {
      countryName: string;
      countryCode: string;
      currencyName: string;
      currencyCode: string;
    }) => ({
      label: `${values?.currencyName} - ${values?.currencyCode}`,
      value: values?.currencyCode,
    })
  );

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    let isSuccess = true;
    const formData = new FormData();

    if (state?.employeeId || activeEmployee) {
      formData.append(
        "employeeId",
        state?.employeeId || activeEmployee?.toString()
      );
    } else {
      formData.append("employeeId", values.employeeId);
    }
    formData.append("contractVersionId", values.contractVersionId);
    formData.append("contractTemplateId", values.contractTemplateId);
    formData.append("newContractNumber", values.newContractNumber);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);
    formData.append("description", values?.description);
    if (isExpat) {
      formData.append("workOrderDate", values?.workOrderDate);
      formData.append("contractorsPassport", values?.contractorsPassport);
      formData.append("endOfAssignmentDate", values?.endOfAssignmentDate);
      formData.append(
        "descriptionOfAssignmentAndOrderConditions",
        values?.descriptionOfAssignmentAndOrderConditions
      );
      formData.append("durationOfAssignment", values?.durationOfAssignment);
      formData.append("workLocation", values?.workLocation);
      formData.append("workOrderNumber", values?.workOrderNumber ?? null);
      formData.append("remuneration", values?.remuneration ?? 0);
      formData.append("workCurrency", values?.workCurrency);
    }
    // id && formData.append("type", "edit");

    setLoader(false);

    if (isExpat) {
      if (
        !values?.workOrderDate ||
        !values?.contractorsPassport ||
        !values?.endOfAssignmentDate ||
        !values?.descriptionOfAssignmentAndOrderConditions ||
        !values?.durationOfAssignment ||
        !values?.workLocation ||
        values?.remuneration == 0 ||
        !values?.workCurrency
      ) {
        isSuccess = false;
        dispatch(
          ToastShow({
            message: `Please fill all the mandatory fields!`,
            type: "error",
          })
        );
      }
      if (
        moment(values?.endOfAssignmentDate).isSameOrBefore(
          values?.workOrderDate
        )
      ) {
        isSuccess = false;
        dispatch(
          ToastShow({
            message: `End of assignment date must be greater than work order date!`,
            type: "error",
          })
        );
      }
    }

    if (isSuccess) {
      // if (id) {
      //   const response = await EditContractSummaryData(formData, id);
      //   if (response?.data?.response_type === "success") {
      //     navigate("/contract/summary");
      //   }
      // } else {
      const response = await AddContractSummaryData(formData);
      if (response?.data?.response_type === "success") {
        navigate("/contract/summary");
      }
      // }
    }
  };
  const fetchAllDetails = async () => {
    if (Number(activeClient) > 0) {
      setEmployeeData(await setEmployeeDropdownOptions(Number(activeClient)));
    }
  };

  useEffect(() => {
    if (activeClient) {
      fetchAllDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  useEffect(() => {
    if (activeEmployee) {
      fetchAllContractTemplateData(activeClient, activeEmployee);
      GetEmployeeDataByIdData(state?.employeeId ?? activeEmployee);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEmployee]);

  useEffect(() => {
    if (id) {
      fetchContractTemplateData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, employeeData]);

  const GetContractNumber = async () => {
    const responseData = await GetEmployeeContractNumber();
    const result = responseData?.data?.responseData;
    const data = result?.ContractNumber.endsWith("/")
      ? result.ContractNumber.replace("/", "")
      : result.ContractNumber;
    if (data) {
      return (Number(data) + 1).toString() ?? "";
    }
    return "";
  };

  const GetEmployeeDataByIdData = async (value: number | null) => {
    if (value) {
      const response = await GetEmployeeDetailById(value);
      if (response?.data?.responseData) {
        setEmployeeList(response?.data?.responseData);
        if (!id) {
          setContractSummaryData({
            employeeId: response?.data?.responseData.id,
            clientId: activeClient,
            contractTemplateId: contractSummaryData.contractTemplateId,
            contractVersionId: contractSummaryData.contractVersionId,
            newContractNumber: await GetContractNumber(),
            startDate: contractSummaryData?.startDate
              ? new Date(contractSummaryData?.startDate)
              : null,
            endDate: contractSummaryData?.endDate
              ? new Date(contractSummaryData?.endDate)
              : null,
            workOrderDate: contractSummaryData?.workOrderDate,
            contractorsPassport: contractSummaryData?.contractorsPassport,
            endOfAssignmentDate: contractSummaryData?.endOfAssignmentDate,
            descriptionOfAssignmentAndOrderConditions:
              contractSummaryData?.descriptionOfAssignmentAndOrderConditions,
            durationOfAssignment: contractSummaryData?.durationOfAssignment,
            workLocation: contractSummaryData?.workLocation,
            workOrderNumber: contractSummaryData?.workOrderNumber ?? null,
            remuneration: contractSummaryData?.remuneration ?? 0,
            workCurrency: contractSummaryData?.workCurrency ?? null,
            uniqueWorkNumber: null,
          });
        }
      }
    }
  };

  const fetchAllContractTemplateData = async (
    activeClient: string | number,
    activeEmployee: string | number
  ) => {
    const response = await GetRotationWiseContractTemplateData(
      `?clientId=${activeClient}&employeeId=${activeEmployee}`
    );
    if (response?.data?.responseData) {
      let contractTemplateDataList = response?.data?.responseData?.map(
        (data: { id: number; contractName: string }) => ({
          label: data?.contractName,
          value: data?.id,
        })
      );
      contractTemplateDataList = contractTemplateDataList.filter(
        (dat: Option) => {
          return dat.label && dat.value;
        }
      );
      setContractTemplateList(contractTemplateDataList);
    }
  };

  const fetchAllContractData = async (contractTemplateId: number) => {
    const response = await GetContractTemplateVersionData(
      `?contractTemplateId=${contractTemplateId}&clientId=${activeClient}`
    );
    if (response?.data?.responseData?.data) {
      const contractVersionDataList =
        response?.data?.responseData?.data
          ?.filter(
            (data: IContractTemplateVersionData) =>
              data?.versionName !== null && data?.versionName !== undefined
          )
          .map((data: IContractTemplateVersionData) => ({
            label: data?.versionName,
            value: data?.id,
          })) || [];
      setContractVersionDataList(contractVersionDataList);
    }
  };
  const fetchContractTemplateData = async (id: string) => {
    dispatch(showLoader());
    const isDefaultTemplate = ContractPdfTypes?.includes(state?.contractName);
    const query = isDefaultTemplate ? `?type=default` : `?type=new`;
    const response = await GetContractSummaryDataById(id, query);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      const newDate = new Date(resultData?.endDate);
      newDate.setDate(newDate.getDate() + 1);

      const newOtherDate = new Date(resultData?.endDate);
      newOtherDate.setDate(newOtherDate.getDate() + 2);

      setContractSummaryData({
        employeeId: resultData?.employeeId,
        clientId: activeClient,
        contractTemplateId: resultData?.contractTemplateId.toString(),
        contractVersionId: resultData?.contractVersionId.toString(),
        newContractNumber: await GetContractNumber(),
        description: isDefaultContractTemplate
          ? null
          : resultData.description
          ? resultData.description
          : "",
        startDate: new Date(newDate),
        endDate: new Date(newOtherDate),
        workOrderDate: contractSummaryData?.workOrderDate,
        contractorsPassport: contractSummaryData?.contractorsPassport,
        endOfAssignmentDate: contractSummaryData?.endOfAssignmentDate,
        descriptionOfAssignmentAndOrderConditions:
          contractSummaryData?.descriptionOfAssignmentAndOrderConditions,
        durationOfAssignment: contractSummaryData?.durationOfAssignment,
        workLocation: contractSummaryData?.workLocation,
        workOrderNumber: contractSummaryData?.workOrderNumber ?? null,
        remuneration: contractSummaryData?.remuneration ?? 0,
        workCurrency: contractSummaryData?.workCurrency,
        uniqueWorkNumber: null,
      });
      dispatch(setActiveEmployee(Number(resultData.employeeId)));
      await fetchAllContractData(Number(resultData.contractTemplateId));
    }
    dispatch(hideLoader());
  };
  const fetchContractTemplateVersionData = async (
    id: string | number,
    setFieldValue?: any
  ) => {
    dispatch(showLoader());
    const response = await GetContractTemplateVersionDataById(id?.toString());

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      if (isAvenant) {
        setFieldValue(
          "newContractNumber",
          typeof employeeList?.contractNumber === "string" &&
            employeeList?.contractNumber.endsWith("/A")
            ? employeeList.contractNumber
            : `${employeeList?.contractNumber}/A`
        );
        setContractSummaryData((prev) => ({
          ...prev,
          newContractNumber:
            typeof employeeList?.contractNumber === "string" &&
            employeeList?.contractNumber.endsWith("/A")
              ? employeeList.contractNumber
              : `${employeeList?.contractNumber}/A`,
        }));
      } else {
        setContractSummaryData({
          employeeId: Number(activeEmployee),
          clientId: activeClient,
          newContractNumber: await GetContractNumber(),
          contractVersionId: resultData?.id,
          contractTemplateId: resultData?.contractTemplateId,
          description: isDefaultContractTemplate
            ? null
            : resultData.description
            ? resultData.description
            : "",
          startDate: contractSummaryData?.startDate,
          endDate: contractSummaryData?.endDate,
          workOrderDate: contractSummaryData?.workOrderDate,
          contractorsPassport: contractSummaryData?.contractorsPassport,
          endOfAssignmentDate: contractSummaryData?.endOfAssignmentDate,
          descriptionOfAssignmentAndOrderConditions:
            contractSummaryData?.descriptionOfAssignmentAndOrderConditions,
          durationOfAssignment: contractSummaryData?.durationOfAssignment,
          workLocation: contractSummaryData?.workLocation,
          workOrderNumber: contractSummaryData?.workOrderNumber ?? null,
          remuneration: contractSummaryData?.remuneration ?? 0,
          workCurrency: contractSummaryData?.workCurrency,
          uniqueWorkNumber: null,
        });
      }
    }
    dispatch(hideLoader());
  };

  const renderEditableField = (
    values: FormikValues,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<FormikValues>>,
    setFieldTouched: (
      field: string,
      isTouched?: boolean,
      shouldValidate?: boolean
    ) => void
  ) => {
    return (
      !isDefaultContractTemplate &&
      values.contractTemplateId !== "" &&
      values.contractVersionId !== "" && (
        <div className="mt-6 bg-primaryRed/[0.03] p-4 rounded-lg">
          <p className="text-left font-semibold  text-sm mt-5">
            <span className="inline-block mt-1 mb-4 text-left text-red">
              {
                "Note: Please replace all of the data in the form of [] with the actual data."
              }
            </span>
          </p>

          <div className="grid grid-cols-3 gap-x-15px gap-y-5">
            {values.contractVersionId !== "" && (
              <ReactQuillComponent
                label={"Description"}
                key={contractSummaryData?.description}
                value={
                  contractSummaryData?.description
                    ? contractSummaryData?.description
                    : ""
                }
                setFieldValue={setFieldValue}
                name="description"
                setFieldTouched={setFieldTouched}
                parentClass="col-span-3"
              />
            )}
          </div>
        </div>
      )
    );
  };

  return (
    <Formik
      initialValues={contractSummaryData}
      enableReinitialize={true}
      validationSchema={ContractSummaryValidationSchema()}
      onSubmit={OnSubmit}
    >
      {({ values, setFieldValue, setFieldTouched }) => (
        <Form>
          <div className="bg-primaryRed/10 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-x-15px gap-y-5">
              <GroupSelectComponent
                name="employeeId"
                placeholder="Select"
                label="Employee"
                selectedValue={state?.employeeId ?? activeEmployee}
                options={employeeData ?? []}
                onChange={async (option: Option | Option[]) => {
                  dispatch(setActiveEmployee((option as Option).value));
                  setFieldValue("employeeId", Number((option as Option).value));
                  await GetEmployeeDataByIdData(+(option as Option).value);
                }}
                isCompulsory
                className="bg-white"
              />
              <SelectComponent
                name="contractTemplateId"
                placeholder="Select"
                label="Select Contract Template"
                selectedValue={values.contractTemplateId}
                options={
                  contractTemplateList?.length > 0 ? contractTemplateList : []
                }
                onChange={async (option: Option | Option[]) => {
                  setFieldValue("contractTemplateId", (option as Option).value);
                  if (
                    (option as Option).label ===
                    ContractPdfEnumTypes.LRED_Avenant
                  ) {
                    setIsAvenant(true);
                    setFieldValue(
                      "newContractNumber",
                      typeof employeeList?.contractNumber === "string" &&
                        employeeList?.contractNumber.endsWith("/A")
                        ? employeeList.contractNumber
                        : `${employeeList?.contractNumber}/A`
                    );
                    setContractSummaryData((prev) => ({
                      ...prev,
                      contractTemplateId: (option as Option).value,
                      newContractNumber:
                        typeof employeeList?.contractNumber === "string" &&
                        employeeList?.contractNumber.endsWith("/A")
                          ? employeeList.contractNumber
                          : `${employeeList?.contractNumber}/A`,
                    }));
                  } else {
                    const number = await GetContractNumber();
                    setContractSummaryData((prev) => ({
                      ...prev,
                      contractTemplateId: (option as Option).value,
                      newContractNumber: number,
                    }));
                    setFieldValue("newContractNumber", number);
                    setIsAvenant(false);
                  }

                  if (
                    (option as Option).label ===
                    ContractPdfEnumTypes.Expat_Contract
                  ) {
                    setIsExpat(true);
                  } else {
                    setIsExpat(false);
                  }
                  const isDefaultContractTemplate = ContractPdfTypes.includes(
                    (option as Option).label
                  );
                  SetIsDefaultContractTemplate(isDefaultContractTemplate);
                  await fetchAllContractData(Number((option as Option)?.value));
                }}
                isDisabled={!!id}
                isCompulsory
                className="bg-white"
              />
              <SelectComponent
                name="contractVersionId"
                placeholder="Select"
                label="Select Contract Template Version"
                selectedValue={values.contractVersionId}
                options={
                  contractVersionDataList?.length > 0
                    ? contractVersionDataList
                    : []
                }
                onChange={async (option: Option | Option[]) => {
                  setFieldValue("contractVersionId", (option as Option).value);

                  await fetchContractTemplateVersionData(
                    (option as Option).value,
                    setFieldValue
                  );
                }}
                isDisabled={!!id}
                isCompulsory
                className="bg-white"
              />
              <TextField
                smallFiled
                className="rounded-10"
                placeholder="Contract Number"
                name="newContractNumber"
                type="text"
                label={"New Contract Number"}
                disabled={true}
                isCompulsory
              />
              <DateComponent
                name="startDate"
                smallFiled
                label={"Start Date"}
                value={values?.startDate}
                placeholder={""}
                onChange={(date) => {
                  setFieldValue("startDate", date);
                  setFieldValue("workOrderDate", date);
                  setFieldValue("endOfAssignmentDate", date);
                }}
                isCompulsory
              />

              <DateComponent
                name="endDate"
                smallFiled
                label={"End Date"}
                value={values?.endDate}
                minDate={values?.startDate}
                // maxDate={new Date()}
                // maxDate={values?.startDate ?? new Date()}
                placeholder={""}
                onChange={(date) => {
                  setFieldValue("endDate", date);
                }}
                isCompulsory
              />
            </div>
          </div>

          {activeEmployee || values?.employeeId ? (
            <div>
              <div className="mt-6">
                <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                  <ul className="grid grid-cols-2 gap-x-5 1600:gap-x-10 gap-y-3 relative before:absolute before:content-[''] before:w-px before:h-full before:bg-black/10 before:left-1/2 before:-translate-x-1/2 before:top-0">
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Employee Number
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.employeeNumber ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Employee Name
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.loginUserData?.lastName +
                          " " +
                          employeeList?.loginUserData?.firstName}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Address
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.address}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        DOB
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.loginUserData?.birthDate
                          ? moment(
                              employeeList?.loginUserData?.birthDate
                            ).format("DD/MM/YYYY")
                          : "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Place Of Birth
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.loginUserData?.placeOfBirth ?? ""}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Monthly Salary
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.monthlySalary ?? ""}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Base Salary{" "}
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.monthlySalary ?? ""}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Contract Number
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.employeeContracts
                          ? employeeList?.employeeContracts[0]
                              ?.newContractNumber
                          : ""}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Function
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.fonction ?? ""}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Rotation
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeList?.rotation
                          ? employeeList?.rotation.name
                          : ""}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {values.contractTemplateId !== "" &&
                renderEditableField(values, setFieldValue, setFieldTouched)}
              {isExpat && (
                <div className="bg-primaryRed/10 p-4 rounded-lg mt-5">
                  <div className="grid grid-cols-3 gap-x-15px gap-y-5">
                    {/* <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Work Order Number"
                      name="workOrderNumber"
                      type="text"
                      label={"Work Order Number"}
                      isCompulsory
                    /> */}
                    <DateComponent
                      name="workOrderDate"
                      smallFiled
                      label={"Work Order Date"}
                      value={values?.workOrderDate}
                      minDate={values?.startDate}
                      placeholder={"Enter Work Order Date"}
                      onChange={(date) => {
                        setFieldValue("workOrderDate", date);
                      }}
                      isCompulsory
                    />
                    <DateComponent
                      name="endOfAssignmentDate"
                      smallFiled
                      label={"End of Assignment Date"}
                      value={values?.endOfAssignmentDate}
                      minDate={values?.startDate}
                      placeholder={"Enter End of Assignment Date"}
                      onChange={(date) => {
                        setFieldValue("endOfAssignmentDate", date);
                      }}
                      isCompulsory
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Enter Contractor's Passport"
                      name="contractorsPassport"
                      type="text"
                      label={"Contractor's Passport"}
                      isCompulsory
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Enter Remuneration to Consultant"
                      name="remuneration"
                      type="number"
                      label={"Remuneration to Consultant"}
                      isCompulsory
                    />
                    <SelectComponent
                      name="workCurrency"
                      placeholder="Select Currency"
                      label="Currency"
                      selectedValue={values.workCurrency}
                      options={currencyList.length ? currencyList : []}
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("workCurrency", (option as Option).value);
                      }}
                      className="bg-white"
                      isCompulsory
                    />
                    <Textarea
                      name="descriptionOfAssignmentAndOrderConditions"
                      type="text"
                      smallFiled={true}
                      placeholder={
                        "Enter Description of Assignment and Order Conditions"
                      }
                      label={"Description of Assignment and Order Conditions"}
                      isCompulsory={true}
                    />
                    <Textarea
                      name="durationOfAssignment"
                      type="text"
                      smallFiled={true}
                      placeholder={"Enter Duration of Assignment"}
                      label={"Duration of Assignment"}
                      isCompulsory={true}
                    />
                    <Textarea
                      name="workLocation"
                      type="text"
                      smallFiled={true}
                      placeholder={"Enter Work Location"}
                      label={"Work Location"}
                      isCompulsory={true}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-wrap justify-end 1400:flex-nowrap gap-x-2">
                <Button
                  variant={"gray"}
                  type="button"
                  parentClass="mt-10"
                  onClickHandler={() => navigate("/contract/summary")}
                >
                  Cancel
                </Button>
                <Button
                  variant={"primary"}
                  type="submit"
                  parentClass="mt-10"
                  loader={loader}
                >
                  {pathname?.includes("edit") ? "Save" : "Add"}
                </Button>
              </div>
              {/* {values.contractTemplateId !== "" && (
                  <div className="mt-6 bg-primaryRed/[0.03] p-4 rounded-lg">
                    {values.contractVersionId !== "" && (
                      <p className="text-left font-semibold  text-sm mt-5">
                        <span className="inline-block mt-1 mb-4 text-left text-red">
                          {
                            "Note: Please replace all of the data in the form of [] with the actual data."
                          }
                        </span>
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-x-15px gap-y-5">
                      {values.contractVersionId !== "" && (
                        <>
                          <ReactQuillComponent
                            label={"Description"}
                            key={contractSummaryData?.description}
                            value={
                              contractSummaryData?.description
                                ? contractSummaryData?.description
                                : ""
                            }
                            setFieldValue={setFieldValue}
                            name="description"
                            setFieldTouched={setFieldTouched}
                            parentClass="col-span-3"
                          />
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-end 1400:flex-nowrap gap-x-2">
                      <Button
                        variant={"gray"}
                        type="button"
                        parentClass="mt-10"
                        onClickHandler={() => navigate("/contract/summary")}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant={"primary"}
                        type="submit"
                        parentClass="mt-10"
                        loader={loader}
                      >
                        {pathname?.includes("edit") ? "Save" : "Add"}
                      </Button>
                    </div>
                  </div>
                )} */}
            </div>
          ) : (
            ""
          )}
        </Form>
      )}
    </Formik>
  );
};

export default AddUpdateContractSummary;
