import { GroupOption } from "@/interface/customSelect/customSelect";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import { GetEmployeeData } from "@/services/employeeService";
import saveAs from "file-saver";
import moment from "moment";

export const FormatDate = (date: string | Date) => {
  if (!date) return "-";
  return moment(new Date(date)).format("DD/MM/YYYY");
};

export function convertBytes(size: number) {
  const units = ["bytes", "kb", "mb", "gb"];
  let index = 0;
  while (size >= 1024 && index < 3) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}
export function commaWithNumber(item: number) {
  let formattedNumber = item.toLocaleString();
  formattedNumber = formattedNumber.replace(/,/g, " ");
  formattedNumber = formattedNumber.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  return formattedNumber;
}

export function dateToExperience(date: string) {
  const today = new Date();

  const [year, month] = date.split("-");

  let diffYear = today.getFullYear() - Number(year);
  let diffMonth = today.getMonth() - Number(month) + 1;

  if (diffMonth < 0) {
    diffYear--;
    diffMonth += 12;
  }
  // Return the result as a string
  return `${diffYear} an et ${diffMonth} mois de plus`;
}

export async function setEmployeeDropdownOptions(
  clientId: number,
  isTerminatatedEmployee?: boolean
) {
  let listData: GroupOption[] = [];
  const res = await GetEmployeeData(
    `?clientId=${clientId}&isTerminatatedEmployee=${
      (isTerminatatedEmployee && "true") || "false"
    }`
  );
  if (res?.data?.responseData) {
    const result = res?.data?.responseData;
    if (result?.data) {
      const employeeData: IEmployeeData[] = result.data;
      const empData = new Map();
      for (const employee of employeeData) {
        if (employee.segment) {
          const segmentName = employee.segment
            ? employee.segment.name
            : "OTHERS";
          if (!empData.has(segmentName)) {
            empData.set(segmentName, []);
          }
          empData.get(segmentName).push(employee);
        }
      }

      const empDropdownData = [];
      for (const [segment, employees] of empData) {
        empDropdownData.push({ segment, employees });
      }
      empDropdownData.sort((a, b) => {
        if (a.segment === "OTHERS") return -1;
        if (b.segment === "") return 1;
        return a.segment.localeCompare(b.segment);
      });
      listData = empDropdownData?.map((val) => {
        return {
          label: val?.segment,
          options: val?.employees?.length
            ? val?.employees?.map((empData: IEmployeeData) => {
                return {
                  label:
                    empData?.employeeNumber +
                    " " +
                    empData?.loginUserData?.lastName +
                    " " +
                    empData?.loginUserData?.firstName,
                  value: empData?.id ? empData?.id : 0,
                };
              })
            : [],
        };
      });
    }
  }
  return listData;
}

export const generateRandomCode = () => {
  const length = 6;
  const numDigits = 3;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomCode = "";

  // Ensure at least three digits are included
  for (let i = 0; i < numDigits; i++) {
    randomCode += Math.floor(Math.random() * 10);
  }

  // Generate the remaining characters
  for (let i = numDigits; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }

  // Shuffle the characters
  randomCode = randomCode
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return randomCode;
};

export const generateInvoiceNumber = (
  serviceMonth: string | undefined,
  clientCode: string | number
) => {
  const month = moment(serviceMonth).format("MMMM");
  const year = moment(serviceMonth).format("YYYY");

  const invoiceNo = `${Math.floor(
    Math.random() * 100000
  )}/${month.toLocaleUpperCase()}${year}/${clientCode}`;
  return invoiceNo;
};

// Example usage

export const replaceStringToArray = (value: string) => {
  return value ? value.replaceAll(", ", ",").split(",") : [];
};

export const setDefaultWithZero = (value: number | string | undefined) =>
  value ?? 0;

export const setDefaultWithDash = (value: string | null | number | undefined) =>
  value ?? "-";

export const handleDownload = async ({
  blob,
  PDFExportFileName,
  setExportFlag,
}: {
  blob: Blob;
  PDFExportFileName: string;
  setExportFlag: (value: React.SetStateAction<boolean>) => void;
}) => {
  setExportFlag(false);
  const blobD = new Blob([blob], { type: "application/pdf" });
  const reader = new FileReader();
  reader.onloadend = () => {
    saveAs(blobD, PDFExportFileName);
  };
  reader.readAsDataURL(blobD);
};
