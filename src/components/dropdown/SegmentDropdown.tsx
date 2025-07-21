import { useEffect, useState } from "react";
import SelectComponent from "../formComponents/customSelect/Select";
import { GetSegmentData } from "@/services/segmentService";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { Option } from "@/interface/customSelect/customSelect";
import {
  segmentDataSelector,
  setSegmentData,
  setActiveSegment,
  activeSegmentSelector,
} from "@/redux/slices/segmentSlice";

const SegmentDropdown = ({
  isAllSegment = false,
  isActiveSegments = false,
}: {
  isAllSegment?: boolean;
  isActiveSegments?: boolean;
}) => {
  const segmentDetails = useSelector(segmentDataSelector);
  const activeClient = useSelector(activeClientSelector);
  const activeSegment = useSelector(activeSegmentSelector);
  const dispatch = useDispatch();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    fetchAllDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  useEffect(() => {
    if (segmentDetails) {
      let resp: Option[] = segmentDetails.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      if (isAllSegment) {
        resp = [{ label: "All Segment", value: 0 }, ...resp];
      }
      resp && setOptions(resp);
    }
  }, [segmentDetails]);

  const fetchAllDetails = async () => {
    if (Number(activeClient) > 0) {
      const isActiveSegmentsOnly = isActiveSegments ? "&isActive=true" : "";
      const response = await GetSegmentData(
        `?clientId=${activeClient}${isActiveSegmentsOnly}`
      );
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        if (result?.data?.length > 0) {
          dispatch(setSegmentData(result?.data));
          dispatch(setActiveSegment(isAllSegment ? 0 : result?.data[0].id));
        }
      }
    }
  };

  return (
    <>
      <SelectComponent
        options={options}
        parentClass="w-[340px]"
        onChange={(option: Option | Option[]) => {
          dispatch(setActiveSegment((option as Option).value));
        }}
        selectedValue={activeSegment}
        className="bg-white"
      />
    </>
  );
};

export default SegmentDropdown;
