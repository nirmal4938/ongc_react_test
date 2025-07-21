import Table from "@/components/table/Table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeEmployeeSelector } from "@/redux/slices/employeeSlice";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { IReliquatCalculationV2Data } from "@/interface/reliquatCalculationV2/ReliquatCalculationV2Interface";
import { GetAllReliquatCalculationsV2 } from "@/services/reliquatCalculationService";
import * as XLSX from "xlsx-js-style";
import { FormatDate, setDefaultWithZero } from "@/helpers/Utils";
import { saveAs } from "file-saver";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { useNavigate } from "react-router-dom";

const ReliquatCalculationV2List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCheckEmployee, getPermissions } = usePermission();
  const [limit, setLimit] = useState<number>(10);
  const activeClient = useSelector(activeClientSelector);
  const [loader, setLoader] = useState<boolean>(false);
  const activeEmployee = useSelector(activeEmployeeSelector);
  const [sort, setSorting] = useState<string>("");
  const [sortType, setSortingType] = useState<boolean>(true);
  const [reliquatCalculationV2Data, setReliquatCalculationV2Data] = useState<{
    data: IReliquatCalculationV2Data[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  useEffect(() => {
    if (activeClient && activeEmployee)
      fetchReliquatCalculationV2(Number(activeClient), activeEmployee);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, activeClient, activeEmployee, sort, sortType]);

  async function fetchReliquatCalculationV2(
    clientId: number,
    employeeId: number
  ) {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllReliquatCalculationsV2(
      `?employeeId=${employeeId}&clientId=${clientId}&sort=${
        sortType ? "asc" : "desc"
      }&sortBy=${sort}`
    );

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setReliquatCalculationV2Data(result);
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const columnData = [
    {
      header: "Date",
      name: "date",
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
      option: {
        sort: false,
      },
    },
    {
      header: "Segment",
      name: "segment",
      cell: (props: { segmentName: string }) => props.segmentName,
      option: {
        sort: false,
      },
    },
    {
      header: "Rotation",
      name: "rotation",
      cell: (props: { rotationName: string }) => {
        return props.rotationName.split('').reverse().join('');
      },
      option: {
        sort: false,
      },
    },
    {
      header: "Worked",
      name: "presentDay",
      cell: (props: { presentDay: number }) => props.presentDay,
      option: {
        sort: true,
      },
    },
    {
      header: "Earned",
      name: "earned",
      cell: (props: { earned: number }) => props.earned,
      option: {
        sort: true,
      },
    },
    {
      header: "Reliquat Payment",
      name: "reliquatPayment",
      cell: (props: { reliquatPayment: number }) => props.reliquatPayment,
      option: {
        sort: true,
      },
    },
    {
      header: "Taken",
      name: "taken",
      cell: (props: { taken: number }) => props.taken,
      option: {
        sort: true,
      },
    },
    {
      header: "Earned - Taken",
      name: "earnedTaken",
      cell: (props: { earnedTaken: number }) => props.earnedTaken,
      option: {
        sort: true,
      },
    },
    {
      header: "Overtime",
      name: "overtime",
      cell: (props: { overtime: number }) => props.overtime,
      option: {
        sort: true,
      },
    },
    {
      header: "Weekend Overtime",
      name: "weekend",
      cell: (props: { weekend: number }) => props.weekend,
      option: {
        sort: true,
      },
    },
    {
      header: "Adjustment",
      name: "adjustment",
      cell: (props: { adjustment: number }) => props.adjustment,
      option: {
        sort: true,
      },
    },
    {
      header: "Reliquat",
      name: "reliquatValue",
      cell: (props: { reliquatValue: number }) =>
        props.reliquatValue.toFixed(2),
      className: "",
      option: {
        sort: false,
      },
    },
  ];

  const handleExport = async () => {
    if (activeClient && activeEmployee) {
      const response = await GetAllReliquatCalculationsV2(
        `?employeeId=${activeEmployee}&clientId=${activeClient}`
      );

      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        const workbook = XLSX.utils.book_new();
        let length = result?.data?.length;
        const itemValue = result?.data?.map(
          (item: IReliquatCalculationV2Data) => {
            const newObj = {
              "#": length--,
              Date: `${FormatDate(item.startDate)}   -   ${FormatDate(
                item.endDate
              )}`,
              Segment: `${item.employee?.segment?.name}${
                item.employee?.subSegment
                  ? " - " + item.employee?.subSegment?.name
                  : ""
              }`,
              Rotation: `${item.employee?.rotation?.weekOff} / ${item.employee?.rotation?.weekOn}`,
              Worked: setDefaultWithZero(item.presentDay),
              Earned: setDefaultWithZero(item.earned),
              ReliquatPayment: setDefaultWithZero(item.reliquatPayment),
              Taken: setDefaultWithZero(item.taken),
              "Earned - Taken": setDefaultWithZero(item.earnedTaken),
              Overtime: setDefaultWithZero(item.overTime),
              "Weekend Overtime": setDefaultWithZero(item.weekendOvertime),
              Adjustment: setDefaultWithZero(item.adjustment),
              Reliquat: item.reliquatValue,
            };
            return newObj;
          }
        );
        const worksheet = XLSX.utils.json_to_sheet(itemValue);
        worksheet["!cols"] = [
          { width: 12 },
          { width: 25 },
          { width: 30 },
          { width: 12 },
          { width: 12 },
          { width: 12 },
          { width: 18 },
          { width: 12 },
          { width: 18 },
          { width: 12 },
          { width: 20 },
          { width: 15 },
          { width: 12 },
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
        saveAs(blob, "Master_Reliquat_V2_List.xlsx");
      }
    }
  };

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={reliquatCalculationV2Data.data}
        isButton={getPermissions(
          FeaturesNameEnum.ReliquatCalculationV2,
          PermissionEnum.View
        )}
        buttonText="Export to Excel"
        buttonClick={handleExport}
        loader={loader}
        pagination={true}
        dataPerPage={limit}
        setLimit={setLimit}
        totalPage={reliquatCalculationV2Data.totalPage}
        dataCount={reliquatCalculationV2Data.totalCount}
        isClientDropdown={false}
        isEmployeeDropdown={!isCheckEmployee}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
      />
    </>
  );
};

export default ReliquatCalculationV2List;
