import React, { useEffect, useRef, useState } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import {
  ITimesheetPdfData,
  TimesheetDataDropdown,
} from "@/interface/timesheet/timesheetInterface";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  ApproveTimesheet,
  GetAllTimesheet,
  GetTimesheetSummary,
} from "@/services/timesheetService";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import TimesheetFilter from "@/components/filter/TimesheetFilter";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultRoles,
  DefaultState,
  FeaturesNameEnum,
  ModuleType,
  PermissionEnum,
} from "@/utils/commonConstants";
import {
  PDFDownloadButton,
  ViewButton,
  CrossButton,
} from "@/components/CommonComponents";
import { TimesheetPdf } from "@/components/pdfDownload/components/TimesheetPdf";
import PDFGenerator from "@/components/pdfDownload/PDFGenerator";
import { CroosIcon, DownTriangleIcon } from "@/components/svgIcons";
import SpinLoader from "@/components/SiteLoder/spinLoader";
import { FormatDate } from "@/helpers/Utils";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/modal/Modal";
import { SegmentTimesheetPdf } from "@/components/pdfDownload/components/SegmentTimesheetPDF";
import { userSelector } from "@/redux/slices/userSlice";
import SearchBar from "@/components/searchbar/SearchBar";
import { GetAllEmployeeSuggestiveDropdownData } from "@/services/employeeService";
import { setEmployeeSearchDropdown } from "@/redux/slices/employeeSearchDropdownSlice";
import { socketSelector } from "@/redux/slices/socketSlice";
import generateDataModal from "@/components/generateModal/generateModal";

