import Button from "@/components/formComponents/button/Button";
import GroupSelectComponent from "@/components/formComponents/customSelect/GroupSelect";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import ReactQuillComponent from "@/components/formComponents/reactQuillComponent/ReactQuillComponent";
import TextField from "@/components/formComponents/textField/TextField";
import {
  generateInvoiceNumber,
  setEmployeeDropdownOptions,
} from "@/helpers/Utils";
import { IAccountSummaryDataById } from "@/interface/account/accountSummaryInterface";
import { IAccountModifySummary } from "@/interface/account/pos/accountModifySummaryInterface";
import { GroupOption, Option } from "@/interface/customSelect/customSelect";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  activeEmployeeSelector,
  setActiveEmployee,
} from "@/redux/slices/employeeSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { generateInvoice } from "@/services/accountPOService";
import {
  GetAllAccountSummaryById,
  UpdateAccountData,
} from "@/services/accountService";
import { GetDropdownDetails } from "@/services/timesheetService";
import { Form, Formik, FormikValues } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AccountModifySummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeEmployee = useSelector(activeEmployeeSelector);
  const activeClient = useSelector(activeClientSelector);
  const [employeeData, setEmployeeData] = useState<GroupOption[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [accountDataList, setAccountDataList] =
    useState<IAccountSummaryDataById>();
  const defaultInitialValues: IAccountModifySummary = {
    employeeId: 0,
    timesheetId: "",
    clientId: activeClient,
    invoiced: null,
    invoiceNumber: "",
    invoiceAmount: null,
    salaryPaid: null,
    comments: "",
    invoiceLodgingDate: new Date(),
    dateSalaryPaid: new Date(),
    poNumber: "",
    poDate: new Date(),
    bonus1Name: "",
    bonus1: "",
    poBonus1: "",
    invoiceNumberPOBonus1: "",
    bonus2Name: "",
    bonus2: "",
    poBonus2: "",
    invoiceNumberPOBonus2: "",
    bonus3Name: "",
    bonus3: "",
    poBonus3: "",
    invoiceNumberPOBonus3: "",
    additionalAmount: "",
    additionalPOBonus: "",
    additionalInvoiceNumberPO: "",
    isGeneratedInvoice: false,
  };
  const [accountModifySummaryData, setAccountModifySummaryData] =
    useState<IAccountModifySummary>(defaultInitialValues);
  const [dropdownDetails, setDropdownDetails] = useState<{
    dateDropDown: Option[];
  }>({
    dateDropDown: [],
  });
  const [activeDateDropdown, setActiveDateDropdown] = useState<{
    position: string;
    startDate: string | Date;
    endDate: string | Date;
  }>({
    position: "",
    startDate: "",
    endDate: "",
  });

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);

    const formData = new FormData();
    const invoiceLodgingDate = moment(
      moment(values.invoiceLodgingDate).format("DD-MM-YYYY"),
      "DD-MM-YYYY"
    );
    const dateSalaryPaid = moment(
      moment(values.dateSalaryPaid).format("DD-MM-YYYY"),
      "DD-MM-YYYY"
    );

    const poDate = moment(
      moment(values.poDate).format("DD-MM-YYYY"),
      "DD-MM-YYYY"
    );

    if (activeEmployee) {
      formData.append("employeeId", activeEmployee.toString());
    } else {
      formData.append("employeeId", values.employeeId);
    }
    formData.append("invoiced", values.invoiced);
    formData.append("poNumber", values.poNumber);
    formData.append("poDate", String(poDate));
    formData.append("bonus1Name", values.bonus1Name);
    formData.append("bonus1", values.bonus1);
    formData.append("poBonus1", values.poBonus1);
    formData.append("invoiceNumberPOBonus1", values.invoiceNumberPOBonus1);
    formData.append("bonus2Name", values.bonus2Name);
    formData.append("bonus2", values.bonus2);
    formData.append("poBonus2", values.poBonus2);
    formData.append("invoiceNumberPOBonus2", values.invoiceNumberPOBonus2);
    formData.append("bonus3Name", values.bonus3Name);
    formData.append("bonus3", values.bonus3);
    formData.append("poBonus3", values.poBonus3);
    formData.append("invoiceNumberPOBonus3", values.invoiceNumberPOBonus3);
    formData.append("additionalAmount", values.additionalAmount);
    formData.append("additionalPOBonus", values.additionalPOBonus);
    formData.append(
      "additionalInvoiceNumberPO",
      values.additionalInvoiceNumberPO
    );
    formData.append("invoiceNumber", values.invoiceNumber);
    formData.append("invoiceAmount", values.invoiceAmount);
    formData.append("salaryPaid", values.salaryPaid);
    formData.append("invoiceLodgingDate", String(invoiceLodgingDate));
    formData.append("dateSalaryPaid", String(dateSalaryPaid));
    formData.append("comments", values.comments);
    formData.append("isGeneratedInvoice", values.isGeneratedInvoice);

    if (values.isGeneratedInvoice === true) {
      const res = await generateInvoice(activeEmployee ?? values.employeeId, {
        invoiceItems: [
          {
            taxType: "NONE",
            accountCode: "400",
            description: accountDataList?.type,
            quantity: accountDataList?.daysWorked,
            unitAmount: accountDataList?.dailyCost,
          },
        ],
        approveDate: moment().format("DD/MM/YYYY"),
        poId: accountDataList?.id,
        invoiceNumber: generateInvoiceNumber(
          accountDataList?.serviceMonth,
          activeClient
        ),
      });
      if (res?.data?.response_type === "success") {
        navigate("/accounts/summary");
      }
    }

    const query = `?employeeId=${
      activeEmployee ?? values.employeeId
    }&timesheetId=${accountModifySummaryData?.timesheetId}`;

    const response = await UpdateAccountData(
      query +
        (activeDateDropdown.startDate
          ? `&startDate=${activeDateDropdown.startDate}`
          : ""),
      formData
    );
    if (response?.data?.response_type === "success") {
      navigate("/accounts/summary");
    }
    setLoader(false);
  };

  const fetchAllDetails = async () => {
    if (Number(activeClient) > 0) {
      setEmployeeData(await setEmployeeDropdownOptions(Number(activeClient)));
    }
  };

  useEffect(() => {
    fetchAllDropdownDetails();
    if (activeClient) {
      fetchAllDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  useEffect(() => {
    if (
      activeEmployee &&
      activeDateDropdown.endDate &&
      activeDateDropdown.startDate
    ) {
      const queryString = `?employeeId=${activeEmployee}`;
      GetAccountDataByIdData(
        queryString +
          (activeDateDropdown.startDate
            ? `&startDate=${activeDateDropdown.startDate}`
            : "") +
          (activeDateDropdown.endDate
            ? `&endDate=${activeDateDropdown.endDate}`
            : "")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEmployee, activeDateDropdown]);

  const fetchAllDropdownDetails = async () => {
    setLoader(true);
    dispatch(showLoader());
    if (activeClient) {
      const response = await GetDropdownDetails(activeClient);
      const datesDetailsResponse = response?.data?.responseData.dates.map(
        (data: string) => {
          return {
            label:
              moment(data?.split(" - ")[1], "DD-MM-YYYY").format("MMM-YY") +
              " (" +
              data +
              ")",
            value: data,
          };
        }
      );
      if (response?.data?.responseData) {
        setDropdownDetails({
          dateDropDown: datesDetailsResponse,
        });
        const currentDateIndex = datesDetailsResponse.findIndex((a: Option) => {
          const dates = a?.value.toString().split(" - ");

          return (
            new Date(
              moment(dates[0], "DD-MM-YYYY").format("YYYY-MM-DD")
            ).getTime() <= new Date().getTime() &&
            new Date(
              moment(dates[1], "DD-MM-YYYY").format("YYYY-MM-DD")
            ).getTime() >= new Date().getTime()
          );
        });
        const dateRange =
          datesDetailsResponse[currentDateIndex]?.value.split(" - ");
        if (dateRange?.length > 0) {
          setActiveDateDropdown({
            position: datesDetailsResponse[currentDateIndex]?.value,
            startDate: dateRange[0],
            endDate: dateRange[1],
          });
        }
      }
    }
    setLoader(false);
    dispatch(hideLoader());
  };

  const GetAccountDataByIdData = async (query: string) => {
    setLoader(true);
    dispatch(showLoader());
    if (query) {
      const response = await GetAllAccountSummaryById(query);
      if (
        response?.data?.response_type === "success" &&
        response?.data?.responseData
      ) {
        setAccountDataList(response?.data?.responseData);
        setAccountModifySummaryData({
          invoiced: response?.data?.responseData?.invoiced ?? null,
          invoiceAmount: response?.data?.responseData?.invoiceAmount ?? null,
          invoiceNumber:
            response?.data?.responseData?.invoiceNumber ??
            generateInvoiceNumber(accountDataList?.serviceMonth, activeClient),
          salaryPaid: response?.data?.responseData?.salaryPaid ?? null,
          comments: response?.data?.responseData?.comments ?? null,
          employeeId: response?.data?.responseData?.employeeId ?? 0,
          isGeneratedInvoice:
            response?.data?.responseData?.isGeneratedInvoice ?? false,
          invoiceLodgingDate: new Date(
            response?.data?.responseData?.invoiceLodgingDate
          ),
          dateSalaryPaid: new Date(
            response?.data?.responseData?.dateSalaryPaid
          ),
          poNumber: response?.data?.responseData?.poNumber ?? null,
          poDate: new Date(response?.data?.responseData?.poDate),
          bonus1Name: response?.data?.responseData?.bonus1Name ?? null,
          bonus1: response?.data?.responseData?.bonus1 ?? null,
          poBonus1: response?.data?.responseData?.poBonus1 ?? null,
          invoiceNumberPOBonus1:
            response?.data?.responseData?.invoiceNumberPOBonus1 ?? null,
          bonus2Name: response?.data?.responseData?.bonus2Name ?? null,
          bonus2: response?.data?.responseData?.bonus2 ?? null,
          poBonus2: response?.data?.responseData?.poBonus2 ?? null,
          invoiceNumberPOBonus2:
            response?.data?.responseData?.invoiceNumberPOBonus2 ?? null,
          bonus3Name: response?.data?.responseData?.bonus3Name ?? null,
          bonus3: response?.data?.responseData?.bonus3 ?? null,
          poBonus3: response?.data?.responseData?.poBonus3 ?? null,
          invoiceNumberPOBonus3:
            response?.data?.responseData?.invoiceNumberPOBonus3 ?? null,
          additionalAmount:
            response?.data?.responseData?.additionalAmount ?? null,
          additionalPOBonus:
            response?.data?.responseData?.additionalPOBonus ?? null,
          additionalInvoiceNumberPO:
            response?.data?.responseData?.additionalInvoiceNumberPO ?? null,
          timesheetId: response?.data?.responseData?.timesheetId ?? null,
        });
      }
    }
    dispatch(hideLoader());
    setLoader(false);
  };

  return (
    <Formik
      initialValues={accountModifySummaryData}
      enableReinitialize={true}
      onSubmit={OnSubmit}
    >
      {({ values, errors, setFieldValue, setFieldTouched, handleSubmit }) => (
        <Form>
          <div className="bg-primaryRed/10 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-x-15px gap-y-5">
              <SelectComponent
                label="Select Date"
                options={dropdownDetails.dateDropDown}
                parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
                onChange={(option: Option | Option[]) => {
                  if (!Array.isArray(option)) {
                    const dateRange = option.value.toString().split(" - ");
                    setActiveDateDropdown({
                      position: option?.value.toString(),
                      startDate: dateRange[0],
                      endDate: dateRange[1],
                    });
                  }
                }}
                selectedValue={activeDateDropdown.position}
                className="bg-white"
              />
              <GroupSelectComponent
                name="employeeId"
                placeholder="Select"
                label="Employee"
                selectedValue={activeEmployee}
                options={employeeData ?? []}
                onChange={async (option: Option | Option[]) => {
                  dispatch(setActiveEmployee((option as Option).value));
                  setFieldValue("employeeId", Number((option as Option).value));
                  await GetAccountDataByIdData(
                    `?employeeId=${+(option as Option).value}` +
                      (activeDateDropdown.startDate
                        ? `&startDate=${activeDateDropdown.startDate}`
                        : "") +
                      (activeDateDropdown.endDate
                        ? `&endDate=${activeDateDropdown.endDate}`
                        : "")
                  );
                }}
                isCompulsory
                className="bg-white"
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
                        {accountDataList?.n ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Employee Name
                      </span>
                      <span
                        className={`text-sm/18px 
                       ${moment(
                         accountDataList?.employee?.contractEndDate
                       )?.isBefore(moment()) ? "text-red":"text-black"}
                        font-medium w-1/2 text-left break-words`}
                      >
                        {accountDataList?.position}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Type
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.type}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Affection
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.affectation ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Service Month
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.serviceMonth ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Monthly Salary with...{" "}
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.monthlySalaryWithHousingAndTravel?.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        ) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Days worked
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.daysWorked ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Daily cost
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.dailyCost?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Should be invoiced
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.shouldBeInvoiced
                          ? accountDataList?.shouldBeInvoiced.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Invoiced
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.invoiced?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        To be invoiced back
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.toBeInvoicedBack?.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        ) ?? ""}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        PO number
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.poNumber ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        PO Date
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.poDate
                          ? moment(accountDataList?.poDate).format("DD/MM/YYYY")
                          : "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Invoice number
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.invoiceNumber
                          ? accountDataList?.invoiceNumber
                          : "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Invoice lodging Date
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.invoiceLodgingDate
                          ? moment(accountDataList?.invoiceLodgingDate).format(
                              "DD/MM/YYYY"
                            )
                          : "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Invoice amount
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.invoiceAmount
                          ? accountDataList?.invoiceAmount.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Salary paid
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.salaryPaid?.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        ) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Bonus 1 Name
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.bonus1Name ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Bonus 1
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.bonus1?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        PO Bonus 1
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.poBonus1?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Invoice number PO Bonus 1
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.invoiceNumberPOBonus1 ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Bonus 2 Name
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.bonus2Name ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Bonus 2
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.bonus2?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        PO Bonus 2
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.poBonus2?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Invoice number PO Bonus 2
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.invoiceNumberPOBonus2 ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Bonus 3 Name
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.bonus3Name ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Bonus 3
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.bonus3?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        PO Bonus 3
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.poBonus3?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Invoice number PO Bonus 3
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.invoiceNumberPOBonus3 ?? "-"}
                      </span>
                    </li>

                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Additional Amount
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.additionalAmount?.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        ) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Additional PO Bonus
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.additionalPOBonus?.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        ) ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Additional Invoice number PO
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.additionalInvoiceNumberPO ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Date Salary paid
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.dateSalaryPaid
                          ? moment(accountDataList?.dateSalaryPaid).format(
                              "DD/MM/YYYY"
                            )
                          : "-"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Comments
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {accountDataList?.comments
                          ? accountDataList?.comments.replace(/<(.|\n)*?>/g, "")
                          : "-"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {values.isGeneratedInvoice !== true && (
                <div className="mt-6 bg-primaryRed/[0.03] p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-x-15px gap-y-5">
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Invoiced"
                      name="invoiced"
                      type="number"
                      label={"Invoiced"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="PO Number"
                      name="poNumber"
                      type="text"
                      label={"PO Number"}
                    />
                    <DateComponent
                      name="poDate"
                      smallFiled
                      label={"PO Date"}
                      value={values?.poDate}
                      placeholder={""}
                      onChange={(date) => {
                        setFieldValue("poDate", date);
                      }}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Invoice Number"
                      name="invoiceNumber"
                      type="text"
                      label={"Invoice Number"}
                    />
                    <DateComponent
                      name="invoiceLodgingDate"
                      smallFiled
                      label={"Invoice Lodging Date"}
                      value={values?.invoiceLodgingDate}
                      placeholder={""}
                      onChange={(date) => {
                        setFieldValue("invoiceLodgingDate", date);
                      }}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Invoice Amount"
                      name="invoiceAmount"
                      type="number"
                      label={"Invoice Amount"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Salary Paid"
                      name="salaryPaid"
                      type="number"
                      label={"Salary Paid"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Bonus 1 Name"
                      name="bonus1Name"
                      type="text"
                      label={"Bonus 1 Name"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Bonus 1"
                      name="bonus1"
                      type="number"
                      label={"Bonus 1"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="PO Bonus 1"
                      name="poBonus1"
                      type="text"
                      label={"PO Bonus 1"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Invoice Number PO Bonus 1"
                      name="invoiceNumberPOBonus1"
                      type="text"
                      label={"Invoice Number PO Bonus 1"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Bonus 2 Name"
                      name="bonus2Name"
                      type="text"
                      label={"Bonus 2 Name"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Bonus 2"
                      name="bonus2"
                      type="number"
                      label={"Bonus 2"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="PO Bonus 2"
                      name="poBonus2"
                      type="text"
                      label={"PO Bonus 2"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Invoice Number PO Bonus 2"
                      name="invoiceNumberPOBonus2"
                      type="text"
                      label={"Invoice Number PO Bonus 2"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Bonus 3 Name"
                      name="bonus3Name"
                      type="text"
                      label={"Bonus 3 Name"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Bonus 3"
                      name="bonus3"
                      type="number"
                      label={"Bonus 3"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="PO Bonus 3"
                      name="poBonus3"
                      type="text"
                      label={"PO Bonus 3"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Invoice Number PO Bonus 3"
                      name="invoiceNumberPOBonus3"
                      type="text"
                      label={"Invoice Number PO Bonus 3"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Additional Amount"
                      name="additionalAmount"
                      type="number"
                      label={"Additional Amount"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Additional PO Bonus"
                      name="additionalPOBonus"
                      type="text"
                      label={"Additional PO Bonus"}
                    />
                    <TextField
                      smallFiled
                      className="rounded-10"
                      placeholder="Additional Invoice Number PO"
                      name="additionalInvoiceNumberPO"
                      type="text"
                      label={"Additional Invoice Number PO"}
                    />
                    <DateComponent
                      name="dateSalaryPaid"
                      smallFiled
                      label={"Date Salary Paid"}
                      value={values?.dateSalaryPaid}
                      placeholder={""}
                      onChange={(date) => {
                        setFieldValue("dateSalaryPaid", date);
                      }}
                    />
                  </div>
                  <div className="mt-5">
                    <ReactQuillComponent
                      label={"Comments"}
                      key={accountModifySummaryData?.comments}
                      value={
                        accountModifySummaryData?.comments
                          ? accountModifySummaryData?.comments
                          : ""
                      }
                      setFieldValue={setFieldValue}
                      name="comments"
                      setFieldTouched={setFieldTouched}
                      parentClass="col-span-3"
                    />
                  </div>

                  <div className="flex flex-wrap justify-end 1400:flex-nowrap gap-x-2">
                    <Button
                      variant={"gray"}
                      type="button"
                      parentClass="mt-10"
                      onClickHandler={() => navigate("/accounts/summary")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant={"primary"}
                      onClickHandler={() => {
                        setFieldValue("isGeneratedInvoice", true);
                        handleSubmit();
                      }}
                      parentClass="mt-10"
                      loader={
                        Object.keys(errors).length === 0 &&
                        !(values as object as { isGeneratedInvoice: boolean })
                          ?.isGeneratedInvoice &&
                        loader
                      }
                    >
                      Generate Invoice
                    </Button>
                    <Button
                      variant={"primary"}
                      type="submit"
                      parentClass="mt-10"
                      loader={loader}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </Form>
      )}
    </Formik>
  );
};
export default AccountModifySummary;
