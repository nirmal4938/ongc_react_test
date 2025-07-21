import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import TextField from "@/components/formComponents/textField/TextField";
import { countries } from "../../../src/json/country.json";
import { Option } from "@/interface/customSelect/customSelect";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { ErrorMessage, Form, Formik, FormikProps, FormikValues } from "formik";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import Textarea from "@/components/formComponents/textarea/Textarea";
import { IClientData } from "@/interface/client/clientInterface";
import {
  AddClientData,
  EditClientData,
  GetClientDataById,
} from "@/services/clientService";
import { ClientValidationSchema } from "@/validations/client/ClientValidation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clientDataSelector, setClientData } from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { replaceStringToArray } from "@/helpers/Utils";
import { timezones } from "../../../src/json/timezone.json";
import ProfilePictureUpload from "@/components/formComponents/fileInput/ProfilePictureUpload";
import { daysOfWeek } from "@/constants/DropdownConstants";
import FileInput from "@/components/formComponents/fileInput/FileInput";
const defaultInitialValues: IClientData = {
  code: "",
  contractN: "",
  contractTagline: "",
  email: "",
  name: "",
  country: "Afghanistan",
  timezone: "",
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  autoUpdateEndDate: 0,
  timeSheetStartDay: 1,
  approvalEmail: "",
  isShowPrices: true,
  isShowCostCenter: false,
  isShowCatalogueNo: false,
  titreDeConge: "",
  isResetBalance: false,
  startMonthBack: 6,
  medicalEmailSubmission: "",
  medicalEmailToday: "",
  medicalEmailMonthly: "",
  isShowNSS: false,
  isShowCarteChifa: false,
  isShowSalaryInfo: false,
  isShowRotation: false,
  isShowBalance: false,
  logo: null,
  stampLogo: null,
  segment: "",
  subSegment: "",
  bonusType: "",
  isCountCR: false,
  weekendDays: "",
  address: "",
};

interface AddUpdateClientProps {
  id?: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateClient = ({
  id,
  openModal,
  setOpenModal,
  setAlertPopUp,
  fetchAllData,
}: AddUpdateClientProps) => {
  const timezoneList: Option[] = timezones.map((value) => ({
    label: value.timezone + " (" + value.utcOffset + ")",
    value: value.timezone,
  }));
  const currencyMap = new Map();
  for (const countryData of countries) {
    const isExist = currencyMap.get(
      `${countryData?.currencyName}-${countryData?.currencyCode}`
    );
    if (!isExist) {
      currencyMap.set(
        `${countryData?.currencyName}-${countryData?.currencyCode}`,
        countryData
      );
    }
  }
  const currencyData = [...currencyMap.values()];
  const currencyList: Option[] = currencyData.map(
    (values: {
      countryName: string;
      countryCode: string;
      currencyName: string;
      currencyCode: string;
    }) => ({
      label: `${values?.currencyName} - ${values?.currencyCode}`,
      value: values?.currencyCode,
    })
  );
  const dispatch = useDispatch();
  const existingClientData = useSelector(clientDataSelector);
  const countryList: Option[] = countries.map((value) => ({
    label: value.countryName,
    value: value.countryName,
  }));
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [clientDataValues, setClientDataValues] =
    useState<IClientData>(defaultInitialValues);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isUpdateInProcess, setIsUpdateInProcess] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const formData = new FormData();

