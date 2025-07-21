import { VITE_APP_API_URL } from "@/config";
import { ITimesheetPdfData } from "@/interface/timesheet/timesheetInterface";
import moment from "moment";
export const SegmentTimesheetPdf = ({
  timesheetDetails,
}: {
  timesheetDetails: ITimesheetPdfData[];
}) => {
  const statusDataList: { key: string; title: string; value: string }[] = [];
  const bonusDataList: {
    key: string;
    name: string;
    title: string;
    value: number;
  }[] = [];
  const total: any = [];
  const reliquatTotal: any = [];
  let isReliquat = false;
  let isReliquatTotal = false;
  let isCallOutRotation = true;
  if (timesheetDetails && timesheetDetails?.length > 0) {
    if (
      timesheetDetails?.some(
        (data) =>
          data?.employeeData?.employeeRotation &&
          data?.employeeData?.employeeRotation?.length > 0 &&
          data?.employeeData?.employeeRotation[0]?.rotation?.name &&
          data?.employeeData?.employeeRotation[0]?.rotation?.name !== "Call Out"
      )
    ) {
      isCallOutRotation = false;
    } else {
      isCallOutRotation = true;
    }
  }

  const chunkSize = 9;
  let pTotal = 0;
  let crTotal = 0;
  let wTotal = 0;
  let o1Total = 0;
  let o2Total = 0;
  let hobTotal = 0;
  let hTotal = 0;

  const chunkedTimesheetDetails = timesheetDetails
    .map((_, i) => {
      return i % chunkSize === 0
        ? timesheetDetails.slice(i, i + chunkSize)
        : null;
    })
    .filter((e) => e);
  const weekendOvertimeColsArr: string[] = [];
  const weekendOvertimeData: { label: string; title: string }[] = [];
  timesheetDetails?.map((status) => {
    pTotal += status?.presentValue;
    crTotal += status?.CRValue;
    wTotal +=
      status?.overtimeWeekendBonus?.filter((e) => e?.label === "W")[0]
        ?.length ?? 0;
    o1Total +=
      status?.overtimeWeekendBonus?.filter((e) => e?.label === "O1")[0]
        ?.length ?? 0;
    o2Total +=
      status?.overtimeWeekendBonus?.filter((e) => e?.label === "O2")[0]
        ?.length ?? 0;
    hobTotal +=
      status?.overtimeWeekendBonus?.filter((e) => e?.label === "HOB")[0]
        ?.length ?? 0;
    hTotal +=
      status?.overtimeWeekendBonus?.filter((e) => e?.label === "H")[0]
        ?.length ?? 0;
    status?.overtimeWeekendBonus?.map(
      (e: { title?: string; label: string; length: number }) => {
        if (
          weekendOvertimeColsArr?.findIndex((isExist) => isExist === e?.label) <
          0
        ) {
          weekendOvertimeColsArr?.push(e?.label);
          weekendOvertimeData?.push({ label: e.label, title: e.title ?? "" });
        }
      }
    );
    status.statusArr
      ?.filter((e) => e.key !== "HOB")
      ?.map((statusArrData) => {
        if (!statusDataList.find((sData) => sData.key == statusArrData.key)) {
          statusDataList.push(statusArrData);
        }
      });

    statusDataList.map((s, inx) => {
      if (status.statusPdfCounts[inx]) {
        if (total[s.key]) {
          total[s.key] = total[s.key] + status.statusPdfCounts[inx];
        } else {
          total[s.key] = status.statusPdfCounts[inx];
        }
      }
    });

    status.bonusCount?.map((bonus) => {
      if (!bonusDataList.find((sData) => sData.key == bonus.bonusType)) {
        bonusDataList.push({
          key: bonus.bonusType,
          name: bonus.bonusName,
          title: bonus.bonusType,
          value: bonus.length,
        });
      }
    });

    if (
      status?.employeeData?.reliquatCalculation &&
      status?.employeeData?.reliquatCalculation?.length > 0
    )
      isReliquat = true;

    if (
      status?.employeeData?.rotation &&
      status?.employeeData?.rotation?.name != "Call Out"
    ) {
      isReliquatTotal = true;
    }

    bonusDataList.map((s) => {
      const isExist = status.bonusCount?.find((val) => val.bonusType == s.key);
      if (isExist) {
        if (total[s.key]) {
          total[s.key] = total[s.key] + isExist.length;
        } else {
          total[s.key] = isExist.length;
        }
      }
    });

    if (
      status.employeeData?.reliquatCalculation &&
      status.employeeData?.reliquatCalculation?.length > 0
    ) {
      reliquatTotal["O"] =
        (reliquatTotal["O"] ?? 0) +
        status.employeeData.reliquatCalculation[0]?.overtime;
      reliquatTotal["Reliquat"] =
        (reliquatTotal["Reliquat"] ?? 0) +
        status.employeeData.reliquatCalculation[0]?.reliquat;
    }
    reliquatTotal["Total"] =
      (reliquatTotal["Total"] ?? 0) + status.finalTotalCount;
    // ((status?.employeeData?.reliquatCalculation?.[0]?.presentDay ?? 0) +
    //   (status?.employeeData?.reliquatCalculation?.[0]?.leave ?? 0));
  });
  const isHourlyBonusNote = timesheetDetails?.some((e) => e?.isHourlyBonusNote);

  return (
    <>
      {timesheetDetails.length ? (
        <>
          <div className="flex w-full justify-center max-w-[95%] ">
            <div className="w-1/3 max-w-1/3 !text-center  text-[22px] text-[#a62b24] px-0 pt-5 pb-10 font-bold">
              <span className="border-b border-b-[#6b070d] border-solid !text-lg">
                Pointage du Personnels{" "}
                {timesheetDetails[0].timesheetData.client.loginUserData.name}
              </span>
              <br />
              <span className="border-b border-b-[#6b070d] border-solid !text-lg">
                Du {timesheetDetails[0].timesheetData.startDate} Au{" "}
                {timesheetDetails[0].timesheetData.endDate}
              </span>
              <br />
              {timesheetDetails[0]?.timesheetData?.segment && (
                <span className="border-b border-b-[#6b070d] border-solid !text-lg">
                  {timesheetDetails[0].timesheetData.segment?.name}
                  {timesheetDetails[0].timesheetData?.subSegment
                    ? ` - ${timesheetDetails[0].timesheetData?.subSegment?.name}`
                    : ""}
                </span>
              )}
            </div>
          </div>
          <div className="px-20 mt-5">
            <div className="flex justify-between gap-3 w-full max-w-[full] mx-auto my-0 flex-col ">
              <h5 className="underline text-primaryRed mb-2 text-sm underline-offset-2">
                Timesheet
              </h5>
              <div className="w-full max-w-full">
                <table
                  cellSpacing="0"
                  className="pdf-table small w-full pageBreakBefore !border-[#cdcdcd]"
                >
                  <thead className="!text-center">
                    <tr className="">
                      <th className="!p-1 !border-gray-300 !text-xs !w-[150px] bg-[#cdcdcd]">
                        CHARGE
                      </th>
                      <th className="!p-1 !border-gray-300 !text-xs !w-[150px] bg-[#cdcdcd]">
                        Job Title
                      </th>

                      {timesheetDetails[0].allMonthData.map(
                        (item: {
                          status: string;
                          date: string;

                          rawDate?: string;
                        }) => {
                          const day = moment(item?.rawDate).format("dddd");
                          const weekend =
                            timesheetDetails?.[0]?.employeeData?.client?.weekendDays?.includes(
                              day
                            );

                          return (
                            <th
                              className={`!p-1 !border-gray-300 ${
                                weekend ? "weekoff" : " "
                              } !text-xs bg-[#cdcdcd]`}
                              key={item.date}
                            >
                              <span>{item.date}</span>
                            </th>
                          );
                        }
                      )}
                      <th className="!p-1 !border-gray-300 !w-[5px] !border-t-0 !border-b-0 border-r-gray-300"></th>
                      {!isCallOutRotation && (
                        <>
                          <th className="!p-1 !border-gray-300 !text-xs w-auto bg-[#cdcdcd]">
                            P
                          </th>
                          <th className="!p-1 !border-gray-300 !text-xs w-auto bg-[#cdcdcd]">
                            CR
                          </th>
                        </>
                      )}
                      {bonusDataList && bonusDataList?.length > 0 && (
                        <>
                          {bonusDataList.map((item) => (
                            <th
                              className="!p-0 !border-gray-300 !text-xs w-auto bg-[#cdcdcd]"
                              key={item.key}
                            >
                              <>{item.key}</>
                            </th>
                          ))}
                        </>
                      )}
                      {weekendOvertimeColsArr?.length > 0 && (
                        <>
                          {weekendOvertimeColsArr?.map((colsData) => (
                            <th className="!p-0 !border-gray-300 !text-xs w-auto bg-[#cdcdcd]">
                              {colsData}
                            </th>
                          ))}
                        </>
                      )}
                      {isReliquat ? (
                        <>
                          {isReliquatTotal && (
                            <>
                              <th className="title-cell bg-[#cdcdcd] !p-0 !border-gray-300 !rounded-none !text-center !text-xs !w-[50px]">
                                Reliquat
                              </th>
                            </>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                      {((bonusDataList && bonusDataList?.length > 0) ||
                        !isCallOutRotation) && (
                        <>
                          <th className="title-cell bg-[#b5121b59] !p-0 !border-gray-300 !rounded-none !text-center !text-xs !w-[50px]">
                            Total
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="before:!hidden ">
                    {timesheetDetails.map((timesheetDetail) => (
                      <tr>
                        <td className="!p-1 !border-gray-300 !text-xs w-[150px] !text-left text-nowrap">
                          {timesheetDetail.employeeData?.loginUserData
                            ?.lastName +
                            " " +
                            timesheetDetail.employeeData?.loginUserData
                              ?.firstName}
                        </td>
                        <td className="!p-1 !border-gray-300 !text-xs w-[200px] !text-left text-nowrap">
                          {timesheetDetail.employeeData.fonction}
                        </td>
                        {timesheetDetail?.allMonthData.map(
                          (dataItem: {
                            status: string;
                            bonusCode: string | null;
                            date: string;
                            isLeaveForTitreDeConge: boolean;
                            rawDate?: string;
                          }) => {
                            const day = moment(dataItem?.rawDate).format(
                              "dddd"
                            );
                            const weekend =
                              timesheetDetails?.[0]?.employeeData?.client?.weekendDays?.includes(
                                day
                              );
                            return (
                              <>
                                <td
                                  className={`${
                                    weekend ? "weekoff" : ""
                                  } !p-1 !w-auto !text-center !text-[10px] !border-gray-300${
                                    dataItem.status === "X" ? "bg-black/20" : ""
                                  }`}
                                >
                                  {weekend &&
                                  timesheetDetail?.employeeData
                                    ?.employeeRotation?.[0]?.rotation
                                    ?.isResident &&
                                  dataItem?.bonusCode === null &&
                                  dataItem?.status === "P" ? (
                                    "W"
                                  ) : dataItem.isLeaveForTitreDeConge &&
                                    dataItem?.status === "CR" ? (
                                    <>
                                      <div className="modify-leave relative">
                                        P
                                      </div>
                                      <div className="mb-2">
                                        {dataItem?.status}
                                      </div>
                                    </>
                                  ) : dataItem.isLeaveForTitreDeConge &&
                                    dataItem?.status === "P" ? (
                                    <>
                                      <div className="modify-leave relative">
                                        CR
                                      </div>
                                      <div className="mb-2">
                                        {dataItem?.status}
                                      </div>
                                    </>
                                  ) : (
                                    dataItem?.status
                                  )}
                                </td>
                              </>
                            );
                          }
                        )}
                        <td className="!border-gray-300 !w-[1px] !border-t-0 !border-b-0 p-0 border-r-[lightgray]"></td>
                        {!isCallOutRotation && (
                          <>
                            <td className="!text-center  !text-[10px] !p-1 !border-gray-300">
                              {timesheetDetail?.presentValue}
                            </td>
                            <td className="!text-center  !text-[10px] !p-1 !border-gray-300">
                              {timesheetDetail?.CRValue}
                            </td>
                          </>
                        )}
                        {bonusDataList?.map((st) => (
                          <td className="!text-center !text-[10px] !p-0 !border-gray-300">
                            {timesheetDetail?.bonusCount?.findIndex(
                              (inx) => inx.bonusType == st.key
                            ) != -1
                              ? timesheetDetail?.bonusCount?.find(
                                  (inx) => inx.bonusType == st.key
                                )?.length
                              : 0}
                          </td>
                        ))}
                        {weekendOvertimeColsArr?.length > 0 && (
                          <>
                            {weekendOvertimeColsArr?.map((e: string) => (
                              <td className="!text-center !text-[10px] !p-0 !border-gray-300">
                                {timesheetDetail?.overtimeWeekendBonus?.findIndex(
                                  (inx) => inx.label === e
                                ) >= 0
                                  ? timesheetDetail?.overtimeWeekendBonus?.filter(
                                      (obj) => obj.label === e
                                    )?.[0]?.length
                                  : 0}
                              </td>
                            ))}
                          </>
                        )}
                        {isReliquat ? (
                          timesheetDetail?.employeeData?.reliquatCalculation &&
                          timesheetDetail?.employeeData?.reliquatCalculation
                            ?.length > 0 ? (
                            <>
                              {isReliquatTotal && (
                                <>
                                  <td className="!bg-transparent !p-1 !border-gray-300 !rounded-none !text-[10px]">
                                    {timesheetDetail?.employeeData
                                      ?.reliquatCalculation?.[0]?.reliquat ??
                                      "-"}
                                  </td>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {isReliquatTotal && (
                                <>
                                  <td className="!p-0 !border-gray-300 !text-[10px]">
                                    -
                                  </td>
                                  {/* <td className="!p-0 !border-gray-300 !text-[10px] !bg-[#b5121b59]">
                                  -
                                </td> */}
                                </>
                              )}
                            </>
                          )
                        ) : (
                          <></>
                        )}

                        {((bonusDataList && bonusDataList?.length > 0) ||
                          !isCallOutRotation) && (
                          <td className="!bg-[#b5121b59] !p-1 !border-gray-300 !rounded-none !text-[10px]">
                            {timesheetDetail?.finalTotalCount}
                          </td>
                        )}
                      </tr>
                    ))}
                    <tr>
                      <td
                        className="!border-gray-300 !border-b-transparent !border-l-transparent"
                        colSpan={3 + timesheetDetails[0].allMonthData.length}
                      ></td>

                      {!isCallOutRotation && (
                        <>
                          <th className="!p-1 !border-gray-300  !text-[10px] !text-center">
                            {pTotal}
                          </th>
                          <th className="!p-1 !border-gray-300  !text-[10px] !text-center">
                            {crTotal}
                          </th>
                        </>
                      )}
                      {bonusDataList.map((item) => (
                        <th
                          className="!p-1 !border-gray-300  !text-[10px] !text-center"
                          key={item.key}
                        >
                          {total[item.key] ?? 0}
                        </th>
                      ))}
                      {weekendOvertimeColsArr?.map((e: string) => (
                        <th className="!p-1 !border-gray-300  !text-[10px] !text-center">
                          {e === "W"
                            ? wTotal
                            : e === "O1"
                            ? o1Total
                            : e === "O2"
                            ? o2Total
                            : e === "HOB"
                            ? hobTotal
                            : hTotal}
                        </th>
                      ))}
                      {isReliquat && (
                        <>
                          {isReliquatTotal && (
                            <>
                              <th
                                className="!p-1 !border-gray-300  !text-[10px] !text-center"
                                key={"Reliquat"}
                              >
                                {reliquatTotal["Reliquat"] ?? 0}
                              </th>
                              <th
                                className="!p-1 !border-gray-300  !text-[10px] !text-center !bg-[#b5121b59]"
                                key={"Total"}
                              >
                                {reliquatTotal["Total"] ?? 0}
                              </th>
                            </>
                          )}
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-2 w-full">
              <div className="w-1/12 max-w-1/12 total-table">
                <table
                  cellSpacing="0"
                  className="pdf-table small w-1/4 max-w-1/4 "
                >
                  <thead className="">
                    <tr>
                      <th className="title-cell !p-0 !border-gray-300 !border-t !text-xs !text-center">
                        N° Personne
                      </th>
                    </tr>
                  </thead>
                  <tbody className="before:!hidden ">
                    <tr>
                      <td className="!p-1 !border-gray-300  !text-xs">
                        {timesheetDetails.length}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* <div className="mt-4 w-full >
            <div className="min-w-[150px] w-auto inline-block mb-5">
              <span className="text-[8px] inline-block font-semibold text-black ">
                Récap Time Sheet
              </span>
              <ul>
                <li className="leading-[1] !text-center text-[8px] !border-gray-300 p-1 !border-gray-300 last:border-b ">
                  <span className=" inline-block font-bold !text-black">
                    N° Personne
                  </span>
                </li>
                <li className="leading-[1] !text-center text-[8px] !border-gray-300 p-1 !border-gray-300 last:border-b ">
                  <span className=" inline-block font-bold  !text-black">
                    {timesheetDetails.length}
                  </span>
                </li>
              </ul>
            </div> */}
              {statusDataList && statusDataList?.length > 0 && (
                <div
                  className={`flex justify-between gap-3 w-full mx-auto flex-col my-4 keepTogether`}
                >
                  <h5 className="underline text-primaryRed mb-2 text-sm underline-offset-2">
                    Statuses
                  </h5>
                  <div className="grid grid-cols-2 gap-x-10 max-w-[600px] min-w-[600px] !w-full">
                    {statusDataList?.map((data, index: number) => (
                      <>
                        <div className="" key={+index}>
                          <div className="flex group justify-center items-center">
                            <div className="w-12 !text-center !text-xs !border-gray-300 p-1 border-b-0 group-last:border-b border-r-0 last:border-r !border-t border-l">
                              {data?.key}
                            </div>
                            <div className="w-[calc(100%_-_48px)] !text-left !text-xs !border-gray-300 p-1 border-b-0 group-last:border-b border-r-0 last:border-r !border-t !border-l">
                              {data?.value}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              )}

              {/* Bonus Details */}
              {((bonusDataList && bonusDataList?.length > 0) ||
                (weekendOvertimeData && weekendOvertimeData?.length > 0)) && (
                <div className="flex justify-between gap-3 w-full mx-auto flex-col my-4 keepTogether">
                  <h5 className="underline text-primaryRed mb-1 text-sm underline-offset-2">
                    Bonuses
                  </h5>
                  <div className="grid grid-cols-2 gap-x-10 max-w-[600px] min-w-[600px] !w-full">
                    {bonusDataList?.map((data, index: number) => (
                      <div className="" key={+index}>
                        <div className="flex group justify-center items-center">
                          <div className="w-12 !text-center !text-xs !border-gray-300 p-1 border-b-0 group-last:border-b border-r-0 last:border-r !border-t border-l">
                            {data?.key}
                          </div>
                          <div className="w-[calc(100%_-_48px)] !text-left !text-xs !border-gray-300 p-1 border-b-0 group-last:border-b border-r-0 last:border-r !border-t !border-l">
                            {data?.name}
                          </div>
                        </div>
                      </div>
                    ))}

                    {weekendOvertimeData?.map((data, index: number) => (
                      <div className="" key={+index}>
                        <div className="flex group justify-center items-center">
                          <div className="w-12 !text-center !text-xs !border-gray-300 p-1 border-b-0 group-last:border-b border-r-0 last:border-r !border-t border-l">
                            {data?.label}
                          </div>
                          <div className="w-[calc(100%_-_48px)] !text-left !text-xs !border-gray-300 p-1 border-b-0 group-last:border-b border-r-0 last:border-r !border-t !border-l">
                            {data?.title ?? ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="relative keepTogether">
                <h5 className="underline text-primaryRed mb-4 text-sm underline-offset-2">
                  Medicals
                </h5>
                <div className="grid grid-cols-3 gap-5">
                  {chunkedTimesheetDetails.map((chunk, chunkIndex) => {
                    return (
                      <div className="w-full" key={chunkIndex}>
                        <div key={chunkIndex} className="">
                          <table cellSpacing="0" className="pdf-table small">
                            <thead>
                              <tr>
                                <th className="!p-1 !border-gray-300 bg-[#cdcdcd] !text-xs">
                                  CHARGE
                                </th>
                                <th className="!p-1 !border-gray-300 bg-[#cdcdcd] !text-xs">
                                  Medical Check
                                </th>
                                <th className="!p-1 !border-gray-300 bg-[#cdcdcd] !text-xs">
                                  Medical Expiry
                                </th>
                              </tr>
                            </thead>
                            <tbody className="before:!hidden ">
                              {chunk?.map((timesheetDetail, index) => (
                                <tr key={index}>
                                  <td className="!p-0 !border-gray-300 !text-xs">
                                    {timesheetDetail.employeeData.loginUserData
                                      .firstName +
                                      " " +
                                      timesheetDetail.employeeData.loginUserData
                                        .lastName}
                                  </td>
                                  <td className="!p-1 !border-gray-300  !text-xs">
                                    {timesheetDetail.employeeData
                                      .medicalCheckDate ?? "-"}
                                  </td>
                                  <td className="!p-1 !border-gray-300  !text-xs">
                                    {timesheetDetail.employeeData
                                      .medicalCheckExpiry ?? "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {isHourlyBonusNote && (
                  <div className="gap-3 w-full mx-auto flex-col my-5">
                    <h5 className="underline text-primaryRed mb-2 text-sm underline-offset-2">
                      Note
                    </h5>
                    <div className="grid grid-cols-1 gap-x-10">
                      <span className="text-primaryRed text-sm font-BinerkaDemo">
                        • When the contractor/employee works over 8 hrs, he/she
                        would have extra hours paid at a normal rate*1.5 <br />•
                        When the contractor/employee works more than 4 hours
                        over time, he/she would get paid the normal rate*1.75{" "}
                        <br />
                        • Working at nights/weekend/bank holidays, the
                        contractor/employee should get paid per hour, normal
                        rate*2 <br />
                      </span>
                    </div>
                  </div>
                )}
                {/* <div className="!w-full"> */}
                <div
                  className="w-full mt-2"
                  // style={{ pageBreakInside: "avoid" }}
                >
                  <div className="flex justify-around mt-5 !w-full !max-w-full relative">
                    <div className="left-block">
                      <p className="font-bold !text-xs mb-1 !text-black">
                        Signature / Stamp:
                      </p>
                      <p className="font-semibold !text-xs mb-1 !text-black">
                        {
                          timesheetDetails[0].timesheetData.client.loginUserData
                            .name
                        }
                      </p>
                    </div>
                    <div className="right-block">
                      <p className="font-bold !text-xs mb-1 !text-black">
                        Signature / Stamp:
                      </p>
                      <p className="font-bold !text-xs !text-black">LRED</p>
                      <img
                        src={`${
                          timesheetDetails[0]?.employeeData?.client?.stampLogo
                            ? String(
                                VITE_APP_API_URL +
                                  timesheetDetails[0]?.employeeData?.client
                                    ?.stampLogo
                              )
                            : "/assets/images/lred-stamp-logo.png"
                        }`}
                        alt="pdfLogo"
                        className="!p-0"
                        style={{ width: "5cm" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
