import Swal from "sweetalert2";
import { TFunction } from "i18next";
import withReactContent from "sweetalert2-react-content";
import { Option } from "@/interface/customSelect/customSelect";
import { GetAllBonusType } from "@/services/bonusTypeService";
import { IBonusTypeData } from "@/interface/bonusType/bonusTypeInterface";

export const IMAGE_SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
];
export const VIDEO_SUPPORTED_FORMATS = ["video/mp4", "video/webm", "video/ogg"];

export const DeleteModal = (
  id: number,
  callBack: (id: number) => void,
  t: TFunction<"translation", undefined, "translation">
) => {
  const alert = withReactContent(Swal);
  alert
    .fire({
      title: `${t("Are you sure?")}`,
      text: `${t("You won't be able to revert this!")}`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: `${t("Cancel")}`,
      confirmButtonColor: "#E17446",
      cancelButtonColor: "#999",
      confirmButtonText: `${t("Yes, delete it!")}`,
      reverseButtons: true,
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__faster",
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        callBack(id);
      }
    });
};

export const UpdateStatusModal = (
  id: string,
  status: boolean,
  callBack: (id: string, status: boolean) => void
) => {
  const alert = withReactContent(Swal);
  alert
    .fire({
      title: "Are you sure?",
      text: "You want to change the status",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#E17446",
      cancelButtonColor: "#999",
      confirmButtonText: "Yes, update it!",
      reverseButtons: true,
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__faster",
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        callBack(id, status);
      }
    });
};

export const requestStatusModal = (
  id: number,
  callBack: (id: number) => void,
  t: TFunction<"translation", undefined, "translation">
) => {
  const alert = withReactContent(Swal);
  alert
    .fire({
      title: "Are you sure?",
      text: "You want to send request to publish",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: `${t("No")}`,
      confirmButtonColor: "rgb(164 132 63 / var(--tw-text-opacity))",
      cancelButtonColor: "#999",
      confirmButtonText: `${t("Yes")}`,
      reverseButtons: true,
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__faster",
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        callBack(id);
      }
    });
};

const bonusOptions = async () => {
  const response = await GetAllBonusType("");
  if (response?.data?.responseData) {
    const result = response?.data?.responseData?.data;
    let responseArray: Option[] = [];
    responseArray = result.map((data: IBonusTypeData) => {
      return {
        label: `${data?.code} - ${data?.timesheetName}`,
        value: data?.code,
        type: true,
      };
    });
    responseArray.unshift({
      value: "CLEARCB",
      label: "  - Clear Custom Bonus",
    });
    return responseArray;
  } else {
    return [];
  }
};

export const activeModelProfile = {
  addFiles: "Add Files",
  deleteFiles: "Delete Files",
  updateFiles: "Update Files",
  editProfile: "Edit Profile",
  editFile: "Edit File",
  terminateEmp: "Terminate Employee",
  reactivateEmp: "Reactivate Employee",
  deleteEmp: "Delete Employee",
};

export const presenceOptions: Option[] = [
  { value: "P", label: "P - Présence", type: false },
  { value: "TR", label: "TR - Training", type: false },
  { value: "AP", label: "AP - Absence Payée", type: false },
  { value: "CA", label: "CA - Congé Annuel", type: false },
];

export const absenceOptions: Option[] = [
  { value: "CS", label: "CS - Congé Sans Solde", type: false },
  // { value: "CR", label: "CR - Congé Récupèration", type: false },
  { value: "A", label: "A - Absence non payée", type: false },
  { value: "M", label: "M - Maladie", type: false },
  { value: "CE", label: "CE - Congé Exceptionnel", type: false },
];

export const DaysBonusOptions: Option[] = [
  { value: "CLEARDB", label: "  - Clear Days Bonus", type: true },
  { value: "W", label: "W - Weekend Bonus", type: true },
  { value: "O1", label: "O1 - Overtime 1 day", type: true },
  { value: "O2", label: "O2 - Overtime 2 days", type: true },
];

export const groupedOptions = async (isIncludeCR?: boolean, isBonus = true) => {
  let customBonus: Option[] = [];
  if (isBonus) {
    customBonus = await bonusOptions();
  }
  const resp = [
    {
      label: "Daily Cost",
      options: [
        ...presenceOptions,
        ...(isIncludeCR
          ? [...absenceOptions]
          : [...absenceOptions.filter((option) => option.value !== "CR")]),
        { value: "CLEARFIELDTOP", label: " -  Clear Field" },
      ],
    },
    {
      label: "Days Bonus",
      options: DaysBonusOptions,
    },
  ];

  if (isBonus) {
    resp.push({
      label: "Custom Bonus",
      options: customBonus,
    });
  }

  return resp;
};

export const employeeLeaveTypeOptions = [
  // { value: "AP", label: "AP -Absence Payée" },
  // { value: "CA", label: "CA -Congé Annuel" },
  // { value: "CS", label: "CS -Congé Sans Solde" },
  { value: "CR", label: "CR -Congé Récupèration" },
  // { value: "A", label: "A -Absence non payée" },
  // { value: "M", label: "M -Maladie" },
  // { value: "CE", label: "CE -Congé Exceptionnel" },
];

export const presentStatus = ["P", "TR"];

export const leaveStatus = ["CR"];

export const absentStatus = ["AP", "CA", "CS", "A", "M", "CE"];

export const bonusStatus = ["P,W", "P,O1", "P,O2"];

export const hourlyOvertimeBonus = [
  "P,DAILY",
  "P,NIGHT",
  "P,HOLIDAY",
  "CHB,DAILY",
  "CHB,NIGHT",
  "CHB,WEEKEND",
  "CHB,HOLIDAY",
  "W,WEEKEND",
  "W,NIGHT",
];

export const hourlyOvertimeBonusTypes = [
  "DAILY",
  "NIGHT",
  "HOLIDAY",
  "WEEKEND",
];

export const employeeFormSections = [
  "Personal Information",
  "Work Information",
  "Salary Information",
  "Bonus Information",
];
