import { ErrorMessage, useField } from "formik";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface ITextField {
  label?: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  InputClassName?: string;
  LabelClassName?: string;
  parentClassName?: string;
  required?: boolean;
  setFieldTouched?: (
    field: string,
    isTouched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => void;
}

const PhoneNumberInput = ({
  label,
  name,
  disabled,
  placeholder,
  InputClassName,
  LabelClassName,
  parentClassName,
  required,
  setFieldTouched,
}: ITextField) => {
  const [field, , helpers] = useField(name);

  return (
    <>
      <div className={parentClassName}>
        {label && (
          <label
            className={`block mb-10px text-sm/18px text-left font-semibold ${
              LabelClassName ? LabelClassName : ""
            }`}
          >
            {label}
            {required && <span className="text-red">*</span>}
          </label>
        )}
        <PhoneInput
          placeholder={placeholder}
          disabled={disabled}
          className={InputClassName}
          value={field.value}
          international={true}
          defaultCountry="US"
          addInternationalOption={false}
          focusInputOnCountrySelection={true}
          onChange={(value) => {
            helpers.setValue(value ? value : "");
          }}
          onBlur={() => {
            if (setFieldTouched) setFieldTouched(name, true, true);
          }}
          limitMaxLength={true}
        />
        <ErrorMessage name={name}>
          {(msg) => {
            return (
              <div
                className="fm_error text-sm pt-[4px] font-BinerkaDemo"
                style={{ color: "red" }}
              >
                {msg}
              </div>
            );
          }}
        </ErrorMessage>
      </div>
    </>
  );
};

export default PhoneNumberInput;
