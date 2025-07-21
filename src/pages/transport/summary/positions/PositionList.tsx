import { DeleteButton, EditButton } from "@/components/CommonComponents";
import Card from "@/components/card/Card";
import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { usePermission } from "@/context/PermissionProvider";
import { transportSummaryEnum } from "@/enum/transport";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { ISummaryData } from "@/interface/transport/transportInterface";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  currentSummaryPositionPageSelector,
  transportPositionCurrentPageCount,
} from "@/redux/slices/summaryPaginationSlice";
import {
  DeletePositionById,
  GetAllSummaryData,
} from "@/services/transportSummaryService";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PositionList = ({
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
  const [positionId, setPositionId] = useState<string>("");
  const [open, setOpen] = useState(false); // For Delete Modal
  const [limit, setLimit] = useState<number>(6);
  const [sort, setSorting] = useState<string>("");
  const [sortType, setSortingType] = useState<boolean>(true);
  const currentPage = useSelector(currentSummaryPositionPageSelector);
  const [loader, setLoader] = useState<boolean>(false);
   const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [positionData, setPositionData] = useState<{
    data: { id: string; name: string }[];
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
    }&sortBy=${sort}&type=TransportPositions` +
    (selectedClientId != 0 && selectedClientId != -1
      ? `&clientId=${selectedClientId}`
      : ``);

  useEffect(() => {
    dispatch(transportPositionCurrentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      transportSummaryEnum.Position === addedOrUpdatedDataType &&
      selectedClientId
    ) {
      fetchAllPositionData(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedOrUpdatedDataType]);

  useEffect(() => {
    if (selectedClientId && selectedClientId != 0 && selectedClientId != -1) {
      dispatch(showLoader());
      fetchAllPositionData(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedClientId, limit, sort, sortType]);

  async function fetchAllPositionData(query: string) {
    setLoader(true);
    if (selectedClientId) {
      const response = await GetAllSummaryData(query);
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setPositionData({
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
    name?: string;
    clientId?: number;
    type?: transportSummaryEnum;
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
                type: transportSummaryEnum.Position,
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
      header: "Name",
      name: "name",
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
    setPositionId(id);
    setOpen(true);
  };

  const positionDelete = async (id: string) => {
    setDeleteLoader(true)
    const response = await DeletePositionById(Number(id));
    if (response?.data?.response_type === "success") {
      const tempPositionData = { ...positionData };
      const index = tempPositionData.data.findIndex(
        (e: { id: string }) => e.id === id
      );
      if (index !== -1) {
        tempPositionData.data.splice(index, 1);
        setPositionData(tempPositionData);

        if (tempPositionData.data?.length === 0 && currentPage !== 1) {
          dispatch(transportPositionCurrentPageCount(currentPage - 1));
        }
        if (
          tempPositionData.data.length === 0 &&
          currentPage === tempPositionData.totalPage
        ) {
          fetchAllPositionData(queryString);
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
          <span className="inline-block">Transport Positions</span>
        </h4>
        <Table
          headerData={columnData as ITableHeaderProps[]}
          bodyData={positionData.data}
          isButton={false}
          isDropdown={false}
          loader={loader}
          pagination={true}
          dataPerPage={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          totalPage={positionData.totalPage}
          dataCount={positionData.totalCount}
          tableLastTheadClass="group-last/sort:justify-end"
          summaryTableType={transportSummaryEnum.Position}
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
            onClickHandler={() => positionDelete(positionId)}
            confirmationText="Are you sure you want to delete this position?"
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

export default PositionList;
