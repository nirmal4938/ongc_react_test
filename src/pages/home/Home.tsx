import DashboardChart from "@/components/dashboardChart/DashboardChart";
import {
  DashboardIconFile,
  DashboardIconFirstAid,
  DashboardIconPPL,
  DashboardIconUser,
  IconEye,
  PlusIcon,
  RightArrowIcon,
} from "@/components/svgIcons";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  GetAllDashboardData,
  GetAllDashboardUsersAccountsData,
  GetAllEmployeeDetails,
  GetDashboardTransportData,
} from "@/services/dashboardService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  chartDropdownOptions,
  employeeFilterOptions,
  userChartDropdownOptions,
} from "@/constants/DropdownConstants";
import { Option } from "@/interface/customSelect/customSelect";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import {
  IDashboardData,
  IDashboardTransportData,
  IEmployeeDashboardData,
} from "@/interface/dashboard/dashboard";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import { Link, useNavigate } from "react-router-dom";
import AddUpdateMedicalRequest from "../medicalRequest/AddUpdateMedicalRequest";
import {
  activeEmployeeSelector,
  setActiveEmployee,
} from "@/redux/slices/employeeSlice";
import AddEmployeeLeave from "../employeeLeave/AddEmployeeLeave";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { usePermission } from "@/context/PermissionProvider";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import SpinLoader from "@/components/SiteLoder/spinLoader";
import { MedicalCheckSection } from "@/components/home/MedicalCheckSection";
import { NoDataFound } from "@/components/home/NoDataFound";
import TransPortBookedDriver from "@/components/home/TransPortBookedDriver";
import TransPortBookedVehicle from "@/components/home/TransPortBookedVehicle";
import ContractEndTable from "@/components/home/ContractEndTable";
import FailedLoginsTable from "@/components/home/FailedLoginsTable";
import MedicalExpiryTable from "@/components/home/MedicalExpiryTable";
import RequestTable from "@/components/home/RequestTable";
import UserChart from "@/components/dashboardChart/UserChart";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPermissions, isCheckEmployee } = usePermission();
  const activeEmployee = useSelector(activeEmployeeSelector);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openLeaveModal, setOpenLeaveModal] = useState<boolean>(false);

  const [selectedChartOption, setSelectedChartOptions] = useState<string>("7");
  const [selectedUserChartOption, setSelectedUserChartOptions] =
    useState<string>("7");
  const [selectedEmployee, setSelectedEmployee] = useState<number>();
  const [employeeOptions, setEmployeeOptions] = useState<Option[]>([]);
  const [employeeData, setEmployeeData] = useState<IEmployeeDashboardData>();
  const [selectedFilterOption, setSelectedFilterOptions] =
    useState<string>("active");
  const [dateData, setDateData] = useState<string[]>([]);
  const [chartValue, setChartValue] = useState<number[]>([]);
  const [userDateData, setUserDateData] = useState<string[]>([]);
  const [userChartValue, setUserChartValue] = useState<number[]>([]);
  const [totalUserAccounts, setTotalUserAccounts] = useState<number>(0);
  const [dashboardData, setDashboardData] = useState<IDashboardData>();
  const [transportData, setTransportData] = useState<IDashboardTransportData>();
  const clientId = useSelector(activeClientSelector);
  const [transportLoader, setTransportLoader] = useState<boolean>(false);
  const [allLoader, setAllLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const queryString =
    `?clientId=${clientId}&limit=5&contractEndFilter=${selectedChartOption}` +
    `&type=${selectedFilterOption}`;

  const queryStringEmployee =
    `?clientId=${clientId}` +
    (selectedEmployee ? `&employeeId=${selectedEmployee}` : "");

  const transportQueryString = `?clientId=${clientId}&limit=4`;

  const usersQueryString = `?clientId=${clientId}&userAccountFilter=${selectedUserChartOption}`;

  useEffect(() => {
    if (clientId) {
      dispatch(showLoader());
      setEmployeeData({});
      getDashboardData(queryString);
      getTransportData(transportQueryString);
      dispatch(hideLoader());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, selectedChartOption, selectedFilterOption]);

  useEffect(() => {
    getUsersData(usersQueryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserChartOption, clientId]);

  useEffect(() => {
    if (selectedEmployee) {
      dispatch(setActiveEmployee(selectedEmployee));
      getEmployeeDetails(queryStringEmployee);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployee]);

  const getEmployeeDetails = async (query: string) => {
    setLoader(true);
    const response = await GetAllEmployeeDetails(query);
    if (response?.data?.response_type === "success") {
      setEmployeeData(response.data.responseData);
    }
    setLoader(false);
  };
  const firstName = employeeData?.employeeName?.loginUserData?.firstName ?? "";
  const lastName = employeeData?.employeeName?.loginUserData?.lastName ?? "";
  const formattedName = formatEmployeeName(firstName, lastName);

  function formatEmployeeName(firstName: string, lastName: string) {
    if (firstName || lastName) {
      return `${lastName} ${firstName}`;
    }
    return "-";
  }

  const getDashboardData = async (query: string) => {
    setAllLoader(true);
    const response = await GetAllDashboardData(query);
    if (response?.data?.response_type === "success") {
      setDashboardData(response.data.responseData);

      const temp = response.data.responseData.employeeDropdownData.map(
        (e: IEmployeeData) => ({
          value: e.id,
          label:
            e?.employeeNumber +
            "-" +
            e?.loginUserData?.lastName +
            " " +
            e?.loginUserData?.firstName,
        })
      );
      setEmployeeOptions(temp.length > 0 ? temp : []);
      setSelectedEmployee(temp.length > 0 ? temp[0].value : 0);
      const arrDateAxis = response.data.responseData.dayWiseCount.map(
        (object: { expiryDate: string; dataCount: number }) => {
          if (selectedChartOption === "365") {
            return moment().month(object?.expiryDate).format("MMM");
          }
          return moment(object.expiryDate).format("MMMM Do");
        }
      );

      setDateData(arrDateAxis);
      const arrCount = response.data.responseData.dayWiseCount.map(
        (object: { expiryDate: string; dataCount: number }) => object.dataCount
      );
      setChartValue(arrCount);
      setAllLoader(false);
    }
  };

  const getTransportData = async (query: string) => {
    setTransportLoader(true);
    const response = await GetDashboardTransportData(query);
    if (response?.data?.response_type === "success") {
      setTransportData(response.data.responseData);
    }
    setTransportLoader(false);
  };

  const getUsersData = async (query: string) => {
    const response = await GetAllDashboardUsersAccountsData(query);
    if (response?.data?.response_type === "success") {
      setTotalUserAccounts(response.data.responseData.getAllUserCount);
      const arrDateAxis = response.data.responseData.dayWiseChartCount.map(
        (object: { date: string; dataCount: number }) => {
          if (selectedUserChartOption === "365") {
            return moment().month(object?.date).format("MMM");
          }
          return moment(object.date).format("MMMM Do");
        }
      );
      setUserDateData(arrDateAxis);
      const arrCount = response.data.responseData.dayWiseChartCount.map(
        (object: { dataCount: number }) => object.dataCount
      );
      setUserChartValue(arrCount);
    }
  };

  const renderLeaveInfo = () => {
    if (employeeData?.employeeName?.employeeLeave !== undefined) {
      return (
        <div className="w-1/2">
          <span className="text-base/6 text-gray-500 block font-medium">
            Titre de Congé{" "}
            {employeeData?.employeeName &&
              employeeData?.employeeName?.employeeLeave?.length > 0 &&
              moment(
                employeeData?.employeeName?.employeeLeave[0]?.startDate
              ).format("DD/MM/YYYY")}
          </span>
        </div>
      );
    }
    return null;
  };

  const renderLeaveActions = () => {
    return (
      <div className="w-1/2">
        <div className="flex items-center">
          {getPermissions(
            FeaturesNameEnum.EmployeeLeave,
            PermissionEnum.View
          ) && (
            <div className="flex items-center ml-10 first:ml-0">
              <Link to={"/employee-leave"}>
                <span className="flex group relative items-center justify-center p-2 w-8 h-8 rounded-full text-primaryRed bg-primaryRed/10">
                  <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                    View
                  </span>
                  <IconEye />
                </span>
              </Link>
            </div>
          )}
          {getPermissions(
            FeaturesNameEnum.EmployeeLeave,
            PermissionEnum.Create
          ) && (
            <div className="flex items-center ml-10 first:ml-0">
              <span
                className="flex group relative items-center justify-center p-1 w-8 h-8 rounded-full text-primaryRed bg-primaryRed/10"
                onClick={() => {
                  setOpenLeaveModal(true);
                }}
              >
                <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                  Add
                </span>
                <PlusIcon />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid 768:grid-cols-2 1200:grid-cols-3  1400:grid-cols-4 1600:grid-cols-5 gap-[20px] group">
        {/* BOX 1 */}
        {getPermissions(FeaturesNameEnum.Employee, PermissionEnum.View) && (
          <div className="bg-blueLight p-4 rounded-10 cursor-pointer group-hover:scale-95 hover:!scale-100 transition-all duration-300 border border-solid border-PrimaryBlue/50">
            <div className="flex">
              <div className="w-20">
                <div className="w-16 h-16 bg-blueFade rounded-full p-2">
                  <span className="flex items-center justify-center bg-PrimaryBlue w-full h-full rounded-full text-white p-2">
                    <DashboardIconPPL className="w-full h-full" />
                  </span>
                </div>

                <Link to={"/employee/summary"}>
                  <span className="capitalize text-xs/4 font-semibold mt-4 block text-PrimaryBlue">
                    Show Details
                  </span>
                </Link>
              </div>
              <div className="w-[calc(100%_-_80px)] pl-4 pt-6px">
                <p className="text-base/7 font-semibold">
                  Total Employee <span>(till date)</span>
                </p>
                <span className="block mt-6px text-32px/9 font-semibold">
                  {dashboardData?.employeeCount ?? "-"}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* BOX 2 */}
        {getPermissions(FeaturesNameEnum.ContractEnd, PermissionEnum.View) && (
          <div className="bg-redLight p-4 rounded-10 cursor-pointer group-hover:scale-95 hover:!scale-100 transition-all duration-300 border border-solid border-primaryRed/50">
            <div className="flex">
              <div className="w-20">
                <div className="w-16 h-16 bg-redFade rounded-full p-2">
                  <span className="flex items-center justify-center bg-primaryRed w-full h-full rounded-full text-white p-2">
                    <DashboardIconFile className="w-full h-full" />
                  </span>
                </div>

                <Link to={"/contract/contract-end"}>
                  <span className="capitalize text-xs/4 font-semibold mt-4 block text-primaryRed ">
                    Show Details
                  </span>
                </Link>
              </div>
              <div className="w-[calc(100%_-_80px)] pl-4 pt-6px">
                <p className="text-base/7 font-semibold ">
                  Total Contract End <span>(till next 30 days)</span>
                </p>
                <span className="block mt-6px text-32px/9 font-semibold">
                  {dashboardData?.totalContractEndCount ?? "-"}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* BOX 3 */}
        {getPermissions(
          FeaturesNameEnum.EmployeeContract,
          PermissionEnum.View
        ) && (
          <div className="bg-redLight p-4 rounded-10 cursor-pointer group-hover:scale-95 hover:!scale-100 transition-all duration-300 border border-solid border-tomatoRed/50">
            <div className="flex">
              <div className="w-20">
                <div className="w-16 h-16 bg-redFade rounded-full p-2">
                  <span className="flex items-center justify-center bg-tomatoRed w-full h-full rounded-full text-white p-2">
                    <DashboardIconFile className="w-full h-full" />
                  </span>
                </div>

                <Link to={"/contract/summary"}>
                  <span className="capitalize text-xs/4 font-semibold mt-4 block text-tomatoRed">
                    Show Details
                  </span>
                </Link>
              </div>
              <div className="w-[calc(100%_-_80px)] pl-4 pt-6px">
                <p className="text-base/7 font-semibold ">
                  Total Contract <span>(till date)</span>
                </p>
                <span className="block mt-6px text-32px/9 font-semibold">
                  {dashboardData?.totalContractCount ?? "-"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BOX 4 */}
        {getPermissions(
          FeaturesNameEnum.MedicalRequest,
          PermissionEnum.View
        ) && (
          <div className="bg-yellowLight p-4 rounded-10 cursor-pointer group-hover:scale-95 hover:!scale-100 transition-all duration-300 border border-solid border-PrimaryYellow/50">
            <div className="flex">
              <div className="w-20">
                <div className="w-16 h-16 bg-yellowFade rounded-full p-2">
                  <span className="flex items-center justify-center bg-PrimaryYellow w-full h-full rounded-full text-white p-2">
                    <DashboardIconFirstAid className="w-full h-full" />
                  </span>
                </div>
                <Link to={"/medical/expiry"}>
                  <span className="capitalize text-xs/4 font-semibold mt-4 block text-PrimaryYellow">
                    Show Details
                  </span>
                </Link>
              </div>
              <div className="w-[calc(100%_-_80px)] pl-4 pt-6px">
                <p className="text-base/7 font-semibold ">
                  Total Medical Expiry <span>(in next 30 days)</span>
                </p>
                {/* <p className="text-lg/7 font-normal">(in next 30 days)</p> */}
                <span className="block mt-6px text-32px/9 font-semibold">
                  {dashboardData?.totalMedicalExpiryCount?.count ?? "-"}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* BOX 5 */}
        {getPermissions(FeaturesNameEnum.Users, PermissionEnum.View) && (
          <div className="bg-greenLight p-4 rounded-10 cursor-pointer group-hover:scale-95 hover:!scale-100 transition-all duration-300 border border-solid border-PrimaryGreen/50">
            <div className="flex">
              <div className="w-20">
                <div className="w-16 h-16 bg-greenFade rounded-full p-2">
                  <span className="flex items-center justify-center bg-PrimaryGreen w-full h-full rounded-full text-white p-2">
                    <DashboardIconUser className="w-full h-full" />
                  </span>
                </div>
                <span
                  className="capitalize text-xs/4 font-semibold mt-4 block text-PrimaryGreen "
                  onClick={() => navigate("/admin/user")}
                >
                  Show Details
                </span>
              </div>
              <div className="w-[calc(100%_-_80px)] pl-4 pt-6px">
                <p className="text-base/7 font-semibold ">
                  Total User Accounts <span>(till date)</span>
                </p>
                <span className="block mt-6px text-32px/9 font-semibold">
                  {totalUserAccounts ?? "-"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isCheckEmployee && (
        <>
          <div className="flex flex-wrap gap-y-30px mt-30px -mx-15px">
            {getPermissions(FeaturesNameEnum.Employee, PermissionEnum.View) && (
              <div className="1200:w-6/12 1400:w-5/12 px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">Find Employee</p>
                  </div>
                  <div className="card-body">
                    <div className="flex flex-wrap gap-4">
                      <SelectComponent
                        label=""
                        parentClass="w-[160px] 1700:w-[250px]"
                        isMulti={false}
                        placeholder=""
                        options={employeeFilterOptions}
                        selectedValue={selectedFilterOption}
                        isCompulsory={true}
                        onChange={(e: Option | Option[]) =>
                          setSelectedFilterOptions(String((e as Option).value))
                        }
                      />
                      <SelectComponent
                        label=""
                        parentClass="w-[160px] 1700:w-[250px]"
                        isMulti={false}
                        placeholder=""
                        options={employeeOptions}
                        selectedValue={selectedEmployee}
                        isCompulsory={true}
                        onChange={(e: Option | Option[]) =>
                          setSelectedEmployee(Number((e as Option).value))
                        }
                      />
                    </div>
                    {loader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!loader && (
                      <div className="list-wrap mt-3 grid grid-flow-row gap-y-5">
                        <div className="flex flex-wrap">
                          <div className="w-1/2">
                            <span className="text-base/6 text-gray-500 block font-medium">
                              Name
                            </span>
                          </div>
                          <div className="w-1/2">
                            <Link
                              to={`/employee/summary/profile/${
                                employeeData?.employeeName?.slug
                                  ? employeeData?.employeeName?.slug
                                  : "#"
                              }`}
                              className="inline-block text-sm/6 font-medium text-primaryRed  underline-offset-2"
                            >
                              {formattedName}
                            </Link>
                          </div>
                        </div>
                        <div className="flex flex-wrap">
                          <div className="w-1/2">
                            <span className="text-base/6 text-gray-500 block font-medium">
                              Contract Number
                            </span>
                          </div>
                          <div className="w-1/2">
                            <span className="inline-block text-sm/6 font-medium text-gray-500">
                              {employeeData?.employeeDetail?.[0]
                                ?.newContractNumber
                                ? employeeData?.employeeDetail?.[0]
                                    ?.newContractNumber
                                : employeeData?.employeeName?.contractNumber
                                ? employeeData?.employeeName?.contractNumber
                                : "-"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap">
                          <div className="w-1/2">
                            <span className="text-base/6 text-gray-500 block font-medium">
                              Segment
                            </span>
                          </div>
                          <div className="w-1/2">
                            <span className="inline-block text-sm/6 font-medium text-gray-500">
                              {employeeData?.employeeName?.segment?.name ?? "-"}
                            </span>
                          </div>
                        </div>

                        {(getPermissions(
                          FeaturesNameEnum.MedicalRequest,
                          PermissionEnum.Create
                        ) ||
                          getPermissions(
                            FeaturesNameEnum.MedicalRequest,
                            PermissionEnum.View
                          )) &&
                          selectedEmployee && (
                            <>
                              <MedicalCheckSection
                                onClick={() => {
                                  setOpenModal(true);
                                }}
                              />
                            </>
                          )}

                        {(getPermissions(
                          FeaturesNameEnum.EmployeeLeave,
                          PermissionEnum.Create
                        ) ||
                          getPermissions(
                            FeaturesNameEnum.EmployeeLeave,
                            PermissionEnum.View
                          )) && (
                          <div className="flex flex-wrap">
                            {selectedEmployee && renderLeaveInfo()}
                            {selectedEmployee && renderLeaveActions()}
                          </div>
                        )}
                        <div className="flex flex-wrap">
                          <div className="w-1/2">
                            <span className="text-base/6 text-gray-500 block font-medium">
                              Balance at {employeeData?.reliquatDate ?? ""}
                            </span>
                          </div>
                          <div className="w-1/2">
                            <div className="flex items-center">
                              <span className="inline-block text-sm/6 font-medium text-gray-500 mr-4">
                                {employeeData?.reliquatCalculation &&
                                employeeData?.reliquatCalculation
                                  ? employeeData?.reliquatCalculation
                                  : "-"}
                              </span>
                              {employeeData?.reliquatCalculation &&
                                employeeData?.reliquatCalculation &&
                                getPermissions(
                                  FeaturesNameEnum.ReliquatCalculation,
                                  PermissionEnum.View
                                ) && (
                                  <Link to={"/employee/reliquat-calculation"}>
                                    <span className="flex group relative items-center justify-center p-2 w-8 h-8 rounded-full text-primaryRed bg-primaryRed/10">
                                      <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                                        View
                                      </span>
                                      <IconEye />
                                    </span>
                                  </Link>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {getPermissions(FeaturesNameEnum.Users, PermissionEnum.View) && (
              <div className="1200:w-6/12 1400:w-7/12 px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">User Accounts</p>
                    <SelectComponent
                      label=""
                      isMulti={false}
                      placeholder=""
                      options={userChartDropdownOptions}
                      selectedValue={selectedUserChartOption}
                      isCompulsory={true}
                      onChange={(e: Option | Option[]) =>
                        setSelectedUserChartOptions(String((e as Option).value))
                      }
                    />
                  </div>
                  <div className="card-body">
                    {allLoader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!allLoader && (
                      <UserChart
                        lineData={userChartValue}
                        dateData={userDateData}
                        isDynamicValue={true}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {getPermissions(
              FeaturesNameEnum.ContractEnd,
              PermissionEnum.View
            ) && (
              <div className="1200:w-6/12 1400:w-7/12 px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">Contract End</p>
                    <SelectComponent
                      label=""
                      isMulti={false}
                      placeholder=""
                      options={chartDropdownOptions}
                      selectedValue={selectedChartOption}
                      isCompulsory={true}
                      onChange={(e: Option | Option[]) =>
                        setSelectedChartOptions(String((e as Option).value))
                      }
                    />
                  </div>
                  <div className="card-body">
                    {allLoader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!allLoader && (
                      <DashboardChart
                        lineData={chartValue}
                        dateData={dateData}
                        isDynamicValue={true}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {getPermissions(
              FeaturesNameEnum.MedicalRequest,
              PermissionEnum.View
            ) && (
              <div className="1200:w-6/12 1400:w-5/12 px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">Medical Expiry</p>
                    {dashboardData &&
                      dashboardData?.totalMedicalExpiryCount?.rows?.length >
                        0 && (
                        <div className="">
                          <Link
                            to="/medical/expiry"
                            className="inline-flex items-center text-PrimaryBlue text-sm/4 font-bold hover:text-black transition-all duration-300"
                          >
                            See all
                            <span className="inline-block w-5 h-5 leading-5 text-center p-1.5 bg-offWhite text-gray-500 ml-2">
                              <RightArrowIcon className="w-full h-full" />
                            </span>
                          </Link>
                        </div>
                      )}
                  </div>
                  <div className="card-body">
                    {allLoader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!allLoader && (
                      <MedicalExpiryTable dashboardData={dashboardData} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-y-30px mt-30px -mx-15px">
            {getPermissions(FeaturesNameEnum.Request, PermissionEnum.View) && (
              <div className="w-full px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">Requests</p>
                    {dashboardData &&
                      dashboardData?.requestData?.rows?.length > 0 && (
                        <div className="">
                          <Link
                            to={"/requests"}
                            className="inline-flex items-center text-PrimaryBlue text-sm/4 font-bold hover:text-black transition-all duration-300"
                          >
                            See all
                            <span className="inline-block w-5 h-5 leading-5 text-center p-1.5 bg-offWhite text-gray-500 ml-2">
                              <RightArrowIcon className="w-full h-full" />
                            </span>
                          </Link>
                        </div>
                      )}
                  </div>
                  <div className="card-body">
                    {allLoader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!allLoader && (
                      <RequestTable dashboardData={dashboardData} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-y-30px mt-30px -mx-15px">
            {getPermissions(
              FeaturesNameEnum.ContractEnd,
              PermissionEnum.View
            ) && (
              <div className="1200:w-6/12 1400:w-6/12 px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">Contract End</p>
                    {dashboardData &&
                      dashboardData?.totalContractEndData?.length > 0 && (
                        <div className="">
                          <Link
                            to={"/contract/contract-end"}
                            className="inline-flex items-center text-PrimaryBlue text-sm/4 font-bold hover:text-black transition-all duration-300"
                          >
                            See all
                            <span className="inline-block w-5 h-5 leading-5 text-center p-1.5 bg-offWhite text-gray-500 ml-2">
                              <RightArrowIcon className="w-full h-full" />
                            </span>
                          </Link>
                        </div>
                      )}
                  </div>
                  <div className="card-body">
                    {allLoader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!allLoader && (
                      <ContractEndTable dashboardData={dashboardData} />
                    )}
                  </div>
                </div>
              </div>
            )}
            {(getPermissions(
              FeaturesNameEnum.TransportVehicle,
              PermissionEnum.View
            ) ||
              getPermissions(
                FeaturesNameEnum.TransportRequest,
                PermissionEnum.View
              )) && (
              <div className="1200:w-6/12 1400:w-1/2 px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">
                      Transport Availability{" "}
                      <span className="text-sm font-normal text-black/60">
                        (Today)
                      </span>
                    </p>
                    <div className=""></div>
                  </div>
                  <div className="card-body">
                    {transportLoader ? (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    ) : (
                      <>
                        {transportData &&
                        transportData?.availableDriverData.length > 0 &&
                        transportData?.availableVehicleData.length > 0 ? (
                          <div className="grid grid-cols-2 gap-5">
                            <div className="table-wrapper overflow-x-auto">
                              {transportData?.availableVehicleData.length >
                                0 && (
                                <table className="small w-full">
                                  <thead>
                                    <tr>
                                      <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                                        Vehicle
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {transportData?.availableVehicleData.map(
                                      (item) => (
                                        <tr key={item.id}>
                                          <td className="text-grayDark font-medium py-2">
                                            {item.vehicleNo}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              )}
                            </div>
                            <div className="table-wrapper overflow-x-auto">
                              {transportData?.availableDriverData.length >
                                0 && (
                                <table className="small w-full">
                                  <thead>
                                    <tr>
                                      <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                                        Driver
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {transportData?.availableDriverData.map(
                                      (item) => (
                                        <tr key={item.id}>
                                          <td className="text-grayDark font-medium py-2">
                                            {item.driverNo}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </div>
                        ) : (
                          <NoDataFound />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {getPermissions(
              FeaturesNameEnum.TransportVehicle,
              PermissionEnum.View
            ) && (
              <div className="1200:w-6/12 1400:w-1/2 px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">
                      Booked Transport Vehicles
                    </p>

                    <div className="">
                      <Link
                        to={"/transport/vehicles"}
                        className="inline-flex items-center text-PrimaryBlue text-sm/4 font-bold hover:text-black transition-all duration-300"
                      >
                        See all
                        <span className="inline-block w-5 h-5 leading-5 text-center p-1.5 bg-offWhite text-gray-500 ml-2">
                          <RightArrowIcon className="w-full h-full" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    {transportLoader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!transportLoader && (
                      <TransPortBookedVehicle transportData={transportData} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {getPermissions(
              FeaturesNameEnum.TransportDriver,
              PermissionEnum.View
            ) && (
              <div className="1200:w-6/12 1400:w-1/2 px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">
                      Booked Transport Drivers
                    </p>

                    <div className="">
                      <Link
                        to={"/transport/drivers"}
                        className="inline-flex items-center text-PrimaryBlue text-sm/4 font-bold hover:text-black transition-all duration-300"
                      >
                        See all
                        <span className="inline-block w-5 h-5 leading-5 text-center p-1.5 bg-offWhite text-gray-500 ml-2">
                          <RightArrowIcon className="w-full h-full" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    {transportLoader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!transportLoader && (
                      <TransPortBookedDriver transportData={transportData} />
                    )}
                  </div>
                </div>
              </div>
            )}
            {getPermissions(
              FeaturesNameEnum.ErrorLogs,
              PermissionEnum.View
            ) && (
              <div className="w-full px-15px">
                <div className="bg-white py-4 px-5 rounded-10 shadow-md flex flex-col gap-y-4 h-full">
                  <div className="card-head flex justify-between">
                    <p className="text-xl/7 font-semibold">Failed Logins</p>
                    {/* {dashboardData &&
                      dashboardData?.failedLoginData?.length > 0 && (
                        <div className="">
                          <Link
                            to={"/admin/error-logs"}
                            className="inline-flex items-center text-PrimaryBlue text-sm/4 font-bold hover:text-black transition-all duration-300"
                          >
                            See all
                            <span className="inline-block w-5 h-5 leading-5 text-center p-1.5 bg-offWhite text-gray-500 ml-2">
                              <RightArrowIcon className="w-full h-full" />
                            </span>
                          </Link>
                        </div>
                      )} */}
                  </div>
                  <div className="card-body">
                    {allLoader && (
                      <div className="justify-center mt-5 text-center">
                        <SpinLoader />
                      </div>
                    )}
                    {!allLoader && (
                      <FailedLoginsTable dashboardData={dashboardData} />
                    )}
                  </div>
                </div>
              </div>
            )}
            {openModal && (
              <AddUpdateMedicalRequest
                employeeId={Number(activeEmployee)}
                openModal={openModal}
                setOpenModal={setOpenModal}
              />
            )}
            {openLeaveModal && (
              <AddEmployeeLeave
                employeeId={Number(activeEmployee)}
                openModal={openLeaveModal}
                setOpenModal={setOpenLeaveModal}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
