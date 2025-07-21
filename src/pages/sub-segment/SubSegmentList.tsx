import Modal from "@/components/modal/Modal";
import { DeleteIcon, DownTriangleIcon, PlusIcon } from "@/components/svgIcons";
import { ISubSegmentData } from "@/interface/subSegment/subSegmentInterface";
import {
  DeleteSubSegment,
  GetAllSubSegment,
  UpdateSubSegmentStatus,
} from "@/services/subSegmentService";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeSegmentSelector } from "@/redux/slices/segmentSlice";
import AddUpdateSegment from "./AddUpdateSubSegment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePermission } from "@/context/PermissionProvider";
import {
  FeaturesNameEnum,
  PermissionEnum,
  DefaultState,
} from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  ArchiveButton,
  DeleteButton,
  EditButton,
  ViewButton,
  statusRender,
} from "@/components/CommonComponents";
import Button from "@/components/formComponents/button/Button";
import SegmentDropdown from "@/components/dropdown/SegmentDropdown";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import Tab from "@/components/tab/Tab";

const SubSegmentList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPermissions, pageState, setPageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.SubSegment ? pageState?.value : {};
  const propsData = location.state;
  const activeSegment = useSelector(activeSegmentSelector);
  const activeClient = useSelector(activeClientSelector);
  const [openModal, setOpenModal] = useState<boolean>(
    propsData?.isModelOpen ?? false
  ); // For Add Update SubSegment Modal
  const [open, setOpen] = useState(false); // For Delete Modal
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [subSegmentId, setSubSegmentId] = useState<string>("");
  const [subSegmentData, setSubSegmentData] = useState<{
    data: ISubSegmentData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });
  const [subSegmentDataSegmentWise, setSubSegmentDataSegmentWise] = useState<
    {
      id: string;
      name: string;
      data: ISubSegmentData[];
    }[]
  >([]);
  const [activeDownTriangleData, setActiveDownTriangleData] = useState<
    string[]
  >(
    pageStateData?.activeDownTriangleData
      ? pageStateData?.activeDownTriangleData
      : []
  );
  const [tabData, setTabData] = useState<number>(
    pageStateData?.tabData != null && pageStateData?.tabData != undefined
      ? pageStateData?.tabData
      : 1
  );

  const queryString =
    `?clientId=${activeClient}&segmentId=${
      activeSegment ? activeSegment : ""
    }` + (tabData === -1 ? `` : `&isActive=${(tabData && "true") || "false"}`);
  useEffect(() => {
    if (subSegmentData.data.length == 0) {
      dispatch(showLoader());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeClient) {
      fetchAllSubSegment(queryString);
    } else {
      dispatch(hideLoader());
    }

    setPageState({
      state: DefaultState.SubSegment as string,
      value: {
        ...pageStateData,
        activeDownTriangleData: activeSegment,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSegment, activeClient, tabData]);

  async function fetchAllSubSegment(query: string) {
    setLoader(true);
    const response = await GetAllSubSegment(query);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setSubSegmentData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
      await setSegmentWiseSubSegmentData(result.data);
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const setSegmentWiseSubSegmentData = async (data: ISubSegmentData[]) => {
    const segmentList: {
      id: string;
      name: string;
      data: ISubSegmentData[];
    }[] = [];
    for (const empData of data) {
      if (empData?.segment?.id) {
        const sData = {
          id: `${empData?.segment?.id}`,
          name: `${empData.segment.name}`,
          data: [],
        };
        const findIndex = segmentList.findIndex(
          (slist) => slist.id == sData.id
        );
        if (findIndex == -1) segmentList.push({ ...sData, data: [empData] });
        else {
          segmentList[findIndex] = {
            ...segmentList[findIndex],
            data: [...segmentList[findIndex].data, empData],
          };
        }
      }
    }
    setSubSegmentDataSegmentWise(segmentList);
  };

  const subSegmentDelete = async (id: string) => {
    setDeleteLoader(true);
    await DeleteSubSegment(Number(id));
    const newSubSegmentList = subSegmentData?.data ?? [];
    newSubSegmentList.splice(
      newSubSegmentList.findIndex((a: ISubSegmentData) => String(a?.id) == id),
      1
    );
    setSubSegmentData({
      data: newSubSegmentList,
      totalCount: subSegmentData.totalCount - 1,
      totalPage: subSegmentData.totalPage,
    });
    setOpen(false);
    setDeleteLoader(false);
  };

  const handleStatusUpdate = async (id: string, isActive?: boolean) => {
    const params = {
      isActive: isActive ? "false" : "true",
    };
    const response = await UpdateSubSegmentStatus(id, params);
    if (response.data.response_type === "success") {
      await fetchAllSubSegment(queryString);
    }
  };

  const actionButton = (id: string, slug: string, isActive?: boolean) => {
    return (
      <div className="flex items-center gap-1.5">
        {getPermissions(FeaturesNameEnum.SubSegment, PermissionEnum.View) && (
          <ViewButton
            onClickHandler={() => {
              navigate(`/setup/sub-segment/view/${slug}`);
            }}
          />
        )}
        {getPermissions(FeaturesNameEnum.SubSegment, PermissionEnum.Update) && (
          <>
            <EditButton
              onClickHandler={() => {
                setSubSegmentId(id);
                setOpenModal(true);
              }}
            />
            {isActive !== undefined && (
              <ArchiveButton
                onClickHandler={() => handleStatusUpdate(id, isActive)}
                status={isActive}
              />
            )}
          </>
        )}
        {getPermissions(FeaturesNameEnum.SubSegment, PermissionEnum.Delete) && (
          <DeleteButton
            onClickHandler={() => {
              setSubSegmentId(id);
              setOpen(true);
            }}
          />
        )}
      </div>
    );
  };

  const updateActiveDropdownData = (id: string) => {
    const index = activeDownTriangleData.indexOf(id);
    if (index !== -1) {
      activeDownTriangleData.splice(index, 1);
    } else {
      activeDownTriangleData.push(id);
    }
    setActiveDownTriangleData(activeDownTriangleData);
    setPageState({
      state: DefaultState.Employee as string,
      value: {
        ...pageStateData,
        activeDownTriangleData: activeDownTriangleData,
      },
    });
  };

  const DefaultTabList: { name: string; value: number }[] = [
    {
      name: "Active",
      value: 1,
    },
    {
      name: "Archived",
      value: 0,
    },
    {
      name: "All",
      value: -1,
    },
  ];

  const renderRows = () => {
    if (subSegmentDataSegmentWise && subSegmentDataSegmentWise.length > 0) {
      return subSegmentDataSegmentWise.map((data) => {
        if (data?.data?.length) {
          return (
            <React.Fragment key={data.id}>
              <tr>
                <td
                  colSpan={tabData == -1 ? 9 : 8}
                  className="py-3 font-medium text-sm/18px !px-0 cursor-pointer"
                >
                  <div className="flex justify-between pr-5">
                    <span
                      className="flex items-center pl-4"
                      onClick={() => updateActiveDropdownData(data?.id)}
                    >
                      <DownTriangleIcon
                        className={`w-4 h-4 inline-block mr-2 -rotate-90  ${
                          activeDownTriangleData.includes(data.id)
                            ? ""
                            : "rotate-0"
                        } `}
                      />
                      <span className="inline-block font-semibold">
                        {data?.name}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
              {data?.data.map(
                (itemData: ISubSegmentData) =>
                  !activeDownTriangleData.includes(data.id) &&
                  renderFileRow(itemData)
              )}
            </React.Fragment>
          );
        }
      });
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
  const renderFileRow = (itemData: ISubSegmentData) => (
    <tr key={itemData.id}>
      <td className="py-3">{itemData.code}</td>
      <td className="py-3">{itemData.name}</td>
      <td className="py-3">{itemData?.costCentre ?? "-"}</td>
      <td className="py-3">{itemData?.fridayBonus ?? "-"}</td>
      <td className="py-3">{itemData?.saturdayBonus ?? "-"}</td>
      <td className="py-3">{itemData?.overtime01Bonus ?? "-"}</td>
      <td className="py-3">{itemData?.overtime02Bonus ?? "-"}</td>
      {tabData == -1 && (
        <td className="py-3">
          {itemData?.isActive !== undefined && statusRender(itemData?.isActive)}
        </td>
      )}
      <td className="py-3">
        {itemData.id && itemData.slug
          ? actionButton(
              itemData.id.toString(),
              itemData.slug,
              itemData?.isActive
            )
          : "-"}
      </td>
    </tr>
  );
  return (
    <>
      <div className="flex justify-between mb-4 items-start">
        <div className="flex flex-wrap 1600:flex-nowrap gap-4 items-center">
          <SegmentDropdown isAllSegment={true} isActiveSegments={true} />
          <Tab
            selectedTabValue={tabData}
            setTab={setTabData}
            TabList={DefaultTabList}
          />
        </div>
        <div className="flex flex-wrap justify-end 1600:justify-normal items-center 1600:flex-nowrap gap-4">
          {getPermissions(
            FeaturesNameEnum.SubSegment,
            PermissionEnum.Create
          ) && (
            <Link
              to={"#"}
              onClick={() => {
                setSubSegmentId("");
                setOpenModal(true);
              }}
            >
              <Button variant={"primary"} parentClass="" icon={<PlusIcon />}>
                Add
              </Button>
            </Link>
          )}
        </div>
      </div>
      {getPermissions(FeaturesNameEnum.SubSegment, PermissionEnum.View) && (
        <div className="table-wrapper overflow-auto max-h-[calc(100dvh_-_170px)]">
          <table className="w-full !min-w-[1220px]">
            <thead className="sticky top-0 z-10 bg-[#e3d6d6]">
              <tr>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Code
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Name
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Cost Centre
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Friday Bonus
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Saturday Bonus
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Overtime 01 Bonus
                </th>
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Overtime 02 Bonus
                </th>
                {tabData == -1 && (
                  <th className="text-left pb-3 border-b border-solid border-black/5">
                    Status
                  </th>
                )}
                <th className="text-left pb-3 border-b border-solid border-black/5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{!loader && renderRows()}</tbody>
          </table>
        </div>
      )}
      {open && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpen(!open)}
          width="max-w-[475px]"
          icon={<DeleteIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={() => {
            subSegmentDelete(subSegmentId);
            setOpen(false);
          }}
          loaderButton={deleteLoader}
          confirmationText="Are you sure you want to delete this sub segment?"
          title="Delete"
        >
          <div className=""></div>
        </Modal>
      )}
      {openModal && (
        <AddUpdateSegment
          id={subSegmentId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchAllData={() => {
            fetchAllSubSegment(queryString);
          }}
        />
      )}
    </>
  );
};

export default SubSegmentList;
