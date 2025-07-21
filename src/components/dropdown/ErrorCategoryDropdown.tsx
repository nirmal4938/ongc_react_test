import { useEffect, useState } from "react";
import SelectComponent from "../formComponents/customSelect/Select";
import { useDispatch, useSelector } from "react-redux";
import { Option } from "@/interface/customSelect/customSelect";
import {
  activeErrorSelector,
  errorDataSelector,
  setActiveError,
  setErrorData,
} from "@/redux/slices/errorCategoriesSlice";
import { GetErrorLogDataByCategories } from "@/services/errorLogService";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { usePermission } from "@/context/PermissionProvider";
import { DefaultState } from "@/utils/commonConstants";

const ErrorCategoriesDropdown = ({ label = "", isCompulsory = false }) => {
  const { pageState } = usePermission();
  const pageStateData =
    pageState?.state == DefaultState.ErrorLog ? pageState?.value : {};
  const errorDetails = useSelector(errorDataSelector);
  const activeClient = useSelector(activeClientSelector);
  let activeErrorCategories = useSelector(activeErrorSelector);
  activeErrorCategories = pageStateData?.activeError ?? activeErrorCategories;
  const dispatch = useDispatch();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!errorDetails?.length && activeClient) {
      fetchAllErrorCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  useEffect(() => {
    if (errorDetails) {
      let resp: Option[] = errorDetails.map((data: { type: string }) => {
        return { label: data?.type, value: data?.type };
      });
      resp = [{ label: "All", value: "all" }, ...resp];
      resp && setOptions(resp);
      dispatch(setActiveError(pageStateData?.activeError ?? String(resp[0].value)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorDetails]);

  const fetchAllErrorCategories = async () => {
    const response = await GetErrorLogDataByCategories(
      `?clientId=${activeClient}`
    );
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      dispatch(setErrorData(result));
      dispatch(setActiveError(pageStateData?.activeError ?? result[0].type));
    }
  };

  return (
    <>
      <SelectComponent
        // name={""}
        options={options}
        parentClass="1300:w-[200px] 1400:w-[270px] 1700:w-[340px]"
        onChange={(option: Option | Option[]) => {
          dispatch(setActiveError((option as Option).value.toString()));
        }}
        label={label}
        selectedValue={pageStateData?.activeError ?? activeErrorCategories}
        isCompulsory={isCompulsory}
        placeholder={"Select Error Category"}
        className="bg-white"
      />
    </>
  );
};

export default ErrorCategoriesDropdown;
