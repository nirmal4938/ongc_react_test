import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IContractTemplateData } from "@/interface/contractTemplate/contractTemplate";
import { GetContractTemplateData } from "@/services/contractTemplateService";
import { Option } from "@/interface/customSelect/customSelect";
import { IContractTemplateVersionData } from "@/interface/contractTemplateVersion/contractTemplateVersion";
import {
  DeleteContractTemplateVersion,
  GetAllContractTemplateVersion,
  GetContractTemplateVersionDataById,
} from "@/services/contractTemplateVersionService";
import moment from "moment";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import {
  ContractPdfEnumTypes,
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { DeleteButton, PDFDownloadButton } from "@/components/CommonComponents";
import { useLocation } from "react-router-dom";
import ContractPDF from "@/components/pdfDownload/components/ContractPdf";
import { Avenant } from "@/components/pdfDownload/components/AvenantContractPdf";
import { ContratDeTravail } from "@/components/pdfDownload/components/ContratDeTravailPdf";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { handleDownload } from "@/helpers/Utils";
import { Expat } from "@/components/pdfDownload/components/ExpatContractPdf";
// import { PDFExport } from "@progress/kendo-react-pdf";
// import { Expat } from "@/components/pdfDownload/components/ExpatContractPdf";

const ContractTemplateVersionList = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.ContractTemplateVersion
      ? pageState?.value
      : {};
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.ContractTemplateVersion
      ? pageStateData?.page ?? 1
      : currentPage;
  const clientId = useSelector(activeClientSelector);
  const [limit, setLimit] = useState<number>(10);
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false); // Added state for PDF generation
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [contractTemplateList, setContractTemplateList] = useState<Option[]>(
    []
  );
  const [contractVersionPDFDetail, setContractVersionPDFDetail] =
    useState<IContractTemplateVersionData>();
  const [contractTemplateVersionId, setContractTemplateVersionId] =
    useState<string>("");
  const [contractTemplateId, setContractTemplateId] = useState<number>(
    pageStateData?.contractTemplateId ?? 0
  );
  const [contractTemplateVersionDataPage, setContractTemplateVersionDataPage] =
    useState<{
      data: IContractTemplateVersionData[];
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
  const queryString =
    `?limit=${limit}&page=${currentPage} 
    &sort=${sortType ? "asc" : "desc"}&sortBy=${sort}` +
    (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``) +
    (contractTemplateId ? `&contractTemplateId=${contractTemplateId}` : ``);

  const actionButton = (
    id: string,
    clientId: number | null,
    contractName: string
  ) => {
    return (
      <div className="flex items-center gap-1.5">
        <PDFDownloadButton
          onClickHandler={() => {
            handlePDFExport(id);
            setPDFExportFileName(contractName);
          }}
        />
        {getPermissions(
          FeaturesNameEnum.ContractTemplateVersion,
          PermissionEnum.Delete
        ) &&
          clientId != null && (
            <DeleteButton onClickHandler={() => handleOpenModal(id)} />
          )}
      </div>
    );
  };
  const columnData = [
    {
      header: "Version No",
      name: "versionNo",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Version Name",
      name: "versionName",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    // {
    //   header: "Description",
    //   name: "description",
    //   cell: (props: { description: string }) =>
    //     props.description ? props.description.replace(/<(.|\n)*?>/g, "") : "-",
    //   className: "",
    //   commonClass: "",
    //   option: {
    //     sort: true,
    //   },
    // },
    {
      header: "Status",
      cell: (props: { id: string; isActive: boolean }) =>
        props?.isActive === true ? "Approved" : "Draft",
    },
    {
      header: "Created By",
      cell: (props: {
        createdByUser: {
          loginUserData: {
            email: string;
          };
        };
      }) =>
        props?.createdByUser?.loginUserData?.email
          ? props?.createdByUser?.loginUserData?.email
          : "-",
    },
    {
      header: "Created Date",
      name: "createdAt",
      cell: (props: { createdAt: Date | string }) => {
        return moment(props?.createdAt).format("DD/MM/YYYY");
      },
      option: {
        sort: true,
      },
    },
    {
      header: "Approved By",
      cell: (props: {
        isActive: boolean;
        createdByUser: {
          loginUserData: {
            email: string;
          };
        };
      }) =>
        props?.isActive === true && props?.createdByUser?.loginUserData?.email
          ? props?.createdByUser?.loginUserData?.email
          : "-",
    },
    {
      header: "Approved Date",
      name: "updatedAt",
      cell: (props: { updatedAt: Date | string }) => {
        return props.updatedAt
          ? moment(props?.updatedAt).format("DD/MM/YYYY")
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
        versionName: string | null;
        contractTemplate: { clientId: number | null; contractName: string };
      }) => {
        return actionButton(
          props.id,
          props?.contractTemplate?.clientId,
          props?.contractTemplate?.contractName
        );
      },
    },
  ];

  const fetchAllContractTemplate = async (query: string) => {
    const response = await GetContractTemplateData(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      const contractTemplateList = result?.data
        // ?.filter(
        //   (e: IContractTemplateData) =>
        //     e.contractName !== ContractPdfEnumTypes.Expat_Contract
        // )
        ?.map((value: IContractTemplateData) => ({
          label: value.contractName,
          value: value.id,
        }));
      setContractTemplateList(contractTemplateList);
      if (state?.contractTemplateId) {
        setContractTemplateId(
          contractTemplateList?.length ? state.contractTemplateId : -1
        );
      } else {
        setContractTemplateId(
          contractTemplateList?.length
            ? pageStateData?.contractTemplateId ??
                contractTemplateList[0]?.value
            : -1
        );
      }
    }
  };

  const handlePDFExport = async (id: string) => {
    const response = await GetContractTemplateVersionDataById(id);
    if (response.data.response_type === "success") {
      setContractVersionPDFDetail(response.data.responseData);
      setExportFlag(true);
    }
  };

  const fetchAllContractTemplateVersion = async (query: string) => {
    setLoader(true);
    const response = await GetAllContractTemplateVersion(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setContractTemplateVersionDataPage({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    setLoader(false);
  };

  const handleOpenModal = (id: string) => {
    setContractTemplateVersionId(id);
    setOpen(true);
  };

  const contractTemplateDelete = async (id: string) => {
    setDeleteLoader(true);
    const response = await DeleteContractTemplateVersion(Number(id));
    if (response?.data?.response_type === "success") {
      await fetchAllContractTemplateVersion(queryString);
    }
    setDeleteLoader(false);
    setOpen(false);
  };

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    if (clientId) {
      fetchAllContractTemplate(`?clientId=${clientId}&isActive=${true}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // useEffect(() => {
  //   if (
  //     pdfExportRef.current &&
  //     exportFlag &&
  //     PDFExportFileName === ContractPdfEnumTypes.Expat_Contract
  //   ) {
  //     pdfExportRef.current.save();
  //     setExportFlag(false);
  //   }
  // }, [exportFlag]);

  useEffect(() => {
    if (
      contractTemplateId &&
      (currentPage === 1 || currentPageNumber != currentPage)
    ) {
      fetchAllContractTemplateVersion(queryString);
    }

    setPageState({
      state: DefaultState.ContractTemplateVersion as string,
      value: {
        ...pageStateData,
        page:
          contractTemplateId != pageStateData?.contractTemplateId
            ? 1
            : contractTemplateVersionDataPage.totalCount == limit
            ? 1
            : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
        contractTemplateId: contractTemplateId,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, contractTemplateId, sort, sortType]);

  const getContentForPDF = () => {
    if (contractVersionPDFDetail) {
      // if (isDefaultTemplate) {
      switch (PDFExportFileName) {
        case ContractPdfEnumTypes.Salarié:
          return <ContratDeTravail isUpdate={false} />;
        case ContractPdfEnumTypes.LRED_Avenant:
          return <Avenant isUpdate={false} />;
        case ContractPdfEnumTypes.Expat_Contract:
          return <Expat isUpdate={false} />;
        default:
          return (
            <ContractPDF
              data={contractVersionPDFDetail?.description?.replaceAll(
                /&lt;br&gt;/g,
                " "
              )}
            />
          );
        // return <Salary contractDetails={contractPDFDetail} />;
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
        bodyData={contractTemplateVersionDataPage.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.ContractTemplateVersion,
          PermissionEnum.View
        )}
        // isButton={getPermissions(
        //   FeaturesNameEnum.ContractTemplateVersion,
        //   PermissionEnum.Create
        // )}
        // buttonText="Add"
        // buttonLink={`/contract-template-version/add?contract-template-version-id=${contractTemplateId}`}
        isDropdown={true}
        dropDownList={contractTemplateList}
        dropDownValue={contractTemplateId}
        setDropdownValue={(value: number | string | (number | string)[]) => {
          setContractTemplateId(Number(value));
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.ContractTemplateVersion}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={contractTemplateVersionDataPage.totalPage}
        dataCount={contractTemplateVersionDataPage.totalCount}
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
          onClickHandler={() =>
            contractTemplateDelete(contractTemplateVersionId)
          }
          confirmationText="Are you sure you want to delete this contract version?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {contractVersionPDFDetail && exportFlag && (
        <div className="h-0 overflow-hidden">
          <BlobProvider document={getContentForPDF()}>
            {({ blob, loading, error }: { 
              blob: Blob | null; 
              loading: boolean; 
              error: Error | null 
            }) => {
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

export default ContractTemplateVersionList;
