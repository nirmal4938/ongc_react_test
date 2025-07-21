import moment from "moment";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import Modal from "../modal/Modal";
import Card from "../card/Card";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  boxesIntersect,
  useSelectionContainer,
} from "@air/react-drag-to-select";
import { GroupOption, Option } from "@/interface/customSelect/customSelect";
import { VITE_APP_API_URL } from "@/config";
import { ITimesheetScheduleData } from "@/interface/timesheet/timesheetScheduleInterface";
import DateComponent from "../formComponents/dateComponent/DateComponent";
import { Form, Formik, FormikErrors, FormikProps, FormikValues } from "formik";
import { TimesheetScheduleValidationSchema } from "@/validations/timesheet/TimesheetScheduleValidation";
import { UpdateTimesheetSchedule } from "@/services/timesheetScheduleService";
import { BonusIcon, CheckIcon } from "../svgIcons";
import Pagination from "../pagination/Pagination";
import { useSelector } from "react-redux";
import GroupSelectComponent from "../formComponents/customSelect/GroupSelect";
import {
  absentStatus,
  bonusStatus,
  hourlyOvertimeBonusTypes,
  leaveStatus,
  presentStatus,
} from "@/constants/CommonConstants";
import SpinLoader from "../SiteLoder/spinLoader";
import CustomBonusModel from "@/pages/timesheet/CustomBonusModel";
import { usePermission } from "@/context/PermissionProvider";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { IClientData } from "@/interface/client/clientInterface";
import { activeClientDataSelector } from "@/redux/slices/clientSlice";
import CheckBox from "../formComponents/checkbox/CheckBox";
import TextField from "../formComponents/textField/TextField";
import Radio from "../radio/Radio";
import { TimesheetHOBBonusType } from "@/interface/timesheet/timesheetInterface";
import { useNavigate } from "react-router-dom";
import { isNumber } from "lodash";

