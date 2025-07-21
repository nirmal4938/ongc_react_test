import { IDashboardData } from "@/interface/dashboard/dashboard";
import { NoDataFound } from "./NoDataFound";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { usePermission } from "@/context/PermissionProvider";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { EditIocn } from "../svgIcons";

const ContractEndTable = ({
  dashboardData,
}: {
  dashboardData?: IDashboardData;
}) => {
  const navigate = useNavigate();
  const { getPermissions } = usePermission();
  return (
    <div className="table-wrapper overflow-x-auto">
      {dashboardData && dashboardData?.totalContractEndData?.length > 0 ? (
        <table className="small w-full">
          <thead>
            <tr>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Contract End Date
              </th>
              <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                Name
              </th>
              {getPermissions(
                FeaturesNameEnum.ContractEnd,
                PermissionEnum.Update
              ) && (
                <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dashboardData?.totalContractEndData?.map((item) => (
              <tr key={item?.employeeDetail?.id}>
                <td className="text-left text-grayDark font-medium py-2">
                  {item.employeeDetail?.contractEndDate
                    ? moment(item.employeeDetail?.contractEndDate).format(
                        "DD/MM/YYYY"
                      )
                    : "-"}
                </td>
                <td className="text-left text-grayDark font-medium py-2">
                  {item.employeeDetail?.loginUserData?.firstName &&
                  item.employeeDetail?.loginUserData?.lastName
                    ? item.employeeDetail?.loginUserData?.lastName +
                      " " +
                      item.employeeDetail?.loginUserData?.firstName
                    : "-"}
                </td>
                {getPermissions(
                  FeaturesNameEnum.ContractEnd,
                  PermissionEnum.Update
                ) && (
                  <td className="text-left text-grayDark font-medium py-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="relative group w-7 h-7 inline-flex cursor-pointer items-center justify-center active:scale-90 transition-all duration-300 origin-center hover:bg-black/10 text-dark p-1 rounded active:ring-2 active:ring-current active:ring-offset-2"
                        onClick={() => {
                          navigate(
                            item?.id != undefined
                              ? `/contract/summary/edit/${item?.id}`
                              : "/contract/summary/add/",
                            {
                              state: {
                                contractName: item?.contractName,
                                employeeId: item?.employeeDetail?.id,
                              },
                            }
                          );
                        }}
                      >
                        <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                          Edit
                        </span>
                        <EditIocn className="w-ful h-full pointer-events-none" />
                      </span>
                    </div>
                  </td>
                )}
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

export default ContractEndTable;
