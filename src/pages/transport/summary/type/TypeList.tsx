import Card from "@/components/card/Card";
import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { usePermission } from "@/context/PermissionProvider";
import { transportSummaryEnum } from "@/enum/transport";
import { ISummaryData } from "@/interface/transport/transportInterface";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  currentSummaryTypePageSelector,
  transportTypeCurrentPageCount,
} from "@/redux/slices/summaryPaginationSlice";
import {
  DeleteTypeById,
  GetAllSummaryData,
} from "@/services/transportSummaryService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { DeleteButton, EditButton } from "@/components/CommonComponents";

const TypeList = ({
  setOpenModal,
  setEditSummaryData,
  addedOrUpdatedDataType,
  setAddedOrUpdatedDataType,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  addedOrUpdatedDataType: string;
  setAddedOrUpdatedDataType: React.Dispatch<React.SetStateAction<string>>;
  setEditSummaryData: React.Dispatch<React.SetStateAction<ISummaryData>>;
}) => {
  const dispatch = useDispatch();
  const { getPermissions } = usePermission();
  const selectedClientId = useSelector(activeClientSelector);
  const [typeId, setTypeId] = useState<string>("");
  const [open, setOpen] = useState(false); // For Delete Modal
  const [limit, setLimit] = useState<number>(6);
  const [sort, setSorting] = useState<string>("");
  const [sortType, setSortingType] = useState<boolean>(true);
  const currentPage = useSelector(currentSummaryTypePageSelector);
  const [loader, setLoader] = useState<boolean>(false);
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [typeData, setTypeData] = useState<{
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
    }&sortBy=${sort}&type=TransportType` +
    (selectedClientId != 0 && selectedClientId != -1
      ? `&clientId=${selectedClientId}`
      : ``);

  useEffect(() => {
    dispatch(transportTypeCurrentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      transportSummaryEnum.Type === addedOrUpdatedDataType &&
      selectedClientId
    ) {
      fetchAllTypeData(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedOrUpdatedDataType]);

  useEffect(() => {
    if (selectedClientId && selectedClientId != 0 && selectedClientId != -1) {
      dispatch(showLoader());
      fetchAllTypeData(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedClientId, limit, sort, sortType]);

  async function fetchAllTypeData(query: string) {
    setLoader(true);
    if (selectedClientId) {
      const response = await GetAllSummaryData(query);
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setTypeData({
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
                type: transportSummaryEnum.Type,
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

  const handleOpenModal = (id: string) => {
    setTypeId(id);
    setOpen(true);
  };

  const typeDelete = async (id: string) => {
    setDeleteLoader(true)
    const response = await DeleteTypeById(Number(id));
    if (response?.data?.response_type === "success") {
      const tempTypeData = { ...typeData };
      const index = tempTypeData.data.findIndex(
        (e: { id: string }) => e.id === id
      );
      if (index !== -1) {
        tempTypeData.data.splice(index, 1);
        setTypeData(tempTypeData);

        if (tempTypeData.data?.length === 0 && currentPage !== 1) {
          dispatch(transportTypeCurrentPageCount(currentPage - 1));
        }
        if (
          tempTypeData.data.length === 0 &&
          currentPage === tempTypeData.totalPage
        ) {
          fetchAllTypeData(queryString);
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
          <span className="inline-block">Transport Type</span>
        </h4>
        <Table
          headerData={columnData as ITableHeaderProps[]}
          bodyData={typeData.data}
          isButton={false}
          isDropdown={false}
          loader={loader}
          pagination={true}
          dataPerPage={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          totalPage={typeData.totalPage}
          dataCount={typeData.totalCount}
          tableLastTheadClass="group-last/sort:justify-end"
          summaryTableType={transportSummaryEnum.Type}
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
            onClickHandler={() => typeDelete(typeId)}
            confirmationText="Are you sure you want to delete this type?"
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
export default TypeList;
