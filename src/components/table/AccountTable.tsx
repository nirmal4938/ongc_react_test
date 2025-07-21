import { useEffect, useState } from "react";
import { CloudDownIocn, DownTriangleIcon, IconList } from "../svgIcons";
import SpinLoader from "../SiteLoder/spinLoader";
import { AccountPO } from "@/utils/commonConstants";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import Button from "../formComponents/button/Button";
import saveAs from "file-saver";

export interface IAccountTableHeaderProps {
  header: string;
  name?: string;
  className?: string;
  commonClass?: string;
  option?: { sort?: boolean };
}

interface ITableBodyData {
  segmentsData?: {
    segmentId: number | null;
    subSegmentId: number | null;
    segmentData: {
      id: number | null;
      name: string | null;
      code: string | null;
    } | null;
    subSegmentData: {
      id: number | null;
      name: string | null;
      code: string | null;
    } | null;
  }[];
  accountPODetails: {
    id?: number;
    segmentId?: number | null;
    subSegmentId?: number | null;
    segmentData: {
      id: number | null;
      name?: string | null;
      code?: string | null;
    } | null;
    subSegmentData: {
      id: number | null;
      name?: string | null;
      code?: string | null;
    } | null;
    type?: string;
    total?: number;
    managerData?: string[];
    poNumber?: string;
    dailyRate?: number;
    isPaid?: boolean;
    timesheetQty?: number;
    timesheet?: {
      id: number;
      startDate: string;
      endDate: string;
      employee: {
        id: number;
        employeeNumber: string;
        fonction: string;
        loginUserData: {
          firstName: string;
          lastName: string;
        };
      };
    };
    invoiceNo?: string;
    medicalTotal?: number;
    managers?: string | null;
  }[];
  activeDateDropdown?: {
    position: string;
    startDate: string | Date;
    endDate: string | Date;
  };
  managerNames?: string[];
}

interface AccountPODetail {
  id?: number;
  segmentId?: number | null;
  subSegmentId?: number | null;
  segmentData: {
    id: number | null;
    name?: string | null;
    code?: string | null;
  } | null;
  subSegmentData: {
    id: number | null;
    name?: string | null;
    code?: string | null;
  } | null;
  type?: string;
  total?: number;
  managerData?: string[];
  poNumber?: string;
  dailyRate?: number;
  isPaid?: boolean;
  timesheetQty?: number;
  timesheet?: {
    id: number;
    startDate: string;
    endDate: string;
    employee: {
      id: number;
      employeeNumber: string;
      fonction: string;
      loginUserData: {
        firstName: string;
        lastName: string;
      };
      employeeCatalogueNumber?: {
        catalogueNumber: string | null;
      };
    };
  };
  invoiceNo?: string;
  medicalTotal?: number;
  managers?: string | null;
  position?: string | null;
  catalogueNumber?: string | null;
}

interface exportData {
  // isHeader?: boolean;
  marticule?: string | null;
  poNumber?: string | null;
  segmentName?: string | null;
  surname?: string;
  forename?: string;
  manager?: string;
  position?: string;
  catalogueNumber?: string;
  segment?: string | null;
  subSegment?: string;
  type?: string;
  dailyRate?: number | string | null;
  timesheetQty?: number | string | null;
  subTotal?: number | string;
}

