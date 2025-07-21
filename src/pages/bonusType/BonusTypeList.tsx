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
  DeleteBonusType,
  GetAllBonusType,
  UpdateBonusTypeStatus,
} from "@/services/bonusTypeService";
import AddUpdateBonusType from "./AddUpdateBonusType";
import { IBonusTypeData } from "@/interface/bonusType/bonusTypeInterface";
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

const BonusTypeList = () => {
  const [limit, setLimit] = useState<number>(10);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Bonus Type Modal
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.BonusType ? pageState?.value : {};
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.BonusType
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
  const [bonusTypeData, setBonusTypeData] = useState<{
    data: IBonusTypeData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [bonusTypeId, setBonusTypeId] = useState<string>("");

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
        (await fetchAllBonusType(queryString));
    })();

    setPageState({
      state: DefaultState.BonusType as string,
      value: {
        ...pageStateData,
        page:
          bonusTypeData.totalCount == limit
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

  async function fetchAllBonusType(query: string) {
    setLoader(true);
    dispatch(showLoader());
    if (getPermissions(FeaturesNameEnum.BonusType, PermissionEnum.View)) {
      const response = await GetAllBonusType(query);
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setBonusTypeData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
      }
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const bonusTypeDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const response = await DeleteBonusType(Number(id));
      if (response?.data?.response_type === "success") {
        await fetchAllBonusType(queryString);
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
    setDeleteLoader(false);
  };

  const handleStatusUpdate = async (id: string, isActive: boolean) => {
    const params = {
      isActive: isActive ? "false" : "true",
    };
    const response = await UpdateBonusTypeStatus(id, params);
    if (response.data.response_type === "success") {
      await fetchAllBonusType(queryString);
    }
  };

  const handleOpenModal = (id: string) => {
    setBonusTypeId(id);
    setOpen(true);
  };

  const actionButton = (id: string, status: boolean) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.BonusType, PermissionEnum.Update) && (
          <>
            <EditButton
              onClickHandler={() => {
                setBonusTypeId(id);
                setOpenModal(true);
              }}
            />
            <ArchiveButton
              onClickHandler={() => handleStatusUpdate(id, status)}
              status={status}
            />
          </>
        )}
        {getPermissions(FeaturesNameEnum.BonusType, PermissionEnum.Delete) && (
          <DeleteButton onClickHandler={() => handleOpenModal(id)} />
        )}
      </div>
    );
  };

  const columnData = [
    {
      header: "Code",
      name: "code",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
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
      header: "Name (Shown on Timesheet)",
      name: "timesheetName",
      option: {
        sort: true,
      },
    },
    {
      header: "Base Price",
      name: "basePrice",
      cell: (props: { basePrice: number }) =>
        props?.basePrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      className: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Daily Cost",
      name: "dailyCost",
      cell: (props: { dailyCost: number }) =>
      props?.dailyCost.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      className: "",
      option: {
        sort: true,
      },
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
        bodyData={bonusTypeData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.BonusType,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.BonusType,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setBonusTypeId("");
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.BonusType}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={bonusTypeData.totalPage}
        dataCount={bonusTypeData.totalCount}
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
          onClickHandler={() => bonusTypeDelete(bonusTypeId)}
          confirmationText="Are you sure you want to delete this bonus type?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateBonusType
          id={bonusTypeId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllBonusType(queryString);
          }}
        />
      )}
    </>
  );
};

export default BonusTypeList;
