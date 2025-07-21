import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import {
  DeleteVehicleById,
  GetAllVehicleData,
} from "@/services/transportVehicleService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUpdateVehicle from "./AddUpdateVehicle";
import Modal from "@/components/modal/Modal";
import { useNavigate } from "react-router-dom";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { DeleteButton, EditButton } from "@/components/CommonComponents";

const VehicleList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.TransportVehicle ? pageState?.value : {};
  const clientId = useSelector(activeClientSelector);
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.TransportVehicle
      ? pageStateData?.page ?? 1
      : currentPage;
  const [vehicleId, setVehicleId] = useState<string>("");
  const [open, setOpen] = useState(false); // For Delete Modal
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add   Modal
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [vehiclesData, setVehiclesData] = useState<{
    data: { id: string }[];
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
  }, [clientId]);

  useEffect(() => {
    if (clientId && (currentPage === 1 || currentPageNumber != currentPage))
      fetchAllVehicleData();

    setPageState({
      state: DefaultState.TransportVehicle as string,
      value: {
        ...pageStateData,
        page: vehiclesData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, clientId, limit, sort, sortType]);

  async function fetchAllVehicleData(query?: string) {
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
      const response = await GetAllVehicleData(queryString);

      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setVehiclesData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
      }
    }
    setLoader(false);
    !query && dispatch(hideLoader());
  }

  const columnData = [
    {
      header: "Vehicle No",
      name: "vehicleNo",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Years",
      name: "year",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
    },
    {
      header: "Type",
      name: "type",
      className: "",
      commonClass: "",
      subString: true,
      cell: (props: { type: { name: string } }) => props?.type?.name,
    },
    {
      header: "Model",
      name: "model",
      className: "",
      commonClass: "",
      subString: true,
      cell: (props: { models: { name: string } }) => props?.models?.name,
    },
    {
      header: "Capacities",
      name: "capacity",
      className: "",
      commonClass: "",
      subString: true,
    },
    {
      header: "Booked Dates",
      name: "unavailableDates",
      className: "",
      commonClass: "",
      subString: true,
    },
    {
      header: "",
      cell: (props: { id: string }) => actionButton(props?.id),
    },
  ];

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(
          FeaturesNameEnum.TransportVehicle,
          PermissionEnum.Update
        ) && (
          <EditButton
            onClickHandler={() => {
              navigate(`/transport/vehicles/detail/${id}`);
            }}
          />
        )}
        {getPermissions(
          FeaturesNameEnum.TransportVehicle,
          PermissionEnum.Delete
        ) && <DeleteButton onClickHandler={() => handleOpenModal(id)} />}
      </div>
    );
  };

  const handleOpenModal = (id: string) => {
    setVehicleId(id);
    setOpen(true);
  };

  const vehicleDelete = async (id: string) => {
    setDeleteLoader(true);
    const response = await DeleteVehicleById(Number(id));
    if (response?.data?.response_type === "success") {
      const tempVehiclesData = { ...vehiclesData };
      const index = tempVehiclesData.data.findIndex(
        (e: { id: string }) => e.id === id
      );
      if (index !== -1) {
        tempVehiclesData.data.splice(index, 1);
        setVehiclesData(tempVehiclesData);

        if (tempVehiclesData.data?.length === 0 && currentPage !== 1) {
          dispatch(currentPageCount(currentPage - 1));
        }
      }
      setDeleteLoader(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <Table
      tableClass="!min-w-[1280px]"
        isSearch={true}
        paginationApiCb={fetchAllVehicleData}
        headerData={columnData as ITableHeaderProps[]}
        bodyData={vehiclesData.data}
        isButton={getPermissions(
          FeaturesNameEnum.TransportVehicle,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setOpenModal(true);
        }}
        isClientDropdown={false}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.TransportVehicle}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={vehiclesData.totalPage}
        dataCount={vehiclesData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        isShowTable={getPermissions(
          FeaturesNameEnum.TransportVehicle,
          PermissionEnum.View
        )}
      />

      {openModal && (
        <AddUpdateVehicle
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllVehicleData();
          }}
        />
      )}
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => vehicleDelete(vehicleId)}
          confirmationText="Are you sure you want to delete this vehicle?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
    </div>
  );
};

export default VehicleList;
