import { Dispatch, SetStateAction, useState } from "react";
import Radio from "../radio/Radio";
import EmployeeDropdown from "../dropdown/EmployeeDropdown";
import Modal from "../modal/Modal";
import DateRange from "../formComponents/dateRange/DateRange";
import { useSelector } from "react-redux";
import { activeEmployeeSelector } from "@/redux/slices/employeeSlice";
import moment from "moment";

const MedicalFilter = ({
  handleFilter,
  setOpenFilter,
  dateFilter,
  setDateFilter,
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: string;
  setSelectedValue: Dispatch<React.SetStateAction<string>>;
  dateFilter: { startDate: Date; endDate: Date };
  setDateFilter: Dispatch<SetStateAction<{ startDate: Date; endDate: Date }>>;
  handleFilter: (queryString: string, pageNumber: number) => void;
  setOpenFilter: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const activeEmployee = useSelector(activeEmployeeSelector);
  const currentDate = new Date(),
    year = currentDate.getFullYear(),
    month = currentDate.getMonth();
  const initialDateRange = {
    startDate: new Date(year, month, 1),
    endDate: new Date(year, month + 1, 0),
  };
  const [loader, setLoader] = useState<boolean>(false);

  const handleApplyFilter = () => {
    setLoader(true);
    if (selectedValue === "user") {
      setDateFilter(initialDateRange);
      const queryString = `&employeeId=${activeEmployee ? activeEmployee : ""}`;
      handleFilter(queryString, 1);
    }
    if (selectedValue === "dateRange") {
      const queryString = `&startDate=${moment(dateFilter.startDate).format(
        "YYYY/MM/DD"
      )}&endDate=${moment(dateFilter.endDate).format("YYYY/MM/DD")}`;
      handleFilter(queryString, 1);
    }
    setLoader(false);
    setOpenFilter(false);
  };

  const cancelFilter = () => {
    handleFilter("", 1);
    setSelectedValue("user");
    setDateFilter(initialDateRange);
    setOpenFilter(false);
  };

  return (
    <div>
      <Modal
        hideFooterButton={false}
        loaderButton={loader}
        width="max-w-[450px]"
        title={""}
        okbtnText="Apply Filter"
        closeModal={cancelFilter}
        onClickHandler={handleApplyFilter}
        parentClass=""
        modalBodyClass="overflow-unset"
      >
        <>
          <div className="flex gap-5 w-full p-1 mb-5">
            <Radio
              name="filterType"
              label="By User"
              labelClass="!text-black whitespace-nowrap"
              value={"user"}
              id="filterTypeUser"
              onChangeHandler={(e) => setSelectedValue(e.target.value)}
              checked={selectedValue === "user"}
            />
            <Radio
              name="filterType"
              label="By Date Range"
              id="filterTypeDateRange"
              labelClass="!text-black whitespace-nowrap"
              value={"dateRange"}
              onChangeHandler={(e) => setSelectedValue(e.target.value)}
              checked={selectedValue === "dateRange"}
            />
          </div>
          {selectedValue && selectedValue === "user" && (
            <div className="px-1">
              <EmployeeDropdown isTerminatatedEmployee={false}/>
            </div>
          )}
          {selectedValue && selectedValue === "dateRange" && (
            <div className="px-1">
              <DateRange
                className="w-full"
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
            </div>
          )}
        </>
      </Modal>
    </div>
  );
};

export default MedicalFilter;
