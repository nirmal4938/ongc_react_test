import Modal from "@/components/modal/Modal";
import { DeleteIcon, WaitingIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { countries } from "../../../src/json/country.json";
import { IClientData } from "@/interface/client/clientInterface";
import moment from "moment";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import {
  DeleteClient,
  GetAllClient,
  GetClientSearchDropdownData,
  UpdateClientStatus,
} from "@/services/clientService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUpdateClient from "./AddUpdateClient";
import { useNavigate } from "react-router-dom";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  FeaturesNameEnum,
  ModuleType,
  PermissionEnum,
  DefaultState,
} from "@/utils/commonConstants";
import {
  activeClientSelector,
  clientDataSelector,
  setActiveClient,
  setClientData,
} from "@/redux/slices/clientSlice";
import {
  ArchiveButton,
  DeleteButton,
  EditButton,
  ViewButton,
  imageRender,
  statusRender,
} from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { Option } from "@/interface/customSelect/customSelect";

const ClientList = () => {
  const navigate = useNavigate();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.Client ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Client Modal
  const dispatch = useDispatch();
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.Client
      ? pageStateData?.page ?? 1
      : currentPage;
  const activeClient = useSelector(activeClientSelector);
  const clientDataOptions = useSelector(clientDataSelector);
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
  const [clientDataPage, setClientDataPage] = useState<{
    data: IClientData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [clientSearchDropdownData, setClientSearchDropdownData] = useState<
    Option[]
  >([]);
  const [clientId, setClientId] = useState<string>("");
  const [alertPopUp, setAlertPopUp] = useState<boolean>(false);

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabData]);

  useEffect(() => {
    (async () => {
      (currentPage === 1 || currentPageNumber != currentPage) &&
        (await fetchAllClient());
    })();
    setPageState({
      state: DefaultState.Client as string,
      value: {
        ...pageStateData,
        page:
          clientDataPage.totalCount == limit
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

  async function fetchAllClient(query?: string) {
    dispatch(showLoader());
    let queryString =
      `?limit=${limit}&page=${currentPage}&sort=${
        sortType ? "asc" : "desc"
      }&sortBy=${sort}` +
      (tabData === -1 ? `` : `&isActive=${(tabData && "true") || "false"}`);
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    queryString = query ? queryString + query : queryString + searchParam;
    const dropdownQuery = `?isActive=${(tabData && "true") || "false"}`;
    setLoader(true);
    const response = await GetAllClient(queryString);
    const dropdownResponse = await GetClientSearchDropdownData(dropdownQuery);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setClientDataPage({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    if (dropdownResponse?.data?.responseData) {
      const result = dropdownResponse?.data?.responseData;
      setClientSearchDropdownData(result);
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const handleOpenModal = (id: string) => {
    setClientId(id);
    setOpen(true);
  };

  const clientDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const response = await DeleteClient(Number(id));
      if (response?.data?.response_type === "success") {
        await fetchAllClient();
        if (clientDataOptions.length > 0) {
          const tempClientData: IClientData[] = [];
          for (const i in clientDataOptions) {
            if (clientDataOptions[i]?.id != Number(id)) {
              tempClientData.push(clientDataOptions[i]);
            }
          }
          dispatch(setClientData(tempClientData as []));
          if (id === activeClient && tempClientData[0]?.id) {
            dispatch(setActiveClient(tempClientData[0].id));
          }
        }
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
    const response = await UpdateClientStatus(id, params);
    if (response.data.response_type === "success") {
      await fetchAllClient();

      if (isActive) {
        handleActiveToArchive(id);
      } else {
        handleArchiveToActive(response.data.responseData);
      }
    }
  };

  const handleActiveToArchive = (id: string) => {
    const tempClientData: IClientData[] = clientDataOptions.filter(
      (option) => option?.id !== Number(id)
    );
    dispatch(setClientData(tempClientData as []));
    if (id === activeClient && tempClientData[0]?.id) {
      dispatch(setActiveClient(tempClientData[0].id));
    }
  };

  const handleArchiveToActive = (responseData: IClientData) => {
    const temp = [...clientDataOptions, responseData];
    dispatch(setClientData(temp as []));
  };

  const actionButton = (id: string, status: boolean, slug: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.Client, PermissionEnum.View) && (
          <ViewButton
            onClickHandler={() => {
              navigate(`/setup/client/view/${slug}`);
            }}
          />
        )}
        {getPermissions(FeaturesNameEnum.Client, PermissionEnum.Update) && (
          <>
            <EditButton
              onClickHandler={() => {
                setClientId(id);
                setOpenModal(true);
              }}
            />
            <ArchiveButton
              onClickHandler={() => handleStatusUpdate(id, status)}
              status={status}
            />
          </>
        )}
        {getPermissions(FeaturesNameEnum.Client, PermissionEnum.Delete) && (
          <DeleteButton onClickHandler={() => handleOpenModal(id)} />
        )}
      </div>
    );
  };

  const columnData = [
    {
      header: "",
      name: "logo",
      cell: (props: { logo: string }) =>
        imageRender(
          props?.logo?.includes("user.jpg") || props?.logo == null
            ? props?.logo
            : `${props?.logo}` || ""
        ),
    },
    {
      header: "Code",
      name: "code",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
    },
    {
      header: "Name",
      name: "name",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { loginUserData: { name: string } }) =>
        props.loginUserData?.name,
    },
    {
      header: "Weekend Days",
      name: "weekendDays",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { weekendDays: string }) => props?.weekendDays || "-",
    },
    {
      header: "Country",
      name: "country",
      option: {
        sort: false,
      },
    },
    {
      header: "Start Date",
      name: "startDate",
      cell: (props: { startDate: Date | string }) => {
        return moment(props?.startDate).format("DD/MM/YYYY");
      },
      option: {
        sort: false,
      },
    },
    {
      header: "End Date",
      name: "endDate",
      cell: (props: { endDate: Date | string }) => {
        return moment(props?.endDate).format("DD/MM/YYYY");
      },
      option: {
        sort: false,
      },
    },
    {
      header: "Currency",
      name: "",
      className: "",
      commonClass: "",
      cell: (props: { currency: string }) => {
        return (
          countries.find((val) => val.currencyCode === props.currency)
            ?.currencyName ?? "-"
        );
      },
      option: {
        sort: false,
      },
    },
    {
      header: "ISO Code",
      name: "",
      className: "",
      commonClass: "",
      cell: (props: { currency: string }) => {
        return (
          countries.find((val) => val.currencyCode === props.currency)
            ?.currencyCode ?? "-"
        );
      },
      option: {
        sort: false,
      },
    },
    {
      ...(tabData == -1 && {
        header: "Status",
        name: "status",
        className: "",
        commonClass: "",
        cell: (props: { isActive: boolean }) => statusRender(props.isActive),
        option: {
          sort: false,
        },
      }),
    },
    {
      header: "Action",
      cell: (props: { id: string; isActive: boolean; slug: string }) =>
        actionButton(props.id, props.isActive, props.slug),
    },
  ];

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        isSearch={true}
        paginationApiCb={fetchAllClient}
        headerData={columnData as ITableHeaderProps[]}
        bodyData={clientDataPage.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.Client,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.Client,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setClientId("");
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.Client}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={clientDataPage.totalPage}
        dataCount={clientDataPage.totalCount}
        isTab={true}
        setTab={setTabData}
        tabValue={tabData}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        moduleType={ModuleType?.CLIENTS}
        searchDropdownData={clientSearchDropdownData}
      />
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          loaderButton={deleteLoader}
          onClickHandler={() => clientDelete(clientId)}
          confirmationText="Are you sure you want to delete this client?"
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateClient
          id={clientId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          setAlertPopUp={setAlertPopUp}
          fetchAllData={() => {
            fetchAllClient();
          }}
        />
      )}
      {alertPopUp && (
        <Modal
          variant={"Confirmation"}
          width="max-w-[475px]"
          icon={<WaitingIcon className="w-full h-full mx-auto" />}
          cancelbtnText="OK"
          confirmationText="It will take upto 48 hours to extend the timesheet for this client on the portal."
          title="Please be patient"
          hideCrossIcon
          onClickHandler={() => setAlertPopUp(false)}
          hideCancelButton
          okbtnText={"OK"}
        >
          <div className=""></div>
        </Modal>
      )}
    </>
  );
};

export default ClientList;
