import { useEffect, useState } from "react";
import SelectComponent from "../formComponents/customSelect/Select";
import { GetClientData } from "@/services/clientService";
import { useDispatch, useSelector } from "react-redux";
import {
  clientDataSelector,
  setClientData,
  setActiveClient,
  activeClientSelector,
} from "@/redux/slices/clientSlice";
import { Option } from "@/interface/customSelect/customSelect";
import { userSelector } from "@/redux/slices/userSlice";
import { DefaultRoles } from "@/utils/commonConstants";
import { GetSlugByUserId } from "@/services/employeeService";
import { setActiveEmployee } from "@/redux/slices/employeeSlice";

const ClientDropdown = ({
  label = "",
  isCompulsory = false,
  parentClass = "",
  isUpdateGlobal = true,
  updateFunction,
}: {
  label?: string;
  isCompulsory?: boolean;
  parentClass?: string;
  isUpdateGlobal?: boolean;
  updateFunction?: (newValue: string | number) => void;
}) => {
  const clientDetails = useSelector(clientDataSelector);
  const activeClient = useSelector(activeClientSelector);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const [options, setOptions] = useState<Option[]>([]);
  const [localClientValue, setLocalClientValue] = useState(activeClient);

  useEffect(() => {
    if (!clientDetails?.length) {
      fetchAllClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (clientDetails) {
      const resp: Option[] | Option = [];
      for (const i in clientDetails) {
        if (clientDetails[i]?.loginUserData?.name) {
          resp.push({
            label: String(clientDetails[i]?.loginUserData?.name),
            value: String(clientDetails[i]?.id),
          });
        }
      }
      resp && setOptions(resp);
    }
  }, [clientDetails]);

  const fetchAllClients = async () => {
    const response = await GetClientData("");
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      dispatch(setClientData(result?.data));
      dispatch(setActiveClient(result?.data[0]?.id ?? 0));
    }
  };

  return (
    <SelectComponent
      // name="clientId"
      options={options}
      parentClass={
        parentClass.trim().length > 1
          ? parentClass
          : "1200:w-[290px] 1700:w-[340px]"
      }
      onChange={async (option: Option | Option[]) => {
        if (isUpdateGlobal) {
          if (user?.roleData?.name === DefaultRoles?.Employee) {
            const slug = await GetSlugByUserId(
              Number((option as Option).value)
            );
            dispatch(setActiveEmployee(slug?.data?.responseData?.id));
          }
          dispatch(setActiveClient((option as Option).value));
        } else {
          updateFunction?.((option as Option).value);
          setLocalClientValue((option as Option).value);
        }
      }}
      isDisabled={user?.roleData?.name === DefaultRoles.Client}
      label={label}
      selectedValue={isUpdateGlobal ? activeClient : localClientValue}
      isCompulsory={isCompulsory}
      placeholder={"Select Client"}
      className="bg-white"
    />
  );
};

export default ClientDropdown;
