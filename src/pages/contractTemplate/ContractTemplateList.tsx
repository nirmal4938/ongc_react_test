import Table from "@/components/table/Table";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IContractTemplateData } from "@/interface/contractTemplate/contractTemplate";
import { GetAllContractTemplate } from "@/services/contractTemplateService";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import {
  DefaultState,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";

const ContractTemplateList = () => {
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.ContractTemplate ? pageState?.value : {};
  const clientId = useSelector(activeClientSelector);
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.ContractTemplate
      ? pageStateData?.page ?? 1
      : currentPage;
  const [limit, setLimit] = useState<number>(10);
  // const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Client Modal
  // const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  // const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  // const [tabData, setTabData] = useState<number>(
  //   pageStateData?.tabData != null && pageStateData?.tabData != undefined
  //     ? pageStateData?.tabData
  //     : 1
  // );
  const tabData = 1;
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  // const [contractTemplateId, setContractTemplateId] = useState<string>("");
  const [contractTemplateDataPage, setContractTemplateDataPage] = useState<{
    data: IContractTemplateData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  const queryString =
    `?limit=${limit}&page=${currentPage}&sort=${
      sortType ? "asc" : "desc"
    }&sortBy=${sort}` +
    (clientId != 0 && clientId != -1 ? `&clientId=${clientId}` : ``) +
    `&isActive=${(tabData && "true") || "false"}`;
  // (tabData === -1 ? `` : `&isActive=${(tabData && "true") || "false"}`);

  // const actionButton = (
  //   id: string,
  //   status: boolean,
  //   clientId: number | null
  // ) => {
  //   return (
  //     <div className="flex items-center gap-1.5 justify-end">
  //       {getPermissions(
  //         FeaturesNameEnum.ContractTemplate,
  //         PermissionEnum.Update
  //       ) &&
  //         clientId != null && (
  //           <>
  //             {/* <EditButton
  //               onClickHandler={() => {
  //                 setContractTemplateId(id);
  //                 setOpenModal(true);
  //               }}
  //             /> */}
  //             <ArchiveButton
  //               onClickHandler={() => handleStatusUpdate(id, status)}
  //               status={status}
  //             />
  //           </>
  //         )}
  //       {getPermissions(
  //         FeaturesNameEnum.ContractTemplate,
  //         PermissionEnum.Delete
  //       ) &&
  //         clientId != null && (
  //           <DeleteButton onClickHandler={() => handleOpenModal(id)} />
  //         )}
  //     </div>
  //   );
  // };
  const columnData = [
    {
      header: "Name",
      name: "contractName",
      className: "!justify-start",
      commonClass: "",
      option: {
        sort: true,
      },
    },
    // {
    //   ...(tabData === -1 && {
    //     header: "Status",
    //     name: "status",
    //     className: "",
    //     commonClass: "",
    //     cell: (props: { isActive: boolean }) => statusRender(props.isActive),
    //   }),
    // },
    // {
    //   header: "Action",
    //   cell: (props: { id: string; isActive: boolean; clientId: number }) =>
    //     actionButton(props.id, props.isActive, props.clientId),
    // },
  ];

  const fetchAllContractTemplate = async (query: string) => {
    setLoader(true);
    const response = await GetAllContractTemplate(query);

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setContractTemplateDataPage({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    setLoader(false);
  };

  // const handleOpenModal = (id: string) => {
  //   setContractTemplateId(id);
  //   setOpen(true);
  // };

  // const contractTemplateDelete = async (id: string) => {
  //   setDeleteLoader(true);
  //   const response = await DeleteContractTemplate(Number(id));
  //   if (response?.data?.response_type === "success") {
  //     await fetchAllContractTemplate(queryString);
  //   }
  //   setDeleteLoader(false);
  //   setOpen(false);
  // };

  // const handleStatusUpdate = async (id: string, isActive: boolean) => {
  //   const params = {
  //     isActive: isActive ? "false" : "true",
  //   };
  //   const response = await UpdateContractTemplateStatus(id, params);
  //   if (response.data.response_type === "success") {
  //     fetchAllContractTemplate(queryString);
  //   }
  // };

  useEffect(() => {
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabData]);

  useEffect(() => {
    if (clientId && (currentPage === 1 || currentPageNumber != currentPage)) {
      fetchAllContractTemplate(queryString);
    }

    setPageState({
      state: DefaultState.ContractTemplate as string,
      value: {
        ...pageStateData,
        page:
          contractTemplateDataPage.totalCount == limit
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
  }, [currentPage, limit, clientId, tabData, sort, sortType]);

  return (
    <>
      <Table
        headerData={columnData as ITableHeaderProps[]}
        bodyData={contractTemplateDataPage.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.ContractTemplate,
          PermissionEnum.View
        )}
        // isButton={getPermissions(
        //   FeaturesNameEnum.ContractTemplate,
        //   PermissionEnum.Create
        // )}
        // buttonText="Add"
        // buttonClick={() => {
        //   setContractTemplateId("");
        //   setOpenModal(true);
        // }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.ContractTemplate}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={contractTemplateDataPage.totalPage}
        dataCount={contractTemplateDataPage.totalCount}
        // isTab={true}
        // setTab={setTabData}
        // tabValue={tabData}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        tableLastTheadClass="group-last/sort:justify-end"
      />
      {/* {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => contractTemplateDelete(contractTemplateId)}
          confirmationText="Are you sure you want to delete this contract template?"
          title="Delete"
          loaderButton={deleteLoader}
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateContractTemplate
          id={contractTemplateId}
          clientId={Number(clientId)}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllContractTemplate(queryString);
          }}
        />
      )} */}
    </>
  );
};

export default ContractTemplateList;
