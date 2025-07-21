export interface IRotationData {
  id?: number;
  name?: string;
  weekOn?: number | null;
  weekOff?: number | null;
  description?: string;
  isResident?: boolean;
  daysWorked?: string;
  isAllDays?: boolean;
  isWeekendBonus?: boolean;
  isOvertimeBonus?: boolean;
  clientId?: number;
  client?: { name: string };
  createdByUser?: { name: string };
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}
