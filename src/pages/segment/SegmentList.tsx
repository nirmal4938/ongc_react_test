import Modal from "@/components/modal/Modal";
import { DeleteIcon } from "@/components/svgIcons";
import Table from "@/components/table/Table";
import { ISegmentData } from "@/interface/segment/segmentInterface";
import {
  currentPageCount,
  currentPageSelector,
} from "@/redux/slices/paginationSlice";
import {
  DeleteSegment,
  GetAllSegment,
  GetSegmentSearchDropdownData,
  UpdateSegmentStatus,
} from "@/services/segmentService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import AddUpdateSegment from "./AddUpdateSegment";
import { useNavigate } from "react-router-dom";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultState,
  FeaturesNameEnum,
  ModuleType,
  PermissionEnum,
} from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  ArchiveButton,
  DeleteButton,
  EditButton,
  ViewButton,
  statusRender,
} from "@/components/CommonComponents";
import { Option } from "@/interface/customSelect/customSelect";

const SegmentList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.Segment ? pageState?.value : {};
  let currentPage = useSelector(currentPageSelector);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  currentPage =
    pageState?.state == DefaultState.Segment
      ? pageStateData?.page ?? 1
      : currentPage;
  const activeClient = useSelector(activeClientSelector);
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSorting] = useState<string>(pageStateData?.sort ?? "");
  const [sortType, setSortingType] = useState<boolean>(
    pageStateData?.sortType ?? true
  );
  const [openModal, setOpenModal] = useState<boolean>(false); // For Add Update Segment Modal
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [segmentId, setSegmentId] = useState<string>("");
  const [segmentData, setSegmentData] = useState<{
    data: ISegmentData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [segmentSearchDropdownData, setSegmentSearchDropdownData] = useState<
    Option[]
  >([]);
  const [tabData, setTabData] = useState<number>(
    pageStateData?.tabData != null && pageStateData?.tabData != undefined
      ? pageStateData?.tabData
      : 1
  );

  useEffect(() => {
    if (segmentData.data.length == 0) {
      dispatch(showLoader());
    }
    dispatch(currentPageCount(1));
    setCurrentPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      activeClient &&
      (currentPage === 1 || currentPageNumber != currentPage)
    ) {
      fetchAllSegment();
    } else {
      dispatch(hideLoader());
    }

    setPageState({
      state: DefaultState.Segment as string,
      value: {
        ...pageStateData,
        page:
          segmentData.totalCount == limit
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
  }, [currentPage, limit, activeClient, sort, sortType, tabData]);

  async function fetchAllSegment(query?: string) {
    let queryString =
      `?limit=${limit}&page=${currentPage}&clientId=${activeClient}&sort=${
        sortType ? "asc" : "desc"
      }&sortBy=${sort}` +
      (tabData === -1 ? `` : `&isActive=${(tabData && "true") || "false"}`);
    const searchParam = pageStateData?.search
      ? `&search=${pageStateData?.search}`
      : ``;
    queryString = query ? queryString + query : queryString + searchParam;
    const dropdownQuery = `?clientId=${activeClient}`;
    setLoader(true);
    const response = await GetAllSegment(queryString);
    const dropdownResponse = await GetSegmentSearchDropdownData(dropdownQuery);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      const tempData = result.data.map(
        (data: {
          contact: {
            email: string;
          };
        }) => {
          return { ...data, contact: data.contact?.email };
        }
      );
      setSegmentData({
        data: tempData,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
    }
    if (dropdownResponse?.data?.responseData) {
      const result = dropdownResponse?.data?.responseData;
      setSegmentSearchDropdownData(result);
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const segmentDelete = async (id: string) => {
    setDeleteLoader(true);
    await DeleteSegment(Number(id));
    const newSegmentList = segmentData?.data;
    newSegmentList.splice(
      newSegmentList.findIndex((a: ISegmentData) => String(a?.id) == id),
      1
    );
    setSegmentData({
      data: newSegmentList,
      totalCount: segmentData.totalCount - 1,
      totalPage: segmentData.totalPage,
    });
    setDeleteLoader(false);
    setOpen(false);
  };

  const columnData = [
    {
      header: "Code",
      name: "code",
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
      header: "Contact",
      name: "contact",
      option: {
        sort: false,
      },
    },
    {
      header: "Cost Centre",
      name: "costCentre",
      option: {
        sort: true,
      },
    },
    {
      header: "Friday Bonus",
      name: "fridayBonus",
      option: {
        sort: true,
      },
      cell: (props: { fridayBonus: number }) => props.fridayBonus,
    },
    {
      header: "Saturday Bonus",
      name: "saturdayBonus",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { saturdayBonus: number }) => props.saturdayBonus,
    },
    {
      header: "Overtime 01 Bonus",
      name: "overtime01Bonus",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { overtime01Bonus: number }) => props.overtime01Bonus,
    },
    {
      header: "Overtime 02 Bonus",
      name: "overtime02Bonus",
      className: "",
      commonClass: "",
      option: {
        sort: true,
      },
      cell: (props: { overtime02Bonus: number }) => props.overtime02Bonus,
    },
    {
      ...(tabData == -1 && {
        header: "Status",
        name: "status",
        className: "",
        commonClass: "",
        cell: (props: { isActive: boolean }) => statusRender(props.isActive),
      }),
    },
    {
      header: "Action",
      cell: (props: {
        id: string;
        slug: string;
        status: string;
        isActive: boolean;
      }) => actionButton(props.id, props.slug, props.isActive),
    },
  ];

  const handleStatusUpdate = async (id: string, isActive: boolean) => {
    const params = {
      isActive: isActive ? "false" : "true",
    };
    const response = await UpdateSegmentStatus(id, params);
    if (response.data.response_type === "success") {
      await fetchAllSegment();
    }
  };

  const actionButton = (id: string, slug: string, isActive: boolean) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.Segment, PermissionEnum.View) && (
          <ViewButton
            onClickHandler={() => {
              navigate(`/setup/segment/view/${slug}`);
            }}
          />
        )}
        {getPermissions(FeaturesNameEnum.Segment, PermissionEnum.Update) && (
          <>
            <EditButton
              onClickHandler={() => {
                setSegmentId(id);
                setOpenModal(true);
              }}
            />
            <ArchiveButton
              onClickHandler={() => handleStatusUpdate(id, isActive)}
              status={isActive}
            />
          </>
        )}
        {getPermissions(FeaturesNameEnum.Segment, PermissionEnum.Delete) && (
          <DeleteButton
            onClickHandler={() => {
              setSegmentId(id);
              setOpen(true);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Table
        tableClass="!min-w-[1280px]"
        headerData={columnData as ITableHeaderProps[]}
        bodyData={segmentData.data}
        isShowTable={getPermissions(
          FeaturesNameEnum.Segment,
          PermissionEnum.View
        )}
        isButton={getPermissions(
          FeaturesNameEnum.Segment,
          PermissionEnum.Create
        )}
        buttonText="Add"
        buttonClick={() => {
          setSegmentId("");
          setOpenModal(true);
        }}
        loader={loader}
        pagination={true}
        paginationModule={DefaultState.Segment}
        dataPerPage={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        totalPage={segmentData.totalPage}
        dataCount={segmentData.totalCount}
        isClientDropdown={false}
        setSorting={setSorting}
        sortType={sortType}
        setSortingType={setSortingType}
        addSubSegment={getPermissions(
          FeaturesNameEnum.SubSegment,
          PermissionEnum.Create
        )}
        isSearch={true}
        paginationApiCb={fetchAllSegment}
        moduleType={ModuleType?.SEGMENTS}
        searchDropdownData={segmentSearchDropdownData}
        isTab={true}
        setTab={setTabData}
        tabValue={tabData}
      />
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          loaderButton={deleteLoader}
          cancelbtnText="No"
          onClickHandler={() => {
            segmentDelete(segmentId);
            setOpen(false);
          }}
          confirmationText="Are you sure you want to delete this segment?"
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateSegment
          id={segmentId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllSegment();
          }}
        />
      )}
    </>
  );
};

export default SegmentList;
