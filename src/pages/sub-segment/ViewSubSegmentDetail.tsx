import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { GetSubSegmentDataBySlug } from "@/services/subSegmentService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ViewSubSegmentDetail = () => {
  const dispatch = useDispatch();
  const cardDetails2Column =
    "grid grid-cols-2 gap-x-5 1600:gap-x-10 gap-y-3 relative before:absolute before:content-[''] before:w-px before:h-full before:bg-black/10 before:left-1/2 before:-translate-x-1/2 before:top-0";
  const cardDetailsBody = "py-15px px-5 bg-primaryRed/[0.03] rounded-md";
  const cardDetailsHeader =
    "py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between";
  const cardDetailsTitle = "text-base/5 text-black font-semibold";
  const cardDetailsDescTitle = "text-sm/18px text-black font-bold w-1/2";
  const cardDetailsDesc = "text-sm/18px text-black font-medium w-1/2 text-left break-words";

  const { slug } = useParams();
  const [subSegmentDetail, setSubSegmentDetail] = useState<{
    code: string;
    costCentre: string;
    fridayBonus: number;
    id: number;
    name: string;
    segmentId: number;
    overtime01Bonus: number;
    overtime02Bonus: number;
    saturdayBonus: number;
    segment: { name: string };
    slug: string;
  }>();

  const segmentData = [
    {
      key: "Segment",
      value: subSegmentDetail?.segment.name ?? "-",
    },
  ];
  const informationData = [
    {
      key: "Name",
      value: subSegmentDetail?.name ?? "-",
    },
    {
      key: "Code",
      value: subSegmentDetail?.code ?? "-",
    },
    {
      key: "Cost Centre",
      value: subSegmentDetail?.costCentre ?? "-",
    },
  ];
  const weekendAndOvertimeBonusesData = [
    {
      key: "Friday Bonus",
      value: subSegmentDetail?.fridayBonus ?? "-",
    },
    {
      key: "Saturday Bonus",
      value: subSegmentDetail?.saturdayBonus ?? "-",
    },
    {
      key: "Overtime O1 Bonus",
      value: subSegmentDetail?.overtime01Bonus ?? "-",
    },
    {
      key: "Overtime O2 Bonus",
      value: subSegmentDetail?.overtime02Bonus ?? "-",
    },
  ];

  useEffect(() => {
    if (slug) {
      getSubSegmentDataBySlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const getSubSegmentDataBySlug = async (slug: string) => {
    dispatch(showLoader());
    const response = await GetSubSegmentDataBySlug(slug);
    if (response.data.response_type == "success") {
      setSubSegmentDetail(response.data.responseData);
    }
    dispatch(hideLoader());
  };

  return (
    <>
      <div className="grid grid-cols-1 1200:grid-cols-2 gap-5">
        <div className="flex flex-col gap-3 mb-30px">
          <div className={cardDetailsHeader}>
            <h4 className={cardDetailsTitle}>Segment</h4>
          </div>
          <div className={cardDetailsBody}>
            <ul className={cardDetails2Column}>
              {segmentData.map((e) => (
                <li className="flex justify-between" key={e.key}>
                  <span className={cardDetailsDescTitle}>{e.key}</span>
                  <span className={cardDetailsDesc}>{e.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-30px">
          <div className={cardDetailsHeader}>
            <h4 className={cardDetailsTitle}>Information</h4>
          </div>
          <div className={cardDetailsBody}>
            <ul className={cardDetails2Column}>
              {informationData.map((e) => (
                <li className="flex justify-between" key={e.key}>
                  <span className={cardDetailsDescTitle}>{e.key}</span>
                  <span className={cardDetailsDesc}>{e.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-30px">
          <div className={cardDetailsHeader}>
            <h4 className={cardDetailsTitle}>Weekend and Overtime Bonuses</h4>
          </div>
          <div className={cardDetailsBody}>
            <ul className={cardDetails2Column}>
              {weekendAndOvertimeBonusesData.map((e) => (
                <li className="flex justify-between" key={e.key}>
                  <span className={cardDetailsDescTitle}>{e.key}</span>
                  <span className={cardDetailsDesc}>{e.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSubSegmentDetail;
