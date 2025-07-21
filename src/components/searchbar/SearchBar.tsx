import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "../formComponents/button/Button";
import { SearchIcon } from "../svgIcons";
import { useSelector } from "react-redux";
import { employeeSearchDropdownSelector } from "@/redux/slices/employeeSearchDropdownSlice";
import SelectComponent from "../formComponents/customSelect/Select";
import { Option } from "@/interface/customSelect/customSelect";

interface SearchProps {
  parentClass?: string;
  inputClass?: string;
  prevSearch?: string;
  searchText?: string;
  moduleType?: string;
  searchDropdownData?: Option[] | null;
  setSearchText?: Dispatch<SetStateAction<string>>;
  handleSearch?: (value?: string) => void;
  clearSearch?: () => void;
}

const SearchBar = (props: SearchProps) => {
  const employeeDropdownSelector = useSelector(employeeSearchDropdownSelector);
  const [dropdownOptions, setDropdownOptions] = useState<Option[] | null>(null);
  useEffect(() => {
    setDropdownOptions(employeeDropdownSelector.employeeSearchDropdownData);
  }, [employeeDropdownSelector]);

  useEffect(() => {
    props?.searchDropdownData && setDropdownOptions(props?.searchDropdownData);
  }, [props?.searchDropdownData]);

  switch (props?.moduleType) {
    case "EMPLOYEE":
      return searchDropdown(props, dropdownOptions);
    case "TIMESHEET":
      return searchDropdown(props, dropdownOptions);
    case "USERS":
      return searchDropdown(props, dropdownOptions);
    case "CLIENTS":
      return searchDropdown(props, dropdownOptions);
    case "SEGMENTS":
      return searchDropdown(props, dropdownOptions);
    default:
      return (
        <>
          <div
            className={`search-wrap relative h-fit ${
              props.parentClass ? props.parentClass : ""
            } relative flex`}
          >
            <input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props?.setSearchText && props?.setSearchText(e.target.value);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  props.handleSearch && props?.handleSearch();
                }
              }}
              value={props.searchText}
              name=""
              className={`bg-white border border-solid border-black/10 block rounded-lg h-10 pl-3 pr-8 py-2 text-sm/18px font-medium  transition-all duration-300  focus:ring-2 focus:ring-customGray/30 focus:ring-offset-2 ${
                props.inputClass ? props.inputClass : ""
              }`}
              placeholder="Search"
              id=""
            />
            {props.searchText && (
              <span
                title="Cancel"
                onClick={props.clearSearch}
                className={`${
                  !props?.prevSearch?.trim() ? "hidden" : "block"
                } absolute top-[12px] right-11 items-center justify-center cursor-pointer ml-2 !w-5 h-5  text-primaryColor rounded-md  transition-all duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            )}

            <Button
              onClickHandler={() => {
                props.handleSearch?.();
              }}
              icon={<SearchIcon className="w-full h-full" />}
              parentClass="ml-0 h-8 w-8 !absolute top-1/2 -translate-y-1/2 right-1.5"
              type="button"
              iconParentClass="!mr-0 w-4 h-4 2xl:w-[25px] 2xl:h-[25px]"
              className="search_button !py-0.5 !px-0.5 h-full w-full flex items-center justify-center !bg-primaryRed/10 text-primaryRed !ring-0"
            >
              {""}
            </Button>
          </div>
        </>
      );
  }
};

const searchDropdown = (
  props: SearchProps,
  dropdownOptions: Option[] | null
) => {
  return (
    <>
      <div
        className={`search-wrap relative h-fit ${
          props.parentClass ? props.parentClass : ""
        } relative flex [&>*:not(.input-item)]:w-full`}
      >
        <SelectComponent
          options={dropdownOptions ?? []}
          onChange={(option: Option | Option[]) => {
            props?.setSearchText &&
              props?.setSearchText((option as Option).value.toString());
            props.handleSearch &&
              props?.handleSearch((option as Option).value.toString());
          }}
          isInput={true}
          isSearch={true}
          searchText={props?.searchText}
          placeholder="Search Here"
          className={`bg-white ${props.inputClass ? props.inputClass : ""}`}
          selectedValue={props.searchText}
        />
        {props.searchText && (
          <span
            title="Cancel"
            onClick={props.clearSearch}
            className={`${
              !props?.prevSearch?.trim() ? "hidden" : "block"
            } absolute top-[14px] right-11 items-center justify-center cursor-pointer ml-2 !w-5 h-5  text-primaryColor rounded-md  transition-all duration-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        )}

        <Button
          onClickHandler={() => {
            props.handleSearch?.();
          }}
          icon={<SearchIcon className="w-full h-full" />}
          parentClass="ml-0 h-8 w-8 !absolute top-1/2 -translate-y-1/2 right-1.5"
          type="button"
          iconParentClass="!mr-0 w-4 h-4 2xl:w-[25px] 2xl:h-[25px]"
          className="search_button !py-0.5 !px-0.5 h-full w-full flex items-center justify-center !bg-primaryRed/10 text-primaryRed !ring-0"
        >
          {""}
        </Button>
      </div>
    </>
  );
};

export default SearchBar;
