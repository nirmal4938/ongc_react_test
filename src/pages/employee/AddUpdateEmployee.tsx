import SelectComponent from "@/components/formComponents/customSelect/Select";
import TextField from "@/components/formComponents/textField/TextField";
import { Option } from "@/interface/customSelect/customSelect";
import Card from "@/components/card/Card";
import { Form, Formik, FormikErrors, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { GetSegmentData } from "@/services/segmentService";
import { useDispatch, useSelector } from "react-redux";
import {
  activeClientSelector,
  clientDataSelector,
  activeClientDataSelector,
  setActiveClient,
} from "@/redux/slices/clientSlice";
import { EmployeeValidationSchema } from "@/validations/employee/EmployeeValidation";
import { GetSubSegmentData } from "@/services/subSegmentService";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import {
  AddEmployeeData,
  EditEmployeeData,
  EditEmployeeDraftData,
  GetEmployeeDataById,
} from "@/services/employeeService";
import { GetRotationData } from "@/services/rotationService";
import { genderOptions } from "@/constants/DropdownConstants";
import ProfilePictureUpload from "@/components/formComponents/fileInput/ProfilePictureUpload";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";
import { GetAllBonusType } from "@/services/bonusTypeService";
import { IBonusTypeData } from "@/interface/bonusType/bonusTypeInterface";
import moment from "moment";
import PhoneNumberInput from "@/components/formComponents/phoneInput/PhoneNumberInput";
import { hideLoader } from "@/redux/slices/siteLoaderSlice";
import { IClientData } from "@/interface/client/clientInterface";
import ClientDropdown from "@/components/dropdown/ClientDropdown";
import { timezones } from "../../../src/json/timezone.json";
import { getClientFonction } from "@/services/clientService";
import { socketSelector } from "@/redux/slices/socketSlice";
import generateDataModal from "@/components/generateModal/generateModal";
import {
  DefaultRoles,
  FeaturesNameEnum,
  PermissionEnum,
} from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";
import { employeeFormSections } from "@/constants/CommonConstants";
import { Link, useNavigate } from "react-router-dom";
import { userSelector } from "@/redux/slices/userSlice";
import { ToastShow } from "@/redux/slices/toastSlice";

interface AddUpdateSegmentProps {
  id?: string | number;
  openModal: boolean;
  // setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  // fetchAllData?: () => void;
}
interface IBonusData {
  coutJournalier: number;
  id: string;
  label: string;
  price: number;
  catalogueNumber: number;
  startDate: Date;
  bonus: {
    id: number;
    name: string;
    code: string;
  };
}

const AddUpdateEmployee = ({
  id,
  openModal,
}: // setOpenModal,
// fetchAllData,
AddUpdateSegmentProps) => {
  const timezoneList: Option[] = timezones.map((value) => ({
    label: value.timezone + " (" + value.utcOffset + ")",
    value: value.timezone,
  }));
  const formikRef = useRef<FormikProps<FormikValues>>();
  const socket = useSelector(socketSelector);
  const user = useSelector(userSelector);
  const clientDetails: IClientData[] = useSelector(clientDataSelector);
  const activeClient = useSelector(activeClientSelector);
  const activeClientDataSelectorValue: IClientData | null = useSelector(
    activeClientDataSelector
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [generatemodal, setGenerateModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<{
    submit: boolean;
    segment: boolean;
    subSegment: boolean;
    bonusType: boolean;
    rotation: boolean;
    fonction: boolean;
  }>({
    submit: false,
    segment: false,
    subSegment: false,
    bonusType: false,
    rotation: false,
    fonction: false,
  });
  const [generateModalData, setGenerateModalData] = useState<{
    percentage: number;
    type: string;
    message: string;
  } | null>(null);
  const { getPermissions } = usePermission();
  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const [segmentOptions, setSegmentOptions] = useState<Option[]>([]);
  const [subSegmentOptions, setSubSegmentOptions] = useState<Option[]>([]);
  const [rotationOptions, setRotationOptions] = useState<Option[]>([]);
  const [fonctionOptions, setFonctionOptions] = useState<Option[]>([]);
  const [isCallOutRotation, setIsCallOutRotation] = useState<boolean>(false);
  const [bonusTypeOptions, setBonusTypeOptions] = useState<IBonusTypeData[]>(
    []
  );
  const [activeSegmentEmployee, setActiveSegmentEmployee] = useState<
    string | number
  >("");
  const [activePointer, setActivePointer] = useState<{
    [key: string]: boolean;
  }>();
  const [oldBonusData, setOldBonusData] = useState([]);
  const querySegment = `?` + `clientId=${activeClient}`;
  const querySubSegment = `?` + `segmentId=${activeSegmentEmployee}`;
  const defaultInitialValues: IEmployeeData = {
    TempNumber: "",
    employeeNumber: "",
    startDate: new Date(),
    medicalCheckDate: null,
    medicalCheckExpiry: null,
    firstName: "",
    lastName: "",
    fonction: "",
    dOB: null,
    placeOfBirth: "",
    nSS: "",
    gender: "",
    baseSalary: 0,
    timezone: "",
    salaryDate: new Date(),
    travelAllowance: 0,
    Housing: 0,
    monthlySalary: 0,
    address: "",
    medicalInsurance: null,
    dailyCost: 0,
    mobileNumber: "",
    nextOfKinMobile: "",
    // initialBalance: 0,
    photoVersionNumber: 0,
    email: "",
    clientId: activeClient,
    segmentId: null,
    subSegmentId: null,
    rotationId: null,
    profilePicture: null,
    customBonus: "",
    contractNumber: "",
    contractEndDate: null,
    contractSignedDate: null,
    catalogueNumber: null,
    rollover: false,
    isAbsenseValueInReliquat: false,
    employeeStatus: "SAVED",
    hourlyRate: 0,
  };
  const [employeeData, setEmployeeData] =
    useState<IEmployeeData>(defaultInitialValues);
  const [timesheetApprovedDate, setTimesheetApprovedDate] = useState<Date>();

  const longInputFields = [
    {
      name: "baseSalary",
      type: "number",
      label: "Base Salary",
      placeHolder: "Enter Base SalaryBase Salary",
      min: 0,
    },
    {
      name: "travelAllowance",
      type: "number",
      label: "Travel Allowance",
      placeHolder: "Enter Travel Allowance",
      min: 0,
    },
    {
      name: "Housing",
      type: "number",
      label: "Housing Allowance",
      placeHolder: "Enter Housing Allowance",
      min: 0,
    },
    {
      name: "monthlySalary",
      type: "number",
      label: "Monthly Salary",
      placeHolder: "Enter Monthly Salary",
      min: 0,
    },
  ];
  const personalInfoLongInputFields = [
    {
      name: "address",
      type: "text",
      label: "Address",
      placeHolder: "Enter Address",
    },

    {
      name: "nextOfKinMobile",
      type: "number",
      label: "Next Of Kin Mobile",
      placeHolder: "Enter Next Of Kin Mobile",
    },
    {
      name: "email",
      type: "text",
      label: "Email",
      placeHolder: "Enter Email",
      isCompulsory: false,
    },
  ];

  useEffect(() => {
    if (activeSegmentEmployee) {
      fetchAllSubSegment(querySubSegment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSegmentEmployee]);

  useEffect(() => {
    if (clientDetails) {
      const resp: Option[] | Option = [];
      for (const i in clientDetails) {
        if (clientDetails[i]?.loginUserData?.name) {
          resp.push({
            label: String(clientDetails[i]?.loginUserData?.name),
            value: String(clientDetails[i]?.id),
          });
        }
      }
      resp && setClientOptions(resp);
    }
  }, [clientDetails]);

  useEffect(() => {
    if (id) {
      getAllData(Number(id));
    } else {
      getAllData();
    }
    const generateToggle: { [key: string]: boolean } = {};

    employeeFormSections.map((section, index) => {
      if (index === 0) {
        generateToggle[`${section}`] = true;
      } else {
        generateToggle[`${section}`] = false;
      }
    });
    setActivePointer(generateToggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, activeClient]);

  socket?.on("generate-modal-data", (data) => {
    setGenerateModalData(data);
  });

  useEffect(() => {
    if (bonusTypeOptions.length > 0 && !id && employeeData.segmentId) {
      setActiveSegmentEmployee(Number(employeeData.segmentId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeData]);

  const getAllData = async (id: number | null = null) => {
    if (activeClient) {
      await fetchAllSegment(querySegment);
      await fetchAllRotation();
      await fetchAllFonction(String(activeClient));
      if (activeSegmentEmployee) {
        await fetchAllSubSegment(querySubSegment);
      }
      if (id) {
        const bonusResp = await fetchAllBonusTypeDropdownData(id);
        await fetchEmployeeData(id, bonusResp);
      } else {
        await fetchAllBonusTypeDropdownData();
      }
    }
    dispatch(hideLoader());
  };

  async function fetchEmployeeData(
    id: string | number,
    bonusDataProp: IBonusTypeData[]
  ) {
    const response = await GetEmployeeDataById(id);
    if (response?.data?.responseData) {
      const customValue: {
        [key: string]: unknown;
      } = {};
      bonusDataProp?.length > 0 &&
        bonusDataProp.forEach((data: IBonusTypeData) => {
          customValue[`${data.code}-value`] = String(data.basePrice);
          customValue[`${data.code}-start-date`] = new Date();
        });
      const resultData = response?.data?.responseData;
      if (resultData?.rotation?.name === "Call Out") {
        setIsCallOutRotation(true);
      } else {
        setIsCallOutRotation(false);
      }
      const bonus = resultData?.employeeBonus;
      if (bonus) {
        setOldBonusData(bonus);
      }

      const bonusValueData: { [string: string]: number | string } = {};
      const bonusData =
        bonus?.length > 0 &&
        bonus?.map((data: IBonusData) => {
          bonusValueData[`${data?.bonus?.code}-value`] = data?.price;
          bonusValueData[`${data?.bonus?.code}-cout-journalier`] =
            data?.coutJournalier;
          bonusValueData[`${data?.bonus?.code}-catalogue-number`] =
            data?.catalogueNumber;
          bonusValueData[`${data?.bonus?.code}-start-date`] = moment(
            data.startDate
          ).format("DD/MM/YYYY");
          return String(data?.bonus?.id);
        });
      setTimesheetApprovedDate(
        new Date(resultData?.timesheetApprovedDate ?? null)
      );

      setEmployeeData({
        TempNumber: resultData.TempNumber,
        employeeNumber: resultData.employeeNumber,
        startDate: new Date(resultData.startDate),
        firstName: resultData?.loginUserData?.firstName,
        lastName: resultData?.loginUserData?.lastName,
        contractNumber: resultData?.contractNumber ?? "",
        contractEndDate: resultData?.contractEndDate
          ? new Date(resultData?.contractEndDate)
          : null,
        contractSignedDate: resultData?.contractSignedDate
          ? new Date(resultData?.contractSignedDate)
          : null,
        medicalCheckExpiry: resultData?.medicalCheckExpiry
          ? new Date(resultData?.medicalCheckExpiry)
          : null,
        medicalCheckDate: resultData?.medicalCheckDate
          ? new Date(resultData?.medicalCheckDate)
          : null,
        catalogueNumber:
          resultData?.employeeCatalogueNumber?.catalogueNumber ?? null,
        fonction: resultData.fonction,
        dOB: resultData?.loginUserData?.birthDate
          ? new Date(resultData?.loginUserData?.birthDate)
          : null,
        placeOfBirth: resultData?.loginUserData?.placeOfBirth,
        nSS: resultData.nSS,
        gender: resultData?.loginUserData?.gender,
        baseSalary: resultData?.baseSalary,
        salaryDate:
          resultData?.employeeSalary &&
          resultData?.employeeSalary?.length > 0 &&
          new Date(resultData?.employeeSalary[0]?.startDate),
        travelAllowance: resultData.travelAllowance,
        Housing: resultData?.Housing,
        monthlySalary: resultData?.monthlySalary,
        address: resultData.address,
        timezone: resultData?.loginUserData?.timezone
          ? resultData?.loginUserData.timezone
          : "",
        medicalInsurance: resultData.medicalInsurance,
        dailyCost: resultData?.dailyCost,
        mobileNumber: resultData?.loginUserData?.phone,
        nextOfKinMobile: resultData?.nextOfKinMobile,
        // initialBalance: resultData?.initialBalance,
        photoVersionNumber: resultData.photoVersionNumber,
        email: resultData?.loginUserData.email,
        clientId: resultData.clientId,
        segmentId: resultData.segmentId,
        subSegmentId: resultData.subSegmentId,
        rotationId: resultData.rotationId,
        profilePicture: resultData.loginUserData.profileImage
          ? "/profilePicture/" + resultData.loginUserData.profileImage
          : null,
        timesheet: resultData.timeSheet,
        rollover: resultData?.employeeSegment[0]?.rollover,
        isAbsenseValueInReliquat: resultData?.isAbsenseValueInReliquat,
        employeeStatus: resultData?.employeeStatus,
        isAdminApproved: resultData.isAdminApproved,
        customBonus: bonusData,
        ...customValue,
        ...bonusValueData,
        hourlyRate: resultData?.hourlyRate ?? 0,
      });
      if (resultData.segmentId) {
        setActiveSegmentEmployee(Number(resultData.segmentId));
      }
    }
  }

  async function fetchAllSegment(query: string) {
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        segment: true,
      };
    });
    const isActiveSegment = !id ? `&isActive=true` : "";
    const response = await GetSegmentData(query + isActiveSegment);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setSegmentOptions(resp);
      if (!id) {
        setSubSegmentOptions([]);
      }
    }
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        segment: false,
      };
    });
  }

  async function fetchAllSubSegment(query: string) {
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        subSegment: true,
      };
    });
    const isActiveSubSegment = !id ? `&isActive=true` : "";
    const response = await GetSubSegmentData(query + isActiveSubSegment);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;

      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setSubSegmentOptions(resp);
      setLoader((oldLoader) => {
        return {
          ...oldLoader,
          subSegment: false,
        };
      });
    } else {
      setLoader((oldLoader) => {
        return {
          ...oldLoader,
          subSegment: false,
        };
      });
    }
  }

  async function fetchAllBonusTypeDropdownData(id: null | number = null) {
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        bonusType: true,
      };
    });
    let result = null;
    if (getPermissions(FeaturesNameEnum.BonusType, PermissionEnum.View)) {
      const response = await GetAllBonusType("");
      if (response?.data?.responseData) {
        result = response?.data?.responseData?.data;
        setBonusTypeOptions(result);
      }
    }
    if (!id) {
      const customValue: {
        [key: string]: unknown;
      } = {};
      result?.length > 0 &&
        result.forEach((data: IBonusTypeData) => {
          customValue[`${data.code}-value`] = String(data.basePrice);
          customValue[`${data.code}-start-date`] = new Date();
        });
      setEmployeeData({ ...defaultInitialValues, ...customValue });
    }
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        bonusType: false,
      };
    });
    return result;
  }

  async function fetchAllRotation() {
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        rotation: true,
      };
    });
    const response = await GetRotationData();
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setRotationOptions(resp);
    }
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        rotation: false,
      };
    });
  }

  async function fetchAllFonction(clientId: string) {
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        fonction: true,
      };
    });
    const response = await getClientFonction(clientId);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      const resp: Option[] = result.map((data: string) => {
        return { label: data, value: data };
      });
      setFonctionOptions(resp);
    }
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        fonction: false,
      };
    });
  }

  const OnSubmit = async (values: FormikValues) => {
    let isSuccess = true;
    setLoader((oldLoader) => {
      return {
        ...oldLoader,
        submit: true,
      };
    });
    setGenerateModal(true);
    const formData = new FormData();

    formData.append("TempNumber", values?.TempNumber);
    formData.append("employeeNumber", values?.employeeNumber);
    formData.append("contractNumber", values?.contractNumber);
    formData.append("contractEndDate", values?.contractEndDate);
    formData.append("contractSignedDate", values?.contractSignedDate);
    formData.append("startDate", values?.startDate);
    formData.append("medicalCheckDate", values?.medicalCheckDate ?? null);
    formData.append("medicalCheckExpiry", values?.medicalCheckExpiry ?? null);
    formData.append("firstName", values?.firstName);
    formData.append("lastName", values?.lastName);
    formData.append("fonction", values?.fonction);
    formData.append(
      "dOB",
      values?.dOB ? moment(values?.dOB).format("DD-MM-YYYY") : ""
    );
    formData.append("placeOfBirth", values?.placeOfBirth);
    formData.append("nSS", values?.nSS);
    formData.append("gender", values?.gender);
    formData.append("rollover", values?.rollover);
    formData.append(
      "isAbsenseValueInReliquat",
      values?.isAbsenseValueInReliquat
    );
    if (id) {
      formData.append(
        "salaryDate",
        values?.salaryDate ? values?.salaryDate : new Date()
      );
    } else {
      formData.append("salaryDate", values?.startDate);
    }
    formData.append("catalogueNumber", values?.catalogueNumber ?? null);
    formData.append("timezone", values?.timezone);
    formData.append("baseSalary", values?.baseSalary);
    formData.append("travelAllowance", values?.travelAllowance);
    formData.append("Housing", values?.Housing);
    formData.append("monthlySalary", values?.monthlySalary);
    formData.append("address", values?.address);
    formData.append("medicalInsurance", values?.medicalInsurance);
    formData.append("dailyCost", values?.dailyCost);
    if (isCallOutRotation) {
      formData.append("hourlyRate", values?.hourlyRate);
    }
    formData.append("mobileNumber", values?.mobileNumber?.toString() ?? null);
    formData.append("nextOfKinMobile", values?.nextOfKinMobile?.toString());
    // formData.append("initialBalance", values?.initialBalance);
    formData.append("photoVersionNumber", values?.photoVersionNumber);
    formData.append("email", values?.email);
    formData.append("clientId", values?.clientId);
    formData.append("segmentId", values?.segmentId);
    formData.append("subSegmentId", values?.subSegmentId);
    formData.append("rotationId", values?.rotationId);
    formData.append("profilePicture", values?.profilePicture);
    formData.append("employeeStatus", values?.employeeStatus);
    // formData.append(
    //   "profilePicture",
    //   values?.profilePicture?.replace("/profilePicture/", "") ?? null
    // );
    if (values?.customBonus) {
      const customBonus = values?.customBonus?.map((data: number) => {
        const bonusData = bonusTypeOptions.find(
          (findData) => findData.id == data
        );
        if (bonusData) {
          const label = bonusData?.code;
          return {
            id: bonusData?.id || -1,
            label: label || "",
            price: values[`${label}-value`] || 0,
            coutJournalier: values[`${label}-cout-journalier`] || 0,
            catalogueNumber: values[`${label}-catalogue-number`] || null,
            startDate: moment(
              values[`${label}-start-date`] || null,
              "DD/MM/YYYY"
            ).format("DD/MM/YYYY"),
          };
        }
      });
      formData.append(
        "customBonus",
        String(
          JSON.stringify({
            data: customBonus,
          })
        )
      );

      const checkArray = oldBonusData.map(
        (bonusData: { [key: string]: any }) => {
          return {
            catalogueNumber: bonusData.catalogueNumber,
            coutJournalier: bonusData.coutJournalier,
            id: bonusData.bonusId,
            label: bonusData?.bonus.code,
            price: bonusData.price,
            startDate: moment(bonusData.startDate).format("DD/MM/YYYY"),
          };
        }
      );
      customBonus.map((checkData: IBonusData) => {
        const index = checkArray.findIndex((data) => data.id === checkData.id);

        if (
          moment(checkData.startDate, "DD/MM/YYYY").isBefore(
            moment(moment(values.startDate).format("DD/MM/YYYY"), "DD/MM/YYYY")
          )
        ) {
          isSuccess = false;
          dispatch(
            ToastShow({
              message: `Please select appropriate start date for ${checkData.label} bonus`,
              type: "error",
            })
          );
        }
        if (
          String(checkArray?.[index]?.startDate) !==
            String(checkData?.startDate) &&
          JSON.stringify({
            coutJournalier: checkData?.coutJournalier,
            price: checkData?.price,
            // catalogueNumber: checkData?.catalogueNumber,
          }) ===
            JSON.stringify({
              coutJournalier: checkArray?.[index]?.coutJournalier,
              price: checkArray?.[index]?.price,
              // catalogueNumber: checkArray?.[index]?.catalogueNumber,
            })
        ) {
          isSuccess = false;
          dispatch(
            ToastShow({
              message: `Please update a value if date for bonus ${checkArray[index].label} is changed !`,
              type: "error",
            })
          );
        }
        if (index !== -1) {
          if (
            JSON.stringify({
              coutJournalier: checkData?.coutJournalier,
              price: checkData?.price,
              // catalogueNumber: checkData?.catalogueNumber,
            }) !==
              JSON.stringify({
                coutJournalier: checkArray?.[index]?.coutJournalier,
                price: checkArray?.[index]?.price,
                // catalogueNumber: checkArray?.[index]?.catalogueNumber,
              }) &&
            String(checkArray?.[index]?.startDate) ===
              String(checkData?.startDate)
          ) {
            isSuccess = false;
            dispatch(
              ToastShow({
                message: `Please update date if bonus value's for bonus ${checkArray[index].label} are changed !`,
                type: "error",
              })
            );
          }
        }
      });
    }
    if (id) {
      if (
        timesheetApprovedDate &&
        moment(values?.salaryDate).format("DD-MM-YYYY") !==
          moment(employeeData?.salaryDate).format("DD-MM-YYYY") &&
        moment(values?.salaryDate).isBefore(timesheetApprovedDate)
      ) {
        isSuccess = false;
        dispatch(
          ToastShow({
            message: `Please enter the salary date after the last timesheet is approved ie. ${moment(
              timesheetApprovedDate
            ).format("DD/MM/YYYY")}`,
            type: "error",
          })
        );
      }
    }
    if (isSuccess) {
      let response;
      if (id) {
        if (
          employeeData?.isAdminApproved === null &&
          values?.employeeStatus === "SAVED"
        ) {
          response = await EditEmployeeDraftData(formData, id);
        } else {
          response = await EditEmployeeData(formData, id);
        }
      } else {
        response = await AddEmployeeData(formData);
      }
      if (response?.data?.response_type === "success") {
        navigate("/employee/summary");
        // setOpenModal(false);
        setGenerateModal(false);
        setGenerateModalData(null);
        if (activeClient !== values?.clientId) {
          dispatch(setActiveClient(values.clientId));
        }
        // fetchAllData?.();
      } else {
        setGenerateModal(false);
        setGenerateModalData(null);
      }
      setLoader((oldLoader) => {
        return {
          ...oldLoader,
          submit: false,
        };
      });
    }
  };
  // const handleSubmitRef = () => {
  //   if (formikRef.current) {
  //     formikRef.current.submitForm();
  //   }
  // };

  // const isButtonDisabled = useCallback(() => {
  //   if (
  //     loader["bonusType"] === true ||
  //     loader["rotation"] === true ||
  //     loader["segment"] === true ||
  //     loader["subSegment"] === true ||
  //     loader["submit"] === true
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }, [loader]);

  const renderEmployeeForm = (
    cardName: string,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<FormikValues>>,
    values: FormikValues
  ) => {
    if (cardName === "Personal Information") {
      return (
        <>
          <ProfilePictureUpload
            setValue={setFieldValue}
            name="profilePicture"
            acceptTypes=".jpg,.jpeg,.png"
            parentClass="mb-7"
            value={values?.profilePicture ? values?.profilePicture : null}
            isImage={true}
            isBigRadius
          />
          <div className="grid grid-cols-2 gap-5">
            <TextField
              isCompulsory={true}
              name="firstName"
              parentClass=""
              type="text"
              smallFiled={true}
              label={"First Name"}
              placeholder={"Enter First Name"}
              disabled={!!id}
            />
            <TextField
              name="lastName"
              parentClass=""
              type="text"
              smallFiled={true}
              label={"Last Name"}
              placeholder={"Enter Last Name"}
              isCompulsory={true}
              disabled={!!id}
            />
            <DateComponent
              name="dOB"
              smallFiled
              label={"Date Of Birth"}
              value={values.dOB ? new Date(values?.dOB) : null}
              placeholder={"Enter Date Of Birth"}
              onChange={(date) => {
                setFieldValue("dOB", date);
              }}
              // isDisabled={id ? true : false}
            />
            <TextField
              name="placeOfBirth"
              parentClass=""
              type="text"
              smallFiled={true}
              label={"Place Of Birth"}
              placeholder={"Enter Place Of Birth"}
              // disabled={!!id}
            />
            <SelectComponent
              name="gender"
              options={genderOptions}
              selectedValue={values?.gender}
              onChange={(option: Option | Option[]) => {
                setFieldValue("gender", (option as Option).value);
              }}
              placeholder="Select"
              label="Select Gender"
              isCompulsory
              className="bg-white"
              // isDisabled={!!id}
            />
            <TextField
              name="nSS"
              parentClass=""
              type="text"
              smallFiled={true}
              label={"NSS"}
              placeholder={"Enter NSS"}
            />
            {personalInfoLongInputFields.map((fieldInfo, index) => (
              <TextField
                onChange={(e: any) => {
                  setFieldValue(fieldInfo.name, e?.target?.value);
                }}
                key={Number(index)}
                name={fieldInfo.name}
                parentClass=""
                type={fieldInfo.type}
                smallFiled={true}
                label={fieldInfo.label}
                placeholder={fieldInfo.placeHolder}
                // disabled={fieldInfo.disabled}
                isCompulsory={fieldInfo?.isCompulsory ? true : false}
              />
            ))}
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
            <PhoneNumberInput
              placeholder="Mobile Number"
              parentClassName=""
              required={false}
              label={"Mobile Number"}
              name="mobileNumber"
            />
            <TextField
              name="photoVersionNumber"
              parentClass=""
              type="number"
              smallFiled={true}
              label={"Photo Version Number"}
              placeholder={"Enter Photo Version Number"}
              min={0}
            />
          </div>
        </>
      );
    } else if (cardName === "Work Information") {
      return (
        <div className="grid grid-cols-2 gap-5">
          <TextField
            name="employeeNumber"
            parentClass=""
            type="text"
            smallFiled={true}
            label={"Matricule"}
            placeholder={"Enter Matricule"}
            isCompulsory={true}
          />
          {id ? (
            <TextField
              name="displayClient"
              parentClass=""
              type="text"
              smallFiled={true}
              label={"Client"}
              disabled={true}
              value={
                clientOptions?.length > 0
                  ? clientOptions?.find((a) => a.value == values?.clientId)
                      ?.label
                  : ""
              }
              isCompulsory={true}
            />
          ) : (
            <ClientDropdown
              label="Select Client"
              parentClass="w-100"
              isUpdateGlobal={false}
              updateFunction={async (newValue) => {
                await fetchAllSegment(`?` + `clientId=${newValue?.toString()}`);
                setFieldValue("clientId", newValue);
              }}
              isCompulsory={true}
            />
          )}
          <SelectComponent
            name="segmentId"
            isEditable={true}
            options={segmentOptions}
            selectedValue={
              values?.segmentId != null ? values?.segmentId : "Not Selected"
            }
            onChange={(option: Option | Option[]) => {
              setFieldValue("segmentId", (option as Option).value);
              setFieldValue("subSegmentId", null);
              setActiveSegmentEmployee((option as Option).value);
            }}
            placeholder="Select"
            label="Select Segment"
            className="bg-white"
            isDisabled={!!id}
            isLoading={loader.segment}
            isCompulsory={true}
          />
          <SelectComponent
            name="subSegmentId"
            isEditable={true}
            options={subSegmentOptions}
            selectedValue={
              values?.segmentId != null ? values?.subSegmentId : "Not Selected"
            }
            onChange={(option: Option | Option[]) => {
              setFieldValue("subSegmentId", (option as Option).value);
            }}
            placeholder="Select"
            label="Select Sub Segment"
            isDisabled={!!id}
            className="bg-white"
            isLoading={loader.subSegment}
          />

          <SelectComponent
            name="fonction"
            options={fonctionOptions}
            onChange={(option: Option | Option[]) => {
              setFieldValue("fonction", (option as Option).value);
            }}
            placeholder="Select"
            label={"Select Fonction"}
            isCompulsory
            className="bg-white"
            isLoading={loader.fonction}
            selectedValue={values.fonction}
            isInput={true}
          />
          {id ? (
            <TextField
              name="displayRotation"
              parentClass=""
              type="text"
              smallFiled={true}
              label={"Rotation"}
              disabled={true}
              value={
                rotationOptions?.length > 0
                  ? rotationOptions?.find((a) => a.value == values?.rotationId)
                      ?.label
                  : ""
              }
            />
          ) : (
            <SelectComponent
              name="rotationId"
              options={rotationOptions}
              selectedValue={values?.rotationId}
              onChange={(option: Option | Option[]) => {
                setFieldValue("rotationId", (option as Option).value);
                if ((option as Option).label === "Call Out") {
                  setIsCallOutRotation(true);
                } else {
                  setIsCallOutRotation(false);
                }
              }}
              placeholder="Select"
              label={"Select Rotation"}
              isCompulsory
              className="bg-white"
              isLoading={loader.rotation}
            />
          )}
          <TextField
            name="code"
            parentClass=""
            type="text"
            smallFiled={true}
            label={"Code"}
            placeholder={"Enter Code"}
          />
          <DateComponent
            name="startDate"
            smallFiled
            label={"Start Date"}
            value={values.startDate}
            placeholder={"Enter Start Date"}
            minDate={
              activeClientDataSelectorValue != null
                ? moment(activeClientDataSelectorValue?.startDate).toDate()
                : null
            }
            maxDate={
              activeClientDataSelectorValue &&
              !activeClientDataSelectorValue?.autoUpdateEndDate
                ? moment(activeClientDataSelectorValue?.endDate).toDate()
                : null
            }
            onChange={(date) => {
              setFieldValue("startDate", date);
            }}
            isDisabled={
              !!id ||
              (employeeData?.timesheet && employeeData?.timesheet?.length > 0)
                ? true
                : false
            }
            isCompulsory={true}
          />
          <SelectComponent
            name="medicalInsurance"
            options={[
              { label: "True", value: 1 },
              { label: "False", value: 0 },
            ]}
            selectedValue={values?.medicalInsurance ? 1 : 0}
            onChange={(option: Option | Option[]) => {
              setFieldValue(
                "medicalInsurance",
                (option as Option).value ? true : false
              );
            }}
            placeholder="Select"
            label="Medical Insurance"
            isCompulsory
            className="bg-white"
          />
          <DateComponent
            name="contractSignedDate"
            smallFiled
            label={"CNAS Declaration Date"}
            value={values.contractSignedDate}
            placeholder={"Enter CNAS Declaration Date"}
            onChange={(date) => {
              setFieldValue("contractSignedDate", date);
            }}
          />
          <DateComponent
            name="medicalCheckDate"
            smallFiled
            label={"Medical Check Date"}
            value={values.medicalCheckDate}
            placeholder={"Enter Medical Check Date"}
            onChange={(date) => {
              setFieldValue("medicalCheckDate", date);
            }}
          />
          <DateComponent
            name="medicalCheckExpiry"
            smallFiled
            label={"Medical Expiry Date"}
            value={values.medicalCheckExpiry}
            placeholder={"Enter Medical Expiry Date"}
            onChange={(date) => {
              setFieldValue("medicalCheckExpiry", date);
            }}
          />
        </div>
      );
    } else if (cardName === "Salary Information") {
      return (
        <>
          <div className="grid grid-cols-2 gap-5">
            {longInputFields.map((fieldInfo, index) => (
              <TextField
                onChange={(e: any) => {
                  if (
                    fieldInfo.name === "baseSalary" ||
                    fieldInfo.name === "monthlySalary"
                  ) {
                    setFieldValue("salaryDate", employeeData?.salaryDate);
                    setFieldValue(fieldInfo.name, e?.target?.value);
                  } else {
                    setFieldValue(fieldInfo.name, e?.target?.value);
                  }
                }}
                key={Number(index)}
                min={fieldInfo.min}
                name={fieldInfo.name}
                parentClass=""
                type={fieldInfo.type}
                smallFiled={true}
                label={fieldInfo.label}
                placeholder={fieldInfo.placeHolder}
                // disabled={fieldInfo.disabled}
              />
            ))}
            <TextField
              name="dailyCost"
              parentClass=""
              type="number"
              smallFiled={true}
              label={"Daily Cost"}
              placeholder={"Enter Daily Cost"}
              onChange={(e: any) => {
                setFieldValue("salaryDate", employeeData?.salaryDate);
                setFieldValue("dailyCost", e?.target?.value);
              }}
            />
            {isCallOutRotation && (
              <TextField
                name="hourlyRate"
                parentClass=""
                type="number"
                smallFiled={true}
                label={"Hourly Rate"}
                placeholder={"Enter Hourly Rate"}
                onChange={(e: any) => {
                  setFieldValue("hourlyRate", e?.target?.value);
                }}
                min={0}
              />
            )}
            {/* <TextField
              name="initialBalance"
              parentClass=""
              type="text"
              smallFiled={true}
              label={"Initial Balance"}
              placeholder={"Enter Initial Balance"}
            /> */}
            {id && (
              <DateComponent
                smallFiled
                name="salaryDate"
                parentClass=""
                label={"Salary Date"}
                minDate={employeeData.salaryDate}
                value={values?.salaryDate}
                placeholder={""}
                onChange={(date) => {
                  setFieldValue("salaryDate", date);
                }}
              />
            )}
            <TextField
              smallFiled
              className="rounded-10"
              placeholder="Enter Catalogue Number"
              name="catalogueNumber"
              type="text"
              label={"Catalogue Number"}
            />

            {/* {id && (
              <CheckBox
                id="rollover"
                label="Rollover"
                labelClass="Reset Balance for Segment change"
                checked={values.rollover}
                value={values.rollover ? "true" : "false"}
                idDisabled={!!id}
                onChangeHandler={() => {
                  setFieldValue("rollover", !values.rollover);
                }}
                parentClass="!text-black mr-4 1200:mr-5 1600:mr-10 !items-center"
              />
            )} */}
          </div>
          {/* <div className="flex flex-row mt-5">
            <CheckBox
              id="isAbsenseValueInReliquat"
              label="Is Absense Value In Reliquat"
              labelClass="Reset Balance for Segment change"
              checked={values.isAbsenseValueInReliquat}
              value={values.isAbsenseValueInReliquat ? "true" : "false"}
              // idDisabled={!!id}
              onChangeHandler={() => {
                setFieldValue(
                  "isAbsenseValueInReliquat",
                  !values.isAbsenseValueInReliquat
                );
              }}
              parentClass="!text-black mr-4 1200:mr-5 1600:mr-10 !items-center"
            />
          </div> */}
        </>
      );
    } else if (
      cardName === "Bonus Information" &&
      user?.roleData.name === DefaultRoles.Admin
    ) {
      return (
        <div className="grid grid-cols-1 gap-5">
          <CustomSelect
            isUseFocus={false}
            inputClass={""}
            label="Bonus Type"
            isMulti={true}
            name="customBonus"
            placeholder="Select"
            options={bonusTypeOptions.map((data: IBonusTypeData) => {
              return {
                label: `${data?.code} - ${data?.name}`,
                value: String(data.id),
              };
            })}
            className="bg-white"
            selectedValue={values.customBonus}
            isLoading={loader.bonusType}
            menuPlacement="top"
            useDefaultChange={true}
          />
          {values?.customBonus
            ? values?.customBonus?.map((bonusValue: number) => {
                const bonusCode = bonusTypeOptions.find(
                  (data) => data.id == bonusValue
                )?.code;
                const bonusTitle = bonusTypeOptions.find(
                  (data) => data.id == bonusValue
                )?.name;
                return (
                  <div className="row flex flex-wrap -mx-3" key={bonusValue}>
                    <div className="col px-3 w-full md:w-1/5">
                      <TextField
                        type="text"
                        label="Bonus Name"
                        name={`${bonusCode})`}
                        parentClass=""
                        smallFiled={true}
                        disabled={true}
                        value={bonusTitle}
                      />
                    </div>
                    <div className="col px-3 w-full md:w-1/5">
                      <TextField
                        type="number"
                        label="Price"
                        name={`${bonusCode}-value`}
                        parentClass=""
                        smallFiled={true}
                        placeholder={"Enter Value"}
                        isCompulsory={true}
                      />
                    </div>
                    <div className="col px-3 w-full md:w-1/5">
                      <TextField
                        type="number"
                        label="Cout Journalier"
                        name={`${bonusCode}-cout-journalier`}
                        parentClass=""
                        smallFiled={true}
                        placeholder={"Enter Cout Journalier"}
                        isCompulsory={true}
                      />
                    </div>
                    <div className="col px-3 w-full md:w-1/5">
                      <TextField
                        type="text"
                        label="Bonus Catalogue Number"
                        name={`${bonusCode}-catalogue-number`}
                        parentClass=""
                        smallFiled={true}
                        placeholder={"Enter Bonus Catalogue Number"}
                        isCompulsory={false}
                      />
                    </div>
                    <div className="col px-3 w-full md:w-1/5">
                      <DateComponent
                        smallFiled
                        name={`${bonusCode}-start-date`}
                        parentClass=""
                        label={"Effective Date"}
                        minDate={
                          id
                            ? moment(timesheetApprovedDate)
                                .subtract(1, "days")
                                .toDate()
                            : values?.startDate
                        }
                        placeholder={""}
                        onChange={(e) => {
                          setFieldValue(
                            `${bonusCode}-start-date`,
                            moment(e).format("DD/MM/YYYY")
                          );
                        }}
                        value={
                          values[`${bonusCode}-start-date`]
                            ? moment(
                                values[`${bonusCode}-start-date`],
                                "DD/MM/YYYY"
                              ).toDate()
                            : moment(values?.startDate).toDate()
                        }
                        openToDate={true}
                      />
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      {openModal && (
        <Formik
          initialValues={employeeData}
          validationSchema={EmployeeValidationSchema()}
          enableReinitialize={true}
          onSubmit={OnSubmit}
          innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <Form>
              {employeeFormSections?.map((sectionName) => {
                if (
                  sectionName !== "Bonus Information" ||
                  (sectionName === "Bonus Information" &&
                    user?.roleData.name === DefaultRoles.Admin)
                ) {
                  return (
                    <Card
                      title={sectionName}
                      parentClass="mb-5 last:mb-0"
                      isDownIcon
                      setActivePointer={setActivePointer}
                      activePointer={activePointer}
                    >
                      {activePointer && activePointer[sectionName] ? (
                        renderEmployeeForm(sectionName, setFieldValue, values)
                      ) : (
                        <></>
                      )}
                    </Card>
                  );
                }
              })}
              <div className="form-footer">
                <div className="flex gap-4 justify-end ">
                  <div className="input-item relative undefined">
                    <Link to={"/employee/summary"}>
                      <button
                        type="button"
                        className="
          flex items-center justify-center py-11px px-15px text-13px/16px font-semibold rounded-md transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-offset-2  border border-solid focus:ring-primaryRed bg-transparent hover:bg-primaryRed text-primaryRed border-primaryRed hover:text-white"
                      >
                        Cancel
                      </button>
                    </Link>
                  </div>
                  {!id &&
                    user?.roleData?.name !== DefaultRoles?.Admin &&
                    getPermissions(
                      FeaturesNameEnum.Employee,
                      PermissionEnum.Create
                    ) && (
                      <div className="input-item relative undefined">
                        <button
                          type="button"
                          className="flex items-center justify-center py-11px px-15px text-13px/16px font-semibold rounded-md transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-offset-2  border border-solid focus:ring-primaryRed bg-primaryRed hover:bg-primaryRed/80 text-white border-primaryRed"
                          onClick={() => {
                            setFieldValue("employeeStatus", "DRAFT");
                            handleSubmit();
                          }}
                        >
                          Draft
                        </button>
                      </div>
                    )}
                  <div className="input-item relative undefined">
                    <button
                      type="submit"
                      className="flex items-center justify-center py-11px px-15px text-13px/16px font-semibold rounded-md transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-offset-2  border border-solid focus:ring-primaryRed bg-primaryRed hover:bg-primaryRed/80 text-white border-primaryRed"
                      onClick={() => {
                        setFieldValue("employeeStatus", "SAVED");
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
      {generatemodal &&
        generateModalData &&
        generateDataModal(generateModalData)}
    </>
  );
};

export default AddUpdateEmployee;
