import { IDashboardData } from "@/interface/dashboard/dashboard";
import moment from "moment";
import { NoDataFound } from "./NoDataFound";

const FailedLoginsTable = ({
  dashboardData,
}: {
  dashboardData?: IDashboardData;
}) => {
  return (
    <div className="table-wrapper overflow-x-auto">
      {dashboardData && dashboardData.failedLoginData.length > 0 ? (
        <table className="small w-full">
          <thead>
            <tr>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Date
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Time
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Email Address
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2] w-24">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.failedLoginData.map((item) => (
              <tr key={item.createdAt}>
                <td className="text-left text-grayDark font-medium py-2">
                  {item.createdAt
                    ? moment(item.createdAt).format("DD/MM/YYYY")
                    : "-"}
                </td>
                <td className="text-left text-grayDark font-medium py-2">
                  {item.createdAt
                    ? moment(item.createdAt).format("hh:mm")
                    : "-"}
                </td>
                <td className="text-left text-grayDark font-medium py-2">
                  {item.email ?? "-"}
                </td>
                <td className="text-left text-grayDark font-medium py-2">
                  <span className="bg-tomatoRed/10 text-tomatoRed inline-block text-xs font-bold px-2 py-1 rounded">
                    {item.status ?? "-"}
                  </span>
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

export default FailedLoginsTable;
