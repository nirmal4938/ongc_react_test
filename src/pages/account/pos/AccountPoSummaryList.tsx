import SelectComponent from "@/components/formComponents/customSelect/Select";
import {
  AccountTable,
  IAccountTableHeaderProps,
} from "@/components/table/AccountTable";
import { usePermission } from "@/context/PermissionProvider";
import { IAccountPOSummaryData } from "@/interface/account/pos/accountPOSummaryInterface";
import { Option } from "@/interface/customSelect/customSelect";
import {
  accountPODateSelector,
  setActiveAccountPODateDropdown,
} from "@/redux/slices/accountPOSlice";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  GetAllPOSummaryData,
  GetAllSegmentData,
} from "@/services/accountPOService";
import { GetDropdownDetails } from "@/services/timesheetService";
import {
  AccountPO,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AccountPOSummaryList = () => {
  const { getPermissions } = usePermission();
  const columnData = [
    {
      header: "Manager",
      name: "manager",
    },
    // {
    //   header: "Segment",
    //   name: "segment",
    // },
    // {
    //   header: "SubSegment",
    //   name: "subSegment",
    // },
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
      header: "Sub Segment",
      name: "subSegment",
    },
    {
      header: "Type",
      name: "type",
    },
    {
      ...(getPermissions(FeaturesNameEnum.DailyRate, PermissionEnum.View) && {
        header: "Daily Rate",
        name: "dailyRate",
      }),
    },
    {
      header: "Timesheet Qty",
      name: "timesheetQty",
    },
    {
      header: "Sub Total",
      name: "subTotal",
      cell: (props: { subTotal: string }) => {
        return props?.subTotal != null
          ? parseFloat(props.subTotal)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    // {
    //   header: "Medical Cost",
    //   name: "medicalCost",
    // },
    // {
    //   header: "Final Total",
    //   name: "finalTotal",
    // },
  ];
  const dispatch = useDispatch();
  const activeDateDropdown = useSelector(accountPODateSelector);
  const activeClient = useSelector(activeClientSelector);
  const [dropdownDetails, setDropdownDetails] = useState<{
    dateDropDown: Option[];
  }>({
    dateDropDown: [],
  });
  const [segmentsData, setSegmentsData] = useState<
    {
      segmentId: number | null;
      subSegmentId: number | null;
      segmentData: {
        id: number | null;
        name: string | null;
        code: string | null;
      } | null;
      subSegmentData: {
        id: number | null;
        name: string | null;
        code: string | null;
      } | null;
    }[]
  >();
  const [accountPODetails, setAccountPODetails] =
    useState<IAccountPOSummaryData[]>();
  const [loader] = useState<boolean>(false);
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    fetchAllDropdownDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  useEffect(() => {
    if (
      activeClient &&
      activeDateDropdown?.startDate &&
      activeDateDropdown?.endDate
    ) {
      fetchAllSegments(
        (activeDateDropdown?.startDate
          ? `&startDate=${activeDateDropdown?.startDate}`
          : "") +
          (activeDateDropdown?.endDate
            ? `&endDate=${activeDateDropdown?.endDate}`
            : "")
      );
      fetchAllAccountPOSummary(
        (activeDateDropdown?.startDate
          ? `?startDate=${activeDateDropdown?.startDate}`
          : "") +
          (activeDateDropdown?.endDate
            ? `&endDate=${activeDateDropdown?.endDate}`
            : "")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient, activeDateDropdown]);

  const fetchAllDropdownDetails = async () => {
    dispatch(showLoader());
    if (activeClient) {
      if (activeClient !== activeDateDropdown?.clientId) {
        dispatch(
          setActiveAccountPODateDropdown({
            clientId: 0,
            position: "",
            startDate: "",
            endDate: "",
          })
        );
      }
      const response = await GetDropdownDetails(activeClient);
      const datesDetailsResponse = response?.data?.responseData.dates.map(
        (data: string) => {
          return {
            label:
              moment(data?.split(" - ")[1], "DD-MM-YYYY").format("MMM-YY") +
              " (" +
              data +
              ")",
            value: data,
          };
        }
      );

      if (response?.data?.responseData) {
        setDropdownDetails({
          dateDropDown: datesDetailsResponse,
        });

        const currentDateIndex = datesDetailsResponse?.findIndex(
          (a: Option) => {
            const splitValues = a.label.split(" - ");
            return moment(
              moment().format("DD-MM-YYYY"),
              "DD-MM-YYYY"
            ).isSameOrBefore(moment(splitValues[1], "DD-MM-YYYY"));
          }
        );

        const dateRange =
          datesDetailsResponse[currentDateIndex]?.value.split(" - ");
        if (dateRange?.length > 0) {
          if (activeDateDropdown?.position == "") {
            dispatch(
              setActiveAccountPODateDropdown({
                clientId: activeClient,
                position: datesDetailsResponse[currentDateIndex]?.value,
                startDate: dateRange[0],
                endDate: dateRange[1],
              })
            );
          }
        }
      }
    }
    dispatch(hideLoader());
  };

  async function fetchAllSegments(query: string) {
    dispatch(showLoader());
    let queryString = `?clientId=${activeClient}`;
    queryString = query ? queryString + query : queryString;
    const response = await GetAllSegmentData(queryString);
    if (response?.data?.responseData) {
      setSegmentsData(response?.data?.responseData);
    }
    dispatch(hideLoader());
  }

  // ********************************Data with Hourly Overtime Bonus******************************

  async function fetchAllAccountPOSummary(query: string) {
    dispatch(showLoader());
    const response = await GetAllPOSummaryData(activeClient, query);
    if (response?.data?.responseData) {
      setAccountPODetails(response?.data?.responseData);
    }
    dispatch(hideLoader());
  }

  // *********************************************************************************************

  // async function fetchAllAccountPOSummary(query: string) {
  //   dispatch(showLoader());
  //   const response = await GetAllPOSummaryData(activeClient, query);
  //   if (response?.data?.responseData) {
  //     const responseData = response?.data?.responseData?.filter(
  //       (data: IAccountPOSummaryData) =>
  //         !hourlyOvertimeBonus.includes(data.type)
  //     );
  //     setAccountPODetails(responseData);
  //   }
  //   dispatch(hideLoader());
  // }

  const setAccountPOData = () => {
    if (segmentsData && accountPODetails) {
      const response = { segmentsData, accountPODetails, activeDateDropdown };
      return response;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-wrap 1400:flex-nowrap gap-4 items-center">
          
          <SelectComponent
            options={dropdownDetails.dateDropDown}
            parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
            onChange={(option: Option | Option[]) => {
              if (!Array.isArray(option)) {
                const dateRange = option.value.toString().split(" - ");
                dispatch(
                  setActiveAccountPODateDropdown({
                    clientId: +activeClient,
                    position: option?.value.toString(),
                    startDate: dateRange[0],
                    endDate: dateRange[1],
                  })
                );
              }
            }}
            selectedValue={activeDateDropdown?.position}
            className="bg-white"
          />
        </div>
      </div>
      <div className="table-wrapper overflow-auto mt-[-60px]">
        <AccountTable
          headerData={columnData as IAccountTableHeaderProps[]}
          bodyData={setAccountPOData()}
          loader={loader}
          type={AccountPO.OUTER}
          checked={checked}
          setChecked={setChecked}
          isExport={getPermissions(
            FeaturesNameEnum.AccountPO,
            PermissionEnum.View
          )}
          // exportButtonClick={handleExport}
        />
      </div>
    </>
  );
};

export default AccountPOSummaryList;