    values.weekendDays = [...selectedDays]
      .sort(function (a, b) {
        return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
      })
      .toString();
    values.weekendDays = values.weekendDays ?? "";
    formData.append("weekendDays", values?.weekendDays);
    formData.append("email", values?.email?.trim() ?? null);
    formData.append("code", values?.code?.trim().toString());
    formData.append("contractN", values?.contractN);
    formData.append("address", values?.address ?? null);
    formData.append(
      "contractTagline",
      values?.contractTagline?.trim().toString()
    );
    formData.append("name", values.name.trim());
    formData.append("country", values.country);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);
    formData.append("autoUpdateEndDate", values.autoUpdateEndDate);
    formData.append("timeSheetStartDay", values.timeSheetStartDay);
    replaceStringToArray(values.approvalEmail).forEach(
      (item: string, inx: number) => {
        formData.append(`approvalEmail[${inx}]`, item);
      }
    );
    formData.append("isShowPrices", values.isShowPrices);
    formData.append("isShowCostCenter", values.isShowCostCenter);
    formData.append("isShowCatalogueNo", values.isShowCatalogueNo);
    replaceStringToArray(values.titreDeConge).forEach(
      (item: string, inx: number) => {
        formData.append(`titreDeConge[${inx}]`, item);
      }
    );
    formData.append("isResetBalance", values.isResetBalance);
    formData.append("startMonthBack", values.startMonthBack);
    formData.append("isCountCR", values.isCountCR);
    replaceStringToArray(values.medicalEmailSubmission).forEach(
      (item: string, inx: number) => {
        formData.append(`medicalEmailSubmission[${inx}]`, item);
      }
    );
    replaceStringToArray(values.medicalEmailToday).forEach(
      (item: string, inx: number) => {
        formData.append(`medicalEmailToday[${inx}]`, item);
      }
    );
    replaceStringToArray(values.medicalEmailMonthly).forEach(
      (item: string, inx: number) => {
        formData.append(`medicalEmailMonthly[${inx}]`, item);
      }
    );
    formData.append("isShowNSS", values.isShowNSS);
    formData.append("timezone", values.timezone);
    formData.append("currency", values?.currency ?? null);
    formData.append("isShowCarteChifa", values.isShowCarteChifa);
    formData.append("isShowSalaryInfo", values.isShowSalaryInfo);
    formData.append("isShowRotation", values.isShowRotation);
    formData.append("isShowBalance", values.isShowBalance);
    formData.append("logo", values?.logo ?? null);
    formData.append("stampLogo", values?.stampLogo ?? null);
    formData.append("segment", values.segment);
    formData.append("subSegment", values.subSegment);
    formData.append("bonusType", values.bonusType);

    if (id) {
      const response = await EditClientData(formData, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        if (
          clientDataValues?.timeSheetStartDay !== values?.timeSheetStartDay ||
          clientDataValues?.endDate !== values?.endDate
        ) {
          setAlertPopUp(true);
        }
        fetchAllData?.();
        // for editing option to Global Dropdown
        const tempClient = existingClientData.map((item: IClientData) => {
          if (item.id === response.data.responseData.id) {
            return response.data.responseData;
          }
          return item;
        });
        dispatch(setClientData(tempClient as []));
      }
    } else {
      const response = await AddClientData(formData);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
        // for adding option to Global Dropdown
        const temp = [...existingClientData, response?.data?.responseData];
        dispatch(setClientData(temp as []));
      }
    }
    setLoader(false);
  };

  const getAutoUpdateDateValue = (values: IClientData) => {
    if (isFocused) return values.autoUpdateEndDate;
    else if (values.autoUpdateEndDate)
      return values.autoUpdateEndDate + " Months";
    else return "";
  };

  const handleCheckboxChange = (day: string) => {
    let dayArray = [];
    if (selectedDays.includes(day)) {
      dayArray = selectedDays.filter((selectedDay) => selectedDay !== day);
    } else {
      dayArray = [...selectedDays, day];
    }
    setSelectedDays(dayArray);
    return dayArray;
  };

  useEffect(() => {
    if (id) {
      fetchClientData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchClientData(id: string) {
    dispatch(showLoader());
    try {
      const response = await GetClientDataById(id);

      if (response?.data?.responseData) {
        const resultData = response?.data?.responseData;
        if (resultData?.isUpdateInProcess) {
          setIsUpdateInProcess(true);
        }
        setClientDataValues({
          code: resultData.code,
          email: resultData.loginUserData.email,
          name: resultData.loginUserData.name,
          country: resultData.country,
          startDate: new Date(resultData.startDate),
          endDate: new Date(resultData.endDate),
          autoUpdateEndDate: resultData.autoUpdateEndDate,
          timeSheetStartDay: resultData.timeSheetStartDay,
          approvalEmail: resultData.approvalEmail,
          isShowPrices: resultData.isShowPrices,
          timezone: resultData.loginUserData.timezone,
          currency: resultData?.currency ?? null,
          isShowCostCenter: resultData.isShowCostCenter,
          isShowCatalogueNo: resultData.isShowCatalogueNo,
          titreDeConge: resultData.titreDeConge,
          isResetBalance: resultData.isResetBalance,
          startMonthBack: resultData.startMonthBack,
          medicalEmailSubmission: resultData.medicalEmailSubmission,
          medicalEmailToday: resultData.medicalEmailToday,
          medicalEmailMonthly: resultData.medicalEmailMonthly,
          isShowNSS: resultData.isShowNSS,
          isShowCarteChifa: resultData.isShowCarteChifa,
          isShowSalaryInfo: resultData.isShowSalaryInfo,
          isShowRotation: resultData.isShowRotation,
          isShowBalance: resultData.isShowBalance,
          logo: resultData?.logo,
          stampLogo: resultData?.stampLogo,
          segment: resultData.segment,
          subSegment: resultData.subSegment,
          bonusType: resultData.bonusType,
          isCountCR: resultData.isCountCR,
          contractN: resultData.contractN,
          contractTagline: resultData.contractTagline,
          weekendDays: resultData?.weekendDays ?? "",
          address: resultData?.address ?? "",
        });
        setSelectedDays(
          resultData.weekendDays ? resultData.weekendDays.split(",") : []
        );
      }
    } catch (error) {
      console.log("error.", error);
    }
    dispatch(hideLoader());
  }

  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const checkBoxField = [
    {
      title: "Show Prices",
      key: "isShowPrices",
    },
    //   {
    //     title: "Show Cost Centre",
    //     key: "isShowCostCenter",
    //   },
    {
      title: "Show Catalogue No",
      key: "isShowCatalogueNo",
    },
    {
      title: "Include CR in the timesheet",
      key: "isCountCR",
    },
  ];

  const checkBoxList2 = [
    {
      title: "Show N° S.S.",
      key: "isShowNSS",
    },
    {
      title: "Show Carte Chifa",
      key: "isShowCarteChifa",
    },
    {
      title:
        "Show Salary Info (Applies to Timesheet Preparation & Approval users)",
      key: "isShowSalaryInfo",
    },
    {
      title: "Show Rotation",
      key: "isShowRotation",
    },
    {
      title: "Show Balance",
      key: "isShowBalance",
    },
  ];

  const textaAreaFields = [
    {
      title: "Submission",
      name: "medicalEmailSubmission",
    },
    {
      title: "Today",
      name: "medicalEmailToday",
    },
    {
      title: "Monthly",
      name: "medicalEmailMonthly",
    },
  ];

  const textaAreaFields2 = [
    {
      title: "Segment",
      name: "segment",
    },
    {
      title: "Sub-Segment",
      name: "subSegment",
    },
    {
      title: "Bonus Type",
      name: "bonusType",
    },
  ];

  return (
    <>
      {openModal && (
        <Modal
          width="max-w-[870px]"
          title={`${id ? "Edit" : "Add"} Client`}
          closeModal={() => setOpenModal(false)}
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
          loaderButton={loader}
        >
          <Formik
            initialValues={clientDataValues}
            enableReinitialize={true}
            validationSchema={ClientValidationSchema()}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
            onSubmit={OnSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card title="Overview" parentClass="mb-5 last:mb-0">
                  <>
                    <ProfilePictureUpload
                      setValue={setFieldValue}
                      name="logo"
                      acceptTypes=".jpg,.jpeg,.png"
                      parentClass="mb-7"
                      value={values?.logo ? values?.logo : null}
                      isImage={true}
                    />
                    <div className="grid grid-cols-2 gap-5">
                      <TextField
                        name="name"
                        // parentClass="col-span-2"
                        type="text"
                        smallFiled={true}
                        label={"Name"}
                        isCompulsory={true}
                        placeholder={"Enter Name"}
                      />
                      <TextField
                        name="email"
                        // parentClass="col-span-2"
                        type="text"
                        smallFiled={true}
                        label={"Email"}
                        // isCompulsory={true}
                        placeholder={"Enter Email"}
                      />
                      <SelectComponent
                        options={countryList || []}
                        isMulti={true}
                        selectedValue={values.country}
                        // parentClass="col-span-2"
                        onChange={(option: Option | Option[]) => {
                          setFieldValue("country", (option as Option).value);
                        }}
                        placeholder="Select"
                        label="Country"
                        isCompulsory
                        className="bg-white"
                      />
                      <SelectComponent
                        name="currency"
                        placeholder="Select"
                        label="Currency"
                        selectedValue={values.currency}
                        options={currencyList.length ? currencyList : []}
                        onChange={(option: Option | Option[]) => {
                          setFieldValue("currency", (option as Option).value);
                        }}
                        className="bg-white"
                      />
                      <SelectComponent
                        name="timezone"
                        placeholder="Select"
                        label="Time Zone"
                        selectedValue={values.timezone}
                        options={timezoneList.length ? timezoneList : []}
                        onChange={(option: Option | Option[]) => {
                          setFieldValue("timezone", (option as Option).value);
                        }}
                        isCompulsory
                        className="bg-white"
                      />
                      <TextField
                        name="code"
                        parentClass=""
                        type="text"
                        smallFiled={true}
                        label={"Code"}
                        isCompulsory={true}
                        placeholder={"Enter Code"}
                      />
                      <Textarea
                        parentClass="col-span-2"
                        name="address"
                        type="text"
                        smallFiled={true}
                        placeholder={"Enter Address"}
                        label={"Address"}
                      />

                      <div className="grid grid-cols-4 gap-y-4 gap-x-2 col-span-2">
                        <p className="col-span-4 text-base/5 font-semibold text-black">
                          Weekend Days
                        </p>
                        {daysOfWeek.map((day: string) => {
                          return (
                            <CheckBox
                              key={day}
                              label={day}
                              id={day}
                              value={day}
                              checked={selectedDays.includes(day)}
                              onChangeHandler={() => {
                                const result = handleCheckboxChange(day);
                                setFieldValue("weekendDays", result.toString());
                              }}
                              labelClass=" !text-black"
                            />
                          );
                        })}
                      </div>
                      <ErrorMessage name={"weekendDays"}>
                        {(msg) => (
                          <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </>
                </Card>
                <Card title="Timesheet" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <DateComponent
                        name="startDate"
                        smallFiled
                        label={"Start Date"}
                        value={values.startDate}
                        onChange={(date) => {
                          setFieldValue("startDate", date);
                        }}
                        isCompulsory={true}
                        placeholder={"Enter Other Info (e.g. Month)"}
                        isDisabled={!!id}
                      />
                      <DateComponent
                        name="endDate"
                        smallFiled
                        label={"End Date"}
                        minDate={
                          id
                            ? clientDataValues?.endDate
                            : values?.startDate ?? new Date()
                        }
                        value={values.endDate}
                        onChange={(date) => {
                          setFieldValue("endDate", date);
                        }}
                        isCompulsory={true}
                        placeholder={"Enter Other Info (e.g. Month)"}
                        isDisabled={isUpdateInProcess}
                      />

                      <TextField
                        name="autoUpdateEndDate"
                        parentClass=""
                        type={isFocused ? "number" : "text"}
                        smallFiled={true}
                        min={0}
                        value={getAutoUpdateDateValue(values)}
                        label={"Auto Update End Date"}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={"Enter Other Info (e.g. Month)"}
                        disabled={isUpdateInProcess}
                      />

                      <TextField
                        name="timeSheetStartDay"
                        parentClass=""
                        type="number"
                        min={1}
                        max={31}
                        smallFiled={true}
                        label={"Timesheet Start Day"}
                        isCompulsory={true}
                        placeholder={"Enter Other Info (e.g. Day)"}
                        disabled={!!id}
                      />

                      <Textarea
                        parentClass="col-span-2"
                        name="approvalEmail"
                        type="text"
                        smallFiled={true}
                        placeholder={"Enter Approval Email"}
                        label={"Approval Email"}
                      />
                      <div className="col-span-2 flex flex-wrap">
                        {checkBoxField?.map((field) => {
                          return (
                            <CheckBox
                              key={field.key}
                              id={field.key}
                              label={field.title}
                              labelClass={field.title}
                              checked={values[field.key]}
                              value={values[field.key]}
                              onChangeHandler={() => {
                                setFieldValue(field.key, !values[field.key]);
                              }}
                              parentClass="!text-black mr-4 1200:mr-5 1600:mr-10"
                            />
                          );
                        })}
                      </div>
                    </div>
                    {isUpdateInProcess && (
                      <div className="grid grid-cols-1 gap-5 mt-5">
                        <span className="text-red text-sm font-BinerkaDemo">
                          Note* : <br />
                          The date extension is in progress and due to that End
                          Date and Auto Update End Date field is disabled! You
                          will be able to access it as soon as the extension
                          process gets completd <br />
                        </span>
                      </div>
                    )}
                  </>
                </Card>
                <Card title="Titre de Congé" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <Textarea
                      parentClass="col-span-2"
                      name="titreDeConge"
                      type="text"
                      smallFiled={true}
                      placeholder={"Enter Titre de Congé Email"}
                      label={"Titre de Congé Email"}
                    />
                    <TextField
                      name="startMonthBack"
                      parentClass=""
                      type="number"
                      min={0}
                      max={12}
                      smallFiled={true}
                      isCompulsory={true}
                      label={"Start Months Back"}
                    />
                    {/* <CheckBox
                      id="isResetBalance"
                      label="Reset Balance for Segment change"
                      labelClass="Reset Balance for Segment change"
                      checked={values.isResetBalance}
                      value={values.isResetBalance}
                      onChangeHandler={() => {
                        setFieldValue("isResetBalance", !values.isResetBalance);
                      }}
                      parentClass="!text-black mr-4 1200:mr-5 1600:mr-10 !items-center"
                    /> */}
                  </div>
                </Card>
                <Card title="Contract" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="contractN"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"N°"}
                      placeholder={"Enter N°"}
                    />
                    <Textarea
                      parentClass="col-span-2"
                      name="contractTagline"
                      type="text"
                      smallFiled={true}
                      placeholder={"Tagline"}
                      label={"Tagline"}
                    />
                  </div>
                </Card>

                <Card
                  title="Medical Email Notification"
                  parentClass="mb-5 last:mb-0"
                >
                  <div className="grid grid-cols-1 gap-5">
                    {textaAreaFields?.map((field) => {
                      return (
                        <Textarea
                          key={field.name}
                          parentClass=""
                          name={field.name}
                          type="text"
                          smallFiled={true}
                          placeholder={`Enter ${field.title}`}
                          label={field.title}
                        />
                      );
                    })}
                  </div>
                </Card>

                <Card title="Employee" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-4 gap-5">
                    {checkBoxList2?.map((field) => {
                      return (
                        <div
                          className={
                            field.key === "isShowSalaryInfo" ? "col-span-2" : ""
                          }
                          key={field.key}
                        >
                          <CheckBox
                            id={field.key}
                            label={field.title}
                            checked={values[field.key]}
                            value={values[field.key]}
                            onChangeHandler={() => {
                              setFieldValue(field.key, !values[field.key]);
                            }}
                            labelClass="text-sm/18px !text-black font-medium"
                          />
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card title="Stamp Logo" parentClass="mb-5 last:mb-0">
                  <FileInput
                    setValue={setFieldValue}
                    name="stampLogo"
                    acceptTypes=".jpg,.jpeg,.png"
                    value={values?.stampLogo ? values?.stampLogo : null}
                    isImage={true}
                  />
                </Card>

                <Card title="Labels" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-1 gap-5">
                      {textaAreaFields2?.map((field) => (
                        <Textarea
                          key={field.name}
                          name={field.name}
                          type="text"
                          label={field.title}
                          smallFiled={true}
                          placeholder={`Enter ${field.title}`}
                        />
                      ))}
                    </div>
                  </>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default AddUpdateClient;
