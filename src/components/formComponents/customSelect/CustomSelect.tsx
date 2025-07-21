import { ICustomSelect, Option } from "@/interface/customSelect/customSelect";
import { ErrorMessage, useField } from "formik";
import Select, { StylesConfig } from "react-select";

const customStyles: StylesConfig = {
  control: (state) => ({
    borderRadius: "0.625rem",
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "transparent",
    padding: "2.5px 12px",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    outline: state.isFocused ? "2px solid #6B070D" : "",
  }),
  container: (provided, state) => ({
    ...provided,
    transition: "all 0.3s",
    borderRadius: "0.625rem",
    boxShadow: state.isFocused
      ? "0 0 0 2px #ffffff, 0 0 0 4px rgba(0, 0, 0, 0.2)"
      : "",
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: "flex",
    padding: "0",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "rgba(107, 7, 13, 0.1)",
    borderRadius: "100px",
    cursor: "pointer",
    color: "rgba(107, 7, 13, 1)",
    padding: "5px 5px 5px 1px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "rgba(107, 7, 13, 1)",
    padding: "0",
    fontWeight: "600",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "var(--White)",
    backgroundColor: "var(--themeColor)",
    borderRadius: "100px",
    marginLeft: "10px",
    transition: "all 0.3s",
    "&:hover": {
      backgroundColor: "var(--White)",
      color: "var(--themeColor)",
    },
    padding: "0 2.3px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 100,
    backgroundColor: "gray",
    borderRadius: "0",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
  }),
  menuList: (provided) => ({
    ...provided,
    color: "#ffffff",
    backgroundColor: "#6B070D",
    padding: "00",
    borderRadius: "0",
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--GrayDark)",
    backgroundColor: "transparent",
    position: "absolute",
    margin: "0",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: "0.875rem",
    lineHeight: " 1.0625rem",
    fontWeight: " 600",
    cursor: "pointer",
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
    padding: "5px 10px",
    fontSize: " 15px",
    backgroundColor: state.isFocused ? "#6B070D" : "#ffffff",
    color: state.isFocused ? "#ffffff" : "#000000",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "var(--themeColor)",
      color: "#ffffff",
    },
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    backgroundColor: "#ffffff",
    borderRadius: "0",
    color: "#000000",
    fontWeight: " 600",
    "&:hover": {},
  }),
  placeholder: (provided) => {
    return {
      ...provided,
      color: "rgba(0, 0, 0, 0.7)",
      fontSize: " 15px",
      lineHeight: " 24px",
      fontWeight: " 600",
      letterSpacing: " 0.05em",
    };
  },
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

export const CustomSelect = (props: ICustomSelect) => {
  const {
    isSearchable,
    onChange,
    placeholder,
    options,
    isCompulsory,
    isMulti = false,
    label,
    labelClass,
    disabled,
    selectedValue,
    parentClass,
    className,
    isLoading = false,
    ...rest
  } = props;

  const [field, , helpers] = useField(rest);

  const handleChange = (option: Option | Option[]) => {
    helpers.setValue(
      isMulti
        ? (option as Option[]).map((item: Option) => item.value)
        : (option as Option).value
    );
  };

  const getValue = (): string | Option | Option[] | undefined => {
    if (!options) {
      return isMulti ? [] : "";
    }

    if (selectedValue) {
      if (typeof selectedValue === "object") {
        return options.filter((option: Option) =>
          selectedValue.includes(String(option?.value))
        );
      } else {
        return options.find(
          (option: Option) => option?.value === selectedValue
        );
      }
    } else if (isMulti) {
      if (Array.isArray(field?.value)) {
        return options.filter(
          (option: Option) => field?.value?.indexOf(option.value) >= 0
        );
      }
    }
    return [];
  };
  return (
    <div className={`custom-select-wrap relative ${parentClass ?? ""}`}>
      {label && (
        <label
          className={`block mb-10px text-sm/18px text-left font-semibold ${
            labelClass ?? ""
          }`}
        >
          {label}
          {isCompulsory && <span className="text-red">*</span>}
        </label>
      )}
      <Select
        isSearchable={isSearchable}
        styles={customStyles}
        onChange={(e) => {
          onChange
            ? onChange(e as Option | Option[])
            : handleChange(e as Option | Option[]);
        }}
        name={rest.name}
        value={getValue() ? getValue() : null}
        placeholder={placeholder ?? ""}
        options={options}
        isMulti={isMulti}
        menuPlacement={props?.menuPlacement}
        isDisabled={disabled}
        className={className ?? ""}
        menuPortalTarget={document.body}
        isLoading={isLoading}
        menuShouldScrollIntoView={false}
      />

      <ErrorMessage name={rest.name}>
        {(msg) => (
          <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
            {msg}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};

export default CustomSelect;
