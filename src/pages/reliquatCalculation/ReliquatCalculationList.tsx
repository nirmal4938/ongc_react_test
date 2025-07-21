import Table from "@/components/table/Table";
import { FormatDate } from "@/helpers/Utils";
import { IReliquatVersionCalculationData } from "@/interface/reliquatVersion/reliquatVersion";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { activeEmployeeSelector } from "@/redux/slices/employeeSlice";
import { GetAllReliquatCalculations } from "@/services/reliquatCalculationService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ApprovedIcon } from "@/components/svgIcons";
import { usePermission } from "@/context/PermissionProvider";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import moment from "moment";

const ReliquatCalculationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCheckEmployee, getPermissions } = usePermission();
  const activeClient = useSelector(activeClientSelector);
  const activeEmployee = useSelector(activeEmployeeSelector);
  const [loader, setLoader] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSorting] = useState<string>("startDate");
  const [sortType, setSortingType] = useState<boolean>(true);
  const [reliquatCalculationsData, setReliquatCalculationsData] = useState<{
    data: IReliquatVersionCalculationData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  const queryString = `?clientId=${activeClient}&employeeId=${
    activeEmployee ?? ""
  }&sort=${sortType ? "desc" : "asc"}&sortBy=${sort}`;

  useEffect(() => {
    if (activeClient && activeEmployee) {
      fetchAllReliquatCalculations(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, activeClient, activeEmployee, sort, sortType]);

  async function fetchAllReliquatCalculations(query: string) {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllReliquatCalculations(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setReliquatCalculationsData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    setLoader(false);
    dispatch(hideLoader());
  }

  const columnData = [
    {
      header: "Date",
      name: "date",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: {
        startDate: string;
        endDate: string;
        employee?: {
          segment: { name: string; id: string };
          subSegment: { name: string; id: string };
          loginUserData: { firstName: string; lastName: string };
        };
      }) => {
        const handleCellClick = () => {
          navigate(`/timesheet/update`, {
            state: {
              startDate: FormatDate(props.startDate),
              endDate: FormatDate(props.endDate),
              type:
                props?.employee?.subSegment === null ? "segment" : "subSegment",
              value:
                props?.employee?.subSegment === null
                  ? props?.employee?.segment?.id
                  : props?.employee?.subSegment?.id,
              search:
                props?.employee?.loginUserData?.firstName +
                " " +
                props?.employee?.loginUserData?.lastName,
            },
          });
        };
        return (
          <div
            onClick={handleCellClick}
            className="text-sm/18px font-medium cursor-pointer underline underline-offset-4 text-primaryRed"
          >
            {FormatDate(props.startDate)}
            &nbsp;&nbsp;{"-"}&nbsp;&nbsp;
            {FormatDate(props.endDate)}
          </div>
        );
      },
    },

    {
      header: "Segment",
      name: "",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: {
        startDate: string;
        endDate: string;
        employee: {
          employeeSegment: Array<{
            date: string;
            segment?: { name: string };
            subSegment?: { name: string };
          }>;
          segment?: { name: string };
          subSegment?: { name: string };
        };
      }) => {
        const sortedData = props.employee.employeeSegment.toSorted(
          (
            a: {
              date: string;
              segment?: { name: string };
              subSegment?: { name: string };
            },
            b: {
              date: string;
              segment?: { name: string };
              subSegment?: { name: string };
            }
          ) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
        );
        const data = sortedData.find(
          (e) =>
            moment(e.date).isBetween(props.startDate, props.endDate) ||
            moment(e.date).isSameOrBefore(props.startDate)
        );
        return data?.segment
          ? `${data?.segment?.name} ${
              data?.subSegment ? `-${data?.subSegment?.name}` : ""
            }`
          : data?.subSegment
          ? data?.subSegment?.name
          : "-";
      },
    },
    {
      header: "Employee",
      name: "",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: {
        employee: {
          contractEndDate?: Date;
          employeeNumber: string;
          slug: string;
          loginUserData: { firstName: string; lastName: string };
        };
      }) => {
        const handleCellClick = () => {
          getPermissions(FeaturesNameEnum.Employee, PermissionEnum.View) &&
            navigate(`/employee/summary/profile/${props?.employee?.slug}`);
        };

        return (
          <div
            onClick={handleCellClick}
            className={`text-sm/18px font-medium cursor-pointer underline underline-offset-4 ${
              moment(props?.employee?.contractEndDate)?.isBefore(moment())
                ? "text-red"
                : "text-primaryRed"
            } `}
          >
            {`${props.employee.employeeNumber} ${props.employee.loginUserData.lastName} ${props.employee.loginUserData.firstName}`}
          </div>
        );
      },
    },
    {
      header: "Calculations",
      name: "calculateEquation",
      className: "!min-w-[160px]",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { calculateEquation: string }) => {
        const fractionRegex = /(\d+)\/(\d+)/g;
        return (
          props.calculateEquation.replace(
            fractionRegex,
            (_, numerator, denominator) => `${denominator}/${numerator}`
          ) ?? "-"
        );
      },
    },

    {
      header: "Worked",
      name: "totalWorked",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { totalWorked: number }) => {
        return props.totalWorked ?? 0;
      },
    },
    {
      header: "Earned",
      name: "earned",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { earned: number }) => {
        return props.earned ?? 0;
      },
    },
    {
      header: "Taken",
      name: "totalTakenLeave",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { totalTakenLeave: number }) => {
        return props.totalTakenLeave ?? 0;
      },
    },
    {
      header: "Present",
      name: "presentDay",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { presentDay: number }) => {
        return props.presentDay ?? 0;
      },
    },
    {
      header: "Congé Récupèration",
      name: "leave",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { leave: number }) => {
        return props.leave ?? 0;
      },
    },
    {
      header: "Congé Annuel",
      name: "annualLeave",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { annualLeave: number }) => {
        return props.annualLeave ?? 0;
      },
    },
    {
      header: "Weekend Overtime",
      name: "weekendBonus",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { weekendBonus: number }) => {
        return props.weekendBonus ?? 0;
      },
    },
    {
      header: "Overtime",
      name: "overtimeBonus",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { overtimeBonus: number }) => {
        return props.overtimeBonus ?? 0;
      },
    },
    {
      header: "Reliquat",
      name: "reliquat",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { reliquat: number }) => {
        return props.reliquat ?? 0;
      },
    },
    {
      header: "Status",
      name: "status",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { timesheet: { id: number; status: string } }) => {
        return (
          <>
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-block w-5 h-5 rounded-full border-2 border-solid border-black ${
                  props?.timesheet?.status === "APPROVED"
                    ? "bg-black p-0.5"
                    : ""
                }`}
              >
                {props?.timesheet?.status === "APPROVED" ? (
                  <ApprovedIcon className="w-full h-full stroke-white" />
                ) : (
                  ""
                )}
              </span>
            </div>
          </>
        );
      },
    },

    {
      header: "Reliquat Payment",
      name: "reliquatPayment",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { reliquatPaymentValue: number }) => {
        return props.reliquatPaymentValue ?? 0;
      },
    },

    {
      header: "Reliquat Adjustment",
      name: "reliquatAdjustment",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { reliquatAdjustmentValue: number }) => {
        return props.reliquatAdjustmentValue ?? 0;
      },
    },
  ];

  const handleExport = async () => {
    const response = await GetAllReliquatCalculations(
      queryString + "&view=true"
    );

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      const workbook = XLSX.utils.book_new();
      const itemValue = result?.data
        // ?.filter(
        //   (reliquatData: IReliquatVersionCalculationData) =>
        //     reliquatData?.timesheet?.status === "APPROVED"
        // )
        ?.map((item: IReliquatVersionCalculationData) => {
          const calculationData = /(\d+)\/(\d+)/g;

          const finalCalculation =
            item.calculateEquation.replace(
              calculationData,
              (_, numerator, denominator) => `${denominator}/${numerator}`
            ) ?? "-";

          const newObj = {
            Date: `${FormatDate(item.startDate)}   -   ${FormatDate(
              item.endDate
            )}`,
            Segment: `${
              item?.employee?.segment
                ? `${item?.employee?.segment?.name} ${
                    item?.employee?.subSegment
                      ? `-${item?.employee?.subSegment?.name}`
                      : ""
                  }`
                : item?.employee?.subSegment
                ? item?.employee?.subSegment?.name
                : "-"
            }`,
            Employee: `${item.employee.employeeNumber} ${item.employee.loginUserData.lastName} ${item.employee.loginUserData.firstName}`,
            Calculations: finalCalculation,
            Worked: item.totalWorked,
            Earned: item.earned,
            Taken: item.totalTakenLeave,
            Present: item.presentDay,
            Conge_Recuperation: item.leave,
            Conge_Annuel: item.annualLeave,
            Weekend_Overtime: item.weekendBonus,
            Overtime: item.overtimeBonus,
            Reliquat: item.reliquat,
            "Reliquat Payment": item.reliquatPaymentValue,
            "Reliquat Adjustment": item.reliquatAdjustmentValue,
            IsApprove: item?.timesheet?.status || false,
          };
          return newObj;
        });
      const worksheet = XLSX.utils.json_to_sheet(itemValue);
      worksheet["!cols"] = [
        { width: 25 },
        { width: 26 },
        { width: 30 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 20 },
        { width: 20 },
        { width: 12 },
        { width: 14 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
      ];
      worksheet["!rows"] = [];
      worksheet["!rows"][0] = { hpt: 30 };
      Object?.keys(worksheet)
        ?.filter((e) => e?.length === 2 && e?.endsWith("1"))
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
      saveAs(blob, "Master_Reliquat_List.xlsx");
    }
  };

  return (
    <>
      <Table
        tableClass="!min-w-[1400px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={reliquatCalculationsData.data}
        isTerminatatedEmployee={true}
        isEmployeeDropdown={!isCheckEmployee}
        isButton={getPermissions(
          FeaturesNameEnum.ReliquatCalculation,
          PermissionEnum.View
        )}
        buttonText="Export to Excel"
        buttonClick={handleExport}
        loader={activeEmployee !== 0 && loader}
        pagination={true}
        dataPerPage={limit}
        setLimit={setLimit}
        totalPage={reliquatCalculationsData.totalPage}
        dataCount={reliquatCalculationsData.totalCount}
        isClientDropdown={false}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
      />
    </>
  );
};

export default ReliquatCalculationList;
