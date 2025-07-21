import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  DeleteRequestById,
  GetAllRequestData,
} from "@/services/transportRequestService";
import { IRequestData } from "@/interface/transport/transportInterface";
import { FormatDate } from "@/helpers/Utils";
import AddUpdateRequest from "./AddUpdateRequest";
import { useNavigate } from "react-router-dom";
import AddUpdateRequestVehicle from "./AddUpdateRequestVehicle";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import {
  DeleteButton,
  EditButton,
  PlusButton,
} from "@/components/CommonComponents";

const StatusCell: React.FC<{ status: string }> = (props) => {
  let statusElement: React.ReactNode;

  if (props?.status === "DRAFT") {
    statusElement = <span className="font-semibold">Draft</span>;
  } else if (props?.status === "STARTED") {
    statusElement = (
      <span className="font-semibold text-tomatoRed">Started</span>
    );
  } else if (props?.status === "INPROGRESS") {
    statusElement = (
      <span className="font-semibold text-PrimaryBlue">In Progress</span>
    );
  } else if (props?.status === "COMPLETED") {
    statusElement = (
      <span className="font-semibold text-PrimaryGreen">Completed</span>
    );
  } else {
    statusElement = <span>{props?.status}</span>;
  }

  return <>{statusElement}</>;
};

const RequestList = () => {
  const clientId = useSelector(activeClientSelector);
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.TransportRequest ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update requests Modal
  const [openAddVehicleModal, setOpenAddVehicleModal] =
    useState<boolean>(false); // For Add Update requests vehicle Modal
  const dispatch = useDispatch();
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(currentPage);
  currentPage =
    pageState?.state == DefaultState.TransportRequest
      ? pageStateData?.page ?? 1
      : currentPage;
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [requestData, setRequestData] = useState<{
    data: IRequestData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState<string>("");

  const [requestedData, setRequestedData] = useState<IRequestData>();

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      clientId != 0 &&
      clientId != -1 &&
      (currentPage === 1 || currentPageNumber != currentPage)
    )
      fetchAllRequestData();

    setPageState({
      state: DefaultState.TransportRequest as string,
      value: {
        ...pageStateData,
        page: requestData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, clientId, limit, sort, sortType]);

  async function fetchAllRequestData(query?: string) {
    let queryString =
      `?page=${currentPage}&limit=${limit}&sort=${
        sortType ? "asc" : "desc"
      }&sortBy=${sort}` +
      (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    queryString = query ? queryString + query : queryString + searchParam;
    !query && dispatch(showLoader());
    setLoader(true);
    if (clientId) {
      const response = await GetAllRequestData(queryString);

      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setRequestData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
      }
    }
    setLoader(false);
    !query && dispatch(hideLoader());
  }

  const handleOpenModal = (id: string) => {
    setRequestId(id);
    setOpen(true);
  };

  const requestDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const response = await DeleteRequestById(Number(id));
      if (response?.data?.response_type === "success") {
        await fetchAllRequestData();
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
    setDeleteLoader(false);
  };

  const actionButton = (props: IRequestData) => {
    return (
      <div className="flex items-center gap-1.5">
        {(getPermissions(
          FeaturesNameEnum.TransportRequestVehicle,
          PermissionEnum.Create
        ) &&
          props?.status !== "INPROGRESS" &&
          props?.status !== "COMPLETED" && (
            <PlusButton
              onClickHandler={() => {
                setRequestedData(props);
                setOpenAddVehicleModal(true);
              }}
            />
          )) || <span className="w-7 h-7"></span>}
        {getPermissions(
          FeaturesNameEnum.TransportRequest,
          PermissionEnum.Update
        ) && (
          <EditButton
            onClickHandler={() => {
              navigate(`/transport/requests/edit/${props.id}`);
            }}
          />
        )}
        {getPermissions(
          FeaturesNameEnum.TransportRequest,
          PermissionEnum.Delete
        ) && <DeleteButton onClickHandler={() => handleOpenModal(props.id)} />}
      </div>
    );
  };

  const columnData = [
    {
      header: "Request Date",
      name: "createdAt",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { createdAt: string }) =>
        props.createdAt ? FormatDate(props.createdAt) : "-",
    },
    {
      header: "Requested By",
      name: "createdByUser",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { createdByUser: { loginUserData: { email: string } } }) =>
        props?.createdByUser?.loginUserData?.email,
    },
    {
      header: "Start Date",
      name: "startDate",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { startDate: string }) =>
        props?.startDate ? FormatDate(props?.startDate) : "-",
    },
    {
      header: "Start City",
      name: "source",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
    },
    {
      header: "Destination Date",
      name: "destinationDate",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
      cell: (props: { destinationDate: string }) =>
        props?.destinationDate ? FormatDate(props?.destinationDate) : "-",
    },
    {
      header: "Destination City",
      name: "destination",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
    },
    {
      header: "Status",
      name: "status",
      cell: StatusCell,
    },
    {
      header: "",
      cell: (props: IRequestData) => actionButton(props),
    },
  ];

  return (
    <>
      <Table
        isSearch={true}
        paginationApiCb={fetchAllRequestData}
        headerData={columnData as ITableHeaderProps[]}
        bodyData={requestData.data}
        isButton={getPermissions(
          FeaturesNameEnum.TransportRequest,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setRequestId("");
          setOpenModal(true);
        }}
        isClientDropdown={false}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.TransportRequest}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={requestData.totalPage}
        dataCount={requestData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        isShowTable={
          getPermissions(
            FeaturesNameEnum.TransportRequest,
            PermissionEnum.View
          ) ||
          getPermissions(
            FeaturesNameEnum.TransportRequestVehicle,
            PermissionEnum.View
          )
        }
      />
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => requestDelete(requestId)}
          confirmationText="Are you sure you want to delete this request?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateRequest
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllRequestData();
          }}
        />
      )}

      {openAddVehicleModal && (
        <AddUpdateRequestVehicle
          requestData={requestedData}
          requestId={requestedData?.id}
          setOpenModal={setOpenAddVehicleModal}
          fetchAllData={() => {
            fetchAllRequestData();
          }}
        />
      )}
    </>
  );
};

export default RequestList;
