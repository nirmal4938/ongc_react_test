import Table from "@/components/table/Table";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmployeeLogListById from "./EmployeeLogListById";
import moment from "moment";
import { GetAllImportLogs } from "@/services/importLogService";
import { IImportLogData } from "@/interface/importLog/importLog";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { ViewButton } from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";

const EmployeeImportLogList = () => {
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.EmployeeImportLog ? pageState?.value : {};
  const clientId = useSelector(activeClientSelector);
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.EmployeeImportLog
      ? pageStateData?.page ?? 1
      : currentPage;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(6);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [importLogId, setImportLogId] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [logsData, setLogsData] = useState<{
    data: IImportLogData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 1,
    totalCount: 1,
  });

  const queryString = `?limit=${limit}&page=${currentPage}&clientId=${clientId}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}`;

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.ImportLog, PermissionEnum.View) && (
          <ViewButton
            onClickHandler={() => {
              setImportLogId(id);
              setOpenModal(true);
            }}
          />
        )}
      </div>
    );
  };
  const columnData = [
    {
      header: "File Name",
      name: "fileName",
      className: "",
      commonClass: "",
      cell: (props: { fileName: string }) => {
        const lastIndex = props.fileName.lastIndexOf("/");
        return props.fileName ? props.fileName.slice(lastIndex + 1) : "-";
      },
      option: {
        sort: true,
      },
    },
    {
      header: "Start Date",
      name: "startDate",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { startDate: Date | string }) => {
        return props.startDate
          ? moment(props?.startDate).format("DD/MM/YYYY h:mm a")
          : "-";
      },
    },
    {
      header: "End Date",
      name: "endDate",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { endDate: Date | string }) => {
        return props.endDate
          ? moment(props?.endDate).format("DD/MM/YYYY h:mm a")
          : "-";
      },
    },
    {
      header: "Action",
      cell: (props: { id: string }) => actionButton(props.id),
    },
  ];

  const getAllLogsData = async (query: string) => {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllImportLogs(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setLogsData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  };

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (clientId && (currentPage === 1 || currentPageNumber != currentPage)) {
      getAllLogsData(queryString);
    }

    setPageState({
      state: DefaultState.EmployeeImportLog as string,
      value: {
        ...pageStateData,
        page: logsData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, currentPage, limit, sort, sortType]);

  return (
    <div>
      <Table
        headerData={columnData as ITableHeaderProps[]}
        bodyData={logsData.data}
        isButton={false}
        isDropdown={false}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.EmployeeImportLog}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={logsData.totalPage}
        dataCount={logsData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
      />
      {openModal && (
        <EmployeeLogListById id={importLogId} setOpenModal={setOpenModal} />
      )}
    </div>
  );
};

export default EmployeeImportLogList;
