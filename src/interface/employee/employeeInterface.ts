import { IClientData } from "../client/clientInterface";
import { IContractSummaryData } from "../contractSummary/contractSummary";
import { IContractTemplateData } from "../contractTemplate/contractTemplate";
import { IMedicalRequestData } from "../medicalRequest/MedicalRequestInterface";
import { IReliquatAdjustmentData } from "../reliquatAdjustment/reliquatAdjustmentInterface";
import { IReliquatPaymentData } from "../reliquatPayment/reliquatPaymentInterface";
import { IReliquatVersionCalculationData } from "../reliquatVersion/reliquatVersion";
import { IRotationData } from "../rotation/rotationInterface";
import { ISubSegmentData } from "../subSegment/subSegmentInterface";
import { ITimesheetData } from "../timesheet/timesheetInterface";
import { ILoginUserData } from "../user/userInterface";

export interface IEmployeeContractEndData {
  employeeDetail?: IEmployeeData;
  employeeNumber?: string;
  contractNumber?: string | number | null;
  fonction?: string;
  contractEndDate?: Date | null;
  segment?: ISubSegmentData;
  subSegment?: ISubSegmentData;
  employeeContracts?: IContractSummaryData[];
  rotation?: IRotationData;
  loginUserData?: ILoginUserData;
  endDate?: Date | null;
  contractTemplate?: IContractTemplateData;
}

export interface exportData {
  segmentName?: string;
  matricule?: string;
  contractNumber?: string | number;
  segment?: string | null;
  subSegment?: string;
  surname?: string;
  forename?: string;
  contractEndDate?: string;
  startDate?: string;
  terminationDate?: string;
  status?: any;
  rotation?: string;
}
export interface IEmployeeData {
  id?: number;
  employeeNumber?: string;
  currencyCode?: string;
  roleData?: {
    name: string;
    id: number;
  };
  reliquatCalculation?: IReliquatVersionCalculationData[];
  empReliquatCalculation?: number | null;
  reliquatCalculationValue?: number | null;
  TempNumber?: string;
  contractNumber?: number | string | null;
  contractSignedDate?: Date | null;
  employeeTimesheetStatus?: boolean;
  startDate?: Date | null;
  latestStartDate?: Date | null;
  firstName: string;
  lastName: string;
  fonction?: string;
  dOB?: Date | null;
  placeOfBirth?: string;
  timezone: string;
  nSS?: string;
  gender: string;
  rollover?: boolean;
  profilePicture?: string | null;
  terminationDate?: Date | null;
  baseSalary?: number;
  salaryDate?: Date | null;
  travelAllowance?: number;
  Housing?: number;
  monthlySalary?: number;
  address?: string;
  medicalCheckDate?: Date | null;
  medicalCheckExpiry?: Date | null;
  medicalInsurance?: boolean | null;
  contractEndDate?: Date | null;
  dailyCost?: number;
  mobileNumber?: string;
  nextOfKinMobile?: string;
  initialBalance?: number;
  photoVersionNumber?: number;
  email?: string;
  clientId: string | number;
  client?: IClientData;
  segmentId?: number | null;
  subSegmentId?: number | null;
  segment?: ISubSegmentData;
  subSegment?: ISubSegmentData;
  timeSheet?: ITimesheetData[];
  overtime01Bonus?: number | null;
  weekendOvertimeBonus?: number | null;
  overtime02Bonus?: number | null;
  employeeContracts?: IContractSummaryData[];
  reliquatPayment?: IReliquatPaymentData[];
  reliquatAdjustment?: IReliquatAdjustmentData[];
  rotation?: IRotationData;
  employeeRotation?: {
    date: string | null;
    id: number;
    rotation: { name: string; id: number; isResident: boolean };
  }[];
  employeeSegment?: {
    date: string | null;
    id: number;
    segment: {
      name: string;
      id: number;
    };
  }[];
  employeeCatalogueNumber?: {
    startDate: string | null;
    id: number;
    catalogueNumber: string;
  }[];
  employeeBonus?: {
    id: string;
    coutJournalier: number;
    price: number;
    catalogueNumber?: number;
    startDate: Date;
    endDate: Date | null;
    bonus: {
      id: number;
      name: string;
      code: string;
    };
  }[];
  employeeSalary?: { startDate: string | null }[];
  rotationDate?: Date | null;
  segmentDate?: Date | null;
  medicalRequest?: IMedicalRequestData;
  rotationId?: number | null;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
  loginUserId?: number;
  slug?: string;
  loginUserData?: ILoginUserData;
  timesheet?: ITimesheetData[];
  //TODO remove any here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customBonus?: any | string | string[];
  catalogueNumber?: string | null;
  isAdminApproved?: boolean | null;
  isAbsenseValueInReliquat?: boolean | null;
  employeeStatus: "SAVED" | "DRAFT";
  hourlyRate: number | null;
  reliquatDate?: string | null;
}

export interface IViewEmployeeData {
  id: number;
  loginUserId: number;
  slug: string;
  employeeNumber: string;
  TempNumber: null | number;
  contractNumber: null | number;
  contractSignedDate: null | string;
  startDate: string;
  fonction: string;
  nSS: string;
  terminationDate: null | string;
  baseSalary: number | null;
  travelAllowance: number | null;
  Housing: number | null;
  monthlySalary: number | null;
  address: string;
  medicalCheckDate: string | null;
  medicalCheckExpiry: null | string;
  medicalInsurance: null | boolean;
  contractEndDate: null | string;
  dailyCost: number;
  nextOfKinMobile: string;
  initialBalance?: number;
  photoVersionNumber: number;
  clientId: number;
  segmentId: number;
  subSegmentId: number;
  rotationId: number;
  loginUserData: {
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    placeOfBirth: string;
    email: string;
    phone: string;
    profileImage: string;
  };
  segment: {
    name: string;
    id: number;
  };
  subSegment: {
    name: string;
    id: number;
  };
  rotation: {
    name: string;
    id: number;
  };
  employeeContract: [];
}
