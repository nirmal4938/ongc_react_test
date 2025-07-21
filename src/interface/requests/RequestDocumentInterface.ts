import { IClientResponseData } from "../client/clientInterface";
import { IEmployeeData } from "../employee/employeeInterface";
import { IRequestTypeData } from "../requestType/requestTypeInterface";
import { IUserData } from "../user/userInterface";

export enum DeliveryType {
  COLLECTION = "COLLECTION",
  DELIVERY = "DELIVERY",
}

export enum Status {
  NEW = "NEW",
  STARTED = "STARTED",
  DECLINED = "DECLINED",
  COMPLETED = "COMPLETED",
}

export interface IRequestSummaryData {
  id?: number;
  name?: string;
  clientId?: number;
  contractNumber?: string;
  mobileNumber?: string;
  employeeId?: number;
  contractId?: number;
  email?: string;
  emailDocuments?: boolean;
  deliveryType?: DeliveryType;
  collectionDelivery?: DeliveryType;
  documentTotal?: number;
  deliveryDate?: Date | null;
  status?: Status;
  requestDocument?: IRequestDocumentData[];
  reviewedBy?: number;
  reviewedDate?: Date | string;
  client?: IClientResponseData;
  employee?: IEmployeeData;
  reviewedByUser?: IUserData;
  createdByUser?: IUserData;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}

export interface IRequestDocumentData {
  id?: number;
  requestId?: number;
  documentType: number | null;
  otherInfo: string;
  status?: string | null;
  completedBy?: number;
  completedByUser?: IUserData;
  completedDate?: Date;
  documentTypeData?: IRequestTypeData;
}
