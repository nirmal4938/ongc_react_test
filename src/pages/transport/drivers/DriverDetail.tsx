import { DeleteIcon, EditIocn } from "@/components/svgIcons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DeleteDriverDocumentById,
  GetAllDriverDocumentById,
  GetDriverDataById,
} from "@/services/transportDriverService";
import {
  DocumentCellProps,
  IDriverData,
} from "@/interface/transport/transportInterface";
import Table from "@/components/table/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { FormatDate, convertBytes, dateToExperience } from "@/helpers/Utils";
import { VITE_APP_API_URL } from "@/config";
import Modal from "@/components/modal/Modal";
import AddUpdateDriver from "./AddUpdateDriver";
import AddUpdateDriverDocument from "./AddUpdateDriverDocument";
import {
  FeaturesNameEnum,
  GetFilePermissionLink,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { DeleteButton, EditButton } from "@/components/CommonComponents";

const DocumentCell: React.FC<DocumentCellProps> = ({
  documentName,
  documentPath,
}) => {
  return (
    <Link
      to="#"
      onClick={async () => {
        if (documentPath) {
          let link = await GetFilePermissionLink(documentPath);
          if (link) {
            link = `${String(VITE_APP_API_URL)}${link}`;
            window.open(link, "_blank");
          }
        }
      }}
      className="underline"
    >
      <span>{documentName ? documentName : "-"}</span>
    </Link>
  );
};

function DriverDetail() {
  const dispatch = useDispatch();
  const { getPermissions } = usePermission();
  const { id } = useParams();
  const clientId = useSelector(activeClientSelector);
  const currentPage = useSelector(currentPageSelector);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDocumentModal, setOpenDocumentModal] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>("");
  const [sortType, setSortingType] = useState<boolean>(true);
  const [driverData, setDriverData] = useState<IDriverData>();
  const [driverDocumentId, setDriverDocumentId] = useState<string>("");
  const [driverDocumentData, setDriverDocumentData] = useState<{
    data: { id: string }[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  const queryString =
    `?page=${currentPage}&limit=${limit}&sort=${
      sortType ? "asc" : "desc"
    }&sortBy=${sort}&driverId=${id}` +
    (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);

  useEffect(() => {
    dispatch(currentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getDriverDataById(String(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (clientId) getDriverDocumentById(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, clientId, limit, sort, sortType, id]);

  const getDriverDataById = async (id: string) => {
    dispatch(showLoader());
    const response = await GetDriverDataById(id);
    if (
      response.data.responseData &&
      response.data.response_type === "success"
    ) {
      setDriverData(response.data.responseData);
    }
    dispatch(hideLoader());
  };

  const getDriverDocumentById = async (queryString: string) => {
    dispatch(showLoader());
    setLoader(true);
    if (clientId) {
      const response = await GetAllDriverDocumentById(queryString);
      if (
        response.data.responseData &&
        response.data.response_type === "success"
      ) {
        const result = response.data.responseData;
        setDriverDocumentData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
      }
    }
    setLoader(false);
    dispatch(hideLoader());
  };

  const renderDocumentCell = (documentName: string, documentPath: string) => (
    <DocumentCell documentName={documentName} documentPath={documentPath} />
  );

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5 justify-end">
        {getPermissions(
          FeaturesNameEnum.TransportDriverDocument,
          PermissionEnum.Update
        ) && (
          <EditButton
            onClickHandler={() => {
              setOpenDocumentModal(true);
              setDriverDocumentId(id);
            }}
          />
        )}
        {getPermissions(
          FeaturesNameEnum.TransportDriverDocument,
          PermissionEnum.Delete
        ) && <DeleteButton onClickHandler={() => handleOpenModal(id)} />}
      </div>
    );
  };

  const columnData = [
    {
      header: "Name",
      name: "documentName",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { documentName: string; documentPath: string }) =>
        renderDocumentCell(props?.documentName, props?.documentPath),
    },
    {
      header: "Upload Date",
      name: "createdAt",
      className: "",
      commonClass: "",
      subString: true,
      cell: (props: { createdAt: string }) =>
        props.createdAt ? FormatDate(props?.createdAt) : "-",
    },
    {
      header: "Issue Date",
      name: "issueDate",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
      cell: (props: { issueDate: string }) =>
        props.issueDate ? FormatDate(props?.issueDate) : "-",
    },
    {
      header: "Expiry Date",
      name: "expiryDate",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
      cell: (props: { expiryDate: string }) =>
        props.expiryDate ? FormatDate(props?.expiryDate) : "-",
    },
    {
      header: "Size",
      name: "model",
      className: "",
      commonClass: "",
      subString: true,
      cell: (props: { documentSize: number }) =>
        props.documentSize ? convertBytes(props?.documentSize) : "-",
    },
    {
      header: "Upload File",
      cell: (props: { id: string }) => actionButton(props?.id),
    },
  ];

  const handleOpenModal = (id: string) => {
    setDriverDocumentId(id);
    setOpenDeleteModal(true);
  };

  const driverDocumentDelete = async (id: string) => {
    setDeleteLoader(true);
    const response = await DeleteDriverDocumentById(Number(id));
    if (response?.data?.response_type === "success") {
      const tempDriverDocumentData = { ...driverDocumentData };
      const index = tempDriverDocumentData.data.findIndex(
        (e: { id: string }) => e.id === id
      );
      if (index !== -1) {
        tempDriverDocumentData.data.splice(index, 1);
        setDriverDocumentData(tempDriverDocumentData);
        
        if (tempDriverDocumentData.data?.length === 0 && currentPage !== 1) {
          dispatch(currentPageCount(currentPage - 1));
        }
      }
      setDeleteLoader(false);
      setOpenDeleteModal(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center justify-between bg-primaryRed/10 cursor-pointer py-15px px-3 rounded-lg last:rounded-r-lg text-dark text-base/5 text-left">
          <h4 className="text-25px leading-28px font-bold text-dark text-base/5 text-left">
            <span className="inline-block">Information</span>
          </h4>
          <span
            className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
              Edit
            </span>
            <EditIocn className="w-ful h-full pointer-events-none" />
          </span>
        </div>
        <div className="grid grid-cols-5 gap-4 bg-primaryRed/[0.03] py-4 px-3 text-black rounded-lg mt-3">
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Driver No:</span>
              <span className="text-sm/18px font-medium">
                {driverData?.driverNo ?? "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Position:</span>
              <span className="text-sm/18px font-medium">
                {driverData?.position?.name ?? "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">
                Years with Company:
              </span>
              <span className="text-sm/18px font-medium">
                {driverData?.companyStart
                  ? `${new Date(driverData?.companyStart).getFullYear()}`
                  : "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">
                Years Experience:
              </span>
              <span className="text-sm/18px font-medium">
                {driverData?.experienceStart
                  ? dateToExperience(driverData?.experienceStart)
                  : "-"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Table
        headerData={columnData as ITableHeaderProps[]}
        bodyData={driverDocumentData.data}
        isButton={false}
        isClientDropdown={false}
        loader={loader}
        pagination={true}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={driverDocumentData.totalPage}
        dataCount={driverDocumentData.totalCount}
        isUploadFileHeader={true}
        setOpenModal={setOpenDocumentModal}
        setDocumentId={setDriverDocumentId}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        tableLastTheadClass=" group-last/sort:justify-end"
        isShowTable={getPermissions(
          FeaturesNameEnum.TransportDriverDocument,
          PermissionEnum.View
        )}
      />

      {openModal && (
        <AddUpdateDriver
          setOpenModal={setOpenModal}
          id={id}
          fetchDataById={getDriverDataById}
        />
      )}
      {openDocumentModal && (
        <AddUpdateDriverDocument
          setOpenModal={setOpenDocumentModal}
          driverDetail={driverData}
          id={driverDocumentId}
          fetchAllData={() => {
            getDriverDocumentById(queryString);
          }}
        />
      )}

      {openDeleteModal && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpenDeleteModal(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => driverDocumentDelete(driverDocumentId)}
          confirmationText="Are you sure you want to delete this driver document?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
    </div>
  );
}

export default DriverDetail;
