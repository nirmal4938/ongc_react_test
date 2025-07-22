import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import {
  DeleteContractSummary,
  GetAllContractSummary,
  GetContractSummaryDataById,
} from "@/services/contractSummaryService";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { activeEmployeeSelector } from "@/redux/slices/employeeSlice";
import moment from "moment";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import {
  ContractPdfEnumTypes,
  ContractPdfTypes,
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { DeleteButton, PDFDownloadButton } from "@/components/CommonComponents";
import ContractPDF from "@/components/pdfDownload/components/ContractPdf";
import { Avenant } from "@/components/pdfDownload/components/AvenantContractPdf";
import { ContratDeTravail } from "@/components/pdfDownload/components/ContratDeTravailPdf";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
// import { handleDownload } from "@/helpers/Utils";
import { Expat } from "@/components/pdfDownload/components/ExpatContractPdf";

const ContractSummaryList = () => {
  const dispatch = useDispatch();
  const { getPermissions, isCheckEmployee, pageState, setPageState } =
    usePermission();
  const pageStateData =
    pageState?.state == DefaultState.ContractSummary ? pageState?.value : {};
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.ContractSummary
      ? pageStateData?.page ?? 1
      : currentPage;
  const activeClient = useSelector(activeClientSelector);
  const activeEmployee = useSelector(activeEmployeeSelector);
  const [limit, setLimit] = useState<number>(10);
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [contractPDFDetail, setContractPDFDetail] =
    useState<IContractSummaryData>();
  const [contractSummaryId, setContractSummaryId] = useState<string>("");
  const [contractSummaryDataPage, setContractSummaryDataPage] = useState<{
    data: IContractSummaryData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  // const pdfExportRef = useRef<PDFExport>(null);
  const [PDFExportFileName, setPDFExportFileName] = useState<string>("");
  const [exportFlag, setExportFlag] = useState<boolean>(false);
  const queryString = `?limit=${limit}&page=${currentPage}&clientId=${activeClient}&employeeId=${activeEmployee}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}`;
  // const [currency, setCurrency] = useState<string>("");

  const actionButton = (id: string, contractName: string) => {
    return (
      <div className="flex items-center gap-1.5">
        <PDFDownloadButton
          onClickHandler={() => {
            handlePDFExport(id, contractName);
            setPDFExportFileName(contractName);
          }}
        />
        {/* {pdfPath !== null && (
          <Link to={VITE_APP_API_URL + `${pdfPath}`} target="_blank">
            <span className="w-10 h-10 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-red/10 text-primaryRed p-1 rounded active:ring-2 active:ring-current active:ring-offset-2">
              <PDFDownloadIcon className="w-ful h-full pointer-events-none" />
            </span>
          </Link>
        )} */}
        {/* {getPermissions(
          FeaturesNameEnum.EmployeeContract,
          PermissionEnum.Update
        ) && (
          <>
            <EditButton
              onClickHandler={() => {
                navigate(`/contract/summary/edit/${id}`);
              }}
            />
          </>
        )} */}
        {getPermissions(
          FeaturesNameEnum.EmployeeContract,
          PermissionEnum.Delete
        ) && <DeleteButton onClickHandler={() => handleOpenModal(id)} />}
      </div>
    );
  };
  const columnData = [
    {
      header: "Contract Name",
      name: "contractName",
      cell: (props: {
        contractTemplateVersion: { contractTemplate: { contractName: string } };
      }) => {
        return props?.contractTemplateVersion?.contractTemplate?.contractName
          ? props?.contractTemplateVersion?.contractTemplate?.contractName
          : "-";
      },
    },

    {
      header: "Contract Version Name",
      name: "versionName",
      cell: (props: { contractTemplateVersion: { versionName: string } }) => {
        return props?.contractTemplateVersion?.versionName
          ? props?.contractTemplateVersion?.versionName
          : "-";
      },
    },

    {
      header: "Contract Number",
      name: "newContractNumber",
      cell: (props: { newContractNumber: string }) => {
        return props?.newContractNumber ? props?.newContractNumber : "0";
      },
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Start Date",
      name: "startDate",
      cell: (props: { startDate: Date | string }) => {
        return props.startDate
          ? moment(props?.startDate).format("DD/MM/YYYY")
          : "-";
      },
      option: {
        sort: true,
      },
    },
    {
      header: "End Date",
      name: "endDate",
      cell: (props: { endDate: Date | string }) => {
        return props.endDate
          ? moment(props?.endDate).format("DD/MM/YYYY")
          : "-";
      },
      option: {
        sort: true,
      },
    },
    {
      header: "Created Date",
      name: "createdAt",
      cell: (props: { createdAt: Date | string }) => {
        return props.createdAt
          ? moment(props?.createdAt).format("DD/MM/YYYY")
          : "-";
      },
      option: {
        sort: true,
      },
    },
    {
      header: "Action",
      cell: (props: {
        id: string;
        contractTemplateVersion: { contractTemplate: { contractName: string } };
      }) =>
        actionButton(
          props.id,
          props?.contractTemplateVersion?.contractTemplate?.contractName ?? "#"
        ),
    },
  ];
  const handlePDFExport = async (id: string, contractName: string) => {
    const isDefaultTemplate = ContractPdfTypes?.includes(contractName);
    const query = isDefaultTemplate
      ? `?type=default&contractName=${contractName}`
      : `?type=new`;
    const response = await GetContractSummaryDataById(id, query);

    if (response.data.response_type === "success") {
      // const currencyType = countries.find(
      //   (val) =>
      //     val.countryName ===
      //     response?.data?.responseData?.employeeDetail?.client?.country
      // )?.currencyCode;
      // if (currencyType) {
      //   setCurrency(currencyType);
      // }
      setContractPDFDetail(response.data.responseData);

      setExportFlag(true);
    }
  };

  const fetchAllContractSummary = async (query: string) => {
    setLoader(true);
    const response = await GetAllContractSummary(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setContractSummaryDataPage({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    setLoader(false);
  };

  const handleOpenModal = (id: string) => {
    setContractSummaryId(id);
    setOpen(true);
  };

  const contractSummaryDelete = async (id: string) => {
    const response = await DeleteContractSummary(Number(id));
    if (response?.data?.response_type === "success") {
      await fetchAllContractSummary(queryString);
    }
    setOpen(false);
  };

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (pdfExportRef.current && exportFlag) {
  //     pdfExportRef.current.save();
  //     setExportFlag(false);
  //   }
  // }, [exportFlag]);

  useEffect(() => {
    if (
      activeClient &&
      activeEmployee &&
      (currentPage === 1 || currentPageNumber != currentPage)
    ) {
      fetchAllContractSummary(queryString);
    }

    setPageState({
      state: DefaultState.ContractSummary as string,
      value: {
        ...pageStateData,
        page:
          contractSummaryDataPage.totalCount == limit
            ? 1
            : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, activeClient, activeEmployee, sort, sortType]);

  const getContentForPDF = () => {
    if (contractPDFDetail) {
      // if (isDefaultTemplate) {
      switch (PDFExportFileName) {
        case ContractPdfEnumTypes.Salarié: {
          if (
            contractPDFDetail?.employeeDetail?.rotation?.weekOn !== null &&
            contractPDFDetail?.employeeDetail?.rotation?.weekOff !== null &&
            contractPDFDetail?.employeeDetail?.rotation?.isResident !== true
          ) {
            // Non-Resident Rotation..
            return (
              <ContratDeTravail
                contractDetails={contractPDFDetail}
                isUpdate={true}
                rotation={"non-resident"}
              />
            );
          } else if (
            (contractPDFDetail?.employeeDetail?.rotation?.weekOn === null ||
              contractPDFDetail?.employeeDetail?.rotation?.weekOn !== null) &&
            (contractPDFDetail?.employeeDetail?.rotation?.weekOff === null ||
              contractPDFDetail?.employeeDetail?.rotation?.weekOff !== null) &&
            contractPDFDetail?.employeeDetail?.rotation?.isResident === true
          ) {
            // Resident Rotation..
            return (
              <ContratDeTravail
                contractDetails={contractPDFDetail}
                isUpdate={true}
                rotation={"resident"}
              />
            );
          } else if (
            contractPDFDetail?.employeeDetail?.rotation?.weekOn === null &&
            (contractPDFDetail?.employeeDetail?.rotation?.description ===
              null ||
              contractPDFDetail?.employeeDetail?.rotation?.description ===
                "") &&
            contractPDFDetail?.employeeDetail?.rotation?.weekOff === null &&
            contractPDFDetail?.employeeDetail?.rotation?.isResident === false &&
            contractPDFDetail?.employeeDetail?.rotation?.daysWorked === null &&
            contractPDFDetail?.employeeDetail?.rotation?.isAllDays === false &&
            contractPDFDetail?.employeeDetail?.rotation?.isWeekendBonus ===
              false &&
            contractPDFDetail?.employeeDetail?.rotation?.isOvertimeBonus ===
              false
          ) {
            // CallOut Rotation..
            return (
              <ContratDeTravail
                contractDetails={contractPDFDetail}
                isUpdate={true}
                rotation={"call-out"}
              />
            );
          } else {
            return (
              <ContractPDF
                data={contractPDFDetail?.description?.replaceAll(
                  /&lt;br&gt;/g,
                  " "
                )}
              />
            );
          }
        }
        case ContractPdfEnumTypes.LRED_Avenant:
          return (
            <Avenant contractDetails={contractPDFDetail} isUpdate={true} />
          );
        case ContractPdfEnumTypes.Expat_Contract:
          return <Expat contractDetails={contractPDFDetail} isUpdate={true} />;
        default:
          return (
            <ContractPDF
              data={contractPDFDetail?.description?.replaceAll(
                /&lt;br&gt;/g,
                " "
              )}
            />
          );
      }
    } else {
      return <ContractPDF data={""} />;
    }
  };

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={contractSummaryDataPage.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.EmployeeContract,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.EmployeeContract,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonLink="/contract/summary/add"
        isEmployeeDropdown={!isCheckEmployee}
        isClientDropdown={false}
        loader={activeEmployee !== 0 && loader}
        pagination={true}
        paginationModule={DefaultState.ContractSummary}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={contractSummaryDataPage.totalPage}
        dataCount={contractSummaryDataPage.totalCount}
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
          onClickHandler={() => contractSummaryDelete(contractSummaryId)}
          confirmationText="Are you sure you want to delete this contract?"
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}

      {contractPDFDetail && exportFlag && (
        <div className="h-0 overflow-hidden">
          <BlobProvider document={getContentForPDF()}>
            {({ blob, loading, error }) => {
              // Update loading state
              setIsGeneratingPdf(loading);
              
              // Handle download when blob is ready
              if (blob && !loading && !error) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${PDFExportFileName}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setExportFlag(false);
              }
              
              // Show loading state
              return (
                <div className="text-center py-4">
                  {loading ? 'Generating PDF...' : 'Preparing download...'}
                </div>
              );
            }}
          </BlobProvider>
        </div>
      )}
    </>
  );
};

export default ContractSummaryList;
