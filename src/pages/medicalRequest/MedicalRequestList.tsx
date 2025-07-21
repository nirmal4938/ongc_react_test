import Table from "@/components/table/Table";
import moment from "moment";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUpdateMedicalRequest from "./AddUpdateMedicalRequest";
import {
  IMedicalRequestData,
  IMedicalRequestDetail,
} from "@/interface/medicalRequest/MedicalRequestInterface";
import {
  GetAllMedicalRequest,
  GetMedicalRequestDataById,
  UpdateMedicalRequestStatusById,
} from "@/services/medicalRequestService";
import { activeEmployeeSelector } from "@/redux/slices/employeeSlice";
import Modal from "@/components/modal/Modal";
import { CroosIcon, DeleteIcon } from "@/components/svgIcons";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import MedicalFilter from "@/components/filter/MedicalFilter";
import PDFGenerator from "@/components/pdfDownload/PDFGenerator";
import { PDFExport } from "@progress/kendo-react-pdf";
import MedicalPDF from "@/components/pdfDownload/components/MedicalPDF";
import { GetMedicalTypeData } from "@/services/medicalTypeService";
import { IMedicalTypeData } from "@/interface/medicalType/MedicalTypeInterface";
import { ILoginUserData } from "@/interface/user/userInterface";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { PDFDownloadButton } from "@/components/CommonComponents";

