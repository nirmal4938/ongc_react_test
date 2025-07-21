import { FormatDate } from "@/helpers/Utils";
import { IViewEmployeeData } from "@/interface/employee/employeeInterface";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { GetExportDataBySlug } from "@/services/employeeService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ViewEmployeeExportDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [employeeDetail, setEmployeeDetail] = useState<IViewEmployeeData>();

  useEffect(() => {
    if (slug) {
      getExportDataBySlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const getExportDataBySlug = async (slug: string) => {
    dispatch(showLoader());
    const response = await GetExportDataBySlug(slug);
    if (response.data.response_type == "success") {
      setEmployeeDetail(response.data.responseData);
    }
    dispatch(hideLoader());
  };

  const cardDetails2Column =
    "grid 1200:grid-cols-2 gap-x-5 1600:gap-x-10 gap-y-3 relative before:hidden 1200:before:block 1200:before:absolute before:content-[''] before:w-px before:h-full before:bg-black/10 before:left-1/2 before:-translate-x-1/2 before:top-0";
  const cardDetailsBody = "py-15px px-5 bg-primaryRed/[0.03] rounded-md";
  const cardDetailsDescTitle = "text-sm/18px text-black font-bold w-1/2";
  const cardDetailsDesc =
    "text-sm/18px text-black font-medium w-1/2 text-left break-words";

  const defaultValue = (value: string | number | undefined | null) =>
    value !== undefined || value !== null ? value : "-";

  const exportedEmployeeDetail = [
    {
      key: "Matricule",
      value: defaultValue(employeeDetail?.employeeNumber),
    },
    {
      key: "Temp No",
      value: defaultValue(employeeDetail?.TempNumber),
    },
    {
      key: "Contract Number",
      value: defaultValue(employeeDetail?.contractNumber),
    },
    {
      key: "Surname",
      value: defaultValue(employeeDetail?.loginUserData?.lastName),
    },
    {
      key: "Forename",
      value: defaultValue(employeeDetail?.loginUserData?.firstName),
    },
    {
      key: "Fonction",
      value: defaultValue(employeeDetail?.fonction),
    },
    {
      key: "Date Of Birth",
      value: employeeDetail?.loginUserData?.birthDate
        ? FormatDate(employeeDetail?.loginUserData?.birthDate)
        : "-",
    },
    {
      key: "Place Of Birth",
      value: employeeDetail?.loginUserData?.placeOfBirth
        ? FormatDate(employeeDetail?.loginUserData?.placeOfBirth)
        : "-",
    },
    {
      key: "Segment",
      value: defaultValue(employeeDetail?.segment?.name),
    },
    {
      key: "Sub-Segment",
      value: defaultValue(employeeDetail?.subSegment?.name),
    },
    {
      key: "Rotation",
      value: defaultValue(employeeDetail?.rotation?.name),
    },
    {
      key: "Monthly Salary",
      value: defaultValue(employeeDetail?.monthlySalary),
    },
    // {
    //   key: "Initial Balance",
    //   value: defaultValue(employeeDetail?.initialBalance),
    // },
    {
      key: "Salaire de Base",
      value: defaultValue(employeeDetail?.baseSalary),
    },
    {
      key: "Travel Allowance",
      value: defaultValue(employeeDetail?.travelAllowance),
    },
    {
      key: "Housing",
      value: defaultValue(employeeDetail?.Housing),
    },
    {
      key: "Daily Cost",
      value: defaultValue(employeeDetail?.dailyCost),
    },
    {
      key: "Start Date",
      value: employeeDetail?.startDate
        ? FormatDate(employeeDetail?.startDate)
        : "-",
    },
    {
      key: "Medical Check Date",
      value: employeeDetail?.medicalCheckDate
        ? FormatDate(employeeDetail?.medicalCheckDate)
        : "-",
    },
    {
      key: "Medical Check Expiry",
      value: employeeDetail?.medicalCheckExpiry
        ? FormatDate(employeeDetail?.medicalCheckExpiry)
        : "-",
    },
    {
      key: "Medical Insurance",
      value: employeeDetail?.medicalInsurance === true ? "True" : "False",
    },
    {
      key: "Address",
      value: defaultValue(employeeDetail?.address),
    },
    {
      key: "N° S.S.",
      value: defaultValue(employeeDetail?.nSS),
    },
    {
      key: "Gender",
      value: defaultValue(employeeDetail?.loginUserData?.gender),
    },
    {
      key: "Termination Date",
      value: employeeDetail?.terminationDate
        ? FormatDate(employeeDetail?.terminationDate)
        : "-",
    },
    {
      key: "Contract End Date",
      value: employeeDetail?.contractEndDate
        ? FormatDate(employeeDetail?.contractEndDate)
        : "-",
    },
    {
      key: "Mobile Number",
      value: defaultValue(employeeDetail?.loginUserData?.phone),
    },
    {
      key: "Email",
      value: defaultValue(employeeDetail?.loginUserData?.email),
    },
    {
      key: "Next Of Kin Mobile",
      value: defaultValue(employeeDetail?.nextOfKinMobile),
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-3 mb-30px">
        <div className={cardDetailsBody}>
          <ul className={cardDetails2Column}>
            {exportedEmployeeDetail.map((e) => (
              <li className="flex justify-between" key={e.key}>
                <span className={cardDetailsDescTitle}>{e.key}</span>
                <span className={cardDetailsDesc}>{e.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ViewEmployeeExportDetail;
