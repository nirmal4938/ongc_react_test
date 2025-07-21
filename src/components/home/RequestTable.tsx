import { IClientResponseData } from "@/interface/client/clientInterface";
import { IDashboardData } from "@/interface/dashboard/dashboard";
import moment from "moment";
import { Link } from "react-router-dom";
import { IconEye } from "../svgIcons";
import { NoDataFound } from "./NoDataFound";

const RequestTable = ({
  dashboardData,
}: {
  dashboardData?: IDashboardData;
}) => {
  return (
    <div className="table-wrapper overflow-x-auto">
      {dashboardData && dashboardData?.requestData?.rows?.length > 0 ? (
        <table className="small min-w-[800px] w-full">
          <thead>
            <tr>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Request
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Client
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Name
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Segment
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Contract Number
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Document Total
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Date
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]"></th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.requestData?.rows.map(
              (item: {
                id: number;
                deliveryDate: string;
                name: string;
                contractNumber: number;
                createdAt: string;
                documentTotal: number;
                client: IClientResponseData;
                employee: {
                  segment: {
                    name: string;
                  };
                  subSegment?: {
                    name: string;
                  };
                };
              }) => (
                <tr key={item.id}>
                  <td className="text-left text-grayDark font-medium py-2">
                    {item.createdAt
                      ? moment(item.createdAt).format("DD/MM/YYYY HH:mm")
                      : "-"}
                  </td>
                  <td className="text-left text-grayDark font-medium py-2">
                    {item.client?.loginUserData?.name ?? "-"}
                  </td>
                  <td className="text-left text-grayDark font-medium py-2">
                    {item?.name ?? "-"}
                  </td>
                  <td className="text-left text-grayDark font-medium py-2">
                    {item?.employee?.segment && item?.employee?.subSegment
                      ? item?.employee?.segment?.name +
                        "-" +
                        item?.employee?.subSegment?.name
                      : item?.employee?.segment
                      ? item?.employee?.segment?.name
                      : "-"}
                  </td>
                  <td className="text-left text-grayDark font-medium py-2">
                    {item?.contractNumber ?? "-"}
                  </td>
                  <td className="text-left text-grayDark font-medium py-2">
                    {item?.documentTotal ?? "-"}
                  </td>
                  <td className="text-left text-grayDark font-medium py-2">
                    {item?.deliveryDate
                      ? moment(item.deliveryDate).format("DD/MM/YYYY")
                      : "-"}
                  </td>
                  <td className="text-left text-grayDark font-medium py-2">
                    <Link to={`/requests/${item.id}`}>
                      <span className="w-6 h-6 group relative inline-block cursor-pointer active:scale-95 transition-all select-none">
                        <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                          View
                        </span>
                        <IconEye className="w-full h-full text-primaryRed" />
                      </span>
                    </Link>
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

export default RequestTable;