interface AccountPoTableProp {
  headerData: IAccountTableHeaderProps[];
  bodyData?: ITableBodyData;
  loader?: boolean;
  type?: string;
  checked: number[];
  setChecked: (value: number[]) => void;
  isExport?: boolean;
}
export const AccountTable = (props: AccountPoTableProp) => {
  // const { getPermissions } = usePermission();
  const [tableHeaderData, setTableHeaderData] = useState<
    IAccountTableHeaderProps[]
  >([]);
  const [tableBodyData, setTablebodyData] = useState<ITableBodyData>();
  const [activePointer, setActivePointer] = useState<{
    [key: string]: boolean;
  }>();
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const navigate = useNavigate();

  // const base64toBlob = (base64Data: string) => {
  //   const sliceSize = 1024;
  //   const byteCharacters = atob(base64Data);
  //   const bytesLength = byteCharacters.length;
  //   const slicesCount = Math.ceil(bytesLength / sliceSize);
  //   const byteArrays = new Array(slicesCount);

  //   for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
  //     const begin = sliceIndex * sliceSize;
  //     const end = Math.min(begin + sliceSize, bytesLength);

  //     const bytes = new Array(end - begin);
  //     for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
  //       bytes[i] = byteCharacters[offset].charCodeAt(0);
  //     }
  //     byteArrays[sliceIndex] = new Uint8Array(bytes);
  //   }
  //   return new Blob(byteArrays, { type: "application/pdf" });
  // };

  useEffect(() => {
    if (props.headerData) {
      setTableHeaderData(props.headerData);
    }
  }, [props.headerData]);
  useEffect(() => {
    if (props.bodyData) {
      setTablebodyData(props.bodyData);
    }
  }, [props.bodyData]);
  useEffect(() => {
    if (tableBodyData) {
      const generateToggle: { [key: string]: boolean } = {};
      tableBodyData?.accountPODetails.map((bodyData) => {
        const segment = bodyData?.segmentData?.id ?? -1;
        const subSegment = bodyData?.subSegmentData?.id ?? -1;
        generateToggle[`${segment}:${subSegment}`] = true;
      });
      setActivePointer(generateToggle);
      getGrandTotalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableBodyData]);

  // const checkedFunc = (id?: number) => {
  //   let newCheckBox: number[] = [...props?.checked];
  //   if (!id) {
  //     if (props?.checked?.length === 0) {
  //       tableBodyData?.accountPODetails?.map((poDetail) => {
  //         if (!poDetail?.isPaid && poDetail.id) {
  //           newCheckBox.push(poDetail.id);
  //         }
  //       });
  //     } else {
  //       newCheckBox = [];
  //     }
  //   } else {
  //     if (newCheckBox.includes(id)) {
  //       newCheckBox.splice(newCheckBox.indexOf(id), 1);
  //     } else {
  //       newCheckBox.push(id);
  //     }
  //   }
  //   props?.setChecked(newCheckBox);
  // };

  const getGrandTotalData = async () => {
    setGrandTotal(0);
    const subTotal =
      (tableBodyData?.accountPODetails &&
        tableBodyData.accountPODetails
          ?.reduce((accumulator, currentValue) => {
            return (
              Number(accumulator.toFixed(2)) +
              Number(
                props.type === AccountPO.OUTER
                  ? currentValue?.type != "Medical"
                    ? Number(currentValue?.total).toFixed(2)
                    : 0 ?? 0
                  : props.type === AccountPO.INNER
                  ? (currentValue?.dailyRate &&
                      currentValue?.timesheetQty &&
                      currentValue?.type != "Medical" &&
                      Number(
                        currentValue?.dailyRate * currentValue.timesheetQty
                      ).toFixed(2)) ??
                    0
                  : 0
              )
            );
          }, 0)
          .toFixed(2)) ??
      0;
    const medicalTotal =
      tableBodyData?.accountPODetails
        ?.reduce(
          (total, item) =>
            total +
            (item?.type === "Medical" && props.type == AccountPO.OUTER
              ? item.total || 0
              : item?.type === "Medical" &&
                props.type == AccountPO.INNER &&
                item.dailyRate &&
                item.timesheetQty
              ? item.dailyRate * item.timesheetQty
              : 0),
          0
        )
        .toFixed(2) ?? 0;
    const grandTotal = Number(subTotal) + Number(medicalTotal);
    setGrandTotal(grandTotal);
  };

  const renderAccountPOData = (item: AccountPODetail) => {
    if (props.type === AccountPO.OUTER) {
      return (
        <>
          <tr>
            <td>
              {item?.managers ?? "-"}
              {/* {item?.managerData &&
                          item?.managerData?.length > 0
                            ? item?.managerData?.map(
                                (names, index) => (
                                  <span className="leading-5">
                                    {index > 0 && ", "}
                                    {names}
                                  </span>
                                )
                              )
                            : "-"} */}
            </td>
            <td>{item?.position ?? "-"}</td>
            <td>{item?.catalogueNumber ?? "-"}</td>
            <td>{item?.segmentData?.name}</td>
            <td>{item?.subSegmentData?.name ?? "-"}</td>
            <td>
              {item.type?.includes(",")
                ? `${item?.type?.split(",")[1]}(HOB)`
                : item.type}
            </td>
            <td>
              {item?.dailyRate
                ?.toFixed(2)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
            </td>
            <td>{item?.timesheetQty}</td>
            <td>
              {/* {item?.type === "Medical" ? "-" : ""} */}
              {item.total?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
            </td>
            {/* <td>{item.medicalTotal?.toFixed(2)}</td>
                        <td>
                          {Number(item.total?.toFixed(2)) -
                            Number(item.medicalTotal?.toFixed(2))}
                        </td> */}
            <td></td>
          </tr>
        </>
      );
    } else if (props.type === AccountPO.INNER) {
      return (
        <>
          <tr>
            {/* {getPermissions(
                          FeaturesNameEnum.Salary,
                          PermissionEnum.View
                        ) && (
                          <td>
                            {item?.isPaid === false ? (
                              <input
                                type="checkbox"
                                value={item?.id}
                                onChange={() =>
                                  checkedFunc(item?.id)
                                }
                                checked={
                                  props?.checked.length > 0 &&
                                  props?.checked.includes(
                                    item?.id ?? 0
                                  )
                                }
                              />
                            ) : (
                              <CheckIcon />
                            )}
                          </td>
                        )} */}
            <td className="whitespace-nowrap">
              {item?.timesheet?.employee?.employeeNumber}
            </td>
            <td className="whitespace-nowrap">{item?.poNumber}</td>
            <td className="whitespace-nowrap">
              {item?.timesheet?.employee?.loginUserData?.lastName}
            </td>
            <td className="whitespace-nowrap">
              {item?.timesheet?.employee?.loginUserData?.firstName}
            </td>
            <td className="whitespace-nowrap">
              {item?.managers ?? "-"}
              {/* {tableBodyData?.managerNames &&
                          tableBodyData?.managerNames?.length > 0
                            ? tableBodyData?.managerNames?.map(
                                (names) => (
                                  <span className="block leading-5">
                                    {names}
                                  </span>
                                )
                              )
                            : "-"} */}
            </td>
            <td className="whitespace-nowrap">
              {item?.timesheet?.employee?.fonction}
            </td>
            <td className="whitespace-nowrap">
              {item?.timesheet?.employee?.employeeCatalogueNumber
                ?.catalogueNumber ?? "-"}
            </td>
            {/* <td className="whitespace-nowrap">-</td> */}
            <td className="whitespace-nowrap">
              {item?.segmentData?.name ?? "-"}
            </td>
            <td className="whitespace-nowrap">
              {item?.subSegmentData?.name ?? "-"}
            </td>
            <td className="whitespace-nowrap">
              {item?.type?.includes(",")
                ? `${item?.type?.split(",")[1]}(HOB)`
                : item?.type}
            </td>
            <td className="whitespace-nowrap">
              {item?.dailyRate
                ?.toFixed(2)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
            </td>
            <td className="whitespace-nowrap">{item?.timesheetQty}</td>
            <td className="whitespace-nowrap">
              {/* {item?.type === "Medical" ? "-" : ""} */}
              {item?.dailyRate && item.timesheetQty
                ? Number(item?.dailyRate * item?.timesheetQty)
                    ?.toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : 0}
            </td>
            {/* <td className="whitespace-nowrap">
                          {item?.medicalTotal || 0}
                        </td>
                        <td className="whitespace-nowrap">
                          {Number(
                            item?.dailyRate && item.timesheetQty
                              ? Number(
                                  item?.dailyRate *
                                    item?.timesheetQty
                                )?.toFixed(2)
                              : 0
                          ) - (item?.medicalTotal || 0)}
                        </td> */}
            {/* {getPermissions(
                          FeaturesNameEnum.Salary,
                          PermissionEnum.View
                        ) && (
                          <td>
                            <PDFDownloadButton
                              onClickHandler={async () => {
                                if (item?.timesheet?.employee?.id) {
                                  const resp =
                                    await generateInvoice(
                                      item?.timesheet?.employee?.id,
                                      {
                                        invoiceItems: [
                                          {
                                            description: item?.type,
                                            taxType: "NONE",
                                            quantity:
                                              item?.timesheetQty,
                                            unitAmount:
                                              item?.dailyRate,
                                            accountCode: "400",
                                          },
                                        ],
                                        approveDate: moment().format('DD/MM/YYYY'),
                                        poId: item?.id,
                                        invoiceNumber: item?.invoiceNo
                                      }
                                    );
                                  const blob = base64toBlob(
                                    resp?.data?.responseData
                                  );
                                  saveAs(blob, `${item?.timesheet?.employee?.loginUserData?.firstName}_${item?.timesheet?.employee?.loginUserData?.lastName}'s_invoice.pdf`);
                                }
                              }}
                            />
                          </td>
                        )} */}
          </tr>
        </>
      );
    }
  };

  const renderAccountPOBody = () => (
    <>
      {tableBodyData?.segmentsData?.map((item) => {
        const segmentId = item?.segmentId ?? -1;
        const segmentName = item?.segmentData?.name ?? null;
        const subSegmentId = item?.subSegmentId ?? -1;
        const subSegmentName = item?.subSegmentData?.name ?? null;
        const segmentCode = item?.segmentData?.code ?? "";
        const subSegmentCode = item?.subSegmentData?.code ?? "";
        const startDate = tableBodyData?.activeDateDropdown?.startDate ?? "";
        const endDate = tableBodyData?.activeDateDropdown?.endDate ?? "";
        const subTotal = tableBodyData?.accountPODetails
          ?.filter(
            (filteredData) =>
              (filteredData?.segmentData?.id ?? -1) === segmentId &&
              (filteredData?.subSegmentData?.id ?? -1) === subSegmentId
          )
          ?.reduce((accumulator, currentValue) => {
            return (
              Number(accumulator.toFixed(2)) +
              Number(
                props.type === AccountPO.OUTER
                  ? currentValue?.type != "Medical"
                    ? Number(currentValue?.total).toFixed(2)
                    : 0 ?? 0
                  : props.type === AccountPO.INNER
                  ? (currentValue?.dailyRate &&
                      currentValue?.timesheetQty &&
                      currentValue?.type != "Medical" &&
                      Number(
                        currentValue?.dailyRate * currentValue.timesheetQty
                      ).toFixed(2)) ??
                    0
                  : 0
              )
            );
          }, 0)
          .toFixed(2);
        const medicalTotal = tableBodyData?.accountPODetails
          ?.filter(
            (filteredData) =>
              (filteredData?.segmentData?.id ?? -1) === segmentId &&
              (filteredData?.subSegmentData?.id ?? -1) === subSegmentId
          )
          .reduce(
            (total, item) =>
              total +
              (item?.type === "Medical" && props.type == AccountPO.OUTER
                ? item.total || 0
                : item?.type === "Medical" &&
                  props.type == AccountPO.INNER &&
                  item.dailyRate
                ? item.dailyRate
                : 0),
            0
          )
          .toFixed(2);
        return (
          <>
            <tr>
              <td
                colSpan={tableHeaderData.length + 1}
                className="!px-0 !py-1 !bg-offWhite !border-none"
              ></td>
            </tr>
            <tr>
              <>
                {/* {AccountPO.INNER === props.type &&
                              getPermissions(
                                FeaturesNameEnum.Salary,
                                PermissionEnum.View
                              ) && (
                                <td className="!py-2 px-2 font-medium text-sm/18px  !border-none">
                                  {tableBodyData?.accountPODetails?.findIndex(
                                    (status) => status.isPaid === false
                                  ) >= 0 ? (
                                    <input
                                      type="checkbox"
                                      onChange={() => checkedFunc()}
                                      checked={
                                        props?.checked.length > 0 &&
                                        props?.checked.length ===
                                          props?.bodyData?.accountPODetails.filter(
                                            (e) => {
                                              return e.isPaid === false;
                                            }
                                          ).length
                                      }
                                    />
                                  ) : (
                                    <CheckIcon />
                                  )}
                                </td>
                              )} */}
                <td
                  key={segmentId}
                  colSpan={tableHeaderData.length}
                  className="!py-2 px-2 font-medium text-sm/18px  !border-none"
                >
                  <span
                    className="flex items-center"
                    onClick={() => {
                      if (activePointer) {
                        const newStatus = { ...activePointer };
                        newStatus[`${segmentId}:${subSegmentId}`] =
                          !activePointer[`${segmentId}:${subSegmentId}`];
                        setActivePointer(newStatus);
                      }
                    }}
                  >
                    <DownTriangleIcon
                      className={`w-4 h-4 inline-block mr-2 -rotate-90 ${
                        activePointer &&
                        activePointer[`${segmentId}:${subSegmentId}`]
                          ? "rotate-0"
                          : ""
                      } `}
                    />
                    <span className="inline-block font-extrabold">
                      {subSegmentName && subSegmentId
                        ? `${segmentName}-${subSegmentName}`
                        : segmentName === null &&
                          subSegmentName === null &&
                          segmentId === -1 &&
                          subSegmentId === -1
                        ? "Global"
                        : segmentName}
                    </span>
                  </span>
                </td>

                {props.type === AccountPO.OUTER && (
                  <td className="!py-2 px-2  text-center !border-none">
                    <span
                      className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                      onClick={() => {
                        navigate(
                          `/accounts/PO/Details?segment=${encodeURIComponent(
                            segmentCode
                          )}&subSegment=${subSegmentCode}&startDate=${startDate}&endDate=${endDate}`
                        );
                      }}
                    >
                      <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                        Go to Details
                      </span>
                      <IconList className="w-ful h-full pointer-events-none fill-black" />
                    </span>
                  </td>
                )}
              </>
            </tr>
            {tableBodyData?.accountPODetails
              ?.filter((filteredData) => {
                return (
                  (filteredData?.segmentData?.id ?? -1) === segmentId &&
                  (filteredData?.subSegmentData?.id ?? -1) === subSegmentId
                );
              })
              .map((poData) => {
                return (
                  activePointer &&
                  activePointer[
                    `${poData?.segmentData?.id ?? -1}:${
                      poData?.subSegmentData?.id ?? -1
                    }`
                  ] &&
                  renderAccountPOData(poData)
                );
              })}
            {props.type === AccountPO.OUTER &&
            activePointer &&
            activePointer[`${segmentId}:${subSegmentId}`] ? (
              <tr className="bg-[#e8dcdeea]">
                <td>
                  <span className="text-primaryRed">Total</span>
                </td>
                <td
                  colSpan={
                    // props.type === AccountPO.INNER &&
                    // getPermissions(
                    //   FeaturesNameEnum.Salary,
                    //   PermissionEnum.View
                    // )
                    //   ? tableHeaderData.length - 2
                    // :
                    tableHeaderData.length - 2
                  }
                ></td>
                <td>
                  <span className="text-primaryRed">
                    {(Number(subTotal) + Number(medicalTotal))
                      .toFixed(2)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                  </span>
                </td>
                {/* <>
                              <td>
                                <span className="text-primaryRed">
                                  {medicalTotal}
                                </span>
                              </td>
                              <td>
                                <span className="text-primaryRed">
                                  {Number(subTotal) - Number(medicalTotal)}
                                </span>
                              </td>
                            </> */}

                {props.type === AccountPO.OUTER && <td></td>}
              </tr>
            ) : null}
          </>
        );
      })}
    </>
  );

  const getExportData = async () => {
    const exportDataArr: exportData[] = [];
    if (tableBodyData?.segmentsData) {
      for (const item of tableBodyData?.segmentsData) {
        const segmentId = item?.segmentId ?? -1;
        const segmentName = item?.segmentData?.name ?? null;
        const subSegmentId = item?.subSegmentId ?? -1;
        const subSegmentName = item?.subSegmentData?.name ?? null;
        // const segmentCode = item?.segmentData?.code ?? "";
        // const subSegmentCode = item?.subSegmentData?.code ?? "";
        // const startDate = tableBodyData?.activeDateDropdown?.startDate ?? "";
        // const endDate = tableBodyData?.activeDateDropdown?.endDate ?? "";
        const subTotal = tableBodyData?.accountPODetails
          ?.filter(
            (filteredData) =>
              (filteredData?.segmentData?.id ?? -1) === segmentId &&
              (filteredData?.subSegmentData?.id ?? -1) === subSegmentId
          )
          ?.reduce((accumulator, currentValue) => {
            return (
              Number(accumulator.toFixed(2)) +
              Number(
                props.type === AccountPO.OUTER
                  ? currentValue?.type != "Medical"
                    ? Number(currentValue?.total).toFixed(2)
                    : 0 ?? 0
                  : props.type === AccountPO.INNER
                  ? (currentValue?.dailyRate &&
                      currentValue?.timesheetQty &&
                      currentValue?.type != "Medical" &&
                      Number(
                        currentValue?.dailyRate * currentValue.timesheetQty
                      ).toFixed(2)) ??
                    0
                  : 0
              )
            );
          }, 0)
          .toFixed(2);
        const medicalTotal = tableBodyData?.accountPODetails
          ?.filter(
            (filteredData) =>
              (filteredData?.segmentData?.id ?? -1) === segmentId &&
              (filteredData?.subSegmentData?.id ?? -1) === subSegmentId
          )
          .reduce(
            (total, item) =>
              total +
              (item?.type === "Medical" && props.type == AccountPO.OUTER
                ? item.total || 0
                : item?.type === "Medical" &&
                  props.type == AccountPO.INNER &&
                  item.dailyRate
                ? item.dailyRate
                : 0),
            0
          )
          .toFixed(2);
        const seg_subSegName =
          subSegmentName && subSegmentId
            ? `${segmentName}-${subSegmentName}`
            : segmentName === null &&
              subSegmentName === null &&
              segmentId === -1 &&
              subSegmentId === -1
            ? "Global"
            : segmentName;
        exportDataArr?.push({ segmentName: seg_subSegName });
        tableBodyData?.accountPODetails
          ?.filter((filteredData) => {
            return (
              (filteredData?.segmentData?.id ?? -1) === segmentId &&
              (filteredData?.subSegmentData?.id ?? -1) === subSegmentId
            );
          })
          .map((item: AccountPODetail) => {
            activePointer &&
            activePointer[
              `${item?.segmentData?.id ?? -1}:${item?.subSegmentData?.id ?? -1}`
            ] &&
            props?.type === AccountPO?.OUTER
              ? exportDataArr?.push({
                  segmentName: "",
                  manager: item?.managers ?? "-",
                  position: item?.position ?? "-",
                  catalogueNumber: item?.catalogueNumber ?? "-",
                  segment: item?.segmentData?.name,
                  subSegment: item?.subSegmentData?.name ?? "-",
                  type: item.type?.includes(",")
                    ? `${item?.type?.split(",")[1]}(HOB)`
                    : item.type,
                  dailyRate: item?.dailyRate
                    ?.toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                  timesheetQty: item?.timesheetQty,
                  subTotal: `${item.total
                    ?.toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`,
                  // subTotal: `${item?.type === "Medical" ? "-" : ""} ${item.total
                  //   ?.toFixed(2)
                  //   .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`,
                })
              : exportDataArr?.push({
                  segmentName: "",
                  marticule: item?.timesheet?.employee?.employeeNumber ?? "-",
                  poNumber: item?.poNumber ?? "-",
                  surname:
                    item?.timesheet?.employee?.loginUserData?.lastName ?? "-",
                  forename:
                    item?.timesheet?.employee?.loginUserData?.firstName ?? "-",
                  manager: item?.managers ?? "-",
                  position: item?.timesheet?.employee?.fonction ?? "-",
                  catalogueNumber:
                    item?.timesheet?.employee?.employeeCatalogueNumber
                      ?.catalogueNumber ?? "-",
                  segment: item?.segmentData?.name,
                  subSegment: item?.subSegmentData?.name ?? "-",
                  type: item.type?.includes(",")
                    ? `${item?.type?.split(",")[1]}(HOB)`
                    : item.type,
                  dailyRate: item?.dailyRate
                    ?.toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                  timesheetQty: item?.timesheetQty,
                  subTotal: `${
                    item?.dailyRate && item.timesheetQty
                      ? Number(item?.dailyRate * item?.timesheetQty)
                          ?.toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : 0
                  }`,
                  // subTotal: `${item?.type === "Medical" ? "-" : ""} ${item.total
                  //   ?.toFixed(2)
                  //   .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`,
                });
          });
        exportDataArr?.push({
          segmentName: `Total  ${(Number(subTotal) + Number(medicalTotal))
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            ?.toString()}`,
        });

        exportDataArr?.push({ segmentName: " " });
      }

      props?.type === AccountPO?.OUTER &&
        exportDataArr?.push({
          segmentName: `Grand Total  ${
            Number(grandTotal)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0
          }`,
        });
    }
    return exportDataArr;
  };

  const handleExport = async () => {
    const jsonData = await getExportData();

    const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("New Sheet");

    if (props?.type === AccountPO?.OUTER) {
      worksheet.columns = [
        {
          header: "Segment Name",
          key: "segmentName",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 18,
        },
        {
          header: "Manager",
          key: "manager",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Position",
          key: "position",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 25,
        },
        {
          header: "Catalogue Number",
          key: "catalogueNumber",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Segment",
          key: "segment",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 30,
        },
        {
          header: "SubSegment",
          key: "subSegment",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Type",
          key: "type",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Daily Rate",
          key: "dailyRate",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Timesheet Qty.",
          key: "timesheetQty",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Sub Total",
          key: "subTotal",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
      ];
    } else {
      worksheet.columns = [
        {
          header: "Segment Name",
          key: "segmentName",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 18,
        },
        {
          header: "Marticule",
          key: "marticule",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "PO Number",
          key: "poNumber",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Surname",
          key: "surname",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Forename",
          key: "forename",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Manager",
          key: "manager",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Position",
          key: "position",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 25,
        },
        {
          header: "Catalogue Number",
          key: "catalogueNumber",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Segment",
          key: "segment",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 30,
        },
        {
          header: "SubSegment",
          key: "subSegment",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Type",
          key: "type",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Daily Rate",
          key: "dailyRate",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Timesheet Qty.",
          key: "timesheetQty",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Sub Total",
          key: "subTotal",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
      ];
    }

    const numColumns = worksheet.columnCount;

    worksheet.addRows(jsonData);
    const getSegmentColumn = worksheet.getColumn("segmentName");
    getSegmentColumn.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffe3d6d6" },
      };
    });
    worksheet.getColumn("segmentName").font = {
      color: { argb: "ff6b070d" },
      bold: true,
    };
    worksheet.getRow(1).height = 30;
    worksheet.getRow(1).font = {
      color: { argb: "ffffffff" },
      size: 12,
      bold: true,
    };
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ff560504" },
      };
    });
    worksheet.eachRow({ includeEmpty: true }, function (row) {
      let maxHeight = 20;
      row.eachCell({ includeEmpty: true }, function (cell) {
        const cellHeight = cell.value
          ? Math.ceil(cell.value.toString().length / 12) * 12
          : 0;
        maxHeight = Math.max(maxHeight, cellHeight);
      });
      row.height = maxHeight;
    });
    jsonData.forEach(async (row, rowIndex) => {
      worksheet.getRow(rowIndex + 2).alignment = {
        vertical: "middle",
      };
      worksheet.getRow(rowIndex + 2).alignment = {
        wrapText: true,
        vertical: "middle",
      };
      if (Object.keys(row)?.length < 2 || Object.keys(row)?.length === 0) {
        worksheet.getRow(rowIndex + 2).height = 20;
        worksheet.mergeCells(rowIndex + 2, 1, rowIndex + 2, numColumns);

        if (
          Object.values(row)[0]?.startsWith("Total") ||
          Object.values(row)[0]?.startsWith("Grand Total")
        ) {
          worksheet.getRow(rowIndex + 2).alignment = {
            horizontal: "right",
            vertical: "middle",
          };
        }
      }
    });

    const updatedExcelBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([updatedExcelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Account_PO_List.xlsx");
  };

  return (
    <div className="main-table mt-5">
      <>
        {props?.isExport && (
          <Button
            variant={"primary"}
            parentClass="w-fit ml-auto"
            icon={<CloudDownIocn className="w-4 h-4" />}
            className="mb-5 w-fit"
            onClickHandler={handleExport}
          >
            Export to Excel
          </Button>
        )}
        <div className="table-wrapper overflow-auto max-h-[calc(100dvh_-_190px)]">
          <table className="w-full ">
            <thead className="sticky top-0 z-2">
              <tr>
                {props.type === AccountPO.OUTER &&
                  tableHeaderData.map((header, index) => (
                    <th
                      className={`whitespace-nowrap !bg-[#e8dcde] 
                      ${index == 0 && "w-2/12"} 
                      
                      `}
                    >
                      {header.header}
                    </th>
                  ))}
                {props.type == AccountPO.OUTER && (
                  <th className="!bg-[#e8dcde] w-1/12">
                    <span></span>
                  </th>
                )}
                {/* {(props.type == AccountPO.OUTER ||
                  (getPermissions(
                    FeaturesNameEnum.Salary,
                    PermissionEnum.View
                  ) &&
                    props.type === AccountPO.INNER)
                    ) && 
                    (
                  <th className="!bg-[#e8dcde] w-1/12">
                    <span></span>
                  </th>
                )} */}
                {props.type === AccountPO.INNER &&
                  tableHeaderData.map((header) => (
                    <th className="whitespace-nowrap  !bg-[#e8dcde]">
                      {header.header}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="before:!hidden">
              {props.loader && (
                <>
                  <tr>
                    <td colSpan={tableHeaderData?.length + 1}>
                      <div className="relative w-full h-14 flex items-center justify-center">
                        <SpinLoader />
                      </div>
                    </td>
                  </tr>
                </>
              )}
              {(!props.loader &&
                tableBodyData?.segmentsData &&
                tableBodyData?.segmentsData?.length == 0 &&
                tableBodyData?.accountPODetails.length == 0) ||
              !tableBodyData ? (
                <tr>
                  <td className="" colSpan={tableHeaderData.length + 1}>
                    <div className="py-4 text-center  rounded-10px border mt-4 border-black/[0.08]">
                      <img
                        src={`https://cdn-icons-png.flaticon.com/512/7486/7486754.png `}
                        className="w-[100px] m-auto mb-4"
                        alt=""
                      />
                      <span className="text-black">No Data Found</span>
                    </div>
                  </td>
                </tr>
              ) : null}

              {!props.loader &&
                tableBodyData?.segmentsData &&
                renderAccountPOBody()}

              <tr className="bg-[#e8dcdeea] sticky bottom-0 z-2">
                <td>
                  <span className="text-primaryRed">Grand Total</span>
                </td>
                <td colSpan={tableHeaderData.length - 2}></td>
                <td>
                  <span className="text-primaryRed">
                    {Number(grandTotal)
                      .toFixed(2)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0}
                  </span>
                </td>
                {props.type === AccountPO.OUTER && <td></td>}
              </tr>
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
};
