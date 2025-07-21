import { transportSummaryEnum } from "@/enum/transport";

export interface ISummaryData {
  id?: string;
  name?: string;
  clientId?: number;
  type?: transportSummaryEnum;
  value?: string;
}

export interface IVehicleData {
  id: number;
  vehicleNo: string;
  year: number;
  typeId: number;
  modelId: number;
  capacity: string;
  clientId: number;
  createdBy: number;
  models: {
    name: string;
  };
  type: { name: string };
}
export interface IVehicleDocument {
  folderId: string;
  documentName: string;
  documentPath: string;
  issueDate: Date | null;
  expiryDate: Date | null;
}

export interface IDriverData {
  id: string;
  driverNo: string;
  firstName: string;
  lastName: string;
  positionId: number;
  companyStart: string;
  experienceStart: string;
  clientId: number;
  createdBy: number;
  createdAt: string;
  position: {
    name: string;
  };
}

export interface IDriverInitialData {
  driverNo: string;
  firstName: string;
  lastName: string;
  positionId: string;
  companyStart: Date | null;
  experienceStart: Date | null;
}

export interface IDriverDocument {
  folderId: string;
  documentName: string;
  documentPath: string;
  issueDate: Date | null;
  expiryDate: Date | null;
}

export interface IRequestData {
  id: string;
  source: string;
  startDate: string;
  destination: string;
  destinationDate: string;
  status: string;
  clientId: number;
  createdBy: number;
  createdAt: string;
  createdByUser: {
    email: string;
  };
}

export interface IAddUpdateRequest {
  source: string;
  startDate: null | Date;
  destination: string;
  destinationDate: Date | null;
}

export interface DocumentCellProps {
  documentName: string;
  documentPath: string;
}
