import {
  NewOptions,
  Option,
  SelectComponentProps,
} from "@/interface/customSelect/customSelect";
import { ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import Select, { StylesConfig } from "react-select";
const customStyles: StylesConfig = {
  control: (provided) => ({
    borderRadius: "0.625rem",
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "transparent",
    padding: "2.5px 12px",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    outline: provided.isFocused ? "2px solid #6B070D" : "",
    opacity: provided.isDisabled ? "0.5" : "",
    cursor: provided.isDisabled ? "not-allowed" : "",
  }),
  container: (provided) => ({
    ...provided,
    transition: "all 0.3s",
    borderRadius: "0.625rem",
    boxShadow: provided.isFocused
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
    backgroundColor:
      state.isFocused || state.isSelected ? "#6B070D" : "#ffffff",
    color: state.isFocused || state.isSelected ? "#ffffff" : "#000000",
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

const SelectComponent = (props: SelectComponentProps) => {
  const options = [{ value: "Select", label: "Select" }];
  const [inputValue, setInputValue] = useState<string>("");
  const [propOptions, setPropOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (props.options) {
      if (!props?.searchText) {
        setPropOptions(props.options);
      } else {
        setPropOptions([
          { label: props?.searchText, value: props.searchText },
          ...props?.options,
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.options]);

  useEffect(() => {
    if (inputValue.length === 0 && props?.isSearch) {
      if (props.options) {
        setPropOptions(props.options);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const getValue = () => {
    if (props?.options?.length) {
      // console.log("props/options", props?.options)
      const checkInputValue: any = props?.options?.filter((a) =>
        props?.isSearch
          ? a.label.toLowerCase() === inputValue.toLowerCase()
          : a.label.includes(inputValue)
      );
      if (
        checkInputValue?.length == 0 &&
        !propOptions.find((a) => a.value == inputValue) &&
        inputValue?.length > 0
      ) {
        setPropOptions([
          { label: inputValue, value: inputValue },
          ...props.options,
        ]);
      }
      if (
        props.selectedValue ||
        (typeof props.selectedValue == "number" && props.selectedValue >= 0)
      ) {
        return propOptions?.find(
          (option: Option) => option?.value == props.selectedValue
        );
      } else if (props.isMulti) {
        if (Array.isArray(props.selectedValue)) {
          propOptions?.filter((option: Option) =>
            (props.selectedValue as (string | number)[])?.includes(
              option.value.toString()
            )
          );
        }
      } else {
        propOptions?.find(
          (option: Option) => option?.value == props.selectedValue
        );
      }
    } else if (props.objectOptions) {
      if (props.selectedValue) {
        return findObjectOptions();
      } else if (props.isMulti) {
        if (Array.isArray(props.selectedValue)) {
          return props.objectOptions?.filter((option: NewOptions) =>
            (props.selectedValue as (string | number)[])?.includes(
              option.value.toString()
            )
          );
        }
      } else {
        return findObjectOptions();
      }
    } else {
      return props.isMulti ? [] : ("" as string);
    }
  };

  const findObjectOptions = () => {
    return props.objectOptions?.find(
      (option: NewOptions) => option?.value == props.selectedValue
    );
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
          maxMenuHeight={props.maxMenuHeight}
          className={`w-full ${props.className ? props.className : ""}`}
          styles={
            props?.isSearch
              ? {
                  ...customStyles,
                  valueContainer: (prev) => ({ ...prev, height: "35px" }),
                  dropdownIndicator: () => ({ display: "none" }),
                }
              : customStyles
          }
          menuPlacement={props.menuPlacement}
          value={getValue() ? getValue() : null}
          defaultValue={getValue() ? getValue() : null}
          options={props.objectOptions ?? propOptions ?? options}
          placeholder={
            !props.isEditable
              ? props.placeholder
                ? props.placeholder
                : "Select"
              : "Not Selected"
          }
          onInputChange={(element) => {
            if (props.isInput) {
              setInputValue(element);
            }
          }}
          onChange={(e) => {
            if (e) {
              if (props.onChange) {
                props.onChange(e as Option);
              }
            }
          }}
          onKeyDown={props?.onKeyDown}
          // menuPortalTarget={document.body}
          isDisabled={props.isDisabled}
          isLoading={props.isLoading ?? false}
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

export default SelectComponent;
