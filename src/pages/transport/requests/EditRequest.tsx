import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { FormatDate } from "@/helpers/Utils";
import { IRequestData } from "@/interface/transport/transportInterface";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { currentPageSelector } from "@/redux/slices/paginationSlice";
import {
  DeleteRequestVehicleById,
  GetAllRequestVehicleData,
  GetRequestDataById,
} from "@/services/transportRequestService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddUpdateRequestVehicle from "./AddUpdateRequestVehicle";
import moment from "moment";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { DeleteButton, EditButton } from "@/components/CommonComponents";

const DriverNoCell: React.FC<{ driver: { driverNo: string } }> = (props) => {
  return <>{props.driver.driverNo}</>;
};

const VehicleCell: React.FC<{ vehicle: { vehicleNo: string } }> = (props) => {
  return <>{props.vehicle.vehicleNo}</>;
};

const EditRequest = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { getPermissions } = usePermission();
  const clientId = useSelector(activeClientSelector);
  const currentPage = useSelector(currentPageSelector);
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSorting] = useState<string>("");
  const [sortType, setSortingType] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [open, setOpen] = useState(false); // For Delete Modal
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update requests Modal
  const [requestVehicleId, setRequestVehicleId] = useState<string>("");
  const [requestData, setRequestData] = useState<IRequestData>();
  const [requestVehicleData, setRequestVehicleData] = useState<{
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
    }&sortBy=${sort}&requestId=${id}` +
    (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);

  useEffect(() => {
    if (id) {
      getRequestData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (clientId) getRequestVehicleById(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, clientId, limit, sort, sortType, id]);

  const getRequestData = async (id: string) => {
    dispatch(showLoader());
    const response = await GetRequestDataById(id);
    if (
      response.data.responseData &&
      response.data.response_type === "success"
    ) {
      setRequestData(response.data.responseData);
    }
    dispatch(hideLoader());
  };

  const getRequestVehicleById = async (queryString: string) => {
    dispatch(showLoader());
    setLoader(true);
    if (clientId) {
      const response = await GetAllRequestVehicleData(queryString);
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setRequestVehicleData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
      }
    }
    setLoader(false);
    dispatch(hideLoader());
  };

  const handleOpenModal = (id: string) => {
    setRequestVehicleId(id);
    setOpen(true);
  };
  const requestVehicleDelete = async (id: string) => {
    setDeleteLoader(true);
    const reqVehicleDeleteQuery = `?transportStartDate=${moment(
      requestData?.startDate
    ).format("DD/MM/YYYY")}&transportEndDate=${moment(
      requestData?.destinationDate
    ).format("DD/MM/YYYY")}`;
    const response = await DeleteRequestVehicleById(
      Number(id),
      reqVehicleDeleteQuery
    );
    if (response?.data?.response_type === "success") {
      await getRequestVehicleById(queryString);
    }
    setDeleteLoader(false);
    setOpen(false);
  };

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5 justify-end">
        {getPermissions(
          FeaturesNameEnum.TransportRequestVehicle,
          PermissionEnum.Update
        ) &&
          requestData?.status !== "INPROGRESS" &&
          requestData?.status !== "COMPLETED" && (
            <EditButton
              onClickHandler={() => {
                setRequestVehicleId(id);
                setOpenModal(true);
              }}
            />
          )}
        {getPermissions(
          FeaturesNameEnum.TransportRequestVehicle,
          PermissionEnum.Delete
        ) &&
          requestData?.status !== "INPROGRESS" &&
          requestData?.status !== "COMPLETED" && (
            <DeleteButton onClickHandler={() => handleOpenModal(id)} />
          )}
      </div>
    );
  };

  const columnData = [
    {
      header: "Driver No",
      name: "driverNo",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: DriverNoCell,
    },
    {
      header: "Vehicle No",
      name: "vehicleNo",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: VehicleCell,
    },
    {
      header: "",
      cell: (props: { id: string }) => actionButton(props.id),
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center justify-between bg-primaryRed/10 cursor-pointer py-15px px-3 rounded-lg last:rounded-r-lg text-dark text-base/5 text-left">
          <h4 className="text-25px leading-28px font-bold text-dark text-base/5 text-left">
            <span className="inline-block">Request Details</span>
          </h4>
        </div>
        <div className="grid grid-cols-5 gap-4 bg-primaryRed/[0.03] py-4 px-3 text-black rounded-lg mt-3">
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Source City:</span>
              <span className="text-sm/18px font-medium">
                {requestData?.source ?? "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Start Date:</span>
              <span className="text-sm/18px font-medium">
                {requestData?.startDate
                  ? FormatDate(requestData?.startDate)
                  : "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">Destination:</span>
              <span className="text-sm/18px font-medium">
                {requestData?.destination ?? "-"}
              </span>
            </p>
          </div>
          <div className="">
            <p className="leading-18px">
              <span className="text-sm/18px font-bold mr-3">End Date:</span>
              <span className="text-sm/18px font-medium">
                {requestData?.destinationDate
                  ? FormatDate(requestData?.destinationDate)
                  : "-"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Table
      tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={requestVehicleData.data}
        isButton={
          getPermissions(
            FeaturesNameEnum.TransportRequestVehicle,
            PermissionEnum.Create
          ) &&
          requestData?.status !== "INPROGRESS" &&
          requestData?.status !== "COMPLETED"
        }
        buttonText="Add"
        buttonClick={() => {
          setRequestVehicleId("");
          setOpenModal(true);
        }}
        isClientDropdown={false}
        loader={loader}
        pagination={true}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={requestVehicleData.totalPage}
        dataCount={requestVehicleData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        isShowTable={getPermissions(
          FeaturesNameEnum.TransportRequestVehicle,
          PermissionEnum.View
        )}
      />

      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => requestVehicleDelete(requestVehicleId)}
          confirmationText="Are you sure you want to delete this requested vehicle?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateRequestVehicle
          requestData={requestData}
          id={requestVehicleId}
          requestId={id}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            getRequestVehicleById(queryString);
          }}
        />
      )}
    </div>
  );
};

export default EditRequest;
