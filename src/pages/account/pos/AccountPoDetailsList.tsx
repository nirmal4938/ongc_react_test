import {
  AccountTable,
  IAccountTableHeaderProps,
} from "@/components/table/AccountTable";
import { usePermission } from "@/context/PermissionProvider";
import { IAccountPODetails } from "@/interface/account/pos/accoutPODetails";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  GetAllAccountPODetails,
  GetAllSegmentData,
  // UpdatePaymentStatus,
} from "@/services/accountPOService";
import {
  AccountPO,
  FeaturesNameEnum,
  PermissionEnum,
  // FeaturesNameEnum,
  // PermissionEnum,
} from "@/utils/commonConstants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
const AccountPODetailsList = () => {
  const { getPermissions } = usePermission();
  const columnData = [
    {
      header: "Marticule",
      name: "marticule",
    },
    {
      header: "PO Number",
      name: "poNumber",
    },
    {
      header: "Surname",
      name: "surname",
    },
    {
      header: "Forename",
      name: "forename",
    },
    {
      header: "Manager",
      name: "manager",
    },
    {
      header: "Position",
      name: "position",
    },
    {
      header: "Catalogue Number",
      name: "catalogueNumber",
    },
    {
      header: "Segment",
      name: "segment",
    },
    {
      header: "SubSegment",
      name: "segment",
    },
    {
      header: "Type",
      name: "type",
    },
    {
      header: "Daily Rate",
      name: "dailyRate",
    },
    {
      header: "Timesheet Qty.",
      name: "timesheetQty",
    },
    {
      header: "Sub Total",
      name: "subTotal",
    },
    // {
    //   header: "Medical Cost",
    //   name: "medicalTotal",
    // },
    // {
    //   header: "Final Total",
    //   name: "finalTotal",
    // },
  ];

  // const { getPermissions } = usePermission();
  // if (getPermissions(FeaturesNameEnum.Salary, PermissionEnum.View)) {
  //   columnData.push({
  //     header: "Invoice",
  //     name: "invoice",
  //   });
  // }
  const dispatch = useDispatch();
  const [loader] = useState<boolean>(false);
  const location = useLocation();
  const [query, setQuery] = useState<{
    startDate?: string | Date;
    endDate?: string | Date;
    segment?: string;
    subSegment?: string;
  }>();
  const activeClient = useSelector(activeClientSelector);
  const [segmentsData, setSegmentsData] = useState<
    {
      segmentId: number | null;
      subSegmentId: number | null;
      segmentData: {
        id: number;
        name: string;
        code: string;
      } | null;
      subSegmentData: {
        id: number;
        name: string;
        code: string;
      } | null;
    }[]
  >();
  const [accountPODetails, setAccountPODetails] =
    useState<IAccountPODetails[]>();
  // const [accountPODetails, setAccountPODetails] = useState<IAccountPODetails>({
  //   accountPODetails: [],
  //   managerNames: [],
  // });
  const [checked, setChecked] = useState<number[]>([]);
  // const [btnLoader, setBtnLoader] = useState<boolean>(false);

  useEffect(() => {
    fetchSegmentAndSubSegment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (query) {
      fetchAllSegments();
      fetchAllAccountPODetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchSegmentAndSubSegment = async () => {
    dispatch(showLoader());
    const queryParameters = new URLSearchParams(location.search);
    const segment = queryParameters.get("segment");
    const subSegment = queryParameters.get("subSegment");
    const startDate = queryParameters.get("startDate");
    const endDate = queryParameters.get("endDate");
    setQuery({
      startDate: startDate ?? "",
      endDate: endDate ?? "",
      segment: encodeURIComponent(segment ?? ""),
      subSegment: subSegment ?? "",
    });
    dispatch(hideLoader());
  };

  async function fetchAllSegments() {
    dispatch(showLoader());
    let queryString = `?clientId=${activeClient}`;
    queryString = query
      ? queryString +
        `&startDate=${query?.startDate}&endDate=${query?.endDate}&segment=${query?.segment}&subSegment=${query?.subSegment}`
      : queryString;
    const response = await GetAllSegmentData(queryString);
    if (response?.data?.responseData) {
      setSegmentsData(response?.data?.responseData);
    }
    dispatch(hideLoader());
  }

  // ********************************Data with Hourly Overtime Bonus******************************

  const fetchAllAccountPODetails = async () => {
    dispatch(showLoader());
    const queryString = `?startDate=${query?.startDate}&endDate=${query?.endDate}&segment=${query?.segment}&subSegment=${query?.subSegment}`;
    const response = await GetAllAccountPODetails(activeClient, queryString);
    if (response?.data?.responseData) {
      setAccountPODetails(response?.data?.responseData);
    }
    dispatch(hideLoader());
  };

  // *********************************************************************************************

  // const fetchAllAccountPODetails = async () => {
  //   dispatch(showLoader());
  //   const queryString = `?startDate=${query?.startDate}&endDate=${query?.endDate}&segment=${query?.segment}&subSegment=${query?.subSegment}`;
  //   const response = await GetAllAccountPODetails(activeClient, queryString);
  //   if (response?.data?.responseData) {
  //     const responseData =
  //       response?.data?.responseData?.accountPODetails?.filter(
  //         (data: IAccountPODetailOnly) =>
  //           !hourlyOvertimeBonus.includes(data.type)
  //       );
  //     setAccountPODetails({
  //       ...response?.data?.responseData,
  //       accountPODetails: responseData,
  //     });
  //   }
  //   dispatch(hideLoader());
  // };

  const setAccountPOData = () => {
    if (segmentsData && accountPODetails) {
      // const response = { segmentsData, ...accountPODetails };
      const response = { segmentsData, accountPODetails };
      return response;
    }
  };

  // const getInvoice = (checked: number[]) => {
  //   if (checked.length > 0) {
  //     return (
  //       <Button
  //         onClickHandler={async () => {
  //           setBtnLoader(true);
  //           const responseData = await UpdatePaymentStatus({
  //             ids: [...checked],
  //             clientId: activeClient,
  //           });
  //           setBtnLoader(false);
  //           if (responseData?.data?.response_type === "success") {
  //             const updatedResponse = accountPODetails?.accountPODetails?.map(
  //               (data: IAccountPODetailOnly) => {
  //                 if (checked.includes(data?.id)) {
  //                   const updateVariable = { ...data };
  //                   updateVariable.isPaid = true;
  //                   return updateVariable;
  //                 } else {
  //                   return data;
  //                 }
  //               }
  //             );

  //             setAccountPODetails({
  //               ...accountPODetails,
  //               accountPODetails: updatedResponse,
  //             });
  //             setChecked([]);
  //           }
  //         }}
  //         parentClass=""
  //         variant={"primary"}
  //         loader={btnLoader}
  //       >
  //         Get Invoice
  //       </Button>
  //     );
  //   }
  // };

  return (
    <>
      {/* {getPermissions(FeaturesNameEnum.Salary, PermissionEnum.View) && (
        <div>
          <div className="flex justify-end overflow-auto">
            <div className="flex flex-wrap 1400:flex-nowrap gap-4 items-center">
              {getInvoice(checked)}
            </div>
          </div>
        </div>
      )} */}
      <div className="table-wrapper overflow-auto">
        <AccountTable
          headerData={columnData as IAccountTableHeaderProps[]}
          bodyData={setAccountPOData()}
          loader={loader}
          type={AccountPO.INNER}
          checked={checked}
          setChecked={setChecked}
          isExport={getPermissions(
            FeaturesNameEnum.AccountPO,
            PermissionEnum.View
          )}
        ></AccountTable>
      </div>
    </>
  );
};

export default AccountPODetailsList;
