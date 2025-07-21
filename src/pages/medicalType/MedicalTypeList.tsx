import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUpdateMedicalType from "./AddUpdateMedicalType";
import { IMedicalTypeData } from "@/interface/medicalType/MedicalTypeInterface";
import {
  DeleteMedicalType,
  GetAllMedicalType,
} from "@/services/medicalTypeService";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import { DefaultState, FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { DeleteButton, EditButton } from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";

const MedicalTypeList = () => {
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.MedicalType ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Medical Type Modal
  const dispatch = useDispatch();
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.MedicalType
      ? pageStateData?.page ?? 1
      : currentPage;
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [medicalTypeData, setMedicalTypeData] = useState<{
    data: IMedicalTypeData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [medicalTypeId, setMedicalTypeId] = useState<string>("");
  const queryString = `?limit=${limit}&page=${currentPage}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}`;

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (currentPage === 1 || currentPageNumber != currentPage) &&
      fetchAllMedicalType(queryString);
    
    setPageState({
      state: DefaultState.MedicalType as string,
      value: {
        ...pageStateData,
        page: medicalTypeData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, sort, sortType]);

  async function fetchAllMedicalType(query: string) {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllMedicalType(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setMedicalTypeData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const handleOpenModal = (id: string) => {
    setMedicalTypeId(id);
    setOpen(true);
  };

  const medicalTypeDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const response = await DeleteMedicalType(Number(id));
      if (response?.data?.response_type === "success") {
        await fetchAllMedicalType(queryString);
      }
      setOpen(false);
    } catch (error) {
      console.log("error.", error);
    }
    setDeleteLoader(false);
  };

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(
          FeaturesNameEnum.MedicalType,
          PermissionEnum.Update
        ) && (
          <EditButton
            onClickHandler={() => {
              setMedicalTypeId(id);
              setOpenModal(true);
            }}
          />
        )}
        {getPermissions(
          FeaturesNameEnum.MedicalType,
          PermissionEnum.Delete
        ) && <DeleteButton onClickHandler={() => handleOpenModal(id)} />}
      </div>
    );
  };

  const columnData = [
    {
      header: "Index",
      name: "index",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Name",
      name: "name",
      option: {
        sort: true,
      },
    },
    {
      header: "Format",
      name: "format",
      subString: true,
      option: {
        sort: true,
      },
    },
    {
      header: "Days before expiry",
      name: "daysBeforeExpiry",
      option: {
        sort: true,
      },
    },
    {
      header: "Days expiry",
      name: "daysExpiry",
      option: {
        sort: true,
      },
    },
    {
      header: "Amount",
      name: "amount",
      cell: (props: { amount: number | null }) =>
        props?.amount != null
          ? props?.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
            ".00"
          : "0.00",
      option: {
        sort: true,
      },
    },
    {
      header: "Action",
      cell: (props: { id: string; status: string }) => actionButton(props.id),
    },
  ];

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={medicalTypeData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.MedicalType,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.MedicalType,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setMedicalTypeId("");
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.MedicalType}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={medicalTypeData.totalPage}
        dataCount={medicalTypeData.totalCount}
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
          onClickHandler={() => medicalTypeDelete(medicalTypeId)}
          confirmationText="Are you sure you want to delete this medical type?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateMedicalType
          id={medicalTypeId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllMedicalType(queryString);
          }}
        />
      )}
    </>
  );
};

export default MedicalTypeList;
