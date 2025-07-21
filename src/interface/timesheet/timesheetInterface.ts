import { IEmployeeData } from "../employee/employeeInterface";
import { IRotationData } from "../rotation/rotationInterface";
import { ISegmentData } from "../segment/segmentInterface";
import { ISubSegmentData } from "../subSegment/subSegmentInterface";
import { ITimesheetScheduleData } from "./timesheetScheduleInterface";

export enum TimesheetHOBBonusType {
  // DAILY = "D",
  // NIGHT = "N",
  // WEEKEND = "W",
  // HOLIDAY = "H",
  DAILY = "DAILY",
  NIGHT = "NIGHT",
  WEEKEND = "WEEKEND",
  HOLIDAY = "HOLIDAY",
}
export interface ITimesheetData {
  id?: number;
  clientId?: number | null;
  segmentId?: number | null;
  subSegmentId?: number | null;
  employeeId?: number | null;
  totalDays?: Date | null;
  status?: string;
  approvedAt?: Date | null;
  startDate?: Date;
  endDate?: Date;
  segment?: ISegmentData;
  subSegment?: ISubSegmentData;
  approvedBy?: number | null;
  createdBy?: number;
  updatedBy?: number | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date;
}

export interface TimesheetDataDropdown {
  id: number;
  employeeName: string | null;
  employee: IEmployeeData;
  dateRange: string;
  startDate: string;
  endDate: string;
  status: string;
  segmentName: string | null;
  segment: { name: string; id: number };
  subSegmentName: string | null;
  subSegment: { name: string; id: number; segment: { name: string } };
}

export interface ITimeSheetEmployeeData {
  id: number;
  medicalCheckDate: string;
  medicalCheckExpiry: null | string;
  fonction: string;
  employeeNumber: string;
  dailyCost: number;
  customBonus: {
    data?: {
      id?: number;
      label?: string;
      price?: number;
      coutJournalier?: number;
    }[];
  };
  timeSheetSchedule: {
    employeeId: number;
    status: string;
    date: string;
  }[];
  reliquatCalculation: {
    reliquat: number;
    presentDay: number;
    leave: number;
    overtime: number;
  }[];
  loginUserData: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ITimesheetPdfData {
  timesheetData: {
    segmentId: number | null;
    subSegmentId: number | null;
    employeeId: number;
    startDate: string;
    endDate: string;
    clientId: number;
    timesheetId: number;
    timesheetLogsData?: {
      id: number;
      actionBy: number;
      actionDate: string;
      status: string;
      actionByUser: {
        id: number;
        loginUserId: number;
        loginUserData: {
          firstName: string | null;
          lastName: string | null;
          name: string;
        };
      };
    }[];
    employee: {
      id: number;
      loginUserData: {
        firstName: string;
        lastName: string;
      };
    };
    client: {
      id: number;
      loginUserData: {
        name: string;
      };
    };
    segment?: {
      id: number;
      name: number;
    };
    subSegment?: {
      id: number;
      name: number;
    };
  };
  employeeData: {
    id: number;
    medicalCheckDate: string;
    medicalCheckExpiry: string;
    fonction: string;
    employeeNumber: string;
    dailyCost: number;
    client: {
      country: string;
      stampLogo: string | null;
      weekendDays?: string;
      isShowPrices: boolean;
    };
    customBonus: {
      data?: {
        id?: number;
        label?: string;
        price?: number;
        coutJournalier?: number;
      }[];
    };
    timeSheetSchedule: {
      employeeId: number;
      status: string;
      date: string;
    }[];
    reliquatCalculation?: {
      reliquat: number;
      presentDay: number;
      leave: number;
      overtime: number;
    }[];
    loginUserData: {
      firstName: string;
      lastName: string;
      email: string;
    };
    employeeRotation?: {
      rotationId: number;
      rotation: {
        isResident: boolean;
        name: string;
        weekOn: number;
        weekOff: number;
      };
    }[];
    rotation?: IRotationData;
  };
  employeeCost: {
    totalPresentDays: number;
    dailyCost: number;
    bonusTotal: number;
    totalCost: number;
  };
  allMonthData: {
    status: string;
    isLeaveForTitreDeConge: boolean;
    bonusCode: string | null;
    date: string;
  }[];
  statusArr: {
    key: string;
    title: string;
    value: string;
  }[];
  status: string[];
  statusPdf: string[];
  statusCounts: number[];
  statusPdfCounts: number[];
  bonusCount?: {
    bonusName: string;
    bonusType: string;
    length: number;
    basePrice: number;
  }[];
  finalTotalCount: number;
  presentValue: number;
  CRValue: number;
  overtimeWeekendBonus: {
    label: string;
    title?: string;
    length: number;
  }[];
  isHourlyBonusNote?: boolean;
}

export interface ITimesheetScheduleTableData {
  count: number;
  employeeDetails: IEmployeeData;
  rows: ITimesheetScheduleData[];
  totalReliquat: number;
  totalBonusCount: number;
}
