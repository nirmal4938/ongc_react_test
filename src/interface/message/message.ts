import { ILoginUser, ILoginUserData } from "../user/userInterface";

export interface IMessageData {
  id?: number;
  employeeId?: number;
  clientId?: number;
  segmentId?: number;
  message: string;
  status: boolean;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
  messageDetail?: IMessageDetail[];
}

export interface ISalaryMessageData {
  id?: number;
  employeeId?: number;
  clientId?: number;
  segmentId?: number;
  message: string;
  bonusPrice: number | null;
  email: string;
  managerUserId?: number | null;
  monthlySalary: number;
  phone: string;
  salaryDate: Date | string;
  total: number;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
  // messageDetail?: IMessageDetail[];
}

export enum IMessageStatus {
  SENT = "SENT",
  DRAFT = "DRAFT",
  ERROR = "ERROR",
}

export enum IImportStatus {
  OK = "OK",
  INFO = "INFO",
}
export interface IMessageDetailById {
  errorMessage?: string | null;
  id?: number;
  status?: IMessageStatus;
  message?: string;
  createdAt?: Date | string;
  employeeId?: number | null;
  messageId?: number;
  segmentId?: null;
  managerUserId?: null;
  employeeDetail?: {
    clientId?: number;
    loginUserId?: number;
    loginUserData?: ILoginUser;
  } | null;
  managerUser?: {
    clientId?: number;
    loginUserId?: number;
    loginUserData?: ILoginUser;
  } | null;
  segmentDetail?: {
    id?: number;
    employee?: {
      loginUserData?: ILoginUser;
    }[];
  } | null;
}
export interface IMessageDetail {
  clientId?: number;
  createdAt?: Date | string;
  createdBy?: number;
  updatedBy?: number;
  id?: number;
  status?: IMessageStatus;
  message?: string;
  messageDetail: {
    employeeDetail: {
      id: number;
      clientId?: number;
      loginUserData?: ILoginUserData;
    };
    managerUser?: {
      clientId: number;
      loginUserId: number;
      loginUserData: ILoginUser;
    } | null;
    segmentDetail?: {
      id?: number;
      employee?: {
        loginUserData?: ILoginUser;
      }[];
    } | null;
  }[];
}

export interface IMessageSalaryDetail {
  clientId?: number;
  createdAt?: Date | string;
  createdBy?: number;
  updatedBy?: number;
  id?: number;
  message?: string;
  employeeDetail?: {
    id: number;
    clientId?: number;
    loginUserData?: ILoginUserData;
  } | null;
  managerUser?: {
    clientId: number;
    loginUserId: number;
    loginUserData: ILoginUser;
  } | null;
}
export interface IInitialMessageData {
  id?: number;
  employeeId?: string[];
  clientId?: number;
  segmentId?: string[];
  managerId?: string[];
  allCheck?: boolean;
  message: string;
  isSchedule: boolean;
  scheduleDate?: Date | null;
}
export interface IInitialSalaryMessageData {
  id?: number;
  employeeId?: number[];
  segmentId?: number[];
  clientId?: number;
  managerId?: number[];
  allCheck?: boolean;
  message: string;
  salaryMonth: string;
  isSchedule: boolean;
  scheduleDate?: Date | null;
  messageData?: {
    segmentId: number;
    name?: string;
    email?: string;
    phone?: string;
    monthlySalary?: number | null;
    bonusPrice?: number | null;
    total?: number | null;
    salaryDate?: Date | null;
    id: string;
    roleId: string;
  }[];
}
