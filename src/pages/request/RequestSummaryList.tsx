import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRequestTypeData } from "@/interface/requestType/requestTypeInterface";
import moment from "moment";
import AddRequestDocument from "./AddRequestDocument";
import {
  DeleteRequestDocument,
  GetAllRequestDocument,
  UpdateRequestDocumentStatusById,
} from "@/services/requestService";
import { useNavigate } from "react-router-dom";
import { IClientResponseData } from "@/interface/client/clientInterface";
import { DeleteIcon } from "@/components/svgIcons";
import Modal from "@/components/modal/Modal";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { DeleteButton, ViewButton } from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { activeClientSelector } from "@/redux/slices/clientSlice";

const RequestSummaryList = () => {
  const [limit, setLimit] = useState<number>(10);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Request Document Modal
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.RequestSummary ? pageState?.value : {};
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.RequestSummary
      ? pageStateData?.page ?? 1
      : currentPage;
  const activeClient = useSelector(activeClientSelector);
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [open, setOpen] = useState(false); // For Delete Modal
  const [requestId, setRequestId] = useState<string>("");
  const currentDate = new Date(),
    year = currentDate.getFullYear(),
    month = currentDate.getMonth();
  const [dateFilter, setDateFilter] = useState({
    startDate: pageStateData?.startDate ?? new Date(year, month, 1),
    endDate: pageStateData?.endDate ?? new Date(year, month + 1, 0),
  });
  const [requestTypeData, setRequestTypeData] = useState<{
    data: IRequestTypeData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    activeClient &&
      (currentPage === 1 || currentPageNumber != currentPage) &&
      fetchAllRequest();

    setPageState({
      state: DefaultState.RequestSummary as string,
      value: {
        ...pageStateData,
        page:
          pageStateData?.startDate != dateFilter?.startDate ||
          pageStateData?.endDate != dateFilter?.endDate
            ? 1
            : requestTypeData.totalCount == limit
            ? 1
            : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    limit,
    activeClient,
    sort,
    sortType,
    dateFilter?.startDate,
    dateFilter?.endDate,
  ]);

  async function fetchAllRequest(query?: string) {
    let queryString = `?limit=${limit}&page=${currentPage}&sort=${
      sortType ? "asc" : "desc"
    }&clientId=${activeClient}&sortBy=${sort}&startDate=${moment(
      dateFilter.startDate
    ).format("YYYY/MM/DD")}&endDate=${moment(dateFilter.endDate).format(
      "YYYY/MM/DD"
    )}`;
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    queryString = query ? queryString + query : queryString + searchParam;
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllRequestDocument(queryString);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setRequestTypeData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const updateRequestStatus = async (id: string) => {
    const params = {
      status: "STARTED",
    };
    await UpdateRequestDocumentStatusById(id, params);
  };

  const handleOpenModal = (id: string) => {
    setRequestId(id);
    setOpen(true);
  };

  const requestDelete = async (id: string) => {
    setDeleteLoader(true);
    const response = await DeleteRequestDocument(Number(id));
    if (response?.data?.response_type === "success") {
      await fetchAllRequest();
    }
    setDeleteLoader(false);
    setOpen(false);
  };

  const actionButton = (id: string, status: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.Request, PermissionEnum.View) && (
          <ViewButton
            onClickHandler={async () => {
              if (status == "NEW") await updateRequestStatus(id);
              navigate(`/requests/${id}`);
            }}
          />
        )}
        {getPermissions(FeaturesNameEnum.Request, PermissionEnum.Delete) && (
          <DeleteButton onClickHandler={() => handleOpenModal(id)} />
        )}
      </div>
    );
  };

  const columnData = [
    {
      header: "Requested",
      name: "createdAt",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { createdAt: string }) =>
        moment(props?.createdAt).format("DD/MM/YYYY hh:mm"),
    },
    {
      header: "Client",
      name: "notificationEmails",
      className: "",
      option: {
        sort: false,
      },
      cell: (props: { client?: IClientResponseData }) =>
        props?.client?.loginUserData?.name
          ? props?.client?.loginUserData?.name
          : "Unknown",
    },
    {
      header: "Name",
      name: "name",
      className: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Contract Number",
      name: "contractNumber",
      className: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Mobile Number",
      name: "mobileNumber",
      className: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Email",
      name: "email",
      className: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Type",
      name: "collectionDelivery",
      className: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Segment",
      name: "segment",
      className: "",
      option: {
        sort: false,
      },
      cell: (props: {
        employee: { segment: { name: string }; subSegment?: { name: string } };
      }) =>
        props?.employee?.segment && props?.employee?.subSegment
          ? props?.employee?.segment?.name +
            " - " +
            props?.employee?.subSegment?.name
          : props?.employee?.segment
          ? props?.employee?.segment?.name
          : "-",
    },
    {
      header: "Delivery/Collection",
      name: "notificationEmails",
      className: "",
      option: {
        sort: false,
      },
      cell: (props: { deliveryDate: string }) =>
        moment(props?.deliveryDate).format("DD/MM/YYYY"),
    },
    {
      header: "Document Total",
      name: "documentTotal",
      className: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Status",
      name: "status",
      className: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Action",
      cell: (props: { id: string; status: string }) =>
        actionButton(props.id, props.status),
    },
  ];

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        isSearch={true}
        paginationApiCb={fetchAllRequest}
        headerData={columnData as ITableHeaderProps[]}
        bodyData={requestTypeData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.Request,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.Request,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.RequestSummary}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={requestTypeData.totalPage}
        dataCount={requestTypeData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        isDateRange={true}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
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
        <AddRequestDocument
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllRequest();
          }}
        />
      )}
    </>
  );
};

export default RequestSummaryList;
