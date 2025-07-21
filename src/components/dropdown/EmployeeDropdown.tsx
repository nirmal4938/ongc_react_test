import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setActiveEmployee,
  activeEmployeeSelector,
} from "@/redux/slices/employeeSlice";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { GroupOption, Option } from "@/interface/customSelect/customSelect";
import GroupSelectComponent from "../formComponents/customSelect/GroupSelect";
import { setEmployeeDropdownOptions } from "@/helpers/Utils";

const EmployeeDropdown = (isTerminatatedEmployee?: {isTerminatatedEmployee: boolean}) => {
  const activeClient = useSelector(activeClientSelector);
  const dispatch = useDispatch();
  const [options, setOptions] = useState<GroupOption[]>([]);
  const activeEmployee = useSelector(activeEmployeeSelector);

  const fetchAllDetails = async () => {
    if (Number(activeClient) > 0 && isTerminatatedEmployee) {
      setOptions(
        await setEmployeeDropdownOptions(
          Number(activeClient),
          isTerminatatedEmployee.isTerminatatedEmployee
        )
      );
    }
  };

  useEffect(() => {
    if (
      activeEmployee &&
      options?.find((opt) =>
        opt.options?.find((value) => value?.value == activeEmployee)
      )
    ) {
      dispatch(setActiveEmployee(activeEmployee));
    } else if (options?.length > 0) {
      dispatch(setActiveEmployee(Number(options[0]?.options[0]?.value)));
    }
    //  else {
    //   dispatch(setActiveEmployee(0));
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    fetchAllDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  return (
    <>
      <GroupSelectComponent
        className="bg-white"
        parentClass="min-w-[270px]"
        options={options}
        placeholder="Select Employee"
        onChange={(e: Option) => {
          dispatch(setActiveEmployee(e.value));
        }}
        selectedValue={activeEmployee}
      />

      {/* {isShowMedicalStatus &&
        activeEmployeeData &&
        activeEmployeeData?.medicalCheckDate &&
        activeEmployeeData?.medicalCheckExpiry &&
        `Medical ${moment(activeEmployeeData?.medicalCheckDate).format(
          "DD/MM/YYYY"
        )}, ${moment(activeEmployeeData?.medicalCheckExpiry).format(
          "DD/MM/YYYY"
        )}`} */}
    </>
  );
};

export default EmployeeDropdown;
