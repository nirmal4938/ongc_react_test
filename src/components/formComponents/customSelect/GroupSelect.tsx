import {
  GroupOption,
  GroupSelectComponentProps,
  Option,
} from "@/interface/customSelect/customSelect";
import { ErrorMessage } from "formik";
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
  group: (provided) => ({
    ...provided,
    paddingTop: "4px",
    "&:not(:last-child)": {
      paddingBottom: "0",
    },
  }),
  groupHeading: (provided) => ({
    ...provided,
    display: "flex",
    backgroundColor: "#e8e8e8",
    color: "#000000",
    fontWeight: "700",
    padding: "3px 10px",
    "& + div": {
      // paddingLeft: '10px',
      // paddingRight: '10px',
    },
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
    color: "#999999",
    backgroundColor: "#ffffff",
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
    transition: "all 0.3s",
    "&:hover": {
      backgroundColor: "#6B070D",
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

const GroupSelectComponent = (props: GroupSelectComponentProps) => {
  const getValue = () => {
    let value = null;
    if (props.options && props.selectedValue) {
      props.options?.map((opt: GroupOption) => {
        opt?.options?.map((values: Option|undefined) => {
          if (values?.value == props?.selectedValue) value = values;
        });
      });
      return value;
    }
    return value;
  };
  return (
    <>
      <div className={`${props.parentClass ? props.parentClass : ""}`}>
        {props.label && (
          <label className="block mb-10px text-sm/18px text-left font-semibold">
            {props.label}
            {props.isCompulsory && <span className="text-red">*</span>}
          </label>
        )}
        <Select
          className={`w-full ${props.className ? props.className : ""}`}
          value={getValue() ? getValue() : null}
          options={props.options}
          styles={customStyles}
          placeholder={props.placeholder ? props.placeholder : "Select"}
          onChange={(e) => {
            if(e) {
              props.onChange?.(e as Option);
            }
          }}
          menuPortalTarget={document.body}
        />
        {props.name && (
          <ErrorMessage name={props.name}>
            {(msg) => (
              <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
                {msg}
              </div>
            )}
          </ErrorMessage>
        )}
      </div>
    </>
  );
};

export default GroupSelectComponent;