const MedicalRequestList = () => {
  const pdfExportRef = useRef<PDFExport>(null);
  const dispatch = useDispatch();
  const { getPermissions, isCheckEmployee, pageState, setPageState } =
    usePermission();
  const pageStateData =
    pageState?.state == DefaultState.MedicalRequest ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const activeClient = useSelector(activeClientSelector);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Medical Modal
  let currentPage = useSelector(currentPageSelector);
  currentPage =
    pageState?.state == DefaultState.MedicalRequest
      ? pageStateData?.page ?? 1
      : currentPage;
  const [loader, setLoader] = useState<boolean>(false);
  const [cancelLoader, setCancelLoader] = useState<boolean>(false);
  const [open, setOpen] = useState(false); // For Cancel Modal
  const activeEmployee = useSelector(activeEmployeeSelector);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [footerContent, setFoterContent] = useState<string>("");
  const currentDate = new Date(),
    year = currentDate.getFullYear(),
    month = currentDate.getMonth();
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(year, month, 1),
    endDate: new Date(year, month + 1, 0),
  });
  const [medicalTypeData, setMedicalTypeData] = useState<IMedicalTypeData[]>();
  const [PDFExportFileName, setPDFExportFileName] = useState<string>("");
  const [exportFlag, setExportFlag] = useState<boolean>(false);
  const [medicalRequestDetail, setMedicalRequestDetail] =
    useState<IMedicalRequestDetail>();
  const [medicalRequestId, setMedicalRequestId] = useState<string>("");
  const [medicalRequestData, setMedicalRequestData] = useState<{
    data: IMedicalRequestData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [selectedFilterValue, setSelectedFilterValue] =
    useState<string>("user");
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const queryString = `?limit=${limit}&page=${currentPage}&clientId=${
    activeClient || ""
  }&employeeId=${activeEmployee}&sort=${
    sortType ? "desc" : "asc"
  }&sortBy=${sort}`;

  useEffect(() => {
    dispatch(currentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !openModal && activeClient && fetchAllMedicalRequest(queryString);

    setPageState({
      state: DefaultState.MedicalRequest as string,
      value: {
        ...pageStateData,
        page:
          medicalRequestData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, activeClient, activeEmployee, sort, sortType]);

  useEffect(() => {
    if (pdfExportRef.current && exportFlag) {
      pdfExportRef.current.save();
      setExportFlag(false);
    }
  }, [exportFlag]);

  async function fetchAllMedicalRequest(query: string) {
    dispatch(showLoader());
    setLoader(true);
    const response = await GetAllMedicalRequest(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setMedicalRequestData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    setLoader(false);
    dispatch(hideLoader());
  }

  const handlePDFExport = async (id: string) => {
    const response = await GetMedicalTypeData();
    //  For passing the medical type in PDF
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setMedicalTypeData(result.data);
    }
    // for passing the medical request data to PDF
    if (id) {
      const response = await GetMedicalRequestDataById(id);
      if (response.data.response_type === "success") {
        const responseData = response.data.responseData;
        const footerContent = `Submitted by ${
          responseData?.createdByUser.loginUserData.name
        } on ${moment(responseData?.createdAt).format(
          "DD MMMM YYYY"
        )} at ${moment(responseData.createdAt).format("LT")} ${
          responseData?.status === "CANCELLED"
            ? ` , cancelled by ${
                responseData?.updatedByUser.loginUserData.name
              } on ${moment(responseData.updatedAt).format(
                "DD MMMM YYYY"
              )} at ${moment(responseData.updatedAt).format("LT")}`
            : ""
        }`;
        setMedicalRequestDetail(response.data.responseData);
        setFoterContent(footerContent);
        setExportFlag(true);
      }
    }
  };

  const actionButton = (id: string, reference: string, status: string) => {
    return (
      <div className="flex items-center gap-1.5">
        <PDFDownloadButton
          onClickHandler={() => {
            handlePDFExport(id);
            setPDFExportFileName(reference);
          }}
        />
        {getPermissions(
          FeaturesNameEnum.MedicalRequest,
          PermissionEnum.Update
        ) &&
          status !== "CANCELLED" && (
            <span
              className="w-25 h-7 group relative bg-primaryRed/10 text-primaryRed p-0.5 inline-flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer"
              onClick={() => {
                handleOpenModal(id);
              }}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Cancel
              </span>
              <CroosIcon className="" />
            </span>
          )}
      </div>
    );
  };

  const columnData = [
    {
      header: "Reference",
      name: "reference",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Created Date",
      name: "createdAt",
      option: {
        sort: true,
      },
      cell: (props: { createdAt: string }) =>
        moment(props?.createdAt).format("DD/MM/YYYY"),
    },
    {
      header: "Medical Date",
      name: "medicalDate",
      option: {
        sort: true,
      },
      cell: (props: { medicalDate: string }) =>
        moment(props?.medicalDate).format("DD/MM/YYYY"),
    },
    {
      header: "Medical Type",
      name: "medicalType",
      option: {
        sort: false,
      },
      cell: (props: { medicalTypeData: { name: string } }) =>
        props?.medicalTypeData?.name,
    },
    {
      header: "Medical Expiry",
      name: "medicalExpiry",
      option: {
        sort: true,
      },
      cell: (props: { medicalExpiry: string }) =>
        props?.medicalExpiry
          ? moment(props?.medicalExpiry).format("DD/MM/YYYY")
          : "-",
    },
    {
      header: "Email",
      name: "email",
      option: {
        sort: false,
      },
      cell: (props: { createdByUser: { loginUserData: ILoginUserData } }) =>
        props?.createdByUser?.loginUserData?.email,
    },
    {
      header: "Status",
      name: "status",
      option: {
        sort: true,
      },
    },
    {
      header: "Action",
      cell: (props: { id: string; status: string; reference: string }) =>
        actionButton(props.id, props.reference, props.status),
    },
  ];

  const handleOpenModal = (id: string) => {
    setMedicalRequestId(id);
    setOpen(true);
  };

  const cancelMedicalRequest = async (id: string) => {
    setCancelLoader(true);
    const response = await UpdateMedicalRequestStatusById(id);
    if (response?.data?.response_type === "success") {
      await fetchAllMedicalRequest(queryString);
      setCancelLoader(false);
    }
    setOpen(false);
  };

  const handleMedicalFilter = (query: string, page: number) => {
    dispatch(currentPageCount(page));
    fetchAllMedicalRequest(queryString + query);
    setCancelLoader(false);
  };

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={medicalRequestData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.MedicalRequest,
          PermissionEnum.View
        )}
        isButton={
          !isCheckEmployee &&
          getPermissions(FeaturesNameEnum.MedicalRequest, PermissionEnum.Create)
        }
        buttonText="Add"
        buttonClick={() => {
          setOpenModal(true);
        }}
        isFilter={true}
        buttonFilterClick={() => setOpenFilter(true)}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.MedicalRequest}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={medicalRequestData.totalPage}
        dataCount={medicalRequestData.totalCount}
        isClientDropdown={false}
        isEmployeeDropdown={!isCheckEmployee}
        isEmployeeMedicalStatus={true}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
      />
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => cancelMedicalRequest(medicalRequestId)}
          confirmationText="Are you sure you want to cancel this medical request?"
          title="Cancel Request"
          loaderButton={cancelLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateMedicalRequest
          employeeId={activeEmployee ? Number(activeEmployee) : 0}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllMedicalRequest(queryString);
          }}
        />
      )}
      {openFilter && (
        <MedicalFilter
          selectedValue={selectedFilterValue}
          setSelectedValue={setSelectedFilterValue}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          setOpenFilter={setOpenFilter}
          handleFilter={handleMedicalFilter}
        />
      )}

      {medicalRequestDetail && (
        <div className="h-0 overflow-hidden">
          <PDFGenerator
            key={PDFExportFileName}
            isMedicalPdf={true}
            content={
              <MedicalPDF
                data={medicalRequestDetail}
                medicalTypeData={medicalTypeData}
              />
            }
            PDFRef={pdfExportRef}
            fileName={PDFExportFileName}
            isFooter={false}
            footerContent={footerContent}
          />
        </div>
      )}

      {/* ======================== */}
      {/* {medicalRequestDetail && (
        // <div className="h-0 overflow-hidden">
          <PDFGenerator
            key={PDFExportFileName}
            isMedicalPdf={true}
            content={
              <MedicalPDF
                data={medicalRequestDetail}
                medicalTypeData={medicalTypeData}
              />
            }
            PDFRef={pdfExportRef}
            fileName={PDFExportFileName}
            isFooter={true}
            footerContent={footerContent}
          />
        
      )} */}
       {/* ======================== */}
    </>
  );
};

export default MedicalRequestList;
