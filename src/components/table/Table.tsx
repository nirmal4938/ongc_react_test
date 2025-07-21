import { useEffect, useState } from "react";
import Button from "../formComponents/button/Button";
import SelectComponent from "../formComponents/customSelect/Select";
import Pagination from "../pagination/Pagination";
import SearchBar from "../searchbar/SearchBar";
import {
  ArrowSortUpIcon,
  CloudDownIocn,
  FilterIcon,
  PlusIcon,
} from "../svgIcons";
import Tab from "../tab/Tab";
import { Link, useLocation } from "react-router-dom";
import DateRange from "../formComponents/dateRange/DateRange";
import ClientDropdown from "../dropdown/ClientDropdown";
import { Option } from "@/interface/customSelect/customSelect";
import SegmentDropdown from "../dropdown/SegmentDropdown";
import {
  ITableHeaderProps,
  ITableProps,
} from "@/interface/table/tableInterface";
import EmployeeDropdown from "../dropdown/EmployeeDropdown";
import { setActiveTab } from "@/redux/slices/adminSidebarSlice";
import { useDispatch } from "react-redux";
import { VITE_APP_API_URL } from "@/config";
import ErrorCategoriesDropdown from "../dropdown/ErrorCategoryDropdown";
import SpinLoader from "../SiteLoder/spinLoader";
import moment from "moment";
import { usePermission } from "@/context/PermissionProvider";
import SelectComponent2 from "../formComponents/customSelect/Select2";

