import TimesheetFilter from "@/components/filter/TimesheetFilter";
import Button from "@/components/formComponents/button/Button";
import GroupSelectComponent from "@/components/formComponents/customSelect/GroupSelect";
import generateDataModal from "@/components/generateModal/generateModal";
import SearchBar from "@/components/searchbar/SearchBar";
import TimesheetTable from "@/components/table/TimesheetTable";
import { groupedOptions } from "@/constants/CommonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { IBonusTypeData } from "@/interface/bonusType/bonusTypeInterface";
import { GroupOption, Option } from "@/interface/customSelect/customSelect";
import {
  activeClientSelector,
  clientDataSelector,
} from "@/redux/slices/clientSlice";
import { currentPageSelector } from "@/redux/slices/paginationSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  GetAllEmployeeSuggestiveDropdownData,
  GetEmployeeCustomBonus,
} from "@/services/employeeService";
import { socketSelector } from "@/redux/slices/socketSlice";
import {
  GetAllTimesheetSchedule,
  UpdateTimesheetSchedule,
} from "@/services/timesheetScheduleService";
import { ApproveTimesheet } from "@/services/timesheetService";
import {
  DefaultState,
  FeaturesNameEnum,
  ModuleType,
  PermissionEnum,
} from "@/utils/commonConstants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmployeeSearchDropdown } from "@/redux/slices/employeeSearchDropdownSlice";
import { useLocation } from "react-router-dom";
import { IClientData } from "@/interface/client/clientInterface";
import { ITimesheetScheduleTableData } from "@/interface/timesheet/timesheetInterface";
import TextField from "@/components/formComponents/textField/TextField";
import { Form, Formik, FormikProps, FormikValues } from "formik";

