import { DeleteButton, EditButton } from "@/components/CommonComponents";
import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { usePermission } from "@/context/PermissionProvider";
import {
  IRoleData,
  IRolePermissionData,
} from "@/interface/rolePermission/RolePermissionInterface";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { DeleteRole, GetAllRole } from "@/services/roleService";
import {
  DefaultRoles,
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RoleList = () => {
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.Role ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.Role
      ? pageStateData?.page ?? 1
      : currentPage;
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<string>("");
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [roleData, setRoleData] = useState<{
    data: IRoleData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const queryString = `?page=${currentPage}&limit=${limit}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}`;

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (currentPage === 1 || currentPageNumber != currentPage) &&
      getAllRole(queryString);

    setPageState({
      state: DefaultState.Role as string,
      value: {
        ...pageStateData,
        page: roleData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, sort, sortType]);

  async function getAllRole(queryString: string) {
    // queryString = query ? queryString + query : queryString;
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllRole(queryString);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setRoleData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const handleOpenModal = (id: string) => {
    setRoleId(id);
    setOpen(true);
  };
  const roleDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const response = await DeleteRole(Number(id));
      if (response?.data?.response_type === "success") {
        await getAllRole(queryString);
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
    setDeleteLoader(false);
  };

  const actionButton = (id: string, name: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {name.toLowerCase() !== "super admin" &&
          name !== DefaultRoles.Employee &&
          name !== DefaultRoles.Client && (
            <>
              {getPermissions(FeaturesNameEnum.Role, PermissionEnum.Update) && (
                <EditButton
                  onClickHandler={() => {
                    navigate(`/admin/role/edit/${id}`);
                  }}
                />
              )}
              {getPermissions(FeaturesNameEnum.Role, PermissionEnum.Delete) &&
                !["manager", "employee"].includes(name) && (
                  <DeleteButton onClickHandler={() => handleOpenModal(id)} />
                )}
            </>
          )}
      </div>
    );
  };

  const columnData = [
    {
      header: "Role",
      name: "name",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    {
      header: "Permission",
      name: "permission",
      subString: true,
      cell: (props: { assignedPermissions: IRolePermissionData[] }) => {
        return [
          ...new Set(
            props.assignedPermissions
              ?.filter(
                (e) =>
                  e.permission?.feature?.name !== "Account" &&
                  e.permission?.feature?.name !== "Reliquat Calculation V2"
              )
              ?.map(
                (permission: IRolePermissionData) =>
                  permission.permission?.feature?.name
              )
          ),
        ]
          .toString()
          .replaceAll(",", ", ");
      },
      option: {
        sort: false,
      },
    },
    {
      header: "Action",
      cell: (props: { id: string; name: string; status: string }) =>
        actionButton(props.id, props.name),
    },
  ];

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        isShowTable={getPermissions(FeaturesNameEnum.Role, PermissionEnum.View)}
        bodyData={roleData.data}
        isButton={getPermissions(FeaturesNameEnum.Role, PermissionEnum.Create)}
        buttonText="Add New Role"
        buttonLink="/admin/role/add"
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.Role}
        dataPerPage={limit}
        setLimit={setLimit}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        currentPage={currentPage}
        totalPage={roleData.totalPage}
        dataCount={roleData.totalCount}
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
          onClickHandler={() => roleDelete(roleId)}
          confirmationText="Are you sure you want to delete this role?"
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
    </>
  );
};

export default RoleList;