const Timesheet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSelector(socketSelector);
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.Timesheet ? pageState?.value : null;
  const pdfExportRef = useRef<PDFExport>(null);
  const activeClient = useSelector(activeClientSelector);
  const user = useSelector(userSelector);
  const [loader, setLoader] = useState<boolean>(false);
  const [exportFlag, setExportFlag] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const [timesheetIds, setTimesheetIds] = useState<number[]>([]); // Unapprove Timesheet IDs
  const [generatemodal, setGenerateModal] = useState<boolean>(false);
  const [generateModalData, setGenerateModalData] = useState<{
    percentage: number;
    type: string;
    message: string;
  } | null>(null);
  const [isMultipleTimesheet, setIsMultipleTimesheet] =
    useState<boolean>(false);
  const [reFetch, setRefetch] = useState(false);
  const [PDFExportFileName, setPDFExportFileName] = useState<string>("");
  const [timesheetDetails, setTimesheetDetails] = useState<ITimesheetPdfData[]>(
    []
  );
  const [segmentWiseTimesheet, setSegmentWiseTimesheet] = useState<
    {
      id: string;
      name: string;
      timesheetData: TimesheetDataDropdown[];
    }[]
  >([]);
  const [activeDropdownData, setActiveDropdownData] = useState<string[]>(
    pageStateData?.activeDropdown ? pageStateData?.activeDropdown : []
  );

  const [activeDateDropdown, setActiveDateDropdown] = useState<{
    position: number;
    startDate: string | Date;
    endDate: string | Date;
  }>({
    position: 0,
    startDate: pageStateData?.startDate ?? "",
    endDate: pageStateData?.endDate ?? "",
  });

  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState<{
    type: string;
    id: number | string;
  }>({
    id: pageStateData?.id ?? "",
    type: pageStateData?.type ?? "",
  });

  const [searchText, setSearchText] = useState<string>(
    pageStateData?.search ?? ""
  );
  const [prevSearch, setPrevSearch] = useState<string>(
    pageStateData?.search ?? ""
  );

  let queryString: string | null = "";
  const handleSearch = async (value?: string) => {
    const search = value ? value.trim() : searchText.trim();
    if (pageStateData) {
      setPageState({
        state: DefaultState.Timesheet as string,
        value: {
          ...pageStateData,
          search: search,
        },
      });
    }
    queryString = queryString + `&search=${search}`;
    if (search === prevSearch.trim()) return;
    else {
      setPrevSearch(search.trim());
      await fetchAllTimesheet(queryString);
    }
  };

  async function clearSearch() {
    setPrevSearch("");
    setSearchText("");
    queryString = `&search=`;
    await fetchAllTimesheet(queryString);
  }

  const handlePDFExport = async (id: number[]) => {
    if (id.length) {
      const response = await GetTimesheetSummary(
        `?id=${id}&startDate=${activeDateDropdown?.startDate}&endDate=${activeDateDropdown?.endDate}`
      );
      if (response.data.response_type === "success") {
        setExportFlag(true);
        setTimesheetDetails(response.data.responseData);
      }
    }
  };

  useEffect(() => {
    dispatch(showLoader());
    fetchAllTimesheet();

    setPageState({
      state: DefaultState.Timesheet,
      value: {
        ...pageStateData,
        startDate: activeDateDropdown?.startDate,
        endDate: activeDateDropdown?.endDate,
        type: activeCategoryDropdown?.type,
        id: activeCategoryDropdown?.id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient, activeDateDropdown, activeCategoryDropdown, reFetch]);

  useEffect(() => {
    if (pdfExportRef.current && exportFlag) {
      pdfExportRef.current.save();
      setExportFlag(false);
    }
  }, [exportFlag]);

  async function fetchAllTimesheet(query?: string) {
    setLoader(true);
    if (
      activeClient &&
      activeCategoryDropdown?.type &&
      activeDateDropdown?.startDate &&
      activeDateDropdown?.endDate
    ) {
      let queryString = `?clientId=${activeClient}&startDate=${activeDateDropdown?.startDate}&endDate=${activeDateDropdown?.endDate}&activeTab=${activeCategoryDropdown?.type}`;
      if (activeCategoryDropdown?.type === "segment") {
        queryString += `&segmentId=${activeCategoryDropdown?.id}`;
      }
      if (activeCategoryDropdown?.type === "subsegment") {
        queryString += `&subSegmentId=${activeCategoryDropdown?.id}`;
      }
      const searchParam = pageStateData?.search
        ? `&search=${pageStateData?.search}`
        : ``;
      queryString = query ? queryString + query : queryString + searchParam;
      const response: {
        data: {
          responseData: {
            data: TimesheetDataDropdown[];
            count: number;
            lastPage: number;
          };
        };
      } = await GetAllTimesheet(queryString);
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        const tempData = result?.data?.map((data: TimesheetDataDropdown) => {
          data.employeeName = data.employee
            ? `${data?.employee?.loginUserData?.lastName} ${data?.employee?.loginUserData?.firstName}`
            : null;
          data.dateRange = `${moment(data?.startDate).format(
            "DD/MM/YYYY"
          )} - ${moment(data.endDate).format("DD/MM/YYYY")}`;
          data.segmentName = data?.segment ? data.segment.name : null;
          if (data.subSegment) {
            data.segmentName = data?.subSegment?.segment
              ? data?.subSegment?.segment?.name
              : null;
          }
          data.subSegmentName = data?.subSegment ? data.subSegment.name : null;
          if (activeCategoryDropdown?.type == "all") {
            data.employeeName =
              data?.employeeName +
              (data?.employee?.deletedAt ? ` ( Deleted )` : "");
            // if (
            //   checkContractExpiry(data) ||
            //   moment(data?.employee?.contractEndDate)?.isBefore(moment())
            // ) {
            //   data.employeeName = `<span style="color:red">${data.employeeName}</span>`;
            // }
          }
          return data;
        });
        const segmentList: {
          id: string;
          name: string;
          timesheetData: TimesheetDataDropdown[];
        }[] = [];
        for (const segmentData of tempData) {
          if (segmentData?.segment?.id) {
            const sData = {
              id:
                `${segmentData?.segment?.id}` +
                (segmentData?.subSegment?.id
                  ? `-${segmentData?.subSegment?.id}`
                  : ""),
              name:
                `${segmentData.segment.name}` +
                (segmentData?.subSegment?.name
                  ? `-${segmentData?.subSegment?.name}`
                  : ""),
              timesheetData: [],
            };
            const findIndex = segmentList.findIndex(
              (slist) => slist.id == sData.id
            );
            if (findIndex == -1)
              segmentList.push({ ...sData, timesheetData: [segmentData] });
            else {
              segmentList[findIndex] = {
                ...segmentList[findIndex],
                timesheetData: [
                  ...segmentList[findIndex].timesheetData,
                  segmentData,
                ],
              };
            }
          }
        }
        setSegmentWiseTimesheet(segmentList);
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
    setLoader(false);
    dispatch(hideLoader());
  }

  // const checkContractExpiry = (data: TimesheetDataDropdown) => {
  //   if (
  //     data?.employee?.employeeContracts &&
  //     data?.employee?.employeeContracts?.length > 0
  //   ) {
  //     if (
  //       data?.employee?.employeeContracts?.findIndex(
  //         (dat) =>
  //           moment(dat.endDate).isSameOrBefore(
  //             moment(activeDateDropdown.endDate, "DD-MM-YYYY")
  //           ) &&
  //           moment(dat.endDate).isSameOrAfter(
  //             moment(activeDateDropdown.startDate, "DD-MM-YYYY")
  //           )
  //       ) > -1
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // };

  socket?.on("generate-modal-data", (data) => {
    setGenerateModalData(data);
  });

  const renderFileRow = (itemData: TimesheetDataDropdown) => (
    <tr key={itemData.employee.id}>
      <td className="py-3">{itemData.dateRange}</td>
      <td
        className="py-3 font-medium text-sm/18px break-words"
        dangerouslySetInnerHTML={{
          __html: `${itemData.employeeName}`,
        }}
      ></td>
      <td className="py-3 font-medium text-sm/18px break-words">
        {itemData.status}
      </td>
      <td className="py-3  font-medium text-sm/18px break-words">
        <div className="flex items-center gap-1.5 justify-end">
          {itemData.status === "APPROVED" &&
            getPermissions(FeaturesNameEnum.Timesheet, PermissionEnum.View) && (
              <>
                <PDFDownloadButton
                  onClickHandler={() => {
                    setIsMultipleTimesheet(false);
                    handlePDFExport([itemData.id]);
                    setPDFExportFileName(itemData.dateRange);
                  }}
                />
                {user?.roleData.name === DefaultRoles.Admin &&
                  getPermissions(
                    FeaturesNameEnum.Timesheet,
                    PermissionEnum.Update
                  ) && (
                    <span
                      className="w-25 h-7 group relative bg-primaryRed/10 text-primaryRed p-0.5 inline-flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer"
                      onClick={async () => {
                        setConfirmationModal(true);
                        setTimesheetIds([itemData.id]);
                      }}
                    >
                      <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                        Unapprove
                      </span>
                      <CroosIcon className="" />
                    </span>
                  )}
              </>
            )}
        </div>
      </td>
    </tr>
  );

  const updateActiveDropdownData = (id: string) => {
    const index = activeDropdownData.indexOf(id);
    if (index !== -1) {
      activeDropdownData.splice(index, 1);
    } else {
      activeDropdownData.push(id);
    }
    setActiveDropdownData(activeDropdownData);
    setPageState({
      state: DefaultState.Timesheet as string,
      value: {
        ...pageStateData,
        activeDropdown: activeDropdownData,
      },
    });
  };

  const renderFolderRows = () => {
    if (loader) {
      return (
        <tr>
          <td>
            <div className="relative w-full h-14 flex items-center justify-center">
              <SpinLoader />
            </div>
          </td>
        </tr>
      );
    } else if (segmentWiseTimesheet && segmentWiseTimesheet.length > 0) {
      return segmentWiseTimesheet.map((data) => {
        if (data?.timesheetData.length) {
          const timesheetDataList = data?.timesheetData;
          return (
            <React.Fragment key={data.id}>
              <tr>
                <td
                  colSpan={4}
                  className="py-3 font-medium text-sm/18px !px-0 cursor-pointer"
                >
                  <div className="flex justify-between pr-5">
                    <span
                      className="flex items-center pl-4"
                      onClick={() => {
                        updateActiveDropdownData(data?.id);
                      }}
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
                    <div className="flex items-center gap-1.5">
                      {getPermissions(
                        FeaturesNameEnum.Timesheet,
                        PermissionEnum.View
                      ) && (
                        <>
                          <ViewButton
                            onClickHandler={() => {
                              navigate(`/timesheet/update`, {
                                state: {
                                  startDate: FormatDate(
                                    timesheetDataList[0]?.startDate
                                  ),
                                  endDate: FormatDate(
                                    timesheetDataList[0]?.endDate
                                  ),
                                  type: timesheetDataList[0]?.subSegment
                                    ? "subsegment"
                                    : "segment",
                                  value: timesheetDataList[0]?.subSegment
                                    ? timesheetDataList[0]?.subSegment.id
                                    : timesheetDataList[0]?.segment.id,
                                  search: "",
                                },
                              });
                            }}
                          />
                          {data?.timesheetData?.find(
                            (data) => data.status == "APPROVED"
                          ) && (
                            <>
                              <PDFDownloadButton
                                onClickHandler={() => {
                                  setIsMultipleTimesheet(true);
                                  handlePDFExport(
                                    data?.timesheetData
                                      ?.filter(
                                        (data) => data.status == "APPROVED"
                                      )
                                      .map((timesheet) => timesheet.id)
                                  );
                                  setPDFExportFileName(
                                    data?.timesheetData[0]?.dateRange
                                  );
                                }}
                              />
                              {user?.roleData.name === DefaultRoles.Admin && (
                                <CrossButton
                                  tooltip="Unapprove"
                                  onClickHandler={() => {
                                    setConfirmationModal(true);
                                    setTimesheetIds(
                                      data?.timesheetData
                                        ?.filter(
                                          (data) => data.status == "APPROVED"
                                        )
                                        .map((timesheet) => timesheet.id)
                                    );
                                  }}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              {data?.timesheetData.map(
                (itemData: TimesheetDataDropdown) =>
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
          <td className="" colSpan={8}>
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

  return (
    <>
      <div className="main-table">
        <div className="flex justify-between mb-2">
          <div className="flex flex-wrap 1400:flex-nowrap gap-4 items-center">
            <TimesheetFilter
              setActiveDateDropdownProp={setActiveDateDropdown}
              setActiveCategoryDropdownProp={setActiveCategoryDropdown}
              activeDateDropdownProp={activeDateDropdown}
              activeCategoryDropdownProp={activeCategoryDropdown}
              module={DefaultState.Timesheet}
              setLoader={setLoader}
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
        </div>
        <div className="table-wrapper overflow-auto max-h-[calc(100dvh_-_170px)]">
          <table className="w-full !min-w-[1220px]">
            <thead className="sticky top-0 z-10 bg-[#e3d6d6]">
              <tr>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Date
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Employee
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Status
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5"></th>
              </tr>
            </thead>
            <tbody>{!loader && renderFolderRows()}</tbody>
          </table>
        </div>
      </div>
      {timesheetDetails && (
        <div className="h-0 overflow-hidden">
          <PDFGenerator
            key={PDFExportFileName}
            PDFRef={pdfExportRef}
            isFooter={false}
            isTimesheetPdf={true}
            footerContent={
              timesheetDetails &&
              timesheetDetails[0]?.timesheetData?.timesheetLogsData?.map(
                (item, index) => {
                  return `Version ${index + 1} ${item?.status} by ${
                    item?.actionByUser?.loginUserData?.name
                  } on ${moment(item?.actionDate).format("LL")} at ${moment(
                    item?.actionDate
                  ).format("LT")}`;
                }
              )
            }
            fileName={PDFExportFileName}
            content={
              isMultipleTimesheet ? (
                <SegmentTimesheetPdf timesheetDetails={timesheetDetails} />
              ) : (
                <TimesheetPdf timesheetDetails={timesheetDetails} />
              )
            }
            repeatHeaders
            repeatPageNumber={true}
            marginBottom="2.5cm"
            marginTop="0.5cm"
            paperSize="B2"
            landscape={true}
          ></PDFGenerator>
        </div>
      )}

      {generatemodal &&
        generateModalData &&
        generateDataModal(generateModalData)}

      {/* *************************** */}

      {/* {timesheetDetails && (
        // <div className="h-0 overflow-hidden">
        <PDFGenerator
          key={PDFExportFileName}
          PDFRef={pdfExportRef}
          isFooter={false}
          isTimesheetPdf={true}
          footerContent={
            timesheetDetails &&
            timesheetDetails[0]?.timesheetData?.timesheetLogsData?.map(
              (item, index) => {
                return `Version ${index + 1} ${item?.status} by ${
                  item?.actionByUser?.loginUserData?.name
                } on ${moment(item?.actionDate).format("LL")} at ${moment(
                  item?.actionDate
                ).format("LT")}`;
              }
            )
          }
          repeatPageNumber={true}
          fileName={PDFExportFileName}
          content={
            isMultipleTimesheet ? (
              <SegmentTimesheetPdf timesheetDetails={timesheetDetails} />
            ) : (
              <TimesheetPdf timesheetDetails={timesheetDetails} />
            )
          }
          repeatHeaders
          marginBottom="2cm"  
          marginTop="0.5cm"
          paperSize="B2"
          landscape={true}
        ></PDFGenerator>
        // </div>
      )} */}

      {/* *************************** */}

      {confirmationModal && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setConfirmationModal(!confirmationModal)}
          width="max-w-[475px]"
          icon={<CroosIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={async () => {
            setConfirmationModal(false);
            setGenerateModal(true);
            timesheetIds.length &&
              (await ApproveTimesheet({
                timesheetIds: timesheetIds,
                status: "UNAPPROVED",
              }));
            setGenerateModal(false);
            setGenerateModalData(null);
            setRefetch(!reFetch);
          }}
          confirmationText="Are you sure you want to unapprove timesheet?"
          title="UNAPPROVED"
          loaderButton={loader}
        >
          <div className=""></div>
        </Modal>
      )}
    </>
  );
};

export default Timesheet;