const TimesheetUpdate = () => {
  const socket = useSelector(socketSelector);
  const formikRef = useRef<FormikProps<FormikValues>>();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.TimesheetModify ? pageState?.value : null;
  const activeClient = useSelector(activeClientSelector);
  const clientDetails = useSelector(clientDataSelector);
  const activeClientData: IClientData =
    clientDetails?.find((a: IClientData) => String(a?.id) == activeClient) ??
    {};
  let currentPage = useSelector(currentPageSelector);
  currentPage =
    pageState?.state == DefaultState.TimesheetModify
      ? pageStateData?.page ?? 1
      : currentPage;
  const {
    state,
  }: {
    state: {
      startDate: string | undefined;
      endDate: string | undefined;
      type: string;
      value: string;
      search?: string;
    };
  } = useLocation();
  const dispatch = useDispatch();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [newStatus, setNewStatus] = useState<string | number>();
  const [isBonus, setIsBonus] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [activeDateDropdown, setActiveDateDropdown] = useState<{
    position: number;
    startDate: string | Date;
    endDate: string | Date;
  }>({
    position: 0,
    startDate: pageStateData?.startDate ?? "",
    endDate: pageStateData?.endDate ?? "",
  });

  useEffect(() => {
    state?.search && setSearchText(state.search);
  }, [state]);

  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState<{
    type: string;
    id: number | string;
  }>({
    type: pageStateData?.type ?? "",
    id: pageStateData?.id ?? "",
  });
  const [generatemodal, setGenerateModal] = useState<boolean>(false);
  const [employeeDetails, setEmployeeDetails] = useState<
    ITimesheetScheduleTableData[]
  >([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [optionDropdown, setOptionDropdown] = useState<GroupOption[]>([]);
  const [bonusDropdown, setBonusDropdown] = useState<GroupOption[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>(
    pageStateData?.search ?? ""
  );
  const [prevSearch, setPrevSearch] = useState<string>(
    pageStateData?.search ?? ""
  );
  const [generateModalData, setGenerateModalData] = useState<{
    percentage: number;
    type: string;
    message: string;
  } | null>(null);
  const [overtimeHours, setOvertimeHours] = useState<number | null>(null);
  const [isCallOutRotation, setIsCallOutRotation] = useState<boolean>(false);

  let queryString: string | null = "";
  const handleSearch = async (value?: string) => {
    const search = value ? value.trim() : searchText.trim();
    if (pageStateData) {
      setPageState({
        state: DefaultState.TimesheetModify as string,
        value: {
          ...pageStateData,
          page: 1,
          search: search,
        },
      });
    }
    queryString = queryString + `&search=${search}`;
    if (search === prevSearch.trim()) return;
    else {
      setPrevSearch(search.trim());
      await fetchAllDropdownDetailsWithDate(
        activeDateDropdown?.startDate,
        activeDateDropdown?.endDate,
        activeCategoryDropdown?.type,
        queryString
      );
    }
  };

  async function clearSearch() {
    setPrevSearch("");
    setSearchText("");
    queryString = `&search=`;
    await fetchAllDropdownDetailsWithDate(
      activeDateDropdown?.startDate,
      activeDateDropdown?.endDate,
      activeCategoryDropdown?.type,
      queryString
    );
  }

  useEffect(() => {
    if (employeeDetails.length == 0) {
      dispatch(showLoader());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedIndexes([]);
    setNewStatus("");
    setOvertimeHours(null);
  }, [activeClientData]);

  useEffect(() => {
    if (activeDateDropdown?.startDate && activeDateDropdown?.endDate) {
      fetchAllDropdownDetailsWithDate(
        activeDateDropdown?.startDate,
        activeDateDropdown?.endDate,
        activeCategoryDropdown?.type,
        `&search=${searchText.trim()}`
      );
      setChecked([]);
    }
    setPageState({
      state: DefaultState.TimesheetModify as string,
      value: {
        ...pageStateData,
        page:
          pageStateData?.type != activeCategoryDropdown?.type ||
          pageStateData?.startDate != activeDateDropdown?.startDate
            ? 1
            : pageStateData?.page ?? 1,
        limit: limit,
        startDate: activeDateDropdown?.startDate,
        endDate: activeDateDropdown?.endDate,
        type: activeCategoryDropdown?.type,
        id: activeCategoryDropdown?.id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeDateDropdown,
    activeCategoryDropdown,
    currentPage,
    limit,
    reload,
    activeClient,
  ]);

  useEffect(() => {
    fetchOvertimeHours(selectedEmployees);
    const employeeId = [...new Set(selectedEmployees)];
    const employeeCheck = employeeDetails?.filter(
      (employee) =>
        employee?.employeeDetails?.rotation?.name == "Call Out" &&
        employee?.employeeDetails?.id &&
        employeeId?.includes(employee?.employeeDetails?.id)
    );
    if (employeeCheck?.length > 0) {
      setIsCallOutRotation(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndexes, selectedEmployees]);

  useEffect(() => {
    fetchEmployeeCustomBonus(selectedEmployees);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployees]);

  const buildQuery = () => {
    let query = `?startDate=${activeDateDropdown?.startDate}&endDate=${
      activeDateDropdown?.endDate
    }&activeTab=${activeCategoryDropdown?.type}&limit=${limit}&page=${
      currentPage || 1
    }&clientId=${activeClient}`;
    if (activeCategoryDropdown?.type === "segment") {
      query += `&segmentId=${activeCategoryDropdown?.id}`;
    }
    if (activeCategoryDropdown?.type === "subsegment") {
      query += `&subSegmentId=${activeCategoryDropdown?.id}`;
    }
    return query;
  };

  const fetchAllDropdownDetailsWithDate = async (
    startDate: null | Date | string = null,
    endDate: null | Date | string = null,
    active: null | string = null,
    searchQuery?: string
  ) => {
    setLoader(true);
    const groupResp = await groupedOptions(
      // getPermissions(FeaturesNameEnum.BonusType, PermissionEnum.Update),
      activeClientData.isCountCR
    );
    setOptionDropdown(groupResp);
    if (activeClient) {
      if (startDate && endDate && active) {
        let query = buildQuery();
        const searchParam = pageStateData?.search
          ? `&search=${pageStateData?.search}`
          : ``;
        query = searchQuery ? query + searchQuery : query + searchParam;
        setLoader(true);
        const resp = await GetAllTimesheetSchedule(query);
        if (resp.data.responseData.data.length) {
          setEmployeeDetails(resp.data.responseData.data);
          setTotalPageCount(resp.data.responseData.lastPage);
          setTotalCount(resp?.data?.responseData?.totalCount || null);
        } else {
          setEmployeeDetails([]);
        }
        const dropdownQuery = `?clientId=${activeClient}`;
        const dropdownResponse = await GetAllEmployeeSuggestiveDropdownData(
          dropdownQuery
        );
        if (dropdownResponse?.data?.responseData) {
          const result = dropdownResponse?.data?.responseData;
          dispatch(setEmployeeSearchDropdown(result));
        }
      }
    }
    setLoader(false);
    dispatch(hideLoader());
  };

  const getTimesheetStatus = () => {
    if (checked?.length > 0) {
      if (
        moment(activeDateDropdown.endDate, "DD-MM-YYYY")
          .subtract(1, "month")
          .isBefore(moment()) &&
        moment(activeDateDropdown.endDate, "DD-MM-YYYY")
          .subtract(10, "days")
          .isBefore(moment())
      ) {
        return (
          <Button
            onClickHandler={async () => {
              setBtnLoader(true);
              setGenerateModal(true);
              await ApproveTimesheet({
                timesheetIds: checked,
                status: "APPROVED",
                startDate: activeDateDropdown?.startDate,
                endDate: activeDateDropdown?.endDate,
              });

              setBtnLoader(false);
              setGenerateModal(false);
              setGenerateModalData(null);
              setChecked([]);
              setReload(!reload);
            }}
            parentClass=""
            variant={"primary"}
            loader={btnLoader}
          >
            Approve Timesheet
          </Button>
        );
      }
    }
  };

  socket?.on("generate-modal-data", (data) => {
    setGenerateModalData(data);
  });

  const fetchOvertimeHours = async (employeeId: number[]) => {
    let finalOvertimeHours = 0;
    employeeId = [...new Set(employeeId)];
    const employeeCheck = employeeDetails?.filter(
      (employee) =>
        employee?.employeeDetails?.rotation?.name == "Call Out" &&
        employee?.employeeDetails?.id &&
        employeeId?.includes(employee?.employeeDetails?.id) &&
        employee?.rows?.findIndex(
          (e) => e.overtimeHours !== null && selectedIndexes.includes(e.id)
        ) >= 0
    );
    if (employeeCheck.length > 0) {
      const firstOvertimeIndex = employeeCheck[0].rows.findIndex(
        (rowData) =>
          rowData?.overtimeHours !== null &&
          selectedIndexes.includes(rowData?.id)
      );
      if (firstOvertimeIndex >= 0) {
        const prev = employeeCheck[0]?.rows[firstOvertimeIndex]?.overtimeHours;
        const result = employeeCheck.filter(
          (employeeData) =>
            employeeData?.rows.findIndex(
              (rowData) =>
                rowData?.overtimeHours !== prev &&
                rowData?.overtimeHours !== null &&
                selectedIndexes.includes(rowData.id)
            ) >= 0
        );
        if (result.length <= 0) {
          finalOvertimeHours = prev;
        }
      }
    }
    setOvertimeHours(finalOvertimeHours);
  };

  const fetchEmployeeCustomBonus = async (employeeId: number[]) => {
    employeeId = [...new Set(employeeId)];
    const employeeCheck = employeeDetails?.filter(
      (employee) =>
        employee?.employeeDetails?.rotation?.name == "Call Out" &&
        employee?.employeeDetails?.id &&
        employeeId?.includes(employee?.employeeDetails?.id)
    );
    const resp = await GetEmployeeCustomBonus({
      employeeId: employeeId,
      startDate: activeDateDropdown.startDate,
      endDate: activeDateDropdown.endDate,
    });
    const index = optionDropdown.findIndex(
      (opt) => opt.label === "Custom Bonus"
    );
    let responseArray: Option[] = [];
    responseArray = resp.data.responseData?.map((data: IBonusTypeData) => {
      return {
        label: `${data?.code} - ${data?.name}`,
        value: data?.code,
        type: true,
      };
    });
    if (responseArray?.length) {
      responseArray.unshift({
        value: "CLEARCB",
        label: "  - Clear Custom Bonus",
      });
    }
    if (optionDropdown?.length > 0) {
      if (index !== -1) {
        optionDropdown[index].options = responseArray;
      } else {
        optionDropdown[index].options = [];
      }
    }
    if (employeeCheck.length == employeeId.length) {
      const newOption = optionDropdown.filter(
        (option) => option.label === "Custom Bonus"
      );
      newOption.push({
        label: "Hours Worked",
        options: [
          {
            value: "H",
            label: "H - Hours Worked",
            type: true,
          },
          { value: "CLEARFIELD", label: " -  Clear Field" },
        ],
      });
      setBonusDropdown(newOption);
    } else {
      setBonusDropdown(optionDropdown);
    }
  };

  const OnSubmit = async (values: FormikValues) => {
    const data = {
      scheduleIds: selectedIndexes,
      updateStatus: newStatus,
      isBonus,
      ...(newStatus === "H" &&
        isCallOutRotation && {
          overtimeHours: values?.hourlyOvertimeHours,
        }),
    };
    setLoader(true);
    setGenerateModal(true);
    await UpdateTimesheetSchedule(data);
    setSelectedIndexes([]);
    setReload(!reload);
    setLoader(false);
    setGenerateModal(false);
    setGenerateModalData(null);
  };
  return (
    <>
      <div className="main-table">
        <div className="flex justify-between mb-4">
          <div className="flex flex-wrap 1400:flex-nowrap gap-4 items-center">
            <TimesheetFilter
              setActiveDateDropdownProp={setActiveDateDropdown}
              setActiveCategoryDropdownProp={setActiveCategoryDropdown}
              activeDateDropdownProp={activeDateDropdown}
              activeCategoryDropdownProp={activeCategoryDropdown}
              setLoader={setLoader}
              startDate={state?.startDate}
              type={state?.type}
              value={state?.value}
              module={DefaultState.TimesheetModify}
            />
            <SearchBar
              inputClass="!w-[300px]"
              searchText={searchText}
              prevSearch={prevSearch}
              setSearchText={setSearchText}
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              moduleType={ModuleType?.TIMESHEET}
            />
          </div>
          {employeeDetails.length > 0 &&
            (selectedIndexes.length > 1 &&
            getPermissions(
              FeaturesNameEnum.Timesheet,
              PermissionEnum.Update
            ) ? (
              <div className="flex flex-wrap 1400:flex-nowrap gap-4 items-center">
                <GroupSelectComponent
                  options={bonusDropdown || []}
                  parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
                  onChange={(option: Option) => {
                    setIsBonus(option?.type || false);
                    if (!Array.isArray(option)) setNewStatus(option.value);
                  }}
                  selectedValue={newStatus}
                  className="bg-white"
                />
                {newStatus && (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      hourlyOvertimeHours: overtimeHours ?? 0,
                    }}
                    innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
                    onSubmit={OnSubmit}
                  >
                    {({ values }) => (
                      <Form>
                        <div
                          className={`${
                            newStatus === "H" && isCallOutRotation
                              ? "grid grid-cols-2 gap-5"
                              : ""
                          }`}
                        >
                          {newStatus === "H" && isCallOutRotation && (
                            <TextField
                              smallFiled
                              name="hourlyOvertimeHours"
                              type="number"
                              placeholder="Enter no. of hours"
                              value={values.hourlyOvertimeHours}
                              className="grid grid-cols-1/2"
                              max={24}
                              min={1}
                            />
                          )}
                          <Button
                            type="submit"
                            parentClass=""
                            variant={"primary"}
                            loader={loader}
                            className="grid grid-cols-1/2"
                          >
                            Update
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
            ) : (
              getPermissions(
                FeaturesNameEnum.Timesheet,
                PermissionEnum.Approve
              ) && getTimesheetStatus()
            ))}
        </div>
        {activeCategoryDropdown?.type && (
          <TimesheetTable
            startDate={activeDateDropdown.startDate}
            endDate={activeDateDropdown.endDate}
            dateDetails={employeeDetails}
            selectedIndexes={selectedIndexes}
            setSelectedIndexes={setSelectedIndexes}
            selectedEmployeeIds={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
            reload={() => setReload(!reload)}
            checked={checked}
            setChecked={setChecked}
            setLimit={setLimit}
            limit={limit}
            totalPage={totalPageCount}
            optionDropdown={bonusDropdown}
            loader={loader}
            activeCategory={activeCategoryDropdown.type}
            setGenerateModal={setGenerateModal}
            setGenerateModalData={setGenerateModalData}
            totalCount={totalCount}
            currentPage={currentPage}
            paginationModule={DefaultState.TimesheetModify}
          />
        )}
      </div>
      {generatemodal &&
        generateModalData &&
        generateDataModal(generateModalData)}
    </>
  );
};

export default TimesheetUpdate;
