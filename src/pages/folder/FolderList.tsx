import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IFolderData } from "@/interface/folder/folderInterface";
import AddUpdateFolder from "./AddUpdateFolder";
import {
  DeleteFolder,
  GetAllFolder,
  GetFileCountData,
} from "@/services/folderService";
import { folderTypeIdList } from "@/constants/DropdownConstants";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import { DefaultState, FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { DeleteButton, EditButton } from "@/components/CommonComponents";

const FolderList = () => {
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.Folder ? pageState?.value : {};
  const [limit, setLimit] = useState<number>(10);
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Folder Modal
  const dispatch = useDispatch();
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.Folder
      ? pageStateData?.page ?? 1
      : currentPage;
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [fileCount, setFileCount] = useState(0);
  const [folderData, setfolderData] = useState<{
    data: IFolderData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [folderId, setFolderId] = useState<string>("");
  const queryString = `?limit=${limit}&page=${currentPage}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}`;

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (currentPage === 1 || currentPageNumber != currentPage) &&
      fetchAllFolder(queryString);

    setPageState({
      state: DefaultState.Folder as string,
      value: {
        ...pageStateData,
        page: folderData.totalCount == limit ? 1 : pageStateData?.page ?? 1,
        limit: limit,
        sort: sort,
        sortType: sortType,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, sort, sortType]);

  async function fetchAllFolder(query: string) {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllFolder(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setfolderData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const handleOpenModal = (id: string) => {
    setFolderId(id);
    fetchFileCount(id);
    setOpen(true);
  };

  const folderDelete = async (id: string) => {
    setDeleteLoader(true);
    try {
      const response = await DeleteFolder(Number(id));
      if (response?.data?.response_type === "success") {
        await fetchAllFolder(queryString);
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
    setDeleteLoader(false);
  };

  async function fetchFileCount(id: string) {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetFileCountData(id);

    if (response?.data?.responseData != undefined) {
      const result = response?.data?.responseData;
      setFileCount(result);
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const actionButton = (id: string) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(
          FeaturesNameEnum.ReliquatPayment,
          PermissionEnum.Update
        ) && (
          <EditButton
            onClickHandler={() => {
              setFolderId(id);
              setOpenModal(true);
            }}
          />
        )}
        {getPermissions(FeaturesNameEnum.Folder, PermissionEnum.Delete) && (
          <DeleteButton onClickHandler={() => handleOpenModal(id)} />
        )}
      </div>
    );
  };

  const columnData = [
    {
      header: "Index",
      name: "index",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
    },
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
      header: "Type",
      name: "typeId",
      option: {
        sort: true,
      },
      cell: (props: { typeId: number }) => {
        return folderTypeIdList.find((val) => val.value === props.typeId)
          ?.label;
      },
    },
    {
      header: "Action",
      cell: (props: { id: string; status: string }) => actionButton(props.id),
    },
  ];

  return (
    <>
      <Table
        headerData={columnData as ITableHeaderProps[]}
        bodyData={folderData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.Folder,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.Folder,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setFolderId("");
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.Folder}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={folderData.totalPage}
        dataCount={folderData.totalCount}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
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
          onClickHandler={() => folderDelete(folderId)}
          confirmationText={`Are you sure you want to delete this folder with ${fileCount} files?`}
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateFolder
          id={folderId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllFolder(queryString);
          }}
        />
      )}
    </>
  );
};

export default FolderList;
