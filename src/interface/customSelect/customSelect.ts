export interface Option {
  label: string;
  value: number | string;
  type?: boolean;
}
export interface GroupOption {
  label: string;
  options: (Option | undefined)[];
}

export interface NewOptions {
  label: string;
  value: { type: string; id: number | string };
}

export interface SelectComponentProps {
  parentClass?: string;
  isEditable?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  name?: string;
  selectedValue?: string | number | (string | number)[] | object | null;
  options?: Option[];
  objectOptions?: NewOptions[];
  onChange?: (option: Option | Option[]) => void;
  labelClass?: string;
  isCompulsory?: boolean;
  isMulti?: boolean;
  isDisabled?: boolean;
  maxMenuHeight?: number;
  isLoading?: boolean;
  isInput?: boolean;
  isSearch?: boolean;
  searchText?: string;
  onKeyDown?: (element: React.KeyboardEvent<HTMLInputElement>) => void;
  menuPlacement?: "top" | "bottom" | "auto";
}

export interface GroupSelectComponentProps {
  parentClass?: string;
  placeholder?: string;
  className?: string;
  label?: string;
  name?: string;
  selectedValue?: string | number | (string | number)[] | null;
  options: GroupOption[];
  onChange?: (option: Option) => void;
  labelClass?: string;
  isCompulsory?: boolean;
  isMulti?: boolean;
}

export interface ICustomSelect {
  inputClass: string;
  isMulti: boolean;
  isUseFocus: boolean;
  label?: string;
  labelClass?: string;
  name: string;
  options: Option[];
  placeholder?: string;
  selectedValue?: string | string[];
  isCompulsory?: boolean;
  Margin?: string;
  Width?: string;
  onChange?: (option: Option | Option[]) => void;
  disabled?: boolean;
  variant?: "1" | "2" | "3";
  isSearchable?: boolean;
  isClearable?: boolean;
  typeAdd?: string;
  parentClass?: string;
  className?: string;
  isLoading?: boolean;
  menuPlacement?: "top" | "bottom" | "auto";
  useDefaultChange?: boolean;
  isHideCrossIcon?: boolean;
}
