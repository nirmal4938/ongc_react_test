import { VITE_APP_API_URL } from "@/config";
import { ITimesheetPdfData } from "@/interface/timesheet/timesheetInterface";
import moment from "moment";

export const TimesheetPdf = ({
  timesheetDetails,
}: {
  timesheetDetails: ITimesheetPdfData[];
}) => {
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
  return (
    <>
      {timesheetDetails.map((timesheetDetail) => {
        return (
          <>
            <div className="flex w-full justify-center !bg-transparent max-w-[100%]">
              <div className="w-1/3 max-w-1/3 text-center leading-[125%] text-[22px] text-[#a62b24] font-extrabold px-0 pt-5 pb-10">
                <span className="border-b border-b-[#6b070d] border-solid !text-lg !font-bold">
                  Pointage du Personnels{" "}
                  {timesheetDetail.timesheetData.client.loginUserData.name}
                </span>
                <br />
                <span className="border-b border-b-[#6b070d] border-solid !text-lg !font-bold">
                  Du {timesheetDetail.timesheetData.startDate} Au{" "}
                  {timesheetDetail.timesheetData.endDate}
                </span>
                <br />
                {timesheetDetail?.timesheetData?.segment && (
                  <span className="border-b border-b-[#6b070d] border-solid !text-lg !font-bold">
                    {timesheetDetail.timesheetData.segment?.name}
                    {timesheetDetail.timesheetData?.subSegment
                      ? ` - ${timesheetDetail.timesheetData?.subSegment?.name}`
                      : ""}
                  </span>
                )}
              </div>
              {/* <div className="w-1/3"></div> */}
            </div>
            <div className="mt-20 px-20">
              <div className="flex justify-between gap-3 w-full max-w-[full] mx-auto my-0 flex-col ">
                {/* FULL TABLE */}

                {/* <div className="main-table w-full max-w-full flex justify-between gap-3"> */}

                <h5 className="underline text-primaryRed mb-1 text-sm underline-offset-2">
                  Timesheet
                </h5>
                <div className="w-full max-w-full">
                  <table className="pdf-table !rounded-none w-full">
                    <thead>
                      <tr className="!rounded-none">
                        <th className="title-cell !bg-transparent !p-0 !text-center !border-gray-300 !rounded-none h-[30px] !text-[12px] !text-black !w-[120px]">
                          CHARGE
                        </th>
                        <th className="title-cell !bg-transparent !p-0 !text-center !border-gray-300 !rounded-none h-[30px] !text-[12px] !text-black !w-[120px]">
                          Job Title
                        </th>
                        {timesheetDetail.allMonthData.map(
                          (item: {
                            status: string;
                            date: string;
                            rawDate?: string;
                          }) => {
                            const day = moment(item?.rawDate).format("dddd");
                            const weekend =
                              timesheetDetail?.employeeData?.client?.weekendDays?.includes(
                                day
                              );

                            return (
                              <th
                                // style={{ width: "auto !important", padding: '0px !important' }}
                                className={`!bg-transparent !font-bold !p-0 text-center !rounded-none h-[30px] !w-auto !text-[12px] !text-black !border-gray-300 ${
                                  weekend ? "weekoff" : " "
                                }`}
                                key={item?.date}
                              >
                                <span className="!rounded-none !border-0 h-[30px] !text-[12px] !text-black">
                                  {item.date}
                                </span>
                              </th>
                            );
                          }
                        )}
                        {!isCallOutRotation && (
                          <>
                            <th className="!w-[20px] !border-0 !bg-transparent"></th>
                            <th className="title-cell !w-auto !bg-transparent !p-0 !border-gray-300 !text-black !text-center !text-sm !font-bold !rounded-none h-[30px] !border-l">
                              P
                            </th>
                            <th className="title-cell !w-auto !bg-transparent !p-0 !border-gray-300 !text-black !text-center !text-sm !font-bold !rounded-none h-[30px] !border-l">
                              CR
                            </th>
                          </>
                        )}
                        {/* {timesheetDetail?.statusPdf?.map((item) => {
                        return (
                          <th
                            className="title-cell !w-auto !bg-transparent !p-0 !border-gray-300 !text-black !text-center !text-sm !font-bold !rounded-none h-[30px] !border-l"
                            key={item}
                          >
                            <>{item}</>
                          </th>
                        );
                      })} */}
                        {timesheetDetail?.bonusCount &&
                          timesheetDetail?.bonusCount?.length > 0 && (
                            <>
                              {timesheetDetail?.bonusCount?.map((bonusData) => (
                                <th
                                  className="title-cell !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm !w-auto !border-l"
                                  // key={`bonus_bonusData?.bonusType`}
                                >
                                  <>{bonusData?.bonusType}</>
                                </th>
                              ))}
                            </>
                          )}
                        {timesheetDetail?.overtimeWeekendBonus?.length > 0 && (
                          <>
                            {timesheetDetail?.overtimeWeekendBonus?.map(
                              (e: { label: string; length: number }) => (
                                <th className="title-cell !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm !w-auto">
                                  {e.label}
                                </th>
                              )
                            )}
                          </>
                        )}
                        {timesheetDetail?.employeeData?.reliquatCalculation &&
                          timesheetDetail?.employeeData?.reliquatCalculation
                            ?.length > 0 && (
                            <>
                              {!isCallOutRotation && (
                                <>
                                  <th className="title-cell !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-[12px] !w-[100px] !bg-transparent">
                                    Reliquat
                                  </th>
                                  {/* <th className="title-cell !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm !w-[100px] !bg-[#b5121b59]">
                                    Total
                                  </th> */}
                                </>
                              )}
                            </>
                          )}

                        {((timesheetDetail?.bonusCount &&
                          timesheetDetail?.bonusCount?.length > 0) ||
                          !isCallOutRotation) && (
                          <>
                            <th className="title-cell !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-[12px] !w-[100px] !bg-[#b5121b59]">
                              Total
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="before:!hidden !rounded-none">
                      <tr>
                        <td className="title-cell !font-medium !text-[10px] !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm h-[30px] !border-b">
                          {timesheetDetail?.employeeData?.loginUserData
                            ?.lastName +
                            " " +
                            timesheetDetail?.employeeData?.loginUserData
                              ?.firstName}
                        </td>
                        <td className="title-cell  !font-medium !text-[10px] !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm h-[30px] !border-b">
                          {timesheetDetail?.employeeData?.fonction}
                        </td>
                        {timesheetDetail?.allMonthData?.map(
                          (dataItem: {
                            status: string;
                            bonusCode: string | null;
                            isLeaveForTitreDeConge: boolean;
                            date: string;
                            rawDate?: string;
                          }) => {
                            const day = moment(dataItem?.rawDate).format(
                              "dddd"
                            );
                            const weekend =
                              timesheetDetail?.employeeData?.client?.weekendDays?.includes(
                                day
                              );

                            return (
                              <td
                                // style={{ width: "auto !important" , padding: '0px !important'}}
                                className={`!bg-transparent !p-0 !w-auto text-center !rounded-none h-[30px] !text-[10px] !text-black !border-gray-300 !font-medium !border-b   ${
                                  dataItem.status === "X" ? "bg-black/20" : ""
                                } ${weekend ? "weekoff" : " "}`}
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
                            );
                          }
                        )}
                        {!isCallOutRotation && (
                          <>
                            <td className="!w-auto !bg-transparent !border-0"></td>
                            <td className="!bg-transparent text-center !rounded-none h-[30px] !text-xs !text-black !p-0 !border-gray-300 !font-medium !border-l !border-b">
                              {timesheetDetail?.presentValue ?? 0}
                            </td>
                            <td className="!bg-transparent text-center !rounded-none h-[30px] !text-xs !text-black !p-0 !border-gray-300 !font-medium !border-l !border-b">
                              {timesheetDetail?.CRValue ?? 0}
                            </td>
                          </>
                        )}
                        {/* {timesheetDetail?.statusPdfCounts?.map((item) => (
                        <>
                          <td className="!bg-transparent text-center !rounded-none h-[30px] !text-sm !text-black !p-0 !border-gray-300 !font-bold !border-l !border-b">
                            {item}
                          </td>
                        </>
                      ))} */}
                        {timesheetDetail?.bonusCount &&
                          timesheetDetail?.bonusCount?.length > 0 && (
                            <>
                              {timesheetDetail?.bonusCount?.map((item) => (
                                <>
                                  <td className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-medium !border-b !border-l">
                                    {item?.length}
                                  </td>
                                </>
                              ))}
                            </>
                          )}
                        {timesheetDetail?.overtimeWeekendBonus?.length > 0 && (
                          <>
                            {timesheetDetail?.overtimeWeekendBonus?.map(
                              (e: { label: string; length: number }) => (
                                <td className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-medium !border-b">
                                  {e.length}
                                </td>
                              )
                            )}
                          </>
                        )}
                        {timesheetDetail?.employeeData?.reliquatCalculation &&
                          timesheetDetail?.employeeData?.reliquatCalculation
                            ?.length > 0 && (
                            <>
                              {!isCallOutRotation && (
                                <>
                                  <td className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-medium !border-b">
                                    {
                                      timesheetDetail?.employeeData
                                        ?.reliquatCalculation?.[0]?.reliquat
                                    }
                                  </td>
                                  {/* <td className="!p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold !border-b !bg-[#b5121b59]">
                                    {timesheetDetail?.employeeData
                                      ?.reliquatCalculation[0]?.presentDay +
                                      timesheetDetail?.employeeData
                                        ?.reliquatCalculation[0]?.leave}
                                  </td> */}
                                </>
                              )}
                            </>
                          )}

                        {((timesheetDetail?.bonusCount &&
                          timesheetDetail?.bonusCount?.length > 0) ||
                          !isCallOutRotation) && (
                          <>
                            <td className="!p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-medium !border-b !bg-[#b5121b59]">
                              {timesheetDetail?.finalTotalCount ?? 0}
                            </td>{" "}
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* <div className="w-1/2 max-w-1/2 !bg-transparent total-table">
                  <table
                    cellSpacing="0"
                    className="pdf-table small !bg-transparent w-full max-w-full "
                  >
                    <thead className="before:!hidden h-[30px]">
                      <tr>
                        
                      </tr>
                    </thead>
                    <tbody className="before:!hidden h-[30px] ">
                      <tr>
                        
                      </tr>
                    </tbody>
                  </table>
                </div> */}
              </div>
              {timesheetDetail?.employeeData?.client?.isShowPrices && (
                <div className="w-full !bg-transparent max-w-[550px] my-10">
                  <span className="text-primaryRed mb-2 text-sm underline inline-block">
                    Accounting Information
                  </span>
                  <table
                    cellSpacing="0"
                    className="pdf-table small !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none w-full table-auto"
                  >
                    <thead>
                      <tr>
                        <th className="title-cell !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm h-[30px] !border-b">
                          Total Present Days
                        </th>
                        <th className="title-cell !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm h-[30px] !border-b">
                          Daliy Cost
                        </th>
                        <th className="title-cell !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm h-[30px] !border-b">
                          Total Bonus
                        </th>
                        <th className="title-cell !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm h-[30px] !border-b">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="before:!hidden">
                      <tr>
                        <td className=" !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold">
                          {timesheetDetail.employeeCost.totalPresentDays}
                        </td>
                        <td className=" !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold">
                          {timesheetDetail.employeeCost.dailyCost?.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                        <td className=" !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold">
                          {timesheetDetail.employeeCost.bonusTotal?.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                        <td className=" !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold">
                          {timesheetDetail.employeeCost.totalCost?.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 w-full !bg-transparent">
                <div className="w-1/12 max-w-1/12 !bg-transparent total-table">
                  <table
                    cellSpacing="0"
                    className="pdf-table small !bg-transparent w-1/4 max-w-1/4 "
                  >
                    <thead className="h-[30px]">
                      <tr>
                        <th className="title-cell !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-center !text-sm">
                          N° Personne
                        </th>
                      </tr>
                    </thead>
                    <tbody className="before:!hidden h-[30px]">
                      <tr>
                        <td className=" !bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold">
                          1
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {timesheetDetail?.statusArr &&
                  timesheetDetail?.statusArr?.length > 0 && (
                    <div className="flex justify-between gap-3 w-full mx-auto flex-col my-4">
                      <h5 className="underline text-primaryRed mb-1 text-sm underline-offset-2">
                        Statuses
                      </h5>
                      <div className="grid grid-cols-2 gap-x-10 max-w-[600px] min-w-[600px] !w-full">
                        {timesheetDetail?.statusArr?.map(
                          (data, index: number) => (
                            <div className="" key={+index}>
                              <div className="flex group !text-black justify-center items-center">
                                <div className="w-12 !font-bold text-center leading-[1] !text-sm border border-solid  p-1 border-b-0 group-last:border-b border-r-0 last:border-r h-[30px] flex items-center justify-center !border-gray-300">
                                  {data?.key}
                                </div>
                                <div className="w-[calc(100%_-_48px)] text-center !font-bold leading-[1] !text-sm border border-solid  p-1 border-b-0 group-last:border-b border-r-0 last:border-r h-[30px] flex items-center justify-center !border-gray-300">
                                  {data?.value}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Bonus display */}
                {((timesheetDetail?.bonusCount &&
                  timesheetDetail?.bonusCount?.length > 0) ||
                  (timesheetDetail?.overtimeWeekendBonus &&
                    timesheetDetail?.overtimeWeekendBonus.length > 0)) && (
                  <div className="flex justify-between gap-3 w-full mx-auto flex-col my-4">
                    <h5 className="underline text-primaryRed mb-1 text-sm underline-offset-2">
                      Bonuses
                    </h5>
                    <div className="grid grid-cols-2 gap-x-10 max-w-[600px] min-w-[600px] !w-full">
                      {timesheetDetail?.bonusCount?.map((bonusData, index) => (
                        <div className="" key={+index}>
                          <div className="flex group !text-black justify-center items-center">
                            <div className="w-12 !font-bold text-center leading-[1] !text-sm border border-solid  p-1 border-b-0 group-last:border-b border-r-0 last:border-r h-[30px] flex items-center justify-center !border-gray-300">
                              {bonusData?.bonusType}
                            </div>
                            <div className="w-[calc(100%_-_48px)] text-center !font-bold leading-[1] !text-sm border border-solid  p-1 border-b-0 group-last:border-b border-r-0 last:border-r h-[30px] flex items-center justify-center !border-gray-300">
                              {bonusData?.bonusName}
                            </div>
                          </div>
                        </div>
                      ))}

                      {timesheetDetail?.overtimeWeekendBonus?.map(
                        (bonusData, index) => (
                          <div className="" key={+index}>
                            <div className="flex group !text-black justify-center items-center">
                              <div className="w-12 !font-bold text-center leading-[1] !text-sm border border-solid  p-1 border-b-0 group-last:border-b border-r-0 last:border-r h-[30px] flex items-center justify-center !border-gray-300">
                                {bonusData?.label}
                              </div>
                              <div className="w-[calc(100%_-_48px)] text-center !font-bold leading-[1] !text-sm border border-solid  p-1 border-b-0 group-last:border-b border-r-0 last:border-r h-[30px] flex items-center justify-center !border-gray-300">
                                {bonusData?.title ?? "-"}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between gap-3 w-full mx-auto flex-col my-5">
                  <h5 className="underline text-primaryRed mb-2 text-sm underline-offset-2">
                    Medicals
                  </h5>
                  <div className="grid grid-cols-3 gap-x-10 max-w-[600px] min-w-[600px]">
                    <div className="col-span-3">
                      <table className="pdf-table small">
                        <thead className="h-[30px]">
                          <tr>
                            <th className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm">
                              CHARGE
                            </th>
                            <th className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm">
                              Medical Check
                            </th>
                            <th className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm">
                              Medical Expiry
                            </th>
                          </tr>
                        </thead>
                        <tbody className="before:!hidden h-[30px]">
                          <tr>
                            <td className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold">
                              {timesheetDetail?.employeeData?.loginUserData
                                ?.firstName +
                                " " +
                                timesheetDetail?.employeeData?.loginUserData
                                  ?.lastName}
                            </td>
                            <td className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold">
                              {timesheetDetail?.employeeData
                                ?.medicalCheckDate ?? "-"}
                            </td>
                            <td className="!bg-transparent !p-0 !border-gray-300 !text-black !rounded-none !text-sm !font-bold">
                              {timesheetDetail?.employeeData
                                ?.medicalCheckExpiry ?? "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {timesheetDetail?.isHourlyBonusNote && (
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
              </div>
              <div className="w-full">
                <div className="flex justify-around w-full mx-auto">
                  <div className="">
                    <p className="font-bold leading-[1] !text-sm mb-1 !text-black ">
                      Signature / Stamp:
                    </p>
                    <p className="font-semibold leading-[1] !text-sm mb-1 !text-black">
                      {timesheetDetail.timesheetData.client.loginUserData.name}
                    </p>
                  </div>
                  <div className="">
                    <p className="font-bold leading-[1] !text-sm mb-1 !text-black">
                      Signature / Stamp:
                    </p>
                    <p className="font-bold leading-[1] !text-sm mb-1 !text-black">
                      LRED
                    </p>

                    <img
                      src={`${
                        timesheetDetail?.employeeData?.client?.stampLogo
                          ? String(
                              VITE_APP_API_URL +
                                timesheetDetail?.employeeData?.client?.stampLogo
                            )
                          : "/assets/images/lred-stamp-logo.png"
                      }`}
                      alt="pdfLogo"
                      className="!p-3"
                      style={{ width: "5cm" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};
