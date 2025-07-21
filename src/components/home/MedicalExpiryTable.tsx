import { IDashboardData } from "@/interface/dashboard/dashboard";
import { NoDataFound } from "./NoDataFound";
import moment from "moment";

const MedicalExpiryTable = ({
  dashboardData,
}: {
  dashboardData?: IDashboardData;
}) => {
  return (
    <div className="table-wrapper overflow-x-auto">
      {dashboardData &&
      dashboardData?.totalMedicalExpiryCount?.rows?.length > 0 ? (
        <table className="small w-full">
          <thead>
            <tr>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Name
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.totalMedicalExpiryCount?.rows.map((item) => (
              <tr key={item?.loginUserData.id + item?.loginUserData.code}>
                <td className="text-left text-grayDark font-medium py-2">
                  {item?.loginUserData?.firstName &&
                  item?.loginUserData?.lastName
                    ? item?.loginUserData?.lastName +
                      " " +
                      item?.loginUserData?.firstName
                    : "-"}
                </td>
                <td className="text-left text-grayDark font-medium py-2">
                  {item?.medicalCheckExpiry
                    ? moment(item.medicalCheckExpiry).format("DD/MM/YYYY")
                    : "-"}
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

export default MedicalExpiryTable;
