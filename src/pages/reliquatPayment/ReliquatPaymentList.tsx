import Table from "@/components/table/Table";
import moment from "moment";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUpdateReliquatPayment from "./AddUpdateReliquatPayment";
import { IReliquatPaymentData } from "@/interface/reliquatPayment/reliquatPaymentInterface";
import { activeEmployeeSelector } from "@/redux/slices/employeeSlice";
import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  DeleteReliquatPayment,
  GetAllReliquatPayment,
} from "@/services/reliquatPaymentService";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import {
  FeaturesNameEnum,
  PermissionEnum,
  DefaultState,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { DeleteButton, EditButton } from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { socketSelector } from "@/redux/slices/socketSlice";
import generateDataModal from "@/components/generateModal/generateModal";
import { GetTimesheetReliquatAdjustmentDate } from "@/services/timesheetService";

const ReliquatPaymentList = () => {
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.ReliquatPayment ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const activeClient = useSelector(activeClientSelector);
  const socket = useSelector(socketSelector);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Medical Modal
  let currentPage = useSelector(currentPageSelector);
  const [dateList, setDateList] = useState<string[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.ReliquatPayment
      ? pageStateData?.page ?? 1
      : currentPage;
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [open, setOpen] = useState(false); // For Cancel Modal
  const activeEmployee = useSelector(activeEmployeeSelector);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [generateModalData, setGenerateModalData] = useState<{
    percentage: number;
    type: string;
    message: string;
  } | null>(null);
  const [generatemodal, setGenerateModal] = useState<boolean>(false);
  const [reliquatPaymentId, setReliquatPaymentId] = useState<string>("");
  const [reliquatPaymentData, setReliquatPaymentData] = useState<{
    data: IReliquatPaymentData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const queryString = `?limit=${limit}&page=${currentPage}&clientId=${
    activeClient || ""
  }&employeeId=${activeEmployee ?? ""}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}`;

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !openModal &&
      activeClient &&
      (currentPage === 1 || currentPageNumber != currentPage) &&
      fetchAllReliquatPayment(queryString);
      fetchTimesheetDate(Number(activeClient));
    setPageState({
      state: DefaultState.ReliquatPayment as string,
      value: {
        ...pageStateData,
        page:
          reliquatPaymentData.totalCount == limit
            ? 1
            : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, activeClient, activeEmployee, sort, sortType]);


  async function fetchTimesheetDate(id: number) {
    if(activeEmployee!==0){
      const response = await GetTimesheetReliquatAdjustmentDate(
        id,
        `?type=payment&employeeId=${activeEmployee}`
      );
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setDateList(
          result?.map((value: string) =>  moment(value).format("DD-MM-YYYY"))
        );
      }
    }
  }

  async function fetchAllReliquatPayment(query: string) {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllReliquatPayment(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setReliquatPaymentData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  socket?.on("generate-modal-data", (data) => {
    setGenerateModalData(data);
  });

  const reliquatPaymentDelete = async (id: string) => {
    setDeleteLoader(true);
    setGenerateModal(true);
    // dispatch(showLoader());
    const response = await DeleteReliquatPayment(Number(id));
    if (response?.data?.response_type === "success") {
      await fetchAllReliquatPayment(queryString);
    }
    setGenerateModal(false);
    setGenerateModalData(null);
    setDeleteLoader(false);
    setOpen(false);
    // dispatch(hideLoader());
  };

  const actionButton = (id: string, startDate: Date | string | null) => {
    const startDateValue=moment(startDate).format('DD-MM-YYYY')
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(
          FeaturesNameEnum.ReliquatPayment,
          PermissionEnum.Update
        ) && dateList?.includes(startDateValue)
         && (
          <EditButton
            onClickHandler={() => {
              setReliquatPaymentId(id);
              setOpenModal(true);
            }}
          />
        )}
        {getPermissions(
          FeaturesNameEnum.ReliquatPayment,
          PermissionEnum.Delete
        ) && dateList?.includes(startDateValue) && <DeleteButton onClickHandler={() => handleOpenModal(id)} />}
      </div>
    );
  };

  const columnData = [
    {
      header: "Timesheet Start Date",
      name: "startDate",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { startDate: string }) =>
        moment(props?.startDate).format("DD/MM/YYYY"),
    },
    {
      header: "Amount",
      name: "amount",
      option: {
        sort: true,
      },
    },
    {
      header: "Created By",
      name: "createdBy",
      cell: (props: {
        createdByUser: {
          loginUserData: {
            firstName: string;
            lastName: string;
            name: string;
          };
        };
        updatedByUser: {
          loginUserData: {
            firstName: string;
            lastName: string;
            name: string;
          };
        };
      }) =>
        props?.updatedByUser?.loginUserData
          ? props?.updatedByUser?.loginUserData?.name ??
            props?.updatedByUser?.loginUserData?.firstName +
              " " +
              props?.updatedByUser?.loginUserData?.lastName
          : props?.createdByUser?.loginUserData
          ? props?.createdByUser?.loginUserData?.name ??
            props?.createdByUser?.loginUserData?.firstName +
              " " +
              props?.createdByUser?.loginUserData?.lastName
          : "-",
    },
    {
      header: "Created Date",
      name: "createdAt",
      cell: (props: { updatedAt: string }) =>
        moment(props?.updatedAt)?.format("DD/MM/YYYY"),
    },
    {
      header: "Action",
      cell: (props: {
        id: string;
        status: string;
        startDate: Date | string | null;
      }) => actionButton(props.id, props.startDate),
    },
  ];

  const handleOpenModal = (id: string) => {
    setReliquatPaymentId(id);
    setOpen(true);
  };

  return (
    <>
      <Table
        headerData={columnData as ITableHeaderProps[]}
        bodyData={reliquatPaymentData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.ReliquatPayment,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.ReliquatPayment,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setReliquatPaymentId("");
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.ReliquatPayment}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={reliquatPaymentData.totalPage}
        dataCount={reliquatPaymentData.totalCount}
        isClientDropdown={false}
        isEmployeeDropdown={true}
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
          onClickHandler={() => {
            reliquatPaymentDelete(reliquatPaymentId);
            setOpen(false);
          }}
          confirmationText="Are you sure you want to delete this reliquat payment?"
          title="Delete Reliquat Payment"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateReliquatPayment
          id={reliquatPaymentId}
          employeeId={activeEmployee ? Number(activeEmployee) : 0}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllReliquatPayment(queryString);
          }}
        />
      )}
      {generatemodal &&
        generateModalData &&
        generateDataModal(generateModalData)}
    </>
  );
};

export default ReliquatPaymentList;
