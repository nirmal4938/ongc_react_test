import Card from "@/components/card/Card";
import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { transportSummaryEnum } from "@/enum/transport";
import { ISummaryData } from "@/interface/transport/transportInterface";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  currentSummaryCapacityPageSelector,
  transportCapacityCurrentPageCount,
} from "@/redux/slices/summaryPaginationSlice";
import {
  DeleteCapacityById,
  GetAllCapacityData,
} from "@/services/transportSummaryService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { DeleteButton, EditButton } from "@/components/CommonComponents";

const CapacityList = ({
  setOpenModal,
  setEditSummaryData,
  addedOrUpdatedDataType,
  setAddedOrUpdatedDataType,
}: {
  addedOrUpdatedDataType: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddedOrUpdatedDataType: React.Dispatch<React.SetStateAction<string>>;
  setEditSummaryData: React.Dispatch<React.SetStateAction<ISummaryData>>;
}) => {
  const dispatch = useDispatch();
  const { getPermissions } = usePermission();
  const selectedClientId = useSelector(activeClientSelector);
  const [capacityId, setCapacityId] = useState<string>("");
  const [open, setOpen] = useState(false); // For Delete Modal
  const [limit, setLimit] = useState<number>(6);
  const [sort, setSorting] = useState<string>("");
  const [sortType, setSortingType] = useState<boolean>(true);
  const currentPage = useSelector(currentSummaryCapacityPageSelector);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [capacityData, setCapacityData] = useState<{
    data: { id: string; value: string }[];
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
    }&sortBy=${sort}` +
    (selectedClientId != 0 && selectedClientId != -1
      ? `&clientId=${selectedClientId}`
      : ``);

  useEffect(() => {
    dispatch(transportCapacityCurrentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      transportSummaryEnum.Capacity === addedOrUpdatedDataType &&
      selectedClientId
    ) {
      fetchAllCapacityData(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedOrUpdatedDataType]);

  useEffect(() => {
    if (selectedClientId && selectedClientId != 0 && selectedClientId != -1) {
      dispatch(showLoader());
      fetchAllCapacityData(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedClientId, limit, sort, sortType]);

  async function fetchAllCapacityData(query: string) {
    setLoader(true);
    if (selectedClientId) {
      const response = await GetAllCapacityData(query);
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setCapacityData({
          data: result.data,
          totalCount: result.count,
          totalPage: result.lastPage,
        });
        setAddedOrUpdatedDataType("");
      }
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const actionButton = (props: {
    id: string;
    clientId?: number;
    type?: transportSummaryEnum;
    value?: string;
  }) => {
    return (
      <div className="flex items-center gap-1.5 justify-end">
        {getPermissions(
          FeaturesNameEnum.TransportSummary,
          PermissionEnum.Update
        ) && (
          <EditButton
            onClickHandler={() => {
              dispatch(showLoader());
              setOpenModal(true);
              setEditSummaryData({
                ...props,
                type: transportSummaryEnum.Capacity,
              });
              dispatch(hideLoader());
            }}
          />
        )}
        {getPermissions(
          FeaturesNameEnum.TransportSummary,
          PermissionEnum.Delete
        ) && <DeleteButton onClickHandler={() => handleOpenModal(props.id)} />}
      </div>
    );
  };

  const columnData = [
    {
      header: "Value",
      name: "value",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "",
      cell: (props: { id: string }) => actionButton(props),
    },
  ];

  const handleOpenModal = (id: string) => {
    setCapacityId(id);
    setOpen(true);
  };

  const capacityDelete = async (id: string) => {
    setDeleteLoader(true);
    const response = await DeleteCapacityById(Number(id));
    if (response?.data?.response_type === "success") {
      const tempCapacityData = { ...capacityData };
      const index = tempCapacityData.data.findIndex(
        (e: { id: string }) => e.id === id
      );
      if (index !== -1) {
        tempCapacityData.data.splice(index, 1);
        setCapacityData(tempCapacityData);

        if (tempCapacityData.data?.length === 0 && currentPage !== 1) {
          dispatch(transportCapacityCurrentPageCount(currentPage - 1));
        }
        if (
          tempCapacityData.data.length === 0 &&
          currentPage === tempCapacityData.totalPage
        ) {
          fetchAllCapacityData(queryString);
        }
      }
      setDeleteLoader(false);
      setOpen(false);
    }
  };

  return (
    <Card cardColor="bg-white">
      <div>
        <h4 className="text-25px leading-28px font-bold">
          <span className="inline-block">Transport Capacities</span>
        </h4>
        <Table
          headerData={columnData as ITableHeaderProps[]}
          bodyData={capacityData.data}
          isButton={false}
          isDropdown={false}
          loader={loader}
          pagination={true}
          dataPerPage={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          totalPage={capacityData.totalPage}
          dataCount={capacityData.totalCount}
          tableLastTheadClass="group-last/sort:justify-end"
          summaryTableType={transportSummaryEnum.Capacity}
          setSorting={setSorting}
          sortType={sortType}
          setSortingType={setSortingType}
          tableClass="min-w-full"
        />
        {open && (
          <Modal
            variant={"Confirmation"}
            closeModal={() => setOpen(!open)}
            width="max-w-[475px]"
            icon={<DeleteIcon className="w-full h-full mx-auto" />}
            okbtnText="Yes"
            cancelbtnText="No"
            onClickHandler={() => capacityDelete(capacityId)}
            confirmationText="Are you sure you want to delete this capacity?"
            title="Delete"
            loaderButton={deleteLoader}
          >
            <div className=""></div>
          </Modal>
        )}
      </div>
    </Card>
  );
};

export default CapacityList;
