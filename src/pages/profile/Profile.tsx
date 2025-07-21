import {
  DeleteIcon,
  EditIocn,
  PlusIcon,
  DownTriangleIcon,
  IconEye,
  SingleUserBorderIocn,
} from "@/components/svgIcons";
import { VITE_APP_API_URL } from "@/config";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import {
  DeleteEmployee,
  GetEmployeeDataBySlug,
  ReActivateEmployeeData,
  TerminateEmployeeData,
} from "@/services/employeeService";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddFile from "./AddFile";
import {
  DeleteEmployeeFile,
  GetAllEmployeeFile,
} from "@/services/employeeFileService";
import { IEmployeeFileData } from "@/interface/employeeFile/employeeFileInterface";
import { GetFolderData } from "@/services/folderService";
import { activeModelProfile } from "@/constants/CommonConstants";
import EditProfile from "./EditProfile";
import Modal from "@/components/modal/Modal";
import EditFile from "./EditFile";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "@/redux/slices/adminSidebarSlice";
import Button from "@/components/formComponents/button/Button";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import {
  activeClientSelector,
  clientDataSelector,
} from "@/redux/slices/clientSlice";
import { IClientData } from "@/interface/client/clientInterface";
import { GetAllBonusType } from "@/services/bonusTypeService";
import { IBonusTypeData } from "@/interface/bonusType/bonusTypeInterface";
import { IFolderData } from "@/interface/folder/folderInterface";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { setActiveEmployee } from "@/redux/slices/employeeSlice";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultRoles,
  FeaturesNameEnum,
  GetFilePermissionLink,
  PermissionEnum,
} from "@/utils/commonConstants";
import { FormatDate } from "@/helpers/Utils";
import { userSelector } from "@/redux/slices/userSlice";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { GetSegmentData } from "@/services/segmentService";
import { Option } from "@/interface/customSelect/customSelect";
import ClientDropdown from "@/components/dropdown/ClientDropdown";
import { GetSubSegmentData } from "@/services/subSegmentService";
import { socketSelector } from "@/redux/slices/socketSlice";
import generateDataModal from "@/components/generateModal/generateModal";
import { GetRotationData } from "@/services/rotationService";
import NotFound from "../notFound/NotFound";
import CustomSalaryModel from "./CustomSalaryModel";
import CustomCatalogueModel from "./CustomCatalogueModel";
import CustomBonusHistoryModel from "./CustomBonusHistoryModel";

