import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import moment from "moment";
import { GetAllErrorLog } from "@/services/errorLogService";
import { activeErrorSelector } from "@/redux/slices/errorCategoriesSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { usePermission } from "@/context/PermissionProvider";
import { DefaultState } from "@/utils/commonConstants";

const ErrorLogList = () => {
  const dispatch = useDispatch();
  const { pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.ErrorLog ? pageState?.value : {};
  let currentPage = useSelector(currentPageSelector);
  currentPage =
    pageState?.state == DefaultState.ErrorLog
      ? pageStateData?.page ?? 1
      : currentPage;
  const activeClient = useSelector(activeClientSelector);
  const activeError = useSelector(activeErrorSelector);
  const [limit, setLimit] = useState<number>(3);
  const [loader, setLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );

  const [errorLogDataPage, setErrorLogDataPage] = useState<{
    data: IContractSummaryData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const currentDate = new Date(),
    year = currentDate.getFullYear(),
    month = currentDate.getMonth();
  const [dateFilter, setDateFilter] = useState({
    startDate: pageStateData?.startDate ?? new Date(year, month, 1),
    endDate: pageStateData?.endDate ?? new Date(year, month + 1, 0),
  });

  const queryString = `?limit=${limit}&page=${currentPage}&clientId=${activeClient}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}&startDate=${moment(dateFilter.startDate).format(
    "YYYY/MM/DD"
  )}&endDate=${moment(dateFilter.endDate).format("YYYY/MM/DD")}${
    pageStateData?.activeError != "all"
      ? `&type=${pageStateData?.activeError}`
      : activeError != "all"
      ? `&type=${activeError}`
      : ""
  }`;

  const columnData = [
    {
      header: "Category",
      name: "type",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "User Name",
      name: "email",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Description",
      name: "error_message",
      className: "",
      commonClass: "",
      subString: true,
      option: {
        sort: true,
      },
    },
    {
      header: "Created Date",
      name: "createdAt",
      cell: (props: { createdAt: Date | string }) => {
        return props.createdAt
          ? moment(props?.createdAt).format("DD/MM/YYYY hh:mm ")
          : "-";
      },
      option: {
        sort: true,
      },
    },
  ];

  const fetchAllErrorLog = async (query: string) => {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllErrorLog(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setErrorLogDataPage({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Number(activeClient)) {
      fetchAllErrorLog(queryString);
    }
    setPageState({
      state: DefaultState.ErrorLog as string,
      value: {
        ...pageStateData,
        page:
          pageStateData?.startDate != dateFilter?.startDate ||
          pageStateData?.endDate != dateFilter?.endDate ||
          pageStateData?.activeError != activeError
            ? 1
            : errorLogDataPage.totalCount == limit
            ? 1
            : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
        activeError: activeError,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    limit,
    activeClient,
    activeError,
    sort,
    sortType,
    dateFilter?.startDate,
    dateFilter?.endDate,
  ]);

  return (
    <>
      <Table
        headerData={columnData as ITableHeaderProps[]}
        bodyData={errorLogDataPage.data}
        isButton={false}
        isClientDropdown={false}
        isErrorCategoriesDropdown={true}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.ErrorLog}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={errorLogDataPage.totalPage}
        dataCount={errorLogDataPage.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        isDateRange={true}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        setSortingType={setSortingType}
      />
    </>
  );
};

export default ErrorLogList;
