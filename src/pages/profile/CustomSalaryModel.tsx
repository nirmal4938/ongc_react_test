import Modal from "@/components/modal/Modal";
import { useSelector } from "react-redux";
import { userSelector } from "@/redux/slices/userSlice";
import {
  DefaultRoles,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { FormatDate } from "@/helpers/Utils";
interface CustomBonusModelTimesheetTableProp {
  employeeName: string;
  setModel: (status: boolean) => void;
  customSalary?: {
    baseSalary: number;
    monthlySalary: number;
    dailyCost: number;
    startDate: string;
    endDate: string;
  }[];
  currencyCode?: string | null;
  terminationDate?: string | Date | null;
}
const CustomSalaryModel = (props: CustomBonusModelTimesheetTableProp) => {
  const { getPermissions } = usePermission();
  const user = useSelector(userSelector);

  const renderSalaryHistory = () => {
    if (props?.customSalary && props?.customSalary?.length > 0) {
      return props.customSalary?.map(
        (data: {
          baseSalary: number;
          monthlySalary: number;
          dailyCost: number;
          startDate: string;
          endDate: string;
        }) => {
          return (
            <tr key={Math.floor(Math.random() * 1000) + 1}>
              <td className="py-3 font-medium text-sm/18px">
                {data?.baseSalary?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) +
                  " " +
                  (props?.currencyCode && props?.currencyCode !== null
                    ? props?.currencyCode
                    : "")}
              </td>
              <td className="py-3 font-medium text-sm/18px">
                {data?.monthlySalary?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) +
                  " " +
                  (props?.currencyCode && props?.currencyCode !== null
                    ? props?.currencyCode
                    : "")}
              </td>
              {(user?.roleData?.name === DefaultRoles?.Admin ||
                getPermissions(
                  FeaturesNameEnum.DailyRate,
                  PermissionEnum.View
                )) && (
                <td className="py-3 font-medium text-sm/18px">
                  {data?.dailyCost?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) +
                    " " +
                    (props?.currencyCode && props?.currencyCode !== null
                      ? props?.currencyCode
                      : "")}
                </td>
              )}
              <td className="py-3 font-medium text-sm/18px">
                {FormatDate(data?.startDate)}
                {"-"}
                {data?.endDate !== null
                  ? FormatDate(data?.endDate)
                  : props?.terminationDate
                  ? FormatDate(props?.terminationDate)
                  : "ToDate"}
              </td>
            </tr>
          );
        }
      );
    } else {
      <tr key={Math.floor(Math.random() * 1000) + 1}>
        <td className="py-3 font-medium text-sm/18px">"No Data Found</td>
      </tr>;
    }
  };
  return (
    <>
      <Modal
        title={props.employeeName}
        width="max-w-[709px]"
        closeModal={() => props.setModel(false)}
        hideFooterButton={true}
        okbtnText="Ok"
        hideCancelButton={true}
        onClickHandler={() => {
          props.setModel(false);
        }}
      >
        {props?.customSalary && Object.keys(props.customSalary)?.length > 0 ? (
          <div className="table-wrapper overflow-x-auto ">
            <table className="small w-full">
              <thead>
                <tr>
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                    Base Salary
                  </th>
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                    Monthly Salary
                  </th>
                  {(user?.roleData?.name === DefaultRoles?.Admin ||
                    getPermissions(
                      FeaturesNameEnum.DailyRate,
                      PermissionEnum.View
                    )) && (
                    <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                      Daily Cost
                    </th>
                  )}
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2] w-24">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>{renderSalaryHistory()}</tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};
export default CustomSalaryModel;
