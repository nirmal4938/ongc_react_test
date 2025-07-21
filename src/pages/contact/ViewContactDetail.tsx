import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { GetContactDataBySlug } from "@/services/contactService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ViewContactDetail = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [contactDetail, setContactDetail] = useState<{
    address1: string;
    address2: null | string;
    address3: null | string;
    address4: null | string;
    brandingTheme: string;
    city: string;
    clientId: number;
    country: string;
    dueDateDays: number;
    email: string;
    id: number;
    name: string;
    postalCode: string;
    region: string;
    slug: string;
  }>();

  useEffect(() => {
    if (slug) {
      getContactDataBySlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const getContactDataBySlug = async (slug: string) => {
    dispatch(showLoader());
    const response = await GetContactDataBySlug(slug);
    if (response.data.response_type == "success") {
      setContactDetail(response.data.responseData);
    }
    dispatch(hideLoader());
  };

  const cardDetails2Column =
    "grid grid-cols-2 gap-x-5 1600:gap-x-10 gap-y-3 relative before:absolute before:content-[''] before:w-px before:h-full before:bg-black/10 before:left-1/2 before:-translate-x-1/2 before:top-0";
  const cardDetailsBody = "py-15px px-5 bg-primaryRed/[0.03] rounded-md";
  const cardDetailsHeader =
    "py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between";
  const cardDetailsTitle = "text-base/5 text-black font-semibold";
  const cardDetailsDescTitle = "text-sm/18px text-black font-bold w-1/2";
  const cardDetailsDesc = "text-sm/18px text-black font-medium w-1/2 text-left break-words";

  const overViewData = [
    {
      key: "Name",
      value: contactDetail?.name ?? "-",
    },
    {
      key: "Email",
      value: contactDetail?.email ?? "-",
    },
    {
      key: "Address Line 1",
      value: contactDetail?.address1 ?? "-",
    },
    {
      key: "Address Line 2",
      value: contactDetail?.address2 ?? "-",
    },
    {
      key: "Address Line 3",
      value: contactDetail?.address3 ?? "-",
    },
    {
      key: "Address Line 4",
      value: contactDetail?.address4 ?? "-",
    },
    {
      key: "City",
      value: contactDetail?.city ?? "-",
    },
    {
      key: "Region",
      value: contactDetail?.region ?? "-",
    },
    {
      key: "Postal Code",
      value: contactDetail?.postalCode ?? "-",
    },
    {
      key: "Country",
      value: contactDetail?.country ?? "-",
    },
  ];

  const xeroData = [
    {
      key: "Due Date Days",
      value: contactDetail?.dueDateDays ?? "-",
    },
    {
      key: "Branding Theme",
      value: contactDetail?.brandingTheme ?? "-",
    },
  ];
  return (
    <div>
      <div className="flex flex-col gap-3 mb-30px">
        <div className={cardDetailsHeader}>
          <h4 className={cardDetailsTitle}>Overview</h4>
        </div>
        <div className={cardDetailsBody}>
          <ul className={cardDetails2Column}>
            {overViewData.map((e) => (
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
          <h4 className={cardDetailsTitle}>Xero</h4>
        </div>
        <div className={cardDetailsBody}>
          <ul className={cardDetails2Column}>
            {xeroData.map((e) => (
              <li className="flex justify-between" key={e.key}>
                <span className={cardDetailsDescTitle}>{e.key}</span>
                <span className={cardDetailsDesc}>{e.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewContactDetail;