interface TimesheetTableProp {
  loader?: boolean;
  startDate?: Date | null | string;
  endDate?: Date | null | string;
  dateDetails?: {
    employeeDetails: IEmployeeData;
    totalReliquat: number;
    rows: ITimesheetScheduleData[];
    count: number;
    totalBonusCount: number;
  }[];
  selectedIndexes: number[];
  selectedEmployeeIds: number[];
  setSelectedIndexes: (value: number[]) => void;
  setSelectedEmployees: (value: number[]) => void;
  reload: () => void;
  checked: number[];
  setChecked: (value: number[]) => void;
  setLimit: (value: number) => void;
  limit: number;
  totalPage: number;
  totalCount?: number;
  optionDropdown: GroupOption[];
  activeCategory?: string;
  setGenerateModal: (value: boolean) => void;
  setGenerateModalData: (
    value: {
      percentage: number;
      type: string;
      message: string;
    } | null
  ) => void;
  currentPage?: number;
  paginationModule?: string;
}
const TimesheetTable = (props: TimesheetTableProp) => {
  const { getPermissions } = usePermission();
  const navigate = useNavigate();
  const selectableItems = useRef<
    {
      left: number;
      top: number;
      width: number;
      height: number;
      id: number;
      employeeId: number;
    }[]
  >([]);
  const elementsContainerRef = useRef<HTMLTableSectionElement | null>(null);
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [modal, setModal] = useState<boolean>(false);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [headerLength, setHeaderLength] = useState(0);
  const [bonusModal, setBonusModal] = useState<boolean>(false);
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number[]>([]);
  const [tempSelectedEmployee, setTempSelectedEmployee] = useState<number[]>(
    []
  );
  const [isCheckedHOB, setIsCheckedHOB] = useState<boolean>(false);
  const [isBonus, setIsBonus] = useState<boolean>(false);
  const [customBonusData, setCustomBonusData] = useState<{
    firstName: string;
    lastName: string;
    customBonus: string;
    currency?: string;
  }>({ firstName: "", lastName: "", customBonus: "", currency: "" });
  const [timesheetDetail, setTimesheetDetail] = useState<
    { id: number; status: string }[]
  >([]);
  const [otherHeaderFields, setOtherHeaderFields] = useState<
    { key: string; count: number[] }[]
  >([]);
  const [activeModelDetails, setActiveModelDetails] = useState<{
    employeeDetails: IEmployeeData;
    dateDetail: ITimesheetScheduleData;
  }>();
  const activeClientDataSelectorValue: IClientData | null = useSelector(
    activeClientDataSelector
  );
  // const [trHeight,setTrHeight] = useState<number>()
  const [isCallOutRotation, setIsCallOutRotation] = useState<boolean>(true);
  const [trHeights, setTrHeights] = useState<number[]>([]);
  const tableRowRef = useRef<HTMLTableRowElement[]>([]);

  const { DragSelection } = useSelectionContainer({
    onSelectionChange: (box) => {
      if (typeof window == "object") {
        const scrollAwareBox: Box = {
          ...box,
        };
        const indexesToSelect: number[] = [];
        const selectedTimesheetEmployee: number[] = [];
        selectableItems.current.forEach((item) => {
          if (boxesIntersect(scrollAwareBox, item)) {
            if (
              item?.id &&
              dragging &&
              !props.selectedIndexes.includes(Number(item.id))
            ) {
              indexesToSelect.push(Number(item.id));
            }
            if (
              (item?.employeeId &&
                dragging &&
                !props.selectedEmployeeIds.includes(Number(item.employeeId))) ||
              !selectedTimesheetEmployee.includes(Number(item.employeeId))
            ) {
              selectedTimesheetEmployee.push(Number(item.employeeId));
            }
          }
        });
        setTempSelectedEmployee([...selectedTimesheetEmployee]);
        setTempSelectedIndex([...props.selectedIndexes, ...indexesToSelect]);
      }
    },
    selectionProps: {
      style: {
        opacity: 0,
      },
    },
    isEnabled: true,
  });

  useEffect(() => {
    setIsCheckedHOB(false);
  }, [modal]);

  useEffect(() => {
    // if(tableRowRef && tableRowRef.current && tableRowRef.current.clientHeight)
    // {
    //   setTrHeight(tableRowRef.current.clientHeight + 0.5)
    // }
  }, [tableRowRef, props.dateDetails]);

  // Function to calculate and set heights
  const calculateTrHeight = () => {
    const newTrHeights: number[] = [];

    // tableRowRef.current.forEach((ref, index) => {
    tableRowRef.current.forEach((ref) => {
      if (ref && ref.clientHeight) {
        newTrHeights.push(ref.clientHeight);
      }
    });
    setTrHeights(newTrHeights);
  };

  // useEffect to recalculate heights when the component mounts or updates
  useEffect(() => {
    if (tableRowRef.current.length !== 0) {
      calculateTrHeight();
    }
  }, [tableRowRef.current.length, props.dateDetails]); // Empty dependency array ensures it runs once on mount

  useEffect(() => {
    if (props.dateDetails?.length) {
      let mapIndex: string;
      const insertObj: { [string: string]: number[] } = {};
      for (mapIndex in props.dateDetails) {
        let index: string;
        const data = props.dateDetails[mapIndex];
        for (index in data.rows) {
          if (
            data?.rows[index]?.bonusCode !== null &&
            !hourlyOvertimeBonusTypes?.includes(data?.rows[index]?.bonusCode) &&
            data?.rows[index]?.status !== "CHB"
          ) {
            const splitBonus = data?.rows[index]?.bonusCode?.split(",");
            for (const bonus of splitBonus) {
              if (insertObj[bonus]?.length > 0) {
                insertObj[bonus];
              } else {
                insertObj[bonus] = [];
                insertObj[bonus].length = props.dateDetails.length;
              }
              insertObj[bonus] = Array.from(insertObj[bonus], (item) => {
                return item || 0;
              });
              insertObj[bonus][mapIndex] = countStatus(
                data.rows,
                data?.rows[index]?.status
                  ? `${data?.rows[index]?.status},${bonus}`
                  : bonus
              );
              if (bonus == "P") {
                insertObj[bonus][mapIndex] = countStatus(
                  data.rows,
                  data?.rows[index]?.status
                    ? `${data?.rows[index]?.status},${bonus}`
                    : bonus,
                  true
                );
              }
            }
          }
          if (!["P", "CR"].includes(data.rows[index].status)) {
            if (insertObj[data.rows[index].status]?.length) {
              insertObj[data.rows[index].status][mapIndex] = countStatus(
                data.rows,
                data.rows[index].status
              );
            } else {
              insertObj[data.rows[index].status] = [];
              insertObj[data.rows[index].status].length =
                props.dateDetails.length;
              insertObj[data.rows[index].status] = Array.from(
                insertObj[data.rows[index].status],
                (item) => item || 0
              );
              insertObj[data.rows[index].status][mapIndex] = countStatus(
                data.rows,
                data.rows[index].status
              );
            }
          }
          if (
            data.rows[index].status === "P" &&
            hourlyOvertimeBonusTypes?.includes(data?.rows[index]?.bonusCode)
          ) {
            if (insertObj["CHB"]?.length) {
              insertObj["CHB"][mapIndex] = countStatus(data.rows, "CHB");
            } else {
              insertObj["CHB"] = [];
              insertObj["CHB"].length = props.dateDetails.length;
              insertObj["CHB"] = Array.from(
                insertObj["CHB"],
                (item) => item || 0
              );
              insertObj["CHB"][mapIndex] = countStatus(data.rows, "CHB");
            }
          }
        }
      }
      const otherField: { key: string; count: number[] }[] = [];
      let key: string;
      for (key in insertObj) {
        if (
          key != "TR" &&
          !absentStatus.includes(key) &&
          !bonusStatus.includes(key) &&
          key != ""
        ) {
          otherField.push({
            key: key === "CHB" ? "HOB" : key,
            count: insertObj[key],
          });
        }
      }
      if (JSON.stringify(otherField) !== JSON.stringify(otherHeaderFields)) {
        setOtherHeaderFields(otherField);
      }
    }

    const ids: { id: number; status: string }[] = [];
    let data: string;
    let emp: IEmployeeData;
    for (data in props.dateDetails) {
      if (
        props?.dateDetails &&
        props?.dateDetails[Number(data)]?.employeeDetails?.timeSheet
      ) {
        emp = props.dateDetails[Number(data)].employeeDetails;
        if (emp?.timeSheet && emp?.timeSheet?.length > 0) {
          emp?.timeSheet.forEach((empData) => {
            ids.push({
              id: Number(empData?.id),
              status: String(empData?.status),
            });
          });
        }
      }
    }
    setTimesheetDetail(ids);

    if (props?.dateDetails && props?.dateDetails?.length > 0) {
      if (
        props?.dateDetails?.some(
          (data) =>
            data?.employeeDetails?.employeeRotation &&
            data?.employeeDetails?.employeeRotation?.length > 0 &&
            data?.employeeDetails?.employeeRotation[0]?.rotation?.name !==
              "Call Out"
        )
      ) {
        setIsCallOutRotation(false);
      } else {
        setIsCallOutRotation(true);
      }
    }
  }, [props.dateDetails, props.startDate, props.endDate, otherHeaderFields]);

  const handleResize = () => {
    setTimeout(() => {
      if (elementsContainerRef.current) {
        if (elementsContainerRef.current?.rows[0]?.cells.length > 0) {
          selectableItems.current = [];
          props.setSelectedIndexes([]);
          if (elementsContainerRef.current.rows.length > 0) {
            Array.from(elementsContainerRef.current.rows).forEach((row) => {
              if (
                row.attributes.getNamedItem("data-isapproved")?.value !=
                  "APPROVED" &&
                getPermissions(
                  FeaturesNameEnum.Timesheet,
                  PermissionEnum.Update
                ) &&
                row.attributes.getNamedItem("data-deleted")?.value == "false"
              ) {
                Array.from(row.cells).forEach((item: HTMLTableCellElement) => {
                  const { left, top, width, height } =
                    item.getBoundingClientRect();
                  if (item.attributes[0]?.value) {
                    selectableItems.current.push({
                      left,
                      top,
                      width,
                      height,
                      id: Number(item.attributes[0]?.value),
                      employeeId: Number(item.attributes[1]?.value),
                    });
                  }
                });
              }
            });
          }
        }
      }
    }, 5);
  };

  const removeSelectedIndex = (idToRemove: number, isCtrlPressed: boolean) => {
    let tmpSelected = [...props.selectedIndexes];
    const index = tmpSelected.indexOf(idToRemove);
    if (tmpSelected.length > 1 && isCtrlPressed) {
      if (index || index == 0) {
        tmpSelected.splice(index, 1);
      }
    } else {
      tmpSelected = [];
    }
    props.setSelectedIndexes(tmpSelected);
    setTempSelectedIndex(tmpSelected);
  };

  const generateTableDates = () => {
    const currentDate = moment(props.startDate, "DD-MM-YYYY");
    const endDate = moment(props.endDate, "DD-MM-YYYY");
    const resp = [];
    let index = 1;
    while (currentDate.isSameOrBefore(endDate, "day")) {
      resp.push(
        <th
          key={index}
          className={`${
            timesheetDetail && timesheetDetail.length + 3
              ? "date-column !w-[38px] "
              : ""
          }`}
        >
          <p>
            <span
              className={`block text-center text-13px/4 ${
                props.dateDetails &&
                props?.dateDetails[0]?.employeeDetails?.client?.weekendDays?.includes(
                  currentDate.format("dddd")
                ) &&
                "text-primaryRed"
              }`}
            >
              {currentDate.format("DD")}
            </span>
            <span
              className={`block text-center text-xs/4 font-medium ${
                props.dateDetails &&
                props?.dateDetails[0]?.employeeDetails?.client?.weekendDays?.includes(
                  currentDate.format("dddd")
                ) &&
                "text-primaryRed"
              }`}
            >
              {currentDate.format("ddd")}
            </span>
          </p>
        </th>
      );
      currentDate.add(1, "days");
      index++;
    }
    if (
      otherHeaderFields?.length > 0 ||
      (props?.dateDetails &&
        props?.dateDetails?.length > 0 &&
        props?.dateDetails?.some(
          (data: { employeeDetails: IEmployeeData }) =>
            data?.employeeDetails?.employeeRotation &&
            data?.employeeDetails?.employeeRotation?.length > 0 &&
            data?.employeeDetails?.employeeRotation[0]?.rotation?.name !==
              "Call Out"
        ))
    ) {
      resp.push(
        <th
          key={index}
          className="!bg-[#e3d6d6] !p-0 !w-3 relative -z-5 left-0 ml-[-0.5rem] mr-[1rem] list-item h-14 rounded-r-lg "
        ></th>
      );
    }
    if (resp.length + 6 != headerLength) {
      setHeaderLength(Number(resp.length + 6));
    }
    return resp;
  };

  const onElementClick = (
    data: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    row: ITimesheetScheduleData
  ) => {
    if (
      props.selectedIndexes.includes(
        Number(data?.currentTarget?.attributes[0].value)
      ) &&
      props.selectedIndexes?.length > 1
    ) {
      removeSelectedIndex(
        Number(data?.currentTarget?.attributes[0].value),
        data.ctrlKey
      );
    } else {
      if (data.ctrlKey) {
        props.setSelectedIndexes([
          ...props.selectedIndexes,
          Number(data?.currentTarget?.attributes[0].value),
        ]);
        setTempSelectedIndex([
          ...props.selectedIndexes,
          Number(data?.currentTarget?.attributes[0].value),
        ]);
      } else {
        props.setSelectedIndexes([
          Number(data?.currentTarget?.attributes[0].value),
        ]);
        props.setSelectedEmployees([row?.employeeId]);
        const activeEmployee = props.dateDetails?.find(
          (a) => a.employeeDetails.id == row?.employeeId
        )?.employeeDetails;
        if (activeEmployee) {
          setActiveModelDetails({
            employeeDetails: activeEmployee,
            dateDetail: row,
          });
          setModal(!modal);
        }
      }
    }
  };

  const getStatus = (
    rowData: ITimesheetScheduleData,
    isBonus = false,
    isCount = false
  ) => {
    if (rowData.overtimeHours !== null && rowData.bonusCode !== null) {
      if (isCount) {
        return ["HOB"];
      } else {
        return `P,${rowData?.overtimeHours}HOB`;
      }
    }
    if (
      rowData.overtimeHours !== null &&
      rowData.bonusCode === null &&
      rowData.status === "H"
    ) {
      if (isCount) {
        return ["H"];
      } else {
        return `${rowData.overtimeHours}H`;
      }
    }
    if (rowData?.status == "" && rowData?.bonusCode == null) {
      if (isCount) {
        return ["-"];
      } else {
        return "-";
      }
    }
    if (rowData?.status == "" && rowData?.bonusCode != null && !isBonus) {
      if (isCount) {
        return [rowData?.status];
      } else {
        return rowData?.status;
      }
    }
    if (rowData?.status == "" && rowData?.bonusCode != null && isBonus) {
      if (isCount) {
        return rowData?.bonusCode?.split(",");
      } else {
        return rowData?.bonusCode;
      }
    }
    if (rowData?.status != "" && rowData?.bonusCode == null) {
      if (isCount) {
        return [rowData?.status];
      } else {
        return rowData?.status;
      }
    }
    if (rowData?.status != "" && rowData?.bonusCode != null && isBonus) {
      if (isCount) {
        if (rowData?.bonusCode?.includes(",")) {
          const arr: string[] = [];
          rowData?.bonusCode?.split(",")?.forEach((e) => {
            arr.push(`${rowData?.status},${e}`);
          });
          return arr;
        } else {
          return [`${rowData?.status},${rowData?.bonusCode}`];
        }
      } else {
        return `${rowData?.status},${rowData?.bonusCode}`;
      }
    }
    if (rowData?.status != "" && rowData?.bonusCode != null && !isBonus) {
      if (isCount) {
        return [rowData?.status];
      } else {
        return rowData?.status;
      }
    }
    if (rowData?.bonusCode != null && isBonus) {
      if (isCount) {
        return rowData?.bonusCode?.split(",");
      } else {
        return rowData?.bonusCode;
      }
    }
    return [];
  };

  const generateTableTd = (
    data: ITimesheetScheduleData[],
    isApproved: boolean,
    isResident?: boolean
  ) => {
    const currentDate = moment(props.startDate, "DD-MM-YYYY");
    const endDate = moment(props.endDate, "DD-MM-YYYY");
    const resp = [];
    while (currentDate.isSameOrBefore(endDate)) {
      const row = data.find((a) => {
        return (
          moment(currentDate).format("YYYY-MM-DD") ==
          moment(a.date).format("YYYY-MM-DD")
        );
      });
      if (row) {
        if (
          moment(currentDate).format("YYYY-MM-DD") ==
          moment(row?.date).format("YYYY-MM-DD")
        ) {
          resp.push(
            <td
              key={row?.id}
              id={row?.id.toString()}
              employee-id={row?.employeeId}
              onClick={(data) => {
                if (
                  !isApproved &&
                  getPermissions(
                    FeaturesNameEnum.Timesheet,
                    PermissionEnum.Update
                  )
                ) {
                  onElementClick(data, row);
                }
              }}
            >
              {!isApproved ? (
                <span
                  className={` text-15px/18px min-w-[30px] text-black/50 block px-0.5 text-center leading-7 h-30px rounded-md  ${
                    props?.selectedIndexes?.includes(row?.id)
                      ? "bg-primaryRed text-white"
                      : ""
                  } `}
                >
                  {props.dateDetails &&
                  props?.dateDetails[0]?.employeeDetails?.client?.weekendDays?.includes(
                    currentDate.format("dddd")
                  ) &&
                  // (day === "Friday" || day === "Saturday") &&
                  isResident &&
                  row.bonusCode === null &&
                  row.status === "P"
                    ? "W"
                    : getStatus(row, true)}
                </span>
              ) : (
                <div className="text-center">
                  {data?.find(
                    (item) =>
                      row?.date === item.date &&
                      item.isLeaveForTitreDeConge === true &&
                      row.status === "CR"
                  ) && <div className="modify-leave relative">P</div>}
                  {data?.find(
                    (item) =>
                      row?.date === item.date &&
                      item.isLeaveForTitreDeConge === true &&
                      row.status === "P"
                  ) && <div className="modify-leave relative">CR</div>}

                  <div>
                    {props.dateDetails &&
                    props?.dateDetails[0]?.employeeDetails?.client?.weekendDays?.includes(
                      currentDate.format("dddd")
                    ) &&
                    // (day === "Friday" || day === "Saturday") &&
                    isResident &&
                    row.bonusCode === null &&
                    row.status === "P"
                      ? "W"
                      : getStatus(row, true)}
                  </div>
                </div>
              )}
            </td>
          );
        }
      } else {
        resp.push(
          <td>
            <span className="text-15px/18px text-black/50 text-center block">
              X
            </span>
          </td>
        );
      }
      currentDate.add(1, "days");
    }
    return resp;
  };

  const countStatus = (
    allRows: ITimesheetScheduleData[],
    field: string,
    isBonus = false,
    isCount = false
  ) => {
    return allRows.reduce((count, obj) => {
      if (
        getStatus(obj, false, true)?.indexOf(field) >= 0 &&
        !(
          obj.bonusCode?.split(",").indexOf("P") >= 0 &&
          field == "P" &&
          obj.status == ""
        ) &&
        field != "TR" &&
        !field.startsWith("H")
      ) {
        count++;
      }
      // if (getStatus(obj, false, true)?.indexOf(field) >= 0 && field === "TR") {
      //   count++;
      // }
      if (getStatus(obj, true, true)?.indexOf("TR") >= 0 && field == "P") {
        count++;
      }
      if (isBonus) {
        if (getStatus(obj, isBonus, true)?.indexOf("P") >= 0 && field == "P") {
          count++;
        }
      }
      if (
        ![
          ...presentStatus,
          ...leaveStatus,
          ...absentStatus,
          // ...bonusStatus,
        ].includes(field) &&
        getStatus(obj, true, true).indexOf(field) >= 0 &&
        !field.startsWith("CHB") &&
        !field.startsWith("H")
      ) {
        count++;
      }
      if (
        ![
          ...presentStatus,
          ...leaveStatus,
          ...absentStatus,
          // ...bonusStatus,
        ].includes(field) &&
        getStatus(obj, true, true).indexOf("HOB") >= 0 &&
        field.startsWith("CHB")
      ) {
        if (
          obj?.overtimeHours &&
          isNumber(obj?.overtimeHours) &&
          obj?.overtimeHours >= 0 &&
          !isCount
        ) {
          count = count + obj?.overtimeHours;
        } else {
          count++;
        }
      }
      if (
        ![
          ...presentStatus,
          ...leaveStatus,
          ...absentStatus,
          // ...bonusStatus,
        ].includes(field) &&
        field.startsWith("H") &&
        !field.startsWith("CHB") &&
        obj?.overtimeHours &&
        isNumber(obj?.overtimeHours) &&
        obj?.overtimeHours >= 0 &&
        getStatus(obj, true, true).indexOf(field) >= 0
      ) {
        count = count + obj?.overtimeHours;
      }
      return count;
    }, 0);
  };

  const showSegmentValue = (empData: IEmployeeData) => {
    if (
      empData?.timeSheet &&
      empData?.timeSheet?.length > 0 &&
      empData?.timeSheet[0]?.segmentId &&
      empData?.timeSheet[0]?.subSegmentId == null
    ) {
      return `( ${empData?.timeSheet[0]?.segment?.name} )`;
    }
    if (
      empData?.timeSheet &&
      empData?.timeSheet?.length > 0 &&
      empData?.timeSheet[0]?.subSegmentId
    ) {
      return `( ${empData?.timeSheet[0]?.subSegment?.name} )`;
    }
  };

  const checkContractExpiry = (data: { employeeDetails: IEmployeeData }) => {
    if (
      data?.employeeDetails.employeeContracts &&
      data?.employeeDetails.employeeContracts?.length > 0
    ) {
      if (
        data?.employeeDetails.employeeContracts?.findIndex(
          (dat) =>
            moment(dat.endDate).isSameOrBefore(
              moment(props.endDate, "DD-MM-YYYY")
            ) &&
            moment(dat.endDate).isSameOrAfter(
              moment(props.startDate, "DD-MM-YYYY")
            )
        ) > -1
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const showBonusModel = (data: {
    employeeDetails: IEmployeeData;
    rows: ITimesheetScheduleData[];
    count: number;
  }) => {
    const customBonusFilter = data?.employeeDetails?.employeeBonus;
    if (customBonusFilter && customBonusFilter?.length > 0) {
      // customBonusFilter = customBonusFilter?.filter(
      //   (
      //     e: {
      //       id: string;
      //       coutJournalier: number;
      //       price: number;
      //       catalogueNumber?: number | undefined;
      //       startDate: Date;
      //       bonus: {
      //         id: number;
      //         name: string;
      //         code: string;
      //       };
      //     } | null
      //   ) => e !== null
      // );

      // customBonusFilter = customBonusFilter?.filter((a: Option) => {
      //   return data?.rows?.find((b) =>
      //     `${b?.status},${b.bonusCode}`.split(",").includes(a?.label)
      //   );
      // });
      if (customBonusFilter?.length > 0) {
        return (
          <span
            className="group relative"
            onClick={() => {
              if (
                data?.employeeDetails?.loginUserData?.firstName &&
                data?.employeeDetails?.loginUserData?.lastName
              ) {
                setCustomBonusData({
                  firstName: data?.employeeDetails?.loginUserData?.firstName,
                  lastName: data?.employeeDetails?.loginUserData?.lastName,
                  customBonus: JSON.stringify({ data: customBonusFilter }),
                  currency: data?.employeeDetails?.client?.currency,
                });
                setBonusModal(true);
              }
            }}
          >
            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
              Bonus
            </span>
            <BonusIcon className="text-primaryRed" />
          </span>
        );
      } else {
        return <></>;
      }
    } else {
      return <></>;
    }
  };

  const addTableData = () => {
    if (props.loader) {
      return (
        <tr>
          <td colSpan={headerLength + 1}>
            <div className="relative w-full h-14 flex items-center justify-center">
              <SpinLoader />
            </div>
          </td>
        </tr>
      );
    } else if (props.dateDetails?.length) {
      return props.dateDetails?.map(
        (
          data: {
            employeeDetails: IEmployeeData;
            totalReliquat: number;
            rows: ITimesheetScheduleData[];
            count: number;
            totalBonusCount: number;
          },
          mapIndex: number
        ) => {
          // if (data.rows.length > 0) {
          let presentValue = countStatus(data.rows, "P");
          presentValue += countStatus(data.rows, "CHB", false, true);
          const CRValue = countStatus(data.rows, "CR");
          let CRValueTotal = 0;
          if (data?.employeeDetails?.client?.isCountCR) {
            CRValueTotal = CRValue;
          }
          let trValue = countStatus(data.rows, "TR");
          let apValue = countStatus(data.rows, "AP");
          let caValue = countStatus(data.rows, "CA");
          let reliquatPayment = 0;
          // let reliquatAdjustment = 0;
          let reliquatCalculationValue = data?.totalReliquat;
          data?.employeeDetails?.reliquatPayment?.map((paymentData) => {
            reliquatPayment += paymentData?.amount ?? 0;
          });
          // data.employeeDetails?.reliquatAdjustment?.map((adjustmentData) => {
          //   reliquatAdjustment += adjustmentData?.adjustment ?? 0;
          // });
          if (
            data?.employeeDetails?.employeeRotation &&
            data?.employeeDetails?.employeeRotation?.length > 0 &&
            data?.employeeDetails?.employeeRotation[0]?.rotation?.name ===
              "Call Out"
          ) {
            presentValue = 0;
            CRValueTotal = 0;
            trValue = 0;
            apValue = 0;
            caValue = 0;
            // reliquatAdjustment = 0;
            reliquatPayment = 0;
            reliquatCalculationValue = 0;
          }
          const bonusCount = data?.rows?.filter(
            (bonusCountData) =>
              !bonusCountData?.status && bonusCountData?.bonusCode
          )?.length;
          const totalCount =
            presentValue +
            CRValueTotal +
            trValue +
            apValue +
            caValue +
            bonusCount +
            reliquatPayment +
            reliquatCalculationValue;

          // const totalCount =
          //   presentValue +
          //   CRValue +
          //   trValue +
          //   apValue +
          //   caValue +
          //   bonusCount +
          //   reliquatAdjustment +
          //   reliquatPayment +
          //   reliquatCalculationValue;

          return (
            <tr
              className="table_row"
              key={data.employeeDetails.id}
              employee-id={data.employeeDetails.id}
              data-isapproved={
                data?.employeeDetails?.timeSheet &&
                data?.employeeDetails?.timeSheet[0]?.status
              }
              data-deleted={data?.employeeDetails?.deletedAt ? true : false}
              ref={(el) =>
                (tableRowRef.current[mapIndex] = el as HTMLTableRowElement)
              }
            >
              <td className="checkbox">
                {getPermissions(
                  FeaturesNameEnum.Timesheet,
                  PermissionEnum.Update
                ) &&
                getPermissions(
                  FeaturesNameEnum.Timesheet,
                  PermissionEnum.Approve
                ) &&
                !data?.employeeDetails?.deletedAt ? (
                  data?.employeeDetails?.timeSheet &&
                  data?.employeeDetails?.timeSheet[0]?.status != "APPROVED" ? (
                    <input
                      type="checkbox"
                      value={timesheetDetail[mapIndex]?.id}
                      onChange={(element) => {
                        toggleChecked(Number(element.target.value));
                      }}
                      checked={
                        (props.checked?.length > 0 &&
                          props.checked?.length ===
                            timesheetDetail?.filter(
                              (e) => e.status === "UNAPPROVED"
                            )?.length) ||
                        props.checked?.includes(timesheetDetail[mapIndex]?.id)
                      }
                    />
                  ) : (
                    <CheckIcon />
                  )
                ) : null}
              </td>

              <td className="w-[200px]">
                <div className="flex items-center min-h-[148px]">
                  <div className="w-30px h-30px">
                    <img
                      src={
                        data.employeeDetails?.loginUserData?.profileImage &&
                        !data.employeeDetails?.loginUserData?.profileImage?.includes(
                          "undefined"
                        )
                          ? String(
                              VITE_APP_API_URL +
                                "/profilePicture/" +
                                data.employeeDetails?.loginUserData
                                  ?.profileImage
                            )
                          : "/assets/images/user.jpg"
                      }
                      width={30}
                      height={30}
                      className="rounded-full w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="pl-10px max-w-full w-[calc(100%-30px)]">
                    <p
                      onClick={() => {
                        getPermissions(
                          FeaturesNameEnum.Employee,
                          PermissionEnum.View
                        ) &&
                          navigate(
                            `/employee/summary/profile/${data?.employeeDetails?.slug}`
                          );
                      }}
                      className={`text-sm/18px font-semibold cursor-pointer underline underline-offset-4 text-primaryRed ${
                        checkContractExpiry(data) ||
                        moment(
                          data?.employeeDetails?.contractEndDate
                        )?.isBefore(moment())
                          ? "text-red"
                          : "text-black"
                      } `}
                    >
                      {`${data?.employeeDetails?.employeeNumber}-${data?.employeeDetails?.loginUserData?.lastName} ${data?.employeeDetails?.loginUserData?.firstName}`}
                    </p>
                    <span className="text-xs/4 text-black/50">{`${data.employeeDetails.fonction}`}</span>{" "}
                    {data.employeeDetails.deletedAt && (
                      <>
                        <br />
                        <span className="text-xs/4 text-red/50">Deleted</span>
                      </>
                    )}
                    {props.activeCategory == "all" && (
                      <>
                        {" "}
                        <br />
                        <span className="text-xs/4 text-black/50">
                          {showSegmentValue(data.employeeDetails)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </td>

              <td className="text-center">
                <span
                  className={`${
                    data?.employeeDetails?.reliquatCalculation &&
                    data?.employeeDetails?.reliquatCalculation[0]?.reliquat < 0
                      ? "text-red"
                      : ""
                  }`}
                >
                  {data?.employeeDetails?.reliquatCalculation &&
                  data?.employeeDetails?.reliquatCalculation?.length > 0
                    ? data?.employeeDetails?.reliquatCalculation[0]?.reliquat
                    : "-"}
                </span>
              </td>
              <td>{data && showBonusModel(data)}</td>
              {generateTableTd(
                data.rows,
                data?.employeeDetails?.timeSheet &&
                  data?.employeeDetails?.timeSheet[0]?.status == "APPROVED"
                  ? true
                  : false,
                data?.employeeDetails?.employeeRotation &&
                  data?.employeeDetails?.employeeRotation[0]?.rotation
                    ?.isResident &&
                  data?.employeeDetails?.employeeRotation[0]?.rotation
                    ?.isResident
              )}
              {(otherHeaderFields?.length > 0 || !isCallOutRotation) && (
                <td
                  className="!bg-[#F0EDED] !w-3 relative z-0 left-0 ml-[-10px] mr-[10px] list-item top-[0.5px] space_wrapper"
                  style={{ height: `${trHeights[mapIndex]}px` }}
                ></td>
              )}
              {/* <td className="!bg-[#F0EDED]"> </td> */}
              {!isCallOutRotation && (
                <>
                  <td className="!pl-3">
                    <span className="text-15px/18px text-black/50 text-center block">
                      {presentValue}
                    </span>
                  </td>
                  <td>
                    <span className="text-15px/18px text-black/50 text-center block">
                      {CRValue}
                    </span>
                  </td>
                </>
              )}
              {otherHeaderFields?.length > 0 ? (
                <>
                  {otherHeaderFields.map((data) => (
                    <td>
                      <span className="text-15px/18px text-black/50 text-center block">
                        {data.count[mapIndex]}
                      </span>
                    </td>
                  ))}
                </>
              ) : (
                <></>
              )}
              {(otherHeaderFields?.length > 0 || !isCallOutRotation) && (
                <>
                  <td>
                    <span className="text-15px/18px text-black/50 text-center block">
                      {totalCount}
                    </span>
                  </td>
                </>
              )}
            </tr>
          );
          // }
        }
      );
    } else {
      return (
        <tr>
          <td className="" colSpan={headerLength} key={headerLength}>
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
      );
    }
  };

  const handleMouseDown = async (event: React.MouseEvent) => {
    event.preventDefault();
    setDragging(true);
    setStartX(event.clientX);
    setStartY(event.clientY);
    setEndX(event.clientX);
    setEndY(event.clientY);
    if (!event.ctrlKey) {
      await handleResize();
      props.setSelectedIndexes([]);
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      if (startX == endX && startY == endY) {
        props.setSelectedIndexes([]);
        props.setSelectedEmployees([]);
        setTempSelectedEmployee([]);
        setTempSelectedIndex([]);
      } else {
        props.setSelectedIndexes(tempSelectedIndex);
        props.setSelectedEmployees(tempSelectedEmployee);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    event.preventDefault();
    if (dragging) {
      setEndX(event.clientX);
      setEndY(event.clientY);
    }
  };

  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const toggleChecked = (value: number[] | number) => {
    let newCheckBox: number[] = [...props.checked];
    if (typeof value == "number") {
      if (props.checked?.includes(value)) {
        newCheckBox.splice(newCheckBox.indexOf(value), 1);
      } else {
        newCheckBox.push(value);
      }
    } else {
      if (value.length == newCheckBox.length) {
        newCheckBox = [];
      } else {
        newCheckBox = value;
      }
    }
    props.setChecked(newCheckBox);
  };

  const isCheckedBonusOrNot = (
    values: FormikValues,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<void | FormikErrors<FormikValues>>
  ) => {
    if (isCheckedHOB) {
      setIsCheckedHOB(false);
    } else {
      setIsCheckedHOB(true);
    }
    if (!values?.overtimeHours && !values?.overtimeBonusType) {
      setFieldValue("overtimeHours", 0);
      setFieldValue("overtimeBonusType", TimesheetHOBBonusType?.DAILY);
    }
  };

  const getHourlyBonusRadioButton = (props: {
    id: string;
    label: string;
    checked: string;
    overtimeBonusType: string;
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<FormikValues>>;
  }) => {
    return (
      <Radio
        id={props.id}
        name="overtimeType"
        label={props.label}
        checked={props?.overtimeBonusType === props?.checked}
        onChangeHandler={() => {
          props?.setFieldValue("overtimeBonusType", props?.checked);
        }}
        labelClass="!text-black"
      />
    );
  };
  return (
    <>
      <div className="table-wrapper overflow-y-auto max-h-[calc(100dvh-220px)]">
        <table className="w-full timesheet-table">
          <thead>
            <tr>
              <th
                className={`${
                  timesheetDetail && timesheetDetail.length + 3
                    ? "!rounded-l-lg !w-8"
                    : ""
                }`}
              >
                {timesheetDetail?.length > 0 &&
                  timesheetDetail?.findIndex((a) => a.status == "UNAPPROVED") >=
                    0 &&
                  getPermissions(
                    FeaturesNameEnum.Timesheet,
                    PermissionEnum.Update
                  ) &&
                  getPermissions(
                    FeaturesNameEnum.Timesheet,
                    PermissionEnum.Approve
                  ) && (
                    <input
                      type="checkbox"
                      value="all"
                      onChange={() => {
                        toggleChecked(
                          timesheetDetail
                            ?.filter((e) => e.status === "UNAPPROVED")
                            ?.map((a) => a.id)
                        );
                      }}
                      checked={
                        props.checked?.length > 0 &&
                        props.checked?.length ===
                          timesheetDetail?.filter(
                            (e) => e.status === "UNAPPROVED"
                          )?.length
                      }
                    />
                  )}
              </th>
              <th className="!text-center">
                <span>Name</span>
              </th>
              <th className="!w-auto">
                <span>Reliquat</span>
              </th>
              <th className="extraspace !w-0">
                <span> </span>
              </th>
              {generateTableDates()}
              {!isCallOutRotation && (
                <>
                  <th
                    className={`${
                      timesheetDetail && timesheetDetail.length + 3
                        ? "!rounded-l-lg"
                        : ""
                    }`}
                  >
                    <p>
                      <span className="block text-center text-13px/4">P</span>
                    </p>
                  </th>
                  <th>
                    <p>
                      <span className="block text-center text-13px/4">CR</span>
                    </p>
                  </th>
                </>
              )}
              {otherHeaderFields?.length > 0 ? (
                <>
                  {otherHeaderFields.map(
                    (data: { key: string; count: number[] }) => (
                      <th key={data.key}>
                        <p>
                          <span className="block text-center text-13px/4">
                            {data.key}
                          </span>
                        </p>
                      </th>
                    )
                  )}
                </>
              ) : (
                <></>
              )}
              {(otherHeaderFields?.length > 0 || !isCallOutRotation) && (
                <>
                  <th>
                    <p>
                      <span className="block text-center text-13px/4">
                        Total
                      </span>
                    </p>
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody
            style={{
              userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            ref={elementsContainerRef}
          >
            {dragging && (
              <span
                style={{
                  position: "absolute",
                  top: Math.min(startY, endY),
                  left: Math.min(startX, endX),
                  width: Math.abs(endX - startX),
                  height: Math.abs(endY - startY),
                  zIndex: 100,
                }}
                className="bg-black/10 inline-block duration-50"
              />
            )}
            {<DragSelection />}
            {addTableData()}
          </tbody>
        </table>
      </div>
      {props.dateDetails?.length ? (
        <Pagination
          dataCount={props?.totalCount || undefined}
          paginationModule={props.paginationModule}
          // parentClass="pb-6"
          setLimit={props.setLimit}
          currentPage={props.currentPage || 1}
          dataPerPage={props.limit ? props.limit : 10}
          totalPages={props.totalPage || 1}
          // disableMassPaginate={true}
          disableMassRecord={true}
        />
      ) : (
        <></>
      )}
      {modal && (
        <Modal
          title="Update Timesheet"
          width="max-w-[709px]"
          closeModal={() => setModal(!modal)}
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
        >
          <Formik
            initialValues={{
              startDate: moment(activeModelDetails?.dateDetail.date).toDate(),
              endDate: moment(activeModelDetails?.dateDetail.date).toDate(),
              updateStatus: activeModelDetails?.dateDetail?.bonusCode
                ? `${activeModelDetails?.dateDetail?.status},${activeModelDetails?.dateDetail?.bonusCode}`
                : `${activeModelDetails?.dateDetail?.status}`,
              employeeId: activeModelDetails?.employeeDetails?.id,
              overtimeHours:
                activeModelDetails?.dateDetail?.overtimeHours ?? "",
              overtimeBonusType:
                activeModelDetails?.dateDetail?.bonusCode &&
                activeModelDetails?.dateDetail?.overtimeHours
                  ? activeModelDetails?.dateDetail?.bonusCode
                  : activeModelDetails?.dateDetail?.bonusCode &&
                    activeModelDetails?.dateDetail?.overtimeHours
                  ? TimesheetHOBBonusType?.DAILY
                  : null,
            }}
            validationSchema={TimesheetScheduleValidationSchema()}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
            onSubmit={async (vals: FormikValues) => {
              props.setGenerateModal(true);
              const formData = new FormData();
              formData.append("startDate", vals?.startDate);
              formData.append("endDate", vals?.endDate);
              formData.append("employeeId", vals?.employeeId);
              formData.append("isBonus", isBonus ? "true" : "false");
              if (
                (((vals?.updateStatus === "P" && !isBonus) ||
                  vals?.updateStatus === "CHB") &&
                  // ||vals?.updateStatus === "W"
                  isCheckedHOB) ||
                vals?.updateStatus?.includes(",")
              ) {
                formData.append("overtimeHours", vals?.overtimeHours);
                formData.append("overtimeBonusType", vals?.overtimeBonusType);
                formData.append(
                  "updateStatus",
                  `${
                    vals?.updateStatus.includes(",")
                      ? vals?.updateStatus?.split(",")[0]
                      : vals?.updateStatus
                  },${vals.overtimeBonusType}`
                );
              } else if (
                vals.updateStatus === "H" &&
                activeModelDetails?.employeeDetails &&
                activeModelDetails?.employeeDetails?.employeeRotation?.[0]
                  .rotation.name === "Call Out"
              ) {
                formData.append("updateStatus", vals?.updateStatus);
                formData.append("overtimeHours", vals?.overtimeHours);
              } else {
                formData.append("updateStatus", vals?.updateStatus);
              }
              await UpdateTimesheetSchedule(formData);
              setModal(!modal);
              props.setGenerateModal(false);
              props.setGenerateModalData(null);
              props.reload();
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="p-6 bg-primaryRed/5 rounded-10 flex justify-between items-center mb-5 last:mb-0">
                  <div className="flex items-center">
                    <div className="w-50px h-50px">
                      <img
                        src={
                          activeModelDetails?.employeeDetails?.profilePicture
                            ? String(
                                VITE_APP_API_URL +
                                  activeModelDetails.employeeDetails
                                    ?.profilePicture
                              )
                            : "/assets/images/user.jpg"
                        }
                        width={50}
                        height={50}
                        className="rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="pl-10px">
                      <p className="text-sm/18px text-black">
                        {
                          activeModelDetails?.employeeDetails?.loginUserData
                            ?.lastName
                        }{" "}
                        {
                          activeModelDetails?.employeeDetails?.loginUserData
                            ?.firstName
                        }
                      </p>
                      <span className="text-xs/4 text-black/50">
                        {activeModelDetails?.employeeDetails?.fonction}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg/6 text-black font-semibold">
                    {moment(activeModelDetails?.dateDetail.date).format(
                      "DD-MM-YYYY"
                    )}
                  </p>
                </div>
                <Card title="Timesheet Dates" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <DateComponent
                      name="startDate"
                      smallFiled
                      label={"Start Date"}
                      value={values.startDate}
                      isCompulsory={true}
                      minDate={
                        activeClientDataSelectorValue != null
                          ? moment(
                              activeClientDataSelectorValue?.startDate
                            ).toDate()
                          : null
                      }
                      maxDate={
                        activeClientDataSelectorValue &&
                        !activeClientDataSelectorValue?.autoUpdateEndDate
                          ? moment(
                              activeClientDataSelectorValue?.endDate
                            ).toDate()
                          : null
                      }
                      onChange={(date) => {
                        setFieldValue("startDate", date);
                      }}
                    />
                    <DateComponent
                      name="endDate"
                      smallFiled
                      label={"End Date"}
                      value={values.endDate}
                      isCompulsory={true}
                      minDate={values.startDate}
                      maxDate={moment(props.endDate, "DD-MM-YYYY").toDate()}
                      onChange={(date) => {
                        setFieldValue("endDate", date);
                      }}
                    />
                  </div>
                </Card>
                <Card title="Types" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-1 gap-5">
                    <GroupSelectComponent
                      options={[
                        ...props.optionDropdown,
                        {
                          label: "Custom hourly bonus",
                          options: [
                            {
                              value: "CHB",
                              label: "CHB - Custom Hourly Bonus",
                              type: true,
                            },
                          ],
                        },
                      ]}
                      parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
                      onChange={(option: Option | Option[]) => {
                        if (!Array.isArray(option)) {
                          setIsBonus(option?.type || false);
                          setFieldValue("updateStatus", option?.value);
                          if (option?.value === "CHB") {
                            setIsCheckedHOB(true);
                          } else {
                            setIsCheckedHOB(false);
                          }

                          // if (option?.value === "W" && isCheckedHOB) {
                          //   setFieldValue(
                          //     "overtimeBonusType",
                          //     TimesheetHOBBonusType.NIGHT
                          //   );
                          // } else
                          if (
                            (option?.value === "P" ||
                              option?.value === "CHB") &&
                            isCheckedHOB
                          ) {
                            setFieldValue(
                              "overtimeBonusType",
                              TimesheetHOBBonusType.DAILY
                            );
                          }
                        }
                      }}
                      selectedValue={
                        values.updateStatus.includes("CHB")
                          ? values.updateStatus.split(",")[0]
                          : values.updateStatus.includes(",")
                          ? values.updateStatus.split(",")[0]
                          : values.updateStatus
                      }
                      className="bg-white"
                    />
                    {values?.updateStatus === "P" && !isBonus && (
                      // ||
                      //   (values?.updateStatus === "W" && isBonus)
                      <CheckBox
                        label="Hourly Overtime Bonus"
                        labelClass=" !text-black"
                        checked={isCheckedHOB}
                        onChangeHandler={() => {
                          isCheckedBonusOrNot(values, setFieldValue);
                        }}
                      />
                    )}
                  </div>
                </Card>
                {((isCheckedHOB &&
                  ((values?.updateStatus === "CHB" && isBonus) ||
                    (values?.updateStatus === "P" && !isBonus))) ||
                  // ||(values?.updateStatus === "W" && isBonus)
                  (values?.updateStatus?.includes(",") &&
                    hourlyOvertimeBonusTypes?.includes(
                      values?.overtimeBonusType
                    ))) && (
                  <Card
                    title="Hourly Overtime Bonus"
                    parentClass="mb-5 last:mb-0"
                  >
                    <>
                      {((isCheckedHOB &&
                        ((values?.updateStatus === "CHB" && isBonus) ||
                          (values?.updateStatus === "P" && !isBonus))) ||
                        // ||(values?.updateStatus === "W" && isBonus)
                        (values?.updateStatus?.includes(",") &&
                          hourlyOvertimeBonusTypes?.includes(
                            values?.overtimeBonusType
                          ))) && (
                        <div className="grid grid-cols-1 gap-5">
                          <TextField
                            smallFiled
                            name="overtimeHours"
                            type="number"
                            label="Overtime Hours"
                            placeholder="Enter no. of hours"
                            isCompulsory={true}
                            max={24}
                            min={0}
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-5 mt-5">
                        {((isCheckedHOB &&
                          ((values?.updateStatus === "CHB" && isBonus) ||
                            (values?.updateStatus === "P" && !isBonus))) ||
                          ((values?.updateStatus.includes("P,") ||
                            values?.updateStatus.includes("CHB,")) &&
                            hourlyOvertimeBonusTypes?.includes(
                              values?.overtimeBonusType
                            ))) &&
                          getHourlyBonusRadioButton({
                            id: "daily",
                            label: "Daily overtime",
                            checked: TimesheetHOBBonusType.DAILY,
                            overtimeBonusType: values?.overtimeBonusType,
                            setFieldValue: setFieldValue,
                          })}
                        {((isCheckedHOB &&
                          ((values?.updateStatus === "CHB" && isBonus) ||
                            (values?.updateStatus === "P" && !isBonus))) ||
                          // ||(values?.updateStatus === "W" && isBonus)
                          ((values?.updateStatus?.includes("CHB,") ||
                            values?.updateStatus?.includes("P,")) &&
                            // ||values?.updateStatus?.includes("W")
                            hourlyOvertimeBonusTypes?.includes(
                              values?.overtimeBonusType
                            ))) &&
                          getHourlyBonusRadioButton({
                            id: "night",
                            label: "Night Overtime",
                            checked: TimesheetHOBBonusType.NIGHT,
                            overtimeBonusType: values?.overtimeBonusType,
                            setFieldValue: setFieldValue,
                          })}
                        {((isCheckedHOB &&
                          values?.updateStatus === "CHB" &&
                          isBonus) ||
                          // || (values?.updateStatus === "W" && isBonus)
                          (values?.updateStatus?.includes("CHB,") &&
                            // ||values?.updateStatus?.includes("W,")
                            hourlyOvertimeBonusTypes?.includes(
                              values?.overtimeBonusType
                            ))) &&
                          getHourlyBonusRadioButton({
                            id: "weekend",
                            label: "Weekend Overtime",
                            checked: TimesheetHOBBonusType.WEEKEND,
                            overtimeBonusType: values?.overtimeBonusType,
                            setFieldValue: setFieldValue,
                          })}
                        {((isCheckedHOB &&
                          ((values?.updateStatus === "CHB" && isBonus) ||
                            (values?.updateStatus === "P" && !isBonus))) ||
                          values?.updateStatus?.includes("CHB,") ||
                          values?.updateStatus?.includes("P,")) &&
                          getHourlyBonusRadioButton({
                            id: "holiday",
                            label: "Holiday Overtime",
                            checked: TimesheetHOBBonusType.HOLIDAY,
                            overtimeBonusType: values?.overtimeBonusType,
                            setFieldValue: setFieldValue,
                          })}
                      </div>
                      <div className="grid grid-cols-1 gap-5 mt-3">
                        <span className="text-red text-sm font-BinerkaDemo">
                          Note* : <br />
                          • When the contractor/employee works over 8 hrs,
                          he/she would have extra hours paid at a normal
                          rate*1.5 <br />• When the contractor/employee works
                          more than 4 hours over time, he/she would get paid the
                          normal rate*1.75 <br />
                          • Working at nights/weekend/bank holidays, the
                          contractor/employee should get paid per hour, normal
                          rate*2 <br />
                        </span>
                      </div>
                    </>
                  </Card>
                )}

                {values?.updateStatus === "H" &&
                  activeModelDetails?.employeeDetails?.employeeRotation?.[0]
                    .rotation.name === "Call Out" && (
                    <Card title="Hours Worked" parentClass="mb-5 last:mb-0">
                      <>
                        <div className="grid grid-cols-1 gap-5">
                          <TextField
                            smallFiled
                            name="overtimeHours"
                            type="number"
                            label="Hours"
                            placeholder="Enter no. of hours"
                            isCompulsory={true}
                            max={24}
                            min={1}
                          />
                        </div>
                      </>
                    </Card>
                  )}
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {bonusModal && customBonusData.firstName && (
        <CustomBonusModel
          employeeName={`${customBonusData?.lastName} ${customBonusData?.firstName}`}
          customBonus={JSON.parse(customBonusData?.customBonus).data}
          setModel={setBonusModal}
          currency={customBonusData?.currency}
        />
      )}
    </>
  );
};
export default TimesheetTable;
