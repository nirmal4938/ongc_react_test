import Modal from "@/components/modal/Modal";
import { DeleteIcon, KeyIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import {
  IRoleData,
  IRolePermissionData,
} from "@/interface/rolePermission/RolePermissionInterface";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import {
  DeleteUser,
  GetAllUser,
  GetUserSearchDropdown,
  SendUserResetLink,
} from "@/services/userService";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ILoginUserData,
  IUserData,
  IUserSegmentData,
} from "@/interface/user/userInterface";
import {
  activeClientSelector,
  clientDataSelector,
  setActiveClient,
  setClientData,
  userActiveClientSelector,
} from "@/redux/slices/clientSlice";
// import UserFilter from "@/components/filter/UserFilter";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultRoles,
  DefaultState,
  FeaturesNameEnum,
  ModuleType,
  PermissionEnum,
  getFeaturePermission,
} from "@/utils/commonConstants";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "@/components/CommonComponents";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { GetRoleData } from "@/services/roleService";
import { Option } from "@/interface/customSelect/customSelect";
// import SelectComponent from "@/components/formComponents/customSelect/Select";
import { GetClientData } from "@/services/clientService";
import { GetSegmentDropdownData } from "@/services/employeeService";
import _ from "lodash";

const UserList = () => {
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.User ? pageState?.value : {};
  // const [openFilter, setOpenFilter] = useState<boolean>(false);
  // const [selectedFilterValue, setSelectedFilterValue] =
  //   useState<string>("client");
  const [limit, setLimit] = useState<number>(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.User
      ? pageStateData?.page ?? 1
      : currentPage;
  const [open, setOpen] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [resetLoader, setResetLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [tabData, setTabData] = useState<number>(
    pageStateData?.tabData != null && pageStateData?.tabData != undefined
      ? pageStateData?.tabData
      : 1
  );
  const clientId = useSelector(userActiveClientSelector);
  const [userData, setUserData] = useState<{
    data: IUserData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [userSearchDropdownData, setUserSearchDropdownData] = useState<
    Option[]
  >([]);
  const [roleList, setRoleList] = useState<Option[]>([]);
  const [activeRole, setActiveRole] = useState<number>(
    pageStateData?.activeRole ?? 0
  );
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const clientDetails = useSelector(clientDataSelector);
  const activeClient = useSelector(activeClientSelector);
  const [clientData] = useState<Option[]>([]);
  // const [clientData, setClientData] = useState<Option[]>([]);
  const [activeClientValue, setActiveClientDropdownValue] = useState<number>(0);
  const [activeClientDropdown, setActiveClientDropdown] = useState<
    string | number
  >("");
  const [segmentDropdownOption, setSegmentDropdownOption] = useState<Option[]>(
    []
  );
  const [activeSegment, setActiveSegment] = useState<string[]>(
    pageStateData?.activeSegment ?? ["all"]
  );
  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabData]);

  useEffect(() => {
    (currentPage === 1 || currentPageNumber != currentPage) && fetchAllUser();
    (currentPage === 1 || currentPageNumber != currentPage) &&
      fetchAllUserRolesList();

    setPageState({
      state: DefaultState.User as string,
      value: {
        ...pageStateData,
        page:
          userData.totalCount == limit
            ? 1
            : pageStateData?.tabData == tabData
            ? pageStateData?.page ?? 1
            : 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
        activeRole: activeRole,
        activeSegment: activeSegment,
        clientId: activeClient,
        tabData: tabData,
      },
    });
    fetchEmployeeSegmentDropdown();
    // Activate the below code to add client dropdown
    // if (clientData?.length == 0) {
    //   getAllClientData();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeClient,
    currentPage,
    limit,
    sort,
    activeSegment,
    sortType,
    activeRole,
    tabData,
    activeClientValue,
    activeClientDropdown,
  ]);

  async function fetchAllUser(query?: string) {
    let queryString =
      `?limit=${limit}&page=${currentPage}&sort=${
        sortType ? "asc" : "desc"
      }&sortBy=${sort}` +
      (tabData === -1 ? `` : `&isActive=${(tabData && "true") || "false"}`) +
      (activeRole !== 0 ? `&roleId=${activeRole}` : "") +
      (activeClient !== 0 ? `&clientId=${activeClient}` : "");
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    if (activeSegment && activeSegment[0] !== "all") {
      const segmentIds: any = [];
      const subSegmentIds: any = [];

      activeSegment.forEach((segment) => {
        const [segmentId, subSegmentId] = segment.split("-");
        if (subSegmentId) {
          subSegmentIds.push(subSegmentId);
        } else {
          segmentIds.push(segmentId);
        }
      });

      if (segmentIds.length > 0) {
        queryString += `&segmentId=${segmentIds.join(",")}`;
      }

      if (subSegmentIds.length > 0) {
        queryString += `&subSegmentId=${subSegmentIds.join(",")}`;
      }
    }
    queryString = query ? queryString + query : queryString + searchParam;

    const isActive =
      tabData !== -1
        ? "?isActive=" + `${(tabData && "true") || "false"}`
        : null;
    const roleId =
      activeRole !== 0 ? (isActive ? "&" : "?") + "roleId=" + activeRole : null;
    const clientIdQuery =
      activeClient !== 0
        ? `${roleId || isActive ? "&" : "?"}clientId=${activeClient}`
        : "";

    let dropdownQuery = (isActive ?? "") + (roleId ?? "") + clientIdQuery || "";
    if (activeSegment && activeSegment[0] !== "all") {
      const segmentIds: any = [];
      const subSegmentIds: any = [];

      activeSegment.forEach((segment) => {
        const [segmentId, subSegmentId] = segment.split("-");
        if (subSegmentId) {
          subSegmentIds.push(subSegmentId);
        } else {
          segmentIds.push(segmentId);
        }
      });

      if (segmentIds.length > 0) {
        dropdownQuery += `&segmentId=${segmentIds.join(",")}`;
      }

      if (subSegmentIds.length > 0) {
        dropdownQuery += `&subSegmentId=${subSegmentIds.join(",")}`;
      }
    }
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllUser(queryString);
    const dropdownResponse = await GetUserSearchDropdown(dropdownQuery);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setUserData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    if (dropdownResponse?.data?.responseData) {
      const result = dropdownResponse?.data?.responseData;
      setUserSearchDropdownData(result);
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const fetchEmployeeSegmentDropdown = async () => {
    const response = await GetSegmentDropdownData(
      `?clientId=${activeClient}&isActive=true`
    );
    const result = response?.data?.responseData;
    if (result) {
      let segmentOption = [
        {
          label: `All Segment`,
          value: "all",
        },
      ];
      if (result?.length) {
        segmentOption = [...segmentOption, ...result];
      }
      setSegmentDropdownOption(segmentOption);
    }
  };

  async function fetchAllUserRolesList() {
    let query = `?type=all&clientId=${activeClient}`;

    if (activeSegment && activeSegment[0] !== "all") {
      const segmentIds: any = [];
      const subSegmentIds: any = [];
      activeSegment.forEach((segment) => {
        const [segmentId, subSegmentId] = segment.split("-");
        if (subSegmentId) {
          subSegmentIds.push(subSegmentId);
        } else {
          segmentIds.push(segmentId);
        }
      });

      if (segmentIds.length > 0) {
        query += `&segmentId=${segmentIds.join(",")}`;
      }

      if (subSegmentIds.length > 0) {
        query += `&subSegmentId=${subSegmentIds.join(",")}`;
      }
    }
    const response = await GetRoleData(query);
    if (response?.data?.responseData?.data) {
      let roleDataList = response?.data?.responseData?.data;
      if (activeClient) {
        roleDataList = roleDataList?.filter((roleData: { users: any[] }) => {
          return (
            roleData?.users?.some(
              (userData) => userData?.loginUserData?.employee?.length > 0
            ) ||
            roleData?.users?.some(
              (userData) => userData?.loginUserData?.client?.length > 0
            ) ||
            roleData?.users?.some(
              (userData) => userData?.userClientList?.length > 0
            ) ||
            roleData?.users?.some(
              (userData) => userData?.userSegmentList?.length
            )
          );
        });
      }
      roleDataList = roleDataList?.map((role: IRoleData) => ({
        label: role.name,
        value: role.id,
      }));
      roleDataList = roleDataList?.filter(
        (e: { label: string; value: number }) => e.label !== "Client"
      );
      roleDataList = [{ label: "ALL", value: 0 }, ...roleDataList];
      setRoleList(roleDataList);
    }
  }

  const handleOpenModal = (id: string) => {
    setUserId(id);
    setOpen(true);
  };

  const userDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const query = clientId ? `?clientId=${clientId}` : "";
      const response = await DeleteUser(Number(id), query);
      if (response?.data?.response_type === "success") {
        await fetchAllUser();
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
    setDeleteLoader(false);
  };

  const actionButton = (
    id: string,
    loginUserData: ILoginUserData,
    roleData: string
  ) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.Users, PermissionEnum.View) && (
          <ViewButton onClickHandler={() => navigate(`/admin/user/${id}`)} />
        )}
        {getPermissions(FeaturesNameEnum.Users, PermissionEnum.Update) && (
          <EditButton
            onClickHandler={() => navigate(`/admin/user/edit/${id}`)}
          />
        )}
        {getPermissions(FeaturesNameEnum.Users, PermissionEnum.Delete) &&
          roleData != DefaultRoles.Admin && (
            <DeleteButton onClickHandler={() => handleOpenModal(id)} />
          )}
        {getPermissions(FeaturesNameEnum.Users, PermissionEnum.Update) && (
          <span
            className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-red/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
            title="Send Reset Password"
            onClick={() => handleOpenResetModal(loginUserData.email)}
          >
            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
              Send Reset Password
            </span>
            <KeyIcon className="w-ful h-full pointer-events-none" />
          </span>
        )}
      </div>
    );
  };

  const columnData = [
    {
      header: "Email",
      name: "email",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { loginUserData: { email: string } }) =>
        props?.loginUserData?.email,
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
        props?.loginUserData?.name,
    },
    {
      header: "Role",
      name: "roleData",
      option: {
        sort: false,
      },
      cell: (props: { roleData: { name: string } }) => props?.roleData?.name,
    },
    {
      header: "Permission",
      name: "permission",
      cell: (props: {
        loginUserData: {
          assignedUserPermission: IRolePermissionData[];
        };
      }) => {
        if (props?.loginUserData?.assignedUserPermission) {
          const featurePermissions = getFeaturePermission(
            props?.loginUserData?.assignedUserPermission
          );
          const result = featurePermissions
            ?.filter(
              (e) =>
                e?.featureName !== "Reliquat Calculation V2" &&
                e?.featureName !== "Account"
            )
            ?.map((e) => {
              let permissions = e?.permissions;
              if (e?.featureName === "Bonus Type") {
                permissions = e?.permissions?.filter(
                  (e: string) => e !== "view"
                );
              }
              if (e?.featureName === "Employee Contract") {
                permissions = e?.permissions?.filter(
                  (e: string) => e !== "update"
                );
              }
              if (permissions?.length > 0) {
                return `${_.startCase(e.featureName)}: ${_.startCase(
                  permissions?.toString()
                )}`;
              }
            });
          return result?.filter((e) => e);
        } else {
          return [];
        }
      },
    },
    {
      header: "Segments",
      name: "segment",
      className: "",
      commonClass: "",
      option: {
        sort: false,
      },
      cell: (props: { userSegmentList: IUserSegmentData[] }) => {
        return [
          ...new Set(
            props?.userSegmentList
              // ?.filter(
              //   (e) =>
              //     e?.segmentData?.isActive &&
              //     (e?.subSegmentData?.id ? e?.subSegmentData?.isActive : "")
              // )
              ?.map(
                (segment) =>
                  ` ${segment?.segmentData?.name}${
                    segment?.subSegmentData?.name
                      ? " - " + segment?.subSegmentData?.name
                      : ""
                  }`
              )
          ),
        ];
      },
    },
    // {
    //   header: "Segments (Approval)",
    //   name: "segmentApproval",
    //   className: "",
    //   commonClass: "",
    //   option: {
    //     sort: false,
    //   },
    //   cell: (props: { userSegmentApprovalList: IUserSegmentData[] }) => {
    //     return [
    //       ...new Set(
    //         props?.userSegmentApprovalList?.map(
    //           (segmentApproval) =>
    //             ` ${segmentApproval?.segmentData?.name}${
    //               segmentApproval?.subSegmentData
    //                 ? " - " + segmentApproval?.subSegmentData?.name
    //                 : ""
    //             }`
    //         )
    //       ),
    //     ].toString();
    //   },
    // },
    {
      header: "Action",
      cell: (props: {
        id: string;
        status: string;
        roleData: {
          id: number;
          name: string;
        };
        loginUserData: ILoginUserData;
      }) => actionButton(props.id, props.loginUserData, props.roleData.name),
    },
  ];

  const tabList = [
    {
      name: "Unlock",
      value: 1,
    },
    {
      name: "Lock",
      value: 0,
    },
    {
      name: "All",
      value: -1,
    },
  ];

  // For resetting the password
  const handleOpenResetModal = (email: string) => {
    setUserEmail(email);
    setOpenResetModal(true);
  };

  const handleUserResetLink = async (email: string) => {
    setResetLoader(true);
    if (email) {
      const params = { email: email };
      const response = await SendUserResetLink(params);
      if (response?.data?.response_type === "success") {
        setOpenResetModal(false);
        setUserEmail("");
      }
    }
    setResetLoader(false);
  };

  // const handleUserFilter = async (query: string) => {
  //   dispatch(currentPageCount(1));
  //   await fetchAllUser(query);
  // };

  // const getAllClientData = async () => {
  //   const response = await GetAllClient("");
  //   const allClients: Option[] = response.data.responseData.data?.map((dat: IClientData) => ({label: dat?.loginUserData?.name, value: dat?.id}) || [])
  //   if (allClients?.length > 0) {
  //     setClientData([{label: 'All Client', value: 0}, ...allClients])
  //   }
  // };
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!clientDetails?.length) {
      fetchAllClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (clientDetails) {
      const resp: Option[] | Option = [{ label: "ALL", value: 0 }];
      for (const i in clientDetails) {
        if (clientDetails[i]?.loginUserData?.name) {
          resp.push({
            label: String(clientDetails[i]?.loginUserData?.name),
            value: String(clientDetails[i]?.id),
          });
        }
      }
      resp && setOptions(resp);
    }
  }, [clientDetails]);
  const fetchAllClients = async () => {
    const response = await GetClientData("");
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      dispatch(setClientData(result?.data));
      dispatch(setActiveClient(result?.data[0]?.id ?? ""));
    }
  };

  const handleExport = async () => {
    let queryString =
      `?sort=${sortType ? "asc" : "desc"}&sortBy=${sort}` +
      (tabData === -1 ? `` : `&isActive=${(tabData && "true") || "false"}`) +
      (activeRole !== 0 ? `&roleId=${activeRole}` : "") +
      (activeClient !== 0 ? `&clientId=${activeClient}` : "");

    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    if (activeSegment && activeSegment[0] !== "all") {
      const segmentIds: any = [];
      const subSegmentIds: any = [];

      activeSegment.forEach((segment) => {
        const [segmentId, subSegmentId] = segment.split("-");
        if (subSegmentId) {
          subSegmentIds.push(subSegmentId);
        } else {
          segmentIds.push(segmentId);
        }
      });

      if (segmentIds.length > 0) {
        queryString += `&segmentId=${segmentIds.join(",")}`;
      }

      if (subSegmentIds.length > 0) {
        queryString += `&subSegmentId=${subSegmentIds.join(",")}`;
      }
    }
    const response = await GetAllUser(queryString + searchParam);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      const workbook = XLSX.utils.book_new();
      const itemValue = result.data.map((item: IUserData) => {
        const featurePermissions = getFeaturePermission(
          item?.loginUserData?.assignedUserPermission
        );
        const featurePermissionString = featurePermissions
          ?.filter(
            (e) =>
              e?.featureName !== "Reliquat Calculation V2" &&
              e?.featureName !== "Account"
          )
          ?.map((e) => {
            let permissions = e?.permissions;
            if (e?.featureName === "Bonus Type") {
              permissions = e?.permissions?.filter((e: string) => e !== "view");
            }
            if (permissions?.length > 0) {
              return `${_.startCase(e.featureName)}: ${_.startCase(
                permissions?.toString()
              )}`;
            }
          });
        const newObj = {
          Email: item?.loginUserData?.email,
          Name: item?.loginUserData?.name,
          Role: item?.roleData?.name,
          Permission: featurePermissionString
            ?.filter((e) => e)
            ?.toString()
            ?.replaceAll(",", " ,"),
          Segment: [
            ...new Set(
              item?.userSegmentList?.map(
                (segment) =>
                  ` ${segment?.segmentData?.name}${
                    segment?.subSegmentData?.name
                      ? " - " + segment?.subSegmentData?.name
                      : ""
                  }`
              )
            ),
          ].toString(),
          // "Segments (Approval)": [
          //   ...new Set(
          //     item?.userSegmentApprovalList?.map(
          //       (segmentApproval) =>
          //         ` ${segmentApproval?.segmentData?.name}${
          //           segmentApproval?.subSegmentData
          //             ? " - " + segmentApproval?.subSegmentData?.name
          //             : ""
          //         }`
          //     )
          //   ),
          // ].toString(),
        };
        return newObj;
      });
      const worksheet = XLSX.utils.json_to_sheet(itemValue);
      worksheet["!cols"] = [
        { width: 32 },
        { width: 24 },
        { width: 10 },
        { width: 50 },
        { width: 100 },
      ];
      worksheet["!rows"] = [];
      worksheet["!rows"][0] = { hpt: 30 };
      Object?.keys(worksheet)
        ?.filter((e) => e?.length === 2 && e?.endsWith("1"))
        ?.forEach((cell) => {
          worksheet[cell].s = {
            fill: { fgColor: { rgb: "560504	" } },
            font: { sz: "12", bold: true, color: { rgb: "FFFFFF" } },
            alignment: {
              wrapText: true,
              horizontal: "center",
              vertical: "center",
            },
          };
        });
      itemValue.forEach(async () => {
        worksheet["!rows"]?.push({ hpt: 20 });
      });
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "User_List.xlsx");
    }
  };
  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        isSearch={true}
        paginationApiCb={fetchAllUser}
        headerData={columnData as ITableHeaderProps[]}
        bodyData={userData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.Users,
          PermissionEnum.View
        )}
        isTab={true}
        setTab={setTabData}
        tabValue={tabData}
        TabList={tabList}
        isButton={getPermissions(FeaturesNameEnum.Users, PermissionEnum.Create)}
        buttonText="Add"
        buttonLink="/admin/user/add"
        isExport={getPermissions(FeaturesNameEnum.Users, PermissionEnum.View)}
        exportButtonClick={handleExport}
        isFilter={false}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.User}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={userData.totalPage}
        dataCount={userData.totalCount}
        isUserDropdown={true}
        isSegmentItemSided={true}
        isClientAllDropdown={true}
        dropDownClientList={options}
        clientDropDownValue={activeClient}
        activeSegmentValue={activeSegment}
        isExternalSegmentDropDown={true}
        dropDownSegmentList={segmentDropdownOption}
        dropDownList={roleList}
        dropDownValue={activeRole}
        setSegmentDropdownValue={(value: any) => {
          setActiveSegment(value);
        }}
        setClientDropdownValue={(
          value: number | string | (number | string)[]
        ) => {
          setActiveSegment(["all"]);
          dispatch(setActiveClient(Number(value)));
          setActiveClientDropdownValue(Number(value));
        }}
        setDropdownValue={(value: number | string | (number | string)[]) => {
          setActiveRole(Number(value));
        }}
        moduleType={ModuleType?.USERS}
        searchDropdownData={userSearchDropdownData}
        isExternalClientDropdown={false}
        clientData={clientData}
        setActiveClient={setActiveClientDropdown}
        activeClient={activeClientDropdown}
      />

      {/* {openFilter && (
        <UserFilter
          selectedValue={selectedFilterValue}
          setSelectedValue={setSelectedFilterValue}
          setOpenFilter={setOpenFilter}
          handleFilter={handleUserFilter}
        />
      )} */}
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => userDelete(userId)}
          loaderButton={deleteLoader}
          confirmationText="Are you sure you want to delete this user?"
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
      {openResetModal && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpenResetModal(!openResetModal)}
          width="max-w-[475px]"
          icon={<KeyIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          loaderButton={resetLoader}
          onClickHandler={() => handleUserResetLink(userEmail)}
          confirmationText="Are you sure you want to generate the reset password link?"
          title="Reset Link"
        >
          <div className=""></div>
        </Modal>
      )}
    </>
  );
};

export default UserList;
