import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChangeRequestTypeStatus,
  DeleteRequestType,
  GetAllRequestType,
} from "@/services/requestTypeService";
import AddUpdateRequestType from "./AddUpdateRequestType";
import { IRequestTypeData } from "@/interface/requestType/requestTypeInterface";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import {
  ArchiveButton,
  DeleteButton,
  EditButton,
  statusRender,
} from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";

const RequestTypeList = () => {
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.RequestType ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Request Type Modal
  const dispatch = useDispatch();
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.RequestType
      ? pageStateData?.page ?? 1
      : currentPage;
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [tabData, setTabData] = useState<number>(
    pageStateData?.tabData != null && pageStateData?.tabData != undefined
      ? pageStateData?.tabData
      : 1
  );
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [requestTypeData, setRequestTypeData] = useState<{
    data: IRequestTypeData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [requestTypeId, setRequestTypeId] = useState<string>("");

  const queryStringBase = `?limit=${limit}&page=${currentPage}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}`;
  let isActivePart = "";

  if (tabData !== -1) {
    isActivePart = `&isActive=${tabData ? "true" : "false"}`;
  }
  const queryString = queryStringBase + isActivePart;

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabData]);

  useEffect(() => {
    (async () => {
      (currentPage === 1 || currentPageNumber != currentPage) &&
        (await fetchAllRequestType(queryString));
    })();

    setPageState({
      state: DefaultState.RequestType as string,
      value: {
        ...pageStateData,
        page:
          requestTypeData.totalCount == limit
            ? 1
            : pageStateData?.tabData == tabData
            ? pageStateData?.page ?? 1
            : 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
        tabData: tabData,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, tabData, sort, sortType]);

  async function fetchAllRequestType(query: string) {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllRequestType(query);

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

  const handleOpenModal = (id: string) => {
    setRequestTypeId(id);
    setOpen(true);
  };

  const requestTypeDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const response = await DeleteRequestType(Number(id));
      if (response?.data?.response_type === "success") {
        await fetchAllRequestType(queryString);
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
    setDeleteLoader(false);
  };

  const handleStatusUpdate = async (id: string, isActive: boolean) => {
    const params = {
      isActive: !isActive,
    };
    const response = await ChangeRequestTypeStatus(params, id);
    if (response.data.response_type === "success") {
      await fetchAllRequestType(queryString);
    }
  };

  const actionButton = (id: string, status: boolean) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(
          FeaturesNameEnum.RequestType,
          PermissionEnum.Update
        ) && (
          <>
            <EditButton
              onClickHandler={() => {
                setRequestTypeId(id);
                setOpenModal(true);
              }}
            />
            <ArchiveButton
              onClickHandler={() => handleStatusUpdate(id, status)}
              status={status}
            />
          </>
        )}
        {getPermissions(
          FeaturesNameEnum.RequestType,
          PermissionEnum.Delete
        ) && <DeleteButton onClickHandler={() => handleOpenModal(id)} />}
      </div>
    );
  };

  const columnData = [
    {
      header: "Name",
      name: "name",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Notification Emails",
      name: "notificationEmails",
      subString: true,
      option: {
        sort: true,
      },
      cell: (props: { notificationEmails: string }) =>
        props.notificationEmails
          ? props.notificationEmails.replaceAll(",", ", ")
          : "",
    },
    {
      ...(tabData == -1 && {
        header: "Status",
        name: "status",
        className: "",
        commonClass: "",
        cell: (props: { isActive: boolean }) => statusRender(props.isActive),
      }),
    },
    {
      header: "Action",
      cell: (props: { id: string; status: string; isActive: boolean }) =>
        actionButton(props.id, props.isActive),
    },
  ];

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={requestTypeData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.RequestType,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.RequestType,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setRequestTypeId("");
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.RequestType}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={requestTypeData.totalPage}
        dataCount={requestTypeData.totalCount}
        isTab={true}
        setTab={setTabData}
        tabValue={tabData}
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
          onClickHandler={() => requestTypeDelete(requestTypeId)}
          confirmationText="Are you sure you want to delete this request type?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateRequestType
          id={requestTypeId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllRequestType(queryString);
          }}
        />
      )}
    </>
  );
};

export default RequestTypeList;
