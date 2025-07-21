import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { GetSegmentDataBySlug } from "@/services/segmentService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ViewSegmentDetail = () => {
  const cardDetails2Column =
    "grid grid-cols-2 gap-x-5 1600:gap-x-10 gap-y-3 relative before:absolute before:content-[''] before:w-px before:h-full before:bg-black/10 before:left-1/2 before:-translate-x-1/2 before:top-0";
  const cardDetailsBody = "py-15px px-5 bg-primaryRed/[0.03] rounded-md";
  const cardDetailsHeader =
    "py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between";
  const cardDetailsTitle = "text-base/5 text-black font-semibold";
  const cardDetailsDescTitle = "text-sm/18px text-black font-bold w-1/2";
  const cardDetailsDesc = "text-sm/18px text-black font-medium w-1/2 text-left break-words";
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [segmentDetail, setSegmentDetail] = useState<{
    clientId: number;
    code: string;
    contact: { email: string; name: string };
    contactId: number;
    costCentre: string;
    fridayBonus: number;
    id: number;
    name: string;
    overtime01Bonus: number;
    overtime02Bonus: number;
    saturdayBonus: number;
    slug: string;
    vatRate: number;
    xeroFormat: number;
  }>();

  useEffect(() => {
    if (slug) {
      getSegmentDataBySlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const getSegmentDataBySlug = async (slug: string) => {
    dispatch(showLoader());
    const response = await GetSegmentDataBySlug(slug);
    if (response.data.response_type == "success") {
      setSegmentDetail(response.data.responseData);
    }
    dispatch(hideLoader());
  };

  const informationData = [
    {
      key: "Name",
      value: segmentDetail?.name ?? "-",
    },
    {
      key: "Code",
      value: segmentDetail?.code ?? "-",
    },
    {
      key: "Contact",
      value: segmentDetail?.contact?.name ?? "-",
    },
    {
      key: "Cost Centre",
      value: segmentDetail?.costCentre ?? "-",
    },
  ];
  const weekendAndOvertimeBonusesData = [
    {
      key: "Friday Bonus",
      value: segmentDetail?.fridayBonus ?? "-",
    },
    {
      key: "Saturday Bonus",
      value: segmentDetail?.saturdayBonus ?? "-",
    },
    {
      key: "Overtime O1 Bonus",
      value: segmentDetail?.overtime01Bonus ?? "-",
    },
    {
      key: "Overtime O2 Bonus",
      value: segmentDetail?.overtime02Bonus ?? "-",
    },
  ];
  const accountsData = [
    {
      key: "VAT Rate",
      value: segmentDetail?.vatRate ?? "-",
    },
    {
      key: "Xero Format",
      value:
        segmentDetail?.xeroFormat === 1
          ? "Invoice By Employee"
          : "Invoice By Segment",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 1200:grid-cols-2 gap-5">
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
        <div className="flex flex-col gap-3 mb-30px">
          <div className={cardDetailsHeader}>
            <h4 className={cardDetailsTitle}>Accounts</h4>
          </div>
          <div className={cardDetailsBody}>
            <ul className={cardDetails2Column}>
              {accountsData.map((e) => (
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

export default ViewSegmentDetail;
