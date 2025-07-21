import { DeleteIcon, EditIocn } from "@/components/svgIcons";
import AddUpdateVehicle from "./AddUpdateVehicle";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DeleteVehicleDocumentById,
  GetVehicleDataById,
  GetVehicleDocumentById,
} from "@/services/transportVehicleService";
import { IVehicleData } from "@/interface/transport/transportInterface";
import Table from "@/components/table/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import AddUpdateVehicleDocument from "./AddUpdateVehicleDocument";
import { FormatDate, convertBytes } from "@/helpers/Utils";
import { VITE_APP_API_URL } from "@/config";
import Modal from "@/components/modal/Modal";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { DeleteButton, EditButton } from "@/components/CommonComponents";
import { GetFilePermissionLink } from "@/utils/commonConstants";

const DocumentCell = (props: {
  documentName: string;
  documentPath: string;
}) => {
  return (
    <Link
      to={"#"}
      onClick={async () => {
        if (props.documentPath) {
          let link = await GetFilePermissionLink(props.documentPath);
          if (link) {
            link = `${String(VITE_APP_API_URL)}${link}`;
            window.open(link, "_blank");
          }
        }
      }}
    >
      <span className="underline">
        {props.documentName ? props.documentName : "-"}
      </span>
    </Link>
  );
};

const formatIssueDateCell = (props: { issueDate: string }) => {
  return <>{props?.issueDate ? FormatDate(props?.issueDate) : "-"}</>;
};

const formatExpiryDateCell = (props: { expiryDate: string }) => {
  return <>{props?.expiryDate ? FormatDate(props?.expiryDate) : "-"}</>;
};

const formatDocumentSizeCell = (props: { documentSize: number }) => {
  return <>{props?.documentSize ? convertBytes(props?.documentSize) : "-"}</>;
};

function VehicleDetail() {
  const dispatch = useDispatch();
  const { id } = useParams(); //vehicleId
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
  const [vehicleData, setVehicleData] = useState<IVehicleData>();
  const [vehicleDocumentId, setVehicleDocumentId] = useState<string>("");
  const [vehicleDocumentData, setVehicleDocumentData] = useState<{
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
    }&sortBy=${sort}&vehicleId=${id}` +
    (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);

  useEffect(() => {
    dispatch(currentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getVehicleDataById(String(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (clientId) getVehicleDocumentById(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, clientId, limit, sort, sortType, id]);

  const getVehicleDataById = async (id: string) => {
    dispatch(showLoader());
    if (id) {
      const response = await GetVehicleDataById(id);
      if (
        response.data.responseData &&
        response.data.response_type === "success"
      ) {
        setVehicleData(response.data.responseData);
      }
    }
    dispatch(hideLoader());
  };

  const getVehicleDocumentById = async (queryString: string) => {
    dispatch(showLoader());
    setLoader(true);
    if (clientId) {
      const response = await GetVehicleDocumentById(queryString);
      if (
        response.data.responseData &&
        response.data.response_type === "success"
      ) {
        const result = response.data.responseData;
        setVehicleDocumentData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
      }
    }
    setLoader(false);
    dispatch(hideLoader());
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
      cell: DocumentCell,
    },
    {
      header: "Upload Date",
      name: "createdAt",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
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
      cell: formatIssueDateCell,
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
      cell: formatExpiryDateCell,
    },
    {
      header: "Size",
      name: "model",
      className: "",
      commonClass: "",
      subString: true,
      cell: formatDocumentSizeCell,
    },
    {
      header: "Upload File",
      tableLastTheadClass: "justify-end",
      cell: (props: { id: string }) => actionButton(props.id),
    },
  ];

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5  justify-end">
        <EditButton
          onClickHandler={() => {
            setOpenDocumentModal(true);
            setVehicleDocumentId(id);
          }}
        />
        <DeleteButton onClickHandler={() => handleOpenModal(id)} />
      </div>
    );
  };

  const handleOpenModal = (id: string) => {
    setVehicleDocumentId(id);
    setOpenDeleteModal(true);
  };

  const vehicleDocumentDelete = async (id: string) => {
    setDeleteLoader(true);
    const response = await DeleteVehicleDocumentById(Number(id));
    if (response?.data?.response_type === "success") {
      const tempVehicleDocumentData = { ...vehicleDocumentData };
      const index = tempVehicleDocumentData.data.findIndex(
        (e: { id: string }) => e.id === id
      );
      if (index !== -1) {
        tempVehicleDocumentData.data.splice(index, 1);
        setVehicleDocumentData(tempVehicleDocumentData);

        if (tempVehicleDocumentData.data?.length === 0 && currentPage !== 1) {
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
            <span className="inline-block">Vehicle Details</span>
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
              <span className="text-sm/18px font-bold mr-3">Vehicle No:</span>
              <span className="text-sm/18px font-medium">
                {vehicleData?.vehicleNo ?? "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Year:</span>
              <span className="text-sm/18px font-medium">
                {vehicleData?.year ?? "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Type:</span>
              <span className="text-sm/18px font-medium">
                {vehicleData?.type?.name ?? "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Model:</span>
              <span className="text-sm/18px font-medium">
                {vehicleData?.models?.name ?? "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Capacities:</span>
              <span className="text-sm/18px font-medium">
                {vehicleData?.capacity ?? "-"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Table
        headerData={columnData as ITableHeaderProps[]}
        bodyData={vehicleDocumentData.data}
        isButton={false}
        isClientDropdown={false}
        loader={loader}
        pagination={true}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={vehicleDocumentData.totalPage}
        dataCount={vehicleDocumentData.totalCount}
        isUploadFileHeader={true}
        setOpenModal={setOpenDocumentModal}
        setDocumentId={setVehicleDocumentId}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        tableLastTheadClass=" group-last/sort:justify-end"
      />
      {openModal && (
        <AddUpdateVehicle
          setOpenModal={setOpenModal}
          id={id}
          fetchDataById={getVehicleDataById}
        />
      )}
      {openDocumentModal && (
        <AddUpdateVehicleDocument
          setOpenModal={setOpenDocumentModal}
          vehicleDetail={vehicleData}
          id={vehicleDocumentId}
          fetchAllData={() => {
            getVehicleDocumentById(queryString);
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
          onClickHandler={() => vehicleDocumentDelete(vehicleDocumentId)}
          confirmationText="Are you sure you want to delete this vehicle document?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
    </div>
  );
}

export default VehicleDetail;
