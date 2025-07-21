import Modal from "@/components/modal/Modal";
import { GetAllBonusType } from "@/services/bonusTypeService";
import { useEffect, useState } from "react";
import { IBonusTypeData } from "@/interface/bonusType/bonusTypeInterface";
import SpinLoader from "@/components/SiteLoder/spinLoader";
import moment from "moment";
import { useSelector } from "react-redux";
import { userSelector } from "@/redux/slices/userSlice";
import {
  DefaultRoles,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
interface CustomBonusModelTimesheetTableProp {
  employeeName: string;
  setModel: (status: boolean) => void;
  customBonus: {
    coutJournalier: number;
    startDate: Date;
    endDate: Date | null;
    id: string;
    price: number;
    bonus: {
      id: number;
      name: string;
      code: string;
    };
  }[];
  currency?: string;
}
const CustomBonusModel = (props: CustomBonusModelTimesheetTableProp) => {
  const { getPermissions } = usePermission();
  const user = useSelector(userSelector);
  const [bonusData, setBonusData] = useState<IBonusTypeData[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  useEffect(() => {
    getAllAPIs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllAPIs = async () => {
    setLoader(true);
    await fetchAllBonus();
    setLoader(false);
  };

  async function fetchAllBonus() {
    // if (getPermissions(
    //   FeaturesNameEnum.BonusType,
    //   PermissionEnum.View
    // )) {
    const response = await GetAllBonusType("");
    if (response?.data?.responseData?.data) {
      setBonusData(response?.data?.responseData?.data);
    }
    // }
  }
  const renderBonus = () => {
    if (loader) {
      return (
        <tr key={Math.floor(Math.random() * 1000) + 1}>
          <td className="py-3 font-medium text-sm/18px" colSpan={4}>
            <span className="flex justify-center">
              <SpinLoader />
            </span>
          </td>
        </tr>
      );
    } else if (props.customBonus?.length > 0 && bonusData?.length > 0) {
      return props.customBonus?.map(
        (data: {
          coutJournalier: number;
          startDate: Date;
          endDate: Date | null;
          id: string;
          price: number;
          bonus: {
            id: number;
            name: string;
            code: string;
          };
        }) => {
          const newData = bonusData?.find(
            (bonus) => bonus?.id === Number(data?.bonus?.id)
          );
          return (
            <tr key={Math.floor(Math.random() * 1000) + 1}>
              <td className="py-3 font-medium text-sm/18px">{newData?.code}</td>
              <td className="py-3 font-medium text-sm/18px">{newData?.name}</td>
              <td className="py-3 font-medium text-sm/18px">
                {data?.price?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) +
                  " " +
                  (props?.currency && props?.currency !== null
                    ? props?.currency
                    : " ")}
              </td>
              {(user?.roleData?.name === DefaultRoles?.Admin ||
                getPermissions(
                  FeaturesNameEnum.DailyRate,
                  PermissionEnum.View
                )) && (
                <td className="py-3 font-medium text-sm/18px">
                  {data?.coutJournalier?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) +
                    " " +
                    (props?.currency && props?.currency !== null
                      ? props?.currency
                      : " ")}
                </td>
              )}
              <td className="py-3 font-medium text-sm/18px">
                {data?.startDate
                  ? `${moment(data.startDate).format("DD/MM/YYYY")} - ${
                      data?.endDate
                        ? moment(data.endDate).format("DD/MM/YYYY")
                        : "ToDate"
                    }`
                  : "-"}
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
        {props?.customBonus && Object.keys(props.customBonus)?.length > 0 ? (
          <div className="table-wrapper overflow-x-auto ">
            <table className="small w-full">
              <thead>
                <tr>
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                    Code
                  </th>
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                    Name
                  </th>
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2]">
                    Bonus
                  </th>
                  {(user?.roleData?.name === DefaultRoles?.Admin ||
                    getPermissions(
                      FeaturesNameEnum.DailyRate,
                      PermissionEnum.View
                    )) && (
                    <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2] w-24">
                      Cout Journalier
                    </th>
                  )}
                  <th className="text-left text-black font-semibold py-3 border-b border-solid border-[#e2e2e2] bg-[#e2e2e2] w-24">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>{renderBonus()}</tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};
export default CustomBonusModel;
