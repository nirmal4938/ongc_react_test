import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import moment from "moment";
import {
  IMessageDetail,
  IMessageSalaryDetail,
  ISalaryMessageData,
} from "@/interface/message/message";
import {
  GetAllSalaryMessage,
  GetAllSalaryMessageEmployeeSuggestiveDropdownData,
} from "@/services/messageService";

import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  ModuleType,
  PermissionEnum,
} from "@/utils/commonConstants";
import { setEmployeeSearchDropdown } from "@/redux/slices/employeeSearchDropdownSlice";

const SalaryMessageList = () => {
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.SalaryMessage ? pageState?.value : {};
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.SalaryMessage
      ? pageStateData?.page ?? 1
      : currentPage;

  const [limit, setLimit] = useState<number>(10);
  const [loader, setLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const activeClient = useSelector(activeClientSelector);
  const [messageDataPage, setMessageDataPage] = useState<{
    data: ISalaryMessageData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  const columnData = [
    {
      header: "Name",
      name: "name",
      cell: (props: IMessageSalaryDetail) => {
        return props.employeeDetail !== null
          ? props?.employeeDetail?.loginUserData?.firstName +
              " " +
              props?.employeeDetail?.loginUserData?.lastName
          : props.managerUser !== null
          ? props?.managerUser?.loginUserData?.firstName +
            " " +
            props?.managerUser?.loginUserData?.lastName
          : "-";
      },
      option: {
        sort: false,
      },
    },
    {
      header: "Email",
      name: "email",
      cell: (props: { email: string }) => props.email || "-",
      option: {
        sort: false,
      },
    },
    {
      header: "Phone",
      name: "phone",
      cell: (props: { phone: string }) => props?.phone || "-",
      option: {
        sort: false,
      },
    },

    {
      header: "Salary Date",
      name: "salaryDate",
      cell: (props: { salaryDate: Date | string }) => {
        return props.salaryDate
          ? moment(props?.salaryDate).format("DD/MM/YYYY")
          : "-";
      },
      option: {
        sort: false,
      },
    },
    {
      header: "Created Date",
      name: "createdAt",
      cell: (props: { createdAt: Date | string }) => {
        return props.createdAt
          ? moment(props?.createdAt).format("DD/MM/YYYY")
          : "-";
      },
      option: {
        sort: false,
      },
    },
    {
      header: "Salary Month",
      name: "salaryMonth",
      cell: (props: { salaryMonth: string }) => props?.salaryMonth || "-",
      option: {
        sort: false,
      },
    },
    {
      header: "Monthly Salary",
      name: "monthlySalary",
      cell: (props: { monthlySalary: string }) => props?.monthlySalary || "-",
      option: {
        sort: false,
      },
    },
    {
      header: "Bonus Price",
      name: "bonusPrice",
      cell: (props: { bonusPrice: string }) => props?.bonusPrice || "-",
      option: {
        sort: false,
      },
    },
    {
      header: "Total",
      name: "total",
      cell: (props: { total: string }) => props?.total || "-",
      option: {
        sort: false,
      },
    },

    {
      header: "Message",
      name: "message",
      cell: (props: IMessageDetail) => props.message,
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
    },

    {
      header: "Action",
    },
  ];

  const fetchAllMessageData = async (query?: string) => {
    let queryString =
      `?limit=${limit}&page=${currentPage}` +
      (activeClient !== 0 ? `&clientId=${activeClient}` : "") +
      `&sort=${sortType ? "desc" : "asc"}&sortBy=${sort}`;
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    const dropdownQuery = `?clientId=${activeClient}`;

    queryString = query ? queryString + query : queryString + searchParam;
    setLoader(true);
    const response = await GetAllSalaryMessage(queryString);
    const dropdownResponse =
      await GetAllSalaryMessageEmployeeSuggestiveDropdownData(dropdownQuery);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      const trimmedData = result.data.map((res: { message: string }) => ({
        ...res,
        message: trimHTML(res.message),
      }));
      setMessageDataPage({
        data: trimmedData,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    if (dropdownResponse?.data?.responseData) {
      const result = dropdownResponse?.data?.responseData;
      dispatch(setEmployeeSearchDropdown(result));
    }
    setLoader(false);
  };

  function trimHTML(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const textContent = doc.body.textContent ?? "";
    return textContent.trim();
  }

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPage === 1 || currentPageNumber != currentPage) {
      fetchAllMessageData();
    }

    setPageState({
      state: DefaultState.Message as string,
      value: {
        ...pageStateData,
        page:
          messageDataPage.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        clientData: activeClient,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, activeClient, sort, sortType]);

  return (
    <Table
      tableClass="!min-w-[1280px]"
      isSearch={true}
      paginationApiCb={fetchAllMessageData}
      headerData={columnData as ITableHeaderProps[]}
      bodyData={messageDataPage?.data}
      isShowTable={getPermissions(
        FeaturesNameEnum.SalaryMessage,
        PermissionEnum.View
      )}
      isButton={getPermissions(
        FeaturesNameEnum.SalaryMessage,
        PermissionEnum.Update
      )}
      buttonText="Draft"
      buttonLink="/admin/salary-message/draft"
      loader={loader}
      pagination={true}
      paginationModule={DefaultState.SalaryMessage}
      dataPerPage={limit}
      setLimit={setLimit}
      currentPage={currentPage}
      totalPage={messageDataPage.totalPage}
      dataCount={messageDataPage.totalCount}
      setSorting={setSorting}
      sortType={sortType}
      setSortingType={setSortingType}
      moduleType={ModuleType?.EMPLOYEE}
    />
  );
};

export default SalaryMessageList;
