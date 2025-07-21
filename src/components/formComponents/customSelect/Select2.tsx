import { Option } from "@/interface/customSelect/customSelect";
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
      maxHeight:'70px',
      overflowY: 'auto',
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
      position: "relative",
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
const SelectComponent2 = (props: any) => {
    
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
    }, [props.options]);
  
    useEffect(() => {
      if (inputValue.length === 0 && props?.isSearch) {
        if (props.options) {
          setPropOptions(props.options);
        }
      }
    }, [inputValue, props]);
  
    const getValue = () => {
      if (props.isMulti) {
        // Handle multiple values
        return propOptions?.filter((option: Option) =>
          (props.selectedValue as (string | number)[]).includes(option.value)
        );
      } else {
        // Handle single value
        return propOptions?.find(
          (option: Option) => option?.value == props.selectedValue
        );
      }
    };
  
    return (
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
          value={getValue()}
          defaultValue={getValue()}
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
          isDisabled={props.isDisabled}
          isLoading={props.isLoading ?? false}
          isMulti={props.isMulti} // Add isMulti prop
        />
        {/* {props.name && (
          <ErrorMessage name={props.name}>
            {(msg) => (
              <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
                {msg}
              </div>
            )}
          </ErrorMessage>
        )} */}
      </div>
    );
  };
  export default SelectComponent2;