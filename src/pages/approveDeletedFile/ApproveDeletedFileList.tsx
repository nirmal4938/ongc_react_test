import Modal from "@/components/modal/Modal";
import {
  CroosIcon,
  DeleteIcon,
  DownTriangleIcon,
  EditIocn,
  RightIcon,
} from "@/components/svgIcons";

import { currentPageCount } from "@/redux/slices/paginationSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { IApproveDeletedFileData } from "@/interface/approveDeletedFile/approveDeletedFile";
import {
  DeleteApproveDeletedFile,
  GetAllApproveDeletedFile,
  RestoreApproveDeletedFile,
} from "@/services/approveDeletedFileService";
import { GetFolderData } from "@/services/folderService";
import { VITE_APP_API_URL } from "@/config";
import { activeModelProfile } from "@/constants/CommonConstants";
import { IFolderData } from "@/interface/folder/folderInterface";
import SpinLoader from "@/components/SiteLoder/spinLoader";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { usePermission } from "@/context/PermissionProvider";
import {
  FeaturesNameEnum,
  GetFilePermissionLink,
  PermissionEnum,
} from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";

const ApproveDeletedFileList = () => {
  const dispatch = useDispatch();
  const { getPermissions } = usePermission();
  const activeClient = useSelector(activeClientSelector);
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string>();
  const [loader, setLoader] = useState<boolean>(false);
  const [folderData, setFolderData] = useState<
    { name: string; id: number; typeId: number }[]
  >([]);
  const [approveDeletedFileId, setApproveDeletedFileId] = useState<{
    folderId: string;
    id: string;
  }>();
  const [approveDeletedFileDataPage, setApproveDeletedFileDataPage] = useState<{
    data: IApproveDeletedFileData[];
  }>({
    data: [],
  });
  const [activeDropdown, setActiveDropdown] = useState<{
    [key: string]: boolean;
  }>();

  const getProperSize = (bytes: number) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const fetchAllApproveDeletedFile = async (query: string) => {
    setLoader(true);
    dispatch(showLoader());
    const response = await GetAllApproveDeletedFile(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setApproveDeletedFileDataPage({
        data: result.data,
      });
    }
    dispatch(hideLoader());
    setLoader(false);
  };

  const handleOpenModal = (folderId: string, id: string) => {
    setApproveDeletedFileId({ folderId: folderId, id: id });
    setOpen(true);
  };

  const approveDeletedFileDelete = async (
    folderId: string | undefined,
    id: string | undefined
  ) => {
    const response = await DeleteApproveDeletedFile(
      `?imageId=${id}&folderId=${folderId}&clientId=${activeClient}`
    );
    if (response?.data?.response_type === "success") {
      await fetchAllApproveDeletedFile(`?clientId=${activeClient}`);
    }
    setOpen(false);
  };

  const approveDeletedFileRestore = async (
    folderId: string | undefined,
    id: string | undefined
  ) => {
    const response = await RestoreApproveDeletedFile(
      `?imageId=${id}&folderId=${folderId}`,
      {}
    );
    if (response?.data?.response_type === "success") {
      await fetchAllApproveDeletedFile(`?clientId=${activeClient}`);
    }
    setOpen(false);
  };

  async function fetchAllFolder() {
    const response = await GetFolderData();
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      setFolderData(result);
      const toggleFilter = result?.filter(
        (data: IFolderData) => data.typeId !== 1
      );
      const generateToggle: { [key: string]: boolean } = {};
      toggleFilter.forEach((nData: { id: number }) => {
        generateToggle[nData.id] = true;
      });
      setActiveDropdown(generateToggle);
    }
  }
  useEffect(() => {
    dispatch(currentPageCount(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeClient) {
      fetchAllApproveDeletedFile(`?clientId=${activeClient}`);
      fetchAllFolder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  const renderFolderRows = () => {
    if (loader) {
      return (
        <tr>
          <td>
            <div className="relative w-full h-14 flex items-center justify-center">
              <SpinLoader />
            </div>
          </td>
        </tr>
      );
    } else if (folderData && folderData.length > 0) {
      return folderData
        ?.filter((data) => data.typeId !== 1)
        .map((data) => (
          <React.Fragment key={data.id}>
            <tr>
              <td colSpan={8} className="py-3 font-medium text-sm/18px !px-0">
                <span
                  className="flex items-center pl-4"
                  onClick={() => {
                    if (activeDropdown) {
                      const newStatus = { ...activeDropdown };
                      newStatus[data?.id] = !activeDropdown[data?.id];
                      setActiveDropdown(newStatus);
                    }
                  }}
                >
                  <DownTriangleIcon
                    className={`w-4 h-4 inline-block mr-2 -rotate-90  ${
                      activeDropdown && activeDropdown[data?.id]
                        ? "rotate-0"
                        : ""
                    } `}
                  />
                  <span className="inline-block font-semibold">
                    {data?.name}
                  </span>
                </span>
              </td>
            </tr>
            {approveDeletedFileDataPage?.data
              ?.filter((a: { folderId: string }) => +a.folderId === data.id)
              .map(
                (itemData: IApproveDeletedFileData) =>
                  activeDropdown &&
                  activeDropdown[data?.id] &&
                  renderFileRow(itemData)
              )}
          </React.Fragment>
        ));
    } else {
      return (
        <tr>
          <td className="" colSpan={8}>
            <div className="py-4 text-center  rounded-10px border mt-4 border-black/[0.08]">
              <img
                src={`https://cdn-icons-png.flaticon.com/512/7486/7486754.png `}
                className="w-[100px] m-auto mb-4"
                alt=""
              />
              <span className="text-black">No Data Found</span>
            </div>
          </td>
        </tr>
      );
    }
  };

  const renderFileRow = (itemData: IApproveDeletedFileData) => (
    <tr key={itemData.id}>
      <td className="py-3">
        
        <a
          onClick={async () => {
            const file = itemData.fileName
              ? itemData.fileName
              : itemData.documentPath ?? null;
            let link = file && (await GetFilePermissionLink(file));
            if (link) {
              link = `${String(VITE_APP_API_URL)}${link}`;
              window.open(link, "_blank");
            }
          }}
          target="_blank"
          className="whitespace-nowrap block font-medium cursor-pointer underline underline-offset-4 text-primaryRed"
          title={itemData.name ? itemData.name : itemData.documentName ?? "-"}
        >
          {itemData.name ? itemData.name : itemData.documentName ?? "-"}
        </a>
      </td>
      <td className="py-3 font-medium text-sm/18px break-words">
        {itemData.employee?.employeeNumber || "-"}
      </td>
      <td
        className={`py-3 font-medium text-sm/18px break-words ${
          moment(itemData?.employee?.contractEndDate).isBefore(moment())
            ? "!text-red"
            : ""
        }`}
      >
        {itemData.employee?.loginUserData?.lastName || "-"}
      </td>
      <td
        className={`py-3 font-medium text-sm/18px break-words ${
          moment(itemData?.employee?.contractEndDate).isBefore(moment())
            ? "!text-red"
            : ""
        }`}
      >
        {itemData?.employee?.loginUserData?.firstName || "-"}
      </td>
      <td className="py-3  font-medium text-sm/18px break-words">
        {itemData?.deletedAt
          ? moment(itemData?.deletedAt).format("DD/MM/YYYY")
          : "-"}
      </td>
      <td className="py-3  font-medium text-sm/18px">
        {itemData?.updatedByUser?.loginUserData?.email || "-"}
      </td>
      <td className="py-3 font-medium text-sm/18px break-words">
        {getProperSize(
          Number(
            itemData.fileSize ? itemData.fileSize : itemData.documentSize || 0
          )
        )}
      </td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          {getPermissions(
            FeaturesNameEnum.ApproveDeletedFile,
            PermissionEnum.Create
          ) && (
            <span
              className="w-25 h-7 group relative bg-Green/20 text-Green p-0.5 inline-flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer"
              onClick={() => {
                setActiveModal(activeModelProfile.editFile);
                handleOpenModal(itemData.id, itemData.folderId);
              }}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Approve
              </span>
              <RightIcon className="" />
            </span>
          )}
          {getPermissions(
            FeaturesNameEnum.ApproveDeletedFile,
            PermissionEnum.Delete
          ) && (
            <span
              className="w-25 h-7 group relative bg-primaryRed/10 text-primaryRed p-0.5 inline-flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer"
              onClick={() => {
                setActiveModal(activeModelProfile.deleteFiles);
                handleOpenModal(itemData.id, itemData.folderId);
              }}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Reject
              </span>
              <CroosIcon className="" />
            </span>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="main-table">
        <div
          className="table-wrapper overflow-auto relative 
          max-h-[calc(100dvh_-_170px)]"
        >
          <table width={"100%"} className="min-w-[800px] ">
            <thead className="sticky z-10 top-0">
              <tr>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Name
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Marticule
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Surname
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Forename
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Deletion Date
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  User Requesting Deletion
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Size
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{!loader && renderFolderRows()}</tbody>
          </table>

          {activeModal === activeModelProfile.deleteFiles && open && (
            <Modal
              variant={"Confirmation"}
              closeModal={() => setOpen(!open)}
              width="max-w-[475px]"
              icon={<DeleteIcon className="w-full h-full mx-auto" />}
              okbtnText="Yes"
              cancelbtnText="No"
              onClickHandler={() =>
                approveDeletedFileRestore(
                  approveDeletedFileId?.id,
                  approveDeletedFileId?.folderId
                )
              }
              confirmationText="Are you sure you want to restore this approved file?"
              title="Restore"
            >
              <div className=""></div>
            </Modal>
          )}

          {activeModal === activeModelProfile.editFile && open && (
            <Modal
              variant={"Confirmation"}
              closeModal={() => setOpen(!open)}
              width="max-w-[475px]"
              icon={<EditIocn className="w-full h-full mx-auto" />}
              okbtnText="Yes"
              cancelbtnText="No"
              onClickHandler={() =>
                approveDeletedFileDelete(
                  approveDeletedFileId?.id,
                  approveDeletedFileId?.folderId
                )
              }
              confirmationText="Are you sure you want to delete this approved file?"
              title="Delete"
            >
              <div className=""></div>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default ApproveDeletedFileList;
