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
import moment from "moment";
import {
  IMessageData,
  IMessageDetail,
  IMessageDetailById,
  IMessageStatus,
} from "@/interface/message/message";
import { DeleteMessage, GetAllMessage } from "@/services/messageService";
import { useNavigate } from "react-router-dom";
import MessageListById from "./MessageListById";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { ILoginUser } from "@/interface/user/userInterface";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "@/components/CommonComponents";

const MessageList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.Message ? pageState?.value : {};
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.Message
      ? pageStateData?.page ?? 1
      : currentPage;
  const activeClient = useSelector(activeClientSelector);
  const [limit, setLimit] = useState<number>(10);
  const [open, setOpen] = useState(false); // For Delete Modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [messageId, setMessageId] = useState<string>("");
  const [messageDataPage, setMessageDataPage] = useState<{
    data: IMessageData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const actionButton = (id: string, status: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.Message, PermissionEnum.View) && (
          <ViewButton
            onClickHandler={() => {
              setMessageId(id);
              setOpenModal(true);
            }}
          />
        )}
        {getPermissions(FeaturesNameEnum.Message, PermissionEnum.Update) &&
          status === IMessageStatus.DRAFT && (
            <>
              <EditButton
                onClickHandler={() => {
                  navigate(`/admin/message/edit/${id}`);
                }}
              />
            </>
          )}
        {getPermissions(FeaturesNameEnum.Message, PermissionEnum.Delete) && (
          <DeleteButton onClickHandler={() => handleOpenModal(id)} />
        )}
      </div>
    );
  };
  const stringData = (dataItem: IMessageDetailById[]) => {
    const formattedNamesArray = dataItem.reduce(
      (prev: string, current: IMessageDetailById) => {
        if (current?.employeeDetail?.loginUserData !== undefined) {
          prev +=
            current?.employeeDetail?.loginUserData?.lastName +
            " " +
            current?.employeeDetail?.loginUserData?.firstName +
            ", ";
        }

        if (
          current?.managerUser?.loginUserData !== undefined &&
          current?.employeeDetail?.loginUserData !==
            current?.managerUser?.loginUserData
        ) {
          prev +=
            current?.managerUser?.loginUserData?.lastName +
            " " +
            current?.managerUser?.loginUserData?.firstName +
            ", ";
        }

        if (
          current?.segmentDetail?.employee !== undefined &&
          current?.segmentDetail?.employee?.length > 0
        ) {
          current?.segmentDetail?.employee &&
            current?.segmentDetail?.employee?.map(
              (empData: { loginUserData?: ILoginUser }) => {
                if (
                  current?.employeeDetail?.loginUserData !==
                    empData?.loginUserData &&
                  current?.managerUser?.loginUserData !== empData?.loginUserData
                ) {
                  prev +=
                    empData?.loginUserData?.lastName +
                    " " +
                    empData?.loginUserData?.firstName +
                    ", ";
                }
              }
            );
        }
        return prev;
      },
      ""
    );
    return formattedNamesArray;
  };
  const columnData = [
    {
      header: "Created Date",
      name: "createdAt",
      cell: (props: { createdAt: Date | string }) => {
        return props.createdAt
          ? moment(props?.createdAt).format("DD/MM/YYYY")
          : "-";
      },
      option: {
        sort: false,
      },
    },

    {
      header: "To",
      name: "name",
      cell: (props: IMessageDetail) => {
        const user = stringData(props?.messageDetail);
        return user.replace(/,\s*$/, "");
      },
      option: {
        sort: false,
      },
    },
    {
      header: "Message",
      name: "message",
      cell: (props: IMessageDetail) => props.message,
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Status",
      name: "status",
      cell: (props: { id: string; status: IMessageStatus }) => props?.status,
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

  const fetchAllMessageData = async (query?: string) => {
    let queryString = `?limit=${limit}&page=${currentPage}&clientId=${activeClient}&sort=${
      sortType ? "desc" : "asc"
    }&sortBy=${sort}`;
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    queryString = query ? queryString + query : queryString + searchParam;
    setLoader(true);
    const response = await GetAllMessage(queryString);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      const trimmedData = result.data.map((res: { message: string }) => ({
        ...res,
        message: trimHTML(res.message),
      }));
      setMessageDataPage({
        data: trimmedData,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    setLoader(false);
  };

  function trimHTML(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const textContent = doc.body.textContent ?? "";
    return textContent.trim();
  }

  const handleOpenModal = (id: string) => {
    setMessageId(id);
    setOpen(true);
  };

  const messageDelete = async (id: string) => {
    setDeleteLoader(true);
    const response = await DeleteMessage(Number(id));
    if (response?.data?.response_type === "success") {
      await fetchAllMessageData();
    }
    setOpen(false);
    setDeleteLoader(false);
  };

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      activeClient &&
      (currentPage === 1 || currentPageNumber != currentPage)
    ) {
      fetchAllMessageData();
    }

    setPageState({
      state: DefaultState.Message as string,
      value: {
        ...pageStateData,
        page:
          messageDataPage.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, activeClient, sort, sortType]);

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        isSearch={true}
        paginationApiCb={fetchAllMessageData}
        headerData={columnData as ITableHeaderProps[]}
        bodyData={messageDataPage.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.Message,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.Message,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonLink="/admin/message/add"
        isClientDropdown={false}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.Message}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={messageDataPage.totalPage}
        dataCount={messageDataPage.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
      />
      {openModal && (
        <MessageListById id={messageId} setOpenModal={setOpenModal} />
      )}
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          loaderButton={deleteLoader}
          onClickHandler={() => messageDelete(messageId)}
          confirmationText="Are you sure you want to delete this message data?"
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
    </>
  );
};

export default MessageList;
