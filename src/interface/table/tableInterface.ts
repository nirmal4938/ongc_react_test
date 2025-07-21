import { Dispatch, SetStateAction } from "react";
import { Option } from "../customSelect/customSelect";
import { transportSummaryEnum } from "@/enum/transport";
import { IEmployeeData } from "../employee/employeeInterface";

// TODO add missing types value
export interface ITableHeaderProps {
  header: string;
  name?: string;
  className?: string;
  commonClass?: string;
  isVisible?: "Yes" | "No";
  cell?: (props: {
    id?: string;
    fileName?: string;
    status?: string;
    isActive?: boolean;
    loginUserData?: { name?: string };
    startDate?: Date | string;
    endDate?: Date | string;
    country: string;
    slug?: string;
    employeeDetail?: IEmployeeData;
  }) => React.HTMLAttributes<HTMLOrSVGElement> | string;
  option?: { sort?: boolean };
  imagePath?: string;
}

export interface ITableProps {
  // TODO create Interface for bodyData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyData?: any[];
  headerData?: ITableHeaderProps[];
  loader?: boolean;
  isExternalSegmentDropDown?: boolean;
  isButton?: boolean;
  isFilter?: boolean;
  buttonLink?: string;
  buttonClick?: () => void;
  buttonFilterClick?: () => void;
  buttonText?: string;
  isExport?: boolean;
  exportButtonClick?: () => void;
  isDateRange?: boolean;
  isSearch?: boolean;
  isTab?: boolean;
  tabValue?: number;
  setTab?: (value: number) => void;
  isDropdown?: boolean;
  isUserDropdown?: boolean;
  isClientAllDropdown?: boolean;
  isTerminatatedEmployee?: boolean;
  dropDownClientList?: Option[];
  dropDownSegmentList?: Option[];
  clientDropDownValue?: string | number;
  activeSegmentValue?:any
  isSegmentItemSided?:boolean
  setClientDropdownValue?: (
    value: number | string | (number | string)[]
  ) => void;

  setSegmentDropdownValue?: any;
  dropDownList?: Option[];
  dropDownValue?: string | number;
  setDropdownValue?: (value: number | string | (number | string)[]) => void;
  dataPerPage?: number;
  totalPage?: number;
  dataCount?: number;
  currentPage?: number;
  pagination?: boolean;
  paginationModule?: string;
  isClientDropdown?: boolean;
  isErrorCategoriesDropdown?: boolean;
  isSegmentDropdown?: boolean;
  isEmployeeDropdown?: boolean;
  isEmployeeMedicalStatus?: boolean;
  setSorting?: (string: string) => void;
  sortType?: boolean;
  setSortingType?: (string: boolean) => void;
  setLimit?: (number: number) => void;
  addSubSegment?: boolean;
  dateFilter?: { startDate: Date; endDate: Date };
  setDateFilter?: Dispatch<SetStateAction<{ startDate: Date; endDate: Date }>>;
  tableLastTheadClass?: string;
  summaryTableType?: transportSummaryEnum;
  isUploadFileHeader?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChecked?: React.Dispatch<React.SetStateAction<boolean>>;
  setDocumentId?: React.Dispatch<React.SetStateAction<string>>;
  tableClass?: string;
  showSwitch?: boolean;
  switchClickEvent?: () => void;
  checkedValue?: number[];
  setCheckedValue?: React.Dispatch<React.SetStateAction<number[] | undefined>>;
  isSwitchActive?: boolean;
  isDateSided?: boolean;
  TabList?: { name: string; value: number }[];
  isShowTable?: boolean;
  paginationApiCb?: (searchString: string) => void;
  moduleType?: string;
  searchDropdownData?: Option[];
  isExternalClientDropdown?: boolean;
  clientData?: Option[];
  setActiveClient?: React.Dispatch<React.SetStateAction<string | number>>;
  activeClient?: number | string | null;
  isCheckbox?: boolean;
}
