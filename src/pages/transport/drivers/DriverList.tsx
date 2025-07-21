import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import {
  DeleteDriverById,
  GetAllDriverData,
} from "@/services/transportDriverService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/components/modal/Modal";
import { useNavigate } from "react-router-dom";
import AddUpdateDriver from "./AddUpdateDriver";
import { dateToExperience } from "@/helpers/Utils";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { DeleteButton, EditButton } from "@/components/CommonComponents";

const PositionCell: React.FC<{ position: { name: string } }> = ({
  position,
}) => {
  return <>{position?.name ?? "-"}</>;
};

const CompanyStartCell: React.FC<{ companyStart: string }> = ({
  companyStart,
}) => {
  const companyDate = new Date(companyStart);
  return <>{companyDate.getFullYear()}</>;
};

const YearExperienceCell: React.FC<{ experienceStart: string }> = ({
  experienceStart,
}) => {
  return <>{dateToExperience(experienceStart)}</>;
};

const DriverList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.TransportDriver ? pageState?.value : {};
  const clientId = useSelector(activeClientSelector);
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.TransportDriver
      ? pageStateData?.page ?? 1
      : currentPage;
  const [driverId, setDriverId] = useState<string>("");
  const [open, setOpen] = useState(false); // For Delete Modal
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add   Modal
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [driverData, setDriverData] = useState<{
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
  }, []);

  useEffect(() => {
    if (clientId && (currentPage === 1 || currentPageNumber != currentPage))
      fetchAllDriverData();

    setPageState({
      state: DefaultState.TransportDriver as string,
      value: {
        ...pageStateData,
        page: driverData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, clientId, limit, sort, sortType]);

  async function fetchAllDriverData(query?: string) {
    let queryString =
      `?page=${currentPage}&limit=${limit}&sort=${
        sortType ? "asc" : "desc"
      }&sortBy=${sort}` +
      (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``);
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    queryString = query ? queryString + query : queryString + searchParam;
    setLoader(true);
    !query && dispatch(showLoader());
    if (clientId) {
      const response = await GetAllDriverData(queryString);

      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setDriverData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
      }
    }
    !query && dispatch(hideLoader());
    setLoader(false);
  }

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(
          FeaturesNameEnum.TransportDriver,
          PermissionEnum.Update
        ) && (
          <EditButton
            onClickHandler={() => {
              navigate(`/transport/drivers/detail/${id}`);
            }}
          />
        )}
        {getPermissions(
          FeaturesNameEnum.TransportDriver,
          PermissionEnum.Delete
        ) && <DeleteButton onClickHandler={() => handleOpenModal(id)} />}
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
        sort: true,
      },
    },
    {
      header: "First Name",
      name: "firstName",
      className: "",
      commonClass: "",
      subString: true,
    },
    {
      header: "Last Name",
      name: "lastName",
      className: "",
      commonClass: "",
      subString: true,
    },
    {
      header: "Position",
      name: "position",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: false,
      },
      cell: PositionCell,
    },
    {
      header: "Years with company",
      name: "companyStart",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
      cell: CompanyStartCell,
    },
    {
      header: "Years Experience",
      name: "year",
      className: "",
      commonClass: "",
      subString: true,
      cell: YearExperienceCell,
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
      cell: (props: { id: string }) => actionButton(props.id),
    },
  ];

  const handleOpenModal = (id: string) => {
    setDriverId(id);
    setOpen(true);
  };

  const driverDelete = async (id: string) => {
    setDeleteLoader(true);
    const response = await DeleteDriverById(Number(id));
    if (response?.data?.response_type === "success") {
      const tempDriverData = { ...driverData };
      const index = tempDriverData.data.findIndex(
        (e: { id: string }) => e.id === id
      );
      if (index !== -1) {
        tempDriverData.data.splice(index, 1);
        setDriverData(tempDriverData);

        if (tempDriverData.data?.length === 0 && currentPage !== 1) {
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
        paginationApiCb={fetchAllDriverData}
        headerData={columnData as ITableHeaderProps[]}
        bodyData={driverData.data}
        isButton={getPermissions(
          FeaturesNameEnum.TransportDriver,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setOpenModal(true);
        }}
        isClientDropdown={false}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.TransportDriver}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={driverData.totalPage}
        dataCount={driverData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        isShowTable={
          getPermissions(
            FeaturesNameEnum.TransportDriver,
            PermissionEnum.View
          ) ||
          getPermissions(
            FeaturesNameEnum.TransportDriverDocument,
            PermissionEnum.View
          )
        }
      />

      {openModal && (
        <AddUpdateDriver
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllDriverData();
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
          onClickHandler={() => driverDelete(driverId)}
          confirmationText="Are you sure you want to delete this driver?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
    </div>
  );
};

export default DriverList;
