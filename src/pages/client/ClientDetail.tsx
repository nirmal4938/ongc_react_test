import { VITE_APP_API_URL } from "@/config";
import { FormatDate, setDefaultWithDash } from "@/helpers/Utils";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { GetClientDataBySlug } from "@/services/clientService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ClientDetail = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [clientDetail, setClientDetail] = useState<{
    approvalEmail: null | string;
    autoUpdateEndDate: number;
    bonusType: null | number;
    code: string;
    country: string;
    endDate: string;
    id: number;
    isActive: boolean;
    isResetBalance: boolean;
    isShowBalance: boolean;
    isShowCarteChifa: boolean;
    isShowCatalogueNo: boolean;
    isShowCostCenter: boolean;
    isShowNSS: boolean;
    isShowPrices: boolean;
    isShowRotation: boolean;
    isShowSalaryInfo: boolean;
    loginUserData: { email: string; name: string };
    loginUserId: number;
    logo: null | string;
    medicalEmailMonthly: string;
    medicalEmailSubmission: string;
    medicalEmailToday: string;
    segment: null | string;
    slug: string;
    startDate: string;
    startMonthBack: number;
    subSegment: null | string;
    timeSheetStartDay: number;
    titreDeConge: null | string;
  }>();

  useEffect(() => {
    if (slug) {
      getClientDataBySlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const getClientDataBySlug = async (slug: string) => {
    dispatch(showLoader());
    const response = await GetClientDataBySlug(slug);
    if (response.data.response_type == "success") {
      setClientDetail(response.data.responseData);
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
  const cardDetailsDesc =
    "text-sm/18px text-black font-medium w-1/2 text-left break-words";

  const formatNullableDate = (date: string | undefined) =>
    date ? FormatDate(date) : "-";

  const formatBoolean = (value: boolean | undefined) =>
    value ? "True" : "False";

  const overViewSection = {
    heading: "Overview",
    data: [
      {
        key: "Name",
        value: setDefaultWithDash(clientDetail?.loginUserData.name),
      },
      {
        key: "Email",
        value: setDefaultWithDash(clientDetail?.loginUserData.email),
      },
      {
        key: "Country",
        value: setDefaultWithDash(clientDetail?.country),
      },
      {
        key: "Code",
        value: setDefaultWithDash(clientDetail?.code),
      },
      {
        key: "Active",
        value: formatBoolean(clientDetail?.isActive),
      },
    ],
  };

  const detailLeftSection = [
    {
      heading: "Timesheet Configuration of Client",
      data: [
        {
          key: "Start Date",
          value: formatNullableDate(clientDetail?.startDate),
        },
        {
          key: "End Date",
          value: formatNullableDate(clientDetail?.endDate),
        },
        {
          key: "Auto Update End Date",
          value: setDefaultWithDash(clientDetail?.autoUpdateEndDate),
        },
        {
          key: "Timesheet Start Day",
          value: clientDetail?.timeSheetStartDay ?? "-",
        },
        {
          key: "Approval Email",
          value: clientDetail?.approvalEmail?.replaceAll(",", "\t,\t") ?? "-",
        },
        {
          key: "Show Prices",
          value: formatBoolean(clientDetail?.isShowPrices),
        },
        {
          key: "Show Cost Centre",
          value: formatBoolean(clientDetail?.isShowCostCenter),
        },
        {
          key: "Show Catalogue No",
          value: formatBoolean(clientDetail?.isShowCatalogueNo),
        },
      ],
    },
    {
      heading: "Employee Configuration of Client",
      data: [
        {
          key: "N° S.S.",
          value: formatBoolean(clientDetail?.isShowNSS),
        },
        {
          key: "Carte Chifa",
          value: formatBoolean(clientDetail?.isShowCarteChifa),
        },
        {
          key: "Salary Info (Applies to Timesheet Preparation & Approval users)",
          value: formatBoolean(clientDetail?.isShowSalaryInfo),
        },
        {
          key: "Rotation",
          value: formatBoolean(clientDetail?.isShowRotation),
        },
        {
          key: "Balance",
          value: formatBoolean(clientDetail?.isShowBalance),
        },
      ],
    },
  ];

  const detailRightSection = [
    {
      heading: "Labels",
      data: [
        {
          key: "Segment,",
          value: setDefaultWithDash(clientDetail?.segment),
        },
        {
          key: "Sub-Segment",
          value: setDefaultWithDash(clientDetail?.subSegment),
        },
        {
          key: "Bonus Type",
          value: setDefaultWithDash(clientDetail?.bonusType),
        },
      ],
    },
    {
      heading: "Titre de Congé Configuration of Client",
      data: [
        {
          key: "Titre de Congé Email",
          value: clientDetail?.titreDeConge?.replaceAll(",", "\t,\t") ?? "-",
        },
        {
          key: "Start Months Back",
          value: clientDetail?.startMonthBack ?? "-",
        },
        {
          key: "Reset Balance for Segment change",
          value: formatBoolean(clientDetail?.isResetBalance),
        },
      ],
    },
    {
      heading: "Medical Email Notification Settings",
      data: [
        {
          key: "Submission",
          value:
            clientDetail?.medicalEmailSubmission !== ""
              ? clientDetail?.medicalEmailSubmission
              : "-",
        },
        {
          key: "Today",
          value:
            clientDetail?.medicalEmailToday !== ""
              ? clientDetail?.medicalEmailToday
              : "-",
        },
        {
          key: "Monthly",
          value:
            clientDetail?.medicalEmailMonthly !== ""
              ? clientDetail?.medicalEmailMonthly
              : "-",
        },
      ],
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 1200:grid-cols-2 gap-5">
        <div className="">
          {overViewSection && (
            <div className="flex flex-col gap-3 mb-30px">
              <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                <h4 className="text-base/5 text-black font-semibold">
                  Overview
                </h4>
              </div>
              <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                <div className="flex flex-wrap">
                  <div className="w-[150px] h-[150px] mx-auto">
                    <img
                      src={
                        clientDetail?.logo
                          ? String(VITE_APP_API_URL + clientDetail?.logo)
                          : "/assets/images/user.jpg"
                      }
                      width={150}
                      height={150}
                      className="rounded-10 w-full h-full object-contain"
                      alt=""
                    />
                  </div>
                  <div className="max-w-full 768:max-w-[calc(100%_-_150px)] w-full md:pl-4">
                    <ul
                      className={`${cardDetails2Column} !grid-cols-1 before:!hidden`}
                    >
                      {overViewSection?.data?.map((e) => (
                        <li className="flex justify-between" key={e.key}>
                          <span
                            className={`${cardDetailsDescTitle} max-w-[100px] !w-full `}
                          >
                            {e.key}
                          </span>
                          <span
                            className={`${cardDetailsDesc}  max-w-[calc(100%_-_100px)] !w-full`}
                          >
                            {e.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          {detailLeftSection?.map((section) => {
            return (
              <div
                className="flex flex-col gap-3 mb-30px"
                key={section.heading}
              >
                <div className={cardDetailsHeader}>
                  <h4 className={cardDetailsTitle}>{section.heading}</h4>
                </div>
                <div className={cardDetailsBody}>
                  <ul className={cardDetails2Column}>
                    {section?.data?.map((e) => (
                      <li className="flex justify-between" key={e.key}>
                        <span className={cardDetailsDescTitle}>{e.key}</span>
                        <span className={cardDetailsDesc}>{e.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <div className="">
          {detailRightSection?.map((section) => (
            <div className="flex flex-col gap-3 mb-30px" key={section.heading}>
              <div className={cardDetailsHeader}>
                <h4 className={cardDetailsTitle}>{section.heading}</h4>
              </div>
              <div className={cardDetailsBody}>
                <ul className={cardDetails2Column}>
                  {section?.data?.map((e) => (
                    <li className="flex justify-between" key={e.key}>
                      <span className={cardDetailsDescTitle}>{e.key}</span>
                      <span className={cardDetailsDesc}>{e.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientDetail;