const Profile = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPermissions } = usePermission();
  const { isCheckEmployee } = usePermission();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const socket = useSelector(socketSelector);
  const user = useSelector(userSelector);
  const clientDetails = useSelector(clientDataSelector);
  const activeClient = useSelector(activeClientSelector);
  // const activeEmployee = useSelector(activeEmployeeSelector);
  const activeClientData: IClientData =
    clientDetails?.find((a: IClientData) => String(a?.id) == activeClient) ??
    {};
  const [loader, setLoader] = useState<boolean>(false);
  const [employeeDetails, setEmployeeDetails] = useState<IEmployeeData>();
  const [employeeFileDetails, setEmployeeFileDetails] = useState([]);
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [dataStatus, setDataStatus] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<string>();
  const [generatemodal, setGenerateModal] = useState<boolean>(false);
  const [folderData, setFolderData] = useState<{ name: string; id: number }[]>(
    []
  );
  const [fileToInteract, setFileToInteract] = useState<IEmployeeFileData>();
  const [bonusData, setBonusData] = useState<IBonusTypeData[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<{
    [key: string]: boolean;
  }>();
  const [activeType, setActiveType] = useState<boolean | null>(true);
  const [segmentOptions, setSegmentOptions] = useState<Option[]>([]);
  const [subSegmentOptions, setSubSegmentOptions] = useState<Option[]>([]);
  const [rotationOptions, setRotationOptions] = useState<Option[]>([]);
  const [bonusModal, setBonusModal] = useState<boolean>(false);
  const [salaryHistoryModal, setSalaryHistoryModal] = useState<boolean>(false);
  const [catalogueHistoryModal, setCatalogueHistoryModal] =
    useState<boolean>(false);
  const [activeSegmentEmployee, setActiveSegmentEmployee] = useState<
    string | number
  >("");
  const [generateModalData, setGenerateModalData] = useState<{
    percentage: number;
    type: string;
    message: string;
  } | null>(null);

  const [transformedSegment, setTransformedSegment] = useState<
    {
      segmentId: string;
      segmentName: string;
      segmentSlug: string;
      subSegmentId: string;
      subSegmentName: string;
      subSegmentSlug: string;
      startDate: string;
      endDate: string;
      rollover: boolean;
    }[]
  >();
  // segmentName: item?.segment?.name || null,
  //               segmentSlug: item?.segment?.slug || null,
  //               segmentId: item?.segment?.id || null,
  //               subSegmentName: item?.subSegment?.name || null,
  //               subSegmentSlug: item?.subSegment?.slug || null,
  //               subSegmentId: item?.subSegment?.id || null,
  //               startDate,
  //               endDate,
  const [transformedRotation, setTransformedRotation] = useState<
    {
      rotation: string;
      startDate: string;
      endDate: string;
    }[]
  >();

  const [transformedSalary, setTransformedSalary] = useState<
    {
      baseSalary: number;
      monthlySalary: number;
      dailyCost: number;
      startDate: string;
      endDate: string;
    }[]
  >();
  const querySubSegment = `?` + `segmentId=${activeSegmentEmployee}`;
  useEffect(() => {
    getAllAPIs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!modalStatus) {
      if (
        activeModal == activeModelProfile.addFiles ||
        activeModal == activeModelProfile.editFile ||
        activeModal == activeModelProfile.deleteFiles
      ) {
        employeeDetails?.id && getEmployeeFileDetails(employeeDetails?.id);
      }
      if (activeModal == activeModelProfile.editProfile) getEmployeeDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalStatus]);

  useEffect(() => {
    if (activeSegmentEmployee) {
      fetchAllSubSegment(querySubSegment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSegmentEmployee]);

  socket?.on("generate-modal-data", (data) => {
    setGenerateModalData(data);
  });

  const getAllAPIs = async () => {
    await getEmployeeDetails();
    await fetchAllFolder();
    await fetchAllBonus();
    if (activeClient) {
      await fetchAllSegment(`?` + `clientId=${activeClient}`);
      await fetchAllRotation();
    }
  };
  const getEmployeeDetails = async () => {
    dispatch(showLoader());
    const response = await GetEmployeeDataBySlug(String(params.slug));
    if (response?.data?.responseData?.length !== 0) {
      const resultData = response.data.responseData;
      dispatch(setActiveEmployee(resultData?.id));
      setActiveType(resultData?.isAdminApproved);
      resultData.startDate = resultData.startDate
        ? moment(resultData.startDate).utc()
        : null;
      resultData.latestStartDate = resultData.latestStartDate
        ? moment(resultData.latestStartDate).utc()
        : null;
      resultData.firstName = resultData?.loginUserData?.firstName;
      resultData.lastName = resultData?.loginUserData?.lastName;
      resultData.email = resultData?.loginUserData?.email;
      resultData.dOB = resultData?.loginUserData?.birthDate;
      resultData.placeOfBirth = resultData?.loginUserData?.placeOfBirth;
      resultData.gender = resultData?.loginUserData?.gender;
      resultData.mobileNumber = resultData?.loginUserData?.phone;
      resultData.rotationDate =
        resultData?.employeeRotation && resultData?.employeeRotation.length > 0
          ? new Date(resultData?.employeeRotation[0]?.date)
          : null;
      resultData.rollover =
        resultData?.employeeSegment && resultData?.employeeSegment?.length > 0
          ? resultData?.employeeSegment[0]?.rollover
          : false;
      resultData.segmentDate =
        resultData?.employeeSegment && resultData?.employeeSegment.length > 0
          ? new Date(resultData?.employeeSegment[0]?.date)
          : null;
      resultData.profilePicture = resultData?.loginUserData?.profileImage;
      resultData.customBonus =
        resultData?.customBonus && JSON.parse(resultData.customBonus)?.data;
      resultData.timezone = resultData?.loginUserData?.timezone
        ? resultData?.loginUserData?.timezone
        : "";

      const employeeCatalogueNumberArr: {
        id: number;
        employeeId: number;
        startDate: Date | null;
        catalogueNumber: string;
      }[] = resultData?.employeeCatalogueNumber;
      if (
        employeeCatalogueNumberArr[employeeCatalogueNumberArr?.length - 1]
          ?.startDate === null
      ) {
        employeeCatalogueNumberArr?.unshift(
          employeeCatalogueNumberArr[employeeCatalogueNumberArr?.length - 1]
        );
        employeeCatalogueNumberArr?.pop();
      }

      setEmployeeDetails(resultData);
      const reversedSegmentArray = resultData?.employeeSegment?.reverse();
      const transformedArraySegment =
        reversedSegmentArray?.length > 0
          ? reversedSegmentArray?.map(
              (item: {
                date: string | null;
                endDate: string | null;
                rollover: boolean;
                id: number;
                segment: {
                  name: string;
                  slug: string;
                  id: number;
                };
                subSegment: {
                  name: string;
                  slug: string;
                  id: number;
                };
              }) => {
                const startDate = item.date;
                const endDate = item?.endDate || null;
                return {
                  segmentName: item?.segment?.name || null,
                  segmentSlug: item?.segment?.slug || null,
                  segmentId: item?.segment?.id || null,
                  subSegmentName: item?.subSegment?.name || null,
                  subSegmentSlug: item?.subSegment?.slug || null,
                  subSegmentId: item?.subSegment?.id || null,
                  rollover: item?.rollover,
                  startDate,
                  endDate,
                };
              }
            )
          : [];
      setTransformedSegment(transformedArraySegment);
      const reversedRotationArray = resultData?.employeeRotation?.reverse();
      const transformedArrayRotation =
        reversedRotationArray?.length > 0
          ? reversedRotationArray?.map(
              (item: {
                date: string | null;
                endDate: string | null;
                id: number;
                rotation: {
                  name: string;
                  id: number;
                };
              }) => {
                const startDate = item.date;
                const endDate = item.endDate || null;
                return {
                  rotation: item?.rotation?.name,
                  startDate,
                  endDate,
                };
              }
            )
          : [];
      setTransformedRotation(transformedArrayRotation);
      const reversedSalaryArray = resultData?.employeeSalary?.reverse();
      setTransformedSalary(reversedSalaryArray);
      dispatch(hideLoader());
      await getEmployeeFileDetails(resultData?.id);
    } else {
      dispatch(hideLoader());
      setDataStatus(true);
    }
  };
  const getEmployeeFileDetails = async (id: string | number) => {
    const response = await GetAllEmployeeFile(`?employeeId=${id}`);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setEmployeeFileDetails(resultData.data);
    }
  };

  async function fetchAllFolder() {
    const response = await GetFolderData();
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      setFolderData(result);
      const toggleFilter = result?.filter(
        (data: IFolderData) => data.typeId !== 1
      );
      const generateToggle: { [key: string]: boolean } = {};
      toggleFilter.forEach((nData: { id: number }) => {
        generateToggle[nData.id] = true;
      });
      setActiveDropdown(generateToggle);
    }
  }

  async function fetchAllBonus() {
    // if (getPermissions(FeaturesNameEnum.BonusType, PermissionEnum.View)) {
    const response = await GetAllBonusType("");
    if (response?.data?.responseData?.data) {
      setBonusData(response?.data?.responseData?.data);
    }
    // }
  }

  async function fetchAllSegment(query: string) {
    const response = await GetSegmentData(query);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setSegmentOptions(resp);
    }
  }

  async function fetchAllSubSegment(query: string) {
    const response = await GetSubSegmentData(query);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setSubSegmentOptions(resp);
    }
  }

  async function fetchAllRotation() {
    const response = await GetRotationData();
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setRotationOptions(resp);
    }
  }

  // const getProperSize = (bytes: number) => {
  //   if (!+bytes) return "0 Bytes";

  //   const k = 1024;
  //   const sizes = ["Bytes", "KB", "MB"];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));

  //   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  // };

  const terminateEmployee = async (values: FormikValues) => {
    setLoader(true);
    // const bodyData = {
    //   terminationDate: String(
    //     moment(
    //       moment(values.terminationDate).format("DD-MM-YYYY"),
    //       "DD-MM-YYYY"
    //     ).toDate()
    //   ),
    // };
    const response = await TerminateEmployeeData(
      values,
      Number(employeeDetails?.id)
    );
    if (response?.data?.response_type === "success") {
      navigate("/employee/summary");
    }
    setLoader(false);
  };

  const reactivateEmployee = async (values: FormikValues) => {
    setGenerateModal(true);
    const formData = new FormData();
    formData.append("clientId", values?.clientId);
    formData.append("segmentId", values?.segmentId);
    formData.append("subSegmentId", values?.subSegmentId);
    formData.append("rotationId", values?.rotationId);
    formData.append("startDate", values?.startDate);
    const response = await ReActivateEmployeeData(
      formData,
      Number(employeeDetails?.id)
    );
    if (response?.data?.response_type === "success") {
      setModalStatus(false);
      setGenerateModal(false);
      setGenerateModalData(null);
      navigate(`/employee/summary`);
    } else {
      setGenerateModal(false);
      setGenerateModalData(null);
    }
  };

  const renderFolder = () => {
    const response = [];
    for (const folderIndex in folderData) {
      if (
        employeeFileDetails.filter(
          (a: { folderId: number }) => a.folderId === folderData[folderIndex].id
        ).length > 0
      ) {
        response.push(
          <>
            <tr>
              <td colSpan={4} className="py-3 px-2 font-medium text-sm/18px">
                <span
                  className="flex items-center"
                  onClick={() => {
                    if (activeDropdown) {
                      const newStatus = { ...activeDropdown };
                      newStatus[folderData[folderIndex].id] =
                        !activeDropdown[folderData[folderIndex].id];
                      setActiveDropdown(newStatus);
                    }
                  }}
                >
                  <DownTriangleIcon
                    className={`w-4 h-4 inline-block mr-2 ${
                      activeDropdown?.[folderData[folderIndex].id] ||
                      "-rotate-90"
                    } `}
                  />
                  <span className="inline-block font-semibold">
                    {folderData[folderIndex].name}
                  </span>
                </span>
              </td>
            </tr>
            {employeeFileDetails
              .filter(
                (a: { folderId: number }) =>
                  a.folderId === folderData[folderIndex].id
              )
              .map((data: IEmployeeFileData) => {
                if (activeDropdown?.[folderData[folderIndex].id]) {
                  return (
                    <tr key={data?.id}>
                      <td
                        className="py-3 px-2 font-medium text-sm/18px"
                        // colSpan={3}
                        colSpan={1}
                      >
                        <a
                          onClick={async () => {
                            let link = await GetFilePermissionLink(
                              data.fileName
                            );
                            if (link) {
                              link =
                                data && data.fileLink === true
                                  ? link
                                  : `${String(VITE_APP_API_URL)}${link}`;
                              window.open(link, "_blank");
                            }
                          }}
                          className="block cursor-pointer underline text-primaryRed underline-offset-4"
                          target="_blank"
                        >
                          {data?.name}
                        </a>
                      </td>
                      {/* <td className="py-3 px-2 font-medium text-sm/18px">
                        {data?.updatedAt &&
                          moment(data?.updatedAt).format("DD/MM/YYYY")}
                      </td>
                      <td className="py-3 px-2 font-medium text-sm/18px">
                        {getProperSize(Number(data?.fileSize))}
                      </td> */}

                      {!isCheckEmployee && (
                        <td
                          colSpan={1}
                          className="py-3 px-2 font-medium text-sm/18px"
                        >
                          <div className="flex flex-row"></div>
                          <span
                            className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                            onClick={() => {
                              setModalStatus(true);
                              setActiveModal(activeModelProfile.editFile);
                              data && setFileToInteract(data);
                            }}
                          >
                            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                              Edit
                            </span>
                            <EditIocn className="w-ful h-full pointer-events-none" />
                          </span>
                          <span
                            className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-red/10 text-red p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                            onClick={() => {
                              setModalStatus(true);
                              setActiveModal(activeModelProfile.deleteFiles);
                              data && setFileToInteract(data);
                            }}
                          >
                            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                              Delete
                            </span>
                            <DeleteIcon className="w-ful h-full pointer-events-none" />
                          </span>
                        </td>
                      )}
                      {/* <td></td> */}
                    </tr>
                  );
                } else {
                  return <></>;
                }
              })}
          </>
        );
      }
    }
    return (
      <div className="flex flex-col gap-3 mb-30px">
        <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
          <h4 className="text-base/5 text-black font-semibold">Files</h4>
          {getPermissions(
            FeaturesNameEnum.EmployeeFile,
            PermissionEnum.Create
          ) &&
            activeType &&
            !(
              employeeDetails?.terminationDate &&
              moment().diff(
                moment(employeeDetails?.terminationDate),
                "seconds"
              ) > 0
            ) && (
              <span
                className="w-5 h-5 inline-block cursor-pointer hover:text-primaryRed active:scale-90 transition-all duration-300 select-none"
                onClick={() => {
                  setModalStatus(true);
                  setActiveModal(activeModelProfile.addFiles);
                }}
              >
                <PlusIcon />
              </span>
            )}
        </div>
        {response.length > 0 && (
          <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
            <table className="small w-full table-file">
              <thead>
                <tr>
                  <th
                    className="text-left break-words pb-3 border-b border-solid border-black/5"
                    colSpan={3}
                  >
                    Name
                  </th>
                  {/* <th className="text-left pb-3 border-b border-solid border-black/5">
                    Upload Date
                  </th>
                  <th className="text-left pb-3 border-b border-solid border-black/5">
                    Size
                  </th> */}
                  <th className="text-left pb-3 border-b border-solid border-black/5"></th>
                </tr>
              </thead>
              <tbody>{response}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderBonus = () => {
    if (employeeDetails?.employeeBonus) {
      const currency =
        employeeDetails?.client?.currency &&
        employeeDetails?.client?.currency !== null
          ? employeeDetails?.client?.currency
          : "";
      return employeeDetails?.employeeBonus
        ?.filter((e) => !e?.endDate)
        ?.map(
          (data: {
            coutJournalier: number;
            price: number;
            catalogueNumber?: number;
            startDate: Date;
            endDate: Date | null;
            bonus: {
              id: number;
              name: string;
              code: string;
            };
          }) => {
            const newData = bonusData?.find(
              (bonus) => bonus?.id === Number(data?.bonus?.id)
            );
            return (
              <tr key={`${Math.floor(Math.random() * 1000)}`}>
                <td className="py-3 font-medium text-sm/18px">
                  {newData?.code}
                </td>
                <td className="py-3 font-medium text-sm/18px">
                  {newData?.name}
                </td>
                <td className="py-3 font-medium text-sm/18px">
                  {/* {data?.price && parseFloat(data?.price?.toString().toFixed(2))} */}
                  {/* {data?.price && parseFloat(data?.price?.toString())
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} */}
                  {Number(data?.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) +
                    " " +
                    currency}
                </td>

                {(user?.roleData?.name === DefaultRoles?.Admin ||
                  getPermissions(
                    FeaturesNameEnum.DailyRate,
                    PermissionEnum.View
                  )) && (
                  <td className="py-3 font-medium text-sm/18px">
                    {data?.coutJournalier.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) +
                      " " +
                      currency}
                  </td>
                )}
                <td className="py-3 font-medium text-sm/18px">
                  {data?.catalogueNumber ?? "-"}
                </td>
                <td className="py-3 font-medium text-sm/18px">
                  {data?.startDate
                    ? `${moment(data.startDate).format("DD/MM/YYYY")} - ${
                        data.endDate
                          ? moment(data.endDate).format("DD/MM/YYYY")
                          : "ToDate"
                      }`
                    : "-"}
                </td>
              </tr>
            );
          }
        );
    }
  };

  return (
    <>
      {dataStatus ? (
        <NotFound />
      ) : (
        <div className="profile-main-wrapper">
          <div className="grid grid-cols-1 1200:grid-cols-2 gap-5">
            <div className="">
              <div className="flex flex-col gap-3 mb-30px">
                <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                  <h4 className="text-base/5 text-black font-semibold">
                    Overview
                    {employeeDetails && (
                      <span
                        className={`w-2.5 h-2.5 ${
                          employeeDetails?.isAdminApproved == null
                            ? "bg-yellow-500"
                            : !employeeDetails?.isAdminApproved
                            ? "bg-red"
                            : employeeDetails?.terminationDate === null
                            ? "bg-PrimaryGreen"
                            : "bg-red"
                        } ml-1 inline-block rounded-full`}
                      ></span>
                    )}
                  </h4>
                  <div>
                    {getPermissions(
                      FeaturesNameEnum.Employee,
                      PermissionEnum.Update
                    ) &&
                      activeType &&
                      !(
                        employeeDetails?.terminationDate
                        // &&
                        // moment().diff(
                        //   moment(employeeDetails?.terminationDate),
                        //   "seconds"
                        // ) > 0
                      ) &&
                      (employeeDetails?.subSegment &&
                      employeeDetails?.subSegment?.id
                        ? employeeDetails?.subSegment?.isActive
                        : employeeDetails?.segment?.isActive) && (
                        <span
                          className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                          onClick={() => {
                            setModalStatus(true);
                            setActiveModal(activeModelProfile.editProfile);
                          }}
                        >
                          <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                            Edit
                          </span>
                          <EditIocn />
                        </span>
                      )}
                    {employeeDetails?.loginUserData?.user?.id &&
                      employeeDetails?.email && (
                        <span
                          className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                          onClick={() => {
                            navigate(
                              `/admin/user/${employeeDetails?.loginUserData?.user?.id}`
                            );
                          }}
                        >
                          <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-[80px] max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                            View User
                          </span>
                          <SingleUserBorderIocn className="w-full h-full select-none" />
                        </span>
                      )}
                  </div>
                </div>
                <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                  <div className="flex flex-wrap">
                    <div className="w-[150px] h-[150px] mx-auto">
                      <img
                        src={
                          employeeDetails?.profilePicture
                            ? String(
                                VITE_APP_API_URL +
                                  "/profilePicture/" +
                                  employeeDetails?.profilePicture
                              )
                            : "/assets/images/user.jpg"
                        }
                        width={150}
                        height={150}
                        className="rounded-10 w-full h-full object-contain"
                        alt=""
                      />
                    </div>
                    <div className="max-w-full 2xl:max-w-[calc(100%_-_150px)] w-full 2xl:pl-4 mt-5 2xl:mt-0">
                      <ul className="grid grid-cols-1 768:grid-cols-2 gap-4">
                        <li className="flex justify-between">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            First name
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {employeeDetails?.firstName}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Last name
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {employeeDetails?.lastName}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Matricule:
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {employeeDetails?.employeeNumber}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Fonction
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {employeeDetails?.fonction}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Start Date:
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {employeeDetails?.startDate
                              ? moment(
                                  new Date(employeeDetails?.startDate)
                                ).format("DD/MM/YYYY")
                              : "-"}
                          </span>
                        </li>
                        {employeeDetails?.terminationDate && (
                          // &&
                          // moment(employeeDetails?.terminationDate).isBefore(
                          //   moment()
                          // )
                          <li className="flex justify-between">
                            <span className="text-sm/18px text-black font-bold w-1/2">
                              Termination Date
                            </span>
                            <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                              {employeeDetails?.terminationDate
                                ? moment(
                                    employeeDetails?.terminationDate
                                  ).format("DD/MM/YYYY")
                                : "-"}
                            </span>
                          </li>
                        )}
                        <li className="flex justify-between">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Mobile Number
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {employeeDetails?.mobileNumber ?? "-"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Contract End Date
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {employeeDetails?.contractEndDate
                              ? moment(employeeDetails?.contractEndDate).format(
                                  "DD/MM/YYYY"
                                )
                              : employeeDetails?.employeeContracts &&
                                employeeDetails?.employeeContracts?.length > 0
                              ? moment(
                                  employeeDetails?.employeeContracts[0]?.endDate
                                ).format("DD/MM/YYYY")
                              : "-"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Email
                          </span>
                          <span className="text-sm/18px font-medium w-1/2 text-left cursor-pointer underline text-primaryRed underline-offset-4 break-words">
                            {employeeDetails?.email}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-30px">
                <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                  <h4 className="text-base/5 text-black font-semibold">
                    Personal Information
                  </h4>
                </div>
                <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                  <ul className=" relative ">
                    <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Date de naissance
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeDetails?.dOB
                          ? moment(employeeDetails?.dOB).format("DD/MM/YYYY")
                          : "-"}
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Lieu de naissance
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeDetails?.placeOfBirth ?? "-"}
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Address
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeDetails?.address ?? "-"}
                      </span>
                    </li>
                    {activeClientData?.isShowNSS && (
                      <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                        <span className="text-sm/18px text-black font-bold w-1/2">
                          N° S.S.
                        </span>
                        <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                          {employeeDetails?.nSS ?? "-"}
                        </span>
                      </li>
                    )}
                    {activeClientData?.isShowCarteChifa && (
                      <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                        <span className="text-sm/18px text-black font-bold w-1/2">
                          Carte Chifa
                        </span>
                        <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                          {employeeDetails?.medicalInsurance ? "Yes" : "No"}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-30px">
                <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                  <h4 className="text-base/5 text-black font-semibold">
                    Medical
                  </h4>
                </div>
                <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                  <ul className="relative">
                    <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Medical Check Date
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeDetails?.medicalCheckDate
                          ? moment(employeeDetails?.medicalCheckDate).format(
                              "DD/MM/YYYY"
                            )
                          : "-"}
                        {/* {employeeDetails?.medicalRequest?.medicalDate
                        ? moment(
                            employeeDetails?.medicalRequest?.medicalDate
                          ).format("DD/MM/YYYY")
                        : "-"} */}
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Medical Check Expiry
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {employeeDetails?.medicalCheckExpiry
                          ? moment(employeeDetails?.medicalCheckExpiry).format(
                              "DD/MM/YYYY"
                            )
                          : "-"}
                        {/* {employeeDetails?.medicalRequest?.medicalDate
                        ? moment(employeeDetails?.medicalRequest?.medicalDate)
                            .add(1, "year")
                            .add(1, "day")
                            .format("DD/MM/YYYY")
                        : "-"} */}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              {activeClientData?.isShowSalaryInfo &&
                getPermissions(
                  FeaturesNameEnum.Salary,
                  PermissionEnum.View
                ) && (
                  <div className="flex flex-col gap-3 mb-30px">
                    <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                      <h4 className="text-base/5 text-black font-semibold">
                        Salary Information
                      </h4>
                      <span
                        className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                        onClick={() => {
                          setSalaryHistoryModal(true);
                        }}
                      >
                        <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                          View History
                        </span>
                        <IconEye className="w-ful h-full pointer-events-none" />
                      </span>
                    </div>
                    <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                      <ul className="relative">
                        <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Salaire de Base
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words flex items-center gap-3">
                            {employeeDetails?.baseSalary
                              ?.toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                              ".00" +
                              " " +
                              (employeeDetails?.client?.currency &&
                              employeeDetails?.client?.currency !== null
                                ? employeeDetails?.client?.currency
                                : "")}

                            {/* {employeeDetails?.baseSalary?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
                            " " +
                            employeeDetails?.currencyCode || "-"} */}
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Housing
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {(employeeDetails?.Housing?.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            ) ?? 0) +
                              " " +
                              (employeeDetails?.client?.currency &&
                              employeeDetails?.client?.currency !== null
                                ? employeeDetails?.client?.currency
                                : "")}
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Travel Allowance
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {(employeeDetails?.travelAllowance?.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            ) ?? 0) +
                              " " +
                              (employeeDetails?.client?.currency &&
                              employeeDetails?.client?.currency !== null
                                ? employeeDetails?.client?.currency
                                : "")}
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                          <span className="text-sm/18px text-black font-bold w-1/2">
                            Monthly Salary
                          </span>
                          <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                            {/* {employeeDetails?.monthlySalary?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} */}
                            {employeeDetails?.monthlySalary?.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            ) +
                              " " +
                              (employeeDetails?.client?.currency &&
                              employeeDetails?.client?.currency !== null
                                ? employeeDetails?.client?.currency
                                : "")}
                          </span>
                        </li>
                        {(user?.roleData?.name === DefaultRoles?.Admin ||
                          getPermissions(
                            FeaturesNameEnum.DailyRate,
                            PermissionEnum.View
                          )) && (
                          <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                            <span className="text-sm/18px text-black font-bold w-1/2">
                              Cout Journalier
                            </span>
                            <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                              {employeeDetails?.dailyCost?.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              ) +
                                " " +
                                (employeeDetails?.client?.currency &&
                                employeeDetails?.client?.currency !== null
                                  ? employeeDetails?.client?.currency
                                  : "")}
                            </span>
                          </li>
                        )}
                      </ul>
                      {/* <div className="mt-5 pt-2 border-t border-solid border-[#e2e2e2]">
                        <span className="text-sm/18px text-black font-bold mb-2 block">
                          Salary History
                        </span>
                        {transformedSalary && transformedSalary?.length > 0 ? (
                          <table className="small w-full">
                            <thead>
                              <tr>
                                <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                                  Base Salary
                                </th>
                                <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                                  Monthly Salary
                                </th>
                                {(user?.roleData?.name ===
                                  DefaultRoles?.Admin ||
                                  getPermissions(
                                    FeaturesNameEnum.DailyRate,
                                    PermissionEnum.View
                                  )) && (
                                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                                    Daily Cost
                                  </th>
                                )}
                                <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {transformedSalary?.map(
                                (x: {
                                  baseSalary: number;
                                  monthlySalary: number;
                                  dailyCost: number;
                                  startDate: string;
                                  endDate: string;
                                }) => {
                                  return (
                                    <tr
                                      key={Math.floor(Math.random() * 1000) + 1}
                                    >
                                      <td className="text-grayDark font-medium py-2">
                                        {x?.baseSalary?.toLocaleString(
                                          undefined,
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        ) +
                                          " " +
                                          employeeDetails?.currencyCode || "-"}
                                      </td>
                                      <td className="text-grayDark font-medium py-2">
                                        {x?.monthlySalary?.toLocaleString(
                                          undefined,
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        ) +
                                          " " +
                                          employeeDetails?.currencyCode || "-"}
                                      </td>
                                      {(user?.roleData?.name ===
                                        DefaultRoles?.Admin ||
                                        getPermissions(
                                          FeaturesNameEnum.DailyRate,
                                          PermissionEnum.View
                                        )) && (
                                        <td className="text-grayDark font-medium py-2">
                                          {x?.dailyCost?.toLocaleString(
                                            undefined,
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }
                                          ) +
                                            " " +
                                            employeeDetails?.currencyCode ||
                                            "-"}
                                        </td>
                                      )}
                                      <td className="text-grayDark font-medium py-2">
                                        {FormatDate(x?.startDate)}
                                        {"-"}
                                        {x?.endDate !== null
                                          ? FormatDate(x?.endDate)
                                          : "ToDate"}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        ) : (
                          <>-</>
                        )}
                      </div> */}
                      {employeeDetails?.employeeCatalogueNumber &&
                      employeeDetails?.employeeCatalogueNumber?.length > 0 ? (
                        <div className="mt-5 pt-2 border-t border-solid border-[#e2e2e2] flex items-center">
                          <span className="text-sm/18px text-black font-bold mb-2 block w-1/2">
                            Catalogue Number History
                          </span>
                          <span
                            className="w-7 relative group h-7 inline-flex cursor-pointer items-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                            onClick={() => {
                              setCatalogueHistoryModal(true);
                            }}
                          >
                            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:left-full group-hover:ml-2 absolute max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded left-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-r-8 before:border-y-8 before:border-y-transparent before:border-l-0 before:border-solid before:border-r-primaryRed before:top-1/2 before:-translate-y-1/2 before:right-[calc(100%_-_4px)]">
                              View History
                            </span>
                            <IconEye className="w-ful h-full pointer-events-none" />
                          </span>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                )}
              {employeeDetails?.employeeBonus &&
                employeeDetails?.employeeBonus?.filter((e) => !e?.endDate)
                  ?.length > 0 && (
                  <div className="flex flex-col gap-3 mb-30px">
                    <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                      <h4 className="text-base/5 text-black font-semibold">
                        Bonus Types
                      </h4>
                      <span
                        className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                        onClick={() => {
                          setBonusModal(true);
                        }}
                      >
                        <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                          View History
                        </span>
                        <IconEye className="w-ful h-full pointer-events-none" />
                      </span>
                    </div>

                    <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                      <table className="small w-full table-fixed">
                        <thead>
                          <tr>
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Code
                            </th>
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Name
                            </th>
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Bonus
                            </th>
                            {(user?.roleData?.name === DefaultRoles?.Admin ||
                              getPermissions(
                                FeaturesNameEnum.DailyRate,
                                PermissionEnum.View
                              )) && (
                              <th className="text-left pb-3 border-b border-solid border-black/5">
                                &nbsp;Cout Journalier
                              </th>
                            )}
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Catalogue Number
                            </th>
                            {/* <th className="text-left pb-3 border-b border-solid border-black/5">
                              Effective Date
                            </th>
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              End Date
                            </th> */}
                            <th className="text-left pb-3 border-b border-solid border-black/5">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>{renderBonus()}</tbody>
                      </table>
                    </div>
                  </div>
                )}

              <div className="flex flex-row gap-3 mb-30px">
                {employeeDetails?.terminationDate == null &&
                  getPermissions(
                    FeaturesNameEnum.Employee,
                    PermissionEnum.Update
                  ) &&
                  activeType &&
                  !(
                    employeeDetails?.terminationDate &&
                    moment().diff(
                      moment(employeeDetails?.terminationDate),
                      "seconds"
                    ) > 0
                  ) && (
                    <Button
                      variant={"primary"}
                      onClickHandler={() => {
                        setModalStatus(true);
                        setActiveModal(activeModelProfile.terminateEmp);
                      }}
                    >
                      Terminate Employee
                    </Button>
                  )}
                {employeeDetails?.terminationDate !== null &&
                  getPermissions(
                    FeaturesNameEnum.Employee,
                    PermissionEnum.Update
                  ) &&
                  activeType &&
                  employeeDetails?.terminationDate &&
                  moment().diff(
                    moment(employeeDetails?.terminationDate),
                    "seconds"
                  ) > 0 && (
                    <Button
                      variant={"primary"}
                      onClickHandler={() => {
                        setModalStatus(true);
                        setActiveModal(activeModelProfile.reactivateEmp);
                      }}
                    >
                      Reactivate Employee
                    </Button>
                  )}
                {/* {getPermissions(
                FeaturesNameEnum.Employee,
                PermissionEnum.Delete
              ) &&
                (activeType === true || activeType === false) &&
                !(
                  employeeDetails?.terminationDate &&
                  moment().diff(
                    moment(employeeDetails?.terminationDate),
                    "seconds"
                  ) > 0
                ) && (
                  <Button
                    variant={"primary"}
                    onClickHandler={() => {
                      setModalStatus(true);
                      // setActiveModal(activeModelProfile.deleteEmp);
                    }}
                  >
                    Delete Employee
                  </Button>
                )} */}
              </div>
            </div>
            <div className="">
              {renderFolder()}
              <div className="flex flex-col gap-3 mb-30px">
                <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                  <h4 className="text-base/5 text-black font-semibold">
                    Work Information
                  </h4>
                </div>
                <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                  <ul className="grid 1600:gap-x-10 relative ">
                    <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                      <span className="text-sm/18px text-black font-bold w-16">
                        Segment
                      </span>
                      <div className="w-[calc(100%_-_64px)] pl-2 flex flex-col gap-2">
                        {transformedSegment && transformedSegment?.length > 0
                          ? transformedSegment?.map((x) => {
                              let key = "";
                              if (x?.subSegmentId) {
                                key = x?.subSegmentId;
                              } else {
                                key = x?.segmentId;
                              }
                              return (
                                <div key={key} className="flex flex-wrap">
                                  <span
                                    className="text-sm/18px font-semibold cursor-pointer underline text-primaryRed underline-offset-4 inline-block"
                                    onClick={() => {
                                      if (
                                        getPermissions(
                                          FeaturesNameEnum.Timesheet,
                                          PermissionEnum.View
                                        )
                                      ) {
                                        if (x?.subSegmentId) {
                                          navigate(`/timesheet/update`, {
                                            state: {
                                              startDate: FormatDate(
                                                x?.startDate
                                              ),
                                              endDate: FormatDate(x?.endDate),
                                              type: "subsegment",
                                              value: x?.subSegmentId,
                                            },
                                          });
                                        } else {
                                          navigate(`/timesheet/update`, {
                                            state: {
                                              startDate: FormatDate(
                                                x?.startDate
                                              ),
                                              endDate: FormatDate(x?.endDate),
                                              type: "segment",
                                              value: x?.segmentId,
                                            },
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    {x?.subSegmentId
                                      ? `${x.segmentName} - ${x.subSegmentName}`
                                      : x.segmentName}
                                  </span>
                                  <span className="text-sm/18px text-black font-medium inline-block text-left break-words">
                                    &nbsp;{FormatDate(x?.startDate)}
                                    &nbsp;{"-"}
                                    {x?.endDate !== null
                                      ? FormatDate(
                                          moment(x?.endDate)
                                            // .subtract(1, "days")
                                            .toDate()
                                        )
                                      : "ToDate"}{" "}
                                    {""}
                                    {x.rollover && "(Balance Rollover)"}
                                  </span>
                                </div>
                              );
                            })
                          : "-"}
                      </div>
                    </li>

                    {activeClientData?.isShowRotation && (
                      <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                        <span className="text-sm/18px text-black font-bold w-16">
                          Rotation
                        </span>
                        <div className="w-[calc(100%_-_64px)] pl-2 flex flex-col gap-2">
                          {transformedRotation &&
                          transformedRotation?.length > 0
                            ? transformedRotation?.map((x) => {
                                return (
                                  <div
                                    key={x?.rotation}
                                    className="flex flex-wrap"
                                  >
                                    <span className="text-sm/18px text-black font-bold inline-block">
                                      {x?.rotation}
                                    </span>
                                    <span className="text-sm/18px text-black font-medium inline-block text-left break-words">
                                      &nbsp;{FormatDate(x?.startDate)}
                                      &nbsp;{"-"}
                                      {x?.endDate !== null
                                        ? FormatDate(
                                            moment(x?.endDate)
                                              // .subtract(1, "days")
                                              .toDate()
                                          )
                                        : ` To Date`}
                                    </span>
                                  </div>
                                );
                              })
                            : "-"}
                        </div>
                      </li>
                    )}

                    <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                      <span className="text-sm/18px text-black font-bold w-16">
                        Fonction
                      </span>
                      <span className="text-sm/18px text-black font-medium w-[calc(100%_-_64px)] pl-2 text-left break-words">
                        {employeeDetails?.fonction ?? "-"}
                      </span>
                    </li>

                    {activeClientData?.isShowBalance && (
                      <li className="flex justify-between border-b border-primaryRed/10 mb-4 pb-4 last:border-0 last:mb-0 last:pb-0">
                        <span className="text-sm/18px text-black font-bold w-full">
                          Balance at &nbsp;{" "}
                          {employeeDetails?.reliquatDate ?? ""}
                        </span>

                        <span className="text-sm/18px text-black font-medium w-[calc(100%_-_64px)] pl-2 text-left break-words flex items-center gap-x-2">
                          {employeeDetails?.reliquatCalculationValue
                            ? employeeDetails?.reliquatCalculationValue
                            : employeeDetails?.reliquatCalculation &&
                              employeeDetails?.reliquatCalculation?.length > 0
                            ? employeeDetails?.reliquatCalculation[0]?.reliquat
                            : "-"}
                          {(employeeDetails?.reliquatCalculationValue ||
                            (employeeDetails?.reliquatCalculation &&
                              employeeDetails?.reliquatCalculation?.length >
                                0)) &&
                            getPermissions(
                              FeaturesNameEnum.ReliquatCalculation,
                              PermissionEnum.View
                            ) && (
                              // <div onClick={ "/employee/reliquat-calculation"}>
                              <span
                                onClick={() => {
                                  dispatch(
                                    setActiveEmployee(
                                      Number(employeeDetails?.id)
                                    )
                                  );
                                  navigate("/employee/reliquat-calculation");
                                }}
                                className="text-primaryRed cursor-pointer"
                              >
                                <IconEye className="w-5" />
                              </span>
                              // </div>
                            )}
                        </span>
                      </li>
                    )}
                    <li></li>
                    {activeType &&
                      !(
                        employeeDetails?.terminationDate &&
                        moment().diff(
                          moment(employeeDetails?.terminationDate),
                          "seconds"
                        ) > 0
                      ) &&
                      getPermissions(
                        FeaturesNameEnum.EmployeeLeave,
                        PermissionEnum.View
                      ) && (
                        <div className="text-center ">
                          <span
                            className="font-semibold cursor-pointer underline text-primaryRed underline-offset-4"
                            onClick={() => {
                              dispatch(setActiveTab("Titre de Congé"));
                              dispatch(
                                setActiveEmployee(Number(employeeDetails?.id))
                              );
                              navigate("/employee-leave");
                            }}
                          >
                            Titre de Congé
                          </span>
                        </div>
                      )}
                  </ul>
                </div>
              </div>
              {/* {getPermissions(FeaturesNameEnum.Salary, PermissionEnum.View) && (
              <div className="mt-5 pt-5 border-t border-solid border-[#e2e2e2]">
                <span className="text-sm/18px text-black font-bold mb-2 block">
                  Salary
                </span>
                {transformedSalary && transformedSalary?.length > 0 ? (
                  <div className="overflow-auto">
                    <table className="small w-full min-w-[600px]">
                      <thead>
                        <tr>
                          <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                            Base Salary
                          </th>
                          <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                            Monthly Salary
                          </th>
                          <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                            Daily Cost
                          </th>
                          <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transformedSalary?.map(
                          (x: {
                            baseSalary: number;
                            monthlySalary: number;
                            dailyCost: number;
                            startDate: string;
                            endDate: string;
                          }) => (
                            <tr key={Math.floor(Math.random() * 1000) + 1}>
                              <td className="text-grayDark font-medium py-2">
                                {x?.baseSalary +
                                  " " +
                                  employeeDetails?.currencyCode || "-"}
                              </td>
                              <td className="text-grayDark font-medium py-2">
                                {x?.monthlySalary +
                                  " " +
                                  employeeDetails?.currencyCode || "-"}
                              </td>
                              <td className="text-grayDark font-medium py-2">
                                {x?.dailyCost +
                                  " " +
                                  employeeDetails?.currencyCode || "-"}
                              </td>
                              <td className="text-grayDark font-medium py-2">
                                {FormatDate(x?.startDate)}
                                {"-"}
                                {x?.endDate !== null
                                  ? FormatDate(x?.endDate)
                                  : "ToDate"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>-</>
                )}
              </div>
            )} */}
            </div>
          </div>
        </div>
      )}
      {activeModal === activeModelProfile.editFile && modalStatus && (
        <EditFile
          openModal={modalStatus}
          setOpenModal={setModalStatus}
          requiredValues={{
            employeeName: `${String(employeeDetails?.lastName)} ${String(
              employeeDetails?.firstName
            )}`,
            fileDetails: fileToInteract ?? null,
          }}
        />
      )}
      {activeModal === activeModelProfile.addFiles && modalStatus && (
        <AddFile
          openModal={modalStatus}
          setOpenModal={setModalStatus}
          employeeData={employeeDetails ?? null}
        />
      )}
      {activeModal === activeModelProfile.deleteFiles && modalStatus && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setModalStatus(false)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={async () => {
            fileToInteract?.id &&
              (await DeleteEmployeeFile(Number(fileToInteract?.id)));
            setModalStatus(false);
          }}
          confirmationText={`Are you sure you want to delete the file ${fileToInteract?.name}`}
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
      {activeModal === activeModelProfile.terminateEmp && modalStatus && (
        <Modal
          closeModal={() => setModalStatus(false)}
          width="max-w-[564px]"
          modalBodyClass="overflow-unset"
          title="Terminate Employee"
          hideFooterButton={false}
          loaderButton={loader}
          onClickHandler={() => {
            if (formikRef.current) {
              formikRef.current.submitForm();
            }
          }}
        >
          <Formik
            initialValues={{
              terminationDate: new Date(),
            }}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
            onSubmit={terminateEmployee}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="p-6 bg-primaryRed/5 rounded-10 flex justify-between items-center mb-5 last:mb-0">
                  <div className="flex items-center">
                    <DateComponent
                      name="terminationDate"
                      smallFiled
                      label={"Termination Date"}
                      value={values.terminationDate}
                      isCompulsory={true}
                      dateFormat="dd/MM/yyyy"
                      minDate={moment(
                        employeeDetails?.startDate,
                        "DD-MM-YYYY"
                      ).toDate()}
                      maxDate={moment(
                        employeeDetails?.client?.endDate
                      ).toDate()}
                      onChange={(date) => {
                        setFieldValue("terminationDate", date);
                      }}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {activeModal === activeModelProfile.reactivateEmp && modalStatus && (
        <Modal
          closeModal={() => setModalStatus(false)}
          width="max-w-[564px]"
          modalBodyClass="overflow-unset"
          title="Reactivate Employee"
          hideFooterButton={false}
          onClickHandler={() => {
            if (formikRef.current) {
              formikRef.current.submitForm();
            }
          }}
        >
          <Formik
            initialValues={{
              ...employeeDetails,
              terminationDate: employeeDetails?.terminationDate
                ? new Date(employeeDetails?.terminationDate)
                : new Date(),
              startDate: employeeDetails?.terminationDate
                ? new Date(employeeDetails?.terminationDate)
                : new Date(),
            }}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
            onSubmit={reactivateEmployee}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="p-6 bg-primaryRed/5 rounded-10 flex mb-5 last:mb-0">
                  <div className="flex items-center flex-wrap gap-6">
                    <ClientDropdown
                      label="Select Client"
                      parentClass="w-[calc(50%-15px)]"
                      isUpdateGlobal={false}
                      updateFunction={async (newValue) => {
                        await fetchAllSegment(
                          `?` + `clientId=${newValue?.toString()}`
                        );
                        setFieldValue("clientId", newValue);
                      }}
                      isCompulsory={true}
                    />
                    <SelectComponent
                      name="segmentId"
                      isEditable={true}
                      options={segmentOptions}
                      selectedValue={
                        values?.segmentId != null
                          ? values?.segmentId
                          : "Not Selected"
                      }
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("segmentId", (option as Option).value);
                        setFieldValue("subSegmentId", null);
                        setActiveSegmentEmployee((option as Option).value);
                      }}
                      placeholder="Select Segment"
                      label="Select Segment"
                      className="bg-white"
                      isCompulsory={true}
                      parentClass="w-[calc(50%-15px)]"
                    />
                    <SelectComponent
                      name="subSegmentId"
                      isEditable={true}
                      options={subSegmentOptions}
                      selectedValue={
                        values?.segmentId != null
                          ? values?.subSegmentId
                          : "Not Selected"
                      }
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("subSegmentId", (option as Option).value);
                      }}
                      placeholder="Select"
                      label="Select Sub Segment"
                      className="bg-white"
                      parentClass="w-[calc(50%-15px)]"
                    />
                    <SelectComponent
                      name="rotationId"
                      options={rotationOptions}
                      selectedValue={values?.rotationId}
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("rotationId", (option as Option).value);
                      }}
                      placeholder="Select"
                      label={"Select Rotation"}
                      isCompulsory
                      className="bg-white"
                      parentClass="w-[calc(50%-15px)]"
                    />
                    <DateComponent
                      name="reJoiningDate"
                      smallFiled
                      label={"Rejoining Date"}
                      value={values?.startDate}
                      placeholder={"Enter Rejoining Date"}
                      dateFormat="dd/MM/yyyy"
                      parentClass="w-[calc(50%-15px)]"
                      minDate={moment(
                        employeeDetails?.terminationDate,
                        "YYYY-MM-DD"
                      ).toDate()}
                      maxDate={moment(
                        employeeDetails?.client?.endDate
                      ).toDate()}
                      onChange={(date) => {
                        setFieldValue("startDate", date);
                      }}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {activeModal === activeModelProfile.deleteEmp && modalStatus && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setModalStatus(false)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={async () => {
            await DeleteEmployee(Number(employeeDetails?.id));
            setModalStatus(false);
            navigate("/employee/summary");
          }}
          confirmationText={`Are you sure you want to Delete ${employeeDetails?.lastName} ${employeeDetails?.firstName} ?`}
          title="Delete Employee"
        >
          <div className=""></div>
        </Modal>
      )}
      {activeModal === activeModelProfile.editProfile && employeeDetails && (
        <EditProfile
          openModal={modalStatus}
          setOpenModal={setModalStatus}
          profileDetails={employeeDetails}
        />
      )}

      {bonusModal && employeeDetails?.firstName && (
        <CustomBonusHistoryModel
          employeeName={`${employeeDetails?.firstName} ${employeeDetails?.lastName}`}
          customBonus={employeeDetails?.employeeBonus}
          setModel={setBonusModal}
          currencyCode={employeeDetails?.client?.currency}
        />
      )}

      {salaryHistoryModal && employeeDetails?.firstName && (
        <CustomSalaryModel
          employeeName={`${employeeDetails?.firstName} ${employeeDetails?.lastName}`}
          customSalary={transformedSalary}
          setModel={setSalaryHistoryModal}
          currencyCode={employeeDetails?.client?.currency}
          terminationDate={employeeDetails?.terminationDate}
        />
      )}

      {catalogueHistoryModal && employeeDetails?.firstName && (
        <CustomCatalogueModel
          employeeName={`${employeeDetails?.firstName} ${employeeDetails?.lastName}`}
          customCatalogue={employeeDetails?.employeeCatalogueNumber}
          setModel={setCatalogueHistoryModal}
          employeeDetails={employeeDetails}
        />
      )}

      {generatemodal &&
        generateModalData &&
        generateDataModal(generateModalData)}
    </>
  );
};

export default Profile;
