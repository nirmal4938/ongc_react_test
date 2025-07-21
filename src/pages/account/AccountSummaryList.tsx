import { useEffect, useState } from "react";
import Table from "@/components/table/Table";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { currentPageSelector } from "@/redux/slices/paginationSlice";
import { GetDropdownDetails } from "@/services/timesheetService";
import { IAccountSummaryData } from "@/interface/account/accountSummaryInterface";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Option } from "@/interface/customSelect/customSelect";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { GetAllAccountSummary } from "@/services/accountService";
import { ITableHeaderProps } from "@/interface/table/tableInterface";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { usePermission } from "@/context/PermissionProvider";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";

const AccountSummaryList = () => {
  const { getPermissions } = usePermission();
  const columnData = [
    {
      header: "N°",
      name: "n",
      option: {
        sort: true,
      },
    },
    {
      header: "Position",
      name: "position",
      option: {
        sort: true,
      },
      cell: (props: { position: string }) => props.position,
    },
    {
      header: "Type",
      name: "type",
      option: {
        sort: true,
      },
    },
    {
      header: "Affectation",
      name: "affectation",
      option: {
        sort: true,
      },
    },
    {
      header: "Service Month",
      name: "serviceMonth",
      option: {
        sort: true,
      },
    },
    {
      header: "Monthly Salary with...",
      name: "monthlySalaryWithHousingAndTravel",
      option: {
        sort: true,
      },
      cell: (props: { monthlySalaryWithHousingAndTravel: number }) =>
        props.monthlySalaryWithHousingAndTravel.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      header: "Days worked",
      name: "daysWorked",
      option: {
        sort: true,
      },
      cell: (props: { daysWorked: number }) => props.daysWorked,
    },
    {
      ...(getPermissions(FeaturesNameEnum.DailyRate, PermissionEnum.View) && {
        header: "Daily cost",
        name: "dailyCost",
        option: {
          sort: true,
        },
        cell: (props: { dailyCost: number }) =>
          props.dailyCost.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      }),
    },
    {
      header: "Should be invoiced",
      name: "shouldBeInvoiced",
      option: {
        sort: true,
      },
      cell: (props: { shouldBeInvoiced: number }) =>
        props.shouldBeInvoiced.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      header: "Invoiced",
      name: "invoiced",
      option: {
        sort: true,
      },
      cell: (props: { invoiced: string }) => {
        return props?.invoiced != null
          ? parseFloat(props?.invoiced)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "To be invoiced back",
      name: "toBeInvoicedBack",
      option: {
        sort: true,
      },
      cell: (props: { toBeInvoicedBack: string }) => {
        return props?.toBeInvoicedBack != null
          ? parseFloat(props?.toBeInvoicedBack)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "PO number",
      name: "poNumber",
      option: {
        sort: true,
      },
    },
    {
      header: "PO date",
      name: "poDate",
      option: {
        sort: true,
      },
      cell: (props: { poDate: Date | string }) => {
        return props?.poDate ? moment(props?.poDate).format("DD/MM/YYYY") : "-";
      },
    },
    {
      header: "Invoice number",
      name: "invoiceNumber",
      option: {
        sort: true,
      },
    },
    {
      header: "Invoice lodging date",
      name: "invoiceLodgingDate",
      option: {
        sort: true,
      },
      cell: (props: { invoiceLodgingDate: Date | string }) => {
        return props?.invoiceLodgingDate
          ? moment(props?.invoiceLodgingDate).format("DD/MM/YYYY")
          : "-";
      },
    },
    {
      header: "Invoice amount",
      name: "invoiceAmount",
      option: {
        sort: true,
      },
      cell: (props: { invoiceAmount: string }) => {
        return props?.invoiceAmount != null
          ? parseFloat(props?.invoiceAmount)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "Salary paid",
      name: "salaryPaid",
      option: {
        sort: true,
      },
      cell: (props: { salaryPaid: string }) => {
        return props?.salaryPaid != null
          ? parseFloat(props?.salaryPaid)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "Bonus 1 Name",
      name: "bonus1Name",
      option: {
        sort: true,
      },
    },
    {
      header: "Bonus 1",
      name: "bonus1",
      option: {
        sort: true,
      },
      cell: (props: { bonus1: string }) => {
        return props?.bonus1 != null
          ? parseFloat(props?.bonus1)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "PO Number Bonus 1",
      name: "poNumberBonus1",
      option: {
        sort: true,
      },
    },
    {
      header: "PO Bonus 1",
      name: "poBonus1",
      option: {
        sort: true,
      },
      cell: (props: { poBonus1: string }) => {
        return props?.poBonus1 != null
          ? parseFloat(props?.poBonus1)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "Invoice number PO bonus 1",
      name: "invoiceNumberPOBonus1",
      option: {
        sort: true,
      },
    },
    {
      header: "Bonus 2 Name",
      name: "bonus2Name",
      option: {
        sort: true,
      },
    },
    {
      header: "Bonus 2",
      name: "bonus2",
      option: {
        sort: true,
      },
      cell: (props: { bonus2: string }) => {
        return props?.bonus2 != null
          ? parseFloat(props?.bonus2)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "PO Number Bonus 2",
      name: "poNumberBonus2",
      option: {
        sort: true,
      },
    },
    {
      header: "PO Bonus 2",
      name: "poBonus2",
      option: {
        sort: true,
      },
      cell: (props: { poBonus2: string }) => {
        return props?.poBonus2 != null
          ? parseFloat(props?.poBonus2)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "Invoice number PO bonus 2",
      name: "invoiceNumberPOBonus2",
      option: {
        sort: true,
      },
    },
    {
      header: "Bonus 3 Name",
      name: "bonus3Name",
      option: {
        sort: true,
      },
    },
    {
      header: "Bonus 3",
      name: "bonus3",
      option: {
        sort: true,
      },
      cell: (props: { bonus3: string }) => {
        return props?.bonus3 != null
          ? parseFloat(props?.bonus3)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "PO Number Bonus 3",
      name: "poNumberBonus3",
      option: {
        sort: true,
      },
    },
    {
      header: "PO Bonus 3",
      name: "poBonus3",
      option: {
        sort: true,
      },
      cell: (props: { poBonus3: string }) => {
        return props?.poBonus3 != null
          ? parseFloat(props?.poBonus3)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "Invoice number PO bonus 3",
      name: "invoiceNumberPOBonus3",
      option: {
        sort: true,
      },
    },
    {
      header: "Additional Bonus Names",
      name: "additionalBonusNames",
      option: {
        sort: true,
      },
    },
    {
      header: "Additional Bonus Amount",
      name: "additionalAmount",
      option: {
        sort: true,
      },
      cell: (props: { additionalAmount: string }) => {
        return props?.additionalAmount != null
          ? parseFloat(props?.additionalAmount)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "Additional PO Bonus",
      name: "additionalPOBonus",
      option: {
        sort: true,
      },
      cell: (props: { additionalPOBonus: string }) => {
        return props?.additionalPOBonus != null
          ? parseFloat(props?.additionalPOBonus)
              ?.toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          : "-";
      },
    },
    {
      header: "Additional Invoice number PO",
      name: "additionalInvoiceNumberPO",
      option: {
        sort: true,
      },
    },
    {
      header: "Date Salary paid",
      name: "dateSalaryPaid",
      option: {
        sort: true,
      },
      cell: (props: { dateSalaryPaid: Date | string }) => {
        return props?.dateSalaryPaid
          ? moment(props?.dateSalaryPaid).format("DD/MM/YYYY")
          : "-";
      },
    },
    {
      header: "Comments",
      name: "comments",
      cell: (props: { comments: string }) =>
        props.comments ? props.comments.replace(/<(.|\n)*?>/g, "") : "-",
      option: {
        sort: true,
      },
    },
  ];
  const dispatch = useDispatch();
  const currentPage = useSelector(currentPageSelector);
  const activeClient = useSelector(activeClientSelector);
  const [limit, setLimit] = useState<number>(200);
  const [sort, setSorting] = useState<string>("");
  const [sortType, setSortingType] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const [resetPage, setResetPage] = useState<boolean>(false);
  const [dropdownDetails, setDropdownDetails] = useState<{
    dateDropDown: Option[];
  }>({
    dateDropDown: [],
  });
  const [activeDateDropdown, setActiveDateDropdown] = useState<{
    position: string;
    startDate: string | Date;
    endDate: string | Date;
  }>({
    position: "",
    startDate: "",
    endDate: "",
  });
  const [accountSummaryData, setAccountSummaryData] = useState<{
    data: IAccountSummaryData[];
    totalPage: number;
    totalCount: number;
  }>({
    data: [],
    totalPage: 0,
    totalCount: 0,
  });

  const queryString = `?page=${currentPage}&clientId=${activeClient}&sort=${
    sortType ? "asc" : "desc"
  }&sortBy=${sort}`;
  useEffect(() => {
    if (
      activeClient &&
      activeDateDropdown.endDate &&
      activeDateDropdown.startDate
    ) {
      fetchAllAccountSammary(
        queryString +
          (activeDateDropdown.startDate
            ? `&startDate=${activeDateDropdown.startDate}`
            : "") +
          (activeDateDropdown.endDate
            ? `&endDate=${activeDateDropdown.endDate}`
            : "")
      );
      setResetPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    limit,
    activeClient,
    activeDateDropdown,
    sort,
    sortType,
    resetPage,
  ]);

  useEffect(() => {
    fetchAllDropdownDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  async function fetchAllAccountSammary(query: string) {
    setLoader(true);
    dispatch(showLoader());
    const response: {
      data: {
        responseData: {
          data: IAccountSummaryData[];
          count: number;
          lastPage: number;
          XeroUrl?: string;
        };
      };
    } = await GetAllAccountSummary(query);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setAccountSummaryData({
        data: result.data,
        totalCount: result.count,
        totalPage: result.lastPage,
      });
      if (result?.XeroUrl) {
        window.location.href = result?.XeroUrl;
      }
    }
    dispatch(hideLoader());
    setLoader(false);
  }

  const fetchAllDropdownDetails = async () => {
    setLoader(true);
    dispatch(showLoader());
    if (activeClient) {
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
        const currentDateIndex = datesDetailsResponse.findIndex((a: Option) => {
          const dates = a?.value.toString().split(" - ");

          return (
            new Date(
              moment(dates[0], "DD-MM-YYYY").format("YYYY-MM-DD")
            ).getTime() <= new Date().getTime() &&
            new Date(
              moment(dates[1], "DD-MM-YYYY").format("YYYY-MM-DD")
            ).getTime() >= new Date().getTime()
          );
        });
        const dateRange =
          datesDetailsResponse[currentDateIndex]?.value.split(" - ");
        if (dateRange?.length > 0) {
          setActiveDateDropdown({
            position: datesDetailsResponse[currentDateIndex]?.value,
            startDate: dateRange[0],
            endDate: dateRange[1],
          });
        }
      }
      // if (response?.data?.responseData) {
      //   setDropdownDetails({
      //     dateDropDown: datesDetailsResponse,
      //   });

      //   const currentDateIndex = datesDetailsResponse?.findIndex(
      //     (a: Option) => {
      //       const splitValues = a.label.split(" - ");
      //       return moment(
      //         moment().format("DD-MM-YYYY"),
      //         "DD-MM-YYYY"
      //       ).isSameOrBefore(moment(splitValues[1], "DD-MM-YYYY"));
      //     }
      //   );

      //   const dateRange =
      //     datesDetailsResponse[currentDateIndex]?.value.split(" - ");
      //   if (dateRange?.length > 0) {
      //     setActiveDateDropdown({
      //       position: datesDetailsResponse[currentDateIndex]?.value,
      //       startDate: dateRange[0],
      //       endDate: dateRange[1],
      //     });
      //   }
      // }
    }
    setLoader(false);
    dispatch(hideLoader());
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
                setActiveDateDropdown({
                  position: option?.value.toString(),
                  startDate: dateRange[0],
                  endDate: dateRange[1],
                });
              }
            }}
            selectedValue={activeDateDropdown.position}
            className="bg-white"
          />
        </div>
      </div>
      <div className="table-wrapper overflow-hidden max-h-[calc(100dvh_-_170px)]">
        <Table
          tableClass="min-w-[5000px]"
          headerData={columnData as ITableHeaderProps[]}
          bodyData={accountSummaryData.data}
          loader={loader}
          pagination={false}
          paginationApiCb={fetchAllAccountSammary}
          dataPerPage={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          totalPage={accountSummaryData.totalPage}
          dataCount={accountSummaryData.totalCount}
          isClientDropdown={false}
          setSorting={setSorting}
          sortType={sortType}
          setSortingType={setSortingType}
        />
      </div>
    </>
  );
};

export default AccountSummaryList;
