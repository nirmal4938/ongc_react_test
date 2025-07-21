import Table from "@/components/table/Table";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  GetAllEmployee,
  GetSegmentDropdownData,
} from "@/services/employeeService";
import { ISegmentData } from "@/interface/segment/segmentInterface";
import { IRotationData } from "@/interface/rotation/rotationInterface";
import { ISubSegmentData } from "@/interface/subSegment/subSegmentInterface";
import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import moment from "moment";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { ILoginUserData } from "@/interface/user/userInterface";
import { useNavigate } from "react-router-dom";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { ViewButton } from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { Option } from "@/interface/customSelect/customSelect";

const EmployeeExport = () => {
  const navigate = useNavigate();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.EmployeeExport ? pageState?.value : {};
  const tabValue = [
    { name: "Active", value: 1 },
    { name: "Terminated", value: 0 },
    { name: "All", value: -1 },
  ];
  const dispatch = useDispatch();
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.EmployeeExport
      ? pageStateData?.page ?? 1
      : currentPage;
  const activeClient = useSelector(activeClientSelector);
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [activeSegment, setActiveSegment] = useState<string>(
    pageStateData?.activeSegment ?? "all"
  );
  const [segmentDropdownOption, setSegmentDropdownOption] = useState<Option[]>(
    []
  );
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [loader, setLoader] = useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<{
    data: IEmployeeData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  const currentDate = new Date(),
    year = currentDate.getFullYear(),
    month = currentDate.getMonth();
  const [dateFilter, setDateFilter] = useState({
    startDate: pageStateData?.startDate ?? new Date(year, month, 1),
    endDate: pageStateData?.endDate ?? new Date(year, month + 1, 0),
  });
  const [tabData, setTabData] = useState<number>(
    pageStateData?.tabData != null && pageStateData?.tabData != undefined
      ? pageStateData?.tabData
      : 1
  );

  const statusRender = (
    terminationDate: Date | null | undefined,
    isAdminApproved: boolean | null,
    employeeStatus?: "DRAFT" | "SAVED"
  ) => {
    return getStatus(terminationDate, isAdminApproved, employeeStatus);
  };

  const getStatus = (
    terminationDate: Date | null | undefined,
    isAdminApproved: boolean | null,
    employeeStatus?: "DRAFT" | "SAVED"
  ) => {
    if (
      !(
        terminationDate && moment().diff(moment(terminationDate), "seconds") > 0
      )
    ) {
      if (isAdminApproved === true) {
        return <span className="font-semibold text-PrimaryGreen">Active</span>;
      } else if (isAdminApproved === null && employeeStatus === "SAVED") {
        return <span className="font-semibold text-grayDark">Pending</span>;
      } else if (isAdminApproved === null && employeeStatus === "DRAFT") {
        return <span className="font-semibold text-grayDark">Draft</span>;
      } else {
        return <span className="font-semibold text-tomatoRed">Rejected</span>;
      }
    } else {
      return <span className="font-semibold text-primaryRed">Terminated</span>;
    }
  };

  const actionButton = (slug: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.Employee, PermissionEnum.View) && (
          <ViewButton
            onClickHandler={() => {
              navigate(`/employee/export/view/${slug}`);
            }}
          />
        )}
      </div>
    );
  };
  const columnData = [
    {
      header: "Matricule",
      name: "employeeNumber",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Temp No",
      name: "employeeNumber",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Contract Number",
      name: "contractNumber",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Surname",
      name: "lastName",
      option: {
        sort: false,
      },
      cell: (props: { loginUserData: ILoginUserData }) => {
        return props.loginUserData?.lastName
          ? props.loginUserData?.lastName
          : "-";
      },
    },
    {
      header: "Forename",
      name: "firstName",
      option: {
        sort: false,
      },
      cell: (props: { loginUserData: ILoginUserData }) => {
        return props.loginUserData?.firstName
          ? props.loginUserData?.firstName
          : "-";
      },
    },
    {
      header: "Fonction",
      name: "fonction",
      option: {
        sort: true,
      },
    },
    {
      header: "Date Of Birth",
      name: "dOB",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { loginUserData: ILoginUserData }) => {
        return props.loginUserData?.birthDate
          ? moment(props.loginUserData?.birthDate).format("DD/MM/YYYY")
          : "-";
      },
    },
    {
      header: "Place Of Birth",
      name: "placeOfBirth",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { loginUserData: ILoginUserData }) => {
        return props.loginUserData?.placeOfBirth
          ? props.loginUserData?.placeOfBirth
          : "-";
      },
    },
    {
      header: "Segment",
      name: "segmentName",
      option: {
        sort: false,
      },
    },
    {
      header: "Sub-Segment",
      name: "subSegmentName",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Rotation",
      name: "rotationName",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Start Date",
      name: "startDate",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { startDate: Date | string }) => {
        return props.startDate
          ? moment(props.startDate).format("DD/MM/YYYY")
          : "-";
      },
    },
    {
      header: "Status",
      name: "status",
      className: "",
      commonClass: "",
      cell: (props: {
        terminationDate: Date | null | undefined;
        isAdminApproved: boolean | null;
        employeeStatus: "SAVED" | "DRAFT";
      }) =>
        props?.isAdminApproved !== undefined
          ? statusRender(
              props?.terminationDate,
              props?.isAdminApproved,
              props?.employeeStatus
            )
          : "-",
    },
    {
      header: "Action",
      cell: (props: { slug: string }) => actionButton(props.slug),
    },
  ];

  const fetchEmployeeSegmentDropdown = async () => {
    const response = await GetSegmentDropdownData(
      `?clientId=${activeClient}&isActive=true`
    );
    const result = response?.data?.responseData;
    if (result) {
      let segmentOption = [
        {
          label: `All Segment`,
          value: "all",
        },
      ];
      if (result?.length) {
        segmentOption = [...segmentOption, ...result];
      }
      setSegmentDropdownOption(segmentOption);
    }
  };

  const getActive = () => {
    const resultData: { name: string; value: number } | undefined =
      tabValue.find((a) => a.value == tabData);
    return resultData?.name?.toLowerCase();
  };

  const fetchAllEmployee = async () => {
    let queryString = `?clientId=${activeClient}&sort=${
      sortType ? "asc" : "desc"
    }&sortBy=${sort}&activeStatus=${getActive()}&startDate=${moment(
      dateFilter.startDate
    ).format("YYYY/MM/DD")}&endDate=${moment(dateFilter.endDate).format(
      "YYYY/MM/DD"
    )}&isExportPage=true`;
    setLoader(true);
    dispatch(showLoader());
    if (activeSegment != "all") {
      const segmentIds = activeSegment.split("-");
      queryString +=
        `&segmentId=${segmentIds[0]}` +
        (segmentIds[1] ? `&subSegmentId=${segmentIds[1]}` : ``);
    }
    const response = await GetAllEmployee(queryString);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      if (result?.data.length > 0) {
        let tempResponse = [];
        tempResponse = result?.data.map(
          (data: {
            segmentName: string;
            subSegmentName: string;
            rotationName: string | undefined;
            contractNumber: string | undefined;
            segment: ISegmentData;
            customBonus?: string | string[];
            subSegment: ISubSegmentData;
            rotation: IRotationData;
            employeeContract: IContractSummaryData[];
            contractCount: string;
          }) => {
            data.segmentName = data.segment?.name;
            data.subSegmentName = data.subSegment?.name;
            data.rotationName = data.rotation?.name;
            if (data.employeeContract?.length) {
              data.contractNumber =
                data.employeeContract[0]?.newContractNumber?.toString();
              data.contractCount = data.employeeContract.length.toString();
            }
            data.customBonus =
              data?.customBonus &&
              JSON.parse(data?.customBonus as string)?.data;
            return data;
          }
        );
        result.data = tempResponse;
      }
      setEmployeeData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  };

  const getFormatedDate = (date: Date | string | null | undefined) =>
    date ? moment(date).format("DD-MM-YYYY") : null;
  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    const itemValue = employeeData.data.map((item) => {
      const newObj = {
        Matricule: item?.employeeNumber,
        "Temp No": item?.TempNumber,
        "Contract Number": item?.contractNumber,
        Surname: item?.loginUserData?.lastName,
        Forename: item?.loginUserData?.firstName,
        Fonction: item.fonction,
        Rollover: item?.client?.isResetBalance === true ? "Yes" : "No",
        "Segment Date":
          item?.employeeSegment && item?.employeeSegment?.length > 0
            ? getFormatedDate(item?.employeeSegment[0]?.date)
            : null,
        "Date Of Birth": getFormatedDate(item?.loginUserData?.birthDate),
        "Place Of Birth": item?.loginUserData?.placeOfBirth,
        Segment: item.segment?.name,
        "Sub-Segment": item.subSegment?.name,
        "Rotation Date":
          item?.employeeRotation && item?.employeeRotation?.length > 0
            ? getFormatedDate(item?.employeeRotation[0]?.date)
            : null,
        Rotation: item.rotation?.name,
        "Salary Date":
          item?.employeeSalary && item?.employeeSalary?.length > 0
            ? getFormatedDate(item?.employeeSalary[0]?.startDate)
            : null,
        "Catalog Number": "",
        "Monthly Salary": item?.monthlySalary,
        // "Initial Balance": item?.initialBalance,
        "Salaire de Base": item?.baseSalary,
        "Travel Allowance": item?.travelAllowance,
        Housing: item?.Housing,
        "Daily Cost": item?.dailyCost,
        "Start Date": getFormatedDate(item?.startDate),
        "CNAS Declaration Date": getFormatedDate(item?.contractSignedDate),
        "Medical Check Date": getFormatedDate(item?.medicalCheckDate),
        "Medical Check Expiry": getFormatedDate(item?.medicalCheckExpiry),
        "Overtime Bonus 1": item?.overtime01Bonus,
        "Overtime Bonus 2": item?.overtime02Bonus,
        "Weekend Overtime Bonus": item?.weekendOvertimeBonus,
        "Type de Bonus 1":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[0]?.label,
        "Bonus 1":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[0]?.price,
        "Bonus Cout Journalier 1":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[0]?.coutJournalier,
        "Type de Bonus 2":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[1]?.label,
        "Bonus 2":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[1]?.price,
        "Bonus Cout Journalier 2":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[1]?.coutJournalier,
        "Type de Bonus 3":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[2]?.label,
        "Bonus 3":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[2]?.price,
        "Bonus Cout Journalier 3":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[2]?.coutJournalier,
        "Type de Bonus 4":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[3]?.label,
        "Bonus 4":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[3]?.price,
        "Bonus Cout Journalier 4":
          item.customBonus &&
          item.customBonus.length > 0 &&
          item?.customBonus[3]?.coutJournalier,
        "Medical Insurance": item.medicalInsurance === true ? "Yes" : "No",
        Address: item.address,
        "N° S.S.": item.nSS,
        Gender: item?.loginUserData?.gender,
        "Termination Date": getFormatedDate(item.terminationDate),
        "Contract End Date": getFormatedDate(item.contractEndDate),
        "Mobile Number": item?.loginUserData?.phone,
        Email: item?.loginUserData?.email,
        "Next Of Kin Mobile": item.nextOfKinMobile,
      };
      return newObj;
    });
    const worksheet = XLSX.utils.json_to_sheet(itemValue);
    worksheet["!cols"] = [
      { width: 12 },
      { width: 12 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 12 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 27 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 12 },
      { width: 15 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 18 },
      { width: 15 },
      { width: 25 },
      { width: 18 },
      { width: 15 },
      { width: 25 },
      { width: 18 },
      { width: 15 },
      { width: 25 },
      { width: 18 },
      { width: 15 },
      { width: 25 },
      { width: 20 },
      { width: 70 },
      { width: 20 },
      { width: 15 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 30 },
      { width: 25 },
    ];
    worksheet["!rows"] = [];
    worksheet["!rows"][0] = { hpt: 30 };
    const regexPattern = /^[a-zA-Z]{2}1$/;
    Object?.keys(worksheet)
      ?.filter(
        (e) =>
          (e?.length === 2 && e?.endsWith("1")) ||
          (e?.length === 3 && regexPattern.test(e))
      )
      ?.forEach((cell) => {
        worksheet[cell].s = {
          fill: { fgColor: { rgb: "560504	" } },
          font: { sz: "12", bold: true, color: { rgb: "FFFFFF" } },
          alignment: {
            wrapText: true,
            horizontal: "center",
            vertical: "center",
          },
        };
      });
    itemValue.forEach(async () => {
      worksheet["!rows"]?.push({ hpt: 20 });
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Master_Employee_List.xlsx");
  };
  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      activeClient &&
      (currentPage === 1 || currentPageNumber != currentPage)
    ) {
      fetchEmployeeSegmentDropdown();
      fetchAllEmployee();
    }

    setPageState({
      state: DefaultState.EmployeeExport as string,
      value: {
        ...pageStateData,
        page: employeeData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
        activeSegment: activeSegment,
        tabData: tabData,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    activeSegment,
    dateFilter?.startDate,
    dateFilter?.endDate,
    limit,
    tabData,
    activeClient,
    sort,
    sortType,
  ]);
  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={employeeData.data}
        isButton={getPermissions(
          FeaturesNameEnum.Employee,
          PermissionEnum.View
        )}
        isTab={true}
        setTab={setTabData}
        tabValue={tabData}
        TabList={tabValue?.length > 0 ? tabValue : []}
        // isDateSided={true}
        buttonText="Export to Excel"
        buttonClick={handleExport}
        loader={loader}
        isDropdown={true}
        dropDownList={segmentDropdownOption}
        dropDownValue={activeSegment}
        setDropdownValue={(value: any) => {
          setActiveSegment(value);
        }}
        pagination={true}
        paginationModule={DefaultState.EmployeeExport}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={employeeData.totalPage}
        dataCount={employeeData.totalCount}
        isClientDropdown={false}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        isDateRange={true}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
    </>
  );
};

export default EmployeeExport;
