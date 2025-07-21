import { IDashboardTransportData } from "@/interface/dashboard/dashboard";
import { NoDataFound } from "./NoDataFound";

const TransPortBookedVehicle = ({
  transportData,
}: {
  transportData?: IDashboardTransportData;
}) => {
  return (
    <div className="table-wrapper overflow-x-auto">
      {transportData && transportData?.bookedVehiclesData?.length > 0 ? (
        <table className="small w-full">
          <thead>
            <tr>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Vehicle
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Dates
              </th>
            </tr>
          </thead>
          <tbody>
            {transportData?.bookedVehiclesData.map(
              (item: {
                vehicleNo: string;
                id: number;
                unavailableDates: string;
              }) => (
                <tr key={item.id}>
                  <td className="text-grayDark font-medium py-2">
                    {item?.vehicleNo}
                  </td>
                  <td className="text-grayDark font-medium py-2 ">
                    {item?.unavailableDates}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default TransPortBookedVehicle;
