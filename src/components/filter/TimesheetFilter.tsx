import SelectComponent from "@/components/formComponents/customSelect/Select";
import { usePermission } from "@/context/PermissionProvider";
import { NewOptions, Option } from "@/interface/customSelect/customSelect";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { currentPageCount } from "@/redux/slices/paginationSlice";
import { hideLoader } from "@/redux/slices/siteLoaderSlice";
import { userSelector } from "@/redux/slices/userSlice";
import { GetDropdownDetails } from "@/services/timesheetService";
import { DefaultRoles } from "@/utils/commonConstants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
interface TimesheetFilterProp {
  setActiveCategoryDropdownProp: (value: {
    type: string;
    id: number | string;
  }) => void;
  startDate?: string | Date | undefined;
  type?: string;
  value?: string;
  setActiveDateDropdownProp: (value: {
    position: number;
    startDate: string | Date;
    endDate: string | Date;
  }) => void;
  activeDateDropdownProp: {
    position: number;
    startDate: string | Date;
    endDate: string | Date;
  };
  activeCategoryDropdownProp: {
    type: string;
    id: number | string;
  };
  setLoader?: (value: boolean) => void;
  module?: string;
}
const TimesheetFilter = ({
  setActiveDateDropdownProp,
  startDate,
  type,
  value,
  setActiveCategoryDropdownProp,
  activeDateDropdownProp,
  activeCategoryDropdownProp,
  setLoader,
  module,
}: TimesheetFilterProp) => {
  const activeClient = useSelector(activeClientSelector);
  const dispatch = useDispatch();
  const { pageState } = usePermission();
  const pageStateData = pageState?.state == module ? pageState?.value : {};
  let categoryState: {
    type: string;
    id: string | number;
  } | null = null;
  if (pageStateData?.type && pageStateData?.id) {
    categoryState = {
      type: pageStateData?.type,
      id: pageStateData?.id,
    };
  }
  const user = useSelector(userSelector);
  const [activeCategory, setActiveCategory] = useState(
    activeCategoryDropdownProp
  );
  const [segmentList, setSegmentList] = useState<NewOptions[]>([]);
  const [dropdownDetails, setDropdownDetails] = useState<{
    segment: Option[];
    subSegment: Option[];
    dateDropDown: Option[];
    categoryOptions: NewOptions[];
    deletedSection: {
      label: string;
      value: { type: string; id: number | string; deletedAt: Date };
    }[];
    newCategoryOptions: NewOptions[];
  }>({
    segment: [],
    subSegment: [],
    dateDropDown: [],
    categoryOptions: [],
    deletedSection: [],
    newCategoryOptions: [],
  });

  useEffect(() => {
    generateTimesheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  useEffect(() => {
    generateTimesheet(activeDateDropdownProp?.startDate ? false : true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDateDropdownProp?.startDate, startDate]);

  useEffect(() => {
    const resp: NewOptions[] = [];
    dropdownDetails.deletedSection.forEach((delData) => {
      if (
        moment(delData.value.deletedAt).isSameOrAfter(
          moment(activeDateDropdownProp.startDate, "DD-MM-YYYY")
        )
      ) {
        resp.push({
          label: `${delData.label} (${delData.value.type})`,
          value: { type: delData.value.type, id: delData.value.id },
        });
      }
    });
    setDropdownDetails({
      ...dropdownDetails,
      newCategoryOptions: resp,
    });

    if (categoryState) {
      setActiveCategoryDropdownProp(categoryState);
      setActiveCategory(categoryState);
    } else if (
      dropdownDetails?.categoryOptions?.length > 0 &&
      !activeCategoryDropdownProp?.id
    ) {
      setActiveCategoryDropdownProp(dropdownDetails?.categoryOptions[0].value);
      setActiveCategory(dropdownDetails?.categoryOptions[0].value);
    }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDateDropdownProp]);

  useEffect(() => {
    if (dropdownDetails) {
      const segmentListOption = [
        ...dropdownDetails.categoryOptions,
        ...dropdownDetails.newCategoryOptions,
      ].sort(function (a, b) {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
      setSegmentList(segmentListOption);
      if (categoryState) {
        setActiveCategory(categoryState);
      }
    }
  }, [dropdownDetails]);

  const generateTimesheet = async (isLoaded = true) => {
    setLoader?.(true);
    await fetchAllDropdownDetails(isLoaded);
    setLoader?.(false);
    dispatch(hideLoader());
  };

  const filterCategoryDetails = (allData: {
    dates: string[];
    segment: {
      name: string;
      id: number;
    }[];
    subSegment: {
      name: string;
      id: number;
      segmentId: number;
      segmentName: string;
    }[];
  }) => {
    const responseArray: NewOptions[] = [];
    if (user?.userClientList?.length == 0 || !user?.userClientList) {
      responseArray.push({
        label: `All Employee`,
        value: { type: "all", id: "" },
      });
    } else {
      responseArray.push({
        label: `All Segment`,
        value: { type: "allSegment", id: "" },
      });
    }

    for (const index in allData?.segment) {
      responseArray.push({
        label: `${allData.segment[index].name}`,
        value: { type: "segment", id: allData.segment[index].id },
      });
    }
    for (const index in allData?.subSegment) {
      if (allData?.subSegment[index].id) {
        responseArray.push({
          label: `${allData?.subSegment[index].segmentName} - ${allData?.subSegment[index].name}`,
          value: { type: "subsegment", id: allData.subSegment[index].id },
        });
      }
    }
    return responseArray;
  };

  const fetchAllDropdownDetails = async (isFetched = true) => {
    if (activeClient && activeClient !== 0 && activeClient !== -1) {
      const response = await GetDropdownDetails(
        activeClient,
        `?${
          activeDateDropdownProp?.startDate
            ? "activeDate=" + activeDateDropdownProp?.startDate + "&"
            : ""
        }isActiveDate=${true}`
      );
      if (response?.data?.responseData) {
        const categoryResponse: NewOptions[] | undefined =
          filterCategoryDetails(response?.data?.responseData);
        const datesDetailsResponse = response?.data?.responseData?.dates?.map(
          (data: string, index: number) => {
            return { label: data, value: index };
          }
        );
        if (categoryState) {
          setActiveCategoryDropdownProp(categoryState);
          setActiveCategory(categoryState);
        } else {
          const foundValue =
            categoryResponse &&
            categoryResponse.length > 0 &&
            categoryResponse.find(
              (dat: { value: { type: string; id: number | string } }) =>
                dat.value.type == type && dat.value.id == value
            )?.value;
          if (foundValue) {
            setActiveCategoryDropdownProp(foundValue);
            setActiveCategory(foundValue);
          } else {
            setActiveCategoryDropdownProp(categoryResponse[0]?.value);
            setActiveCategory(categoryResponse[0]?.value);
          }
        }

        if (isFetched) {
          let currentDateIndex;
          if (!response?.data?.responseData.isEnded) {
            currentDateIndex = datesDetailsResponse?.findIndex((a: Option) => {
              const splitValues = a.label.split(" - ");
              const pageStateDate = startDate ?? pageStateData?.startDate;
              return moment(
                pageStateDate
                  ? pageStateDate
                  : startDate
                  ? startDate
                  : moment().format("DD-MM-YYYY"),
                "DD-MM-YYYY"
              ).isSameOrBefore(moment(splitValues[1], "DD-MM-YYYY"));
            });
          }
          if (currentDateIndex == -1) {
            currentDateIndex = datesDetailsResponse.length - 1;
          }
          const dateRange =
            datesDetailsResponse[currentDateIndex]?.label.split(" - ");
          if (dateRange?.length > 0) {
            setActiveDateDropdownProp({
              position: Number(datesDetailsResponse[currentDateIndex]?.value),
              startDate: dateRange[0],
              endDate: dateRange[1],
            });
          }
        }

        setDropdownDetails({
          segment: response?.data?.responseData?.segment?.map(
            (data: { name: string; id: number }) => ({
              label: data?.name,
              value: data?.id,
            })
          ),
          subSegment: response?.data?.responseData.subSegment.map(
            (data: { name: string; id: number }) => ({
              label: data?.name,
              value: data?.id,
            })
          ),
          deletedSection: response?.data?.responseData?.deletedSection.map(
            (dat: {
              name: string;
              id: number;
              type: string;
              deletedAt: Date;
            }) => ({
              label: dat.name,
              value: { type: dat.type, id: dat.id, deletedAt: dat.deletedAt },
            })
          ),
          dateDropDown: datesDetailsResponse,
          categoryOptions: categoryResponse,
          newCategoryOptions: [],
        });
        return datesDetailsResponse;
      }
    }
  };

  return (
    <>
      <SelectComponent
        options={dropdownDetails.dateDropDown}
        parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
        onChange={(option: Option | Option[]) => {
          if (!Array.isArray(option)) {
            setLoader?.(true);
            const dateRange = option.label.split(" - ");
            setActiveDateDropdownProp({
              position: option?.value as number,
              startDate: dateRange[0],
              endDate: dateRange[1],
            });
            setLoader?.(false);
            dispatch(currentPageCount(1));
          }
        }}
        selectedValue={activeDateDropdownProp.position}
        className="bg-white"
      />
      {user?.roleData.name !== DefaultRoles.Employee && (
        <SelectComponent
          objectOptions={segmentList}
          parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
          // TODO remove ts error
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(option: any) => {
            setLoader?.(true);
            if (!Array.isArray(option)) {
              setActiveCategoryDropdownProp(
                option.value ? option?.value : { id: null, type: null }
              );
              setActiveCategory(
                option.value ? option?.value : { id: null, type: null }
              );
              dispatch(currentPageCount(1));
            }
            setLoader?.(false);
          }}
          selectedValue={
            segmentList.find(
              (value) =>
                value.value?.id == activeCategory.id &&
                value.value?.type == activeCategory.type
            )?.value
          }
          className="bg-white"
        />
      )}
    </>
  );
};

export default TimesheetFilter;