const Table = ({
  bodyData,
  isExternalSegmentDropDown = false,
  headerData,
  isButton,
  isFilter,
  buttonFilterClick,
  loader,
  buttonLink,
  buttonClick,
  buttonText,
  isExport,
  exportButtonClick,
  isDateRange,
  isSearch,
  isTab,
  setTab,
  tabValue,
  isDropdown,
  dropDownClientList,
  clientDropDownValue,
  activeSegmentValue,
  dropDownList,
  dropDownValue,
  setClientDropdownValue,
  setSegmentDropdownValue,
  setDropdownValue,
  dataPerPage,
  totalPage,
  dataCount,
  pagination,
  paginationModule,
  currentPage,
  setLimit,
  isDateSided = false,
  isClientDropdown = false,
  isSegmentItemSided = false,
  isErrorCategoriesDropdown = false,
  isSegmentDropdown = false,
  isEmployeeDropdown = false,
  isTerminatatedEmployee = false,
  isUserDropdown = false,
  isClientAllDropdown = false,
  // isEmployeeMedicalStatus = false,
  setSorting,
  sortType,
  setSortingType,
  addSubSegment = false,
  dateFilter,
  setDateFilter,
  tableLastTheadClass,
  dropDownSegmentList,
  summaryTableType,
  isUploadFileHeader,
  setOpenModal,
  setDocumentId,
  tableClass,
  showSwitch = false,
  switchClickEvent,
  isSwitchActive = false,
  TabList = [],
  isShowTable = true,
  paginationApiCb,
  moduleType,
  searchDropdownData,
  isExternalClientDropdown = false,
  clientData = [],
  setActiveClient,
  checkedValue,
  setCheckedValue,
  setIsChecked,
  activeClient,
  isCheckbox = false,
}: ITableProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pageState, setPageState } = usePermission();
  const pageStateData =
    paginationModule && pageState?.state == paginationModule
      ? pageState?.value
      : null;
  const [searchText, setSearchText] = useState<string>(
    pageStateData?.search ?? ""
  );
  const [prevSearch, setPrevSearch] = useState<string>(
    pageStateData?.search ?? ""
  );

  const [tableHeaderData, setTableHeaderData] = useState<ITableHeaderProps[]>(
    []
  );
  const [tableBodyData, setTablebodyData] = useState<
    any | { [key: string]: string }[]
  >([]);
  useEffect(() => {
    if (bodyData) {
      setTablebodyData(bodyData);
    }
    if (headerData) {
      setTableHeaderData(headerData);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const loadTime = setTimeout(() => {}, 1000);
    return () => {
      clearTimeout(loadTime);
    };
  }, [bodyData, headerData]);

  const getImagePath = (path: string) => {
    if (path && !path.includes("undefined")) {
      return `${VITE_APP_API_URL}/profilePicture/${path}`;
    } else {
      return "/assets/images/user.jpg";
    }
  };
  const DefaultTabList: { name: string; value: number }[] = [
    {
      name: "Active",
      value: 1,
    },
    {
      name: "Archived",
      value: 0,
    },
    {
      name: "All",
      value: -1,
    },
  ];

  let queryString: string | null = "";
  const handleSearch = (value?: string) => {
    const search = value ? value.trim() : searchText.trim();
    if (pageStateData) {
      setPageState({
        state: paginationModule as string,
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

      if (paginationApiCb) paginationApiCb(queryString);
    }
  };

  function clearSearch() {
    if (pageStateData) {
      setPageState({
        state: paginationModule as string,
        value: {
          ...pageStateData,
          search: "",
        },
      });
    }
    setPrevSearch("");
    setSearchText("");
    queryString = `&search=`;
    if (paginationApiCb) paginationApiCb(queryString);
  }

  const renderTableHeader = (val: ITableHeaderProps, ind: number) => {
    if (Object.keys(val).length) {
      return (
        <th key={`header_${val.header}__${ind}`} className="group/sort">
          {isUploadFileHeader && val.header === "Upload File"
            ? renderUploadFileHeader(val)
            : renderDefaultHeader(val)}
        </th>
      );
    }
  };

  const renderUploadFileHeader = (val: ITableHeaderProps) => (
    <span
      className={`flex items-center select-none text-primaryRed underline ${
        tableLastTheadClass ?? ""
      }`}
      onClick={() => {
        if (setOpenModal) setOpenModal(true);
        if (setDocumentId) setDocumentId("");
      }}
    >
      {val.header}
    </span>
  );

  const renderDefaultHeader = (val: ITableHeaderProps) => (
    <span
      className={`flex items-center select-none ${val.className} ${
        tableLastTheadClass ?? ""
      }`}
    >
      {val.header}
      <span onClick={() => handleSorting(val)}>
        {val?.option?.sort && renderSortIcon()}
      </span>
    </span>
  );

  const handleSorting = (val: ITableHeaderProps) => {
    if (val.name) setSorting?.(val.name);
    setSortingType?.(!sortType);
  };

  const renderSortIcon = () => (
    <ArrowSortUpIcon
      className={`transition-all duration-300 opacity-0 group-hover/sort:opacity-100 ${
        sortType && "rotate-180"
      }`}
    />
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderColumnCell = (row: any, columnCell: any) => {
    const isReliquatColumn =
      columnCell.name === "reliquatValue" ||
      columnCell.name === "reliquat" ||
      columnCell.name === "earnedTaken" ||
      columnCell.name === "earned";

    const employeeColumn =
      columnCell.name === "firstName" ||
      columnCell.name === "lastName" ||
      columnCell.name === "name" ||
      columnCell.name === "position";

    const userPermissionColumn =
      (columnCell.name === "permission" || columnCell.name === "segment") &&
      location?.pathname === "/admin/user";

    const isContractExpired = moment(
      row?.contractEndDate ||
        row?.endDate ||
        row?.employee?.contractEndDate ||
        (row?.messageDetail &&
          row?.messageDetail?.length > 0 &&
          row?.messageDetail[0]?.employeeDetail?.contractEndDate)
    )?.isBefore(moment());

    const rollOverRow = row?.employee?.employeeSegment?.find(
      (data: { date: Date }) => {
        const startDate = new Date(row?.startDate);
        const endDate = new Date(row?.endDate);
        const currentDate = new Date(data.date);
        return currentDate >= startDate && currentDate <= endDate;
      }
    )?.rollover;

    if (
      (isReliquatColumn && rollOverRow !== undefined) ||
      (isContractExpired && employeeColumn) ||
      parseFloat(columnCell.cell(row)) < 0
    ) {
      return (
        <span style={{ color: "red" }}>
          {columnCell.cell(row).length > 100
            ? `${
                columnCell.name !== "message"
                  ? columnCell.cell(row).substring(0, 25)
                  : columnCell.cell(row)
              }...`
            : columnCell.cell(row)}
        </span>
      );
    } else if (userPermissionColumn) {
      if (columnCell.cell(row)?.length > 0) {
        return columnCell.cell(row)?.map((e: string) => (
          <li
            className="list-none  inline-block mx-2 text-tomatoRed bg-tomatoRed/10 px-6px py-2 rounded gap-6px  select-none mt-2"
            key={`permission_${e}`}
          >
            <span className="">
              <strong>{e}</strong>
            </span>
          </li>
        ));
      } else {
        return "-";
      }
    } else {
      if (
        !columnCell.subString &&
        typeof columnCell.cell(row) === "string" &&
        columnCell.cell(row).length > 25
      ) {
        return columnCell.cell(row);
        // return columnCell.cell(row).substring(0, 25) + "..."
      } else {
        return columnCell.cell(row);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRowCell = (row: { [key: string]: string }, columnCell: any) => {
    if (row[columnCell.name]) {
      if (columnCell.subString) {
        return row[columnCell.name];
      } else {
        if (row[columnCell.name].length > 100) {
          return row[columnCell.name].substring(0, 25) + "...";
        } else {
          return row[columnCell.name];
        }
      }
    } else {
      return "-";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderInnerHtml = (
    colIndex: number,
    columnCell: any,
    row: { [key: string]: string }
  ) => {
    return `${
      colIndex === 0 && columnCell.imagePath
        ? `<div style="display: flex; align-items: center; gap: 0.5rem;" >
        <img
        class="w-8 h-8 2xl:w-10 2xl:h-10 object-cover"
            src="${getImagePath(row?.loginUserData[columnCell.imagePath])}"
            width="40"
            height="40"
            style="border-radius: 30px;"
            alt=""
            />`
        : ""
    }
    ${renderRowCell(row, columnCell)}
    ${colIndex === 0 && columnCell.imagePath ? "</div>" : ""}`;
  };

  const toggleChecked = (values: number[]) => {
    if (checkedValue?.some((value) => values.includes(value))) {
      setCheckedValue &&
        setCheckedValue((prev) =>
          prev?.filter((data) => !values.includes(data))
        );
      setIsChecked && setIsChecked(false);
    } else {
      setCheckedValue &&
        setCheckedValue((prev) => prev && [...prev, ...values]);
      setIsChecked && setIsChecked(true);
    }
  };

  return (
    <div className="main-table">
      <div
        className={`flex mb-4 ${
          isSegmentItemSided ? "items-center" : "items-start"
        } ${isDateSided ? "justify-end gap-5" : "justify-between"}`}
      >
        <div className="flex flex-wrap 1600:flex-nowrap gap-4 items-center">
          {isDropdown && (
            <SelectComponent
              // name={""}
              isMulti={false}
              options={dropDownList ?? []}
              selectedValue={dropDownValue}
              onChange={(option: Option | Option[]) => {
                setDropdownValue?.((option as Option).value);
              }}
              className="bg-white"
              parentClass={"w-[250px]"}
            />
          )}
          {isClientDropdown && <ClientDropdown />}
          {isErrorCategoriesDropdown && <ErrorCategoriesDropdown />}

          {isClientAllDropdown && (
            <SelectComponent
              options={dropDownClientList}
              parentClass={"w-[250px]"}
              onChange={(option: Option | Option[]) => {
                setClientDropdownValue?.((option as Option).value);
              }}
              selectedValue={clientDropDownValue}
              placeholder={"Select Client"}
              className="bg-white"
            />
          )}

          {isExternalSegmentDropDown && (
            <SelectComponent2
              options={dropDownSegmentList}
              isMulti={true}
              parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
              onChange={(option: Option[]) => {
                const allSelected = option.some(
                  (option: any) => option.value === "all"
                );
                if (!allSelected) {
                  setSegmentDropdownValue(
                    option.map((option: any) => option.value)
                  );
                } else {
                  setSegmentDropdownValue(["all"]);
                }
                setPageState({
                  state: paginationModule as string,
                  value: {
                    ...pageStateData,
                    page: 1,
                  },
                });
                // setSegmentDropdownValue?.((option as Option).value);
              }}
              selectedValue={activeSegmentValue}
              className="bg-white"
            />
          )}
          {isUserDropdown && (
            <SelectComponent
              options={dropDownList}
              parentClass={"w-[110px]"}
              onChange={(option: Option | Option[]) => {
                setDropdownValue?.((option as Option).value);
              }}
              selectedValue={dropDownValue}
              placeholder={"Select Roles"}
              className="bg-white"
            />
          )}
          {isExternalClientDropdown && (
            <SelectComponent
              options={clientData}
              parentClass={"w-[250px]"}
              onChange={(option: Option | Option[]) => {
                setActiveClient && setActiveClient((option as Option).value);
              }}
              selectedValue={activeClient}
              placeholder={"Select Client"}
              className="bg-white"
            />
          )}
          {isSegmentDropdown && <SegmentDropdown />}
          {isEmployeeDropdown && (
            <EmployeeDropdown isTerminatatedEmployee={isTerminatatedEmployee} />
          )}
          {isTab && (
            <Tab
              selectedTabValue={tabValue}
              setTab={setTab}
              TabList={TabList?.length > 0 ? TabList : DefaultTabList}
            />
          )}
          {isDateRange && (
            <DateRange
              inputParentClass="!max-w-[260px]"
              // className="!max-w-[147px]"
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          )}
        </div>
        <div className="flex flex-wrap justify-end 1600:justify-normal items-center 1600:flex-nowrap gap-4">
          {showSwitch && (
            <>
              <ul className="bg-white p-1.5 flex items-center rounded-full gap-2">
                {/* ACTIVE State " bg-primaryRed text-white" */}
                {/* INACTIVE State "hover:bg-primaryRed/10 hover:text-primaryRed" */}
                <li
                  onClick={switchClickEvent}
                  className={`text-black rounded-full text-sm px-2.5 py-1 font-medium cursor-pointer transition-all duration-300 ${
                    isSwitchActive
                      ? "bg-primaryRed text-white"
                      : "hover:bg-primaryRed/10 hover:text-primaryRed "
                  }`}
                >
                  Segment
                </li>
                <li
                  onClick={switchClickEvent}
                  className={`text-black rounded-full text-sm px-2.5 py-1 font-medium cursor-pointer transition-all duration-300 ${
                    !isSwitchActive
                      ? "bg-primaryRed text-white"
                      : "hover:bg-primaryRed/10 hover:text-primaryRed "
                  }`}
                >
                  Employees
                </li>
              </ul>
            </>
          )}

          {isSearch && (
            <SearchBar
              // parentClass="w-full"
              inputClass="min-w-[300px]"
              searchText={searchText}
              prevSearch={prevSearch}
              setSearchText={setSearchText}
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              moduleType={moduleType}
              searchDropdownData={searchDropdownData}
            />
          )}
          {addSubSegment && (
            <Link to="/setup/sub-segments" state={{ isModelOpen: true }}>
              <Button
                variant={"primary"}
                parentClass=""
                icon={<PlusIcon />}
                onClickHandler={() =>
                  dispatch(setActiveTab("setupSubSegments"))
                }
              >
                Add Sub Segment
              </Button>
            </Link>
          )}
          {isButton && (
            <Link to={buttonLink ?? "#"} onClick={buttonClick}>
              <Button variant={"primary"} parentClass="" icon={<PlusIcon />}>
                {buttonText ?? ""}
              </Button>
            </Link>
          )}
          {isExport && (
            <Button
              variant={"primary"}
              parentClass=""
              icon={<CloudDownIocn className="w-4 h-4" />}
              onClickHandler={exportButtonClick}
            >
              Export to Excel
            </Button>
          )}

          {isFilter && (
            <Button
              onClickHandler={buttonFilterClick}
              variant={"primary"}
              parentClass=""
              icon={<FilterIcon className="w-4 h-4" />}
            >
              Filter
            </Button>
          )}
        </div>
      </div>
      {isShowTable ? (
        <>
          <div
            className={`table-wrapper overflow-auto relative 
          ${
            pagination
              ? "max-h-[calc(100dvh_-_220px)]"
              : "max-h-[calc(100dvh-170px)]"
          }`}
          >
            <table
              width={"100%"}
              className={`min-w-[800px] ${tableClass ?? ""}`}
            >
              <thead className={isCheckbox ? "contract_header" : ""}>
                <tr>
                  {isCheckbox && (
                    <th>
                      <input
                        type="checkbox"
                        value={"all"}
                        checked={
                          checkedValue &&
                          checkedValue?.length === tableBodyData?.length
                        }
                        onChange={() => {
                          toggleChecked(
                            tableBodyData?.map(
                              (a: { employeeDetail: { id: number } }) =>
                                a?.employeeDetail?.id
                            )
                          );
                        }}
                      />
                    </th>
                  )}
                  {tableHeaderData
                    ?.filter((e) => e?.isVisible !== "No")
                    ?.map((val: ITableHeaderProps, ind: number) =>
                      renderTableHeader(val, ind)
                    )}
                </tr>
              </thead>

              <tbody>
                {loader && (
                  <tr key={"loader"}>
                    <td colSpan={tableHeaderData?.length}>
                      <div className="relative w-full h-14 flex items-center justify-center">
                        <SpinLoader />
                      </div>
                    </td>
                  </tr>
                )}
                {!loader && tableBodyData.length === 0 && (
                  <tr key={"!loader"}>
                    <td className="" colSpan={tableHeaderData.length}>
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
                )}
                {!loader && tableBodyData && tableBodyData.length > 0 && (
                  <>
                    {tableBodyData.map((row: any, rowInd: number) => {
                      const rowKey = rowInd; // row?.id || Math.random() * 100000;
                      return (
                        <tr key={`tr__${rowKey}`} id={`tr__${rowKey}`}>
                          {tableHeaderData
                            .filter((e) => e.isVisible !== "No")
                            .map(
                              // TODO remove ts error
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (columnCell: any, colIndex: number) => {
                                const colKey = colIndex;
                                if (Object.keys(columnCell).length) {
                                  return (
                                    <td
                                      key={`td_${
                                        colKey ?? Math.random() * 100000
                                      }__${rowKey}`}
                                      id={`td_${
                                        colKey ?? Math.random() * 100000
                                      }__${rowKey}`}
                                    >
                                      {columnCell.cell ? (
                                        renderColumnCell(row, columnCell)
                                      ) : (
                                        <p
                                          dangerouslySetInnerHTML={{
                                            __html: renderInnerHtml(
                                              colIndex,
                                              columnCell,
                                              row
                                            ),
                                          }}
                                        ></p>
                                      )}
                                    </td>
                                  );
                                }
                              }
                            )}
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {pagination && totalPage ? (
            <Pagination
              summaryTableType={summaryTableType}
              paginationModule={paginationModule}
              setLimit={setLimit ?? (() => undefined)}
              currentPage={currentPage ?? 1}
              dataPerPage={dataPerPage ?? 10}
              dataCount={dataCount}
              totalPages={totalPage}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Table;
