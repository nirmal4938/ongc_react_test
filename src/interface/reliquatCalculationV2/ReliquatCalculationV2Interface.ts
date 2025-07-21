import { IEmployeeData } from "../employee/employeeInterface";

export interface IReliquatCalculationV2Data {
  index?: number;
  startDate: string;
  endDate: string;
  rotationName: string;
  segmentName: string;
  date?: string;
  segment?: string;
  rotation?: string;
  presentDay?: number;
  worked?: number;
  taken?: number;
  earned?: number | string;
  reliquatValue?:number|string
  reliquatPayment?: number;
  earnedTaken?: number | string;
  overTime?: number;
  weekendOvertime?: number;
  adjustment?: number;
  reliquat?: number | string;
  employee: IEmployeeData;
}
