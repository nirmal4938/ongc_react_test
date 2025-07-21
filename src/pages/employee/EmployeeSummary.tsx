import Modal from "@/components/modal/Modal";
import {
  CloudDownIocn,
  CroosIcon,
  DeleteIcon,
  DownTriangleIcon,
  EditIocn,
  IconEye,
  PlusIcon,
  RightIcon,
} from "@/components/svgIcons";
import {
  IEmployeeData,
  exportData,
} from "@/interface/employee/employeeInterface";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
// import AddUpdateEmployee from "./AddUpdateEmployee";
import {
  DeleteEmployee,
  GetAllEmployee,
  GetAllEmployeeSuggestiveDropdownData,
  GetSegmentDropdownData,
  UpdateEmployeeStatus,
} from "@/services/employeeService";
import { Link, useNavigate } from "react-router-dom";
import { ISegmentData } from "@/interface/segment/segmentInterface";
import { IRotationData } from "@/interface/rotation/rotationInterface";
import { ISubSegmentData } from "@/interface/subSegment/subSegmentInterface";
import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import moment from "moment";
import {
  DefaultRoles,
  DefaultState,
  FeaturesNameEnum,
  ModuleType,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { userSelector } from "@/redux/slices/userSlice";
import {
  activeEmployeeSelector,
  setActiveEmployee,
} from "@/redux/slices/employeeSlice";
import { socketSelector } from "@/redux/slices/socketSlice";
import generateDataModal from "@/components/generateModal/generateModal";
import { setEmployeeSearchDropdown } from "@/redux/slices/employeeSearchDropdownSlice";
import { IApproveDeletedFileData } from "@/interface/approveDeletedFile/approveDeletedFile";
import Tab from "@/components/tab/Tab";
import SearchBar from "@/components/searchbar/SearchBar";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { Option } from "@/interface/customSelect/customSelect";
import { VITE_APP_API_URL } from "@/config";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Button from "@/components/formComponents/button/Button";
import { FormatDate } from "@/helpers/Utils";

const EmployeeSummary = () => {
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.Employee ? pageState?.value : {};
  const tabValue = [
    { name: "Active", value: 1 },
    { name: "Terminated", value: 0 },
    { name: "All", value: -1 },
  ];
  const socket = useSelector(socketSelector);
  const user = useSelector(userSelector);
  const activeClient = useSelector(activeClientSelector);
  const activeEmployee = useSelector(activeEmployeeSelector);
  const [generatemodal, setGenerateModal] = useState<boolean>(false);
  // const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Employee Modal
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [tabData, setTabData] = useState<number>(
    pageStateData?.tabData != null && pageStateData?.tabData != undefined
      ? pageStateData?.tabData
      : 1
  );
  const [generateModalData, setGenerateModalData] = useState<{
    percentage: number;
    type: string;
    message: string;
  } | null>(null);
  const [employeeData, setEmployeeData] = useState<{
    data: IEmployeeData[];
  }>({
    data: [],
  });
  const [segmentWiseEmployee, setSegmentWiseEmployee] = useState<
    {
      id: string;
      name: string;
      employeeData: IEmployeeData[];
    }[]
  >([]);
  const [activeDropdownData, setActiveDropdownData] = useState<string[]>(
    pageStateData?.activeDropdown ? pageStateData?.activeDropdown : []
  );
  const [segmentDropdownOption, setSegmentDropdownOption] = useState<Option[]>(
    []
  );
  const [activeSegment, setActiveSegment] = useState<string>(
    pageStateData?.activeSegment ?? "all"
  );
  const [searchText, setSearchText] = useState<string>(
    pageStateData?.search ?? ""
  );
  const [prevSearch, setPrevSearch] = useState<string>(
    pageStateData?.search ?? ""
  );

  if (user?.roleData?.name === DefaultRoles?.Admin) {
    tabValue?.splice(2, 0, { name: "Pending", value: 2 });
    tabValue?.splice(3, 0, { name: "Rejected", value: 3 });
  }
  if (
    user?.roleData?.name !== DefaultRoles?.Admin &&
    getPermissions(FeaturesNameEnum.Employee, PermissionEnum.Create)
  ) {
    tabValue?.splice(2, 0, { name: "Draft", value: 4 });
  }
  const getActive = () => {
    const resultData: { name: string; value: number } | undefined =
      tabValue.find((a) => a.value == tabData);
    return resultData?.name?.toLowerCase();
  };

  useEffect(() => {
    if (employeeData.data.length == 0) {
      dispatch(showLoader());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    activeClient && fetchEmployeeSegmentDropdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  const navigate = useNavigate();

  useEffect(() => {
    if (activeClient) {
      (async () => {
        await fetchAllEmployee();
      })();
    } else {
      dispatch(hideLoader());
    }
    setPageState({
      state: DefaultState.Employee as string,
      value: {
        ...pageStateData,
        activeDropdown: activeDropdownData,
        activeSegment: activeSegment,
        activeClient: activeClient,
        tabData: tabData,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient, tabData, activeSegment]);

  socket?.on("generate-modal-data", (data) => {
    setGenerateModalData(data);
  });

  async function fetchAllEmployee(query?: string) {
    let queryString = `?clientId=${activeClient}&activeStatus=${getActive()}`;
    if (activeSegment != "all") {
      const segmentIds = activeSegment.split("-");
      queryString +=
        `&segmentId=${segmentIds[0]}` +
        (segmentIds[1] ? `&subSegmentId=${segmentIds[1]}` : ``);
    }
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    queryString = query ? queryString + query : queryString + searchParam;
    const dropdownQuery = `?clientId=${activeClient}&activeStatus=${getActive()}`;
    dispatch(showLoader());
    const response = await GetAllEmployee(queryString);

    const dropdownResponse = await GetAllEmployeeSuggestiveDropdownData(
      dropdownQuery
    );
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      if (result?.data.length > 0) {
        !activeEmployee &&
          dispatch(setActiveEmployee(result?.data[0]?.id ?? 0));
        let tempResponse = [];
        await setSegmentWiseEmployeeData(result?.data);
        tempResponse = result?.data.map(
          (data: {
            segmentName: string;
            subSegmentName: string;
            rotationName: string | undefined;
            contractNumber: string | undefined;
            segment: ISegmentData;
            subSegment: ISubSegmentData;
            rotation: IRotationData;
            employeeFiles: IApproveDeletedFileData[];
            employeeContract: IContractSummaryData[];
            contractCount: string;
          }) => {
            data.segmentName = data.segment?.name;
            data.subSegmentName = data.subSegment?.name;
            data.rotationName = data.rotation?.name;
            if (data.employeeContract?.length) {
              data.contractNumber =
                data.employeeContract[0]?.newContractNumber?.toString();
            }
            if (data?.employeeFiles?.length) {
              data.contractCount = data?.employeeFiles?.length?.toString();
            }
            return data;
          }
        );
        result.data = tempResponse;
      } else {
        await setSegmentWiseEmployeeData([]);
      }
      setEmployeeData({
        data: result.data,
      });
    }
    if (dropdownResponse?.data?.responseData) {
      const result = dropdownResponse?.data?.responseData;
      dispatch(setEmployeeSearchDropdown(result));
    }
    setLoader(false);
    dispatch(hideLoader());
  }

  const clientDelete = async (id: string) => {
    setDeleteLoader(true);
    const query = getActive() === "rejected" ? `employee/` : "";
    await DeleteEmployee(Number(id), query);
    const newEmpData = [...(employeeData?.data || employeeData.data)];
    newEmpData.splice(
      newEmpData.findIndex((a: IEmployeeData) => String(a?.id) == id),
      1
    );
    setEmployeeData({
      data: newEmpData,
    });
    await setSegmentWiseEmployeeData(newEmpData);
    setDeleteLoader(false);
    setOpen(false);
  };

  const approveEmployee = async (id: string) => {
    setGenerateModal(true);
    const data = {
      status: true,
    };
    const response = await UpdateEmployeeStatus(id, data);
    const result = response?.data?.responseData;
    setEmployeeData({
      data: result.data,
    });
    await setSegmentWiseEmployeeData(result.data);
    setGenerateModal(false);
    setGenerateModalData(null);
  };

  const rejectEmployee = async (id: string) => {
    setDeleteLoader(true);
    const data = {
      status: false,
    };
    const response = await UpdateEmployeeStatus(id, data);
    const result = response?.data?.responseData;
    setEmployeeData({
      data: result.data,
    });
    await setSegmentWiseEmployeeData(result.data);
    setDeleteLoader(false);
    setOpen(false);
  };

  const setSegmentWiseEmployeeData = async (data: IEmployeeData[]) => {
    const segmentList: {
      id: string;
      name: string;
      employeeData: IEmployeeData[];
    }[] = [];
    for (const empData of data) {
      if (empData?.segment?.id) {
        const sData = {
          id:
            `${empData?.segment?.id}` +
            (empData?.subSegment?.id ? `-${empData?.subSegment?.id}` : ""),
          name:
            `${empData.segment.name}` +
            (empData?.subSegment?.name ? `-${empData?.subSegment?.name}` : ""),
          employeeData: [],
        };
        const findIndex = segmentList.findIndex(
          (slist) => slist.id == sData.id
        );
        if (findIndex == -1)
          segmentList.push({ ...sData, employeeData: [empData] });
        else {
          segmentList[findIndex] = {
            ...segmentList[findIndex],
            employeeData: [...segmentList[findIndex].employeeData, empData],
          };
        }
      }
    }
    setSegmentWiseEmployee(segmentList);
  };

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
  const actionRender = (
    id: string,
    slug: string,
    terminationDate: Date | string | null
  ) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.Employee, PermissionEnum.Update) &&
          getActive() == "pending" && (
            <>
              <span
                className="w-7 h-7 bg-Green/20 text-Green inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center rounded-lg"
                onClick={() => approveEmployee(id)}
              >
                <RightIcon className="w-ful h-full pointer-events-none" />
              </span>
              <span
                className="w-7 h-7 bg-primaryRed/10 text-primaryRed inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center rounded-lg"
                onClick={() => {
                  setEmployeeId(id);
                  setOpen(true);
                }}
              >
                <CroosIcon className="w-ful h-full pointer-events-none" />
              </span>
            </>
          )}
        {getPermissions(FeaturesNameEnum.Employee, PermissionEnum.Update) &&
          getActive() !== "pending" &&
          getActive() !== "terminated" &&
          !terminationDate &&
          getActive() !== "rejected" && (
            <span
              className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
              // onClick={() => {
              //   setEmployeeId(id);
              //   setOpenModal(true);
              //   dispatch(showLoader());
              // }}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Edit
              </span>
              <Link
                to={`/employee/summary/update/${id}`}
                onClick={() => {
                  setEmployeeId(id);
                  // setOpenModal(true);
                }}
              >
                <EditIocn className="w-ful h-full pointer-events-none" />
              </Link>
            </span>
          )}
        <span
          className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
          onClick={() => {
            navigate(`/employee/summary/profile/${slug}`);
          }}
        >
          <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
            View
          </span>
          <IconEye className="w-ful h-full pointer-events-none" />
        </span>
        {/* {getPermissions(FeaturesNameEnum.Employee, PermissionEnum.Delete) &&
          getActive() !== "pending" &&
          getActive() !== "draft" && (
            <span
              className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-red/10 text-red p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
              onClick={() => {
                setEmployeeId(id);
                setOpen(true);
              }}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Delete
              </span>
              <DeleteIcon className="w-ful h-full pointer-events-none" />
            </span>
          )} */}
      </div>
    );
  };

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

  const updateActiveDropdownData = (id: string) => {
    const index = activeDropdownData.indexOf(id);
    if (index !== -1) {
      activeDropdownData.splice(index, 1);
    } else {
      activeDropdownData.push(id);
    }
    setActiveDropdownData(activeDropdownData);
    setPageState({
      state: DefaultState.Employee as string,
      value: {
        ...pageStateData,
        activeDropdown: activeDropdownData,
      },
    });
  };

  const renderFolderRows = () => {
    if (segmentWiseEmployee && segmentWiseEmployee.length > 0) {
      return segmentWiseEmployee.map((data) => {
        if (data?.employeeData?.length) {
          return (
            <React.Fragment key={data.id}>
              <tr>
                <td
                  colSpan={tabData === -1 ? 11 : 10}
                  className="py-3 font-medium text-sm/18px !px-0 cursor-pointer"
                >
                  <div className="flex justify-between pr-5">
                    <span
                      className="flex items-center pl-4"
                      onClick={() => updateActiveDropdownData(data?.id)}
                    >
                      <DownTriangleIcon
                        className={`w-4 h-4 inline-block mr-2 -rotate-90  ${
                          activeDropdownData.includes(data.id) ? "" : "rotate-0"
                        } `}
                      />
                      <span className="inline-block font-semibold">
                        {data?.name}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
              {data?.employeeData.map(
                (itemData: IEmployeeData) =>
                  !activeDropdownData.includes(data.id) &&
                  renderFileRow(itemData)
              )}
            </React.Fragment>
          );
        }
      });
    } else {
      return (
        <tr>
          <td className="" colSpan={tabData === -1 ? 10 : 9}>
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

  const renderFileRow = (itemData: IEmployeeData) => (
    <tr key={itemData.id}>
      <td className="py-3">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            className="w-8 h-8 2xl:w-10 2xl:h-10 object-contain"
            src={
              itemData?.loginUserData?.profileImage
                ? `${VITE_APP_API_URL}/profilePicture/${itemData?.loginUserData?.profileImage}`
                : "/assets/images/user.jpg"
            }
            width="40"
            height="40"
            style={{ borderRadius: "30px" }}
            alt=""
          />
          {itemData.employeeNumber}
        </div>
      </td>
      <td className="py-3">{itemData.contractNumber}</td>
      <td
        className={`py-3 ${
          moment(itemData?.contractEndDate).isBefore(moment())
            ? "!text-red"
            : ""
        }`}
      >
        {itemData?.loginUserData?.lastName}
      </td>
      <td
        className={`py-3 ${
          moment(itemData?.contractEndDate).isBefore(moment())
            ? "!text-red"
            : ""
        }`}
      >
        {itemData?.loginUserData?.firstName}
      </td>
      <td className="py-3">{itemData?.segment?.name}</td>
      <td className="py-3">{itemData?.subSegment?.name}</td>
      <td className="py-3">{itemData?.rotation?.name}</td>
      <td className="py-3">
        {itemData?.startDate
          ? moment(itemData?.startDate).format("DD/MM/YYYY")
          : "-"}
      </td>
      {tabData !== 0 && (
        <td className="py-3">
          {itemData?.contractEndDate
            ? moment(itemData?.contractEndDate).format("DD/MM/YYYY")
            : "-"}
        </td>
      )}

      {tabData === 0 && (
        <td className="py-3">
          {itemData?.terminationDate
            ? moment(itemData?.terminationDate).format("DD/MM/YYYY")
            : "-"}
        </td>
      )}

      {tabData === -1 && (
        <td className="py-3">
          {itemData?.isAdminApproved !== undefined
            ? statusRender(
                itemData.terminationDate,
                itemData?.isAdminApproved,
                itemData?.employeeStatus
              )
            : "-"}
        </td>
      )}

      <td className="py-3">
        {itemData.id && itemData.slug
          ? actionRender(
              itemData.id.toString(),
              itemData.slug,
              itemData?.terminationDate ?? null
            )
          : "-"}
      </td>
    </tr>
  );

  const handleSearch = (value?: string) => {
    const search = value ? value.trim() : searchText.trim();
    if (pageStateData) {
      setPageState({
        state: DefaultState.Employee as string,
        value: {
          ...pageStateData,
          search: search,
        },
      });
    }
    const searchQuery = `&search=${search}`;
    if (search === prevSearch.trim()) return;
    else {
      setPrevSearch(search.trim());
      fetchAllEmployee(searchQuery);
    }
  };

  const getExportData = async () => {
    const exportDataArr: exportData[] = [];
    for (const iterator of segmentWiseEmployee) {
      exportDataArr?.push({ segmentName: iterator.name });
      iterator.employeeData &&
        iterator.employeeData.length > 0 &&
        iterator.employeeData?.map((item) => {
          exportDataArr?.push({
            segmentName: "",
            matricule: item?.employeeNumber ?? "-",
            contractNumber: item?.contractNumber ?? "-",
            surname: item?.loginUserData?.firstName ?? "",
            forename: item?.loginUserData?.lastName ?? "",
            segment: item?.segment?.name,
            subSegment: item?.subSegment?.name ?? "-",
            rotation: item?.rotation?.name ?? "-",
            startDate: item?.startDate ? FormatDate(item?.startDate) : "-",
            ...(tabData !== 0 && {
              contractEndDate: item?.contractEndDate
                ? FormatDate(item?.contractEndDate)
                : "-",
            }),
            ...(tabData === 0 && {
              terminationDate: item?.terminationDate
                ? FormatDate(item?.terminationDate)
                : "-",
            }),
            ...(tabData === -1 && {
              status: !(
                item.terminationDate &&
                moment().diff(moment(item.terminationDate), "seconds") > 0
              )
                ? item.isAdminApproved === true
                  ? "Active"
                  : item.isAdminApproved === null &&
                    item?.employeeStatus === "SAVED"
                  ? "Pending"
                  : item.isAdminApproved === null &&
                    item?.employeeStatus === "DRAFT"
                  ? "Draft"
                  : "Rejected"
                : "Terminated",
            }),
          });
        });

      exportDataArr?.push({ segmentName: "" });
    }

    return exportDataArr;
  };

  const handleExport = async () => {
    if (segmentWiseEmployee && segmentWiseEmployee.length > 0) {
      const jsonData = await getExportData();

      const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("New Sheet");

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
          header: "Matricule",
          key: "matricule",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "Contract Number",
          key: "contractNumber",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 25,
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
          width: 30,
        },
        {
          header: "Segment",
          key: "segment",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
        },
        {
          header: "SubSegment",
          key: "subSegment",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Rotation",
          key: "rotation",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Start Date",
          key: "startDate",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
        },
        {
          header: "Contract End Date",
          key: "contractEndDate",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
          hidden: tabData === 0 ? true : false,
        },
        {
          header: "Termination Date",
          key: "terminationDate",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 20,
          hidden: tabData !== 0 ? true : false,
        },
        {
          header: "Status",
          key: "status",
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
          width: 15,
          hidden: tabData !== -1 ? true : false,
        },
      ];

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
        }
      });

      const updatedExcelBuffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([updatedExcelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Employee_Summary_List.xlsx");
    }
  };

  function clearSearch() {
    if (pageStateData) {
      setPageState({
        state: DefaultState.Employee as string,
        value: {
          ...pageStateData,
          search: "",
        },
      });
    }
    setPrevSearch("");
    setSearchText("");
    const searchQuery = `&search=`;
    fetchAllEmployee(searchQuery);
  }
  return (
    <>
      <div className="flex justify-between mb-4 items-start">
        <div className="flex flex-wrap 1600:flex-nowrap gap-4 items-center">
          {user?.roleData.name !== DefaultRoles.Employee && (
            <>
              <Tab
                selectedTabValue={tabData}
                setTab={setTabData}
                TabList={tabValue?.length > 0 ? tabValue : []}
              />
              <SelectComponent
                options={segmentDropdownOption}
                parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
                // TODO remove ts error
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(option: any) => {
                  setActiveSegment(option?.value);
                }}
                selectedValue={activeSegment}
                className="bg-white"
              />
            </>
          )}
        </div>
        <div className="flex flex-wrap justify-end 1600:justify-normal items-center 1600:flex-nowrap gap-4">
          <SearchBar
            // parentClass="w-full"
            inputClass="min-w-[300px]"
            searchText={searchText}
            prevSearch={prevSearch}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            moduleType={ModuleType?.EMPLOYEE}
            // searchDropdownData={searchDropdownData}
          />
          {getPermissions(FeaturesNameEnum.Employee, PermissionEnum.Create) && (
            <>
              <Link
                to={"/employee/summary/add"}
                // onClick={() => {
                //   setEmployeeId("");
                //   setOpenModal(true);
                // }}
              >
                <Button variant={"primary"} parentClass="" icon={<PlusIcon />}>
                  Add
                </Button>
              </Link>
              <Button
                variant={"primary"}
                parentClass=""
                icon={<CloudDownIocn className="w-4 h-4" />}
                onClickHandler={handleExport}
              >
                Export to Excel
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="table-wrapper overflow-auto max-h-[calc(100dvh_-_170px)]">
        <table className="w-full !min-w-[1220px]">
          <thead className="sticky top-0 z-10 bg-[#e3d6d6]">
            <tr>
              <th className="text-left pb-3 border-b border-solid border-black/5">
                Matricule
              </th>
              <th className="text-left pb-3 border-b border-solid border-black/5">
                Contract Number
              </th>
              <th className="text-left pb-3 border-b border-solid border-black/5">
                Surname
              </th>
              <th className="text-left pb-3 border-b border-solid border-black/5">
                Forename
              </th>
              <th className="text-left pb-3 border-b border-solid border-black/5">
                Segment
              </th>
              <th className="text-left pb-3 border-b border-solid border-black/5">
                Sub-Segment
              </th>
              <th className="text-left pb-3 border-b border-solid border-black/5">
                Rotation
              </th>
              <th className="text-left pb-3 border-b border-solid border-black/5">
                Start Date
              </th>
              {tabData !== 0 && (
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Contract End Date
                </th>
              )}

              {tabData === 0 && (
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Termination Date
                </th>
              )}

              {tabData === -1 && (
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Status
                </th>
              )}

              <th className="text-left pb-3 border-b border-solid border-black/5">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{!loader && renderFolderRows()}</tbody>
        </table>
      </div>
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => {
            getActive() !== "pending"
              ? clientDelete(employeeId)
              : rejectEmployee(employeeId);
            setOpen(false);
          }}
          confirmationText={
            getActive() !== "pending"
              ? "Are you sure you want to delete this Employee?"
              : "Are you sure you want to reject this Employee?"
          }
          title={getActive() !== "pending" ? "Delete" : "Reject"}
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {/* {openModal && (
        <AddUpdateEmployee
          id={employeeId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllEmployee();
          }}
        />
      )} */}
      {generatemodal &&
        generateModalData &&
        generateDataModal(generateModalData)}
    </>
  );
};

export default EmployeeSummary;
