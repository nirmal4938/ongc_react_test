import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EditEndContractList,
  GetAllEndContractEmployeeList,
  // GetContractSummaryDataById,
} from "@/services/contractSummaryService";
import { Link, useNavigate } from "react-router-dom";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { activeEmployeeSelector } from "@/redux/slices/employeeSlice";
import {
  IEmployeeContractEndData,
  IEmployeeData,
} from "@/interface/employee/employeeInterface";
import moment from "moment";
import {
  DefaultState,
  FeaturesNameEnum,
  ModuleType,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import {
  // PDFDownloadButton,
  ViewButton,
  imageRender,
} from "@/components/CommonComponents";
// import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import { PDFExport } from "@progress/kendo-react-pdf";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import {
  CloudDownIocn,
  DownTriangleIcon,
  EditIocn,
} from "@/components/svgIcons";
import { GetAllEmployeeSuggestiveDropdownData } from "@/services/employeeService";
import { setEmployeeSearchDropdown } from "@/redux/slices/employeeSearchDropdownSlice";
import { Form, Formik, FormikValues } from "formik";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import Button from "@/components/formComponents/button/Button";
import Modal from "@/components/modal/Modal";
import DateRange from "@/components/formComponents/dateRange/DateRange";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import SearchBar from "@/components/searchbar/SearchBar";
const EmployeeContractEndList = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.ContractEnd ? pageState?.value : {};
  // const currentPage = useSelector(currentPageSelector);
  // const [currentPageNumber, setCurrentPageNumber] = useState(currentPage);
  const activeClient = useSelector(activeClientSelector);
  const activeEmployee = useSelector(activeEmployeeSelector);
  // const [limit, setLimit] = useState<number>(10);
  const [loader, setLoader] = useState<boolean>(false);
  const [checked, setChecked] = useState<number[] | undefined>([]);
  // const [isChecked, setIsChecked] = useState<boolean>(false);
  // const [contractPDFDetail, setContractPDFDetail] =
  //   useState<IContractSummaryData>();
  const [openModal, setOpenModal] = useState<boolean>(false); //
  const [reload, setReload] = useState<boolean>(false);
  const [employeeDataPage, setEmployeeDataPage] = useState<IEmployeeData[]>([]);
  const pdfExportRef = useRef<PDFExport>(null);
  // const [PDFExportFileName, setPDFExportFileName] = useState<string>("");
  const [exportFlag, setExportFlag] = useState<boolean>(false);
  const [segmentWiseEmployeeContractEnd, setSegmentWiseEmployeeContractEnd] =
    useState<
      {
        id: string;
        name: string;
        employeeData: IEmployeeContractEndData[];
      }[]
    >([]);
  const [activeDropdownData, setActiveDropdownData] = useState<string[]>([]);

  const currentDate = new Date(),
    year = currentDate.getFullYear(),
    month = currentDate.getMonth();
  const [dateFilter, setDateFilter] = useState({
    startDate: pageStateData?.startDate ?? new Date("01-01-2021"),
    endDate: pageStateData?.endDate ?? new Date(year, month + 1, 0),
  });
  const [searchText, setSearchText] = useState<string>(
    pageStateData?.search ?? ""
  );
  const [prevSearch, setPrevSearch] = useState<string>(
    pageStateData?.search ?? ""
  );

  let queryString = `?clientId=${activeClient}&startDate=${moment(
    dateFilter.startDate
  ).format("YYYY/MM/DD")}&endDate=${moment(dateFilter.endDate).format(
    "YYYY/MM/DD"
  )}`;

  const searchParam = pageStateData?.search
    ? `&search=${pageStateData?.search}`
    : ``;
  const actionButton = (
    id: string | undefined,
    employeeId: number | undefined,
    slug: string | undefined,
    contractName: string
  ) => {
    return (
      <div className="flex items-center gap-1.5">
        {/* <PDFDownloadButton
          onClickHandler={() => {
            handlePDFExport(id ?? "#");
            setPDFExportFileName(contractName);
          }}
        /> */}
        {getPermissions(
          FeaturesNameEnum.ContractEnd,
          PermissionEnum.Update
        ) && (
          <span
            className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
            onClick={() => {
              navigate(
                id != undefined
                  ? `/contract/summary/edit/${id}`
                  : "/contract/summary/add",
                {
                  state: {
                    contractName: contractName,
                    employeeId: employeeId,
                  },
                }
              );
            }}
          >
            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
              Edit
            </span>
            <EditIocn className="w-ful h-full pointer-events-none" />
          </span>
        )}
        {getPermissions(FeaturesNameEnum.ContractEnd, PermissionEnum.View) &&
          getPermissions(FeaturesNameEnum.Employee, PermissionEnum.View) && (
            <ViewButton
              onClickHandler={() => {
                navigate(`/employee/summary/profile/${slug}`);
              }}
            />
          )}
      </div>
    );
  };

  const handleSearch = (value?: string) => {
    const search = value ? value.trim() : searchText.trim();
    if (pageStateData) {
      setPageState({
        state: DefaultState.ContractEnd as string,
        value: {
          ...pageStateData,
          search: search,
        },
      });
    }
    const queryString = `&search=${search}`;
    if (search === prevSearch.trim()) return;
    else {
      setPrevSearch(search.trim());
      fetchAllEndContractEmployee(queryString);
    }
  };

  function clearSearch() {
    if (pageStateData) {
      setPageState({
        state: DefaultState.ContractEnd as string,
        value: {
          ...pageStateData,
          search: "",
        },
      });
    }
    setPrevSearch("");
    setSearchText("");
    const queryString = `&search=`;
    fetchAllEndContractEmployee(queryString);
  }

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    const itemValue = employeeDataPage?.map(
      (item: IEmployeeContractEndData) => {
        const newObj = {
          Matricule: item?.employeeDetail?.employeeNumber,
          "Contract Number":
            (item?.employeeDetail?.employeeContracts &&
              item?.employeeDetail?.employeeContracts[0]?.newContractNumber) ??
            item?.employeeDetail?.contractNumber,
          Surname: item?.employeeDetail?.loginUserData?.lastName,
          Forename: item?.employeeDetail?.loginUserData?.firstName,
          Fonction: item?.employeeDetail?.fonction,
          Segment: item?.employeeDetail?.segment?.name,
          "Sub-Segment": item?.employeeDetail?.subSegment?.name,
          Rotation: item?.employeeDetail?.rotation?.name,
          "Contract End Date": moment(
            item?.employeeDetail?.contractEndDate
          ).format("DD/MM/YYYY"),
        };
        return newObj;
      }
    );
    const worksheet = XLSX.utils.json_to_sheet(itemValue);
    worksheet["!cols"] = [
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 15 },
      { width: 25 },
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
    saveAs(blob, "Master_Employee_Contract_End_List.xlsx");
  };
  // const handlePDFExport = async (id: string) => {
  //   const response = await GetContractSummaryDataById(id);
  //   if (response.data.response_type === "success") {
  //     setContractPDFDetail(response.data.responseData);
  //     setExportFlag(true);
  //   }
  // };

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("endDate", values.endDate);
    setLoader(false);
    const response = await EditEndContractList({
      employeeId: checked,
      endDate: values.endDate,
    });
    if (response?.data?.response_type === "success") {
      setOpenModal(!openModal);
      setChecked([]);
      navigate("/contract/contract-end");
      setReload(!reload);
    }
  };

  const fetchAllEndContractEmployee = async (query: string) => {
    dispatch(showLoader());
    queryString = query ? queryString + query : queryString + searchParam;
    const response = await GetAllEndContractEmployeeList(queryString);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setEmployeeDataPage(result);
      setSegmentWiseEmployeeContractEndData(result);
    }

    const dropdownQuery = `?clientId=${activeClient}`;
    const dropdownResponse = await GetAllEmployeeSuggestiveDropdownData(
      dropdownQuery
    );
    if (dropdownResponse?.data?.responseData) {
      const result = dropdownResponse?.data?.responseData;
      dispatch(setEmployeeSearchDropdown(result));
    }
    dispatch(hideLoader());
  };

  const setSegmentWiseEmployeeContractEndData = async (
    data: IEmployeeContractEndData[]
  ) => {
    const segmentList: {
      id: string;
      name: string;
      employeeData: IEmployeeContractEndData[];
    }[] = [];
    for (const empData of data) {
      if (empData?.employeeDetail?.segment?.id) {
        const sData = {
          id:
            `${empData?.employeeDetail?.segment?.id}` +
            (empData?.employeeDetail?.subSegment?.id
              ? `-${empData?.employeeDetail?.subSegment?.id}`
              : ""),
          name:
            `${empData?.employeeDetail?.segment?.name}` +
            (empData?.employeeDetail?.subSegment?.name
              ? `-${empData?.employeeDetail?.subSegment?.name}`
              : ""),
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
    setSegmentWiseEmployeeContractEnd(segmentList);
  };

  // useEffect(() => {
  //   dispatch(currentPageCount(1));
  //   setCurrentPageNumber(1);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (pdfExportRef.current && exportFlag) {
      pdfExportRef.current.save();
      setExportFlag(false);
    }
  }, [exportFlag]);

  useEffect(() => {
    if (activeClient) {
      fetchAllEndContractEmployee("");
    }

    setPageState({
      state: DefaultState.ContractEnd as string,
      value: {
        ...pageStateData,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeClient,
    dateFilter?.startDate,
    dateFilter?.endDate,
    activeEmployee,
    reload,
  ]);

  const updateActiveDropdownData = (id: string) => {
    const index = activeDropdownData.indexOf(id);
    if (index !== -1) {
      activeDropdownData.splice(index, 1);
    } else {
      activeDropdownData.push(id);
    }
    setActiveDropdownData(activeDropdownData);
    setPageState({
      state: DefaultState.ContractEnd as string,
      value: {
        ...pageStateData,
        activeDropdown: activeDropdownData,
      },
    });
  };

  const renderFolderRows = () => {
    if (
      segmentWiseEmployeeContractEnd &&
      segmentWiseEmployeeContractEnd.length > 0
    ) {
      return segmentWiseEmployeeContractEnd.map((data) => {
        if (data?.employeeData?.length) {
          return (
            <React.Fragment key={data.id}>
              <tr>
                <td
                  colSpan={12}
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
                (itemData: IEmployeeContractEndData) =>
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
          <td className="" colSpan={12}>
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

  const renderFileRow = (itemData: IEmployeeContractEndData) => (
    <tr key={itemData?.employeeDetail?.id}>
      <td className="py-3">
        <input
          type="checkbox"
          value={"all"}
          checked={
            checked &&
            checked.length > 0 &&
            checked.includes(Number(itemData?.employeeDetail?.id))
          }
          onChange={() => {
            if (itemData?.employeeDetail?.id && checked) {
              if (checked?.includes(itemData?.employeeDetail?.id)) {
                setChecked((prev) =>
                  prev?.filter((data) => data !== itemData?.employeeDetail?.id)
                );
                // setIsChecked(false);
              } else {
                // setIsChecked(true);
                checked &&
                  setChecked([...checked, itemData?.employeeDetail?.id]);
              }
            }
          }}
        />
      </td>
      <td className="py-3">
        {imageRender(
          itemData.employeeDetail?.loginUserData?.profileImage?.includes(
            "user.jpg"
          ) || itemData.employeeDetail?.loginUserData?.profileImage == null
            ? itemData.employeeDetail?.loginUserData?.profileImage
            : `/profilePicture/${itemData.employeeDetail?.loginUserData?.profileImage}` ||
                ""
        )}
      </td>
      <td className="py-3">
        {itemData?.employeeDetail?.employeeNumber
          ? itemData?.employeeDetail?.employeeNumber
          : "-"}
      </td>
      <td className="py-3">
        {itemData?.employeeDetail?.employeeContracts &&
        itemData?.employeeDetail?.employeeContracts[0]
          ? itemData?.employeeDetail?.employeeContracts[0]?.newContractNumber
          : itemData?.employeeDetail?.contractNumber
          ? itemData?.employeeDetail?.contractNumber
          : "-"}
      </td>
      <td className="py-3">
        {itemData.employeeDetail?.loginUserData?.lastName
          ? itemData.employeeDetail?.loginUserData?.lastName
          : "-"}
      </td>
      <td className="py-3">
        {itemData.employeeDetail?.loginUserData?.firstName
          ? itemData.employeeDetail?.loginUserData?.firstName
          : "-"}
      </td>
      <td className="py-3">
        {itemData?.employeeDetail?.segment?.name
          ? itemData?.employeeDetail?.segment?.name
          : "-"}
      </td>
      <td className="py-3">
        {itemData?.employeeDetail?.subSegment?.name
          ? itemData?.employeeDetail?.subSegment?.name
          : "-"}
      </td>
      <td className="py-3">
        {itemData?.employeeDetail?.rotation?.name
          ? itemData?.employeeDetail?.rotation?.name
          : "-"}
      </td>
      <td className="py-3">
        {itemData?.employeeDetail?.contractEndDate
          ? moment(itemData?.employeeDetail?.contractEndDate).format(
              "DD/MM/YYYY"
            )
          : "-"}
      </td>
      <td className="py-3">
        {actionButton(
          itemData?.employeeDetail?.employeeContracts &&
            itemData?.employeeDetail?.employeeContracts?.length > 0
            ? itemData?.employeeDetail?.employeeContracts[0]?.id
            : undefined,
          itemData?.employeeDetail?.id,
          itemData?.employeeDetail?.slug,
          (Array.isArray(itemData?.contractTemplate) &&
            itemData?.contractTemplate.length) ||
            (typeof itemData?.contractTemplate === "object" &&
              itemData?.contractTemplate)
            ? itemData?.contractTemplate?.contractName
            : "GeneralContract"
        )}
      </td>
    </tr>
  );

  const toggleChecked = (values: number[]) => {
    if (checked?.some((value) => values.includes(value))) {
      checked &&
        setChecked((prev) => prev?.filter((data) => !values.includes(data)));
      // setIsChecked(false);
    } else {
      checked && setChecked((prev) => prev && [...prev, ...values]);
      // setIsChecked(true);
    }
  };

  return (
    <>
      {openModal && (
        <Modal
          title="Update Contract End"
          width="max-w-[709px]"
          closeModal={() => setOpenModal(!openModal)}
          hideFooterButton={true}
          visible={true}
          // onClickHandler={handleSubmitRef}
        >
          <Formik initialValues={{ endDate: new Date() }} onSubmit={OnSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                <DateComponent
                  name="endDate"
                  smallFiled
                  label={"End Date"}
                  value={values?.endDate}
                  minDate={new Date()}
                  placeholder={""}
                  onChange={(date) => {
                    setFieldValue("endDate", date);
                  }}
                  isCompulsory
                />
                <Button
                  variant={"primary"}
                  type="submit"
                  parentClass="mt-10"
                  loader={loader}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      <div className="flex justify-between mb-4 items-start">
        <div className="flex flex-wrap 1600:flex-nowrap gap-4 items-center">
          <DateRange
            inputParentClass="!max-w-[260px]"
            // className="!max-w-[147px]"
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
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
          />
          {getPermissions(
            FeaturesNameEnum.ContractEnd,
            PermissionEnum.Update
          ) &&
            checked &&
            checked?.length > 0 && (
              <Link to={"#"} onClick={() => setOpenModal(true)}>
                <Button variant={"primary"} parentClass="">
                  Update Contract End
                </Button>
              </Link>
            )}

          <Button
            variant={"primary"}
            parentClass=""
            icon={<CloudDownIocn className="w-4 h-4" />}
            onClickHandler={handleExport}
          >
            Export to Excel
          </Button>
        </div>
      </div>
      {getPermissions(FeaturesNameEnum.ContractEnd, PermissionEnum.View) && (
        <div className="table-wrapper overflow-auto max-h-[calc(100dvh_-_170px)]">
          <table className="w-full !min-w-[1220px]">
            <thead className="sticky top-0 bg-[#e3d6d6]">
              <tr>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  {getPermissions(
                    FeaturesNameEnum.ContractEnd,
                    PermissionEnum.Update
                  ) && (
                    <input
                      type="checkbox"
                      value={"all"}
                      checked={
                        checked &&
                        checked?.length > 0 &&
                        segmentWiseEmployeeContractEnd.reduce(
                          (total, segment) => {
                            return total + segment.employeeData.length;
                          },
                          0
                        ) == checked?.length
                      }
                      onChange={() => {
                        const employeeIds: number[] = [];
                        segmentWiseEmployeeContractEnd.forEach((item) =>
                          item.employeeData.map((employee) => {
                            employee?.employeeDetail?.id &&
                              employeeIds.push(employee?.employeeDetail?.id);
                          })
                        );
                        if (employeeIds.length) {
                          toggleChecked(employeeIds);
                        }
                      }}
                    />
                  )}
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5"></th>
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
                  Contract
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{!loader && renderFolderRows()}</tbody>
          </table>
        </div>
      )}
      {/* {contractPDFDetail && (
        <div className="h-0 overflow-hidden">
          <PDFGenerator
            key={PDFExportFileName}
            PDFRef={pdfExportRef}
            fileName={PDFExportFileName}
            content={
              <ContractPDF
                data={contractPDFDetail?.description?.replaceAll(
                  /&lt;br&gt;/g,
                  " "
                )}
              />
            }
          ></PDFGenerator>
        </div>
      )} */}
    </>
  );
};

export default EmployeeContractEndList;
