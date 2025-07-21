import { IClientResponseData } from "../client/clientInterface";
import { IEmployeeData } from "../employee/employeeInterface";
import { ISubSegmentData } from "../subSegment/subSegmentInterface";

export interface ISegmentData {
  id?: number;
  code: string;
  name: string;
  costCentre: string | null;
  contactId?: number | null;
  fridayBonus: number | null;
  saturdayBonus: number | null;
  overtime01Bonus: number | null;
  overtime02Bonus: number | null;
  timeSheetStartDay?: number | null;
  vatRate: number | null;
  xeroFormat: number | null;
  clientId: number | null;
  createdBy?: number;
  createdAt?: Date | string;
  updatedBy?: number;
  updatedAt?: Date;
  deletedAt?: Date;
  employee?: IEmployeeData[];
  client?: IClientResponseData;
  subSegmentList?: ISubSegmentData[];
  isActive?: boolean;
}
