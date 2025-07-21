import Table from "@/components/table/Table";
import moment from "moment";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IMedicalExpiryData } from "@/interface/medicalRequest/MedicalRequestInterface";
import { GetAllMedicalExpiryData } from "@/services/medicalRequestService";
import {
  activeEmployeeSelector,
  setActiveEmployee,
} from "@/redux/slices/employeeSlice";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { PlusIcon } from "@/components/svgIcons";
import { RoundIconButton } from "@/components/home/MedicalCheckSection";
import AddUpdateMedicalRequest from "../medicalRequest/AddUpdateMedicalRequest";

const MedicalExpiryList = () => {
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.MedicalExpiry ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const activeClient = useSelector(activeClientSelector);
  let currentPage = useSelector(currentPageSelector);
  currentPage =
    pageState?.state == DefaultState.MedicalExpiry
      ? pageStateData?.page ?? 1
      : currentPage;
  const [loader, setLoader] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const activeEmployee = useSelector(activeEmployeeSelector);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );

  const [medicalRequestData, setMedicalRequestData] = useState<{
    data: IMedicalExpiryData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  const queryString = `?limit=${limit}&page=${currentPage}&clientId=${
    activeClient || ""
  }&sort=${sortType ? "asc" : "desc"}&sortBy=${sort}`;

  useEffect(() => {
    dispatch(currentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    activeClient && fetchAllMedicalRequest(queryString);

    setPageState({
      state: DefaultState.MedicalExpiry as string,
      value: {
        ...pageStateData,
        page:
          medicalRequestData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, activeClient, activeEmployee, sort, sortType]);

  async function fetchAllMedicalRequest(query: string) {
    dispatch(showLoader());
    setLoader(true);
    const response = await GetAllMedicalExpiryData(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setMedicalRequestData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    setLoader(false);
    dispatch(hideLoader());
  }

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(
          FeaturesNameEnum.MedicalRequest,
          PermissionEnum.Create
        ) && (
          <div className="flex group relative items-center ml-10 first:ml-0">
            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
              Add
            </span>
            <RoundIconButton
              icon={<PlusIcon />}
              onClick={() => {
                dispatch(setActiveEmployee(id));
                setEmployeeId(id);
                setOpenModal(true);
              }}
            />
          </div>
        )}
      </div>
    );
  };
  const columnData = [
    {
      header: "Name",
      name: "name",
      option: {
        sort: false,
      },
      cell: (props: {
        loginUserData: { firstName: string; lastName: string };
      }) =>
        props?.loginUserData?.firstName +
          " " +
          props?.loginUserData?.lastName || "-",
    },
    {
      header: "Medical Date",
      name: "medicalCheckDate",
      option: {
        sort: true,
      },
      cell: (props: { medicalCheckDate: string }) =>
        moment(props?.medicalCheckDate).format("DD/MM/YYYY"),
    },
    // {
    //   header: "Medical Type",
    //   name: "medicalType",
    //   option: {
    //     sort: false,
    //   },
    //   cell: (props: {
    //      medicalTypeData: { name: string  };
    //   }) => props?.medicalTypeData?.name,
    // },
    {
      header: "Medical Expiry",
      name: "medicalCheckExpiry",
      option: {
        sort: true,
      },
      cell: (props: { medicalCheckExpiry: string }) =>
        props?.medicalCheckExpiry
          ? moment(props?.medicalCheckExpiry).format("DD/MM/YYYY")
          : "-",
    },
    {
      header: "Email",
      name: "email",
      option: {
        sort: false,
      },
      cell: (props: { loginUserData: { email: string } }) =>
        props?.loginUserData?.email ?? "-",
    },
    {
      header: "Action",
      cell: (props: { id: string }) => actionButton(props?.id),
    },
  ];
  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={medicalRequestData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.MedicalRequest,
          PermissionEnum.View
        )}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.MedicalExpiry}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={medicalRequestData.totalPage}
        dataCount={medicalRequestData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
      />
      {openModal && (
        <AddUpdateMedicalRequest
          employeeId={Number(employeeId) || Number(activeEmployee)}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};

export default MedicalExpiryList;
