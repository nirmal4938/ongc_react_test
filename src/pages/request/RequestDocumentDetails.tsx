import {
  CroosIcon,
  CrossIcon,
  RightArrowIcon,
  RightIcon,
} from "@/components/svgIcons";
import {
  IRequestDocumentData,
  IRequestSummaryData,
  Status,
} from "@/interface/requests/RequestDocumentInterface";
import {
  GetRequestDocumentDataById,
  UpdateRequestDocumentStatusById,
} from "@/services/requestService";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Table from "@/components/table/Table";
import { IRequestTypeData } from "@/interface/requestType/requestTypeInterface";
import { GetAllEmployeeFile } from "@/services/employeeFileService";
import { IEmployeeFileData } from "@/interface/employeeFile/employeeFileInterface";
import { GetFolderData } from "@/services/folderService";
import { VITE_APP_API_URL } from "@/config";
import { IFolderData } from "@/interface/folder/folderInterface";
import Button from "@/components/formComponents/button/Button";
import Modal from "@/components/modal/Modal";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { useDispatch } from "react-redux";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";

const RequestDocumentDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPermissions } = usePermission();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false); // For Decline Request Modal
  const [requestId, setRequestId] = useState("");
  const [requestDocumentId] = useState<number[]>([]);
  const [employeeFileDetails, setEmployeeFileDetails] = useState<
    IEmployeeFileData[]
  >([]);
  const [folderData, setFolderData] = useState<IFolderData[]>([]);
  const [requestDocumentData, setRequestDocumentData] =
    useState<IRequestSummaryData>();
  const [checkRequestDocumentData, setCheckRequestDocumentData] = useState<
    number[]
  >([]);
  const [crossRequestDocumentData, setCrossRequestDocumentData] = useState<
    number[]
  >([]);

  useEffect(() => {
    if (id) {
      fetchRequestDataById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  async function fetchRequestDataById(id: string) {
    dispatch(showLoader());
    setLoader(true);
    const response = await GetRequestDocumentDataById(id);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      if (resultData?.employeeId) {
        await getEmployeeFileDetails(resultData?.employeeId);
      }
      setRequestDocumentData(resultData);
    }
    setLoader(false);
    dispatch(hideLoader());
  }

  const fileList = useMemo(() => {
    return folderData?.filter((val: IFolderData) =>
      employeeFileDetails.find(
        (value: IEmployeeFileData) => value.folderId === val.id
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderData]);

  const getEmployeeFileDetails = async (id: number) => {
    dispatch(showLoader());
    const response = await GetAllEmployeeFile(`?employeeId=${id}`);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setEmployeeFileDetails(resultData.data);
      await fetchAllFolder();
    }
    dispatch(hideLoader());
  };

  const updateRequestStatus = async (
    id: string,
    status: string,
    requestDocumentStatus?: string
  ) => {
    const params = {
      status: status,
      ...(status === "COMPLETED" && requestDocumentId
        ? {
            requestDocumentId: requestDocumentId,
            documentStatus: requestDocumentStatus,
          }
        : {}),
    };
    const response = await UpdateRequestDocumentStatusById(id, params);
    if (response?.data?.response_type === "success") {
      await fetchRequestDataById(id);
    }
  };

  const submitDocumentStatus = async () => {
    if (requestDocumentData?.id) {
      checkRequestDocumentData.length &&
        (await UpdateRequestDocumentStatusById(
          requestDocumentData?.id.toString(),
          {
            status: "COMPLETED",
            requestDocumentId: checkRequestDocumentData,
            documentStatus: "ACTIVE",
          }
        ));
      crossRequestDocumentData.length &&
        (await UpdateRequestDocumentStatusById(
          requestDocumentData?.id.toString(),
          {
            status: "COMPLETED",
            requestDocumentId: crossRequestDocumentData,
            documentStatus: "DECLINED",
          }
        ));
      await fetchRequestDataById(requestDocumentData?.id.toString());
    }
  };

  async function fetchAllFolder() {
    const response = await GetFolderData();
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      setFolderData(result);
    }
  }

  const columnData = [
    {
      header: "Document Type",
      name: "documentType",
      cell: (props: { documentTypeData: IRequestTypeData }) =>
        props.documentTypeData?.name,
    },
    {
      header: "Other Info",
      name: "name",
      cell: (props: IRequestDocumentData) => props?.otherInfo,
    },
    {
      header: "Email",
      name: "timesheetName",
      cell: (props: IRequestDocumentData) =>
        props?.completedByUser?.loginUserData?.name,
    },
    {
      header: "Completed Date",
      name: "timesheetName",
      cell: (props: IRequestDocumentData) =>
        props?.completedDate
          ? moment(props?.completedDate).format("DD/MM/YYYY")
          : "",
    },
    {
      ...(requestDocumentData?.status != Status.NEW &&
        requestDocumentData?.status != Status.DECLINED && {
          header: "Completed",
          name: "timesheetName",
          cell: (props: IRequestDocumentData) => (
            // <div className="flex gap-4 justify-end">
            //   {getPermissions(
            //     FeaturesNameEnum.Request,
            //     PermissionEnum.Update
            //   ) && (
            //     <span
            //       className="w-5 h-5 bg-Green/20 text-Green p-0.5 inline-flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer"
            //       onClick={() => {
            //         if (props.id) {
            //           if (checkRequestDocumentData.includes(props.id))
            //             setCheckRequestDocumentData(
            //               checkRequestDocumentData.filter(
            //                 (val) => val != props.id
            //               )
            //             );
            //           else {
            //             setCheckRequestDocumentData([
            //               ...checkRequestDocumentData,
            //               props.id,
            //             ]);
            //             setCrossRequestDocumentData(
            //               crossRequestDocumentData.filter(
            //                 (val) => val != props.id
            //               )
            //             );
            //           }
            //         }
            //       }}
            //     >
            //       <RightIcon className="" />
            //     </span>
            //   )}
            //   {getPermissions(
            //     FeaturesNameEnum.Request,
            //     PermissionEnum.Update
            //   ) && (
            //     <span
            //       className="w-5 h-5 bg-primaryRed/10 text-primaryRed p-0.5 inline-flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer"
            //       onClick={() => {
            //         if (props.id) {
            //           if (crossRequestDocumentData.includes(props.id))
            //             setCrossRequestDocumentData(
            //               crossRequestDocumentData.filter(
            //                 (val) => val != props.id
            //               )
            //             );
            //           else {
            //             setCrossRequestDocumentData([
            //               ...crossRequestDocumentData,
            //               props.id,
            //             ]);
            //             setCheckRequestDocumentData(
            //               checkRequestDocumentData.filter(
            //                 (val) => val != props.id
            //               )
            //             );
            //           }
            //         }
            //       }}
            //     >
            //       <CroosIcon className="" />
            //     </span>
            //   )}
            // </div>
            <div className="flex gap-4 justify-end">
              {props.status ? (
                props.status === "ACTIVE" ? (
                  <span className="w-5 h-5 group relative bg-Green/20 text-Green p-0.5 inline-flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer">
                    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                      Approve
                    </span>
                    <RightIcon className="" />
                  </span>
                ) : (
                  <span className="w-5 h-5 group relative bg-primaryRed/10 text-primaryRed p-0.5 inline-flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer">
                    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                      Reject
                    </span>
                    <CroosIcon className="" />
                  </span>
                )
              ) : (
                getPermissions(
                  FeaturesNameEnum.Request,
                  PermissionEnum.Update
                ) && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          props.id &&
                          checkRequestDocumentData.includes(props.id)
                            ? true
                            : false
                        }
                        onChange={() => {
                          if (props.id) {
                            if (checkRequestDocumentData.includes(props.id))
                              setCheckRequestDocumentData(
                                checkRequestDocumentData.filter(
                                  (val) => val != props.id
                                )
                              );
                            else {
                              setCheckRequestDocumentData([
                                ...checkRequestDocumentData,
                                props.id,
                              ]);
                              setCrossRequestDocumentData(
                                crossRequestDocumentData.filter(
                                  (val) => val != props.id
                                )
                              );
                            }
                          }
                        }}
                        style={{ display: "none" }}
                      />
                      <span
                        className={`inline-block cursor-pointer w-4 h-4 border-2 border-solid border-gray-600 rounded bg-offWhite ${
                          props.id &&
                          checkRequestDocumentData.includes(props.id)
                            ? "bg-primaryRed text-white !border-primaryRed"
                            : ""
                        }`}
                      >
                        {props.id &&
                        checkRequestDocumentData.includes(props.id) ? (
                          <img
                            src="/assets/images/check-white.svg"
                            width={16}
                            height={16}
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          props.id &&
                          crossRequestDocumentData.includes(props.id)
                            ? true
                            : false
                        }
                        onChange={() => {
                          if (props.id) {
                            if (crossRequestDocumentData.includes(props.id))
                              setCrossRequestDocumentData(
                                crossRequestDocumentData.filter(
                                  (val) => val != props.id
                                )
                              );
                            else {
                              setCrossRequestDocumentData([
                                ...crossRequestDocumentData,
                                props.id,
                              ]);
                              setCheckRequestDocumentData(
                                checkRequestDocumentData.filter(
                                  (val) => val != props.id
                                )
                              );
                            }
                          }
                        }}
                        style={{ display: "none" }}
                      />
                      <span
                        className={`inline-block cursor-pointer p-px w-4 h-4 border-2 border-solid border-gray-600 rounded bg-offWhite ${
                          props.id &&
                          crossRequestDocumentData.includes(props.id)
                            ? "bg-primaryRed text-white !border-primaryRed"
                            : ""
                        }`}
                      >
                        {props.id &&
                        crossRequestDocumentData.includes(props.id) ? (
                          <CrossIcon className="w-full h-full" />
                        ) : (
                          ""
                        )}
                      </span>
                    </label>
                  </>
                )
              )}
            </div>
          ),
        }),
    },
  ];
  // for Decline Request
  const handleOpenModal = (id: string) => {
    setRequestId(id);
    setOpen(true);
  };

  return (
    <>
      {loader ? (
        <div className="flex rounded-full items-center justify-center ms-2 bg-inputBorder z-30">
          <div
            className={`spinner-border animate-spin inline-block w-6 h-6 border-[3px] rounded-full border-t-primaryRed border-r-primaryRed border-b-primaryRed border-l-white/0 `}
            role="status"
          ></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center gap-4 card-header pt-4 pb-18px relative rounded-t-10">
            <h5 className="text-xl/6 font-semibold">
              {requestDocumentData?.status}
            </h5>
            <h5 className="text-xl/6 font-semibold ml-auto">
              {moment(requestDocumentData?.createdAt).format(
                "DD/MM/YYYY hh:mm"
              )}
            </h5>
            {(requestDocumentData?.status === "NEW" ||
              requestDocumentData?.status === "STARTED") &&
            getPermissions(FeaturesNameEnum.Request, PermissionEnum.Update) ? (
              <Button
                variant={"primary"}
                onClickHandler={() => {
                  id && handleOpenModal(id);
                }}
              >
                Decline Request
              </Button>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col gap-3 mb-30px">
            <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
              <h4 className="text-base/5 text-black font-semibold">
                {requestDocumentData?.name}
              </h4>
            </div>

            <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
              <ul className="flex flex-wrap">
                <li className="w-1/6">
                  <p className="flex text-sm/18px text-black">
                    <strong>Client:&nbsp;</strong>
                    <span className="font-medium opacity-50">
                      {requestDocumentData?.client?.loginUserData?.name
                        ? requestDocumentData?.client?.loginUserData?.name
                        : "Unknown"}
                    </span>
                  </p>
                </li>
                <li className="w-1/6">
                  <p className="flex text-sm/18px text-black">
                    <strong>Contract Number:&nbsp;</strong>
                    <span className="font-medium opacity-50">
                      {requestDocumentData?.contractNumber}
                    </span>
                  </p>
                </li>
                <li className="w-1/6">
                  <p className="flex text-sm/18px text-black">
                    <strong>Mobile Number:&nbsp;</strong>
                    <span className="font-medium opacity-50">
                      {requestDocumentData?.mobileNumber}
                    </span>
                  </p>
                </li>
                <li className="w-1/6">
                  <p className="flex text-sm/18px text-black">
                    <strong>Segment:&nbsp;</strong>
                    <span className="font-medium opacity-50">
                      {requestDocumentData?.employee?.segment?.name}
                    </span>
                  </p>
                </li>
                <li className="w-1/6">
                  <p className="flex text-sm/18px text-black">
                    <strong>
                      {requestDocumentData?.status === "DECLINED"
                        ? "Declined"
                        : "Reviewed"}{" "}
                      By:&nbsp;
                    </strong>
                    <span className="font-medium opacity-50">
                      {requestDocumentData?.reviewedByUser?.loginUserData?.name}
                    </span>
                  </p>
                </li>
                <li className="w-1/6">
                  <p className="flex text-sm/18px text-black">
                    <strong>
                      {requestDocumentData?.status === "DECLINED"
                        ? "Declined"
                        : "Reviewed"}{" "}
                      Date:&nbsp;
                    </strong>
                    <span className="font-medium opacity-50">
                      {requestDocumentData?.reviewedDate
                        ? moment(requestDocumentData?.reviewedDate).format(
                            "DD/MM/YYYY"
                          )
                        : ""}
                    </span>
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="card-header pt-4 pb-18px relative rounded-t-10 before:absolute before:content-[''] before:max-w-[calc(100%_-_48px)] before:left-0 before:right-0 before:mx-auto before:h-px before:bottom-0 before:bg-black/10">
            <h5 className="text-xl/6 font-semibold">Requested Document</h5>
          </div>
          <Table
            headerData={columnData as ITableHeaderProps[]}
            bodyData={requestDocumentData?.requestDocument}
            tableLastTheadClass="group-last/sort:justify-end"
          />
          {employeeFileDetails?.length && fileList.length ? (
            <div className="flex flex-col gap-3 mb-30px">
              <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                <h4 className="text-base/5 text-black font-semibold">Files</h4>
              </div>
              <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                <table className="small w-full table-fixed table-file">
                  <tbody>
                    {fileList?.map((folderData: IFolderData) => {
                      return (
                        <React.Fragment key={`tr_${folderData.id}`}>
                          <tr>
                            <td
                              colSpan={4}
                              className="py-3 font-medium text-sm/18px"
                            >
                              <span className="flex items-center">
                                <RightArrowIcon className="w-3 h-3 inline-block mr-1" />
                                <span className="inline-block font-semibold">
                                  {folderData.name}
                                </span>
                              </span>
                            </td>
                          </tr>
                          {employeeFileDetails
                            ?.filter((e) => e?.folderId === folderData?.id)
                            ?.map((data: IEmployeeFileData) => (
                              <tr key={data?.id}>
                                <td className="py-3 font-medium text-sm/18px">
                                  <Link
                                    to={`${data && String(VITE_APP_API_URL)}${
                                      data?.fileName
                                    }`}
                                    className="font-semibold underline text-primaryRed underline-offset-4"
                                    target="_blank"
                                  >
                                    {data?.name}
                                  </Link>
                                </td>
                              </tr>
                            ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className={`flex gap-2 justify-end p-2`}>
            {(requestDocumentData?.status === "NEW" ||
              requestDocumentData?.status === "STARTED") &&
            getPermissions(FeaturesNameEnum.Request, PermissionEnum.Update) ? (
              <>
                <Button
                  variant={"primary"}
                  onClickHandler={() => {
                    submitDocumentStatus();
                  }}
                >
                  Save
                </Button>
              </>
            ) : (
              <></>
            )}
            <Button
              variant={"primaryBorder"}
              onClickHandler={() => navigate("/requests")}
            >
              Back
            </Button>
          </div>
        </>
      )}

      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<CrossIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => {
            updateRequestStatus(requestId, "DECLINED");
            setOpen(false);
          }}
          confirmationText="Are you sure you want to decline this request?"
          title="Decline"
        >
          <div className=""></div>
        </Modal>
      )}
    </>
  );
};

export default RequestDocumentDetail;
