import Table from "@/components/table/Table";
import moment from "moment";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IEmployeeLeaveData,
  IEmployeeLeavePDF,
} from "@/interface/employeeLeave/EmployeeLeaveInterface";
import { activeEmployeeSelector } from "@/redux/slices/employeeSlice";
import Modal from "@/components/modal/Modal";
import { CroosIcon, DeleteIcon, EditIocn } from "@/components/svgIcons";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  GetAllEmployeeLeave,
  GetEmployeeLeaveDetail,
  UpdateEmployeeLeaveStatusById,
} from "@/services/employeeLeaveService";
import AddEmployeeLeave from "./AddEmployeeLeave";
import { ILoginUserData } from "@/interface/user/userInterface";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { PDFDownloadButton } from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { PDFExport } from "@progress/kendo-react-pdf";
import PDFGenerator from "@/components/pdfDownload/PDFGenerator";
import EmployeeLeavePdf from "@/components/pdfDownload/components/EmployeeLeavePdf";

const EmployeeLeaveList = () => {
  const dispatch = useDispatch();
  const { getPermissions, isCheckEmployee, pageState, setPageState } =
    usePermission();
  const pageStateData =
    pageState?.state == DefaultState.EmployeeLeave ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const activeClient = useSelector(activeClientSelector);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Employee Leave Modal
  let currentPage = useSelector(currentPageSelector);
  currentPage =
    pageState?.state == DefaultState.EmployeeLeave
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
  const [employeeLeaveData, setEmployeeLeaveData] = useState<{
    data: IEmployeeLeaveData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  //pdf
  const pdfExportRef = useRef<PDFExport>(null);
  const [PDFExportFileName, setPDFExportFileName] = useState<string>("");
  const [exportFlag, setExportFlag] = useState<boolean>(false);
  const [employeeLeaveId, setEmployeeLeaveId] = useState<string>("");
  const [employeeLeaveDetail, setEmployeeLeaveDetail] =
    useState<IEmployeeLeavePDF>();

  const queryString = `?limit=${limit}&page=${currentPage}&clientId=${
    activeClient ?? ""
  }&employeeId=${activeEmployee ?? ""}&sort=${
    sortType ? "desc" : "asc"
  }&sortBy=${sort}`;

  useEffect(() => {
    dispatch(currentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !openModal && activeClient && fetchAllEmployeeLeave(queryString);

    setPageState({
      state: DefaultState.EmployeeLeave as string,
      value: {
        ...pageStateData,
        page:
          employeeLeaveData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, activeClient, activeEmployee, sort, sortType]);

  //for exporting flag true
  useEffect(() => {
    if (pdfExportRef.current && exportFlag) {
      pdfExportRef.current.save();
      setExportFlag(false);
    }
  }, [exportFlag]);

  async function fetchAllEmployeeLeave(query: string) {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllEmployeeLeave(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setEmployeeLeaveData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const actionButton = (
    id: string,
    employeeLeaveFlag: boolean,
    reference: string,
    status: string
  ) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(
          FeaturesNameEnum.EmployeeLeave,
          PermissionEnum.Update
        ) &&
        employeeLeaveFlag &&
        status !== "CANCELLED" ? (
          <span
            className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
            onClick={() => {
              setEmployeeLeaveId(id);
              setOpenModal(true);
              dispatch(showLoader());
            }}
          >
            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
              Edit
            </span>
            <EditIocn className="w-ful h-full pointer-events-none" />
          </span>
        ) : (
          <span className="relative group w-7 h-7 inline-flex items-center justify-center"></span>
        )}
        <PDFDownloadButton
          onClickHandler={() => {
            handlePDFExport(id);
            setPDFExportFileName(reference);
          }}
        />
        {getPermissions(
          FeaturesNameEnum.EmployeeLeave,
          PermissionEnum.Update
        ) &&
          employeeLeaveFlag &&
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
      header: "Start Date",
      name: "startDate",
      option: {
        sort: true,
      },
      cell: (props: { startDate: string }) =>
        moment(props?.startDate).format("DD/MM/YYYY"),
    },
    {
      header: "End Date",
      name: "endDate",
      option: {
        sort: true,
      },
      cell: (props: { endDate: string }) =>
        moment(props?.endDate).format("DD/MM/YYYY"),
    },
    {
      header: "Username",
      name: "username",
      option: {
        sort: false,
      },
      cell: (props: { createdByUser: { loginUserData: ILoginUserData } }) =>
        props?.createdByUser?.loginUserData?.email,
    },
    {
      header: "Created Date",
      name: "createdAt",
      option: {
        sort: true,
      },
      cell: (props: { createdAt: string; updatedAt: string }) =>
        moment(props?.updatedAt).format("DD/MM/YYYY"),
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
      cell: (props: {
        id: string;
        employeeLeaveFlag: boolean;
        reference: string;
        status: string;
      }) =>
        actionButton(
          props.id,
          props.employeeLeaveFlag,
          props.reference,
          props.status
        ),
    },
  ];

  const handleOpenModal = (id: string) => {
    setEmployeeLeaveId(id);
    setOpen(true);
  };

  const cancelEmployeeLeave = async (id: string) => {
    setCancelLoader(true);
    const response = await UpdateEmployeeLeaveStatusById(id);
    if (response?.data?.response_type === "success") {
      setEmployeeLeaveId && setEmployeeLeaveId("");
      await fetchAllEmployeeLeave(queryString);
    }
    setCancelLoader(false);
    setOpen(false);
  };

  const handlePDFExport = async (id: string) => {
    if (id) {
      const response = await GetEmployeeLeaveDetail(id);
      if (response.data.response_type === "success") {
        let responseData = response.data.responseData;
        const footerContent = `Submitted by ${
          responseData?.createdByUser?.loginUserData?.name
        } on ${responseData?.createdAt} at ${responseData?.createdAtTime} ${
          responseData?.status === "CANCELLED"
            ? ` , cancelled by ${responseData?.updatedByUser?.loginUserData.name} on ${responseData?.updatedAt} at ${responseData?.updatedAtTime}`
            : ""
        }`;
        // const footerContent ="Page 1 of  1"
        setExportFlag(true);
        const debutDeConge = moment(responseData.startDate).format(
          "DD MMMM YYYY"
        );
        const dateDuRetour = moment(responseData.endDate)
          .add(1, "days")
          .format("DD MMMM YYYY");
        const createdAt = moment(responseData.createdAt).format("DD MMMM YYYY");
        const createdAtTime = moment(responseData.createdAt).format("LT");
        const updatedAt =
          responseData?.status === "CANCELLED"
            ? moment(responseData.updatedAt).format("DD MMMM YYYY")
            : null;
        const updatedAtTime =
          responseData?.status === "CANCELLED"
            ? moment(responseData.updatedAt).format("LT")
            : null;
        responseData = {
          ...responseData,
          debutDeConge,
          dateDuRetour,
          createdAt,
          createdAtTime,
          updatedAt,
          updatedAtTime,
        };
        setEmployeeLeaveDetail(responseData);
        setFoterContent(footerContent);
      }
    }
  };

  return (
    <>
      <Table
        headerData={columnData as ITableHeaderProps[]}
        bodyData={employeeLeaveData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.EmployeeLeave,
          PermissionEnum.View
        )}
        isButton={
          !isCheckEmployee &&
          getPermissions(FeaturesNameEnum.EmployeeLeave, PermissionEnum.Create)
        }
        buttonText="Add"
        buttonClick={() => {
          setOpenModal(true);
        }}
        loader={loader}
        isTerminatatedEmployee={true}
        pagination={true}
        paginationModule={DefaultState.EmployeeLeave}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={employeeLeaveData.totalPage}
        dataCount={employeeLeaveData.totalCount}
        isClientDropdown={false}
        isEmployeeDropdown={!isCheckEmployee}
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
          loaderButton={cancelLoader}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => cancelEmployeeLeave(employeeLeaveId)}
          confirmationText="Are you sure you want to cancel this employee leave request?"
          title="Cancel Request"
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddEmployeeLeave
          employeeId={activeEmployee ? Number(activeEmployee) : 0}
          openModal={openModal}
          setOpenModal={setOpenModal}
          employeeLeaveId={employeeLeaveId}
          fetchAllData={() => {
            fetchAllEmployeeLeave(queryString);
          }}
          setEmployeeLeaveId={setEmployeeLeaveId}
        />
      )}
      {employeeLeaveDetail && (
        <div className="h-0 overflow-hidden">
          <PDFGenerator
            key={PDFExportFileName}
            isEmployeeLeavePdf={false}
            PDFRef={pdfExportRef}
            fileName={PDFExportFileName}
            content={
              <EmployeeLeavePdf employeeLeaveDetail={employeeLeaveDetail} />
            }
            isFooter={false}
            footerContent={footerContent}
          ></PDFGenerator>
        </div>
      )}
      {/* =========================================== */}
      {/* {employeeLeaveDetail && (
        // <div className="h-0 overflow-hidden">
          <PDFGenerator
            key={PDFExportFileName}
            PDFRef={pdfExportRef}
            fileName={PDFExportFileName}
            content={
              <EmployeeLeavePdf employeeLeaveDetail={employeeLeaveDetail} />
            }
            isFooter={true}
            footerContent={footerContent}
          ></PDFGenerator>
        // </div>
      )} */}
    </>
  );
};

export default EmployeeLeaveList;
