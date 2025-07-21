import { IDashboardTransportData } from "@/interface/dashboard/dashboard";
import { NoDataFound } from "./NoDataFound";
const TransPortBookedDriver = ({
  transportData,
}: {
  transportData?: IDashboardTransportData;
}) => {
  return (
    <div className="table-wrapper overflow-x-auto">
      {transportData && transportData?.bookedDriverData?.length > 0 ? (
        <table className="small w-full">
          <thead>
            <tr>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Driver
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Dates
              </th>
            </tr>
          </thead>
          <tbody>
            {transportData?.bookedDriverData?.map((item) => (
              <tr key={item.id}>
                <td className="text-grayDark font-medium py-2">
                  {item?.driverNo}
                </td>
                <td className="text-grayDark font-medium py-2">
                  {item?.unavailableDates}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default TransPortBookedDriver;
