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
  currentSummaryModelPageSelector,
  transportModelCurrentPageCount,
} from "@/redux/slices/summaryPaginationSlice";
import {
  DeleteModelById,
  GetAllSummaryData,
} from "@/services/transportSummaryService";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ModelList = ({
  setOpenModal,
  setEditSummaryData,
  addedOrUpdatedDataType,
  setAddedOrUpdatedDataType,
}: {
  addedOrUpdatedDataType: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditSummaryData: React.Dispatch<React.SetStateAction<ISummaryData>>;
  setAddedOrUpdatedDataType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const dispatch = useDispatch();
  const { getPermissions } = usePermission();
  const selectedClientId = useSelector(activeClientSelector);
  const [modelId, setModelId] = useState<string>("");
  const [open, setOpen] = useState(false); // For Delete Modal
  const [limit, setLimit] = useState<number>(6);
  const [sort, setSorting] = useState<string>("");
  const [sortType, setSortingType] = useState<boolean>(true);
  const currentPage = useSelector(currentSummaryModelPageSelector);
  const [loader, setLoader] = useState<boolean>(false);
     const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [modelData, setModelData] = useState<{
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
    }&sortBy=${sort}&type=TransportModels` +
    (selectedClientId != 0 && selectedClientId != -1
      ? `&clientId=${selectedClientId}`
      : ``);

  useEffect(() => {
    dispatch(transportModelCurrentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      transportSummaryEnum.Model === addedOrUpdatedDataType &&
      selectedClientId
    ) {
      fetchAllModelData(queryString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedOrUpdatedDataType]);

  useEffect(() => {
    if (selectedClientId && selectedClientId != 0 && selectedClientId != -1)
      dispatch(showLoader());
    fetchAllModelData(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedClientId, limit, sort, sortType]);

  async function fetchAllModelData(query: string) {
    setLoader(true);
    if (selectedClientId && selectedClientId != 0 && selectedClientId != -1) {
      const response = await GetAllSummaryData(query);
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setModelData({
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
                type: transportSummaryEnum.Model,
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
    setModelId(id);
    setOpen(true);
  };

  const modelDelete = async (id: string) => {
     setDeleteLoader(true);
     const response = await DeleteModelById(Number(id));
     if (response?.data?.response_type === "success") {
      const tempModelData = { ...modelData };
      const index = tempModelData.data.findIndex(
        (e: { id: string }) => e.id === id
      );
      if (index !== -1) {
        tempModelData.data.splice(index, 1);
        setModelData(tempModelData);

        if (tempModelData.data?.length === 0 && currentPage !== 1) {
          dispatch(transportModelCurrentPageCount(currentPage - 1));
        }
        if (
          tempModelData.data.length === 0 &&
          currentPage === tempModelData.totalPage
        ) {
          fetchAllModelData(queryString);
        }
      }
      setDeleteLoader(false);
      setOpen(false);
    }
  };
  return (
    <div>
      <Card cardColor="bg-white">
        <>
          <h4 className="text-25px leading-28px font-bold">
            <span className="inline-block">Transport Models</span>
          </h4>
          <Table
            headerData={columnData as ITableHeaderProps[]}
            bodyData={modelData.data}
            isButton={false}
            isDropdown={false}
            loader={loader}
            pagination={true}
            dataPerPage={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            totalPage={modelData.totalPage}
            dataCount={modelData.totalCount}
            tableLastTheadClass="group-last/sort:justify-end"
            summaryTableType={transportSummaryEnum.Model}
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
              onClickHandler={() => modelDelete(modelId)}
              confirmationText="Are you sure you want to delete this model?"
              title="Delete"
              loaderButton={deleteLoader}
            >
              <div className=""></div>
            </Modal>
          )}
        </>
      </Card>
    </div>
  );
};

export default ModelList;
